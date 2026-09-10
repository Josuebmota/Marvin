#!/usr/bin/env node
/**
 * marvin — monta a arquitetura de conhecimento de um projeto.
 *
 * A SAÍDA do script é em inglês (o repo é público); comentário e template, em português.
 *
 * Rode DE DENTRO da raiz do projeto:
 *     marvin --help       ← sai sem escrever nada
 *     marvin --dry-run    ← mostra o plano, não escreve
 *     marvin
 *     marvin --tools=claude,codex
 *     marvin --clean-legacy
 *     marvin --no-git
 *     marvin --graphify
 *
 * A arquitetura:
 *
 *     <projeto>/
 *     ├── AGENTS.md               fonte de verdade — lida por QUALQUER ferramenta
 *     ├── CLAUDE.md               só o que é específico do Claude Code
 *     ├── .claude/
 *     │   ├── agents/             o time (tu escreve)
 *     │   ├── skills/             procedimentos compartilhados (tu escreve)
 *     │   └── commands/retomar.md porta de entrada: /retomar num chat novo
 *     └── .marvin/                ← base de conhecimento
 *         ├── 00_Inicio.md        (o nome diz de quem é a pasta: ela é material de
 *         ├── 00_Fontes_Externas.md   trabalho, não entregável do projeto; se já
 *         │                           existir um vault em Docs/, ele é reaproveitado)
 *         ├── 08_Memoria/             ← memória, ARQUIVOS REAIS versionados
 *         │   └── onde_paramos.md     a única porta; sempre sobrescrita
 *         └── 99_Backup/
 *
 * PORTABILIDADE: o durável (AGENTS.md + .marvin/ + memória) é markdown puro e migra
 * inteiro para Codex, Cursor, Aider, Zed, opencode. Só o frontmatter dos agentes,
 * os slash commands e o auto-load da memória são do Claude Code — e desses, só o
 * auto-load some: os arquivos de memória ficam, porque moram no repositório.
 *
 * O truque central é a JUNCTION INVERTIDA:
 *
 *     ~/.claude/projects/<caminho>/memory  ──junction──►  .marvin/08_Memoria/
 *
 * O Claude escreve no caminho padrão dele e os arquivos nascem dentro do
 * repositório. Memória em markdown puro no repositório, uma fonte só.
 *
 * O que ele NÃO faz — de propósito:
 *   Não escreve os agentes nem o CLAUDE.md. Isso exige conhecer as armadilhas
 *   do projeto, e agente genérico é pior que agente nenhum. Use o prompt de
 *   acompanhamento: https://github.com/Josuebmota/Marvin/blob/main/PROMPT.md
 *
 * Projeto que veio de outra ferramenta (claude-flow/ruflo, etc.) tem uma etapa
 * extra de limpeza — ela só aparece se o script detectar os artefatos.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';
import readline from 'node:readline/promises';

const RAIZ = process.cwd();

// Flags em inglês (o repo é público). Os nomes antigos em português continuam
// valendo como alias: renomear flag sem alias quebraria quem já tem script ou
// alias montado — que é exatamente a retrocompatibilidade que o passo 10 defende.
const temFlag = (...nomes) => nomes.some(n => process.argv.includes(n));
const LIMPAR = temFlag('--clean-legacy', '--limpar-legado', '--limpar-ruflo');
const SEM_GIT = temFlag('--no-git', '--sem-git');
// Mostra tudo o que faria e não escreve nada — nem arquivo, nem junction, nem git init.
const DRY = temFlag('--dry-run');
// Opcional e nunca obrigatório: gera o grafo de código do graphify para consulta
// estrutural. NÃO instala hook — ver o passo 8b para o porquê.
const GRAPHIFY = temFlag('--graphify');
// Nomeia as comunidades usando o `claude` do PATH (backend claude-cli do graphify,
// que não pede chave). Fora do padrão de propósito: esse backend é forçado a UMA
// chamada por vez, então num grafo de ~130 comunidades o run vira minutos e consome
// cota da assinatura de quem rodou. Gastar tempo e cota sem perguntar não é padrão.
const GRAPHIFY_LABEL = temFlag('--graphify-label');
// Refaz o grafo mesmo que já exista. Sem isso, rodar duas vezes não reconstrói
// (invariante 2). Existe porque num monorepo `graphify update .` NÃO serve: ele
// re-extrai só a raiz, e a raiz é justamente o que não tem o código dentro.
const GRAPHIFY_REBUILD = temFlag('--graphify-rebuild');
// Escreve `.git/hooks/post-commit` para o grafo se atualizar sozinho depois do commit.
// NÃO usa o `graphify hook install`: aquele reconstrói a RAIZ do repositório, que num
// monorepo é justamente o caminho que apaga os sub-repos do grafo — automatizaria o bug.
// Fora do padrão porque hook mora em `.git/`, não é versionado e dispara invisível.
const GRAPHIFY_GIT_HOOK = temFlag('--graphify-git-hook');
// Só diagnostica a montagem e sai com código != 0 se ela estiver quebrada.
// Não escreve nada — nem no repositório, nem no perfil.
const CHECK = temFlag('--check');

// --tools=claude,codex,cursor  (default: claude)   [alias: --ferramentas=]
// Rodar de novo com outra lista ACRESCENTA o adaptador que falta; nada é removido.
const FERRAMENTAS_VALIDAS = ['claude', 'codex', 'copilot', 'cursor', 'aider', 'zed', 'opencode'];
const argFerr = process.argv.find(a => a.startsWith('--tools=') || a.startsWith('--ferramentas='));
const FERRAMENTAS = (argFerr ? argFerr.split('=').slice(1).join('=') : 'claude')
  .split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
const ferrInvalidas = FERRAMENTAS.filter(f => !FERRAMENTAS_VALIDAS.includes(f));

const log = (s = '') => console.log(s);
const ok = (s) => log('  \x1b[32m✓\x1b[0m ' + s);
const warn = (s) => log('  \x1b[33m!\x1b[0m ' + s);
const err = (s) => log('  \x1b[31m✗\x1b[0m ' + s);
const info = (s) => log('    ' + s);

// ── --help / -h. Sai ANTES de qualquer coisa: um script que escreve no repo e
// cria link no perfil do usuário não pode montar o projeto quando alguém digita
// a flag que todo mundo usa para "ver o que isso faz".
if (temFlag('--help', '-h')) {
  log(`
marvin — scaffolds a project's knowledge base for working with AI agents.

Run it FROM the project root:
    marvin [flags]                      after  npm i -g marvin-kb
    npx marvin-kb [flags]               without installing
    node <path>/marvin.mjs [flags]      from a clone

Flags:
  --tools=<list>    adapters to generate. Default: claude
                    valid: ${FERRAMENTAS_VALIDAS.join(', ')}
                    running again with a different list ADDS what is missing
  --check           diagnose the memory mount and exit non-zero if it is broken.
                    Writes nothing. Use it after moving or renaming the project
  --dry-run         print everything it would do, write nothing
  --no-git          skip git init and .gitignore
  --clean-legacy    remove leftovers from old orchestration tools
  --graphify        build a code graph for structural queries (needs graphify on PATH)
                    indexes gitignored sub-repos separately and merges them, so a
                    monorepo does not end up with a graph missing all of its code
  --graphify-label  name the graph communities using the \`claude\` CLI on PATH.
                    Off by default: one call at a time, so it costs minutes and quota
  --graphify-rebuild  rebuild an existing graph (the default never overwrites one)
  --graphify-git-hook  write .git/hooks/post-commit so the graph refreshes itself.
                    Never overwrites a post-commit you already have
  --help, -h        this message

What it writes:
  <project>/AGENTS.md, the tool adapters, .claude/{agents,skills,commands},
  and a knowledge base (.marvin/ or an existing Docs/).

What it touches OUTSIDE the project:
  ~/.claude/projects/<path>/memory  becomes a junction pointing INTO the repo,
  so agent memory is versioned in git instead of living in your user profile.
  Existing notes are copied and counted before anything is removed.

Use --dry-run first if you want to see all of that before it happens.

Docs: README.md (English) · README.pt-BR.md (Português)
`);
  process.exit(0);
}

// ── --dry-run. Toda operação que MUDA o disco passa por `fsw` / `exec`; leitura
// continua em `fs` direto. Escrita nova que não passe por aqui faz o dry-run
// mentir — e dry-run que mente é pior que não ter dry-run.
const plano = [];
const rel = (p) => {
  const s = String(p);
  const r = path.relative(RAIZ, s);
  if (!r) return '.';                 // o próprio diretório do projeto
  if (r.startsWith('..')) return s;   // FORA do projeto: absoluto é mais honesto que ../../..
  return r;
};
const fsw = !DRY ? fs : {
  // `mkdirSync` roda com recursive:true em diretório que quase sempre já existe, e
  // nesse caso a execução real não cria nada. Listar assim mesmo enchia o plano de
  // linhas falsas — num projeto já montado o dry-run anunciava 9 operações e a
  // mensagem "nothing to do" era inalcançável. Plano que exagera é a mesma doença
  // do plano que esconde: os dois fazem você parar de ler.
  mkdirSync:      (p) => { if (!fs.existsSync(p)) plano.push('create dir    ' + rel(p)); },
  writeFileSync:  (p) => plano.push('create file   ' + rel(p)),
  appendFileSync: (p) => plano.push('append to     ' + rel(p)),
  cpSync:         (a, b) => plano.push('copy          ' + a + '  →  ' + rel(b)),
  rmSync:         (p) => plano.push('REMOVE        ' + p),
  // Só o LINK, nunca o conteúdo — é a diferença que o AGENTS.md repete e que o
  // plano precisa mostrar com essas palavras, senão quem lê o dry-run se assusta.
  unlinkSync:     (p) => plano.push('remove link   ' + p + '  (only the link)'),
  symlinkSync:    (alvo, link) => plano.push('junction      ' + link + '  →  ' + rel(alvo)),
  copyFileSync:   (a, b) => plano.push('copy          ' + rel(a) + '  →  ' + rel(b)),
};
const exec = (cmd, opts) => {
  if (DRY) { plano.push('run           ' + cmd); return ''; }
  return execSync(cmd, opts);
};

// memória nativa: cwd com : \ / virando -
const MEM = path.join(os.homedir(), '.claude', 'projects', RAIZ.replace(/[:\\/]/g, '-'), 'memory');

// ── Onde fica o vault e a memória. É só LEITURA, e mora aqui em cima porque o
// --check precisa das duas antes de qualquer escrita acontecer.
// Prefere um vault que JÁ existe (identificado pelos marcadores), senão `.marvin`.
// O nome diz de quem é a pasta: na maioria dos repositórios ela é MATERIAL DE
// TRABALHO de quem usa a ferramenta, não entregável do projeto. `.docs` genérico
// sugeria o contrário. `.docs` segue na lista para que projeto montado pela versão
// antiga continue sendo reconhecido — a detecção é por marcador, não por nome, e
// por isso trocar o padrão NÃO exige migrar ninguém (invariante 2).
const CANDIDATOS = ['.marvin', '.docs', 'Docs', 'docs', 'doc'].map(d => path.join(RAIZ, d));
// `.obsidian` continua valendo como marcador de LEITURA: o script não escreve mais
// config de Obsidian, mas quem já tinha um vault seu numa dessas pastas segue sendo
// reaproveitado em vez de ganhar uma segunda base de conhecimento ao lado.
const ehVault = (d) => fs.existsSync(path.join(d, '08_Memoria')) || fs.existsSync(path.join(d, '.obsidian'));
const DOCS = CANDIDATOS.find(ehVault) || path.join(RAIZ, '.marvin');
const DEST = path.join(DOCS, '08_Memoria');
const ehJunction = (p) => { try { return fs.lstatSync(p).isSymbolicLink(); } catch { return false; } };
const contarNotas = (d) => { try { return fs.readdirSync(d).filter(f => f.endsWith('.md')).length; } catch { return 0; } };

log('\n\x1b[1mmarvin\x1b[0m — ' + RAIZ);
log('agent memory: ' + MEM + '\n');

// ── --check. Diagnostica a montagem e sai. Existe porque a junction quebra em
// SILÊNCIO: mover ou renomear a pasta do projeto a deixa apontando para o caminho
// antigo, e no caminho novo o Claude Code cria um diretório vazio de verdade. Tudo
// parece normal, o agente escreve, e nada daquilo chega ao repositório.
//
// Sai com código != 0 de propósito — aviso que só imprime texto é aviso que ninguém
// lê. Assim ele serve em hook, em CI e em alias de shell.
if (CHECK) {
  log('\x1b[1mcheck\x1b[0m — read-only: nothing is written in this mode\n');
  let problemas = 0;
  const falha = (s) => { err(s); problemas++; };

  if (fs.existsSync(DOCS)) ok('vault      ' + path.relative(RAIZ, DOCS));
  else falha('vault      not found — run marvin without --check to create it');

  if (!fs.existsSync(MEM)) {
    falha('junction   missing — the agent memory path does not exist');
    info('the notes, if there are any, are in ' + path.relative(RAIZ, DEST));
  } else if (!ehJunction(MEM)) {
    falha('junction   it is a REAL directory, not a link:');
    info(MEM);
    info('this is what a moved or renamed project folder leaves behind.');
    info('memory written there does NOT reach this repository.');
    info('run marvin without --check to fix it.');
  } else {
    const alvo = fs.readlinkSync(MEM);
    if (path.resolve(alvo) !== path.resolve(DEST)) {
      falha('junction   points somewhere else: ' + alvo);
      info('expected: ' + DEST);
    } else if (!fs.existsSync(DEST)) {
      falha('junction   its target is gone: ' + path.relative(RAIZ, DEST));
    } else {
      ok('junction   profile → ' + path.relative(RAIZ, DEST));
      ok('notes      ' + contarNotas(MEM) + ' visible through the agent path');
    }
  }

  // Junction de OUTRO projeto que ficou apontando para o nada. Não é problema
  // DESTE repositório — por isso avisa e não muda o código de saída —, mas é lixo
  // no perfil que ninguém mais vai olhar, e some do radar justamente quando o
  // projeto muda de lugar.
  const orfas = [];
  try {
    const projetos = path.join(os.homedir(), '.claude', 'projects');
    for (const e of fs.readdirSync(projetos, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const m = path.join(projetos, e.name, 'memory');
      if (!ehJunction(m)) continue;
      let alvo; try { alvo = fs.readlinkSync(m); } catch { continue; }
      if (!fs.existsSync(alvo)) orfas.push([m, alvo]);
    }
  } catch {}
  if (orfas.length) {
    log('');
    warn(orfas.length + ' orphan junction(s) in the profile — the target no longer exists:');
    orfas.forEach(([m, a]) => info(m + '\n      → ' + a));
    info('remove ONLY the link — rm -rf on a junction can follow it and delete the target:');
    info('  [System.IO.Directory]::Delete("<path>", $false)   (PowerShell)');
  }

  log('\n' + (problemas
    ? '\x1b[31m' + problemas + ' problem(s)\x1b[0m — the memory is NOT wired to this repository'
    : '\x1b[32mall good\x1b[0m — memory is wired into the repository') + '\n');
  process.exit(problemas ? 1 : 0);
}

// ═══════════════════════════════════════════ 1. STACK
log('\x1b[1m1. Stack detected\x1b[0m');
const MARCA = {
  'package.json': 'Node/JS', 'tsconfig.json': 'TypeScript', 'requirements.txt': 'Python',
  'pyproject.toml': 'Python', 'go.mod': 'Go', 'Cargo.toml': 'Rust',
  'pom.xml': 'Java/Maven', 'build.gradle': 'Gradle', 'Gemfile': 'Ruby', 'composer.json': 'PHP',
};
const IGNORAR = new Set(['node_modules', 'dist', 'build', 'bin', 'obj', '__pycache__', '.git', 'venv', '.venv']);

// ── Sub-repos ignorados: o caso em que o grafo nascia inútil EM SILÊNCIO.
// Num monorepo cada sub-repositório costuma estar no .gitignore da raiz, porque é
// versionado por conta própria. O graphify respeita .gitignore, então extrair só da
// raiz indexa tudo MENOS o código do produto. Medido num monorepo de quatro sub-repos:
// 2.783 dos 2.854 nós vinham de `.claude/` e ZERO do produto — e nada avisava.
// Sub-repo NÃO ignorado já é varrido junto com a raiz e fica de fora desta lista,
// senão entraria duas vezes no grafo. Só é calculado com --graphify: é uma chamada
// de git por diretório, e sem a flag ninguém usa o resultado.
// Mora aqui em cima porque o CLAUDE.md gerado (passo 7) precisa dele para não
// mandar o agente rodar `graphify update .`, que num monorepo destrói o grafo.
const SUBREPOS = [];
if (GRAPHIFY) {
  try {
    for (const e of fs.readdirSync(RAIZ, { withFileTypes: true })) {
      if (!e.isDirectory() || e.name.startsWith('.') || IGNORAR.has(e.name)) continue;
      if (!fs.existsSync(path.join(RAIZ, e.name, '.git'))) continue;
      // Sai != 0 quando NÃO é ignorado — e também quando não existe git aqui.
      try {
        execSync('git check-ignore -q "' + e.name + '"', { cwd: RAIZ, stdio: 'ignore' });
        SUBREPOS.push(e.name);
      } catch {}
    }
  } catch {}
}

const stacks = new Map();
(function varrer(dir, prof = 0) {
  if (prof > 3) return;
  let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    if (IGNORAR.has(e.name) || (e.name.startsWith('.') && e.isDirectory())) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { varrer(p, prof + 1); continue; }
    const t = MARCA[e.name] || (/\.(csproj|sln)$/.test(e.name) ? '.NET/C#' : null);
    if (t) {
      const rel = path.relative(RAIZ, dir) || '.';
      if (!stacks.has(rel)) stacks.set(rel, new Set());
      stacks.get(rel).add(t);
    }
  }
})(RAIZ);
if (stacks.size) for (const [d, t] of stacks) info(d.padEnd(40) + [...t].join(' + '));
else warn('no stack marker found');

// ── Comandos canônicos. O passo 1 sabia QUAL manifesto existe e nunca o abria: o
// `AGENTS.md` saía com "_(como rodar teste e build)_" para o humano preencher, sendo
// que `scripts` está a um `JSON.parse` de distância. Ler manifesto é FATO, não
// julgamento — cabe ao script (o invariante 4 protege o que exige conhecer o projeto,
// não o que está escrito no disco).
//
// Por que isso importa mais do que parece: agente que adivinha comando roda `npm i`
// num projeto pnpm e suja o lockfile. O gerenciador vem do LOCKFILE, nunca do palpite.
//
// Cada linha carrega a ORIGEM. É o que impede o bloco de envelhecer em silêncio quando
// o manifesto muda: dá para conferir a fonte sem sair do arquivo.
const lerJSON = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };
const temNaRaiz = (n) => fs.existsSync(path.join(RAIZ, n));
const COMANDOS = [];
const poe = (rotulo, comando, origem) => {
  if (comando && !COMANDOS.some(c => c.rotulo === rotulo)) COMANDOS.push({ rotulo, comando, origem });
};

(function detectarComandos() {
  // Node: o gerenciador sai do LOCKFILE. `<pm> install` e `<pm> run <script>` são
  // válidos nos quatro, então uma forma só serve para todos — menos caso especial.
  const pkg = lerJSON(path.join(RAIZ, 'package.json'));
  if (pkg) {
    const pm = temNaRaiz('pnpm-lock.yaml') ? 'pnpm'
      : temNaRaiz('yarn.lock') ? 'yarn'
      : (temNaRaiz('bun.lockb') || temNaRaiz('bun.lock')) ? 'bun'
      : 'npm';
    const lock = pm === 'pnpm' ? 'pnpm-lock.yaml' : pm === 'yarn' ? 'yarn.lock'
      : pm === 'bun' ? 'bun.lock*'
      : temNaRaiz('package-lock.json') ? 'package-lock.json' : 'no lockfile — npm is the default';
    poe('Instalar', pm + ' install', lock);
    const s = (pkg.scripts && typeof pkg.scripts === 'object') ? pkg.scripts : {};
    for (const [rotulo, nomes] of [
      ['Lint', ['lint']], ['Typecheck', ['typecheck', 'type-check', 'tsc']],
      ['Testar', ['test']], ['Build', ['build']], ['Rodar', ['dev', 'start']],
    ]) {
      const achou = nomes.find(n => typeof s[n] === 'string');
      if (achou) poe(rotulo, pm + ' run ' + achou, 'package.json > scripts.' + achou);
    }
  }

  // Python: pytest.ini / tox.ini / [tool.pytest] no pyproject são declaração explícita
  // de que a suíte é pytest. Sem um desses, não inventar o runner.
  const pyproj = temNaRaiz('pyproject.toml');
  let pyprojTxt = '';
  if (pyproj) { try { pyprojTxt = fs.readFileSync(path.join(RAIZ, 'pyproject.toml'), 'utf8'); } catch {} }
  if (temNaRaiz('pytest.ini')) poe('Testar', 'pytest', 'pytest.ini');
  else if (temNaRaiz('tox.ini')) poe('Testar', 'pytest', 'tox.ini');
  else if (/\[tool\.pytest/.test(pyprojTxt)) poe('Testar', 'pytest', 'pyproject.toml > [tool.pytest]');
  if (temNaRaiz('requirements.txt')) poe('Instalar', 'pip install -r requirements.txt', 'requirements.txt');
  else if (pyproj) poe('Instalar', 'pip install -e .', 'pyproject.toml');

  if (temNaRaiz('go.mod')) { poe('Testar', 'go test ./...', 'go.mod'); poe('Build', 'go build ./...', 'go.mod'); }
  if (temNaRaiz('Cargo.toml')) { poe('Testar', 'cargo test', 'Cargo.toml'); poe('Build', 'cargo build', 'Cargo.toml'); }
  if (temNaRaiz('pubspec.yaml')) { poe('Instalar', 'flutter pub get', 'pubspec.yaml'); poe('Testar', 'flutter test', 'pubspec.yaml'); }

  // .NET: o marcador costuma estar em subdiretório — o passo 1 já varreu por isso.
  if ([...stacks.values()].some(t => t.has('.NET/C#'))) {
    poe('Testar', 'dotnet test', '*.csproj / *.sln'); poe('Build', 'dotnet build', '*.csproj / *.sln');
  }

  // Makefile por último: só preenche o que ninguém preencheu antes. `^alvo:` na coluna
  // zero é o que distingue alvo de variável e de linha de receita.
  if (temNaRaiz('Makefile')) {
    let mk = ''; try { mk = fs.readFileSync(path.join(RAIZ, 'Makefile'), 'utf8'); } catch {}
    for (const [rotulo, alvo] of [['Testar', 'test'], ['Build', 'build'], ['Lint', 'lint'], ['Instalar', 'install']])
      if (new RegExp('^' + alvo + '\s*:', 'm').test(mk)) poe(rotulo, 'make ' + alvo, 'Makefile');
  }
})();

if (COMANDOS.length) {
  log('\n\x1b[1m1b. Canonical commands (read from the manifest, not guessed)\x1b[0m');
  for (const c of COMANDOS) info(c.rotulo.padEnd(11) + c.comando.padEnd(34) + '\x1b[2m' + c.origem + '\x1b[0m');
}

// O `AGENTS.md` do passo 7 é um template literal. Montar o bloco AQUI, como string,
// evita crase dentro de crase — que é exatamente como este arquivo se quebrou ao
// escrever esta feature. Array + join deixa cada linha visível no diff.
const BLOCO_COMANDOS = COMANDOS.length ? [
  '## Comandos canônicos',
  '',
  'Use **exatamente** estes — não adivinhe. Agente que adivinha roda `npm install` num',
  'projeto pnpm e suja o lockfile.',
  '',
  '| O quê | Comando | De onde saiu |',
  '|---|---|---|',
  ...COMANDOS.map(c => '| ' + c.rotulo + ' | `' + c.comando + '` | `' + c.origem + '` |'),
  '',
  'A coluna da direita existe para este bloco **não envelhecer em silêncio**: o marvin leu',
  'do manifesto no dia da montagem. Mudou o manifesto, é aqui que se confere.',
  '', '',
].join('\n') : '';
const LINHA_TESTE_BUILD = COMANDOS.length ? '' : '- _(como rodar teste e build)_\n';

// ═══════════════════════════════════════════ 2. DIRETÓRIOS VAZIOS
log('\n\x1b[1m2. Directories that look like a service but are empty\x1b[0m');
log('   (an agent written for an empty folder invents code — this is the warning not to)');
let vazios = 0;
for (const e of fs.readdirSync(RAIZ, { withFileTypes: true })) {
  if (!e.isDirectory() || e.name.startsWith('.') || IGNORAR.has(e.name)) continue;
  const arqs = fs.readdirSync(path.join(RAIZ, e.name));
  if (arqs.length && arqs.every(a => /^(LICENSE|README|\.git.*)/i.test(a))) {
    warn(e.name + ' — only ' + arqs.join(', ')); vazios++;
  }
}
if (!vazios) ok('none');

// ═══════════════════════════════════════════ 3. LIXO NA RAIZ
log('\n\x1b[1m3. Junk in the root\x1b[0m');
log('   (a strangely named file is almost always a malformed shell command)');
// Caractere que o shell interpreta, em QUALQUER posição do nome.
const METACHAR = /[`(){}\[\]!|<>;&$]/;
const ehLixo = (n, vazio) => (
  /^.$/.test(n) ||
  /^[`'"(){}[\],;|&<>~^$]/.test(n) ||
  /^-/.test(n) ||
  /^(nul|NUL|con|CON)$/.test(n) ||
  /\.(tmp|temp|bak|orig|rej|swp)$/i.test(n) ||
  /^~\$/.test(n) ||
  // Os testes acima ancoram no PRIMEIRO caractere e deixavam passar coisas como
  // `0\`` e `!!obj.id)).toBe(true)` — o padrão apareceu num repositório real:
  // sobra de linha de teste que o shell interpretou como redirecionamento.
  // Arquivo de 0 byte com metacaractere no nome é lixo de shell, não conteúdo:
  // nome legítimo vazio com crase ou parêntese praticamente não existe.
  (vazio && METACHAR.test(n))
);
const lixo = fs.readdirSync(RAIZ, { withFileTypes: true })
  .filter(e => e.isFile())
  .filter(e => {
    let vazio = false;
    try { vazio = fs.statSync(path.join(RAIZ, e.name)).size === 0; } catch {}
    return ehLixo(e.name, vazio);
  })
  .map(e => e.name);
if (lixo.length) {
  lixo.forEach(f => warn(JSON.stringify(f) + '  ' + fs.statSync(path.join(RAIZ, f)).size + ' bytes'));
  info('check the contents before deleting — it may be output you actually wanted');
  info('to delete:  rm -f ' + lixo.map(f => JSON.stringify(f)).join(' '));
} else ok('none');

// ═══════════════════════════════════════════ 4. CONTEXTO FIXO
//
// A `description` de todo agente, skill e command entra no prompt de TODA sessão,
// usando ou não. É custo por requisição, não custo de uma vez — e no nível GLOBAL
// você paga em todo projeto. Skill de stack que você não usa é puro peso morto.
//
// O script MEDE e mostra a conta. Ele não diz o que apagar: decidir exige saber
// quais stacks são realmente suas, e isso é do humano (invariante 4).
log('\n\x1b[1m4. Fixed context — what loads in every session\x1b[0m');
log('   (every agent/skill/command description enters the prompt always, used or not)');

const descricaoDe = (arq) => {
  try {
    const m = fs.readFileSync(arq, 'utf8').match(/^description:[ \t]*(.+)$/mi);
    return m ? m[1].trim() : '';
  } catch { return ''; }
};
const mdsDe = (dir) => {
  try {
    return fs.readdirSync(dir, { recursive: true })
      .filter(f => String(f).endsWith('.md')).map(f => path.join(dir, String(f)));
  } catch { return []; }
};
const pesar = (base) => {
  const r = { agents: 0, skills: 0, commands: 0, chars: 0 };
  for (const a of mdsDe(path.join(base, 'agents')))   { r.agents++;   r.chars += descricaoDe(a).length; }
  for (const c of mdsDe(path.join(base, 'commands'))) { r.commands++; r.chars += descricaoDe(c).length; }
  try {
    for (const e of fs.readdirSync(path.join(base, 'skills'), { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const s = path.join(base, 'skills', e.name, 'SKILL.md');
      if (fs.existsSync(s)) { r.skills++; r.chars += descricaoDe(s).length; }
    }
  } catch {}
  return r;
};

// ~4 chars por token: estimativa, serve para comparar níveis e ver ordem de grandeza.
const emTokens = (chars) => Math.round(chars / 4);
const niveis = [];
const baseGlobal = path.join(os.homedir(), '.claude');
for (let cur = RAIZ; ; cur = path.dirname(cur)) {
  const base = path.join(cur, '.claude');
  // Projeto dentro da home: a subida encontraria ~/.claude e ele seria contado
  // de novo logo abaixo, dobrando o total. Pular aqui, não lá — o nível global
  // tem rótulo próprio e é o que o usuário precisa ver.
  if (fs.existsSync(base) && path.resolve(base) !== path.resolve(baseGlobal)) {
    niveis.push([cur, pesar(base), false]);
  }
  if (path.dirname(cur) === cur) break;
}
if (fs.existsSync(baseGlobal)) niveis.push([baseGlobal + ' (GLOBAL)', pesar(baseGlobal), true]);

let totalTokens = 0;
for (const [d, p, global] of niveis) {
  const t = emTokens(p.chars);
  totalTokens += t;
  if (!p.agents && !p.skills && !p.commands) continue;
  info(`${String(p.agents).padStart(3)} agents  ${String(p.skills).padStart(3)} skills  ` +
       `${String(p.commands).padStart(3)} commands  ~${String(t).padStart(5)} tk  ${global ? '⟵ paid in EVERY project  ' : ''}${d}`);
}
if (totalTokens) info(`${''.padStart(46)}~${totalTokens} tk fixed per session (estimate)`);

const comAgentes = niveis.filter(([, p]) => p.agents > 0).length;
if (comAgentes > 2)
  warn('more than 2 levels with agents → the most specific one wins silently.');
const gl = niveis.find(([, , g]) => g);
if (gl && emTokens(gl[1].chars) > 2000) {
  warn(`the GLOBAL level alone costs ~${emTokens(gl[1].chars)} tokens in every session of every project`);
  info('  the three-bucket rule:');
  info('    used in >1 project  → global (that is real capability)');
  info('    used in 1 project   → <project>/.claude/skills/');
  info('    used in 0 projects  → out — it is pure weight');
}

// ── 4b. A NOTA também é contexto fixo, e era a única que ninguém contava.
//
// O passo 4 media agente, skill e command e parava ali. Mas a memória carrega em TODA
// sessão pela junction, e é o arquivo que mais cresce — porque a tentação de acrescentar
// "o que esta sessão produziu" é permanente. Este repositório mesmo chegou a 314 linhas
// com quatro seções de changelog dentro, sendo que o cabeçalho da própria nota diz que
// o histórico é o `git log`.
//
// O aviso só serve com DESTINO. "Sua nota está grande" é moralismo; "o que virou
// histórico pertence a 10_Decisoes/" é uma ação. Por isso os dois andam juntos.
//
// O teto: ~6 KB. Não é número mágico — é o dobro de uma nota bem-formada de referência
// (3,3 KB, respondendo as três perguntas e nada mais). Dobro dá folga para projeto
// grande sem deixar changelog passar batido.
const NOTA = path.join(DEST, 'onde_paramos.md');
const TETO_NOTA = 6 * 1024;
try {
  const bytes = fs.statSync(NOTA).size;
  const tk = emTokens(bytes);
  info(`${''.padStart(11)}the memory note itself: ~${tk} tk — it loads in every session too`);
  if (bytes > TETO_NOTA) {
    warn(`onde_paramos.md is ${Math.round(bytes / 1024)} KB (~${tk} tk) — too long to load every session`);
    info('  it answers three questions and no more: where we stopped · what to do now · what is stuck.');
    info('  what turned into history has a destination, and it is not this file:');
    info(`    a decision that still explains a choice  → ${path.relative(RAIZ, path.join(DOCS, '10_Decisoes')).replace(/\\/g, '/')}/<slug>.md`);
    info('    a log of what was done                   → git log');
  }
} catch { /* nota ainda não existe: o passo 7b a cria */ }

// ═══════════════════════════════════════════ 5. BASE DE CONHECIMENTO EM .marvin/
log('\n\x1b[1m5. Knowledge base (a single folder — plain markdown, no tool required)\x1b[0m');
// DOCS foi detectado lá em cima, antes de qualquer escrita, porque o --check precisa dele.
const novoVault = !fs.existsSync(DOCS);
fsw.mkdirSync(DOCS, { recursive: true });
info('vault: ' + path.relative(RAIZ, DOCS) + (novoVault ? '  (created now)' : '  (already existed)'));
const docsDoProduto = CANDIDATOS.find(d => fs.existsSync(d) && !ehVault(d) && path.resolve(d) !== path.resolve(DOCS));
if (docsDoProduto) info('living next to ' + path.relative(RAIZ, docsDoProduto) + '/ from the product — untouched');
// Nenhuma config de ferramenta é escrita aqui: são só arquivos .md numa pasta, e
// esse é o ponto. Qualquer editor abre. Quem quiser usar um app de notas por cima
// aponta ele para esta pasta — a base não depende disso para funcionar.
for (const d of ['10_Decisoes', '11_Sessoes', '90_Anexos', '99_Backup']) fsw.mkdirSync(path.join(DOCS, d), { recursive: true });

// README de 10_Decisoes. A pasta nascia vazia e sem uma linha explicando para que serve,
// e pasta vazia não ensina ninguém: o resultado era todo mundo empilhando histórico no
// `onde_paramos.md` até ele virar changelog. Mesmo remédio que já vale para `agents/` e
// `skills/` — a pasta vem com o README que diz o que entra nela.
const decDir = path.join(DOCS, '10_Decisoes');
const decReadme = path.join(decDir, 'README.md');
if (!fs.existsSync(decReadme)) {
  fsw.writeFileSync(decReadme, [
  '# Decisões',
  '',
  'Uma decisão por arquivo, nome em `slug-curto.md`. **Acrescenta, nunca sobrescreve** —',
  'é o oposto do `onde_paramos.md`, e essa é a razão desta pasta existir.',
  '',
  '| Arquivo | Responde | Regime |',
  '|---|---|---|',
  '| `08_Memoria/onde_paramos.md` | **onde estamos agora** | sobrescrito, sempre um |',
  '| `10_Decisoes/<slug>.md` | **por que escolhemos isto** | imutável, um por decisão |',
  '',
  'São perguntas diferentes. A segunda não cabe numa nota sobrescrita: assim que você',
  'escreve o porquê de uma escolha dentro do `onde_paramos.md`, ele começa a virar',
  'changelog — e nota longa carrega em TODA sessão, usada ou não.',
  '',
  '## Quando escrever uma',
  '',
  'Quando a escolha ainda vai ser questionada daqui a três meses: troca de arquitetura,',
  'dependência adotada ou recusada, caminho descartado e por quê. Se ninguém for',
  'perguntar "por que assim?", é `git log`, não decisão.',
  '',
  '## O formato mínimo',
  '',
  '```markdown',
  '# <a decisão, em uma frase>',
  '',
  '**Quando:** <data>   ·   **Estado:** aceita | substituída por <slug>',
  '',
  '## O problema',                                             
  '## O que foi decidido',
  '## O que foi descartado, e por quê',
  '```',
  '',
  'O descarte é a parte que mais paga: sem ele a mesma alternativa é relitigada todo ano.',
  '',
  '## Publicar ou não',
  '',
  'Esta pasta é versionada. Decisão que não pode sair do seu computador vai em',
  '`10_Decisoes/privado/`, e essa linha entra no `.gitignore` — sem config, sem flag.',
  '',
  ].join('\n'));
  ok('10_Decisoes/README.md');
} else info('10_Decisoes/README.md already exists');

// vault numa pasta separada é layout antigo deste script
const LEGADO = path.join(RAIZ, 'Obsidian');
if (fs.existsSync(LEGADO) && path.resolve(LEGADO) !== path.resolve(DOCS)) {
  warn('a separate Obsidian/ folder exists — old layout. The knowledge base is .marvin/ now.');
  for (const e of fs.readdirSync(LEGADO, { withFileTypes: true })) {
    const p = path.join(LEGADO, e.name);
    let tipo = e.isFile() ? 'file' : 'folder';
    try { if (fs.lstatSync(p).isSymbolicLink()) tipo = 'junction → ' + fs.readlinkSync(p); } catch {}
    info('  · ' + e.name.padEnd(18) + tipo);
  }
  info('  migrate the content and delete it. Junction: remove ONLY the link —');
  info('    [System.IO.Directory]::Delete("<path>", $false)   (PowerShell)');
  info('  rm -rf on a junction can follow the link and delete the target.');
}

// ═══════════════════════════════════════════ 6. MEMÓRIA — junction invertida
log('\n\x1b[1m6. Memory (inverted junction — the step that versions it)\x1b[0m');
// DEST, ehJunction e contarNotas moram lá em cima — o --check usa os três.

if (ehJunction(MEM)) {
  const alvo = fs.readlinkSync(MEM);
  // A junction sobrevive ao destino: mover ou apagar o vault a deixa apontando para o
  // nada, sem aviso (é a armadilha do AGENTS.md). Sem recriar aqui, os passos seguintes
  // estouram ENOENT ao escrever a nota canônica.
  if (!fs.existsSync(DEST)) {
    warn('the junction exists but its target is gone — recreating ' + path.relative(RAIZ, DEST));
    fsw.mkdirSync(DEST, { recursive: true });
  }
  if (path.resolve(alvo) === path.resolve(DEST)) {
    ok('already inverted — ' + contarNotas(DEST) + ' notes in ' + path.relative(RAIZ, DEST));
  } else if (!fs.existsSync(alvo)) {
    // Aponta para OUTRO lugar E esse lugar não existe: é órfã, não montagem alheia.
    // Distinguir os dois casos é o que faltava — renomear o vault (ou aceitar o
    // `.docs` -> `.marvin`) cai exatamente aqui, e antes o script só avisava. Duas
    // ocorrências reais no mesmo dia foram o que trouxe este ramo.
    //
    // Repontar é seguro porque não há nada no destino velho para perder: só o link
    // morre, e o conteúdo vivo está em DEST. O invariante 1 vale sem drama.
    warn('the junction pointed somewhere that no longer exists: ' + alvo);
    fsw.unlinkSync(MEM);
    fsw.symlinkSync(DEST, MEM, 'junction');
    ok('repointed to ' + path.relative(RAIZ, DEST) + ' — ' + contarNotas(DEST) + ' notes');
  } else {
    // O outro alvo EXISTE: aí é montagem de outra pessoa (ou outro projeto), e
    // desfazer não é decisão deste script.
    warn('already a junction, but it points elsewhere: ' + alvo);
    info('the memory of this project is landing outside this repository.');
    info('nothing was touched — undoing someone else`s mount is not this script`s call.');
  }
} else {
  fsw.mkdirSync(DEST, { recursive: true });

  // O caminho da memória pode existir como diretório DE VERDADE, e por dois motivos
  // bem diferentes: memória nativa antiga, com notas para migrar; ou a pasta do
  // projeto mudou de lugar e o Claude Code criou um diretório vazio no caminho novo.
  //
  // O segundo é o caso comum da segunda vez em diante, e era ele que derrubava a
  // criação da junction com EEXIST — o script avisava e saía com código 0, deixando
  // a memória desligada do repositório. Silêncio com cara de sucesso é o pior modo
  // de falhar que este projeto conhece.
  const itens = fs.existsSync(MEM) ? fs.readdirSync(MEM) : [];
  if (itens.length) {
    const origem = contarNotas(MEM);
    fsw.cpSync(MEM, DEST, { recursive: true, force: true });
    // Em --dry-run a cópia não aconteceu, então a contagem daria 0 e a conferência
    // abortaria acusando uma perda que não existe. O invariante 1 vale para a
    // execução real; aqui só anunciamos o que seria feito.
    const copiado = DRY ? origem : contarNotas(DEST);
    // Contar só as notas não basta: o diretório pode ter subpasta ou anexo, e apagar
    // o que não chegou ao destino é exatamente o que o invariante 1 proíbe.
    const naoCopiado = DRY ? [] : itens.filter(n => !fs.existsSync(path.join(DEST, n)));
    if (copiado < origem || naoCopiado.length) {
      err(`ABORTED — copied ${copiado} of ${origem} notes. Nothing was deleted.`);
      naoCopiado.forEach(n => info('missing at the destination: ' + n));
      process.exit(1);
    }
    ok(`${copiado} notes copied to ${path.relative(RAIZ, DEST)} (verified)`);
    fsw.rmSync(MEM, { recursive: true, force: true });
  } else if (fs.existsSync(MEM)) {
    // Vazio: não há o que conferir nem o que perder — e é ele que bloqueia a junction.
    fsw.rmSync(MEM, { recursive: true, force: true });
    ok('empty directory removed from the profile — it was blocking the junction');
  }
  fsw.mkdirSync(path.dirname(MEM), { recursive: true });
  try {
    fsw.symlinkSync(DEST, MEM, 'junction');
    ok('junction created: profile → ' + path.relative(RAIZ, DEST));
    ok('check: ' + contarNotas(MEM) + ' notes visible through the agent path');
  } catch (e) {
    err('junction failed: ' + e.message);
    warn('the notes are saved in ' + DEST + ' — nothing was lost');
    warn('but the memory is NOT wired to the repository. Diagnose with:  marvin --check');
    // Sair 0 aqui é como a memória fica desligada sem ninguém notar.
    process.exitCode = 1;
  }
}

const idx = path.join(DOCS, '00_Inicio.md');
if (!fs.existsSync(idx)) {
  fsw.writeFileSync(idx, `---
name: inicio
aliases: ["Início", "Home", "MOC"]
tags: [moc]
---

# ${path.basename(RAIZ)} — Base de Conhecimento

> **Esta pasta é a base de conhecimento** deste projeto: \`${path.relative(RAIZ, DOCS)}\`.
> Markdown puro, arquivo real, sem depender de ferramenta nenhuma para ser lido.

## Montagem

Existe **uma junction só**, e ela é invertida:

\`\`\`
~/.claude/projects/${RAIZ.replace(/[:\\/]/g, '-')}/memory  ──►  ${path.relative(RAIZ, DEST)}/
\`\`\`

O Claude escreve no caminho padrão dele; os arquivos nascem dentro do repositório.

⚠️ Abrir o Claude Code sempre de \`${RAIZ}\` — a memória é derivada do caminho.
⚠️ A memória guarda decisão de produto e id de cliente. **Repo privado, sempre.**
⚠️ Mover ou renomear esta pasta quebra a junction **em silêncio**: ela fica apontando para
o caminho antigo e um diretório vazio nasce no novo. As notas não se perdem — moram aqui.
Depois de mover, rode \`marvin --check\` (diagnostica) e \`marvin\` (conserta).

## Retomar

Num chat novo: **\`/retomar\`**. Ele lê [[onde-paramos]], confere contra o código e
te diz onde parou. Essa nota é a **única** porta — sempre sobrescrita, nunca duplicada.

## Onde mora o que não está aqui

US, backlog, tickets e design: [[fontes-externas]].

## Higiene

Nada de arquivo que ninguém pediu. Antes de fechar qualquer trabalho:
\`git status --short\` e uma justificativa por arquivo novo — sem justificativa, apaga.
Arquivo de nome estranho na raiz (\`,\` \`{\` \`i\` \`-x\`) é comando de shell mal-formado,
não conteúdo.

## A preencher

- [ ] Os invariantes deste produto (o que nunca pode quebrar)
- [ ] As armadilhas do codebase (o que já mordeu)
- [ ] Decisões que não se reabrem
`);
  ok('00_Inicio.md');
} else info('00_Inicio.md já existe');

// ═══════════════════════════════════════════ 6b. FONTES EXTERNAS
log('\n\x1b[1m6b. External sources (where user stories, tickets and specs live)\x1b[0m');
const FONTES = path.join(DOCS, '00_Fontes_Externas.md');
const PADROES = [
  [/https?:\/\/[\w.-]*notion\.(so|site)\/\S+/gi, 'Notion'],
  [/https?:\/\/[\w.-]*atlassian\.net\/\S+/gi, 'Jira/Confluence'],
  [/https?:\/\/(www\.)?linear\.app\/\S+/gi, 'Linear'],
  [/https?:\/\/(app\.)?clickup\.com\/\S+/gi, 'ClickUp'],
  [/https?:\/\/trello\.com\/\S+/gi, 'Trello'],
  [/https?:\/\/(www\.)?figma\.com\/\S+/gi, 'Figma'],
  [/https?:\/\/github\.com\/\S+\/(issues|projects)\S*/gi, 'GitHub Issues'],
];
const encontradas = new Map();
(function grepDocs(dir, prof = 0) {
  if (prof > 2) return;
  let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    if (IGNORAR.has(e.name) || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { grepDocs(p, prof + 1); continue; }
    if (!/\.(md|txt|json)$/i.test(e.name)) continue;
    let txt; try { txt = fs.readFileSync(p, 'utf8'); } catch { continue; }
    for (const [re, nome] of PADROES) {
      const m = txt.match(re);
      if (m) {
        if (!encontradas.has(nome)) encontradas.set(nome, new Set());
        m.slice(0, 3).forEach(u => encontradas.get(nome).add(u.replace(/[)\].,]+$/, '')));
      }
    }
  }
})(DOCS);
if (encontradas.size) {
  ok('found references already cited in the docs:');
  for (const [nome, urls] of encontradas) { info(nome + ':'); [...urls].slice(0, 2).forEach(u => info('  ' + u)); }
} else info('no tool URLs found in the docs');

if (fs.existsSync(FONTES)) {
  info('00_Fontes_Externas.md already exists — not overwriting');
} else {
  let respostas = null;
  if (process.stdin.isTTY) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    log('');
    log('  Outside this repo memory and docs, where does the product truth live?');
    log('  (user stories, backlog, tickets, specs, design. Blank Enter skips.)');
    const q = async (rot) => (await rl.question('    ' + rot.padEnd(26))).trim();
    respostas = {
      backlog: await q('user stories / backlog:'),
      roadmap: await q('roadmap / status:'),
      design: await q('design (Figma?):'),
      tickets: await q('tickets / bugs:'),
      outro: await q('other:'),
    };
    await rl.close();
  } else {
    warn('no interactive terminal — writing the file with blanks for you to fill in');
  }
  const linha = (rot, v) => '| ' + rot + ' | ' + (v || '_(preencher)_') + ' | |';
  fsw.writeFileSync(FONTES, `---
name: fontes-externas
aliases: ["Fontes Externas"]
description: Onde mora a verdade do produto fora deste repositório
tags: [moc, referencia]
---

# Fontes externas

O que **não** vive neste repositório, e onde encontrar. Mantenha atualizado: fonte
externa que ninguém sabe onde fica vira decisão perdida.

| O quê | Onde | Quem mantém |
|---|---|---|
${linha('US / backlog', respostas?.backlog)}
${linha('Roadmap / status', respostas?.roadmap)}
${linha('Design', respostas?.design)}
${linha('Tickets / bugs', respostas?.tickets)}
${linha('Outro', respostas?.outro)}
${encontradas.size ? `
## Detectado automaticamente nos docs

${[...encontradas].map(([n, u]) => '- **' + n + '**: ' + [...u].slice(0, 3).join(' · ')).join('\n')}
` : ''}
## Precedência

Defina **qual lado vence** quando os dois discordarem. Sem isso, a divergência
vira decisão tomada por acidente. Sugestão: o repositório vence para cenário e
achado (tem commit e data); a ferramenta externa vence para roadmap e prioridade
(é onde tu decide).

## Regra

Quando uma decisão for tomada **lá fora**, registre aqui **o link e a data** — e o que
mudou em uma linha.
`);
  ok('00_Fontes_Externas.md' + (respostas ? ' (filled in)' : ' (blank — fill it in)'));
}

// ═══════════════════════════════════════════ 7. .claude/agents
log('\n\x1b[1m7. .claude/agents\x1b[0m');
const agDir = path.join(RAIZ, '.claude', 'agents');
fsw.mkdirSync(agDir, { recursive: true });
const readme = path.join(agDir, 'README.md');
if (!fs.existsSync(readme)) {
  fsw.writeFileSync(readme, `# Time deste projeto

Um \`.md\` por papel:

\`\`\`yaml
---
name: qa
description: quando usar este papel — é isto que decide se ele é chamado
tools: Read, Grep, Glob, Bash
model: haiku | sonnet | opus
---
\`\`\`

## Modelo por papel

- **haiku** — só recuperação delimitada (achar arquivo, símbolo, uso).
  Erra onde a tarefa exige segurar um invariante e notar o que está *faltando*.
- **sonnet** — implementação, QA, documentação.
- **opus** — julgamento: arquitetura, conservação de dado, revisão de diff.

Sempre tenha um papel \`tl\` em **opus** que lê diff e é dono dos invariantes.

## O que ESTE projeto sugere

${(() => {
  // Recomendação DERIVADA do diagnóstico, nunca um menu. O Marvin não escreve o agente
  // (invariante 4), mas ficar calado diante de uma pasta vazia também não ajuda: a
  // pergunta "quantos papéis?" tem resposta diferente em repo de uma stack e em monorepo.
  const lista = [...new Set([...stacks.values()].flatMap(s => [...s]))];
  const fronteiras = lista.length + SUBREPOS.length;
  const detectado = lista.length ? lista.join(', ') : 'nenhum marcador de stack';
  return `Detectado aqui: **${detectado}**` +
    (SUBREPOS.length ? `, mais ${SUBREPOS.length} sub-repositório(s) ignorado(s) pela raiz` : '') + `.

` + (fronteiras > 1
  ? `- **Um papel por fronteira, não um revisor universal.** São ${fronteiras} fronteiras aqui.
  Um único revisor que atravessa todas não segura o invariante de nenhuma — ele vira
  genérico, que é o modo de falhar deste arquivo.`
  : `- **Comece com dois papéis:** o \`tl\` acima e **um** de implementação. O terceiro só
  quando doer de verdade. Papel a mais é contexto fixo em toda sessão.`);
})()}
- **Não crie papel vazio para preencher a pasta.** Um \`.md\` sem as armadilhas concretas
  deste código entra no contexto de toda sessão e não devolve nada. Genérico é pior que
  ausente — é por isso que o marvin gera esta pasta e não os agentes.

## Subagente NÃO tem memória

Cada um nasce com contexto limpo: não vê a conversa, não vê a memória do
projeto, não vê o que outro agente fez. Ele sabe só (1) o próprio .md,
(2) o prompt que recebe, (3) o que ler do disco.

**Por isso o .md dele É a memória dele.** Escreva as armadilhas concretas
lá dentro. Genérico ("você é um dev sênior de React") não vale nada;
concreto ("\`conta.saldo\` é a abertura, não o saldo exibido") evita bug.

Escreva os agentes **depois** de conhecer o projeto, nunca antes.

## Higiene — coloque isto em TODO agente que escreve arquivo

\`\`\`
NUNCA deixe lixo no repositório:
- não crie arquivo que a tarefa não pediu — nem README, nem resumo, nem relatório
- não crie arquivo "temporário" na raiz do projeto; use o diretório de scratchpad
- prefira editar arquivo existente a criar um novo
- se um comando falhar, confira se ele não deixou arquivo de nome estranho
  (um caractere só, começando com \\\`, {, ,, -) — é redirect de shell mal-formado
- ao terminar, rode \`git status --short\` e explique cada arquivo novo.
  Se não souber justificar, apague.
\`\`\`

Não é preciosismo: um \`.gitignore\` pega os padrões conhecidos, a regra pega o resto.
Arquivo vazio commitado passa despercebido por meses.
`);
  ok('README.md (guide on what to write)');
} else info('README.md já existe');

// Aqui havia um aviso de que o CLAUDE.md não existia — um passo antes do 7c criá-lo,
// e mandando escrever nele o que é do AGENTS.md. Dizia o contrário da arquitetura que
// este script monta: a fonte é o AGENTS.md, e o CLAUDE.md é ponteiro.

// ═══════════════════════════════════════════ 7a. .claude/skills
log('\n\x1b[1m7a. .claude/skills\x1b[0m');
const skDir = path.join(RAIZ, '.claude', 'skills');
fsw.mkdirSync(skDir, { recursive: true });
const skReadme = path.join(skDir, 'README.md');
if (!fs.existsSync(skReadme)) {
  fsw.writeFileSync(skReadme, `# Skills deste projeto

Uma pasta por skill, com \`SKILL.md\` dentro:

\`\`\`
.claude/skills/
└── medir-invariante/
    └── SKILL.md
\`\`\`

\`\`\`yaml
---
name: medir-invariante
description: quando invocar — é ISTO que decide se a skill entra em cena
---
\`\`\`

## Skill, agente ou command? O discriminador

|  | Onde o texto carrega | Quem usa |
|---|---|---|
| **Agente** | contexto **próprio e limpo** | spawnado, isolado |
| **Skill** | contexto **atual** | quem invoca |
| **Command** | contexto atual | **tu** dispara |

> **Fato que o subagente precisa saber** → no \`.md\` do agente.
> **Procedimento que 2+ papéis executam, ou que o loop principal executa sem spawnar** → skill.
> **Coisa que tu dispara** → command.

## A pegadinha que muda o desenho

**Subagente nasce com contexto limpo.** Ele não lê \`AGENTS.md\`, não lê \`CLAUDE.md\`,
e não lê skill nenhuma — a menos que tenha a tool \`Skill\` na lista dele.

Consequência: **repetir um fato crítico dentro do \`.md\` de cada agente que precisa dele
não é descuido, é a única forma.** O que não deve ser repetido é *procedimento* — isso
vira skill.

Se quiser que um agente invoque skill, acrescente \`Skill\` ao \`tools:\` dele. Sem isso,
a skill só serve ao loop principal.

## Custo

A **descrição** de toda skill carrega em toda sessão. Três skills de projeto é barato;
trinta vira o problema que a skill deveria resolver.

**Regra:** skill nova só depois do procedimento ter sido executado **duas vezes**.
Antes disso é especulação, e especulação vira contexto morto.

## Portabilidade

O formato \`SKILL.md\` é do Claude Code. O **corpo** (o procedimento em si) é markdown
puro e migra por copiar e colar — igual à persona dos agentes.
`);
  ok('README.md (skill vs. agent vs. command — the discriminator)');
} else info('README.md já existe');


// ═══════════════════════════════════════════ 7b. PORTA DE ENTRADA
log('\n\x1b[1m7b. Entry point (/retomar + the canonical note)\x1b[0m');
const cmdDir = path.join(RAIZ, '.claude', 'commands');
fsw.mkdirSync(cmdDir, { recursive: true });
const cmdRetomar = path.join(cmdDir, 'retomar.md');
if (!fs.existsSync(cmdRetomar)) {
  fsw.writeFileSync(cmdRetomar, `---
description: Retoma o trabalho a partir do estado corrente registrado — a porta de entrada do projeto
---

Retome o trabalho neste projeto.

1. Leia \`${path.relative(RAIZ, DEST).replace(/\\/g, '/')}/onde_paramos.md\` — é a **única**
   porta de entrada, sempre atualizada. Se não existir, leia o \`MEMORY.md\` e diga que a
   nota canônica está faltando.

2. Confira o estado real antes de confiar no registro: \`git log --oneline -3\` e
   \`git status --short\` nos repositórios que importam. Se o registro disser que algo foi
   corrigido, confirme no código.

3. Me diga, em no máximo 10 linhas:
   - **onde paramos** (uma frase)
   - **o próximo passo** e qual papel do time faz
   - **o que está travado** e por quê
   - se o registro divergir do código, **diga a divergência** — não escolha em silêncio

Não comece a trabalhar. Espere eu confirmar por onde ir.

$ARGUMENTS
`);
  ok('.claude/commands/retomar.md  → type /retomar in a new chat');
} else info('/retomar already exists');

const ondeParamos = path.join(DEST, 'onde_paramos.md');
if (!fs.existsSync(ondeParamos)) {
  fsw.writeFileSync(ondeParamos, `---
name: onde-paramos
aliases: ["onde-paramos", "ONDE PARAMOS"]
description: "ÚNICA porta de entrada. Estado corrente — sempre sobrescrita, nunca duplicada."
tags: [moc, entrada]
metadata:
  type: project
---

# ▶ ONDE PARAMOS

> **Esta nota é a única porta de entrada.** Sempre este nome, sempre sobrescrita.
> Criar \`onde_paramos_<data>.md\` é **erro**: o histórico já está no \`git log\`.
> Duas portas viram duas verdades, e uma delas fica velha em silêncio.
>
> **E ela é CURTA por desenho:** *onde paramos · o que fazer agora · o que está travado.*
> Nada além dessas três. Ela carrega em TODA sessão, e nota longa é lida na diagonal.
>
> Quando crescer, não resuma — **cada tipo de transbordo tem um destino**:
>
> | O que você ia escrever aqui | Onde ele mora |
> |---|---|
> | armadilha do código, convenção, invariante | \`AGENTS.md\` (é durável, não é estado) |
> | o porquê de uma escolha | \`10_Decisoes/<slug>.md\` |
> | relato do que foi feito | \`git log\` |

**Atualizado:** _(preencher)_

## Estado corrente

_(uma frase: onde paramos)_

## Próximo passo

_(o que fazer, e qual papel do time faz)_

## Travado

_(o que não anda, e por quê — se nada, escreva "nada")_

`);
  ok('onde_paramos.md (skeleton — fill it in at the end of each session)');
} else info('onde_paramos.md already exists');

// ═══════════════════════════════════════════ 7c. FONTE ÚNICA + ADAPTADORES
log('\n\x1b[1m7c. Portability — 1 source, N thin adapters\x1b[0m');
const relDocs = path.relative(RAIZ, DOCS).replace(/\\/g, '/');
const relMem = path.relative(RAIZ, DEST).replace(/\\/g, '/');
const NOME = path.basename(RAIZ);

if (ferrInvalidas.length) {
  warn('unknown tool ignored: ' + ferrInvalidas.join(', '));
  info('valid: ' + FERRAMENTAS_VALIDAS.join(', '));
}
info('tools: ' + FERRAMENTAS.join(', '));

// ── A FONTE. Todo conteúdo durável mora aqui e em nenhum outro lugar.
const AGENTS = path.join(RAIZ, 'AGENTS.md');
if (!fs.existsSync(AGENTS)) {
  fsw.writeFileSync(AGENTS, `# ${NOME}

> **Fonte de verdade deste projeto, independente de ferramenta.**
> Estrutura, invariantes, armadilhas e convenções moram **aqui e em nenhum outro lugar**.
> Os arquivos de cada ferramenta (\`CLAUDE.md\`, \`.cursor/rules/\`, \`CONVENTIONS.md\`…)
> são **ponteiros** — não copiam conteúdo. Conteúdo repetido em dois lugares vira duas
> verdades, e uma envelhece em silêncio.
>
> Estado corrente e próximo passo **não moram aqui** — ficam em
> [\`${relMem}/onde_paramos.md\`](${relMem}/onde_paramos.md), sempre sobrescrita.
> Documento durável misturado com estado corrente é como um projeto passa semanas
> afirmando o que já não é verdade.

## O que é este projeto

_(uma frase — o que faz e para quem)_

## Estrutura real

_(tabela: diretório → stack → o que é. Marque diretório vazio como vazio —
agente criado para pasta sem código inventa arquitetura.)_

## Invariantes

_(o que NUNCA pode quebrar. Se manipula dinheiro, dado de usuário ou integração
externa, escreva a regra de conservação aqui. Sem isso nenhum agente — nem humano —
consegue julgar se uma mudança é segura.)_

## Armadilhas do codebase

_(o que já mordeu: campo que parece uma coisa e é outra, valor derivado que parece
persistido, efeito colateral não óbvio, UI que promete o que o código não faz)_

${BLOCO_COMANDOS}## Convenções

- _(idioma do código / comentário / commit)_
- _(limite de tamanho de arquivo)_
${LINHA_TESTE_BUILD}- Nunca commitar secret, \`.env\` ou credencial
- **Nada de arquivo que ninguém pediu.** Antes de fechar: \`git status --short\` e uma
  justificativa por arquivo novo — sem justificativa, apaga.

## O time

| Papel | Dono de | Precisa de |
|---|---|---|
| _(preencher)_ | | julgamento / implementação / recuperação |

A coluna **"precisa de"** é o que é portátil: *julgamento* pede o modelo mais capaz que
a ferramenta oferecer; *implementação* aceita o intermediário; *recuperação* (achar
arquivo, símbolo, uso) aceita o mais barato. O mapeamento para modelo concreto é
específico da ferramenta.

Regra: mudança que toque um invariante passa pelo papel de revisão **antes** de fechar.
Relatório verde de agente não substitui ler o diff.

## Conhecimento e memória

\`${relDocs}/\` é a base de conhecimento — markdown puro, arquivo real.
**Legível por qualquer ferramenta**, e por nenhuma também: é só uma pasta com \`.md\` dentro.

- \`${relMem}/onde_paramos.md\` — a única porta de entrada
- \`${relDocs}/00_Fontes_Externas.md\` — o que vive fora deste repositório
- \`${relDocs}/10_Decisoes/<slug>.md\` — **por que** escolhemos cada coisa (ver o README de lá)

**A nota é curta; a decisão é imutável.** O \`onde_paramos.md\` responde *onde estamos agora* e é
sobrescrito. Quando você escrever o *porquê* de uma escolha dentro dele, ele começou a virar
changelog — e ele carrega em toda sessão. O porquê vai para \`10_Decisoes/\`; o relato do que foi
feito já está no \`git log\`.

**Quando registrar: no commit.** É o momento em que uma unidade de trabalho fecha, e é o
gatilho que faz a regra ser lembrada em vez de decorada. Sem gatilho, "sempre atualizar a
memória" não dispara nunca — ou dispara sempre, que é pior.

- Commit que muda o **estado** do projeto — decisão tomada, subsistema novo, armadilha
  descoberta, algo que travou — pede uma passada no \`onde_paramos.md\` **antes**.
- Commit de typo, formatação ou renomeação não pede nada.
- A nota é **sobrescrita**, não acrescentada: o histórico é o \`git log\`. Criar
  \`onde_paramos_<data>.md\` é erro.

## Higiene de sessão — quando sugerir um chat novo

Contexto acumulado custa em **toda** requisição, não só uma vez. Conversa longa que já
mudou de assunto carrega peso morto no resto da sessão inteira.

**Sugira um chat novo quando as três forem verdade:**

1. O assunto mudou — outra tarefa, outro subsistema, outro projeto
2. A sessão já está longa
3. **O estado está registrado** em \`onde_paramos.md\` — sem isso, o chat novo começa cego

**NÃO sugira quando:**

- O trabalho novo depende de algo descoberto agora e **ainda não escrito**
- Está no meio de algo (correção feita, falta validar)
- A sessão é curta — recomeçar custa mais do que continuar, porque o contexto fixo
  recarrega inteiro

**A regra que fecha:** registrar **antes** de sugerir. Sugerir chat novo com estado não
salvo transfere para a próxima sessão o trabalho de redescobrir — que é exatamente o
custo que se queria evitar.

Ao sugerir, diga **o que já está salvo** e **qual seria a primeira frase** do chat novo.

## Portabilidade

| Item | Migra? |
|---|---|
| Este arquivo, \`${relDocs}/\` inteiro, a memória | ✅ é só markdown |
| Persona dos agentes (o corpo do \`.md\`) | ✅ copiar e colar |
| Definição de modelo/tools no frontmatter | ❌ formato de cada ferramenta |
| Slash commands | ❌ vira prompt manual |
| Auto-load da memória | ❌ **só o carregamento; os arquivos ficam** |

A memória foi montada de propósito **dentro do repositório**, não no perfil do usuário.
É o que garante que ela sobreviva à troca de ferramenta.
`);
  ok('AGENTS.md — the source (fill it in; it is the only place with content)');
} else info('AGENTS.md already exists');

// ── OS ADAPTADORES. Cada um aponta para a fonte; nenhum carrega conteúdo próprio.
const PONTEIRO = `A fonte de verdade deste projeto é **[AGENTS.md](AGENTS.md)** — estrutura, invariantes,
armadilhas e convenções estão lá. **Leia AGENTS.md antes de qualquer coisa.**
Este arquivo não duplica nada: só acrescenta o que é específico desta ferramenta.

Estado corrente e próximo passo: \`${relMem}/onde_paramos.md\`.`;

const AVISO_CONVENCAO = (ferr) => `<!-- ATENÇÃO: a convenção de arquivo do ${ferr} pode ter mudado desde 31/07/2026.
     Confira na documentação atual se este caminho ainda é lido. Adaptador que não
     carrega falha em silêncio — pior que adaptador ausente. -->`;

const adaptadores = {
  claude: {
    arquivo: 'CLAUDE.md',
    confianca: 'alta',
    conteudo: () => `# ${NOME} — Claude Code

@AGENTS.md

> ${PONTEIRO.split('\n').join('\n> ')}

## Onde parou

\`/retomar\` num chat novo — lê \`${relMem}/onde_paramos.md\` e confere contra o \`git log\`
antes de acreditar no que está escrito.

## Modelo por papel

Os papéis estão no \`AGENTS.md\`. Aqui só o mapeamento, que vai no frontmatter de cada
\`.claude/agents/*.md\`:

| Precisa de | Modelo |
|---|---|
| julgamento | **opus** |
| implementação | **sonnet** |
| recuperação delimitada | **haiku** |

**Haiku só para recuperação** — erra onde a tarefa exige segurar um invariante e notar
o que está *faltando*.

## Memória

\`~/.claude/projects/${RAIZ.replace(/[:\\/]/g, '-')}/memory\` é uma **junction** para
\`${relMem}/\`. O Claude escreve no caminho padrão e os arquivos nascem no repositório.

⚠️ Abra sempre de \`${RAIZ}\` — a memória é derivada do caminho. De um subdiretório, cai
numa memória diferente e vazia, sem aviso.

⚠️ **Mover ou renomear a pasta do projeto quebra essa junction em silêncio.** Ela continua
apontando para o caminho antigo, e no caminho novo o Claude Code cria um diretório vazio de
verdade: o agente escreve memória e nada daquilo chega ao repositório. As notas antigas
seguem intactas em \`${relMem}/\` — o que quebrou foi só o link.

\`\`\`bash
marvin --check   # diagnostica e sai != 0 se estiver quebrada; não escreve nada
marvin           # conserta: remove o diretório vazio e recria a junction
\`\`\`
${GRAPHIFY ? `
## Grafo de código

\`graphify-out/graph.json\` existe e é **derivado** — pode estar velho. **Não há hook
instalado, de propósito:** o hook do graphify responde \`MANDATORY\` a cada Read e Grep
sobre um grafo que ele não garante fresco.

- \`graphify query "<pergunta>"\` para pergunta **estrutural** — o que chama o quê,
  hierarquia de tipo, dependência entre pacotes. É onde ele ganha do Grep.
- Para **localizar** arquivo ou símbolo, Grep/Glob é mais barato.
- Ele **não avisa quando está velho**. Depois de mexer no código, atualize antes de
  confiar numa resposta — ou leia o arquivo direto, que sempre é a verdade:
  \`\`\`bash
  ${SUBREPOS.length ? 'marvin --graphify --graphify-rebuild   # monorepo: refaz o ciclo inteiro'
                    : 'graphify update .'}
  \`\`\`${SUBREPOS.length ? `
- **Este projeto é um monorepo.** ${SUBREPOS.length} sub-repositório(s) estão no \`.gitignore\` da raiz
  e foram indexados separadamente: ${SUBREPOS.join(', ')}. **Não rode \`graphify update .\`** —
  ele re-extrai só a raiz e joga fora todos eles, deixando um grafo sem o código dentro.` : ''}
- \`graphify-out/GRAPH_REPORT.md\` e \`graph.html\` existem. As comunidades se chamam
  \`Community N\` porque nomeá-las exige LLM — isso é esperado, não é falha.
` : ''}`,
  },
  codex: {
    arquivo: null, // Codex lê AGENTS.md direto — não precisa de adaptador
    confianca: 'alta',
    nota: 'reads AGENTS.md natively — no adapter needed',
  },
  opencode: {
    arquivo: null,
    confianca: 'alta',
    nota: 'reads AGENTS.md natively — no adapter needed',
  },
  // GitHub Copilot. Caminho conferido na documentação oficial em 03/08/2026:
  // instrução para o repositório inteiro é `.github/copilot-instructions.md`.
  // O agente dele também lê `AGENTS.md` em qualquer lugar do repositório — mas o
  // chat e o completion não, e é por isso que o ponteiro é gerado assim mesmo.
  copilot: {
    arquivo: '.github/copilot-instructions.md',
    confianca: 'alta',
    conteudo: () => `# ${NOME}

${PONTEIRO}

<!-- Repository-wide instructions: GitHub Copilot reads this file automatically.
     Copilot's agent also reads AGENTS.md anywhere in the repo; chat and code
     completion do not, which is why this pointer exists. -->
`,
  },
  cursor: {
    arquivo: '.cursor/rules/projeto.mdc',
    confianca: 'média',
    conteudo: () => `---
description: Contexto do projeto ${NOME}
alwaysApply: true
---
${AVISO_CONVENCAO('Cursor')}

${PONTEIRO}
`,
  },
  aider: {
    arquivo: 'CONVENTIONS.md',
    confianca: 'média',
    conteudo: () => `${AVISO_CONVENCAO('Aider')}
<!-- O Aider não lê este arquivo automaticamente: rode com --read CONVENTIONS.md
     ou registre em .aider.conf.yml -->

# Convenções — ${NOME}

${PONTEIRO}
`,
  },
  zed: {
    arquivo: 'AGENT.md',
    confianca: 'baixa',
    conteudo: () => `${AVISO_CONVENCAO('Zed')}
<!-- O Zed usa AGENT.md (singular) e/ou .rules. Se este não carregar, tente .rules -->

# ${NOME}

${PONTEIRO}
`,
  },
};

for (const f of FERRAMENTAS) {
  const a = adaptadores[f];
  if (!a) continue;
  if (!a.arquivo) { ok(f.padEnd(9) + '— ' + a.nota); continue; }
  const destino = path.join(RAIZ, a.arquivo);
  if (fs.existsSync(destino)) {
    const txt = fs.readFileSync(destino, 'utf8');
    if (!/AGENTS\.md/i.test(txt)) warn(f.padEnd(9) + '— ' + a.arquivo + ' exists but does NOT point to AGENTS.md');
    else info(f.padEnd(9) + '— ' + a.arquivo + ' already exists and points correctly');
    continue;
  }
  fsw.mkdirSync(path.dirname(destino), { recursive: true });
  fsw.writeFileSync(destino, a.conteudo());
  const selo = a.confianca === 'alta' ? '' : '  ⚠ ' + a.confianca + ' confidence — verify the convention';
  ok(f.padEnd(9) + '— ' + a.arquivo + selo);
}

const naoEscolhidas = FERRAMENTAS_VALIDAS.filter(f => !FERRAMENTAS.includes(f));
if (naoEscolhidas.length) {
  info('not generated: ' + naoEscolhidas.join(', '));
  info('to add later:  --tools=' + [...FERRAMENTAS, naoEscolhidas[0]].join(','));
}

// ═══════════════════════════════════════════ 8. GIT
if (!SEM_GIT) {
  log('\n\x1b[1m8. Git\x1b[0m');
  const jaRepo = fs.existsSync(path.join(RAIZ, '.git'));
  if (!jaRepo) { exec('git init -q', { cwd: RAIZ }); ok('git init'); }
  else info('already a repository');

  const gi = path.join(RAIZ, '.gitignore');
  if (!fs.existsSync(gi)) {
    const subRepos = fs.readdirSync(RAIZ, { withFileTypes: true })
      .filter(e => e.isDirectory() && fs.existsSync(path.join(RAIZ, e.name, '.git')))
      .map(e => e.name + '/');
    fsw.writeFileSync(gi, [
      ...(subRepos.length ? ['# sub-repositórios (versionados por conta própria)', ...subRepos, ''] : []),
      '# dependências e build', 'node_modules/', 'dist/', 'build/', '__pycache__/', '*.pyc', '',
      '# segredos e dados — NUNCA', '**/credentials/', '**/data/', '.env', '.env.*', '*.pem', '*.key', '',
      '# artefatos de ferramenta de orquestração', '.swarm/', '.claude-flow/', '.hive-mind/',
      '*.rvf', '*.rvf.lock', 'ruvector.db', '.claude/settings.local.json', '',
      '# grafo de código: DERIVADO. Versionar artefato derivado é como ele fica velho',
      '# em silêncio e passa a mentir com a autoridade de quem foi commitado.',
      'graphify-out/', '',
      '# lixo — shell mal-formado, temporários, locks',
      '*.log', '*.tmp', '*.temp', '*.bak', '*.orig', '*.rej', '*.swp', '~$*',
      'nul', 'NUL', 'Thumbs.db', '.DS_Store', '',
      '# tarball do npm pack', '*.tgz', '',
    ].join('\n'));
    ok('.gitignore' + (subRepos.length ? ` (${subRepos.length} sub-repos ignored)` : ''));
  } else info('.gitignore already exists — check by hand that it covers secrets and sub-repos');

  warn('memory enters git from now on. Keep the repo PRIVATE, always.');

  try {
    const rastreados = execSync('git ls-files --full-name', { cwd: RAIZ, encoding: 'utf8' })
      .split('\n').filter(f => f && !f.includes('/'));
    const vaziosRastreados = rastreados.filter(f => {
      try { return fs.statSync(path.join(RAIZ, f)).size === 0; } catch { return false; }
    });
    if (vaziosRastreados.length) {
      warn(vaziosRastreados.length + ' EMPTY file(s) tracked in the root — probably committed junk:');
      vaziosRastreados.forEach(f => info('  ' + JSON.stringify(f)));
      info('  to drop them from the index without deleting from disk:');
      info('    git rm --cached -- ' + vaziosRastreados.map(f => JSON.stringify(f)).join(' '));
    } else ok('no empty files tracked in the root');
  } catch {}
}

// ═══════════════════════════════════════════ 8b. GRAFO DE CÓDIGO (só com --graphify)
//
// Por que só a consulta, sem hook:
//
// O grafo é artefato DERIVADO. Medido em 02/08/2026 sobre um repo de 195 arquivos
// Python: sem rebuild, `graphify query` devolve função apagada com arquivo, linha e a
// etiqueta [EXTRACTED] — a de maior confiança dele — e ao mesmo tempo esconde o código
// que está lá. O `graphify claude install` acrescenta um PreToolUse que responde
// "MANDATORY: you MUST run graphify before reading" a cada Read e Grep, e o check de
// frescor dele olha só o mtime do ARQUIVO ALVO: relaxa no arquivo que tu acabou de
// editar e endurece em todo o resto, inclusive no Grep, que é como tu descobriria a
// mudança. Isso é o invariante 3 ao contrário — adaptador que falha em silêncio.
//
// Então: gera o grafo, ignora no git, e compara o mtime contra a ÁRVORE INTEIRA para
// dizer ao humano quando ele está velho. Aviso, nunca ordem.
//
// Ganho medido no mesmo repo: 9,3× pelo benchmark do autor (não os 71× divulgados), e
// esse 9,3× é contra "ler o repositório inteiro". Contra Grep dirigido o grafo só ganha
// em pergunta ESTRUTURAL; para localizar arquivo ele é mais caro.
if (GRAPHIFY) {
  log('\n\x1b[1m8b. Code graph (--graphify)\x1b[0m');

  let versao = null;
  try {
    versao = execSync('graphify --version', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {}

  if (!versao) {
    warn('graphify not found on PATH — step skipped, nothing else changed');
    info('install it in isolation (no need to go global):');
    info('  uv tool install graphifyy    ·    pipx install graphifyy');
    info('then run again with --graphify');
  } else {
    info(versao);

    const SAIDA = path.join(RAIZ, 'graphify-out');
    const GRAFO = path.join(SAIDA, 'graph.json');

    // .gitignore já existente não é reescrito pelo passo 8 — garante a linha aqui.
    const gi2 = path.join(RAIZ, '.gitignore');
    if (fs.existsSync(gi2)) {
      const txt = fs.readFileSync(gi2, 'utf8');
      if (!/^graphify-out\/?\s*$/m.test(txt)) {
        fsw.appendFileSync(gi2, (txt.endsWith('\n') ? '' : '\n') +
          '\n# grafo de código: DERIVADO, não versionar\ngraphify-out/\n');
        ok('graphify-out/ added to .gitignore');
      } else info('graphify-out/ is already in .gitignore');
    }

    const subRepos = SUBREPOS;   // detectado no topo: o passo 7 também precisa dele
    const contarNos = (g) => {
      try { return (JSON.parse(fs.readFileSync(g, 'utf8')).nodes || []).length; } catch { return 0; }
    };

    // Idempotência: grafo que já existe não é reconstruído. Rebuild é decisão do humano.
    if (fs.existsSync(GRAFO) && !GRAPHIFY_REBUILD) {
      info('graph.json already exists — not rebuilding (running twice must not overwrite)');
      info('to rebuild after code changes:  marvin --graphify --graphify-rebuild');
    } else {
      if (subRepos.length) {
        info(subRepos.length + ' gitignored sub-repo(s) — the root scan would MISS these,');
        info('so each one is indexed on its own and merged at the end:');
        subRepos.forEach(s => info('  ' + s));
      }
      // --code-only: só AST local. Sem isso ele exige chave de LLM paga para os .md.
      try {
        const partes = [];
        if (!subRepos.length) {
          exec('graphify . --code-only --no-viz', { cwd: RAIZ, stdio: 'inherit' });
        } else {
          // A saída de cada extração cai dentro de graphify-out/, que já está no
          // .gitignore. Escrever dentro do sub-repo sujaria repositório alheio —
          // nenhum deles tem `graphify` no .gitignore próprio.
          for (const alvo of ['.', ...subRepos]) {
            const nome = alvo === '.' ? '_root' : alvo;
            const destino = path.join(SAIDA, 'repos', nome);
            // try POR SUB-REPO, não em volta do laço: o `graphify extract` sai com
            // código != 0 quando o alvo não produz nó nenhum — um sub-repo ainda
            // vazio (só LICENSE e README, o placeholder de todo monorepo) é caso
            // comum, e derrubava o build inteiro junto: sem merge, sem backup.
            try {
              exec('graphify extract "' + path.join(RAIZ, alvo) + '" --code-only --out "' + destino + '"',
                   { cwd: RAIZ, stdio: 'inherit' });
            } catch {}
            const g = path.join(destino, 'graphify-out', 'graph.json');
            if (DRY || fs.existsSync(g)) partes.push(g);
            else warn(nome + ' produced no nodes — left out of the merge');
          }
          // Invariante 1: o grafo anterior não é apagado, vira .bak, e as duas
          // contagens vão para a tela. Aqui MENOS nós é legítimo — o escopo mudou —
          // então o certo é mostrar o número, não abortar como na migração.
          if (!DRY && fs.existsSync(GRAFO)) {
            fsw.copyFileSync(GRAFO, path.join(SAIDA, 'graph.bak.json'));
            info('previous graph kept as graphify-out/graph.bak.json (' + contarNos(GRAFO) + ' nodes)');
          }
          if (partes.length > 1) {
            exec('graphify merge-graphs ' + partes.map(p => '"' + p + '"').join(' ') +
                 ' --out "' + GRAFO + '"', { cwd: RAIZ, stdio: 'inherit' });
          } else if (partes.length === 1) {
            fsw.copyFileSync(partes[0], GRAFO);   // merge-graphs exige dois
          }
        }
        if (!DRY) {
          if (fs.existsSync(GRAFO)) ok('graph built — ' + contarNos(GRAFO) + ' nodes in graphify-out/');
          else err('no graph was produced');
        }
      } catch {
        err('the graph build failed — nothing else changed');
      }

      // ── Relatório e HTML. O `extract` para no graph.json DE PROPÓSITO: o report e
      // os nomes das comunidades são passo separado, e é por isso que tanta gente
      // acha que a instalação quebrou ao não achar o graph.html que o README do
      // graphify mostra. Sem --graphify-label roda --no-label: determinístico,
      // grátis, sem chave — o html sai igual, só com "Community 0/1/2" nos nomes.
      if (DRY || fs.existsSync(GRAFO)) {
        let modo = '--no-label';
        if (GRAPHIFY_LABEL) {
          let temClaude = false;
          try { execSync('claude --version', { stdio: 'ignore' }); temClaude = true; } catch {}
          if (temClaude) modo = '--backend claude-cli';
          else warn('--graphify-label ignored: no `claude` on PATH — using --no-label');
        }
        try {
          exec('graphify cluster-only . ' + modo, { cwd: RAIZ, stdio: 'inherit' });
          ok('GRAPH_REPORT.md and graph.html written — open the html in any browser');
        } catch {
          warn('the report step failed — graph.json is fine, only the html is missing');
        }
      }
    }

    // ── Frescor: o check que falta no hook do graphify — árvore inteira, não 1 arquivo.
    if (fs.existsSync(GRAFO)) {
      const EXT_CODIGO = /\.(js|mjs|cjs|jsx|ts|tsx|py|go|rs|java|kt|rb|php|cs|c|h|cpp|hpp|swift|scala|ex|exs|lua|sh)$/i;
      const tsGrafo = fs.statSync(GRAFO).mtimeMs;
      const novos = [];
      (function varrerFontes(dir, prof = 0) {
        if (prof > 8) return;
        let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
        for (const e of ents) {
          if (IGNORAR.has(e.name) || e.name === 'graphify-out' || e.name.startsWith('.')) continue;
          const p = path.join(dir, e.name);
          if (e.isDirectory()) { varrerFontes(p, prof + 1); continue; }
          if (!EXT_CODIGO.test(e.name)) continue;
          try { if (fs.statSync(p).mtimeMs > tsGrafo) novos.push(path.relative(RAIZ, p)); } catch {}
        }
      })(RAIZ);

      if (novos.length) {
        warn(novos.length + ' source file(s) newer than the graph — it is STALE');
        novos.slice(0, 5).forEach(f => info('  ' + f));
        if (novos.length > 5) info('  … e mais ' + (novos.length - 5));
        // Num monorepo `graphify update .` re-extrai SÓ a raiz e joga fora os
        // sub-repos — o comando certo é refazer o ciclo inteiro.
        info(subRepos.length ? 'refresh with:  marvin --graphify --graphify-rebuild'
                             : 'refresh with:  graphify update .');
      } else ok('graph is newer than all source — it is fresh');
    }

    // ── post-commit: o grafo se atualiza sozinho depois do commit (só com a flag).
    // NÃO é o `graphify hook install`. Aquele reconstrói a RAIZ do repositório, e num
    // monorepo a raiz é o que NÃO tem o código dentro — ele automatizaria, a cada
    // commit, exatamente o estrago que o passo acima existe para evitar.
    if (GRAPHIFY_GIT_HOOK) {
      // Barra normal também no Windows: dentro de aspas do `sh` a barra invertida só
      // não vira escape por sorte, e o node aceita as duas. Não depender de sorte.
      const comando = subRepos.length
        ? 'node "' + process.argv[1].replace(/\\/g, '/') + '" --graphify --graphify-rebuild'
        : 'graphify update .';
      const script = `#!/bin/sh
# marvin — atualiza o grafo de código depois do commit.
# O grafo é DERIVADO: envelhece a cada commit e não avisa. Isto é o que fecha essa lacuna.
# Instalado por: marvin --graphify --graphify-git-hook   ·   remover: apague este arquivo.

[ "\${MARVIN_SKIP_GRAPH_HOOK:-0}" = "1" ] && exit 0

# Rebase, merge e cherry-pick deixam a árvore em trânsito: reconstruir ali disputa com
# o --continue. git exporta GIT_DIR para o hook; o rev-parse só roda em chamada à mão.
GIT_DIR=\${GIT_DIR:-$(git rev-parse --git-dir 2>/dev/null)}
[ -d "$GIT_DIR/rebase-merge" ] && exit 0
[ -d "$GIT_DIR/rebase-apply" ] && exit 0
[ -f "$GIT_DIR/MERGE_HEAD" ] && exit 0
[ -f "$GIT_DIR/CHERRY_PICK_HEAD" ] && exit 0

# Sem isto o louvain do networkx troca as comunidades a cada run, e o grafo deixa de ser
# reprodutível — a mesma doença que o marvin evita não usando Date.now() nem Math.random().
export PYTHONHASHSEED=0

# Em segundo plano: num monorepo o ciclo inteiro leva perto de um minuto, e ninguém
# aceita esperar isso a cada commit.
LOG="\${TMPDIR:-/tmp}/marvin-graph-refresh.log"
echo "[marvin] atualizando o grafo em segundo plano (log: $LOG)"
{ ${comando} ; } >"$LOG" 2>&1 &
`;
      const dirHooks = path.join(RAIZ, '.git', 'hooks');
      const alvo = path.join(dirHooks, 'post-commit');
      if (!fs.existsSync(path.join(RAIZ, '.git'))) {
        warn('--graphify-git-hook skipped: this is not a git repository');
      } else if (fs.existsSync(alvo)) {
        // Invariante 1: hook alheio não é sobrescrito. Um post-commit que já existe
        // pode ser o CI, o lint ou o gerador de changelog de outra pessoa.
        warn('a post-commit hook already exists — left untouched');
        info('  to get the refresh, add this line to it by hand:');
        info('    ' + comando);
      } else {
        fsw.mkdirSync(dirHooks, { recursive: true });
        fsw.writeFileSync(alvo, script);
        try { if (!DRY) fs.chmodSync(alvo, 0o755); } catch {}   // no-op no Windows
        ok('.git/hooks/post-commit — the graph refreshes itself after each commit');
        info('  it runs:  ' + comando);
        info('  NOT versioned: it lives in .git/, so it does not reach the team');
        info('  skip it once with:  MARVIN_SKIP_GRAPH_HOOK=1 git commit …');
      }
    }

    log('');
    info('How to use it — and what was NOT installed:');
    info('  · no hook, and graphify made no change to CLAUDE.md.');
    info('    `graphify claude install` answers MANDATORY on every Read/Grep about a');
    info('    graph it does not guarantee is fresh. Do not run it.');
    info('  · graphify-out/graph.html is ready — open it in any browser, no server.');
    info('    Communities are named "Community N" because naming needs an LLM.');
    info('    `--graphify-label` names them with the claude CLI, one call at a time.');
    if (subRepos.length) {
      info('  · this is a monorepo: ' + subRepos.length + ' gitignored sub-repo(s) were indexed');
      info('    separately and merged. Do NOT run `graphify update .` here — it');
      info('    re-extracts the root only and throws the sub-repos away.');
    }
    info('  · `graphify query "<question>"` — for STRUCTURAL questions (what calls');
    info('    what, type hierarchy, cross-package deps). That is where it beats Grep.');
    info('  · to LOCATE a file or symbol, Grep/Glob is cheaper than the graph.');
    info('  · the graph does not warn when it is stale — refresh it before trusting');
    info('    an answer after you have touched the code:');
    info(subRepos.length ? '      marvin --graphify --graphify-rebuild' : '      graphify update .');
  }
}

// ═══════════════════════════════════════════ 9. LEGADO (só se detectado)
const ORQUESTRADORES = [
  { arquivos: ['.swarm', '.claude-flow', '.hive-mind', 'agentdb.rvf', 'agentdb.rvf.lock', 'ruvector.db'],
    nome: 'claude-flow / ruflo' },
];
const legado = ORQUESTRADORES
  .map(o => ({ ...o, presentes: o.arquivos.filter(f => fs.existsSync(path.join(RAIZ, f))) }))
  .filter(o => o.presentes.length);

if (legado.length) {
  log('\n\x1b[1m9. Leftovers from an old orchestration tool\x1b[0m');
  for (const o of legado) {
    warn(o.nome + ':');
    o.presentes.forEach(f => info('  ' + f));
  }
  if (!LIMPAR) {
    info('run with --clean-legacy to remove them (the database is backed up first)');
  } else {
    const bkp = path.join(DOCS, '99_Backup');
    fsw.mkdirSync(bkp, { recursive: true });
    const db = path.join(RAIZ, '.swarm', 'memory.db');
    if (fs.existsSync(db)) {
      fsw.copyFileSync(db, path.join(bkp, 'orquestrador-memory.db.bak'));
      ok('database backed up to ' + path.relative(RAIZ, bkp));
      warn('BEFORE deleting, rescue the memory — it will not come out the official way:');
      info('  1. stop the daemon (the shutdown is what checkpoints the WAL)');
      info('  2. claude-flow`s `memory export` reports 0 even with data —');
      info('     it reads a different table than it writes. Do not trust it.');
      info('  3. real rescue: node --experimental-sqlite reading the table');
      info('     memory_entries, column `content`');
    }
    for (const o of legado) for (const f of o.presentes) {
      fsw.rmSync(path.join(RAIZ, f), { recursive: true, force: true });
      ok('removed ' + f);
    }
  }
}

// ═══════════════════════════════════════════ 10. ATUALIZAÇÕES DESDE A MONTAGEM
//
// O problema que este passo resolve: todo bloco de escrita é guardado por
// `if (!fs.existsSync(...))` — é o invariante 2, e sem ele rodar duas vezes
// duplicaria tudo. O efeito colateral é que arquivo que JÁ existe fica congelado
// na versão que o criou. Quem montou o projeto em julho e roda a versão de agosto
// não recebe nada: o script diz "já existe" e segue.
//
// Aqui ele confere, em cada arquivo que gera mas não sobrescreve, se os blocos que
// versões novas acrescentaram estão presentes — e avisa os que faltam. Ele NÃO
// reescreve: o arquivo é do humano e pode ter sido editado de propósito.
//
// Não existe arquivo de versão. A checagem lê o conteúdo real, porque um número de
// versão gravado é mais um artefato derivado — e artefato derivado envelhece em
// silêncio, que é a doença que este projeto inteiro combate.
const ATUALIZACOES = [
  { arquivo: '.claude/skills/README.md', marca: /Skill, agente ou command/i,
    o_que: 'the skill vs. agent vs. command discriminator (and the 2x rule)' },
  { arquivo: 'AGENTS.md', marca: /Higiene de sessão/i,
    o_que: 'the "Higiene de sessão" section — when to suggest a new chat' },
  { arquivo: 'AGENTS.md', marca: /##\s*Portabilidade/i,
    o_que: 'the "Portabilidade" table — what migrates between tools' },
  { arquivo: 'CLAUDE.md', marca: /Grafo de código/i, soCom: GRAPHIFY,
    o_que: 'the "Grafo de código" section (appears with --graphify)' },
  // Comando canônico só entra quando HÁ manifesto legível — `soCom` evita cobrar o bloco
  // de quem monta um repo sem stack detectável e ficaria com um aviso impossível de
  // resolver. Quem montou antes desta versão preencheu à mão (ou não preencheu).
  { arquivo: 'AGENTS.md', marca: /Comandos canônicos/, soCom: COMANDOS.length > 0,
    o_que: 'the "Comandos canônicos" table — install/test/build read from the manifest' },
  // A pasta de decisões existia desde sempre e nascia VAZIA. Quem montou antes desta
  // versão tem a pasta e nenhuma pista do que ela é — e é justamente quem já está
  // empilhando histórico no onde_paramos.md sem saber que havia outro lugar.
  { arquivo: path.relative(RAIZ, path.join(DOCS, '10_Decisoes', 'README.md')).replace(/\\/g, '/'),
    marca: /por que escolhemos isto/i,
    o_que: 'the decisions README — what belongs there instead of in onde_paramos.md' },
  { arquivo: 'AGENTS.md', marca: /A nota é curta; a decisão é imutável/,
    o_que: 'the "note is short, decision is immutable" rule — where overflow goes' },
  // Bloco novo em arquivo que já existe é exatamente o que este passo existe para pegar.
  // Sem esta marca, quem montou o projeto antes desta versão continua olhando para uma
  // pasta de agentes sem nenhuma pista de QUANTOS papéis o repositório dele pede.
  { arquivo: '.claude/agents/README.md', marca: /O que ESTE projeto sugere/,
    o_que: 'the "O que ESTE projeto sugere" section — how many roles this repo implies' },
  // Sem esta marca, quem montou o projeto antes do --check existir nunca fica sabendo
  // que ele existe — e é justamente quem já pode estar com a junction quebrada.
  { arquivo: 'CLAUDE.md', marca: /--check/,
    o_que: 'the `marvin --check` note — a junction broken by a moved folder is silent' },
  // O passo 8 só escreve o .gitignore quando ele NÃO existe, então um projeto
  // montado por versão antiga fica sem o bloco de segredos para sempre — e sem
  // aviso. É a pior variante da retrocompatibilidade: a que não commita `.env`
  // é uma linha, e a ausência dela não aparece até o dia em que aparece.
  { arquivo: '.gitignore', marca: /^\.env\s*$/m,
    o_que: 'the secrets block (.env, *.pem, *.key, **/credentials/)' },
];

const faltando = ATUALIZACOES.filter(a => {
  if (a.soCom === false) return false;
  const p = path.join(RAIZ, a.arquivo);
  if (!fs.existsSync(p)) return false; // não existe: os passos acima já criam
  try { return !a.marca.test(fs.readFileSync(p, 'utf8')); } catch { return false; }
});

if (faltando.length) {
  log('\n\x1b[1m10. Updates this project does not have yet\x1b[0m');
  log('   (the file already existed, so no step above touched it — that is deliberate)');
  for (const f of faltando) warn(f.arquivo + ' — missing ' + f.o_que);
  info('nothing was rewritten: these files are yours and may have been edited on purpose.');
  info('to see the current text of each block, generate a clean project in a throwaway');
  info('directory:  mkdir /tmp/marvin-ref && cd /tmp/marvin-ref && node <path>/marvin.mjs --no-git');
}

if (DRY) {
  log('\n\x1b[1m--dry-run — nothing was written\x1b[0m');
  if (!plano.length) log('   nothing to do: this project is already set up.');
  else {
    log('   ' + plano.length + ' operation(s) a real run would perform:\n');
    plano.forEach(p => info(p));
  }
  log('\n   run without --dry-run to apply.');
}

// O que fica para o humano. AGENTS.md primeiro, e o CLAUDE.md fora da lista de
// propósito: ele é ponteiro e já foi gerado. Mandar escrever estrutura e invariantes
// nele seria ensinar o oposto da arquitetura montada aqui.
// O --graphify não é sugerido em lugar nenhum durante a execução normal, e recurso que
// só existe no --help é recurso que ninguém descobre. A menção fica DEPOIS do que
// importa, é uma linha, e manda ler as ressalvas antes de adotar: o grafo é artefato
// derivado e envelhece em silêncio, então empurrá-lo seria contrariar o resto do script.
if (!GRAPHIFY) {
  log('\n\x1b[1mOptional, and never required:\x1b[0m');
  log('  --graphify builds a code graph for STRUCTURAL questions — what calls what,');
  log('  type hierarchy, cross-package deps. For finding a file, grep is cheaper.');
  log('  It needs graphify on PATH:  uv tool install graphifyy  ·  pipx install graphifyy');
  log('  Read the trade-offs in the README first — a stale graph answers with confidence.');
}

log('\n\x1b[1mLeft for you to write by hand:\x1b[0m');
log('  • AGENTS.md — real structure, invariants, traps, the team (the SOURCE)');
log("  • .claude/agents/*.md — the roles, with the scars of THIS codebase");
log("  • .claude/skills/*/SKILL.md — only procedures already run twice (see its README)");
log('  • ' + relMem + '/onde_paramos.md — the current state');
log('  Companion prompt: https://github.com/Josuebmota/Marvin/blob/main/PROMPT.md\n');
