#!/usr/bin/env node
/**
 * Smoke test do marvin. Zero dependência:
 *
 *     node teste.mjs
 *
 * O que ele cobre — e por que só isto:
 *
 * O marvin escreve no repositório dos outros E cria um link no perfil do usuário.
 * Esses são os dois lugares onde um erro custa caro, então o teste cobre os
 * invariantes que protegem os dois, e não a formatação da saída.
 *
 *   1. --help não escreve nada          (flag que todo mundo digita primeiro)
 *   2. --dry-run não escreve nada       (a promessa do dry-run)
 *   3. execução real cria a estrutura
 *   4. rodar 2× não duplica             (invariante 2 — idempotência)
 *   5. memória existente é copiada, conferida, e só então o perfil vira link
 *                                       (invariante 1 — nunca destruir sem conferir)
 *   6. projeto dentro da home não conta o nível global duas vezes  (regressão)
 *   7. junction quebrada por mudança de pasta é CONSERTADA, não só avisada
 *   8. --check acusa a montagem quebrada e não escreve nada
 *   9. o adaptador do Copilot nasce no caminho da documentação oficial
 *  10. os comandos canônicos saem do MANIFESTO — e o gerenciador, do lockfile
 *  11. a nota promete três perguntas e entrega três, com destino para o transbordo
 *
 * HERMÉTICO: cada caso roda com HOME e USERPROFILE apontando para um diretório
 * temporário. Sem isso o teste criaria junctions no perfil real de quem rodasse —
 * que é exatamente o dano que o marvin toma cuidado para não causar.
 *
 * LACUNA CONHECIDA: o ramo de ABORTO da migração (copiou menos do que a origem)
 * não é testado. Forçar uma cópia parcial exige mock de fs ou permissão de
 * diretório, e as duas coisas trariam dependência ou comportamento específico de
 * plataforma. Está anotado aqui em vez de simulado — teste que finge cobrir é
 * pior que lacuna declarada.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(AQUI, 'marvin.mjs');
const NLQ = String.fromCharCode(10);

let passou = 0, falhou = 0;
const verde = (s) => '\x1b[32m' + s + '\x1b[0m';
const vermelho = (s) => '\x1b[31m' + s + '\x1b[0m';

function checa(descricao, condicao, detalhe = '') {
  if (condicao) { console.log('  ' + verde('✓') + ' ' + descricao); passou++; }
  else { console.log('  ' + vermelho('✗') + ' ' + descricao + (detalhe ? '\n      ' + detalhe : '')); falhou++; }
}

/**
 * Cria um par (projeto, home falso) isolado e devolve os caminhos.
 *
 * O `realpathSync` não é decoração. No macOS `os.tmpdir()` devolve `/var/folders/…`,
 * que é um SYMLINK para `/private/var/folders/…`. O `process.cwd()` do processo filho
 * já vem resolvido, então o marvin deriva a chave da memória de `/private/var/…`
 * enquanto o teste a procuraria em `/var/…` — dois caminhos para o mesmo diretório,
 * e o teste falhando por olhar no lugar errado. Linux (`/tmp`) e Windows não têm essa
 * indireção, e foi por isso que só o macOS acusou.
 */
function arena(nome) {
  const base = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'marvin-teste-' + nome + '-')));
  const proj = path.join(base, 'projeto');
  const lar = path.join(base, 'lar');
  fs.mkdirSync(proj, { recursive: true });
  fs.mkdirSync(lar, { recursive: true });
  fs.writeFileSync(path.join(proj, 'package.json'), '{"name":"cobaia"}\n');
  return { base, proj, lar };
}

/** Roda o marvin com HOME/USERPROFILE redirecionados. */
function rodar({ proj, lar }, ...flags) {
  return spawnSync(process.execPath, [SCRIPT, ...flags], {
    cwd: proj,
    encoding: 'utf8',
    env: { ...process.env, HOME: lar, USERPROFILE: lar },
  });
}

/** Conta arquivos, ignorando o package.json que a arena planta. */
function arquivos(dir) {
  const achados = [];
  (function anda(d) {
    let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) anda(p);
      else achados.push(path.relative(dir, p));
    }
  })(dir);
  return achados.filter(f => f !== 'package.json');
}

/** O caminho de memória que o marvin derivaria para este projeto. */
const caminhoMemoria = (lar, proj) =>
  path.join(lar, '.claude', 'projects', proj.replace(/[:\\/]/g, '-'), 'memory');

/**
 * Remove a arena. O link tem que sair como LINK: rm -rf numa junction do Windows
 * pode seguir o link e apagar o destino — é a armadilha do AGENTS.md, e o teste
 * seria um jeito ridículo de descobri-la.
 */
function limpar({ base, lar, proj }) {
  const mem = caminhoMemoria(lar, proj);
  try {
    if (fs.lstatSync(mem).isSymbolicLink()) {
      try { fs.unlinkSync(mem); } catch { fs.rmdirSync(mem); }
    }
  } catch { /* não existe: nada a desfazer */ }
  try { fs.rmSync(base, { recursive: true, force: true }); } catch {}
}

// ═══════════════════════════════════════════════════════════════════════
console.log('\n\x1b[1mmarvin — smoke test\x1b[0m');
console.log('node ' + process.version + ' · ' + process.platform + '\n');

// ── 1. --help não escreve nada
{
  const a = arena('help');
  const r = rodar(a, '--help');
  checa('--help sai com código 0', r.status === 0, 'saiu ' + r.status);
  checa('--help imprime as flags', /--dry-run/.test(r.stdout));
  checa('--help não cria arquivo', arquivos(a.proj).length === 0,
        'criou: ' + arquivos(a.proj).join(', '));
  checa('--help não cria link no perfil', !fs.existsSync(caminhoMemoria(a.lar, a.proj)));
  limpar(a);
}

// ── 2. --dry-run não escreve nada
{
  const a = arena('dry');
  const r = rodar(a, '--dry-run');
  checa('--dry-run sai com código 0', r.status === 0, 'saiu ' + r.status);
  // Casa a estrutura do plano, não uma palavra específica: assim a asserção
  // sobrevive a uma reescrita de texto sem virar falso negativo.
  checa('--dry-run lista o plano', /create file\s+AGENTS\.md/.test(r.stdout),
        'não achou a linha do AGENTS.md no plano');
  checa('--dry-run não cria arquivo', arquivos(a.proj).length === 0,
        'criou: ' + arquivos(a.proj).join(', '));
  checa('--dry-run não cria link no perfil', !fs.existsSync(caminhoMemoria(a.lar, a.proj)));
  checa('--dry-run não roda git init', !fs.existsSync(path.join(a.proj, '.git')));
  limpar(a);
}

// ── 3. execução real cria a estrutura
{
  const a = arena('real');
  const r = rodar(a, '--no-git');
  checa('execução real sai com código 0', r.status === 0, r.stderr.slice(0, 300));
  const esperados = [
    'AGENTS.md', 'CLAUDE.md',
    path.join('.claude', 'agents', 'README.md'),
    path.join('.claude', 'skills', 'README.md'),
    path.join('.claude', 'commands', 'retomar.md'),
    path.join('.marvin', 'Contexto', 'Sobre.md'),
    path.join('.marvin', 'Planejamento', 'README.md'),
    path.join('.marvin', 'Releases', 'README.md'),
    path.join('.marvin', 'Fontes', 'Externas.md'),
    path.join('.marvin', 'Memoria', 'onde_paramos.md'),
  ];
  const criados = arquivos(a.proj);
  for (const e of esperados) checa('cria ' + e, criados.includes(e));

  const mem = caminhoMemoria(a.lar, a.proj);
  let ehLink = false;
  try { ehLink = fs.lstatSync(mem).isSymbolicLink(); } catch {}
  // O detalhe existe para o CI: quando este falha numa plataforma que não está na
  // sua frente, saber QUAL caminho foi conferido é a diferença entre diagnosticar
  // e adivinhar.
  checa('perfil vira link para o repositório', ehLink, 'conferido em ' + mem);

  if (ehLink) {
    // A prova real: escrever pelo caminho do agente tem que cair no repositório.
    fs.writeFileSync(path.join(mem, 'prova.md'), '# prova\n');
    checa('escrita pelo perfil aparece dentro do repo',
          fs.existsSync(path.join(a.proj, '.marvin', 'Memoria', 'prova.md')));
  }
  limpar(a);
}

// ── 4. rodar 2× não duplica (invariante 2)
{
  const a = arena('idem');
  rodar(a, '--no-git');
  const antes = arquivos(a.proj).sort();
  const conteudoAntes = fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8');
  const r = rodar(a, '--no-git');
  const depois = arquivos(a.proj).sort();
  checa('2ª execução sai com código 0', r.status === 0, r.stderr.slice(0, 300));
  checa('2ª execução não cria arquivo novo',
        JSON.stringify(antes) === JSON.stringify(depois),
        'antes ' + antes.length + ', depois ' + depois.length);
  checa('2ª execução não sobrescreve o AGENTS.md',
        fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8') === conteudoAntes);
  limpar(a);
}

// ── 5. migração de memória (invariante 1)
{
  const a = arena('migra');
  const mem = caminhoMemoria(a.lar, a.proj);
  fs.mkdirSync(mem, { recursive: true });
  const N = 5;
  for (let i = 1; i <= N; i++) fs.writeFileSync(path.join(mem, 'nota' + i + '.md'), '# nota ' + i + '\n');

  const r = rodar(a, '--no-git');
  checa('migração sai com código 0', r.status === 0, r.stderr.slice(0, 300));

  const destino = path.join(a.proj, '.marvin', 'Memoria');
  const sobreviventes = fs.existsSync(destino)
    ? fs.readdirSync(destino).filter(f => /^nota\d+\.md$/.test(f)).length : 0;
  checa(`as ${N} notas sobrevivem no repositório`, sobreviventes === N,
        'sobraram ' + sobreviventes);

  let ehLink = false;
  try { ehLink = fs.lstatSync(mem).isSymbolicLink(); } catch {}
  checa('perfil vira link DEPOIS de copiar', ehLink);
  checa('notas seguem visíveis pelo caminho do agente',
        ehLink && fs.readdirSync(mem).filter(f => /^nota\d+\.md$/.test(f)).length === N);
  limpar(a);
}

// ── 6. projeto DENTRO da home não conta o nível global duas vezes
// Regressão: a subida da árvore encontrava ~/.claude e o somava, e logo depois
// o nível GLOBAL era somado de novo — dobrando o total exibido. Apareceu rodando
// num diretório temporário sob o perfil do usuário, não num teste.
{
  // realpath pelo mesmo motivo da arena — ver o comentário lá.
  const base = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'marvin-teste-home-')));
  const lar = path.join(base, 'lar');
  const proj = path.join(lar, 'projeto');   // <- projeto ABAIXO da home
  fs.mkdirSync(proj, { recursive: true });
  fs.writeFileSync(path.join(proj, 'package.json'), '{"name":"cobaia"}\n');
  // um .claude global com um agente, para o nível GLOBAL ter peso mensurável
  const agentesGlobais = path.join(lar, '.claude', 'agents');
  fs.mkdirSync(agentesGlobais, { recursive: true });
  fs.writeFileSync(path.join(agentesGlobais, 'x.md'), '---\ndescription: um agente global qualquer\n---\n');

  const r = rodar({ proj, lar }, '--dry-run');
  const linhas = r.stdout.split('\n').filter(l => /\bagents\b.*\bskills\b.*\bcommands\b/.test(l));
  const globais = linhas.filter(l => /GLOBAL/.test(l));
  checa('nível GLOBAL aparece uma vez só', globais.length === 1, 'apareceu ' + globais.length + 'x');
  // A asserção precisa ser exatamente a regressão: a home falsa não pode
  // aparecer como nível próprio. Contar linhas não serve — no Windows o tmpdir
  // fica DENTRO do perfil real, então a subida acha `~/.claude` de verdade, e
  // listá-lo é o comportamento correto (é a detecção de níveis empilhados).
  const homeDuplicada = linhas.filter(l => !/GLOBAL/.test(l) && l.trimEnd().endsWith(lar));
  checa('a home não é listada como nível separado', homeDuplicada.length === 0,
        homeDuplicada.join(' | '));
  limpar({ base, lar, proj });
}

// ── 7. junction quebrada por mudança de pasta é CONSERTADA
// Regressão real, e a mais provável de todas: mover ou renomear a pasta do projeto
// deixa o caminho da memória existindo como diretório DE VERDADE e vazio — é o que o
// Claude Code cria no caminho novo. Isso derrubava o symlink com EEXIST e mesmo assim
// o script saía 0: a memória ficava desligada do repositório parecendo montada.
{
  const a = arena('quebrada');
  rodar(a, '--no-git');
  const mem = caminhoMemoria(a.lar, a.proj);
  try { fs.unlinkSync(mem); } catch { fs.rmdirSync(mem); }
  fs.mkdirSync(mem, { recursive: true });
  checa('cenário montado: diretório real no lugar do link',
        fs.existsSync(mem) && !fs.lstatSync(mem).isSymbolicLink());

  const r = rodar(a, '--no-git');
  checa('conserto sai com código 0', r.status === 0, r.stderr.slice(0, 300));
  let ehLink = false;
  try { ehLink = fs.lstatSync(mem).isSymbolicLink(); } catch {}
  checa('junction recriada por cima do diretório vazio', ehLink);
  if (ehLink) {
    fs.writeFileSync(path.join(mem, 'prova2.md'), '# prova\n');
    checa('a memória volta a cair dentro do repositório',
          fs.existsSync(path.join(a.proj, '.marvin', 'Memoria', 'prova2.md')));
  }
  limpar(a);
}

// ── 8. --check: diagnostica, não escreve, e o código de saída é a mensagem
{
  const a = arena('check');
  const r0 = rodar(a, '--check');
  checa('--check acusa projeto não montado', r0.status !== 0, 'saiu ' + r0.status);
  checa('--check não cria arquivo', arquivos(a.proj).length === 0,
        'criou: ' + arquivos(a.proj).join(', '));
  checa('--check não cria link no perfil', !fs.existsSync(caminhoMemoria(a.lar, a.proj)));

  rodar(a, '--no-git');
  const antes = arquivos(a.proj).sort();
  const r1 = rodar(a, '--check');
  checa('--check sai 0 com a memória montada', r1.status === 0, r1.stdout.slice(-300));
  checa('--check não mexe em projeto já montado',
        JSON.stringify(arquivos(a.proj).sort()) === JSON.stringify(antes));

  const mem = caminhoMemoria(a.lar, a.proj);
  try { fs.unlinkSync(mem); } catch { fs.rmdirSync(mem); }
  fs.mkdirSync(mem, { recursive: true });
  const r2 = rodar(a, '--check');
  checa('--check pega a junction virada em diretório', r2.status !== 0, 'saiu ' + r2.status);
  limpar(a);
}

// ── 9c. o plano do dry-run não inventa trabalho
// Num projeto já montado o marvin não faria nada, e era isso que o plano precisava
// dizer. Ele listava 9 "create dir" de pastas existentes — mkdir recursive em
// diretório que já existe não cria nada — e a mensagem "nothing to do" nunca aparecia.
{
  const a = arena('planolimpo');
  rodar(a, '--no-git');
  const r = rodar(a, '--dry-run', '--no-git');
  checa('dry-run em projeto montado não promete trabalho',
        !/create dir/.test(r.stdout), 'ainda lista create dir');
  checa('dry-run em projeto montado diz que não há o que fazer',
        /already set up/.test(r.stdout), r.stdout.slice(-200));
  limpar(a);
}

// ── 9b. o --check é anunciado onde a pessoa vai procurar, e o passo 10 cobra quem
// montou antes dele existir. Flag que só aparece no --help é flag que ninguém usa —
// e quem mais precisa dela é justamente quem montou o projeto na versão anterior.
{
  const a = arena('anuncio');
  rodar(a, '--no-git');
  const claude = fs.readFileSync(path.join(a.proj, 'CLAUDE.md'), 'utf8');
  checa('o CLAUDE.md gerado ensina o marvin --check', /--check/.test(claude));
  checa('o 00_Inicio.md do layout antigo não nasce mais', !fs.existsSync(path.join(a.proj, '.marvin', '00_Inicio.md')));

  // Simula projeto montado por versão antiga: CLAUDE.md sem a seção.
  fs.writeFileSync(path.join(a.proj, 'CLAUDE.md'), '# projeto\n\nAponta para AGENTS.md.\n');
  const r = rodar(a, '--no-git');
  checa('o passo 10 cobra o CLAUDE.md que não tem a nota', /--check/.test(r.stdout) &&
        /CLAUDE\.md/.test(r.stdout), 'o aviso de atualização não apareceu');
  limpar(a);
}

// ── 9d. o --graphify é mencionado na saída normal, e some quando já está em uso
// Mesma doença do --check: recurso que só existe no --help ninguém descobre. A menção
// tem que ser uma linha, depois do que importa, e mandar ler as ressalvas antes.
{
  const a = arena('grafomencao');
  const r = rodar(a, '--no-git');
  checa('a saída normal menciona o --graphify', /--graphify/.test(r.stdout));
  checa('a menção ensina como instalar', /graphifyy/.test(r.stdout));
  const r2 = rodar(a, '--no-git', '--graphify');
  checa('a menção some quando o --graphify já foi usado',
        !/Optional, and never required/.test(r2.stdout));
  limpar(a);
}

// ── 9e. monorepo: o sub-repo ignorado pela raiz chega ao CLAUDE.md gerado
// Num monorepo o grafo nascia inútil EM SILÊNCIO: a raiz ignora os sub-repositórios,
// o graphify respeita o .gitignore, e sobrava um grafo sem o código do produto dentro.
// Medido num monorepo real: 2.783 de 2.854 nós vinham de `.claude/` e zero do produto.
// O teste NÃO precisa do graphify instalado — o CI não tem. A detecção mora no topo do
// script e quem escreve o aviso é o passo 7, que roda antes do passo 8b desistir.
{
  const temGit = spawnSync('git', ['--version'], { encoding: 'utf8' }).status === 0;
  if (!temGit) {
    console.log('  - 9e pulado: git ausente nesta máquina');
  } else {
    const a = arena('monorepo');
    spawnSync('git', ['init', '-q', '.'], { cwd: a.proj });
    fs.mkdirSync(path.join(a.proj, 'svc-a'), { recursive: true });
    spawnSync('git', ['init', '-q', '.'], { cwd: path.join(a.proj, 'svc-a') });
    fs.writeFileSync(path.join(a.proj, '.gitignore'), 'svc-a/\n');
    rodar(a, '--no-git', '--graphify');
    const claude = path.join(a.proj, 'CLAUDE.md');
    const txt = fs.existsSync(claude) ? fs.readFileSync(claude, 'utf8') : '';
    checa('o CLAUDE.md gerado avisa que o projeto é monorepo', /monorepo/i.test(txt));
    checa('ele nomeia o sub-repo ignorado', /svc-a/.test(txt));
    checa('ele desaconselha o `graphify update .`', /Não rode/.test(txt));
    limpar(a);
  }
}

// ── 9f. --graphify-git-hook: escreve o post-commit e NUNCA sobrescreve um que já existe
// O grafo envelhece a cada commit e não avisa; o hook fecha essa lacuna. Mas post-commit
// é lugar disputado — pode já ter lint, changelog ou CI de outra pessoa. Sobrescrever ali
// é destruir trabalho alheio, que é o invariante 1 aplicado fora da memória.
// Pula sem graphify no PATH: o bloco mora depois da checagem de versão, e o CI não o tem.
{
  const temGraphify = spawnSync('graphify', ['--version'], { encoding: 'utf8', shell: true }).status === 0;
  const temGit = spawnSync('git', ['--version'], { encoding: 'utf8' }).status === 0;
  if (!temGraphify || !temGit) {
    console.log('  - 9f pulado: precisa de git e graphify no PATH');
  } else {
    const a = arena('githook');
    spawnSync('git', ['init', '-q', '.'], { cwd: a.proj });
    rodar(a, '--no-git', '--graphify', '--graphify-git-hook');
    const hook = path.join(a.proj, '.git', 'hooks', 'post-commit');
    checa('--graphify-git-hook escreve o post-commit', fs.existsSync(hook));
    const txt = fs.existsSync(hook) ? fs.readFileSync(hook, 'utf8') : '';
    checa('o hook traz a válvula de escape', /MARVIN_SKIP_GRAPH_HOOK/.test(txt));
    checa('o hook fixa PYTHONHASHSEED — grafo tem que ser reprodutível',
          /PYTHONHASHSEED=0/.test(txt));
    const meu = '#!/bin/sh\necho hook-de-outra-pessoa\n';
    fs.writeFileSync(hook, meu);
    rodar(a, '--no-git', '--graphify', '--graphify-git-hook');
    checa('post-commit que já existe NÃO é sobrescrito',
          fs.readFileSync(hook, 'utf8') === meu);
    limpar(a);
  }
}

// ── 9g. comandos canônicos: lidos do manifesto, nunca adivinhados. O gerenciador sai
//     do LOCKFILE — é o erro que mais custa (npm install num projeto pnpm suja o lock).
{
  const a = arena('cmd');
  fs.writeFileSync(path.join(a.proj, 'package.json'),
    JSON.stringify({ name: 'cobaia', scripts: { test: 'vitest', build: 'tsc', dev: 'vite' } }));
  fs.writeFileSync(path.join(a.proj, 'pnpm-lock.yaml'), '');
  const r = rodar(a, '--no-git');
  const md = fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8');
  checa('o AGENTS.md ganha a tabela de comandos canônicos', /## Comandos canônicos/.test(md));
  // Asserção na LINHA DA TABELA, não em substring solta: `pnpm install` contém
  // `npm install`, e a própria prosa do bloco cita o npm como exemplo do erro.
  checa('o gerenciador vem do lockfile, não do palpite',
        /| Instalar | `pnpm install` |/.test(md));
  checa('o script do package.json vira comando', /pnpm run test/.test(md));
  // A origem é o que impede o bloco de envelhecer em silêncio quando o manifesto muda.
  checa('cada linha declara de onde saiu', /package.json > scripts.test/.test(md));
  checa('a lacuna manual some quando o script preencheu', !/como rodar teste e build/.test(md));
  checa('a saída anuncia o passo 1b', /1b. Canonical commands/.test(r.stdout));
  limpar(a);
}

// ── 9h. sem manifesto legível o script NÃO inventa comando — a lacuna manual continua.
{
  const a = arena('cmd-vazio');
  fs.rmSync(path.join(a.proj, 'package.json'));
  rodar(a, '--no-git');
  const md = fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8');
  checa('sem manifesto, nenhuma tabela de comando é inventada', !/## Comandos canônicos/.test(md));
  checa('sem manifesto, a lacuna manual permanece', /como rodar teste e build/.test(md));
  limpar(a);
}
// ── 9i. a nota é contexto fixo e tem teto. O aviso só serve com DESTINO — por isso o
//     teste cobre as duas metades: que ele mede, e que ele diz para onde vai o transbordo.
{
  const a = arena('nota');
  rodar(a, '--no-git');
  const nota = path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md');
  const curta = rodar(a, '--dry-run');
  checa('a nota entra na conta do contexto fixo', /tk  onde_paramos\.md/.test(curta.stdout));
  checa('a fonte e o adaptador entram na mesma conta', /tk  AGENTS\.md/.test(curta.stdout) && /tk  CLAUDE\.md/.test(curta.stdout));
  checa('e a conta fecha com o total do que carrega sempre', /loads in EVERY session/.test(curta.stdout));
  checa('nota recém-criada não dispara aviso', !/not a report/.test(curta.stdout));

  // 12 KB: o dobro do teto, para o teste não depender do valor exato.
  fs.appendFileSync(nota, '#'.repeat(12 * 1024));
  const longa = rodar(a, '--dry-run');
  checa('nota longa é acusada', /not a report/.test(longa.stdout));
  checa('o aviso aponta o destino do transbordo', longa.stdout.includes('Contexto/Fluxos/<fluxo>.md') && /its Sobre\.md under/.test(longa.stdout));
  checa('o aviso lembra que o relato é git log', /→ git log/.test(longa.stdout));
  limpar(a);
}

// ── 9j. LAYOUT ANTIGO (08_Memoria/, 10_Decisoes/): continua detectado, a junction vai
//     para onde as notas ESTÃO, nada é movido, e o script avisa. A pasta de decisões
//     nasce explicada — vazia, ela não ensina ninguém.
{
  const a = arena('dec');
  fs.mkdirSync(path.join(a.proj, '.marvin', '08_Memoria'), { recursive: true });
  const r = rodar(a, '--no-git');
  checa('layout antigo é acusado, não migrado', /old layout/.test(r.stdout) && /nothing was moved/.test(r.stdout));
  checa('Memoria/ NÃO nasce ao lado do 08_Memoria/', !fs.existsSync(path.join(a.proj, '.marvin', 'Memoria')));
  checa('Contexto/ NÃO nasce no layout antigo', !fs.existsSync(path.join(a.proj, '.marvin', 'Contexto')));
  let alvo = null; try { alvo = fs.readlinkSync(caminhoMemoria(a.lar, a.proj)); } catch {}
  checa('a junction aponta para onde as notas estão',
        alvo !== null && path.resolve(alvo) === path.resolve(path.join(a.proj, '.marvin', '08_Memoria')), 'aponta para ' + alvo);
  const rd = path.join(a.proj, '.marvin', '10_Decisoes', 'README.md');
  checa('10_Decisoes nasce com README', fs.existsSync(rd));
  const txt = fs.existsSync(rd) ? fs.readFileSync(rd, 'utf8') : '';
  checa('o README contrasta os dois regimes', /sobrescrito, sempre um/.test(txt) && /imutável, um por decisão/.test(txt));
  checa('o README ensina o descarte, que é a parte que paga', /descartado/i.test(txt));
  checa('o README resolve publicar-ou-não sem config', txt.includes('10_Decisoes/privado/'));
  const md = fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8');
  checa('o AGENTS.md ensina para onde vai o transbordo da nota', /A nota é curta; a decisão é imutável/.test(md));
  limpar(a);
}
// ── 9k. a nota promete três perguntas e entrega três. Ela entregava QUATRO, e a quarta
//     ("Contexto que economiza tempo") duplicava o `## Armadilhas` do AGENTS.md por
//     desenho — era 41% da nota deste repositório e a única seção sem teto.
{
  const a = arena('tres');
  rodar(a, '--no-git');
  const nota = fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8');
  const secoes = nota.split(NLQ).filter(l => l.startsWith('## '));
  checa('a nota gerada tem exatamente duas seções', secoes.length === 2, 'tem: ' + secoes.join(' | '));
  checa('e são: em andamento · travado', /## Em andamento/.test(nota) && /## Travado/.test(nota));
  checa('a seção que duplicava o AGENTS.md saiu', !/Contexto que economiza tempo/.test(nota));
  // O cabeçalho tem que dizer PARA ONDE vai cada coisa — sem destino, o "seja breve" é
  // conselho vazio. E tem que NOMEAR a brecha: todo mundo obedeceu "não crie arquivo
  // novo" criando seção nova dentro do mesmo arquivo (18 delas num projeto real).
  checa('o cabeçalho manda o estado da US para o Sobre.md dela', /Sobre\.md/.test(nota) && /não aqui/.test(nota));
  checa('o cabeçalho nomeia a brecha: seção de relato é o mesmo erro', /seção de relato/.test(nota));
  checa('o cabeçalho manda a US concluída para Releases', /Releases\/<versao>\.md/.test(nota));
  checa('o cabeçalho manda o histórico para o git log', /git log/.test(nota));
  limpar(a);
}
// ── 9l. junction ÓRFÃ (aponta para pasta que não existe mais) é REPONTADA, não só
//     avisada. Renomear o vault cai exatamente aqui, e o script só avisava — duas
//     ocorrências reais em projetos de verdade no mesmo dia trouxeram este ramo.
{
  const a = arena('orfa');
  rodar(a, '--no-git');
  const mem = caminhoMemoria(a.lar, a.proj);
  const vault = path.join(a.proj, '.marvin');
  fs.writeFileSync(path.join(vault, 'Memoria', 'prova.md'), '# prova' + NLQ);
  // Simula o rename: o alvo da junction deixa de existir, o conteúdo vai para outro nome.
  fs.renameSync(vault, path.join(a.proj, '.docs'));
  fs.renameSync(path.join(a.proj, '.docs'), vault);
  // Aponta a junction para um caminho morto, como o rename faria.
  try { fs.unlinkSync(mem); } catch {}
  fs.symlinkSync(path.join(a.proj, '.docs', 'Memoria'), mem, 'junction');

  const r = rodar(a, '--no-git');
  checa('junction órfã é acusada', /no longer exists/.test(r.stdout), r.stdout.slice(-400));
  checa('e é repontada para o vault vivo', /repointed to/.test(r.stdout));
  let alvo = null;
  try { alvo = fs.readlinkSync(mem); } catch {}
  checa('a junction aponta para o vault de verdade',
        alvo !== null && path.resolve(alvo) === path.resolve(path.join(vault, 'Memoria')),
        'aponta para ' + alvo);
  checa('a nota continua visível pelo caminho do agente',
        fs.existsSync(path.join(mem, 'prova.md')));
  limpar(a);
}

// ── 9m. o ponteiro que a pessoa vê tem que servir para quem instalou pelo npm. O
//     caminho do clone só serve para quem clonou — e a via principal virou o pacote.
{
  const a = arena('ponteiro');
  const h = rodar(a, '--help');
  checa('o --help mostra o comando instalado primeiro', h.stdout.includes("    marvin [flags]"));
  checa('o --help mostra o npx como alternativa', h.stdout.includes("npx marvin-kb [flags]"));
  checa('o --help não ensina mais <path>/marvin/marvin.mjs',
        !h.stdout.includes('<path>/marvin/marvin.mjs'));
  const r = rodar(a, '--no-git');
  checa('o rodapé aponta o PROMPT.md por URL, que serve a clone e npm',
        r.stdout.includes('github.com/Josuebmota/Marvin/blob/main/PROMPT.md'));
  limpar(a);
}
// ── 9o. o ramo novo do passo 6 PASSA pelo shim: o --dry-run tem que ANUNCIAR o
//     conserto da órfã e não executá-lo. Escrita nova que chame fs direto faz o
//     dry-run mentir em silêncio — é armadilha declarada no AGENTS.md.
{
  const a = arena('dry-orfa');
  rodar(a, '--no-git');
  const mem = caminhoMemoria(a.lar, a.proj);
  try { fs.unlinkSync(mem); } catch {}
  const morto = path.join(a.proj, '.docs', 'Memoria');
  fs.symlinkSync(morto, mem, 'junction');

  const r = rodar(a, '--dry-run');
  checa('o dry-run anuncia a remoção do link', /remove link/.test(r.stdout), r.stdout.slice(-300));
  checa('e diz que é SÓ o link', /only the link/.test(r.stdout));
  let alvo = null;
  try { alvo = fs.readlinkSync(mem); } catch {}
  checa('o dry-run NÃO mexeu na junction',
        alvo !== null && path.resolve(alvo) === path.resolve(morto),
        'aponta para ' + alvo);
  limpar(a);
}
// ── 9p. organização por grafo: cada pasta nasce com o arquivo que diz o que entra nela,
//     o AGENTS.md carrega a regra que se repete antes de toda US, e Design/ só nasce
//     quando há front — lido do package.json, não adivinhado.
{
  const a = arena('grafo');
  fs.writeFileSync(path.join(a.proj, 'package.json'), '{"name":"x","dependencies":{"react":"18"}}');
  rodar(a, '--no-git');
  const m = path.join(a.proj, '.marvin');
  const sobre = fs.readFileSync(path.join(m, 'Contexto', 'Sobre.md'), 'utf8');
  checa('Contexto/Sobre.md é o nó raiz e explica a organização', /Como esta base está organizada/.test(sobre) && /## Rumo/.test(sobre));
  checa('Contexto/Design/ nasce quando há front', fs.existsSync(path.join(m, 'Contexto', 'Design')) && /## Design/.test(sobre));
  const plan = fs.readFileSync(path.join(m, 'Planejamento', 'README.md'), 'utf8');
  checa('o formato da US tem Rumo, Código tocado, Time e Skills',
        /## Rumo/.test(plan) && /## Código tocado/.test(plan) && /## Time/.test(plan) && /## Skills/.test(plan));
  checa('11_Sessoes/ e as pastas numeradas não nascem mais',
        !fs.existsSync(path.join(m, '11_Sessoes')) && !fs.existsSync(path.join(m, '10_Decisoes')) && !fs.existsSync(path.join(m, '08_Memoria')));
  const md = fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8');
  checa('o AGENTS.md só lembra a regra "antes de qualquer US"; ela mora no Planejamento/README', /## Antes de qualquer US/.test(md) && /## Antes de qualquer US/.test(plan) && /scout/.test(plan) && /em camadas/.test(plan));
  const ret = fs.readFileSync(path.join(a.proj, '.claude', 'commands', 'retomar.md'), 'utf8');
  checa('a regra de fechar sessão mora no /retomar, onde dispara', /## Ao fechar/.test(ret) && /primeira frase/.test(ret) && !/## Higiene de sessão — quando/.test(md));
  checa('a tabela de portabilidade mora no Sobre.md, não no AGENTS.md', /## Portabilidade/.test(sobre) && !/## Portabilidade/.test(md));
  checa('o AGENTS.md ensina "a nota aponta; o nó guarda"', /A nota aponta; o nó guarda/.test(md));
  checa('o AGENTS.md nomeia a brecha da seção de relato', /seção de relato dentro dela/.test(md));

  const b = arena('semfront');
  rodar(b, '--no-git');
  checa('sem front, Design/ não nasce', !fs.existsSync(path.join(b.proj, '.marvin', 'Contexto', 'Design')));
  limpar(a); limpar(b);
}

// ── 9q. o lado dos docs no grafo é gerado pelo marvin, por regex, e anexado direto no
//     graph.json — medido em 10/09: o graphify só indexa .md por LLM e descarta a
//     aresta doc→código. Este teste não precisa do graphify: com graph.json presente,
//     o anexo roda mesmo sem o binário. Com o binário, o resultado tem que ser o mesmo.
{
  const a = arena('docgrafo');
  fs.mkdirSync(path.join(a.proj, 'src'), { recursive: true });
  fs.writeFileSync(path.join(a.proj, 'src', 'pag.js'), 'export function estornar(v) { return v; }' + NLQ);
  rodar(a, '--no-git');
  const us = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E1', 'F1', 'US-1');
  fs.mkdirSync(us, { recursive: true });
  fs.writeFileSync(path.join(us, 'Sobre.md'), [
    '---', 'tipo: us', 'estado: ativa', 'pai: ../Sobre.md', '---', '# US-1 — estorno',
    '## Fluxos ligados', '- [pag](../../../../../Contexto/Fluxos/pag.md)',
    '## Código tocado', '- `src/pag.js` — `estornar`', '- `src/pag.js` — `sumiu`', ''].join(NLQ));
  fs.writeFileSync(path.join(us, '..', 'Sobre.md'), '---' + NLQ + 'tipo: feature' + NLQ + '---' + NLQ + '# F1' + NLQ);
  fs.writeFileSync(path.join(a.proj, '.marvin', 'Contexto', 'Fluxos', 'pag.md'), '# Fluxo pag' + NLQ + '[US-1](../../Planejamento/Novos/E1/F1/US-1/Sobre.md)' + NLQ);
  // grafo de código como o `graphify extract --code-only` escreve — ids previsíveis
  const saida = path.join(a.proj, 'graphify-out');
  fs.mkdirSync(saida, { recursive: true });
  const grafo = { directed: true, nodes: [
    { id: 'src_pag', label: 'pag.js', file_type: 'code', source_file: 'src/pag.js', _origin: 'ast' },
    { id: 'src_pag_estornar', label: 'estornar()', file_type: 'code', source_file: 'src/pag.js', _origin: 'ast' }],
    edges: [{ source: 'src_pag', target: 'src_pag_estornar', relation: 'contains', _origin: 'ast' }] };
  fs.writeFileSync(path.join(saida, 'graph.json'), JSON.stringify(grafo));

  const r = rodar(a, '--no-git', '--graphify');
  checa('o anexo dos docs roda e conta nós e arestas', /knowledge base in the graph — \d+ doc node\(s\), \d+ edge\(s\)/.test(r.stdout), r.stdout.slice(-600));
  const g = JSON.parse(fs.readFileSync(path.join(saida, 'graph.json'), 'utf8'));
  const arestas = g.edges || g.links || [];
  const tem = (s, t, rel) => arestas.some(e => e.source === s && e.target === t && e.relation === rel);
  const usId = 'marvin_planejamento_novos_e1_f1_us_1_sobre';
  checa('US → função de código vira touches', tem(usId, 'src_pag_estornar', 'touches'), JSON.stringify(arestas.filter(e => e._origin === 'marvin').map(e => e.source + '>' + e.target)));
  checa('US → fluxo vira references', tem(usId, 'marvin_contexto_fluxos_pag', 'references'));
  checa('pai: vira child_of', tem(usId, 'marvin_planejamento_novos_e1_f1_sobre', 'child_of'));
  checa('o nó da US carrega tipo e estado', g.nodes.some(n => n.id === usId && n.estado === 'ativa' && n.tipo === 'us'));
  checa('função que não existe vira AVISO, não nó fantasma', /`sumiu` is not in `src\/pag\.js`/.test(r.stdout) && !g.nodes.some(n => n.id === 'src_pag_sumiu'));
  checa('exemplo dentro de bloco de código não vira aresta', !arestas.some(e => e.target === 'src_checkout_pagamento_calcularestorno'));
  const antes = arestas.filter(e => e._origin === 'marvin').length;
  rodar(a, '--no-git', '--graphify');
  const g2 = JSON.parse(fs.readFileSync(path.join(saida, 'graph.json'), 'utf8'));
  checa('rodar de novo não duplica o lado dos docs', (g2.edges || g2.links).filter(e => e._origin === 'marvin').length === antes);
  limpar(a);
}

// ── 9r. --us: o gatilho físico da regra "antes de qualquer US". Cria a cadeia de Sobre.md
//     que falta, acrescenta o filho no pai que já existe, põe o ponteiro na nota — e rodar
//     de novo não duplica nada. /us e /fechar nascem no 7b.
{
  const a = arena('us');
  rodar(a, '--no-git');
  checa('/us nasce no 7b', fs.existsSync(path.join(a.proj, '.claude', 'commands', 'us.md')));
  checa('/fechar nasce no 7b, o par do /retomar', fs.existsSync(path.join(a.proj, '.claude', 'commands', 'fechar.md')));
  const r = rodar(a, '--us', 'Novos/Pagamentos/Estorno/US-01-parcial');
  checa('--us sai 0', r.status === 0, r.stdout.slice(-300));
  const P = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'Pagamentos');
  checa('--us cria Epic, Feature e US', ['Sobre.md', 'Estorno/Sobre.md', 'Estorno/US-01-parcial/Sobre.md'].every(f => fs.existsSync(path.join(P, f))));
  const us = fs.readFileSync(path.join(P, 'Estorno', 'US-01-parcial', 'Sobre.md'), 'utf8');
  checa('a US nasce no formato: Time, Skills, Código tocado, Rumo datado', /tipo: us/.test(us) && /## Time/.test(us) && /## Skills/.test(us) && /## Código tocado/.test(us) && /- \*\*\d\d\/\d\d\/\d{4}\*\*/.test(us));
  const nota1 = fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8');
  checa('o ponteiro entra na nota e o placeholder sai', nota1.includes('](../Planejamento/Novos/Pagamentos/Estorno/US-01-parcial/Sobre.md)') && !/_\(uma por linha/.test(nota1));
  rodar(a, '--us', 'Novos/Pagamentos/Estorno/US-02-total');
  const feat = fs.readFileSync(path.join(P, 'Estorno', 'Sobre.md'), 'utf8');
  checa('a segunda US entra em Filhos da Feature que já existia', /US-01-parcial\/Sobre\.md/.test(feat) && /US-02-total\/Sobre\.md/.test(feat));
  const antes = fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8');
  rodar(a, '--us', 'Novos/Pagamentos/Estorno/US-02-total');
  const depois = fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8');
  checa('--us duas vezes não duplica o ponteiro', antes === depois && (depois.match(/^- \[US-02-total\]/gm) || []).length === 1);
  checa('--us com caminho errado sai != 0 e não cria nada', rodar(a, '--us', 'Errado/x').status !== 0 && !fs.existsSync(path.join(a.proj, '.marvin', 'Planejamento', 'Errado')));

  // ── 9s. --status: lê os nós, confere contra a nota, e o código de saída é a mensagem.
  const s1 = rodar(a, '--status');
  checa('--status sai 0 quando nota e nós concordam', s1.status === 0, s1.stdout.slice(-400));
  checa('--status lista as US com a cadeia Epic › Feature', /US-01-parcial/.test(s1.stdout) && /Pagamentos › Estorno/.test(s1.stdout));
  checa('--status mostra o progresso por Epic', /0\/2 US concluídas/.test(s1.stdout));
  checa('--status traz a conta do contexto fixo', /loads in EVERY session/.test(s1.stdout));
  checa('--status não escreve nada', fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8') === depois);
  // US concluída que continua na nota: a brecha mais comum depois de fechar uma entrega.
  const usArq = path.join(P, 'Estorno', 'US-01-parcial', 'Sobre.md');
  fs.writeFileSync(usArq, fs.readFileSync(usArq, 'utf8').replace('estado: ativa', 'estado: concluida'));
  const s2 = rodar(a, '--status');
  checa('--status acusa US concluída que ainda está na nota', s2.status !== 0 && /still in the note/.test(s2.stdout));
  checa('--status acusa concluída sem Evidência', /without Evidência/.test(s2.stdout));
  // Seção de relato dentro da nota: a brecha que o texto nomeia e o status pega.
  fs.appendFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), NLQ + '## Última rodada' + NLQ + NLQ + 'fizemos muita coisa' + NLQ);
  const s3 = rodar(a, '--status');
  checa('--status acusa seção de relato na nota', /look like a report/.test(s3.stdout));
  limpar(a);
}

// ── 9t. --migrar: layout antigo → grafo, com backup conferido antes de mover, links
//     reescritos, e o que exige julgamento listado em vez de adivinhado.
{
  const a = arena('migrar');
  const m = path.join(a.proj, '.marvin');
  fs.mkdirSync(path.join(m, '08_Memoria'), { recursive: true });
  fs.mkdirSync(path.join(m, '10_Decisoes'), { recursive: true });
  fs.mkdirSync(path.join(m, '11_Sessoes'), { recursive: true });
  fs.writeFileSync(path.join(m, '08_Memoria', 'onde_paramos.md'), '# nota' + NLQ + 'ver [x](../10_Decisoes/x.md)' + NLQ);
  fs.writeFileSync(path.join(m, '08_Memoria', 'MEMORY.md'), '- [nota](onde_paramos.md)' + NLQ);
  fs.writeFileSync(path.join(m, '10_Decisoes', 'x.md'), '# x' + NLQ + 'nota: `.marvin/08_Memoria/onde_paramos.md`' + NLQ);
  fs.writeFileSync(path.join(m, '10_Decisoes', 'README.md'), '# Decisões' + NLQ);
  fs.writeFileSync(path.join(m, '00_Fontes_Externas.md'), '# fontes' + NLQ);
  fs.writeFileSync(path.join(m, '00_Inicio.md'), '# inicio' + NLQ);
  rodar(a, '--no-git');   // monta no layout antigo: junction → 08_Memoria
  checa('cenário: junction aponta para 08_Memoria', (() => { try { return /08_Memoria$/.test(fs.readlinkSync(caminhoMemoria(a.lar, a.proj))); } catch { return false; } })());
  const d = rodar(a, '--migrar', '--dry-run');
  checa('--migrar --dry-run não move nada', fs.existsSync(path.join(m, '08_Memoria', 'onde_paramos.md')) && !fs.existsSync(path.join(m, 'Memoria')));
  const r = rodar(a, '--migrar');
  checa('--migrar sai 0', r.status === 0, r.stdout.slice(-400));
  checa('backup completo antes de mover', fs.existsSync(path.join(m, '99_Backup', 'antes-do-grafo', '08_Memoria', 'onde_paramos.md')) && fs.existsSync(path.join(m, '99_Backup', 'antes-do-grafo', '10_Decisoes', 'x.md')));
  checa('memória inteira em Memoria/, 08_Memoria some', fs.existsSync(path.join(m, 'Memoria', 'onde_paramos.md')) && fs.existsSync(path.join(m, 'Memoria', 'MEMORY.md')) && !fs.existsSync(path.join(m, '08_Memoria')));
  checa('decisão vai para Contexto/Arquitetura; o README antigo para o backup', fs.existsSync(path.join(m, 'Contexto', 'Arquitetura', 'x.md')) && fs.existsSync(path.join(m, '99_Backup', '10_Decisoes-README.md')) && !fs.existsSync(path.join(m, '10_Decisoes')));
  checa('fontes e índice antigo', fs.existsSync(path.join(m, 'Fontes', 'Externas.md')) && fs.existsSync(path.join(m, '99_Backup', '00_Inicio.md')) && !fs.existsSync(path.join(m, '11_Sessoes')));
  checa('links reescritos nos dois sentidos',
        /\.\.\/Contexto\/Arquitetura\/x\.md/.test(fs.readFileSync(path.join(m, 'Memoria', 'onde_paramos.md'), 'utf8')) &&
        /\.marvin\/Memoria\/onde_paramos\.md/.test(fs.readFileSync(path.join(m, 'Contexto', 'Arquitetura', 'x.md'), 'utf8')));
  checa('--migrar diz o que ficou para o humano', /left for you/.test(r.stdout) && /the note/.test(r.stdout));
  const r2 = rodar(a, '--no-git');
  checa('o run seguinte reponta a junction para Memoria/', (() => { try { return /Memoria$/.test(fs.readlinkSync(caminhoMemoria(a.lar, a.proj))) && !/08_Memoria$/.test(fs.readlinkSync(caminhoMemoria(a.lar, a.proj))); } catch { return false; } })(), r2.stdout.slice(-300));
  checa('e cria os templates do layout novo', fs.existsSync(path.join(m, 'Contexto', 'Sobre.md')) && fs.existsSync(path.join(m, 'Planejamento', 'README.md')));
  checa('--migrar de novo: nada a migrar, sai 0', rodar(a, '--migrar').status === 0);
  limpar(a);
}

// ── 9. adaptador do Copilot — caminho conferido na documentação oficial
{
  const a = arena('copilot');
  rodar(a, '--no-git', '--tools=claude,copilot');
  const p = path.join(a.proj, '.github', 'copilot-instructions.md');
  checa('gera .github/copilot-instructions.md', fs.existsSync(p));
  checa('o adaptador aponta para o AGENTS.md',
        fs.existsSync(p) && /AGENTS\.md/.test(fs.readFileSync(p, 'utf8')));
  limpar(a);
}

// ── ÚLTIMO. O número de verificações afirmado nos READMEs bate com o real.
//
// Ele já desincronizou TRÊS vezes neste repositório: 26 quando eram 28, 48 quando eram
// 73, 73 quando eram 87. É número derivado escrito à mão em arquivo durável — a doença
// que este projeto inteiro combate, acontecendo na documentação dele. Lembrar não
// funcionou; a régua funciona.
//
// Roda por último de propósito: só aqui `passou + falhou` é o total da suíte. O `+ 2`
// conta as duas asserções deste bloco, que ainda não rodaram.
{
  const total = passou + falhou + 2;
  const alvos = [['README.md', /([0-9]+) checks, no dependencies/],
                 ['README.pt-BR.md', /([0-9]+) verificações, zero dependência/]];
  for (const [arq, re] of alvos) {
    let m = null;
    try { m = fs.readFileSync(path.join(AQUI, arq), 'utf8').match(re); } catch {}
    checa(arq + ' afirma o número real de verificações',
          m !== null && Number(m[1]) === total,
          'diz ' + (m ? m[1] : '(não achou a frase)') + ', são ' + total);
  }
}
// ═══════════════════════════════════════════════════════════════════════
console.log('\n' + (falhou === 0
  ? verde(`${passou} passaram`)
  : vermelho(`${falhou} falharam`) + `, ${passou} passaram`) + '\n');
process.exit(falhou === 0 ? 0 : 1);
