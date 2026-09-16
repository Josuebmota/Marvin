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
 *     └── .marvin/                ← base de conhecimento, organizada como GRAFO
 *         ├── Contexto/           o que o projeto É
 *         │   ├── Sobre.md        nó raiz — liga aos fluxos
 *         │   ├── Fluxos/         um .md por fluxo, nasce quando um fluxo é analisado
 *         │   ├── Arquitetura/    como foi projetado; decisão estrutural mora aqui
 *         │   └── Design/         só se há front
 *         ├── Planejamento/       o que está sendo FEITO: Epic/ → Feature/ → US/
 *         │   ├── Manutencao/     cada nó tem um Sobre.md com estado, pai e Rumo
 *         │   └── Novos/
 *         ├── Fontes/             apoio e suporte (Externas.md: o que vive fora daqui)
 *         ├── Releases/           <versao>.md — índice do que subiu, com evidência
 *         └── Memoria/            ← memória, ARQUIVOS REAIS versionados
 *             └── onde_paramos.md a única porta; só ponteiros para as US ativas
 *
 *     Layout anterior (08_Memoria/, 10_Decisoes/…) continua detectado e NÃO é movido —
 *     mover é decisão do humano. O script só avisa. O porquê da mudança está em
 *     .marvin/10_Decisoes/organizacao-por-grafo.md deste repositório.
 *
 * PORTABILIDADE: o durável (AGENTS.md + .marvin/ + memória) é markdown puro e migra
 * inteiro para Codex, Cursor, Aider, Zed, opencode. Só o frontmatter dos agentes,
 * os slash commands e o auto-load da memória são do Claude Code — e desses, só o
 * auto-load some: os arquivos de memória ficam, porque moram no repositório.
 *
 * O truque central é a JUNCTION INVERTIDA:
 *
 *     ~/.claude/projects/<caminho>/memory  ──junction──►  .marvin/Memoria/
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
// `let`: sem a flag, a decisão sai do registro `.marvin/ferramentas.md` (bloco 0b).
let GRAPHIFY = temFlag('--graphify');
// Ponytail (plugin do Claude Code): não tem flag própria — só o registro decide (bloco
// 0b, `--use=ponytail`). Liga a seção no AGENTS.md e a tabela de papéis no agents/README.
let PONYTAIL = false;
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
// --use=graphify  [alias: --usar=]  flipa o registro para `sim` sem perguntar.
// --no-questions  [alias: --sem-perguntas]  assume `não` mesmo com terminal (CI, script).
// aceita --use=a,b e também --use=a --use=b — a flag repetida era engolida pelo find (15/09)
const USAR = new Set(process.argv.filter(a => a.startsWith('--use=') || a.startsWith('--usar='))
  .flatMap(a => a.split('=').slice(1).join('=').split(',')).map(s => s.trim().toLowerCase()).filter(Boolean));
const SEM_PERGUNTAS = temFlag('--no-questions', '--sem-perguntas');

// --tools=claude,codex,cursor  (default: claude)   [alias: --ferramentas=]
// Rodar de novo com outra lista ACRESCENTA o adaptador que falta; nada é removido.
const FERRAMENTAS_VALIDAS = ['claude', 'codex', 'copilot', 'cursor', 'aider', 'zed', 'opencode'];
const argFerr = process.argv.find(a => a.startsWith('--tools=') || a.startsWith('--ferramentas='));
const FERRAMENTAS = (argFerr ? argFerr.split('=').slice(1).join('=') : 'claude')
  .split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
const ferrInvalidas = FERRAMENTAS.filter(f => !FERRAMENTAS_VALIDAS.includes(f));

// --curto é saída de hook: sem cabeçalho e sem cor — vai direto para o contexto do agente.
const CURTO_HOOK = process.argv.includes('--curto');
const log = (s = '') => console.log(CURTO_HOOK ? String(s).replace(/\x1b\[[0-9;]*m/g, '') : s);
const ok = (s) => log('  \x1b[32m✓\x1b[0m ' + s);
const warn = (s) => log('  \x1b[33m!\x1b[0m ' + s);
const err = (s) => log('  \x1b[31m✗\x1b[0m ' + s);
const info = (s) => log('    ' + s);
const okReal = ok, infoReal = info, warnReal = warn;

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
  --graphify        build a code graph for structural queries (needs graphify on PATH).
                    Without the flag marvin asks once (only with a terminal) and records
                    the answer in .marvin/ferramentas.md; later runs read the record.
                    indexes gitignored sub-repos separately and merges them, so a
                    monorepo does not end up with a graph missing all of its code
  --graphify-label  name the graph communities using the \`claude\` CLI on PATH.
                    Off by default: one call at a time, so it costs minutes and quota
  --graphify-rebuild  rebuild an existing graph (the default never overwrites one)
  --graphify-git-hook  write .git/hooks/post-commit so the graph refreshes itself.
                    Never overwrites a post-commit you already have
  --use=<tool>      record \`sim\` for an optional tool without asking (alias: --usar=)
  --no-questions    assume \`não\` for every optional tool, even with a terminal
  --status          dashboard, read-only: active USs with their last Rumo, progress per
                    Epic, last release, fixed context, graph age. Exits non-zero when the
                    note and the nodes disagree. Run it when you open a session
     --curto        only active USs and warnings, always exit 0 — for the session hook
     --html         also writes .marvin/.status/index.html and records one point per
                    commit in historico.jsonl: the trend of fixed context, USs, graph age
  --us <caminho>    open a US: Novos|Manutencao/<Epic>/<Feature>/<US> — creates the
                    Sobre.md chain that is missing and adds the pointer to the note
  --fechar          read-only: what changed in git (uncommitted + today's commits) and is
                    in NO active US's "Código tocado" — the map is incomplete or the work
                    leaked. /fechar runs it
  --release <v>     close the cycle: every US with estado: concluida that is in no
                    Releases/*.md goes into Releases/<v>.md (Evidência required) and
                    leaves the note. No tag, no commit — it prints the git tag to run
  --migrar          old layout (08_Memoria/, 10_Decisoes/) → graph layout. Backs up,
                    moves, rewrites paths; what takes judgment is listed at the end
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
const ehVault = (d) => fs.existsSync(path.join(d, 'Memoria')) || fs.existsSync(path.join(d, '08_Memoria'))
  || fs.existsSync(path.join(d, '.obsidian'));
const DOCS = CANDIDATOS.find(ehVault) || path.join(RAIZ, '.marvin');
// Layout antigo: pastas numeradas por tipo (08_Memoria/, 10_Decisoes/). Desde a
// organização por grafo a memória mora em Memoria/. Projeto montado antes continua
// funcionando no lugar onde está — a junction aponta para onde as notas ESTÃO, e
// mover é decisão do humano (invariante 1). O passo 5 avisa; nada mais.
const LAYOUT_ANTIGO = fs.existsSync(path.join(DOCS, '08_Memoria')) && !fs.existsSync(path.join(DOCS, 'Memoria'));
const DEST = path.join(DOCS, LAYOUT_ANTIGO ? '08_Memoria' : 'Memoria');
// Worktree: `.git` é ARQUIVO (`gitdir: …`), não pasta. A memória segue o cwd, então cada
// worktree tem a sua — e ela anda com o branch, de propósito (US-13). O que não pode é a
// sessão abrir lá sem ninguém ter rodado `marvin`: aí o Claude Code cria um diretório real
// e vazio no caminho novo, e a memória some em silêncio. O hook --status --curto acusa.
const WORKTREE = (() => { try { return fs.statSync(path.join(RAIZ, '.git')).isFile(); } catch { return false; } })();
const ehJunction = (p) => { try { return fs.lstatSync(p).isSymbolicLink(); } catch { return false; } };

// ── O que carrega em TODA sessão, sem ninguém pedir: a fonte (AGENTS.md), o adaptador
// (CLAUDE.md, que faz @AGENTS.md) e a nota (pela junction). Medido em três projetos
// reais: a fonte era o dobro da nota num, e CINCO vezes noutro — e a régua antiga só
// media a nota. Teto é para o que carrega sozinho; o resto da base cresce à vontade
// e custa zero por sessão. ~4 chars por token: estimativa, serve para ordem de grandeza.
// Mora aqui em cima porque o --check imprime a mesma conta.
const emTokens = (chars) => Math.round(chars / 4);
const TETO_NOTA = 6 * 1024;      // o dobro de uma nota bem-formada de referência (3,3 KB)
const TETO_FIXO_TK = 6000;       // os três somados; acima disso a sessão começa pesada
// Cinco fontes, não três — a segunda medição (11/09) achou duas que a primeira ignorava:
// o MEMORY.md (índice da memória, que o Claude Code carrega inteiro pela junction) e o
// nível GLOBAL (~/.claude/CLAUDE.md + rules/**/*.md), que entra em TODO projeto. Num
// projeto real eram 2.900 tk invisíveis num total de 11.700.
const contextoFixo = () => {
  const globalDir = path.join(os.homedir(), '.claude');
  const arqs = [['AGENTS.md', path.join(RAIZ, 'AGENTS.md')],
                ['CLAUDE.md', path.join(RAIZ, 'CLAUDE.md')],
                ['onde_paramos.md', path.join(DEST, 'onde_paramos.md')],
                ['MEMORY.md (memory index)', path.join(DEST, 'MEMORY.md')],
                ['~/.claude/CLAUDE.md (GLOBAL)', path.join(globalDir, 'CLAUDE.md')]];
  const linhas = [];
  for (const [nome, p] of arqs) {
    let bytes = 0; try { bytes = fs.statSync(p).size; } catch { continue; }
    linhas.push({ nome, bytes, tk: emTokens(bytes) });
  }
  // rules/**/*.md: lido em toda sessão de todo projeto — EXCETO o que tem `paths:` no
  // frontmatter, que só entra quando um arquivo casado é tocado. Contar esses seria
  // inflar a conta com o que não carrega; a régua só vale se for justa.
  let regras = 0, nRegras = 0, nCond = 0;
  (function varrer(d, prof = 0) {
    if (prof > 4) return;
    let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const q = path.join(d, e.name);
      if (e.isDirectory()) { varrer(q, prof + 1); continue; }
      if (!e.name.endsWith('.md')) continue;
      let txt = ''; try { txt = fs.readFileSync(q, 'utf8'); } catch { continue; }
      const fm = txt.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (fm && /^paths:/m.test(fm[1])) { nCond++; continue; }
      regras += Buffer.byteLength(txt); nRegras++;
    }
  })(path.join(globalDir, 'rules'));
  if (nRegras) linhas.push({ nome: `~/.claude/rules/**/*.md (GLOBAL, ${nRegras} always-on${nCond ? `; ${nCond} path-scoped not counted` : ''})`, bytes: regras, tk: emTokens(regras) });
  return { linhas, total: linhas.reduce((a, l) => a + l.tk, 0) };
};
const imprimirContextoFixo = () => {
  const { linhas, total } = contextoFixo();
  if (!linhas.length) return;
  for (const l of linhas) info(`${String(l.tk).padStart(6)} tk  ${l.nome}`);
  info(`${String(total).padStart(6)} tk  loads in EVERY session, before the first word`);
  const globalTk = linhas.filter(l => /GLOBAL/.test(l.nome)).reduce((a, l) => a + l.tk, 0);
  if (globalTk > 1000) warn(`~${globalTk} tk of that is GLOBAL — paid in every session of EVERY project. Rules you do not use there are the cheapest cut you have.`);
  if (total > TETO_FIXO_TK) warn(`~${total} tk of fixed context — above ~${TETO_FIXO_TK}. What is not needed at the START of a session has a home elsewhere:`);
  const nota = linhas.find(l => l.nome === 'onde_paramos.md');
  if (nota && nota.bytes > TETO_NOTA) {
    warn(`onde_paramos.md is ${Math.round(nota.bytes / 1024)} KB (~${nota.tk} tk) — it is a list of pointers, not a report`);
    info(LAYOUT_ANTIGO
      ? '  it answers three questions and no more: where we stopped · what to do now · what is stuck.'
      : '  one line per active US, linking to its Sobre.md. The state of the US lives in the US.');
  }
  if (total > TETO_FIXO_TK || (nota && nota.bytes > TETO_NOTA)) {
    const d = (x) => path.relative(RAIZ, path.join(DOCS, x)).replace(/\\/g, '/');
    if (LAYOUT_ANTIGO) {
      info(`    a decision that still explains a choice  → ${d('10_Decisoes')}/<slug>.md`);
    } else {
      info(`    how a flow works                         → ${d('Contexto/Fluxos')}/<fluxo>.md`);
      info(`    how the project is built, and why        → ${d('Contexto/Arquitetura')}/`);
      info(`    the state and the decisions of one US    → its Sobre.md under ${d('Planejamento')}/`);
    }
    info('    a log of what was done                   → git log');
  }
};
const contarNotas = (d) => { try { return fs.readdirSync(d).filter(f => f.endsWith('.md')).length; } catch { return 0; } };

if (!CURTO_HOOK) {
  log('\n\x1b[1mmarvin\x1b[0m — ' + RAIZ);
  log('agent memory: ' + MEM + '\n');
}

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

  log('');
  imprimirContextoFixo();

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

// ── Leitura de nós. Todo Sobre.md tem frontmatter (tipo, estado, pai), um título e uma
// seção Rumo com entradas "- **dd/mm/aaaa** — …". É tudo que --status e --us precisam.
const lerNo = (arq) => {
  let txt; try { txt = fs.readFileSync(arq, 'utf8'); } catch { return null; }
  const fm = txt.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const campo = (k) => { const m = fm && fm[1].match(new RegExp('^' + k + ':[ \\t]*(.+)$', 'm')); return m ? m[1].trim().replace(/\s+#.*$/, '') : null; };
  const titulo = ((txt.match(/^#\s+(.+)$/m) || [])[1] || path.basename(path.dirname(arq))).trim();
  const rumo = [...txt.matchAll(/^- \*\*(\d{2})\/(\d{2})\/(\d{4})[^*]*\*\*[ —-]*(.*)$/gm)]
    .map(m => ({ data: new Date(+m[3], +m[2] - 1, +m[1]), texto: m[4].trim() }));
  const evidencia = (txt.match(/^##\s+Evidência\s*\n([\s\S]*?)(?=^##\s|(?![\s\S]))/m) || [])[1] || '';
  const evidenciaLimpa = evidencia.replace(/<!--[\s\S]*?-->/g, '').replace(/_\([^)]*\)_/g, '').trim();
  return { arq, tipo: campo('tipo'), estado: campo('estado'), pai: campo('pai'), titulo, rumo,
           evidencia: evidenciaLimpa, comEvidencia: /\S/.test(evidenciaLimpa) };
};
const nosDoPlanejamento = () => {
  const nos = [];
  (function varrer(d, prof = 0) {
    if (prof > 8) return;
    let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) varrer(p, prof + 1);
      else if (e.name === 'Sobre.md') { const n = lerNo(p); if (n && n.tipo) nos.push(n); }
    }
  })(path.join(DOCS, 'Planejamento'));
  return nos;
};
const dias = (d) => Math.floor((Date.now() - d.getTime()) / 86400000);  // só para exibir; --status não escreve nada

// ── Tokens GASTOS, por modelo — lidos das transcrições do Claude Code. O 4b mede o que
// carrega; isto mede o que foi pago. O dado é fato: cada resposta do agente fica em
// ~/.claude/projects/<projeto>/*.jsonl com `model` e `usage`. Só a conversão em dinheiro é
// estimativa, e a tabela abaixo envelhece — por isso vem datada e a saída diz "confira".
//
// Dedupe por id de mensagem: a mesma resposta é gravada mais de uma vez enquanto streama
// (3× por id neste repositório), e a última tem o usage completo. Sub-agentes
// (`isSidechain`) contam — foram pagos — e aparecem separados.
const PRECOS_DATA = '2026-09';   // USD por milhão de tokens: input · output · cache write · cache read
const PRECOS = [
  [/fable|mythos/, { in: 10, out: 50, cw: 12.5, cr: 1 }],
  [/opus/,         { in: 5,  out: 25, cw: 6.25, cr: 0.5 }],
  [/sonnet/,       { in: 2,  out: 10, cw: 2.5,  cr: 0.2 }],
  [/haiku/,        { in: 1,  out: 5,  cw: 1.25, cr: 0.1 }],
];
const precoDe = (modelo) => (PRECOS.find(([re]) => re.test(modelo)) || PRECOS[1])[1];
const custoDe = (t, modelo) => { const p = precoDe(modelo); return (t.in * p.in + t.out * p.out + t.cw * p.cw + t.cr * p.cr) / 1e6; };
const calcularGastos = () => {
  const dir = path.dirname(MEM);   // ~/.claude/projects/<slug>/
  let arqs = []; try { arqs = fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')); } catch {}
  const porId = new Map();
  for (const f of arqs) {
    let txt; try { txt = fs.readFileSync(path.join(dir, f), 'utf8'); } catch { continue; }
    for (const linha of txt.split('\n')) {
      if (!linha.includes('"usage"')) continue;
      let o; try { o = JSON.parse(linha); } catch { continue; }
      const m = o.message; if (!m || !m.usage || o.type !== 'assistant') continue;
      const u = m.usage;
      porId.set(m.id || o.uuid, { modelo: m.model || '?', dia: (o.timestamp || '').slice(0, 10), sessao: o.sessionId || f, sub: !!o.isSidechain,
        in: u.input_tokens || 0, out: u.output_tokens || 0, cw: u.cache_creation_input_tokens || 0, cr: u.cache_read_input_tokens || 0 });
    }
  }
  const zero = () => ({ in: 0, out: 0, cw: 0, cr: 0, msgs: 0 });
  const soma = (a, b) => { a.in += b.in; a.out += b.out; a.cw += b.cw; a.cr += b.cr; a.msgs++; };
  const total = zero(), sub = zero(), porModelo = {}, porDia = {}, sessoes = new Set();
  let contextoAcum = 0;
  for (const r of porId.values()) {
    soma(total, r); if (r.sub) soma(sub, r);
    (porModelo[r.modelo] = porModelo[r.modelo] || zero()); soma(porModelo[r.modelo], r);
    (porDia[r.dia] = porDia[r.dia] || zero()); soma(porDia[r.dia], r);
    sessoes.add(r.sessao);
    contextoAcum += r.in + r.cw + r.cr;
  }
  let custo = 0; for (const [m, t] of Object.entries(porModelo)) custo += custoDe(t, m);
  const contextoMedio = total.msgs ? Math.round(contextoAcum / total.msgs) : 0;
  return { total, sub, porModelo, porDia, sessoes: sessoes.size, custo, contextoMedio, transcricoes: arqs.length };
};
const kTk = (n) => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? Math.round(n / 1e3) + 'k' : String(n);
const imprimirGastos = (g, fixoTk) => {
  log('\n\x1b[1mTokens spent\x1b[0m  (from the Claude Code transcripts of this project — measured, not estimated)');
  if (!g.total.msgs) { info('none found in ' + path.dirname(MEM)); return; }
  info(`${g.sessoes} session(s), ${g.total.msgs} model turns` + (g.sub.msgs ? ` (${g.sub.msgs} by subagents)` : ''));
  for (const [m, t] of Object.entries(g.porModelo).sort((a, b) => b[1].cr + b[1].in - (a[1].cr + a[1].in)))
    info(`${m.padEnd(18)} ${kTk(t.in).padStart(6)} in  ${kTk(t.cw).padStart(6)} cache-write  ${kTk(t.cr).padStart(7)} cache-read  ${kTk(t.out).padStart(6)} out  ≈ $${custoDe(t, m).toFixed(2)}`);
  info(`≈ $${g.custo.toFixed(2)} total at ${PRECOS_DATA} list prices — an estimate; check the current price table`);
  if (fixoTk && g.contextoMedio) {
    const fatia = Math.min(100, Math.round(100 * fixoTk / g.contextoMedio));
    info(`each turn re-reads ~${kTk(g.contextoMedio)} tk of context; the fixed context is ~${fatia}% of it — that is what the 4b measures, paid every turn`);
  }
};

// ── O lado dos docs do grafo, como função: o 8b anexa ao graph.json, o --status --html
// desenha. `ids` são os nós de código que existem (vazio sem graphify: aí só doc↔doc).
const grafoDosDocs = (ids, subRepos = []) => {
  const idDe = (rel) => rel.replace(/\\/g, '/').replace(/\.[^./]+$/, '')
    .replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
  const limpar = (txt) => txt.replace(/```[\s\S]*?```/g, '').replace(/<!--[\s\S]*?-->/g, '');
  const docs = [];
  (function varrerDocs(dir, prof = 0) {
    if (prof > 8) return;
    let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      // 99_Backup/ e historico/ ficam fora do caminho de leitura — e do grafo.
      if (e.name.startsWith('.') || e.name === '99_Backup' || e.name === 'historico') continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { varrerDocs(p, prof + 1); continue; }
      if (e.name.endsWith('.md')) docs.push(p);
    }
  })(DOCS);

  const novosNos = [], novasArestas = [], avisos = [], porNome = new Map();
  const relDe = (abs) => path.relative(RAIZ, abs).replace(/\\/g, '/');

  for (const arq of docs) {
    const rel = relDe(arq);
    const id = idDe(rel);
    let txt; try { txt = fs.readFileSync(arq, 'utf8'); } catch { continue; }
    const fm = txt.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const campo = (k) => { const m = fm && fm[1].match(new RegExp('^' + k + ':[ \\t]*(.+)$', 'm')); return m ? m[1].trim().replace(/\s+#.*$/, '') : null; };
    const titulo = (txt.match(/^#\s+(.+)$/m) || [])[1] || path.basename(arq, '.md');
    const no = { id, label: titulo.trim(), file_type: 'doc', source_file: rel, source_location: 'L1', _origin: 'marvin' };
    const tipo = campo('tipo'), estado = campo('estado');
    if (tipo) no.tipo = tipo;
    if (estado) no.estado = estado;
    novosNos.push(no);
    ids.add(id);
    // [[wikilink]] resolve por nome de arquivo ou pelo `name:` do frontmatter —
    // é como vault de notas liga, e base migrada de lá vem cheia deles.
    porNome.set(path.basename(arq, '.md').toLowerCase(), id);
    const nome = campo('name'); if (nome) porNome.set(nome.replace(/^["']|["']$/g, '').toLowerCase(), id);
  }

  for (const arq of docs) {
    const rel = relDe(arq);
    const id = idDe(rel);
    const aresta = (source, target, relation) => novasArestas.push({ source, target, relation, confidence: 'EXTRACTED',
      source_file: rel, source_location: 'L1', weight: 1, _origin: 'marvin' });
    let txt; try { txt = fs.readFileSync(arq, 'utf8'); } catch { continue; }
    const corpo = limpar(txt);
    const fm = corpo.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const pai = fm && (fm[1].match(/^pai:[ \t]*(.+)$/m) || [])[1];
    if (pai) {
      const alvo = path.resolve(path.dirname(arq), pai.trim());
      if (fs.existsSync(alvo)) aresta(id, idDe(relDe(alvo)), 'child_of');
      else avisos.push(rel + ': pai → ' + pai.trim() + ' does not exist');
    }
    // links relativos
    for (const m of corpo.matchAll(/\[[^\]]*\]\(([^)\s#]+)(?:#[^)]*)?\)/g)) {
      const href = m[1];
      if (/^[a-z]+:/i.test(href)) continue;           // http, mailto…
      const alvo = path.resolve(path.dirname(arq), href);
      if (!fs.existsSync(alvo)) continue;             // link quebrado é assunto de outro passo
      const alvoRel = relDe(alvo);
      if (alvoRel.startsWith('..')) continue;
      const alvoId = idDe(alvoRel);
      if (alvo.endsWith('.md') && alvoRel.startsWith(relDe(DOCS))) aresta(id, alvoId, 'references');
      else if (ids.has(alvoId)) aresta(id, alvoId, 'touches');
    }
    for (const m of corpo.matchAll(/\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g)) {
      const alvoId = porNome.get(m[1].trim().toLowerCase());
      if (alvoId && alvoId !== id) aresta(id, alvoId, 'references');
    }
    // ## Código tocado
    const sec = corpo.match(/^##\s+Código tocado\s*\n([\s\S]*?)(?=^##\s|(?![\s\S]))/m);
    if (sec) {
      for (const m of sec[1].matchAll(/^[ \t]*[-*][ \t]*`([^`]+)`(?:[ \t]*[—-]+[ \t]*`([^`]+)`)?/gm)) {
        const arqCod = m[1].trim(), fn = m[2] && m[2].trim().replace(/\(\)$/, '');
        const arqId = idDe(arqCod);
        const alvoId = fn ? arqId + '_' + fn.replace(/[^A-Za-z0-9]+/g, '_').toLowerCase() : arqId;
        if (ids.has(alvoId)) { aresta(id, alvoId, 'touches'); continue; }
        if (!fs.existsSync(path.join(RAIZ, arqCod))) avisos.push(rel + ': `' + arqCod + '` does not exist in the repository');
        else if (!ids.has(arqId)) avisos.push(rel + ': `' + arqCod + '` is not in the graph — rebuild it (' + (subRepos.length ? 'marvin --graphify --graphify-rebuild' : 'graphify update .') + ')');
        else avisos.push(rel + ': `' + fn + '` is not in `' + arqCod + '` — renamed?');
      }
    }
  }

  return { novosNos, novasArestas, avisos };
};

// ── O grafo a serviço do Marvin. Medido em 14/09: em 23.745 turnos de agente nos quatro
// projetos, o grafo foi consultado DUAS vezes — as duas em teste. "Consulta, nunca hook"
// virou "nunca". A pergunta estrutural não aparece como pergunta na hora de trabalhar;
// então quem pergunta é o script, nos momentos que ele já controla:
//   --us       Impacto: quem chama o que a US toca, e que outras US passam por ali
//   --status   Colisão: duas US ativas na mesma função/arquivo · Dispersão: US em N comunidades
//   --fechar   Deriva: o diff tocou arquivo que não está no "Código tocado" de nenhuma US ativa
// Tudo determinístico, zero LLM. O graphify fez a extração; o script liga a resposta ao nó.
const carregarGrafo = () => {
  const p = path.join(RAIZ, 'graphify-out', 'graph.json');
  let g; try { g = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
  const nos = new Map((g.nodes || []).map(n => [n.id, n]));
  const arestas = g.links || g.edges || [];
  const chamadores = new Map();   // alvo → [quem chama/importa/estende]
  const contidoEm = new Map();    // função → arquivo
  for (const e of arestas) {
    if (/^(calls|indirect_call|imports|imports_from|uses|extends|inherits|implements|requires)$/.test(e.relation)) {
      if (!chamadores.has(e.target)) chamadores.set(e.target, []);
      chamadores.get(e.target).push(e.source);
    }
    if (e.relation === 'contains') contidoEm.set(e.target, e.source);
  }
  return { nos, arestas, chamadores, contidoEm, mtime: fs.statSync(p).mtime };
};
// Que nós de código cada US toca — pelo mesmo parser do 8b. Devolve Map usId → {no, ids}.
const tocadoPorUS = (grafo) => {
  const ids = new Set(grafo ? grafo.nos.keys() : []);
  const { novosNos, novasArestas } = grafoDosDocs(ids);
  const us = new Map();
  for (const n of novosNos) if (n.tipo === 'us') us.set(n.id, { no: n, ids: new Set() });
  for (const e of novasArestas) if (e.relation === 'touches' && us.has(e.source)) us.get(e.source).ids.add(e.target);
  return us;
};
const rotuloNo = (grafo, id) => { const n = grafo && grafo.nos.get(id); return n ? (n.label || id) + (n.source_file ? '  ' + n.source_file + (n.source_location ? ':' + n.source_location : '') : '') : id; };

// Impacto de uma US: quem depende do que ela toca (2 níveis), e que outras US tocam o mesmo.
const impactoDaUS = (grafo, todas, usId) => {
  const alvo = todas.get(usId); if (!alvo || !grafo) return null;
  const dependentes = new Map();   // id → nível
  let fronteira = [...alvo.ids];
  for (let nivel = 1; nivel <= 2 && fronteira.length; nivel++) {
    const prox = [];
    for (const id of fronteira) for (const c of grafo.chamadores.get(id) || []) {
      if (alvo.ids.has(c) || dependentes.has(c)) continue;
      dependentes.set(c, nivel); prox.push(c);
    }
    fronteira = prox;
  }
  const outras = [];
  for (const [id, o] of todas) {
    if (id === usId) continue;
    const comum = [...o.ids].filter(x => alvo.ids.has(x) || dependentes.has(x));
    if (comum.length) outras.push({ us: o.no, comum });
  }
  const comunidades = new Set([...alvo.ids].map(id => (grafo.nos.get(id) || {}).community).filter(c => c !== undefined));
  return { tocados: [...alvo.ids], dependentes: [...dependentes], outras, comunidades: [...comunidades] };
};

// ── --status --html. Um `index.html` único, regerado a cada run, com a série embutida
// (`file://` bloqueia fetch, então nada de JSON separado lido pela página). O histórico
// mora em `.marvin/.status/historico.jsonl`, uma linha por COMMIT — a data vem do
// `git log -1 --format=%cI`, não de `Date.now()`, então dois runs no mesmo commit não
// duplicam. Tudo em pasta ignorada pelo git: é derivado, e derivado envelhece em silêncio.
// SVG pré-renderizado aqui, sem JS na página: abre sem rede, sem lib, em qualquer coisa.
const escreverStatusHtml = (st, silencioso = false) => {
  const ok = silencioso ? () => {} : okReal, info = silencioso ? () => {} : infoReal, warn = silencioso ? () => {} : warnReal;
  const dir = path.join(DOCS, '.status');
  const jsonl = path.join(dir, 'historico.jsonl');
  fsw.mkdirSync(dir, { recursive: true });
  // .gitignore: a mesma disciplina do graphify-out/
  const relStatus = path.relative(RAIZ, dir).replace(/\\/g, '/') + '/';
  const gi = path.join(RAIZ, '.gitignore');
  if (fs.existsSync(gi)) {
    const txt = fs.readFileSync(gi, 'utf8');
    if (!txt.split(/\r?\n/).some(l => l.trim() === relStatus || l.trim() === relStatus.replace(/\/$/, ''))) {
      fsw.appendFileSync(gi, (txt.endsWith('\n') ? '' : '\n') + '\n# status do marvin: DERIVADO, não versionar\n' + relStatus + '\n');
      ok(relStatus + ' added to .gitignore');
    }
  }
  // a série
  let commit = null, data = null;
  try {
    const out = execSync('git log -1 --format=%h%x09%cI', { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    [commit, data] = out.split('\t');
  } catch {}
  let serie = [];
  try { serie = fs.readFileSync(jsonl, 'utf8').split(/\r?\n/).filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean); } catch {}
  const tk = Object.fromEntries(st.contexto.linhas.map(l => [l.nome.replace(/\s.*$/, ''), l.tk]));
  const ponto = { commit, data, total: st.contexto.total, tk, us_ativas: st.ativas.filter(a => a.estado === 'ativa').length,
                  us_concluidas: st.nos.concluidas, us_total: st.nos.us, problemas: st.problemas,
                  grafo_nos: st.grafo ? st.grafo.nos : null, grafo_mtime: st.grafo ? st.grafo.mtime : null,
                  gasto_tk: st.gastos.total.in + st.gastos.total.cw + st.gastos.total.cr + st.gastos.total.out, custo: +st.gastos.custo.toFixed(2), turnos: st.gastos.total.msgs };
  if (!commit) warn('no git here — the series is not recorded (the page is built from what exists)');
  else if (serie.length && serie[serie.length - 1].commit === commit) info('historico.jsonl — this commit is already recorded (' + serie.length + ' point(s))');
  else {
    serie.push(ponto);
    if (serie.length > 500) serie = serie.slice(-500);
    fsw.writeFileSync(jsonl, serie.map(p => JSON.stringify(p)).join('\n') + '\n');
    ok('historico.jsonl — point recorded for ' + commit + ' (' + serie.length + ' total)');
  }
  const pts = serie.length ? serie : [ponto];

  // gráficos: polyline pré-renderizada. Uma função, três usos.
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const grafico = (titulo, series, fmt = (v) => v) => {
    const W = 640, H = 200, PL = 46, PR = 12, PT = 18, PB = 28;
    const n = pts.length;
    const vals = series.flatMap(s => s.v).filter(v => v !== null && v !== undefined);
    const max = Math.max(1, ...vals), min = 0;
    const x = (i) => n < 2 ? (PL + W - PR) / 2 : PL + (i / (n - 1)) * (W - PL - PR);
    const y = (v) => PT + (1 - (v - min) / (max - min)) * (H - PT - PB);
    const ticks = [0, 0.5, 1].map(f => min + f * (max - min));
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(titulo)}">`;
    for (const t of ticks) svg += `<line x1="${PL}" y1="${y(t).toFixed(1)}" x2="${W - PR}" y2="${y(t).toFixed(1)}" class="grid"/><text x="${PL - 6}" y="${(y(t) + 4).toFixed(1)}" class="tick" text-anchor="end">${esc(fmt(Math.round(t)))}</text>`;
    series.forEach((s, k) => {
      const p = s.v.map((v, i) => v === null || v === undefined ? null : `${x(i).toFixed(1)},${y(v).toFixed(1)}`).filter(Boolean);
      if (p.length > 1) svg += `<polyline points="${p.join(' ')}" class="s${k}"/>`;
      p.forEach(q => { const [cx, cy] = q.split(','); svg += `<circle cx="${cx}" cy="${cy}" r="2.5" class="s${k}"/>`; });
    });
    const rot = (i) => (pts[i].data || '').slice(5, 10) + (pts[i].commit ? ' ' + pts[i].commit : '');
    if (n) svg += `<text x="${PL}" y="${H - 8}" class="tick">${esc(rot(0))}</text>`;
    if (n > 1) svg += `<text x="${W - PR}" y="${H - 8}" class="tick" text-anchor="end">${esc(rot(n - 1))}</text>`;
    svg += '</svg>';
    const legenda = series.map((s, k) => `<span class="lg s${k}">${esc(s.nome)}</span>`).join(' ');
    return `<figure><figcaption>${esc(titulo)} ${legenda}</figcaption>${svg}</figure>`;
  };
  const idadeGrafo = (p) => p.grafo_mtime && p.data ? Math.max(0, Math.round((new Date(p.data) - new Date(p.grafo_mtime)) / 86400000)) : null;
  const gContexto = grafico('Contexto fixo por commit (tk)', [
    { nome: 'total', v: pts.map(p => p.total) },
    { nome: 'AGENTS.md', v: pts.map(p => p.tk && p.tk['AGENTS.md'] != null ? p.tk['AGENTS.md'] : null) },
    { nome: 'nota', v: pts.map(p => p.tk && p.tk['onde_paramos.md'] != null ? p.tk['onde_paramos.md'] : null) },
  ]);
  const gUS = grafico('US ativas × concluídas', [
    { nome: 'ativas (na nota)', v: pts.map(p => p.us_ativas) },
    { nome: 'concluídas (nos nós)', v: pts.map(p => p.us_concluidas) },
  ]);
  const gGrafo = grafico('Idade do grafo no commit (dias)', [{ nome: 'dias desde a extração', v: pts.map(idadeGrafo) }]);
  const gCusto = grafico('Custo acumulado por commit (USD, estimado)', [{ nome: 'USD', v: pts.map(p => p.custo == null ? null : p.custo) }]);
  // por dia: o que foi lido (in + cache) e o que foi escrito — do transcript, não da série
  const dias = Object.keys(st.gastos.porDia).filter(Boolean).sort();
  const g = st.gastos;
  const barras = (() => {
    if (!dias.length) return '';
    const W = 640, H = 200, PL = 46, PR = 12, PT = 18, PB = 28;
    const vals = dias.map(d => g.porDia[d].in + g.porDia[d].cw + g.porDia[d].cr);
    const max = Math.max(1, ...vals);
    const bw = (W - PL - PR) / dias.length;
    const y = (v) => PT + (1 - v / max) * (H - PT - PB);
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="tokens lidos por dia">`;
    [0, 0.5, 1].forEach(f => { svg += `<line x1="${PL}" y1="${y(f * max).toFixed(1)}" x2="${W - PR}" y2="${y(f * max).toFixed(1)}" class="grid"/><text x="${PL - 6}" y="${(y(f * max) + 4).toFixed(1)}" class="tick" text-anchor="end">${kTk(Math.round(f * max))}</text>`; });
    dias.forEach((d, i) => { const v = vals[i]; svg += `<rect x="${(PL + i * bw + 1).toFixed(1)}" y="${y(v).toFixed(1)}" width="${Math.max(1, bw - 2).toFixed(1)}" height="${(H - PB - y(v)).toFixed(1)}" class="s0"><title>${esc(d)}: ${kTk(v)} lidos · ${kTk(g.porDia[d].out)} escritos · ${g.porDia[d].msgs} turnos</title></rect>`; });
    svg += `<text x="${PL}" y="${H - 8}" class="tick">${esc(dias[0])}</text>`;
    if (dias.length > 1) svg += `<text x="${W - PR}" y="${H - 8}" class="tick" text-anchor="end">${esc(dias[dias.length - 1])}</text>`;
    return `<figure><figcaption>Tokens lidos por dia (input + cache) <span class="lg s0">passe o mouse para ver o dia</span></figcaption>${svg}</svg></figure>`;
  })();
  const fatiaFixo = g.contextoMedio ? Math.min(100, Math.round(100 * st.contexto.total / g.contextoMedio)) : null;
  const tabelaModelos = Object.entries(g.porModelo).sort((a, b) => b[1].cr + b[1].in - (a[1].cr + a[1].in)).map(([m, t]) =>
    `<tr><td></td><td>${esc(m)}</td><td>${kTk(t.in)}</td><td>${kTk(t.cw)}</td><td>${kTk(t.cr)}</td><td>${kTk(t.out)}</td><td>${t.msgs}</td><td>≈ $${custoDe(t, m).toFixed(2)}</td></tr>`).join('');

  // ── A rede: a base de conhecimento como grafo, colorida por estado. Nós de doc vêm do
  // mesmo `grafoDosDocs` que o 8b anexa; nós de código entram só quando uma US os toca
  // (o graph.json inteiro tem milhares — seria ruído). Layout de força em JS inline, sem
  // lib, posições iniciais determinísticas (espiral), para a página abrir igual sempre.
  const rede = (() => {
    const GRAFO_R = path.join(RAIZ, 'graphify-out', 'graph.json');
    let codigo = new Map();
    try { const gj = JSON.parse(fs.readFileSync(GRAFO_R, 'utf8')); for (const n of gj.nodes || []) if (n._origin !== 'marvin') codigo.set(n.id, n); } catch {}
    const { novosNos, novasArestas } = grafoDosDocs(new Set(codigo.keys()));
    const relDocs = path.relative(RAIZ, DOCS).replace(/\\/g, '/');
    const nos = new Map();
    for (const n of novosNos) {
      const rel = n.source_file;
      let cat = 'doc';
      if (n.tipo === 'epic' || n.tipo === 'feature' || n.tipo === 'us') cat = n.tipo;
      else if (rel.startsWith(relDocs + '/Contexto/Fluxos/')) cat = 'fluxo';
      else if (rel.startsWith(relDocs + '/Contexto/Arquitetura/')) cat = 'arquitetura';
      else if (rel.endsWith('/Contexto/Sobre.md')) cat = 'raiz';
      else if (rel.startsWith(relDocs + '/Releases/')) cat = 'release';
      else if (rel.startsWith(relDocs + '/Memoria/')) cat = 'nota';
      if (/README\.md$/.test(rel) && cat === 'doc') continue;   // READMEs de formato: não são conhecimento
      nos.set(n.id, { id: n.id, rotulo: n.label.replace(/\s+—.*$/, '').slice(0, 40), cat, estado: n.estado || null, arq: rel });
    }
    const arestas = [];
    for (const e of novasArestas) {
      if (!nos.has(e.source)) continue;
      if (!nos.has(e.target)) {
        const c = codigo.get(e.target); if (!c) continue;
        nos.set(c.id, { id: c.id, rotulo: (c.label || c.id).slice(0, 40), cat: /\(\)$/.test(c.label || '') ? 'funcao' : 'arquivo', estado: null, arq: c.source_file || '' });
      }
      arestas.push({ s: e.source, t: e.target, r: e.relation });
    }
    const grau = {}; for (const a of arestas) { grau[a.s] = (grau[a.s] || 0) + 1; grau[a.t] = (grau[a.t] || 0) + 1; }
    return { nos: [...nos.values()].map(n => ({ ...n, grau: grau[n.id] || 0 })), arestas };
  })();
  const redeJson = JSON.stringify(rede).replace(/<\/script/gi, '<\\/script');
  const redeHtml = `<details class="rede" id="rede-sec"><summary>A rede <span class="dim">— ${rede.nos.length} nós · ${rede.arestas.length} ligações · arraste, passe o mouse, clique para abrir</span></summary>
<div class="legenda"><span class="lg c-epic">epic</span><span class="lg c-feature">feature</span><span class="lg c-us">US</span><span class="lg c-fluxo">fluxo</span><span class="lg c-arquitetura">arquitetura</span><span class="lg c-raiz">raiz</span><span class="lg c-arquivo">arquivo</span><span class="lg c-funcao">função</span>
<span class="dim">· anel: <span class="ok">■</span> ativa <span style="color:var(--s0)">■</span> concluída <span class="err">■</span> cancelada</span>
<label><input type="checkbox" id="mostrarCodigo" checked> mostrar código</label></div>
<svg id="rede" viewBox="0 0 960 560" style="background:var(--bg);border:1px solid var(--line);border-radius:6px"></svg>
<script id="rede-dados" type="application/json">${redeJson}</script>
<script>
(function(){
  var D=JSON.parse(document.getElementById('rede-dados').textContent), svg=document.getElementById('rede');
  var W=960,H=560,N=D.nos,E=D.arestas,byId={};
  N.forEach(function(n,i){ var a=i*2.399963, r=12*Math.sqrt(i+1); n.x=W/2+r*Math.cos(a); n.y=H/2+r*Math.sin(a); n.vx=0; n.vy=0; byId[n.id]=n; n.raio=4+Math.min(10,n.grau*1.2); });
  E=E.filter(function(e){return byId[e.s]&&byId[e.t];});
  var NS='http://www.w3.org/2000/svg', g=function(t,a){var el=document.createElementNS(NS,t);for(var k in a)el.setAttribute(k,a[k]);return el;};
  var gl=g('g',{}),gn=g('g',{}); svg.appendChild(gl); svg.appendChild(gn);
  var linhas=E.map(function(e){var l=g('line',{'class':'aresta '+e.r});gl.appendChild(l);return l;});
  var circulos=N.map(function(n){
    var c=g('g',{'class':'no c-'+n.cat+(n.estado?' e-'+n.estado:'')});
    var ci=g('circle',{r:n.raio}); c.appendChild(ci);
    var t=g('text',{dy:-n.raio-3,'text-anchor':'middle'}); t.textContent=n.rotulo; c.appendChild(t);
    var ti=g('title',{}); ti.textContent=n.rotulo+(n.estado?' · '+n.estado:'')+'\\n'+n.arq; c.appendChild(ti);
    c.addEventListener('mousedown',function(ev){arrasto=n;ev.preventDefault();});
    c.addEventListener('dblclick',function(){ if(n.arq) window.location.href=n.arq.replace(/^/, '../../'); });
    gn.appendChild(c); return c;
  });
  var arrasto=null, alfa=1;
  svg.addEventListener('mousemove',function(ev){ if(!arrasto)return; var p=pt(ev); arrasto.x=p.x; arrasto.y=p.y; arrasto.vx=arrasto.vy=0; alfa=Math.max(alfa,0.3); });
  window.addEventListener('mouseup',function(){arrasto=null;});
  function pt(ev){ var r=svg.getBoundingClientRect(); return {x:(ev.clientX-r.left)*W/r.width, y:(ev.clientY-r.top)*H/r.height}; }
  document.getElementById('mostrarCodigo').addEventListener('change',function(ev){ svg.classList.toggle('sem-codigo',!ev.target.checked); alfa=0.5; });
  function passo(){
    var i,j,a,b,dx,dy,d,f;
    for(i=0;i<N.length;i++){a=N[i]; if(a.escondido)continue; for(j=i+1;j<N.length;j++){b=N[j]; if(b.escondido)continue; dx=b.x-a.x;dy=b.y-a.y;d=Math.sqrt(dx*dx+dy*dy)+0.1; if(d>420)continue; f=Math.min(8,5000/(d*d)); dx=dx/d*f;dy=dy/d*f;a.vx-=dx;a.vy-=dy;b.vx+=dx;b.vy+=dy;}}
    E.forEach(function(e){a=byId[e.s];b=byId[e.t]; if(a.escondido||b.escondido)return; dx=b.x-a.x;dy=b.y-a.y;d=Math.sqrt(dx*dx+dy*dy)||1; var ideal=e.r==='touches'?80:110; f=(d-ideal)*0.04; dx=dx/d*f;dy=dy/d*f;a.vx+=dx;a.vy+=dy;b.vx-=dx;b.vy-=dy;});
    N.forEach(function(n){ if(n===arrasto)return; n.vx+=(W/2-n.x)*0.003; n.vy+=(H/2-n.y)*0.003; n.vx*=0.55;n.vy*=0.55; n.x+=n.vx*alfa;n.y+=n.vy*alfa; n.x=Math.max(20,Math.min(W-20,n.x)); n.y=Math.max(20,Math.min(H-20,n.y)); });
    alfa=Math.max(0.02,alfa*0.985);
  }
  function desenhar(){
    var semCodigo=svg.classList.contains('sem-codigo');
    N.forEach(function(n){ n.escondido=semCodigo&&(n.cat==='arquivo'||n.cat==='funcao'); });
    E.forEach(function(e,i){ var a=byId[e.s],b=byId[e.t],l=linhas[i]; l.style.display=(a.escondido||b.escondido)?'none':''; l.setAttribute('x1',a.x);l.setAttribute('y1',a.y);l.setAttribute('x2',b.x);l.setAttribute('y2',b.y); });
    N.forEach(function(n,i){ circulos[i].style.display=n.escondido?'none':''; circulos[i].setAttribute('transform','translate('+n.x+','+n.y+')'); });
  }
  var rodando=false;
  function laco(){ passo(); desenhar(); if(alfa>0.03||arrasto) requestAnimationFrame(laco); else rodando=false; }
  function acordar(){ alfa=Math.max(alfa,0.3); if(!rodando){rodando=true;laco();} }
  svg.addEventListener('mousedown',acordar); document.getElementById('mostrarCodigo').addEventListener('change',acordar);
  rodando=true; laco();
})();
</script></details>`;

  const linhaUS = (a) => `<tr class="${esc(a.estado)}"><td><span class="badge ${esc(a.estado)}">${esc(a.estado)}</span></td><td><strong>${esc(a.titulo)}</strong>${a.cadeia.length ? `<div class="dim">${esc(a.cadeia.join(' › '))}</div>` : ''}${a.proximo ? `<div>${esc(a.proximo.replace(/\*\*|`/g, ''))}</div>` : ''}${a.avisos.map(w => `<div class="warn">! ${esc(w)}</div>`).join('')}</td><td>${a.rumo ? `<span class="dim">${a.idade}d</span> ${esc(a.rumo.slice(0, 120))}` : '<span class="dim">sem Rumo datado</span>'}</td></tr>`;
  // primeira dobra: o ponto anterior dá o delta dos cards; a lista Corrigir junta os avisos
  // da página com os de cada US (com link para o arquivo) — é o motivo de abrir a página
  const ant = pts.length > 1 ? pts[pts.length - 2] : null;
  const delta = (a, b, uni, bom, fmt = (v) => String(v)) => { if (a == null || b == null) return '<span class="delta">—</span>'; const d = +(b - a).toFixed(2); const cls = d > 0 ? 'up' : d < 0 ? 'down' : ''; return `<span class="delta ${cls}${bom ? ' bom' : ''}">${d === 0 ? '= igual' : (d > 0 ? '▲ +' : '▼ −') + fmt(Math.abs(d)) + uni} desde o último commit</span>`; };
  const card = (rot, val, sub, href) => `<a class="card" href="${href}"><span class="rot">${esc(rot)}</span><span class="val">${val}</span><span class="delta-wrap">${sub}</span></a>`;
  const linkArq = (abs) => abs ? `<a href="${esc(path.relative(dir, abs).replace(/\\/g, '/'))}">${esc(path.basename(path.dirname(abs)))}</a>` : '';
  const itens = [...st.avisos.filter(w => w.nivel !== 'info').map(w => `<li>${esc(w.texto)}</li>`), ...st.ativas.flatMap(a => a.avisos.map(w => `<li>${linkArq(a.arq)} — ${esc(w)}</li>`))];
  const corrigir = itens.length ? `<section class="corrigir" id="corrigir"><h2>Corrigir <span class="dim">— ${itens.length} item(ns)</span></h2><ul>${itens.join('')}</ul></section>` : '<p class="tudo-ok">✓ tudo consistente — nada a corrigir</p>';
  const html = `<!doctype html>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(path.basename(RAIZ))} — marvin status</title>
<style>
:root{color-scheme:light dark;--s1:.25rem;--s2:.5rem;--s3:1rem;--s4:1.25rem;--s5:1.5rem;--f0:.75rem;--f1:1rem;--f2:1.1rem;--f3:1.25rem;--f5:2rem;--r:6px;--ease:cubic-bezier(.25,0,.3,1);
--fg:#1f2328;--bg:#ffffff;--bg2:#f6f8fa;--dim:#59636e;--line:#d1d9e0;--ok:#1a7f37;--warn:#9a6700;--err:#cf222e;--acc:#1a7f37;--s0:#0969da;--s1c:#bc4c00;--s2c:#1a7f37;--sombra:0 1px 2px rgba(0,0,0,.06),0 2px 6px rgba(0,0,0,.05)}
@media(prefers-color-scheme:dark){:root{--fg:#e6edf3;--bg:#0d1117;--bg2:#161b22;--dim:#8d96a0;--line:#30363d;--ok:#3fb950;--warn:#d29922;--err:#f85149;--acc:#3fb950;--s0:#58a6ff;--s1c:#f0883e;--s2c:#3fb950;--sombra:0 1px 2px rgba(0,0,0,.4)}}
body{margin:0 auto;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;padding:var(--s5) var(--s4);max-width:1080px}a{color:inherit}
h1{font-size:var(--f3);margin:0}h2{font-size:var(--f2);margin:calc(var(--s5)*1.5) 0 var(--s2);border-bottom:1px solid var(--line);padding-bottom:var(--s1)}h2 .dim{font-weight:400;font-size:var(--f0)}
.corrigir{margin:var(--s4) 0;border:1px solid var(--err);border-left-width:4px;border-radius:var(--r);background:var(--bg2);padding:var(--s2) var(--s3)}.corrigir h2{border:0;margin:0 0 var(--s2);padding:0;color:var(--err)}.corrigir ul{margin:0;padding-left:var(--s4)}.corrigir li{margin:var(--s1) 0}.corrigir a{color:var(--s0);text-decoration:none}.corrigir a:hover{text-decoration:underline}
.tudo-ok{margin:var(--s4) 0;color:var(--ok);font-weight:600}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:var(--s3);margin:var(--s3) 0}
.card{display:block;border:1px solid var(--line);border-radius:var(--r);padding:var(--s3);background:var(--bg2);box-shadow:var(--sombra);text-decoration:none;color:inherit;position:relative;transition:border-color .2s var(--ease)}.card:hover{border-color:var(--acc)}.card::after{content:"›";position:absolute;right:var(--s3);top:var(--s2);color:var(--dim);font-size:var(--f3)}
.card .rot{font-size:var(--f0);color:var(--dim);text-transform:uppercase;letter-spacing:.04em}.card .val{display:block;font-size:var(--f5);font-weight:600;line-height:1.2;margin:var(--s1) 0;font-variant-numeric:tabular-nums}.card .val small{font-size:var(--f1);color:var(--dim);font-weight:400}
.card .delta-wrap,.delta{font-size:var(--f0);color:var(--dim)}.delta.up{color:var(--err)}.delta.down{color:var(--ok)}.delta.up.bom{color:var(--ok)}.delta.down.bom{color:var(--err)}
.badge{display:inline-block;font-size:var(--f0);padding:0 var(--s2);border-radius:999px;border:1px solid var(--line);color:var(--dim);line-height:1.6}.badge.ativa{color:var(--ok);border-color:var(--ok)}.badge.concluida{color:var(--s0);border-color:var(--s0)}.badge.cancelada{color:var(--err);border-color:var(--err)}
details.rede>summary{cursor:pointer;font-size:var(--f2);font-weight:600;margin:calc(var(--s5)*1.5) 0 var(--s2);border-bottom:1px solid var(--line);padding-bottom:var(--s1)}details.rede>summary .dim{font-weight:400;font-size:var(--f0)}
.dim{color:var(--dim)}.warn{color:var(--warn)}.err{color:var(--err)}.ok{color:var(--ok)}
table{border-collapse:collapse;width:100%}td,th{padding:6px 8px;vertical-align:top;border-bottom:1px solid var(--line);text-align:left}td:first-child{width:1.5em}
figure{margin:12px 0 20px}figcaption{font-size:13px;margin-bottom:4px}svg{width:100%;height:auto;display:block}
.grid{stroke:var(--line);stroke-width:1}.tick{fill:var(--dim);font-size:10px}
polyline{fill:none;stroke-width:2}.s0{stroke:var(--s0);fill:var(--s0)}.s1{stroke:var(--s1c);fill:var(--s1c)}.s2{stroke:var(--s2c);fill:var(--s2c)}
polyline.s0,polyline.s1,polyline.s2{fill:none}.lg{font-size:12px;padding-left:10px;position:relative}.lg::before{content:"";position:absolute;left:0;top:6px;width:7px;height:7px;border-radius:50%;background:currentColor}
.lg.s0{color:var(--s0)}.lg.s1{color:var(--s1c)}.lg.s2{color:var(--s2c)}
.legenda{display:flex;gap:12px;flex-wrap:wrap;align-items:center;font-size:12px;margin:6px 0}.legenda label{margin-left:auto}
.c-epic{color:#7c3aed}.c-feature{color:#2b5f9e}.c-us{color:#c2571a}.c-fluxo{color:#0f8b8d}.c-arquitetura{color:#8a6d3b}.c-raiz{color:#111}.c-release{color:#5c8a3a}.c-nota{color:#999}.c-doc{color:#999}.c-arquivo{color:#6b6b6b}.c-funcao{color:#9a9891}
@media(prefers-color-scheme:dark){.c-raiz{color:#eee}}
#rede .no circle{fill:currentColor;stroke:var(--bg);stroke-width:1.5;cursor:grab}#rede .no.e-ativa circle{stroke:var(--ok);stroke-width:3}#rede .no.e-concluida circle{stroke:var(--s0);stroke-width:3}#rede .no.e-cancelada circle{stroke:var(--err);stroke-width:3}
#rede .no text{font-size:9px;fill:var(--fg);pointer-events:none;opacity:.85}#rede .no.c-arquivo text,#rede .no.c-funcao text{opacity:.55;font-size:8px}
#rede .aresta{stroke:var(--line);stroke-width:1.2}#rede .aresta.touches{stroke:#c2571a;opacity:.5}#rede .aresta.child_of{stroke:#7c3aed;opacity:.5}#rede .aresta.references{stroke:var(--dim);opacity:.45}
</style>
<header><h1>${esc(path.basename(RAIZ))} <span class="dim">— marvin status</span></h1>
<div class="dim">${commit ? `commit ${esc(commit)} · ${esc((data || '').slice(0, 10))}` : 'sem git'}${ant ? ` · anterior ${esc(ant.commit)} (${esc((ant.data || '').slice(0, 10))})` : ''} · derivado, nunca versionado</div></header>
${corrigir}
<div class="cards">
${card('contexto fixo', st.contexto.total + ' tk', delta(ant && ant.total, st.contexto.total, ' tk', false), '#contexto')}
${card('US ativas', ponto.us_ativas, delta(ant && ant.us_ativas, ponto.us_ativas, '', false), '#andamento')}
${card('US concluídas', `${ponto.us_concluidas}<small> / ${ponto.us_total}</small>`, delta(ant && ant.us_concluidas, ponto.us_concluidas, '', true), '#epics')}
${card('gasto estimado', '$' + g.custo.toFixed(2), delta(ant && ant.custo, g.custo, '', false, (v) => '$' + v.toFixed(2)) + ` · ${g.total.msgs} turnos`, '#tokens')}
</div>
<h2 id="andamento">Em andamento <span class="dim">— ${st.release ? 'última release ' + esc(st.release.nome) : 'sem release'}${st.grafo ? ' · grafo com ' + st.grafo.nos + ' nós, ' + st.grafo.idade + 'd' : ''}</span></h2>
<table><tr><th></th><th>US</th><th>último Rumo</th></tr>${st.ativas.map(linhaUS).join('')}</table>
<h2 id="tendencia">Tendência <span class="dim">— ${pts.length} ponto(s), um por commit</span></h2>
${gContexto}${gUS}${gGrafo}${gCusto}
<h2 id="tokens">Tokens gastos <span class="dim">— medido nas transcrições do Claude Code, ${g.sessoes} sessão(ões)</span></h2>
${barras}
<table><tr><th></th><th>modelo</th><th>input</th><th>cache write</th><th>cache read</th><th>output</th><th>turnos</th><th>custo</th></tr>${tabelaModelos}</table>
<p class="dim">Tokens são medidos; o custo é <strong>estimativa</strong> pela tabela de ${PRECOS_DATA} (input · output · cache write ≈ 1,25× · cache read ≈ 0,1×) — confira os preços vigentes.${fatiaFixo != null ? ` Cada turno relê ~${kTk(g.contextoMedio)} tk de contexto; o contexto fixo (${st.contexto.total} tk) é <strong>~${fatiaFixo}%</strong> disso — o resto é a conversa. Sessão longa custa mais que arquivo grande.` : ''}</p>
<h2 id="epics">Epics</h2>
<table>${st.epics.map(e => `<tr><td>${e.estado === 'ativa' ? '●' : e.estado === 'concluida' ? '✓' : '✗'}</td><td><strong>${esc(e.titulo)}</strong></td><td>${e.total ? `${e.concluidas}/${e.total} ${e.rotulo} concluídas${e.canceladas ? ' · ' + e.canceladas + ' cancelada(s)' : ''}${e.ativas ? ' · ' + e.ativas + ' ativa(s)' : ''}` : '<span class="dim">sem filhos</span>'}</td></tr>`).join('')}</table>
<h2 id="contexto">Contexto fixo <span class="dim">— o que carrega em toda sessão</span></h2>
<table>${st.contexto.linhas.map(l => `<tr><td></td><td>${esc(l.nome)}</td><td>${l.tk} tk</td></tr>`).join('')}<tr><td></td><td><strong>total</strong></td><td><strong>${st.contexto.total} tk</strong></td></tr></table>
${redeHtml}
<script type="application/json" id="historico">${JSON.stringify(pts)}</script>
`;
  fsw.writeFileSync(path.join(dir, 'index.html'), html);
  ok(relStatus + 'index.html — open it in any browser, no server');
};

// Cálculo separado da impressão: o texto, o `--curto` do hook e o `--html` leem a mesma
// estrutura. Nada aqui escreve.
const calcularStatus = () => {
  const nos = nosDoPlanejamento();
  const porArq = new Map(nos.map(n => [path.resolve(n.arq), n]));
  const paiDe = (n) => n.pai ? porArq.get(path.resolve(path.dirname(n.arq), n.pai)) || null : null;
  const cadeia = (n) => { const c = []; for (let p = paiDe(n); p; p = paiDe(p)) c.unshift(p.titulo); return c; };
  const st = { ativas: [], avisos: [], problemas: 0, epics: [], release: null, contexto: contextoFixo(), grafo: null, gastos: calcularGastos(),
               nos: { us: nos.filter(n => n.tipo === 'us').length, concluidas: nos.filter(n => n.tipo === 'us' && n.estado === 'concluida').length } };
  let nota = ''; try { nota = fs.readFileSync(path.join(DEST, 'onde_paramos.md'), 'utf8'); } catch {}
  const ponteiros = [...nota.matchAll(/^- \[([^\]]+)\]\(([^)]+)\)(?:\s*[—-]+\s*(.*))?$/gm)];
  for (const [, rotulo, href, resto] of ponteiros) {
    const abs = path.resolve(DEST, href);
    const n = porArq.get(abs) || lerNo(abs);
    if (!n) { st.avisos.push({ nivel: 'err', texto: rotulo + ' → ' + href + '  (file not found)' }); st.problemas++; continue; }
    const ultimo = n.rumo.length ? n.rumo[n.rumo.length - 1] : null;
    const item = { titulo: n.titulo, arq: abs, cadeia: cadeia(n), estado: n.estado, proximo: (resto || '').trim(),
                   rumo: ultimo ? ultimo.texto : null, rumoData: ultimo ? ultimo.data : null, idade: ultimo ? dias(ultimo.data) : null, avisos: [] };
    if (n.estado === 'concluida') { item.avisos.push('concluida but still in the note — it belongs in Releases/<versao>.md, and out of here'); st.problemas++; }
    if (n.estado === 'concluida' && !n.comEvidencia) { item.avisos.push('concluida without Evidência'); st.problemas++; }
    if (item.idade !== null && item.idade > 14 && n.estado === 'ativa') item.avisos.push(item.idade + ' days without a Rumo entry — stalled, or done and not recorded?');
    st.ativas.push(item);
  }
  if (!ponteiros.length) st.avisos.push({ nivel: 'info', texto: 'the note has no "- [US](path)" lines' });
  const secoes = [...nota.matchAll(/^##\s+(.+)$/gm)].map(m => m[1].trim());
  const estranhas = secoes.filter(s => !/^(Em andamento|Travado|Estado|Próxima|Depende|Primeira frase)/i.test(s));
  if (estranhas.length) { st.avisos.push({ nivel: 'warn', texto: `the note has ${estranhas.length} section(s) that look like a report: ${estranhas.slice(0, 3).map(s => '"' + s + '"').join(', ')}${estranhas.length > 3 ? '…' : ''} → Rumo of the US` }); st.problemas++; }
  const foraDaNota = nos.filter(n => n.tipo === 'us' && n.estado === 'ativa' && !ponteiros.some(([, , h]) => path.resolve(DEST, h) === path.resolve(n.arq)));
  if (foraDaNota.length) st.avisos.push({ nivel: 'warn', texto: `${foraDaNota.length} US marked ativa but not in the note: ${foraDaNota.map(n => n.titulo.split(' — ')[0]).join(', ')}` });
  // ── O grafo no status: colisão e dispersão. Duas US ativas na mesma função é o conflito
  // que duas sessões paralelas descobrem no merge — aqui ele aparece antes. US espalhada
  // por muitas comunidades é escopo largo demais para uma US.
  const grafoSt = carregarGrafo();
  if (grafoSt) {
    const todas = tocadoPorUS(grafoSt);
    const ativas = [...todas.entries()].filter(([, t]) => t.no.estado === 'ativa' && t.ids.size);
    const nome = (t) => t.no.label.split(' — ')[0];
    for (let i = 0; i < ativas.length; i++) for (let j = i + 1; j < ativas.length; j++) {
      const [, a] = ativas[i], [, b] = ativas[j];
      const comum = [...a.ids].filter(x => b.ids.has(x));
      if (comum.length) { st.avisos.push({ nivel: 'warn', texto: `${nome(a)} and ${nome(b)} both touch ${comum.map(x => (grafoSt.nos.get(x) || {}).label || x).slice(0, 3).join(', ')}${comum.length > 3 ? '…' : ''} — agree before the merge, not at it` }); st.problemas++; }
    }
    for (const [id, t] of ativas) {
      const imp = impactoDaUS(grafoSt, todas, id);
      for (const o of imp.outras) {
        const outra = todas.get([...todas.keys()].find(k => todas.get(k).no === o.us));
        if (!outra || outra.no.estado !== 'ativa') continue;
        const direto = [...t.ids].some(x => outra.ids.has(x));
        if (!direto) st.avisos.push({ nivel: 'warn', texto: `${nome(outra)} touches code that depends on what ${nome(t)} touches (${o.comum.length} node(s)) — one can break the other` });
      }
      if (imp.comunidades.length >= 4) st.avisos.push({ nivel: 'info', texto: `${nome(t)} spans ${imp.comunidades.length} communities of the graph — wide scope for one US; worth slicing?` });
    }
  }
  for (const e of nos.filter(n => n.tipo === 'epic')) {
    const desc = nos.filter(n => n !== e && (() => { for (let p = paiDe(n); p; p = paiDe(p)) if (p === e) return true; return false; })());
    const us = desc.filter(n => n.tipo === 'us'), feats = desc.filter(n => n.tipo === 'feature');
    const conta = us.length ? us : feats;
    const c = (s) => conta.filter(n => n.estado === s).length;
    st.epics.push({ titulo: e.titulo, estado: e.estado, rotulo: us.length ? 'US' : 'features', total: conta.length, concluidas: c('concluida'), canceladas: c('cancelada'), ativas: c('ativa') });
  }
  const rel = path.join(DOCS, 'Releases');
  let releases = []; try { releases = fs.readdirSync(rel).filter(f => f.endsWith('.md') && f !== 'README.md').sort(); } catch {}
  if (releases.length) { const u = releases[releases.length - 1]; st.release = { nome: u.replace(/\.md$/, ''), us: (fs.readFileSync(path.join(rel, u), 'utf8').match(/^- \[/gm) || []).length }; }
  const GRAFO_ST = path.join(RAIZ, 'graphify-out', 'graph.json');
  if (fs.existsSync(GRAFO_ST)) {
    let n = 0, d = 0; try { const g = JSON.parse(fs.readFileSync(GRAFO_ST, 'utf8')); n = (g.nodes || []).length; d = (g.nodes || []).filter(x => x._origin === 'marvin').length; } catch {}
    const mtime = fs.statSync(GRAFO_ST).mtime;
    st.grafo = { nos: n, docs: d, mtime: mtime.toISOString(), idade: dias(mtime) };
  }
  return st;
};

const marcaEstado = (e) => e === 'ativa' ? '\x1b[32m●\x1b[0m' : e === 'concluida' ? '\x1b[34m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
const imprimirStatus = (st, curto) => {
  log('\x1b[1mEm andamento\x1b[0m  (onde_paramos.md → Sobre.md)');
  for (const a of st.ativas) {
    log(`  ${marcaEstado(a.estado)} ${a.titulo}${a.cadeia.length ? '   \x1b[2m(' + a.cadeia.join(' › ') + ')\x1b[0m' : ''}`);
    if (a.proximo) info('  ' + a.proximo);
    if (!curto) info(a.rumo ? `  last Rumo: ${a.idade}d ago — ${a.rumo.slice(0, 90)}${a.rumo.length > 90 ? '…' : ''}` : '  no dated Rumo entry');
    a.avisos.forEach(w => warn('  ' + w));
  }
  for (const w of st.avisos) (w.nivel === 'err' ? err : w.nivel === 'warn' ? warn : info)(w.texto);
  if (curto) return;
  if (st.epics.length) {
    log('\n\x1b[1mEpics\x1b[0m');
    for (const e of st.epics) {
      const m = e.estado === 'ativa' ? '●' : e.estado === 'concluida' ? '✓' : '✗';
      if (!e.total) { log(`  ${m} ${e.titulo}  \x1b[2mno children yet\x1b[0m`); continue; }
      log(`  ${m} ${e.titulo}  \x1b[2m${e.concluidas}/${e.total} ${e.rotulo} concluídas` + (e.canceladas ? ` · ${e.canceladas} cancelada(s)` : '') + (e.ativas ? ` · ${e.ativas} ativa(s)` : '') + '\x1b[0m');
    }
  }
  log('\n\x1b[1mReleases\x1b[0m');
  info(st.release ? `last: ${st.release.nome} — ${st.release.us} US` : 'none yet');
  log('\n\x1b[1mFixed context\x1b[0m');
  imprimirContextoFixo();
  imprimirGastos(st.gastos, st.contexto.total);
  log('\n\x1b[1mGraph\x1b[0m');
  info(st.grafo ? `${st.grafo.nos} nodes (${st.grafo.docs} from the knowledge base) — extracted ${st.grafo.idade}d ago` + (st.grafo.idade > 7 ? '  → marvin --graphify --graphify-rebuild' : '') : 'none — marvin --graphify builds it');
};

// ── --status. O dashboard que a organização por grafo tornou possível: todo nó tem estado
// no frontmatter e Rumo datado, então o estado do projeto é LEITURA. É o comando que se
// roda ao abrir a sessão, e é onde a régua pega antes de virar problema. Existe porque a
// nota de um projeto real chegou a nove seções de relato e 52 KB sem que ninguém rodasse
// --check: medir sob demanda não basta; tem que estar no caminho.
//
//   --curto   só o que o hook de sessão precisa (≤ 200 tk): US ativas e avisos. SEMPRE sai 0
//             — em hook, exit != 0 vira erro visível e derruba a sessão.
//   --html    escreve .marvin/.status/index.html e anexa uma linha em historico.jsonl —
//             a única forma do --status que escreve, e só ela. O texto é uma foto; "medição"
//             é filme: sem a série ninguém responde "o contexto fixo cresceu desde a release?".
if (temFlag('--status')) {
  const CURTO = temFlag('--curto'), HTML = temFlag('--html');
  if (!CURTO) log('\x1b[1mstatus\x1b[0m — ' + (HTML ? 'writes .marvin/.status/ only' : 'read-only') + '\n');
  if (LAYOUT_ANTIGO) { if (!CURTO) warn('old layout — --status reads Planejamento/<Epic>/<Feature>/<US>/Sobre.md. Run `marvin --migrar` first.'); process.exit(CURTO ? 0 : 1); }
  const st = calcularStatus();
  imprimirStatus(st, CURTO);
  // A sessão abriu num caminho sem junction (worktree, clone novo, pasta movida): tudo
  // que o agente escrever em memória cai num diretório real e não chega ao repositório.
  // Aviso aqui porque é o único lugar que roda em TODA sessão; --check é sob demanda.
  if (fs.existsSync(DOCS) && !ehJunction(MEM))
    log('  ! memória DESLIGADA deste repositório' + (WORKTREE ? ' (git worktree)' : '') + ' — rode `marvin` daqui antes de escrever qualquer nota; `marvin --check` explica');
  if (HTML) { if (!CURTO) log(''); escreverStatusHtml(st, CURTO); }
  if (!CURTO) log('\n' + (st.problemas ? `\x1b[33m${st.problemas} thing(s) to fix\x1b[0m` : '\x1b[32mall consistent\x1b[0m') + '\n');
  process.exit(CURTO ? 0 : st.problemas ? 1 : 0);
}

// ── --us <Epic>/<Feature>/<US>. O gatilho físico da regra "antes de qualquer US": cria a
// pasta com o Sobre.md no formato, cria o Epic e a Feature se faltarem, e põe a linha na
// nota. Sem isto a regra depende de alguém lembrar — e a US nasce torta para ser
// consertada depois. Idempotente: nó que existe não é tocado.
const argUS = process.argv.find(a => a.startsWith('--us='));
if (argUS || temFlag('--us')) {
  const alvo = argUS ? argUS.slice(5) : process.argv[process.argv.indexOf('--us') + 1];
  if (!alvo || alvo.startsWith('--')) { err('usage: marvin --us Novos/<Epic>/<Feature>/<US-nome>   (or Manutencao/…)'); process.exit(2); }
  if (LAYOUT_ANTIGO) { err('old layout — run `marvin --migrar` first'); process.exit(1); }
  const partes = alvo.replace(/\\/g, '/').replace(/^\/|\/$/g, '').split('/');
  if (partes.length !== 4 || !['Novos', 'Manutencao'].includes(partes[0])) { err('expected 4 parts: Novos|Manutencao / <Epic> / <Feature> / <US>'); process.exit(2); }
  log('\x1b[1m--us\x1b[0m — ' + alvo + '\n');
  const hoje = (() => { const d = new Date(); return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear(); })();
  const tipos = ['epic', 'feature', 'us'];
  for (let i = 1; i <= 3; i++) {
    const dir = path.join(DOCS, 'Planejamento', ...partes.slice(0, i + 1));
    const sobre = path.join(dir, 'Sobre.md');
    const tipo = tipos[i - 1], nome = partes[i];
    if (fs.existsSync(sobre)) { info(tipo + ': ' + partes.slice(0, i + 1).join('/') + ' already exists'); continue; }
    fsw.mkdirSync(dir, { recursive: true });
    const cab = `---\ntipo: ${tipo}\nestado: ativa\npai: ${i === 1 ? '../../README.md' : '../Sobre.md'}\n---\n# ${nome}\n\n**Por quê:** _(uma linha)_\n**Pronto quando:** _(critério verificável)_\n`;
    const corpo = tipo === 'us' ? `
## Fluxos ligados
_(link para ${path.relative(dir, path.join(DOCS, 'Contexto', 'Fluxos')).replace(/\\/g, '/')}/<fluxo>.md — fluxo sem nota ganha uma agora)_

## Código tocado
_(crase com o caminho a partir da raiz, e a função depois de um traço — é o que liga a US ao grafo)_

## Time
_(base: tl · po · dev-front · dev-back · qa · scout; mais design/dba/sec/infra se a atividade pede. O que ela não usa não entra.)_

## Skills
_(procedimento que vai repetir — proposta aqui, SKILL.md na segunda vez)_

## Rumo
- **${hoje}** — aberta.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
` : `
## Filhos
- [${partes[i + 1]}](${partes[i + 1]}/Sobre.md)

## Rumo
- **${hoje}** — aberta${tipo === 'epic' ? '' : ', com a primeira US'}.
`;
    fsw.writeFileSync(sobre, cab + corpo);
    ok(tipo + ': ' + partes.slice(0, i + 1).join('/') + '/Sobre.md');
  }
  // Pai que já existia: acrescenta o filho novo na seção Filhos, se não estiver.
  for (let i = 1; i <= 2; i++) {
    const sobre = path.join(DOCS, 'Planejamento', ...partes.slice(0, i + 1), 'Sobre.md');
    const filho = partes[i + 1];
    let t; try { t = fs.readFileSync(sobre, 'utf8'); } catch { continue; }
    if (t.includes('](' + filho + '/Sobre.md)')) continue;
    const linha = '- [' + filho + '](' + filho + '/Sobre.md)';
    const novo = /^##\s+Filhos\s*$/m.test(t) ? t.replace(/^(##\s+Filhos\s*\n)([\s\S]*?)(?=^##\s|(?![\s\S]))/m, (m, h, b) => h + b.replace(/\s+$/, '') + '\n' + linha + '\n\n') : t + '\n## Filhos\n' + linha + '\n';
    fsw.writeFileSync(sobre, novo);
    ok(partes.slice(0, i + 1).join('/') + '/Sobre.md — child added: ' + filho);
  }
  // A linha na nota.
  const NOTA_US = path.join(DEST, 'onde_paramos.md');
  const relSobre = path.relative(DEST, path.join(DOCS, 'Planejamento', ...partes, 'Sobre.md')).replace(/\\/g, '/');
  let nota = ''; try { nota = fs.readFileSync(NOTA_US, 'utf8'); } catch {}
  const estadoUS = (lerNo(path.join(DOCS, 'Planejamento', ...partes, 'Sobre.md')) || {}).estado;
  if (!nota) warn('onde_paramos.md not found — run marvin first');
  else if (estadoUS && estadoUS !== 'ativa') info('onde_paramos.md — not pointed to: the US is ' + estadoUS);
  else if (nota.includes('](' + relSobre + ')')) info('onde_paramos.md already points to it');
  else {
    const linha = `- [${partes[3]}](${relSobre}) — aberta ${hoje}; próximo passo: _(uma frase)_`;
    // Entra no FIM da lista da seção; o placeholder do template sai na primeira US.
    const m = nota.match(/^##\s+Em andamento[ \t]*\r?\n([\s\S]*?)(?=^##\s|(?![\s\S]))/m);
    let nova;
    if (m) {
      const corpo = m[1].replace(/^_\(.*\)_[ \t]*$/gm, '').replace(/<!--[\s\S]*?-->[ \t]*/g, '');
      const linhas = corpo.split(/\r?\n/).filter(l => l.startsWith('- ['));
      const resto = corpo.split(/\r?\n/).filter(l => !l.startsWith('- [') && l.trim()).join('\n');
      nova = nota.slice(0, m.index) + '## Em andamento\n\n' + [...linhas, linha].join('\n') + '\n' + (resto ? '\n' + resto + '\n' : '') + '\n' + nota.slice(m.index + m[0].length);
    } else nova = nota + '\n## Em andamento\n\n' + linha + '\n';
    fsw.writeFileSync(NOTA_US, nova);
    ok('onde_paramos.md — pointer added');
  }
  // ── Impacto: o grafo responde "o que esta US vai quebrar" ANTES de codar. Só quando o
  // "Código tocado" está preenchido — na primeira chamada ele está vazio, e o /us manda
  // rodar de novo depois de preencher. A seção é DERIVADA e regerada a cada run; a marca
  // no cabeçalho diz isso, para ninguém editar à mão o que o próximo run sobrescreve.
  {
    const usArq = path.join(DOCS, 'Planejamento', ...partes, 'Sobre.md');
    const grafo = carregarGrafo();
    if (!grafo) info('no graph — `marvin --graphify` gives this US an Impacto section (who depends on what it touches)');
    else {
      const todas = tocadoPorUS(grafo);
      const usId = [...todas.keys()].find(id => path.resolve(RAIZ, todas.get(id).no.source_file) === path.resolve(usArq));
      const imp = usId ? impactoDaUS(grafo, todas, usId) : null;
      if (!imp || !imp.tocados.length) info('Impacto: fill "Código tocado" first, then run this again — the graph will say who depends on it');
      else {
        const linhas = ['## Impacto', '', '<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->', '',
          `Toca ${imp.tocados.length} nó(s) de código em ${imp.comunidades.length} comunidade(s)${imp.comunidades.length >= 4 ? ' — **escopo largo**: vale fatiar?' : ''}.`, ''];
        if (imp.dependentes.length) {
          linhas.push(`**Quem depende do que ela toca** (${imp.dependentes.length}, até 2 níveis) — é o que o QA precisa cobrir:`);
          for (const [id, nivel] of imp.dependentes.slice(0, 25)) linhas.push(`- ${nivel === 2 ? '  ' : ''}\`${rotuloNo(grafo, id)}\``);
          if (imp.dependentes.length > 25) linhas.push(`- … e mais ${imp.dependentes.length - 25}`);
        } else linhas.push('Nada depende do que ela toca — folha do grafo.');
        linhas.push('');
        if (imp.outras.length) {
          linhas.push('**Outras US no mesmo código** — combine antes, não no merge:');
          for (const o of imp.outras) linhas.push(`- [${o.us.label}](${path.relative(path.dirname(usArq), path.join(RAIZ, o.us.source_file)).replace(/\\/g, '/')}) — ${o.comum.length} nó(s) em comum`);
        } else linhas.push('Nenhuma outra US passa por este código.');
        linhas.push('');
        let txt = fs.readFileSync(usArq, 'utf8');
        const bloco = linhas.join('\n');
        const re = /^## Impacto\s*\n[\s\S]*?(?=^## |(?![\s\S]))/m;
        const novo = re.test(txt) ? txt.replace(re, bloco + '\n') : txt.replace(/(^## Rumo)/m, bloco + '\n$1');
        if (novo !== txt) { fsw.writeFileSync(usArq, novo); ok('Impacto — ' + imp.dependentes.length + ' dependent(s), ' + imp.outras.length + ' other US on the same code' + (imp.outras.length ? ': ' + imp.outras.map(o => o.us.label.split(' — ')[0]).join(', ') : '')); }
        else info('Impacto unchanged');
      }
    }
  }
  log('');
  info('now the pass that the rule asks for, in ' + path.relative(RAIZ, path.join(DOCS, 'Planejamento', 'README.md')).replace(/\\/g, '/') + ':');
  info('  map what it touches → fill Fluxos ligados and Código tocado · propose the team → Time · propose skills → Skills');
  log('');
  process.exit(0);
}

// ── --fechar. A deriva: o que mudou no git e NÃO está no "Código tocado" de nenhuma US
// ativa. Ou o mapa da US está incompleto, ou a US vazou de escopo — os dois são coisa
// para registrar antes de fechar, e ninguém vê sem olhar o diff contra o grafo. Lê só;
// o /fechar chama isto e depois o --status. "Mudou" = não commitado + commits de hoje.
if (temFlag('--fechar')) {
  log('\x1b[1m--fechar\x1b[0m — drift between the diff and the active USs (read-only)\n');
  if (LAYOUT_ANTIGO) { warn('old layout — run `marvin --migrar` first'); process.exit(1); }
  const git = (args) => { try { return execSync('git ' + args, { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return ''; } };
  const mudados = new Set();
  for (const l of git('status --porcelain --untracked-files=all').split(/\r?\n/)) { const f = l.slice(3).trim().replace(/^.* -> /, ''); if (f) mudados.add(f.replace(/\\/g, '/')); }
  for (const l of git('log --since=midnight --name-only --format=').split(/\r?\n/)) if (l.trim()) mudados.add(l.trim());
  const EXT_CODIGO_F = /\.(js|mjs|cjs|jsx|ts|tsx|py|go|rs|java|kt|rb|php|cs|c|h|cpp|hpp|swift|scala|ex|exs|lua|sh|sql)$/i;
  const codigoMudado = [...mudados].filter(f => EXT_CODIGO_F.test(f) && !f.startsWith(path.relative(RAIZ, DOCS).replace(/\\/g, '/') + '/'));
  if (!mudados.size) { ok('nothing changed since midnight and nothing uncommitted'); process.exit(0); }
  info(mudados.size + ' file(s) changed (uncommitted + commits since midnight), ' + codigoMudado.length + ' of them code');
  const grafo = carregarGrafo();
  const todas = tocadoPorUS(grafo);
  // Conta a US ativa E a que foi concluída HOJE (último Rumo datado de hoje): o trabalho
  // de hoje não vira "deriva" só porque a release já saiu.
  const hojeStr = (() => { const d = new Date(); return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear(); })();
  const concluidaHoje = (t) => { const n = lerNo(path.join(RAIZ, t.no.source_file)); const u = n && n.rumo.length ? n.rumo[n.rumo.length - 1].data : null; return !!u && String(u.getDate()).padStart(2, '0') + '/' + String(u.getMonth() + 1).padStart(2, '0') + '/' + u.getFullYear() === hojeStr; };
  const ativas = [...todas.values()].filter(t => t.no.estado === 'ativa' || (t.no.estado === 'concluida' && concluidaHoje(t)));
  // arquivos que cada US ativa declara: pelo nó do grafo (source_file) ou, sem grafo, pela crase
  const arquivosDe = (t) => { const s = new Set(); for (const id of t.ids) { const n = grafo && grafo.nos.get(id); if (n && n.source_file) s.add(n.source_file.replace(/\\/g, '/')); } return s; };
  const cobertos = new Map();
  for (const t of ativas) for (const f of arquivosDe(t)) cobertos.set(f, t);
  const fora = codigoMudado.filter(f => !cobertos.has(f));
  const dentro = codigoMudado.filter(f => cobertos.has(f));
  if (dentro.length) { ok(dentro.length + ' changed file(s) are in an active US:'); dentro.forEach(f => info('  ' + f + '  → ' + cobertos.get(f).no.label.split(' — ')[0])); }
  if (!ativas.length) warn('no active US with "Código tocado" — the diff belongs to nobody on record');
  if (fora.length) {
    warn(fora.length + ' changed code file(s) are in NO active US — the map is incomplete, or the work leaked out of scope:');
    fora.slice(0, 15).forEach(f => {
      // dica: alguma US ativa depende deste arquivo (2 níveis)? então provavelmente é dela.
      let dica = '';
      if (grafo) {
        const idArq = f.replace(/\.[^./]+$/, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
        for (const t of ativas) { const imp = impactoDaUS(grafo, todas, [...todas.keys()].find(k => todas.get(k) === t)); if (imp && imp.dependentes.some(([id]) => id === idArq || (grafo.contidoEm.get(id) === idArq))) { dica = '  (depends on what ' + t.no.label.split(' — ')[0] + ' touches — hers?)'; break; } }
      }
      info('  ' + f + dica);
    });
    if (fora.length > 15) info('  … and ' + (fora.length - 15) + ' more');
    info('add them to "Código tocado" of the US that did it, or open the US that was missing (marvin --us)');
    log('');
    process.exit(1);
  }
  ok('every changed code file is declared by an active US');
  log('');
  process.exit(0);
}

// ── --release <versao>. Fecha o ciclo US → Rumo → Evidência → Release, o único passo que
// ainda era manual — e é onde a nota volta a inflar. Lê toda US `concluida` que não está em
// nenhum Releases/*.md, EXIGE Evidência (sem escape: quem quer marcar sem, escreve
// `_(sem evidência: hotfix)_` no nó e a decisão fica registrada), escreve o índice e tira
// as linhas da nota. Não faz tag, commit nem bump — isso é decisão do humano; sugere o tag.
//
// Invariante 1 aqui: o release é escrito ANTES da nota (se cair no meio, sobra uma nota
// "suja" que o --status acusa — nunca uma US sumida sem registro); só sai da nota a linha
// cujo href casa EXATAMENTE a US que entrou; e a contagem é conferida antes de escrever.
// Data pelo git, não por `new Date()`: o índice precisa ser reproduzível.
const argRel = process.argv.find(a => a.startsWith('--release='));
if (argRel || temFlag('--release')) {
  const versao = argRel ? argRel.slice(10) : process.argv[process.argv.indexOf('--release') + 1];
  if (!versao || versao.startsWith('--')) { err('usage: marvin --release <versao>'); process.exit(2); }
  if (LAYOUT_ANTIGO) { err('old layout — run `marvin --migrar` first'); process.exit(1); }
  log('\x1b[1m--release\x1b[0m — ' + versao + '\n');
  const relDir = path.join(DOCS, 'Releases');
  const alvo = path.join(relDir, versao + '.md');
  if (fs.existsSync(alvo)) { err('Releases/' + versao + '.md already exists — nothing touched (a release is written once)'); process.exit(1); }

  // US que já subiram: todo href dentro de Releases/*.md, resolvido.
  const jaSubiu = new Set();
  let relArqs = []; try { relArqs = fs.readdirSync(relDir).filter(f => f.endsWith('.md') && f !== 'README.md'); } catch {}
  for (const f of relArqs) {
    const txt = fs.readFileSync(path.join(relDir, f), 'utf8');
    const hrefs = [...txt.matchAll(/^- \[[^\]]*\]\(([^)\s#]+)/gm)].map(m => m[1]);
    if (!hrefs.length) warn('Releases/' + f + ' has no "- [US](path)" line — not in the expected format, so it protects nothing');
    for (const h of hrefs) jaSubiu.add(path.resolve(relDir, h));
  }
  const nos = nosDoPlanejamento();
  let semFrontmatter = 0;
  (function varrer(d, prof = 0) {
    if (prof > 8) return;
    let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) varrer(p, prof + 1);
      else if (e.name === 'Sobre.md' && !(lerNo(p) || {}).tipo) semFrontmatter++;
    }
  })(path.join(DOCS, 'Planejamento'));
  if (semFrontmatter) warn(semFrontmatter + ' Sobre.md without `tipo:` in the frontmatter — invisible to --release');

  const concluidas = nos.filter(n => n.tipo === 'us' && n.estado === 'concluida' && !jaSubiu.has(path.resolve(n.arq)))
    .sort((a, b) => a.arq.localeCompare(b.arq));
  if (!concluidas.length) { ok('no US with estado: concluida outside a release — nothing to write'); process.exit(0); }
  const semEvidencia = concluidas.filter(n => !n.comEvidencia);
  if (semEvidencia.length) {
    err(semEvidencia.length + ' concluida US without Evidência — nothing written:');
    semEvidencia.forEach(n => info('  ' + n.titulo + '  (' + path.relative(RAIZ, n.arq).replace(/\\/g, '/') + ')'));
    info('fill the Evidência section (PR, test, screenshot). No flag skips this: write `_(sem evidência: <motivo>)_` in the node if that is the decision.');
    process.exit(1);
  }

  // Data do último commit — reproduzível; sem git, fica para o humano.
  let data = '_(data)_';
  try { data = execSync('git log -1 --format=%cs', { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || data; } catch {}
  const linhaDe = (n) => '- [' + n.titulo + '](' + path.relative(relDir, n.arq).replace(/\\/g, '/') + ') — evidência: ' + n.evidencia.split(/\r?\n/)[0].replace(/^- /, '').trim();
  const conteudo = '# ' + versao + ' — ' + data + '\n\n' + concluidas.map(linhaDe).join('\n') + '\n';

  // A nota: só sai a linha cujo href resolve para uma US que entrou. Conferido antes de escrever.
  const NOTA_R = path.join(DEST, 'onde_paramos.md');
  let nota = ''; try { nota = fs.readFileSync(NOTA_R, 'utf8'); } catch {}
  const entram = new Set(concluidas.map(n => path.resolve(n.arq)));
  const linhas = nota.split(/\r?\n/);
  const sai = (l) => { const m = l.match(/^- \[[^\]]*\]\(([^)\s#]+)/); return !!m && entram.has(path.resolve(DEST, m[1])); };
  const removidas = linhas.filter(sai).length;
  const novaNota = linhas.filter(l => !sai(l)).join('\n');
  if (linhas.length - novaNota.split('\n').length !== removidas) { err('line count mismatch while editing the note — nothing written'); process.exit(1); }

  log('  Releases/' + versao + '.md' + (DRY ? '  (dry-run — this is what it would contain)' : '') + ':');
  conteudo.trimEnd().split('\n').forEach(l => info('  ' + l));
  fsw.mkdirSync(relDir, { recursive: true });
  fsw.writeFileSync(alvo, conteudo);
  ok('Releases/' + versao + '.md — ' + concluidas.length + ' US');
  if (removidas) { fsw.writeFileSync(NOTA_R, novaNota); ok('onde_paramos.md — ' + removidas + ' pointer(s) removed'); }
  else info('onde_paramos.md — none of these US was in the note');
  const naNota = concluidas.length - removidas;
  if (naNota) info(naNota + ' of them were not in the note (fine — they were never pointed to)');
  log('');
  info('not done, on purpose — yours to run:');
  info('  git add -A && git commit -m "chore: ' + versao + '" && git tag -a v' + versao + ' -m "' + versao + '"');
  log('');
  process.exit(0);
}

// ── --migrar. Layout antigo (08_Memoria/, 10_Decisoes/…) → layout por grafo. Feito três
// vezes à mão em projetos reais no mesmo dia, sempre na mesma ordem: backup → memória →
// decisões → fontes → sobras → links. O que exige julgamento (o conteúdo da nota, qual
// arquivo é Epic) fica de fora e é dito no fim. Invariante 1 em cada passo: copia, confere,
// só então apaga. Depois dele, o run normal cria os templates e reponta a junction.
if (temFlag('--migrar')) {
  log('\x1b[1m--migrar\x1b[0m — old layout → graph layout\n');
  if (!LAYOUT_ANTIGO) { ok('nothing to migrate: this base is already on the graph layout'); process.exit(0); }
  const dest = path.join(DOCS, '99_Backup', 'antes-do-grafo');
  if (fs.existsSync(dest) && !DRY) { err('99_Backup/antes-do-grafo already exists — a previous --migrar stopped halfway. Look at it before running again.'); process.exit(1); }
  const contar = (d) => { let n = 0; (function w(x) { let es; try { es = fs.readdirSync(x, { withFileTypes: true }); } catch { return; } for (const e of es) e.isDirectory() ? w(path.join(x, e.name)) : n++; })(d); return n; };
  // 1. backup de tudo, menos do próprio 99_Backup
  let n = 0;
  (function cp(dir, rel = '') {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (rel === '' && e.name === '99_Backup') continue;
      const p = path.join(dir, e.name), r = path.join(rel, e.name);
      if (e.isDirectory()) { fsw.mkdirSync(path.join(dest, r), { recursive: true }); cp(p, r); }
      else { fsw.mkdirSync(path.dirname(path.join(dest, r)), { recursive: true }); fsw.copyFileSync(p, path.join(dest, r)); n++; }
    }
  })(DOCS);
  if (!DRY && contar(dest) !== n) { err('backup copied ' + contar(dest) + ' of ' + n + ' files — aborting, nothing moved'); process.exit(1); }
  ok('backup: ' + n + ' files → ' + path.relative(RAIZ, dest).replace(/\\/g, '/'));
  const mover = (de, para) => {
    if (!fs.existsSync(de)) return false;
    if (fs.existsSync(para)) { warn('exists, left alone: ' + path.relative(DOCS, para)); return false; }
    fsw.mkdirSync(path.dirname(para), { recursive: true });
    fsw.copyFileSync(de, para);
    if (!DRY && fs.statSync(de).size !== fs.statSync(para).size) { err('size differs after copy: ' + de); process.exit(1); }
    fsw.unlinkSync(de);
    info(path.relative(DOCS, de).replace(/\\/g, '/') + '  →  ' + path.relative(DOCS, para).replace(/\\/g, '/'));
    return true;
  };
  // 2. memória inteira (a junction é repontada pelo run normal, que vê 08_Memoria sumir)
  const m8 = path.join(DOCS, '08_Memoria');
  for (const f of fs.readdirSync(m8)) mover(path.join(m8, f), path.join(DOCS, 'Memoria', f));
  if (!DRY) fs.rmdirSync(m8);
  ok('08_Memoria/ → Memoria/');
  // 3. decisões → Contexto/Arquitetura (o README antigo vai para o backup: o novo layout tem o seu)
  const d10 = path.join(DOCS, '10_Decisoes');
  if (fs.existsSync(d10)) {
    for (const f of fs.readdirSync(d10)) {
      const p = path.join(d10, f);
      if (f === 'README.md') { mover(p, path.join(DOCS, '99_Backup', '10_Decisoes-README.md')); continue; }
      if (fs.statSync(p).isDirectory()) { warn('10_Decisoes/' + f + '/ is a folder — left for you: features go to Planejamento/, reports to Fontes/'); continue; }
      mover(p, path.join(DOCS, 'Contexto', 'Arquitetura', f));
    }
    try { if (!DRY) fs.rmdirSync(d10); ok('10_Decisoes/ → Contexto/Arquitetura/'); } catch { warn('10_Decisoes/ not empty — see above'); }
  }
  // 4. fontes e o índice antigo
  mover(path.join(DOCS, '00_Fontes_Externas.md'), path.join(DOCS, 'Fontes', 'Externas.md'));
  mover(path.join(DOCS, '00_Inicio.md'), path.join(DOCS, '99_Backup', '00_Inicio.md'));
  // 5. sobras vazias
  for (const d of ['11_Sessoes', '90_Anexos']) {
    const p = path.join(DOCS, d);
    if (!fs.existsSync(p)) continue;
    if (fs.readdirSync(p).length) { warn(d + '/ is not empty — left for you'); continue; }
    if (!DRY) fs.rmdirSync(p); info(d + '/ removed (empty)');
  }
  // 6. links: os caminhos que mudaram, nos .md da base e nos ponteiros da raiz
  const troca = [[/08_Memoria\//g, 'Memoria/'], [/10_Decisoes\/README\.md/g, '99_Backup/10_Decisoes-README.md'], [/10_Decisoes\//g, 'Contexto/Arquitetura/'], [/00_Fontes_Externas\.md/g, 'Fontes/Externas.md']];
  const alvos = [];
  (function w(d, prof = 0) { if (prof > 6) return; let es; try { es = fs.readdirSync(d, { withFileTypes: true }); } catch { return; } for (const e of es) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== '99_Backup') w(p, prof + 1); } else if (e.name.endsWith('.md')) alvos.push(p); } })(DOCS);
  for (const f of ['AGENTS.md', 'CLAUDE.md']) if (fs.existsSync(path.join(RAIZ, f))) alvos.push(path.join(RAIZ, f));
  (function w(d) { let es; try { es = fs.readdirSync(d, { withFileTypes: true }); } catch { return; } for (const e of es) { const p = path.join(d, e.name); e.isDirectory() ? w(p) : e.name.endsWith('.md') && alvos.push(p); } })(path.join(RAIZ, '.claude'));
  let arqs = 0, refs = 0;
  for (const f of alvos) {
    let t; try { t = fs.readFileSync(f, 'utf8'); } catch { continue; }
    let novo = t, k = 0;
    for (const [re, sub] of troca) novo = novo.replace(re, () => { k++; return sub; });
    if (k) { fsw.writeFileSync(f, novo); arqs++; refs += k; }
  }
  ok(refs + ' path reference(s) rewritten in ' + arqs + ' file(s)');
  log('');
  info('left for you — it takes judgment, not a script:');
  info('  · the note: it is a list of pointers now. What it says today goes to the Rumo of the node that owns it');
  info('  · specs and feature files at the root of the base: one folder per Epic/Feature under Planejamento/');
  info('  · then run:  marvin          (creates the templates, re-points the junction)');
  info('               marvin --status (shows what is still inconsistent)');
  log('');
  process.exit(0);
}

// ── 0b. Ferramentas opcionais: o registro `.marvin/ferramentas.md`.
//
// Ninguém descobre flag que só existe no --help. Então, sem `--graphify`, o script
// detecta o binário no PATH e PERGUNTA — uma vez, só com terminal; sem TTY assume
// `não` e avisa. A resposta vai para o registro, e daí em diante ele manda: rodar de
// novo não pergunta (invariante 2). `--use=graphify` flipa o registro depois. O
// registro é o lugar de "este projeto usa X" que faltava — qualquer agente lê.
// Mora antes do passo 1 porque SUBREPOS (logo abaixo) e o CLAUDE.md gerado dependem
// de GRAPHIFY já estar decidido.
const REGISTRO = path.join(DOCS, 'ferramentas.md');
const REGISTRO_REL = path.relative(RAIZ, REGISTRO).replace(/\\/g, '/');
// `detecta()` devolve false ou o estado encontrado (string) — vai para a mensagem.
// Ponytail não é binário no PATH: é plugin do Claude Code. INSTALADO mora em
// ~/.claude/plugins/installed_plugins.json; ATIVO nesta máquina é o arquivo
// ~/.claude/.ponytail-active (o hook de SessionStart escreve o nível lá). Instalado
// sem estar ativo é a metade que engana: o plugin existe e não faz nada.
const CLAUDE_HOME = path.join(os.homedir(), '.claude');
const noPath = (cmd) => { try { execSync(cmd, { stdio: 'ignore' }); return 'on PATH'; } catch { return false; } };
const detectaPonytail = () => {
  let instalado = false;
  try { instalado = /ponytail/i.test(fs.readFileSync(path.join(CLAUDE_HOME, 'plugins', 'installed_plugins.json'), 'utf8')); } catch {}
  if (!instalado) return false;
  let nivel = ''; try { nivel = fs.readFileSync(path.join(CLAUDE_HOME, '.ponytail-active'), 'utf8').trim(); } catch {}
  return nivel ? 'installed and active (' + nivel + ')' : 'installed but NOT active — run /ponytail in a Claude session';
};
// Alcance do ponytail depende de ONDE ele carrega (README do plugin, 4.10.0): plugin com
// hooks no Claude Code, Codex e Copilot CLI — cada um com o SEU install; no Cursor, hooks
// em ~/.cursor/hooks.json (`node scripts/cursor-hooks.js install`) OU o arquivo de regra;
// no resto, arquivo de regra copiado do repositório dele. A DETECÇÃO lê só ~/.claude:
// instalado só pelo codex/copilot sai como "not found" e grava `não` — com a instrução
// de instalar, então não é silêncio; `--use=ponytail` flipa.
const alcancePonytail = () => {
  const p = [];
  if (FERRAMENTAS.some(f => ['claude', 'codex', 'copilot'].includes(f))) p.push('plugin com hooks no Claude Code/Codex/Copilot CLI (install próprio em cada um; aqui só o do Claude é detectado)');
  if (FERRAMENTAS.includes('cursor')) p.push('no Cursor, hooks em ~/.cursor/hooks.json ou a regra .mdc do repositório dele — nenhum dos dois é gerado, confira');
  if (FERRAMENTAS.some(f => !['claude', 'codex', 'copilot', 'cursor'].includes(f))) p.push('no resto, só o arquivo de regra copiado do repositório dele');
  return 'escada de simplicidade para quem IMPLEMENTA — ' + p.join('; ') + '. Confiança baixa: não medido';
};
const FERR_OPCIONAIS = [
  { nome: 'graphify', detecta: () => noPath('graphify --version'), instalar: 'uv tool install graphifyy  ·  pipx install graphifyy',
    alcance: 'saída JSON/markdown em graphify-out/ — qualquer agente lê; só o hook é do Claude, e não é usado' },
  { nome: 'ponytail', detecta: detectaPonytail, instalar: 'claude plugin marketplace add DietrichGebert/ponytail  ·  claude plugin install ponytail',
    get alcance() { return alcancePonytail(); } },
];
{
  let reg = ''; try { reg = fs.readFileSync(REGISTRO, 'utf8'); } catch {}
  const linhaReg = (f) => reg.match(new RegExp('^\\|\\s*' + f + '\\s*\\|\\s*(sim|n[aã]o)\\s*\\|', 'mi'));
  // Data do último commit — reproduzível, como no --release; sem git, fica para o humano.
  let dataReg = '_(data)_';
  try { dataReg = execSync('git log -1 --format=%cs', { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || dataReg; } catch {}
  const novas = [];
  for (const f of FERR_OPCIONAIS) {
    const m = linhaReg(f.nome);
    let usa;
    if (USAR.has(f.nome)) {
      usa = true;
      if (!m) novas.push('| ' + f.nome + ' | sim | ' + f.alcance + ' | ' + dataReg + ' |');
      else if (!/^sim$/i.test(m[1])) {
        fsw.writeFileSync(REGISTRO, reg.replace(m[0], m[0].replace(m[1], 'sim')));
        ok(REGISTRO_REL + ': ' + f.nome + ' → sim');
      }
    } else if (m) {
      usa = /^sim$/i.test(m[1]);
    } else {
      const estado = f.detecta();
      if (!estado) {
        usa = false;
        info(f.nome + ' not found — recording `não`. To adopt it later:  ' + f.instalar + '  then  marvin --use=' + f.nome);
      } else if (SEM_PERGUNTAS || !process.stdin.isTTY) {
        usa = false;
        warn(f.nome + ' is ' + estado + ' but ' + (SEM_PERGUNTAS ? '--no-questions' : 'no interactive terminal') + ' — recording `não`. Flip it with  marvin --use=' + f.nome);
      } else {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const r = (await rl.question('  ' + f.nome + ' is ' + estado + '. Use it in this project? [y/N] ')).trim();
        await rl.close();
        usa = /^[ys]/i.test(r);
      }
      novas.push('| ' + f.nome + ' | ' + (usa ? 'sim' : 'não') + ' | ' + f.alcance + ' | ' + dataReg + ' |');
    }
    if (f.nome === 'graphify' && usa) GRAPHIFY = true;
    if (f.nome === 'ponytail' && usa) PONYTAIL = true;
  }
  if (novas.length) {
    if (reg) fsw.appendFileSync(REGISTRO, novas.join('\n') + '\n');
    else {
      fsw.mkdirSync(DOCS, { recursive: true });
      fsw.writeFileSync(REGISTRO, `---
name: ferramentas
description: Ferramentas opcionais que ESTE projeto usa — e o que cada uma alcança
tags: [referencia]
---
# Ferramentas opcionais

Registro de "este projeto usa X". O \`marvin\` pergunta uma vez e escreve aqui; para
mudar, edite a coluna **usa** ou rode \`marvin --use=<ferramenta>\`. **Alcance** diz
quem consegue ler o que a ferramenta produz — nem tudo é de todo agente.

| ferramenta | usa | alcance | data |
|---|---|---|---|
` + novas.join('\n') + '\n');
    }
    ok(REGISTRO_REL + (reg ? ' updated' : ''));
  }
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

// Há front? Lido das dependências dos package.json encontrados — é fato, não palpite.
// Decide só se a pasta Contexto/Design/ nasce no passo 5.
const TEM_FRONT = [...stacks.keys()].some(d => {
  try {
    const pj = JSON.parse(fs.readFileSync(path.join(RAIZ, d, 'package.json'), 'utf8'));
    const deps = Object.keys({ ...pj.dependencies, ...pj.devDependencies });
    return deps.some(x => /^(react|react-dom|vue|@angular\/core|svelte|next|nuxt|solid-js|@remix-run\/react|astro)$/.test(x));
  } catch { return false; }
});

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
  /\.(tmp|temp|rej|swp)$/i.test(n) ||
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

// Backup declarado NÃO é lixo de shell — `.bak`, `.orig`, `nome~` são alguém guardando
// uma versão de propósito. Este passo os chamava de "malformed shell command", e num
// repositório real (`firestore.rules.bak`) o aviso ensinava errado. A pergunta certa é
// outra: isso é para versionar? Se sim, o git já guarda versões; se não, vai para o
// .gitignore. Aviso próprio, sem o "rm -f" — decisão é do humano.
const BACKUP = /(\.(bak|orig|old|backup)$|~$)/i;
const backups = fs.readdirSync(RAIZ, { withFileTypes: true }).filter(e => e.isFile() && BACKUP.test(e.name)).map(e => e.name);
if (backups.length) {
  backups.forEach(f => warn(JSON.stringify(f) + '  backup file in the root — not shell junk, but is it meant to be versioned?'));
  info('git already keeps every version; a .bak next to the file is a second truth that ages in silence.');
  info('keep it → move it out of the root or add it to .gitignore · done with it → delete');
}

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

// ── 4b. Os três arquivos que carregam SEMPRE — e o total.
//
// O passo 4 media agente, skill e command e parava ali. A primeira versão deste bloco
// media só a nota, porque ela é o arquivo que mais cresce. Mas o que entra em toda
// sessão são TRÊS: a fonte, o adaptador e a nota — e medido em projetos reais o
// AGENTS.md pesava mais que a nota em todos eles. Passamos um dia cortando o menor.
//
// O aviso só serve com DESTINO. "Está grande" é moralismo; "isto pertence a tal
// arquivo" é uma ação. Por isso os dois andam juntos — em `imprimirContextoFixo`.
log('');
imprimirContextoFixo();

// ═══════════════════════════════════════════ 5. BASE DE CONHECIMENTO EM .marvin/
log('\n\x1b[1m5. Knowledge base (a single folder — plain markdown, organized as a graph)\x1b[0m');
// DOCS foi detectado lá em cima, antes de qualquer escrita, porque o --check precisa dele.
const novoVault = !fs.existsSync(DOCS);
fsw.mkdirSync(DOCS, { recursive: true });
info('vault: ' + path.relative(RAIZ, DOCS) + (novoVault ? '  (created now)' : '  (already existed)'));
const docsDoProduto = CANDIDATOS.find(d => fs.existsSync(d) && !ehVault(d) && path.resolve(d) !== path.resolve(DOCS));
if (docsDoProduto) info('living next to ' + path.relative(RAIZ, docsDoProduto) + '/ from the product — untouched');
// Nenhuma config de ferramenta é escrita aqui: são só arquivos .md numa pasta, e
// esse é o ponto. Qualquer editor abre. Quem quiser usar um app de notas por cima
// aponta ele para esta pasta — a base não depende disso para funcionar.

// Escreve um arquivo só se não existir (invariante 2) e registra na saída.
const escreverSeFaltar = (rel, conteudo) => {
  const p = path.join(DOCS, rel);
  if (fs.existsSync(p)) { info(rel + ' already exists'); return false; }
  fsw.mkdirSync(path.dirname(p), { recursive: true });
  fsw.writeFileSync(p, conteudo);
  ok(rel);
  return true;
};

if (LAYOUT_ANTIGO) {
  // ── Layout por tipo de arquivo (08_Memoria/, 10_Decisoes/…). Continua funcionando
  // onde está: a junction aponta para as notas, o /retomar lê a mesma nota. O que
  // mudou é a organização — e mover conteúdo é decisão do humano, não do script.
  warn('old layout: ' + path.relative(RAIZ, DEST).replace(/\\/g, '/') + ' — the base is organized as a graph since 1.2 (Contexto/ · Planejamento/ · Releases/ · Memoria/)');
  info('  nothing was moved. To migrate: create Memoria/ next to 08_Memoria/, move the note,');
  info('  run marvin again (the junction is re-pointed), then place the rest by hand.');
  info('  why, and what goes where: https://github.com/Josuebmota/Marvin/blob/main/.marvin/Contexto/Arquitetura/organizacao-por-grafo.md');
  for (const d of ['10_Decisoes', '99_Backup']) fsw.mkdirSync(path.join(DOCS, d), { recursive: true });

  // README de 10_Decisoes. A pasta nascia vazia e sem uma linha explicando para que
  // serve, e pasta vazia não ensina ninguém: o resultado era todo mundo empilhando
  // histórico no `onde_paramos.md` até ele virar changelog.
  escreverSeFaltar('10_Decisoes/README.md', [
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
} else {
  // ── Organização por grafo. Dois eixos: o que o projeto É (Contexto/) e o que está
  // sendo FEITO nele (Planejamento/). Todo nó tem um Sobre.md; ligação é link markdown,
  // porque é o que vira aresta no grafo (passo 8b) — menção em prosa não é aresta.
  //
  // Cada pasta nasce com o arquivo que diz o que entra nela. Pasta vazia não ensina
  // ninguém, e o resultado de pasta muda foi medido: relato empilhado na nota que
  // carrega em toda sessão (18 seções num projeto real).
  const dirs = ['Contexto/Fluxos', 'Contexto/Arquitetura', 'Planejamento/Manutencao', 'Planejamento/Novos', 'Fontes', 'Releases', 'Memoria'];
  if (TEM_FRONT) dirs.push('Contexto/Design');
  for (const d of dirs) fsw.mkdirSync(path.join(DOCS, d), { recursive: true });
  info('Contexto/ (what it IS) · Planejamento/ (what is being DONE) · Fontes/ · Releases/ · Memoria/' + (TEM_FRONT ? ' · Contexto/Design/ (front detected)' : ''));

  escreverSeFaltar('Contexto/Sobre.md', `---
tipo: projeto
---
# ${path.basename(RAIZ)}

_(três linhas: o que é, para quem, o que NÃO é)_

## Fluxos

_(um fluxo entra aqui quando é analisado numa atividade — não antes. Uma linha e um link:)_
<!-- - [checkout](Fluxos/checkout.md) — cobrança e estorno -->

## Arquitetura

_(como foi projetado e com o quê. Decisão estrutural — a que não pertence a uma US — mora aqui.)_
<!-- - [visao-geral](Arquitetura/visao-geral.md) -->
${TEM_FRONT ? `
## Design

_(o design do front: telas, componentes, onde mora o Figma)_
<!-- - [telas](Design/telas.md) -->
` : ''}
## Em andamento

Ver [onde_paramos](../Memoria/onde_paramos.md) — só ponteiros para as US ativas.

## Como esta base está organizada

| Pasta | Responde | Regime |
|---|---|---|
| \`Contexto/\` | o que o projeto **é** | cresce quando um fluxo é analisado |
| \`Planejamento/\` | o que está sendo **feito**: Epic → Feature → US | todo nó tem um \`Sobre.md\` |
| \`Releases/\` | o que **subiu** para main | índice, um arquivo por versão |
| \`Fontes/\` | apoio e o que vive fora deste repositório | |
| \`Memoria/onde_paramos.md\` | as US **em andamento** | só ponteiros; sobrescrito |

Ligação é **link markdown** — é o que vira aresta no grafo. Menção em prosa não conta.
Nada muda de pasta ao concluir: a US ganha \`estado: concluida\` e entra numa release.
Mudar esta organização é uma entrada no Rumo abaixo.

## Portabilidade

| Item | Migra? |
|---|---|
| \`AGENTS.md\`, esta pasta inteira, a memória | ✅ é só markdown |
| Persona dos agentes (o corpo do \`.md\`) | ✅ copiar e colar |
| Definição de modelo/tools no frontmatter | ❌ formato de cada ferramenta |
| Slash commands | ❌ vira prompt manual |
| Auto-load da memória | ❌ **só o carregamento; os arquivos ficam** |

A memória foi montada de propósito **dentro do repositório**, não no perfil do usuário.

## Rumo

- **_(data)_** — base criada com esta organização.
`);

  escreverSeFaltar('Contexto/Fluxos/README.md', `# Fluxos

Um arquivo por fluxo do produto (\`checkout.md\`, \`login.md\`…). **Incremental:** o fluxo
entra quando uma atividade exige analisá-lo, e o que se descobriu fica aqui em vez de
ser redescoberto na próxima. Link para cá a partir do [Sobre.md](../Sobre.md) e da US.

Formato mínimo:

\`\`\`markdown
# Fluxo <nome>

<o que ele faz, em três linhas>

## Passos
1. <passo> — \`src/<arquivo>\` — \`<função>\`

## Regras que não podem quebrar
- <invariante do fluxo>

## US que passaram por aqui
- [US-12](../../Planejamento/Novos/<Epic>/<Feature>/US-12/Sobre.md)
\`\`\`
`);

  escreverSeFaltar('Planejamento/README.md', `# Planejamento

O que está sendo **feito**, em três níveis: \`<Epic>/<Feature>/<US>/\`, cada um com o seu
\`Sobre.md\`. \`Manutencao/\` para o que já existe; \`Novos/\` para o que ainda não.

## Antes de qualquer US — mapear, montar o time, propor skills

**Nenhuma US começa sem esta passada, e ela se repete a cada atividade nova.** É o que
faz o time crescer em camadas em vez de nascer genérico.

1. **Mapear o que a atividade toca:** o fluxo, a arquitetura, o código. Fluxo que ainda
   não tem nota em \`../Contexto/Fluxos/\` ganha uma agora — é assim que ela cresce.
2. **Propor o time desta atividade** e registrar na seção *Time* do \`Sobre.md\` da US.
   A base é sempre esta; o que a atividade não usa **não é criado**:

   | Papel | Dono de | Precisa de |
   |---|---|---|
   | \`tl\` | invariantes, diff, decisão de rumo | julgamento |
   | \`po\` | o porquê, o critério de pronto, a prioridade | julgamento |
   | \`dev-front\` | tela e componente | implementação |
   | \`dev-back\` | serviço, regra, integração | implementação |
   | \`qa\` | evidência: teste, cenário, o que ainda não foi provado | implementação |
   | \`scout\` | achar arquivo, símbolo, uso — e só isso | recuperação |

   Mais a **camada da atividade**, quando ela pede: \`design\` se há tela nova, \`dba\` se há
   schema ou migração, \`sec\` se há auth ou dado sensível, \`infra\` se há deploy ou CI.
3. **Atualizar os agentes em camadas:** \`.claude/agents/<papel>.md\` recebe as armadilhas
   descobertas **nesta** atividade — acrescenta, não reescreve o que já valia. Um papel só
   existe como arquivo depois de ter uma armadilha concreta para carregar.
4. **Propor skills:** procedimento que esta atividade vai repetir (rodar migração, gerar
   release, subir ambiente) entra na seção *Skills* da US como proposta — e vira
   \`.claude/skills/<nome>/SKILL.md\` na **segunda** vez que rodar, não na primeira.

Regras:

- **Decisão mora no nó que a tomou.** Da US, na US; da feature, na feature. Estrutural,
  em \`Contexto/Arquitetura/\`.
- **Mudar de rumo é normal e fica explícito.** Registra no *Rumo* e segue. Se preciso,
  cancela os filhos e abre novos — a entrada fica no Rumo do pai.
- **Nada muda de pasta.** US concluída fica onde está, com \`estado: concluida\` e a
  evidência preenchida. Reabrir é outra release.
- **Aresta é link.** Fluxo ligado, código tocado e pai são links/caminhos — é o que o
  grafo lê.

## O formato — um só para Epic, Feature e US

\`\`\`markdown
---
tipo: us            # epic | feature | us
estado: ativa       # ativa | concluida | cancelada
pai: ../Sobre.md
---
# US-12 — <título em uma frase>

**Por quê:** <uma linha>
**Pronto quando:** <critério verificável>

## Filhos
<!-- Epic e Feature: links para os Sobre.md abaixo. US: não tem. -->

## Fluxos ligados
- [checkout](../../../../Contexto/Fluxos/checkout.md)

## Código tocado
- \`src/checkout/pagamento.ts\` — \`calcularEstorno\`

## Time
<!-- proposto ANTES de começar, pela regra do AGENTS.md. Base: tl · po · dev-front · dev-back · qa · scout.
     Mais a camada da atividade (design, dba, sec, infra) quando ela pede. -->
- tl, po, dev-back, qa, scout
- dba — a US muda o schema de pagamentos

## Skills
<!-- procedimento que esta atividade vai repetir; vira SKILL.md na segunda vez -->
- rodar-migracao — proposta

## Rumo
- **<data>** — aberta.
- **<data>** — vimos que <x>; decidido <y>, descartado <z> porque <w>.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
\`\`\`

*Código tocado* usa crase com o caminho a partir da raiz do repositório, e o nome da
função depois de um traço — é assim que o grafo liga a US ao nó de código.
`);

  escreverSeFaltar('Releases/README.md', `# Releases

Um arquivo por versão que subiu para main: \`<versao>.md\`. É um **índice**, não um
relato — uma linha por US, com link e evidência. O relato já está no \`git log\`.

\`\`\`markdown
# 1.4.0 — <data>

- [US-12 — título](../Planejamento/Novos/<Epic>/<Feature>/US-12/Sobre.md) — evidência: PR #88
\`\`\`

Ao entrar aqui, a US sai do \`onde_paramos.md\`. Reaberta depois? É outra release.
`);

  escreverSeFaltar('Fontes/README.md', `# Fontes

Apoio e suporte: o que ajuda a trabalhar mas não é contexto nem planejamento —
referência de API, esquema de banco, glossário, transcrição de reunião.
\`Externas.md\` diz onde a verdade do produto vive **fora** deste repositório.
`);
}

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
if (WORKTREE) info('git worktree — this checkout gets its own junction; notes written here travel with this branch');
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

// 00_Inicio.md era o nó raiz do layout antigo. No layout por grafo o nó raiz é
// Contexto/Sobre.md (passo 5), e a montagem da junction já está no CLAUDE.md.
const idx = path.join(DOCS, '00_Inicio.md');
if (!LAYOUT_ANTIGO) { /* nada: Contexto/Sobre.md é a raiz */ }
else if (!fs.existsSync(idx)) {
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
} else info('00_Inicio.md already exists');

// ═══════════════════════════════════════════ 6b. FONTES EXTERNAS
log('\n\x1b[1m6b. External sources (where user stories, tickets and specs live)\x1b[0m');
const FONTES = path.join(DOCS, LAYOUT_ANTIGO ? '00_Fontes_Externas.md' : 'Fontes/Externas.md');
const NOME_FONTES = path.relative(DOCS, FONTES).replace(/\\/g, '/');
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

// Projeto migrado do layout antigo ainda tem o arquivo com o nome velho: é o mesmo
// conteúdo, então conta como existente — senão nasce um em branco por cima (aconteceu).
const FONTES_ANTIGO = path.join(DOCS, '00_Fontes_Externas.md');
if (fs.existsSync(FONTES)) {
  info(NOME_FONTES + ' already exists — not overwriting');
} else if (!LAYOUT_ANTIGO && fs.existsSync(FONTES_ANTIGO)) {
  warn('00_Fontes_Externas.md is the old name — move it to ' + NOME_FONTES + ' (nothing written)');
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
  ok(NOME_FONTES + (respostas ? ' (filled in)' : ' (blank — fill it in)'));
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
  : `- **Uma fronteira só:** \`dev-front\` e \`dev-back\` da base do \`AGENTS.md\` podem ser um
  \`dev\` único aqui. O resto da base (\`tl\`, \`po\`, \`qa\`, \`scout\`) vale igual.`);
})()}
- **Não crie papel vazio para preencher a pasta.** Um \`.md\` sem as armadilhas concretas
  deste código entra no contexto de toda sessão e não devolve nada. Genérico é pior que
  ausente — é por isso que o marvin gera esta pasta e não os agentes.
${PONYTAIL ? `
### Ponytail: em que papel entra

Este projeto usa o ponytail (\`${REGISTRO_REL}\`). A escada dele vale para quem
**implementa** sem convenção escrita — não para quem lê diff ou decide requisito. Sugestão,
não regra; o corpo de cada agente é seu:

| papel | ponytail | por quê |
|---|---|---|
| \`dev-back\` / \`dev-front\` | **sim** | implementação: o menor diff que funciona |
| \`qa\` | talvez | o "um check executável" dele conflita com suíte real |
| \`tl\` | **não** | lê diff; precisa do porquê, não do mais curto |
| \`po\` | **não** | questiona requisito — a escada começa depois disso |
| \`scout\` | **não** | recuperação em haiku; não escreve código |
` : ''}

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
   nota canônica está faltando.${LAYOUT_ANTIGO ? '' : `
   Ela é uma lista de ponteiros: **siga o link** de cada US ativa e leia o \`Sobre.md\` dela —
   o estado e o Rumo moram lá, não na nota. Não abra o resto da base sem necessidade.`}

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

---

## Ao fechar — quando sugerir um chat novo

Contexto acumulado custa em **toda** requisição, não só uma vez. Conversa longa que já
mudou de assunto carrega peso morto no resto da sessão inteira.

**Sugira um chat novo quando as três forem verdade:**

1. O assunto mudou — outra tarefa, outro subsistema, outro projeto
2. A sessão já está longa
3. **O estado está registrado** em \`onde_paramos.md\` — sem isso, o chat novo começa cego

**NÃO sugira quando:** o trabalho novo depende de algo descoberto agora e **ainda não
escrito**; está no meio de algo (correção feita, falta validar); a sessão é curta — recomeçar
custa mais do que continuar, porque o contexto fixo recarrega inteiro.

**A regra que fecha:** registrar **antes** de sugerir. Ao sugerir, diga **o que já está salvo**
e **qual seria a primeira frase** do chat novo.
`);
  ok('.claude/commands/retomar.md  → type /retomar in a new chat');
} else info('/retomar already exists');

// /us e /fechar: os dois gatilhos que faltavam. A regra "antes de qualquer US" e a regra
// de fechar sessão existiam como texto; texto depende de alguém lembrar. Um comando dispara.
// /us chama o `marvin --us`, que cria a cadeia de Sobre.md e o ponteiro — o agente só
// preenche o que exige julgamento. /fechar é o par do /retomar. Só no layout por grafo.
if (!LAYOUT_ANTIGO) {
  const relDocs = path.relative(RAIZ, DOCS).replace(/\\/g, '/');   // o 7c declara o dele depois
  const cmdUs = path.join(cmdDir, 'us.md');
  if (!fs.existsSync(cmdUs)) {
    fsw.writeFileSync(cmdUs, `---
description: Abre uma US — cria o Sobre.md, aponta na nota, e faz a passada de mapear, time e skills
---

Abra a US **$ARGUMENTS** neste projeto. O caminho é \`Novos|Manutencao/<Epic>/<Feature>/<US-nome>\`;
se eu passei só o nome, pergunte em qual Epic e Feature ela entra (liste os que existem em
\`${relDocs}/Planejamento/\`) antes de criar qualquer coisa.

1. Rode \`marvin --us <caminho>\`. Ele cria a cadeia de \`Sobre.md\` que faltar e põe a linha em
   \`${path.relative(RAIZ, DEST).replace(/\\/g, '/')}/onde_paramos.md\`. Se \`marvin\` não estiver no PATH:
   \`npx marvin-kb --us <caminho>\`.

2. A passada que a regra pede — está em \`${relDocs}/Planejamento/README.md\`, leia antes:
   - **Mapear** o que a US toca: fluxo, arquitetura, código. Fluxo que ainda não tem nota em
     \`${relDocs}/Contexto/Fluxos/\` ganha uma agora. Preencha *Fluxos ligados* e *Código tocado*
     (crase com o caminho, e a função depois de um traço — é o que liga a US ao grafo).
   - **Propor o time** desta US, a partir da base do \`AGENTS.md\`: só os papéis que ela usa,
     mais a camada da atividade (design, dba, sec, infra) se ela pede. Escreva em *Time*.
   - **Propor skills**: procedimento que a US vai repetir vai em *Skills* como proposta.
   - **Por quê** e **Pronto quando** — se eu não disse, pergunte; não invente.
   - Com o *Código tocado* preenchido, rode \`marvin --us <caminho>\` **de novo**: o grafo escreve a
     seção *Impacto* — quem depende do que a US toca, e que outras US passam por ali.

3. Me mostre o \`Sobre.md\` preenchido e a linha da nota. **Não comece a implementar.**
`);
    ok('.claude/commands/us.md  → /us <caminho> opens a US the right way');
  } else info('/us already exists');

  const cmdFechar = path.join(cmdDir, 'fechar.md');
  if (!fs.existsSync(cmdFechar)) {
    fsw.writeFileSync(cmdFechar, `---
description: Fecha a sessão — registra o Rumo da US, atualiza a nota, confere a árvore, e diz se é hora de um chat novo
---

Feche a sessão. O par do \`/retomar\`: nada do que foi descoberto hoje pode ficar só na conversa.

1. \`git status --short\` e \`git log --oneline -3\`. Arquivo novo sem justificativa → me pergunte.

2. Para cada US que mexemos hoje (as da seção *Em andamento* de
   \`${path.relative(RAIZ, DEST).replace(/\\/g, '/')}/onde_paramos.md\`): uma entrada no **Rumo** do \`Sobre.md\`
   dela, datada, com o que se viu e o que se decidiu — e o que foi descartado, se houve. Concluiu
   e foi validada? *Evidência* preenchida, \`estado: concluida\`, linha em \`${relDocs}/Releases/<versao>.md\`,
   e **sai da nota**.

3. Reescreva a linha de cada US na nota: **o próximo passo numa frase**. A nota é lista de
   ponteiros — **não** escreva relato nela; o relato acabou de ir para o Rumo.

4. Armadilha nova que um papel sofreu hoje → o \`.md\` daquele agente em \`.claude/agents/\`,
   acrescentando. Procedimento que rodou pela **segunda** vez → skill.

5. Rode \`marvin --fechar\` — ele cruza o diff com o *Código tocado* das US ativas e acusa o que
   mudou sem dono. Corrija o *Código tocado* (ou abra a US que faltava) e rode \`marvin --us <caminho>\`
   de novo: o *Impacto* é regerado. Depois \`marvin --status\` — se acusar algo, conserte antes de fechar.

6. Diga se é hora de um chat novo — a regra está no rodapé do \`/retomar\` — e, se for, **qual
   seria a primeira frase** dele.

$ARGUMENTS
`);
    ok('.claude/commands/fechar.md  → /fechar closes the session; the pair of /retomar');
  } else info('/fechar already exists');

  // ── Hook de abertura de sessão. O `--status` sai != 0 quando a nota mente, mas só quem
  // roda vê — e a nota de um projeto real chegou a 52 KB sem que ninguém rodasse. O hook
  // SessionStart do Claude Code injeta a saída no contexto: o agente não pode ignorar.
  // `--curto` sempre sai 0 (exit != 0 em hook vira erro visível) e custa ~150 tk. O `--html`
  // junto regera o dashboard a cada abertura de sessão, em silêncio — é assim que ele se atualiza.
  // Confiança MÉDIA: convenção de hook muda rápido — o aviso manda conferir (invariante 3).
  // settings.json que já existe é de outra pessoa: NÃO faz merge — imprime o bloco e para.
  const settings = path.join(RAIZ, '.claude', 'settings.json');
  // O comando aponta para O SCRIPT QUE MONTOU, não para `npx marvin-kb`: o npx baixa a
  // versão publicada, e uma versão que não conhece `--status` ignoraria a flag e rodaria
  // a montagem inteira a cada abertura de sessão. Mesma escolha do post-commit do 8b.
  const comandoHook = fs.existsSync(path.join(RAIZ, 'marvin.mjs')) ? 'node marvin.mjs --status --curto --html'
    : 'node "' + process.argv[1].replace(/\\/g, '/') + '" --status --curto --html';
  const blocoHook = { hooks: { SessionStart: [{ matcher: '', hooks: [{ type: 'command', command: comandoHook }] }] } };
  if (!fs.existsSync(settings)) {
    fsw.writeFileSync(settings, JSON.stringify(blocoHook, null, 2) + '\n');
    ok('.claude/settings.json — SessionStart hook: `' + comandoHook + '` (confidence: medium — check the hook format in the current Claude Code docs)');
  } else {
    let txt = ''; try { txt = fs.readFileSync(settings, 'utf8'); } catch {}
    if (/--status --curto/.test(txt)) info('.claude/settings.json already runs the status hook');
    else {
      warn('.claude/settings.json exists — not merged (it is yours). To get the status at session start, add:');
      JSON.stringify(blocoHook, null, 2).split('\n').forEach(l => info('  ' + l));
    }
  }
}

const ondeParamos = path.join(DEST, 'onde_paramos.md');
if (fs.existsSync(ondeParamos)) {
  info('onde_paramos.md already exists');
} else if (!LAYOUT_ANTIGO) {
  // A nota do layout por grafo é só ponteiro. O estado de cada US mora no Sobre.md dela
  // e só carrega quando é seguido — é a diferença entre 1 KB e 19 KB por sessão.
  fsw.writeFileSync(ondeParamos, `---
name: onde-paramos
aliases: ["onde-paramos", "ONDE PARAMOS"]
description: "ÚNICA porta de entrada. Só ponteiros para as US em andamento — sempre sobrescrita."
tags: [moc, entrada]
metadata:
  type: project
---

# ▶ ONDE PARAMOS

> **Uma linha por US em andamento, com link.** O estado, as decisões e o rumo de cada
> uma moram no \`Sobre.md\` dela — **não aqui**. Esta nota carrega em TODA sessão; o que
> ela aponta só carrega quando é seguido. É assim que a memória fica barata.
>
> - Concluiu e foi validada → entra em \`Releases/<versao>.md\` com a evidência, e **sai daqui**.
> - Duas sessões em paralelo editam **linhas diferentes**; nenhuma reescreve a outra.
> - Criar \`onde_paramos_<data>.md\` **ou uma seção de relato aqui dentro** é o mesmo erro:
>   o histórico já está no \`git log\`, e o porquê já está no Rumo da US.

**Atualizado:** _(data)_

## Em andamento

_(uma por linha — link para o Sobre.md, e o próximo passo numa frase)_
<!-- - [US-12](../Planejamento/Novos/<Epic>/<Feature>/US-12/Sobre.md) — falta o teste do estorno -->

## Travado

_(só o que trava TODAS as US — acesso, ambiente, decisão de fora. O que é de uma US vai no Rumo dela. Se nada, "nada".)_

`);
  ok('onde_paramos.md (pointers only — one line per active US)');
} else {
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
}

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

\`${relDocs}/\` é a base de conhecimento — markdown puro, arquivo real${LAYOUT_ANTIGO ? '' : ', **organizada como grafo**'}.
**Legível por qualquer ferramenta**, e por nenhuma também: é só uma pasta com \`.md\` dentro.
${LAYOUT_ANTIGO ? `
- \`${relMem}/onde_paramos.md\` — a única porta de entrada
- \`${relDocs}/00_Fontes_Externas.md\` — o que vive fora deste repositório
- \`${relDocs}/10_Decisoes/<slug>.md\` — **por que** escolhemos cada coisa (ver o README de lá)

**A nota é curta; a decisão é imutável.** O \`onde_paramos.md\` responde *onde estamos agora* e é
sobrescrito. Quando você escrever o *porquê* de uma escolha dentro dele, ele começou a virar
changelog — e ele carrega em toda sessão. O porquê vai para \`10_Decisoes/\`; o relato do que foi
feito já está no \`git log\`.
` : `
- \`${relDocs}/Contexto/Sobre.md\` — o nó raiz: o que o projeto é, e a tabela de como a base é organizada
- \`${relDocs}/Planejamento/\` — Epic → Feature → US, cada um com \`Sobre.md\`; decisão mora no nó que a tomou
- \`${relMem}/onde_paramos.md\` — as US **em andamento**; só ponteiros; sobrescrito
- \`${relDocs}/ferramentas.md\` — quais ferramentas opcionais ESTE projeto usa (graphify…) e o que cada uma alcança

**A nota aponta; o nó guarda.** O \`onde_paramos.md\` carrega em toda sessão, por isso é uma
lista de links — o estado, as decisões e o Rumo de cada US moram no \`Sobre.md\` dela e só
carregam quando são seguidos. O relato do que foi feito já está no \`git log\`.
**Ligação é link markdown** — é o que vira aresta no grafo (\`marvin --graphify\`). Menção em prosa não conta.
`}
**Quando registrar: no commit.** É o momento em que uma unidade de trabalho fecha, e é o
gatilho que faz a regra ser lembrada em vez de decorada. Sem gatilho, "sempre atualizar a
memória" não dispara nunca — ou dispara sempre, que é pior.

- Commit que muda o **estado** do projeto — decisão tomada, subsistema novo, armadilha
  descoberta, algo que travou — pede uma passada ${LAYOUT_ANTIGO ? 'no \`onde_paramos.md\`' : 'no \`Sobre.md\` da US (e na nota, se uma US abriu ou fechou)'} **antes**.
- Commit de typo, formatação ou renomeação não pede nada.
- A nota é **sobrescrita**, não acrescentada: o histórico é o \`git log\`. Criar
  \`onde_paramos_<data>.md\` **ou uma seção de relato dentro dela** é o mesmo erro.

## Antes de qualquer US

**Nenhuma US começa sem a passada de \`${relDocs}/Planejamento/README.md\`:** mapear o que a
atividade toca, propor o time dela em camadas (\`tl\`, \`po\` · \`dev-front\`, \`dev-back\`, \`qa\` ·
\`scout\`, mais a camada da atividade), propor as skills que ela vai repetir. A regra inteira
mora lá porque é lá que ela dispara — aqui só o lembrete.

${PONYTAIL ? `## Ferramentas

**Ponytail** (confiança **baixa** — plugin instalado e README lido, não medido): escada de
simplicidade que faz o agente parar no primeiro degrau que resolve (não existir → reutilizar →
stdlib → …). Vale para quem **implementa**. Ele **não substitui**: os invariantes deste arquivo,
o \`tl\` lendo diff, o \`po\` questionando requisito, nem a suíte de testes — o "um check" dele
é o piso, não o teto. Quais papéis o carregam: \`.claude/agents/README.md\`. Ativo nesta máquina
= \`~/.claude/.ponytail-active\`; instalado sem ativo não faz nada.

` : ''}## Higiene de sessão

Contexto acumulado custa em **toda** requisição. Quando sugerir um chat novo, e o que dizer
ao sugerir, está no rodapé de \`/retomar\` (\`.claude/commands/retomar.md\`) — é o comando que
abre a sessão, então é onde a regra de fechar mora. **A regra que fecha:** registrar antes de sugerir.

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

  const SAIDA = path.join(RAIZ, 'graphify-out');
  const GRAFO = path.join(SAIDA, 'graph.json');

  // Sem graphify no PATH mas com grafo já construído (CI, outra máquina), o lado dos
  // docs ainda pode ser anexado — é só JSON. Só a extração de código exige o binário.
  if (!versao && !fs.existsSync(GRAFO)) {
    warn('graphify not found on PATH — step skipped, nothing else changed');
    info('install it in isolation (no need to go global):');
    info('  uv tool install graphifyy    ·    pipx install graphifyy');
    info('then run again with --graphify');
  } else {
    if (versao) info(versao);
    else warn('graphify not found on PATH — using the existing graph.json; code will not be re-extracted');

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
    let construiu = false;
    if (!versao) {
      /* sem binário: nada a extrair */
    } else if (fs.existsSync(GRAFO) && !GRAPHIFY_REBUILD) {
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
          if (fs.existsSync(GRAFO)) { ok('graph built — ' + contarNos(GRAFO) + ' nodes in graphify-out/'); construiu = true; }
          else err('no graph was produced');
        } else construiu = true;
      } catch {
        err('the graph build failed — nothing else changed');
      }

    }

    // ── O lado dos docs: a base de conhecimento entra no MESMO grafo, gerada AQUI.
    //
    // Medido em 10/09/2026 antes de decidir: o graphify só indexa `.md` por LLM —
    // 93 K tokens para três arquivos de amostra, não determinístico, e a aresta
    // doc→código foi DESCARTADA por ele mesmo ("out-of-scope"). E o `merge-graphs`
    // prefixa os ids por repositório, o que quebra qualquer aresta cruzada. Então o
    // Marvin escreve os nós de doc e as arestas por regex e anexa direto no graph.json:
    // zero LLM, zero custo, o mesmo resultado a cada run. É o que faz `path`,
    // `affected` e `query` responderem "que US toca esta função" nos dois sentidos.
    //
    // Regras de aresta, todas lidas do markdown:
    //   [x](caminho.md) relativo                 → references  (doc → doc)
    //   [x](../../src/a.js) relativo a código    → touches     (doc → arquivo)
    //   `pai:` no frontmatter                    → child_of
    //   crase em "## Código tocado":  `src/a.js`           → touches (arquivo)
    //                                 `src/a.js` — `fn`    → touches (função)
    // Bloco de código e comentário HTML são ignorados: os READMEs trazem o formato
    // como exemplo, e exemplo não é aresta.
    //
    // Idempotente: tudo que este bloco escreve leva `_origin: 'marvin'`, e é removido e
    // regerado a cada run. Nó de código que não existe no grafo vira AVISO, nunca nó
    // fantasma — função renomeada é exatamente o que a régua deve acusar.
    let docsMudou = false;
    if (fs.existsSync(GRAFO) && fs.existsSync(DOCS)) {
      let g = null;
      try { g = JSON.parse(fs.readFileSync(GRAFO, 'utf8')); } catch {}
      if (g && Array.isArray(g.nodes)) {
        // `extract` escreve `edges`; depois do `cluster-only` o arquivo sai em formato
        // networkx, com `links`. O anexo respeita o que encontrar.
        const CHAVE = Array.isArray(g.links) ? 'links' : 'edges';
        g.edges = g[CHAVE] || [];
        const antes = JSON.stringify({ n: g.nodes.filter(n => n._origin === 'marvin'), e: g.edges.filter(e => e._origin === 'marvin') });
        g.nodes = g.nodes.filter(n => n._origin !== 'marvin');
        g.edges = g.edges.filter(e => e._origin !== 'marvin');
        const ids = new Set(g.nodes.map(n => n.id));
      const { novosNos, novasArestas, avisos } = grafoDosDocs(ids, subRepos);
        g.nodes.push(...novosNos);
        g.edges.push(...novasArestas);
        if (CHAVE !== 'edges') { g[CHAVE] = g.edges; delete g.edges; }
        const depois = JSON.stringify({ n: novosNos, e: novasArestas });
        docsMudou = antes !== depois;
        if (docsMudou) {
          // Preserva o mtime: o check de frescor abaixo compara código com a HORA DA
          // EXTRAÇÃO, e anexar docs não re-extraiu nada.
          let st = null; try { st = fs.statSync(GRAFO); } catch {}
          fsw.writeFileSync(GRAFO, JSON.stringify(g, null, 1));
          if (!DRY && st) { try { fs.utimesSync(GRAFO, st.atime, st.mtime); } catch {} }
        }
        ok('knowledge base in the graph — ' + novosNos.length + ' doc node(s), ' + novasArestas.length + ' edge(s)' + (docsMudou ? '' : ' (unchanged)'));
        if (avisos.length) {
          warn(avisos.length + ' link(s) from docs to code did not land on a node:');
          avisos.slice(0, 8).forEach(a => info('  ' + a));
          if (avisos.length > 8) info('  … and ' + (avisos.length - 8) + ' more');
        }
        info('  try:  graphify affected "<function>"   — which US and which code depend on it');
      }
    }

    // ── Relatório e HTML. O `extract` para no graph.json DE PROPÓSITO: o report e
    // os nomes das comunidades são passo separado, e é por isso que tanta gente
    // acha que a instalação quebrou ao não achar o graph.html que o README do
    // graphify mostra. Sem --graphify-label roda --no-label: determinístico,
    // grátis, sem chave — o html sai igual, só com "Community 0/1/2" nos nomes.
    // Roda quando o grafo mudou — construído agora ou docs anexados — e só com o binário.
    if (versao && (construiu || docsMudou) && (DRY || fs.existsSync(GRAFO))) {
      let modo = '--no-label';
      if (GRAPHIFY_LABEL) {
        let temClaude = false;
        try { execSync('claude --version', { stdio: 'ignore' }); temClaude = true; } catch {}
        if (temClaude) modo = '--backend claude-cli';
        else warn('--graphify-label ignored: no `claude` on PATH — using --no-label');
      }
      // Só os docs mudaram? O cluster-only reescreve o graph.json, e o check de frescor
      // abaixo compara o código com o mtime dele — sem isto, anexar docs faria um grafo
      // velho parecer fresco.
      let stAntes = null;
      if (!construiu) { try { stAntes = fs.statSync(GRAFO); } catch {} }
      try {
        exec('graphify cluster-only . ' + modo, { cwd: RAIZ, stdio: 'inherit' });
        if (!DRY && stAntes) { try { fs.utimesSync(GRAFO, stAntes.atime, stAntes.mtime); } catch {} }
        ok('GRAPH_REPORT.md and graph.html written — open the html in any browser');
      } catch {
        warn('the report step failed — graph.json is fine, only the html is missing');
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
  // Regra mora onde dispara (11/09): fechar sessão → /retomar; portabilidade → Sobre.md;
  // antes da US → Planejamento/README. O AGENTS.md carrega em toda sessão e ficou só com
  // o lembrete de uma linha. Quem montou antes tem as seções inteiras no AGENTS.md — vale.
  { arquivo: '.claude/commands/retomar.md', marca: /Ao fechar/,
    o_que: 'the "Ao fechar" footer — when to suggest a new chat (moved here from AGENTS.md)' },
  { arquivo: 'AGENTS.md', marca: /Higiene de sessão/i,
    o_que: 'the "Higiene de sessão" pointer' },
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
    marca: /por que escolhemos isto/i, soCom: LAYOUT_ANTIGO,
    o_que: 'the decisions README — what belongs there instead of in onde_paramos.md' },
  { arquivo: 'AGENTS.md', marca: /A nota é curta; a decisão é imutável/, soCom: LAYOUT_ANTIGO,
    o_que: 'the "note is short, decision is immutable" rule — where overflow goes' },
  // Organização por grafo (1.2). Quem montou no layout novo por uma versão anterior a
  // alguma seção nova fica sabendo aqui; quem está no layout antigo recebe o aviso do
  // passo 5, não estas marcas — cobrar seção de grafo num AGENTS.md antigo seria ruído.
  { arquivo: '.claude/commands/fechar.md', marca: /--fechar/, soCom: !LAYOUT_ANTIGO,
    o_que: 'the `marvin --fechar` step — drift between the diff and the active USs' },
  { arquivo: '.claude/commands/us.md', marca: /Impacto/, soCom: !LAYOUT_ANTIGO,
    o_que: 'the second `marvin --us` run that writes the Impacto section from the graph' },
  { arquivo: '.claude/settings.json', marca: /--status --curto/, soCom: !LAYOUT_ANTIGO,
    o_que: 'the SessionStart hook running `marvin --status --curto` (the note cannot lie unnoticed)' },
  { arquivo: 'AGENTS.md', marca: /Antes de qualquer US/,
    o_que: 'the "Antes de qualquer US" pointer — the rule itself lives in Planejamento/README.md' },
  { arquivo: path.relative(RAIZ, path.join(DOCS, 'Contexto', 'Sobre.md')).replace(/\\/g, '/'),
    marca: /##\s*Portabilidade/, soCom: !LAYOUT_ANTIGO,
    o_que: 'the "Portabilidade" table (moved here from AGENTS.md)' },
  { arquivo: 'AGENTS.md', marca: /A nota aponta; o nó guarda/, soCom: !LAYOUT_ANTIGO,
    o_que: 'the "note points, node keeps" rule — the knowledge base as a graph' },
  { arquivo: 'AGENTS.md', marca: /seção\s+de\s+relato/, soCom: !LAYOUT_ANTIGO,
    o_que: 'the rule naming the loophole: a report SECTION inside the note is the same error as a new file' },
  { arquivo: path.relative(RAIZ, path.join(DOCS, 'Contexto', 'Sobre.md')).replace(/\\/g, '/'),
    marca: /Como esta base está organizada/, soCom: !LAYOUT_ANTIGO,
    o_que: 'the "how this base is organized" section — changing it is an entry in Rumo' },
  { arquivo: path.relative(RAIZ, path.join(DOCS, 'Planejamento', 'README.md')).replace(/\\/g, '/'),
    marca: /Código tocado/, soCom: !LAYOUT_ANTIGO,
    o_que: 'the Sobre.md format for Epic/Feature/US — "Código tocado" is what links a US to code in the graph' },
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
  // O registro nasce sozinho (bloco 0b) — mas o AGENTS.md gerado antes dele não aponta
  // para lá, e registro que ninguém lê é o mesmo que nenhum.
  { arquivo: 'AGENTS.md', marca: /ferramentas\.md/, soCom: !LAYOUT_ANTIGO,
    o_que: 'the pointer to .marvin/ferramentas.md — which optional tools THIS project uses' },
  // Ponytail só entra quando o registro diz `sim` — cobrar a seção de quem não usa é ruído.
  { arquivo: 'AGENTS.md', marca: /## Ferramentas[\s\S]*?\*\*Ponytail\*\*/, soCom: PONYTAIL,
    o_que: 'the "Ferramentas" section on ponytail — what it does not replace (appears with --use=ponytail)' },
  { arquivo: '.claude/agents/README.md', marca: /Ponytail: em que papel entra/, soCom: PONYTAIL,
    o_que: 'the ponytail role table — which roles carry the ladder (dev yes, tl/po/scout no)' },
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
  log('  graphify builds a code graph for STRUCTURAL questions — what calls what,');
  log('  type hierarchy, cross-package deps. For finding a file, grep is cheaper.');
  log('  It needs graphify on PATH:  uv tool install graphifyy  ·  pipx install graphifyy');
  log('  then  marvin --use=graphify  (recorded in ' + REGISTRO_REL + ').');
  log('  Read the trade-offs in the README first — a stale graph answers with confidence.');
}

log('\n\x1b[1mLeft for you to write by hand:\x1b[0m');
log('  • AGENTS.md — real structure, invariants, traps, the team (the SOURCE)');
log("  • .claude/agents/*.md — the roles, with the scars of THIS codebase");
log("  • .claude/skills/*/SKILL.md — only procedures already run twice (see its README)");
log(LAYOUT_ANTIGO ? '  • ' + relMem + '/onde_paramos.md — the current state'
                  : '  • ' + relDocs + '/Contexto/Sobre.md — what the project IS; then one Sobre.md per US as work starts');
log('  Companion prompt: https://github.com/Josuebmota/Marvin/blob/main/PROMPT.md\n');
