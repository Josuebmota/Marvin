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
    path.join('.marvin', '00_Inicio.md'),
    path.join('.marvin', '08_Memoria', 'onde_paramos.md'),
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
          fs.existsSync(path.join(a.proj, '.marvin', '08_Memoria', 'prova.md')));
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

  const destino = path.join(a.proj, '.marvin', '08_Memoria');
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
          fs.existsSync(path.join(a.proj, '.marvin', '08_Memoria', 'prova2.md')));
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
  const inicio = fs.readFileSync(path.join(a.proj, '.marvin', '00_Inicio.md'), 'utf8');
  checa('o 00_Inicio.md avisa que mover a pasta quebra a junction', /--check/.test(inicio));

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

// ═══════════════════════════════════════════════════════════════════════
console.log('\n' + (falhou === 0
  ? verde(`${passou} passaram`)
  : vermelho(`${falhou} falharam`) + `, ${passou} passaram`) + '\n');
process.exit(falhou === 0 ? 0 : 1);
