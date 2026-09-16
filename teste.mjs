#!/usr/bin/env node
/**
 * marvin's smoke test. Zero dependencies:
 *
 *     node teste.mjs
 *
 * What it covers — and why only this:
 *
 * marvin writes into other people's repositories AND creates a link in the user's
 * profile. Those are the two places where a mistake is expensive, so the test covers
 * the invariants that protect both, not the formatting of the output.
 *
 *   1. --help writes nothing            (the flag everyone types first)
 *   2. --dry-run writes nothing         (the dry-run promise)
 *   3. a real run creates the structure
 *   4. running 2× does not duplicate    (invariant 2 — idempotence)
 *   5. existing memory is copied, verified, and only then the profile becomes a link
 *                                       (invariant 1 — never destroy without checking)
 *   6. a project inside the home does not count the global level twice  (regression)
 *   7. a junction broken by a moved folder is FIXED, not just reported
 *   8. --check reports the broken mount and writes nothing
 *   9. the Copilot adapter is born at the path from the official docs
 *  10. the canonical commands come from the MANIFEST — and the manager, from the lockfile
 *  11. the note promises three questions and delivers three, with a destination for the overflow
 *  12. git worktree: the hook reports memory disconnected before marvin runs there (needs git)
 *
 * HERMETIC: every case runs with HOME and USERPROFILE pointing at a temporary
 * directory. Without that the test would create junctions in the real profile of
 * whoever ran it — exactly the damage marvin takes care not to cause.
 *
 * KNOWN GAP: the ABORT branch of the migration (copied fewer than the source) is not
 * tested. Forcing a partial copy requires an fs mock or directory permissions, and
 * both would bring a dependency or platform-specific behavior. It is noted here
 * instead of faked — a test that pretends to cover is worse than a declared gap.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(AQUI, 'marvin.mjs');
const NLQ = String.fromCharCode(10);

let pulados = 0;  // checks a block skipped for lack of a tool — the README counts the whole suite
let passou = 0, falhou = 0;
const verde = (s) => '\x1b[32m' + s + '\x1b[0m';
const vermelho = (s) => '\x1b[31m' + s + '\x1b[0m';

function checa(descricao, condicao, detalhe = '') {
  if (condicao) { console.log('  ' + verde('✓') + ' ' + descricao); passou++; }
  else { console.log('  ' + vermelho('✗') + ' ' + descricao + (detalhe ? '\n      ' + detalhe : '')); falhou++; }
}

/**
 * Creates an isolated (project, fake home) pair and returns the paths.
 *
 * `realpathSync` is not decoration. On macOS `os.tmpdir()` returns `/var/folders/…`,
 * which is a SYMLINK to `/private/var/folders/…`. The child process's `process.cwd()`
 * already comes resolved, so marvin derives the memory key from `/private/var/…`
 * while the test would look for it in `/var/…` — two paths to the same directory,
 * and the test failing for looking in the wrong place. Linux (`/tmp`) and Windows have
 * no such indirection, which is why only macOS flagged it.
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

/** Runs marvin with HOME/USERPROFILE redirected. */
function rodar({ proj, lar }, ...flags) {
  return spawnSync(process.execPath, [SCRIPT, ...flags], {
    cwd: proj,
    encoding: 'utf8',
    env: { ...process.env, HOME: lar, USERPROFILE: lar },
  });
}

/** Counts files, ignoring the package.json the arena plants. */
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

/** The memory path marvin would derive for this project. */
const caminhoMemoria = (lar, proj) =>
  path.join(lar, '.claude', 'projects', proj.replace(/[:\\/]/g, '-'), 'memory');

/**
 * Removes the arena. The link has to go as a LINK: rm -rf on a Windows junction can
 * follow the link and delete the target — it is the AGENTS.md trap, and the test
 * would be a ridiculous way to discover it.
 */
function limpar({ base, lar, proj }) {
  const mem = caminhoMemoria(lar, proj);
  try {
    if (fs.lstatSync(mem).isSymbolicLink()) {
      try { fs.unlinkSync(mem); } catch { fs.rmdirSync(mem); }
    }
  } catch { /* does not exist: nothing to undo */ }
  try { fs.rmSync(base, { recursive: true, force: true }); } catch {}
}

// ═══════════════════════════════════════════════════════════════════════
console.log('\n\x1b[1mmarvin — smoke test\x1b[0m');
console.log('node ' + process.version + ' · ' + process.platform + '\n');

// ── 1. --help writes nothing
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

// ── 2. --dry-run writes nothing
{
  const a = arena('dry');
  const r = rodar(a, '--dry-run');
  checa('--dry-run sai com código 0', r.status === 0, 'saiu ' + r.status);
  // Matches the plan's structure, not a specific word: that way the assertion
  // survives a text rewrite without becoming a false negative.
  checa('--dry-run lista o plano', /create file\s+AGENTS\.md/.test(r.stdout),
        'não achou a linha do AGENTS.md no plano');
  checa('--dry-run não cria arquivo', arquivos(a.proj).length === 0,
        'criou: ' + arquivos(a.proj).join(', '));
  checa('--dry-run não cria link no perfil', !fs.existsSync(caminhoMemoria(a.lar, a.proj)));
  checa('--dry-run não roda git init', !fs.existsSync(path.join(a.proj, '.git')));
  limpar(a);
}

// ── 3. a real run creates the structure
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
  // The detail exists for CI: when this fails on a platform that is not in front of
  // you, knowing WHICH path was checked is the difference between diagnosing and guessing.
  checa('perfil vira link para o repositório', ehLink, 'conferido em ' + mem);

  if (ehLink) {
    // The real proof: writing through the agent's path has to land in the repository.
    fs.writeFileSync(path.join(mem, 'prova.md'), '# prova\n');
    checa('escrita pelo perfil aparece dentro do repo',
          fs.existsSync(path.join(a.proj, '.marvin', 'Memoria', 'prova.md')));
  }
  limpar(a);
}

// ── 4. running 2× does not duplicate (invariant 2)
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

// ── 5. memory migration (invariant 1)
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

// ── 6. a project INSIDE the home does not count the global level twice
// Regression: the tree climb found ~/.claude and added it, and right after the
// GLOBAL level was added again — doubling the displayed total. It showed up running
// in a temporary directory under the user profile, not in a test.
{
  // realpath for the same reason as the arena — see the comment there.
  const base = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'marvin-teste-home-')));
  const lar = path.join(base, 'lar');
  const proj = path.join(lar, 'projeto');   // <- project BELOW the home
  fs.mkdirSync(proj, { recursive: true });
  fs.writeFileSync(path.join(proj, 'package.json'), '{"name":"cobaia"}\n');
  // a global .claude with one agent, so the GLOBAL level has measurable weight
  const agentesGlobais = path.join(lar, '.claude', 'agents');
  fs.mkdirSync(agentesGlobais, { recursive: true });
  fs.writeFileSync(path.join(agentesGlobais, 'x.md'), '---\ndescription: um agente global qualquer\n---\n');

  const r = rodar({ proj, lar }, '--dry-run');
  const linhas = r.stdout.split('\n').filter(l => /\bagents\b.*\bskills\b.*\bcommands\b/.test(l));
  const globais = linhas.filter(l => /GLOBAL/.test(l));
  checa('nível GLOBAL aparece uma vez só', globais.length === 1, 'apareceu ' + globais.length + 'x');
  // The assertion has to be exactly the regression: the fake home cannot show up
  // as a level of its own. Counting lines does not work — on Windows the tmpdir is
  // INSIDE the real profile, so the climb finds the real `~/.claude`, and listing
  // it is the correct behavior (it is the stacked-levels detection).
  const homeDuplicada = linhas.filter(l => !/GLOBAL/.test(l) && l.trimEnd().endsWith(lar));
  checa('a home não é listada como nível separado', homeDuplicada.length === 0,
        homeDuplicada.join(' | '));
  limpar({ base, lar, proj });
}

// ── 7. a junction broken by a moved folder is FIXED
// A real regression, and the most likely of all: moving or renaming the project folder
// leaves the memory path existing as a REAL, empty directory — it is what Claude Code
// creates at the new path. That knocked the symlink down with EEXIST and the script
// still exited 0: the memory was disconnected from the repository while looking mounted.
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

// ── 8. --check: diagnoses, writes nothing, and the exit code is the message
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

// ── 9c. the dry-run plan does not invent work
// On an already scaffolded project marvin would do nothing, and that is what the plan
// needed to say. It listed 9 "create dir" for existing folders — mkdir recursive on an
// existing directory creates nothing — and the "nothing to do" message never showed.
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

// ── 9b. --check is announced where the person will look, and step 10 nags whoever
// scaffolded before it existed. A flag that only shows in --help is a flag nobody uses —
// and who needs it most is precisely who scaffolded the project on the previous version.
{
  const a = arena('anuncio');
  rodar(a, '--no-git');
  const claude = fs.readFileSync(path.join(a.proj, 'CLAUDE.md'), 'utf8');
  checa('o CLAUDE.md gerado ensina o marvin --check', /--check/.test(claude));
  checa('o 00_Inicio.md do layout antigo não nasce mais', !fs.existsSync(path.join(a.proj, '.marvin', '00_Inicio.md')));

  // Simulates a project scaffolded by an old version: CLAUDE.md without the section.
  fs.writeFileSync(path.join(a.proj, 'CLAUDE.md'), '# projeto\n\nAponta para AGENTS.md.\n');
  const r = rodar(a, '--no-git');
  checa('o passo 10 cobra o CLAUDE.md que não tem a nota', /--check/.test(r.stdout) &&
        /CLAUDE\.md/.test(r.stdout), 'o aviso de atualização não apareceu');
  limpar(a);
}

// ── 9d. --graphify is mentioned in the normal output, and goes away once in use
// Same disease as --check: a feature that only exists in --help nobody discovers. The
// mention has to be one line, after what matters, and say to read the caveats first.
{
  const a = arena('grafomencao');
  const r = rodar(a, '--no-git');
  checa('a saída normal menciona o graphify e o --use', /--use=graphify/.test(r.stdout));
  checa('a menção ensina como instalar', /graphifyy/.test(r.stdout));
  const r2 = rodar(a, '--no-git', '--graphify');
  checa('a menção some quando o --graphify já foi usado',
        !/Optional, and never required/.test(r2.stdout));
  limpar(a);
}

// ── 9e. the .marvin/ferramentas.md record (US-11a)
// The test runs without a TTY, so the question never shows: it is the "assume não and
// warn" branch. With graphify on the machine's PATH the warning is "no interactive
// terminal"; without, "not on PATH" — both record `não`. The cases that matter for
// someone else's disk: born once, no duplicates, --use flips without rewriting the rest, --dry-run writes nothing.
{
  const a = arena('registro');
  const reg = path.join(a.proj, '.marvin', 'ferramentas.md');
  const r0 = rodar(a, '--no-git', '--dry-run');
  checa('--dry-run não escreve o registro', !fs.existsSync(reg) && /ferramentas\.md/.test(r0.stdout));
  const r = rodar(a, '--no-git');
  checa('sem TTY o registro nasce com `não` e avisa',
        fs.existsSync(reg) && /^\| graphify \| não \|/m.test(fs.readFileSync(reg, 'utf8'))
        && /(no interactive terminal|not on PATH)/.test(r.stdout), r.stdout.slice(-400));
  const antes = fs.readFileSync(reg, 'utf8');
  rodar(a, '--no-git');
  checa('rodar de novo não pergunta nem duplica a linha', fs.readFileSync(reg, 'utf8') === antes);
  checa('sem TTY nada trava esperando resposta', !/Use it in this project/.test(r.stdout));
  const r3 = rodar(a, '--no-git', '--use=graphify', '--dry-run');
  checa('--use no dry-run anuncia e não escreve', fs.readFileSync(reg, 'utf8') === antes && /graphify → sim/.test(r3.stdout));
  rodar(a, '--no-git', '--use=graphify');
  const depois = fs.readFileSync(reg, 'utf8');
  checa('--use=graphify flipa a linha para `sim`', /^\| graphify \| sim \|/m.test(depois));
  checa('o flip muda só a coluna usa', depois.replace('| sim |', '| não |') === antes);
  checa('a marca do AGENTS.md aponta para o registro',
        /ferramentas\.md/.test(fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8')));
  limpar(a);
  // --use on a project WITHOUT a record has to create the line, not just flip it (caught on 15/09).
  const b = arena('registro-use');
  rodar(b, '--no-git', '--use=graphify');
  const regB = path.join(b.proj, '.marvin', 'ferramentas.md');
  checa('--use=graphify sem registro cria a linha com `sim`',
        fs.existsSync(regB) && /^\| graphify \| sim \|/m.test(fs.readFileSync(regB, 'utf8')));
  limpar(b);
}

// ── 9e2. ponytail: installed ≠ active, and absent does not fail silently (US-11b)
// The plugin lives in HOME (~/.claude/plugins/installed_plugins.json, ~/.claude/.ponytail-active),
// and HOME here is the arena's `lar` — so the test plants both files and does not depend
// on the machine. Without a TTY it never asks: what is checked is the state MESSAGE and the record.
{
  const a = arena('ponytail');
  const r0 = rodar(a, '--no-git');
  checa('ponytail ausente registra `não` e ensina a instalar',
        /^\| ponytail \| não \|/m.test(fs.readFileSync(path.join(a.proj, '.marvin', 'ferramentas.md'), 'utf8'))
        && /ponytail not found[\s\S]*marketplace add DietrichGebert\/ponytail/.test(r0.stdout), r0.stdout.slice(-400));
  checa('ausente: nada de ponytail no AGENTS.md nem no agents/README',
        !/ponytail/i.test(fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8'))
        && !/ponytail/i.test(fs.readFileSync(path.join(a.proj, '.claude', 'agents', 'README.md'), 'utf8')));
  limpar(a);

  const b = arena('ponytail-inst');
  const cl = path.join(b.lar, '.claude', 'plugins'); fs.mkdirSync(cl, { recursive: true });
  fs.writeFileSync(path.join(cl, 'installed_plugins.json'), '{"version":2,"plugins":{"ponytail@ponytail":[{"scope":"user"}]}}');
  const r1 = rodar(b, '--no-git');
  checa('instalado sem .ponytail-active avisa "NOT active"', /ponytail is installed but NOT active/.test(r1.stdout), r1.stdout.slice(-400));
  limpar(b);

  const c = arena('ponytail-ativo');
  const cl2 = path.join(c.lar, '.claude', 'plugins'); fs.mkdirSync(cl2, { recursive: true });
  fs.writeFileSync(path.join(cl2, 'installed_plugins.json'), '{"plugins":{"ponytail@ponytail":[]}}');
  fs.writeFileSync(path.join(c.lar, '.claude', '.ponytail-active'), 'full\n');
  const r2 = rodar(c, '--no-git', '--dry-run');
  checa('ativo: a mensagem traz o nível', /ponytail is installed and active \(full\)/.test(r2.stdout), r2.stdout.slice(-400));
  checa('o dry-run não cria o registro', !fs.existsSync(path.join(c.proj, '.marvin', 'ferramentas.md')));
  rodar(c, '--no-git', '--use=ponytail');
  const ag = fs.readFileSync(path.join(c.proj, 'AGENTS.md'), 'utf8');
  const rd = fs.readFileSync(path.join(c.proj, '.claude', 'agents', 'README.md'), 'utf8');
  checa('--use=ponytail: AGENTS.md ganha a seção com selo baixa e o que ele não substitui',
        /## Ferramentas[\s\S]*confiança \*\*baixa\*\*[\s\S]*não substitui/.test(ag));
  checa('--use=ponytail: agents/README sugere a tabela de papéis', /Ponytail: em que papel entra[\s\S]*\| `tl` \| \*\*não\*\*/.test(rd));
  checa('o registro guarda o alcance por plataforma', /\| ponytail \| sim \| .*Claude Code\/Codex/.test(fs.readFileSync(path.join(c.proj, '.marvin', 'ferramentas.md'), 'utf8')));
  limpar(c);
}

// ── 9e. monorepo: the sub-repo ignored by the root reaches the generated CLAUDE.md
// In a monorepo the graph was born useless IN SILENCE: the root ignores the sub-repos,
// graphify respects .gitignore, and what was left was a graph without the product code.
// Measured in a real monorepo: 2,783 of 2,854 nodes came from `.claude/` and zero from the product.
// The test does NOT need graphify installed — CI does not have it. Detection lives at the
// top of the script and the warning is written by step 7, which runs before step 8b gives up.
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

// ── 9f. --graphify-git-hook: writes the post-commit and NEVER overwrites an existing one
// The graph ages with every commit and does not warn; the hook closes that gap. But
// post-commit is contested ground — it may already have someone's lint, changelog or CI.
// Overwriting there is destroying someone else's work, which is invariant 1 applied outside memory.
// Skips without graphify on PATH: the block lives after the version check, and CI does not have it.
{
  const temGraphify = spawnSync('graphify', ['--version'], { encoding: 'utf8', shell: true }).status === 0;
  const temGit = spawnSync('git', ['--version'], { encoding: 'utf8' }).status === 0;
  if (!temGraphify || !temGit) {
    console.log('  - 9f pulado: precisa de git e graphify no PATH (4 checks)'); pulados += 4;
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

// ── 9g. canonical commands: read from the manifest, never guessed. The manager comes
//     from the LOCKFILE — it is the most expensive mistake (npm install in a pnpm project dirties the lock).
{
  const a = arena('cmd');
  fs.writeFileSync(path.join(a.proj, 'package.json'),
    JSON.stringify({ name: 'cobaia', scripts: { test: 'vitest', build: 'tsc', dev: 'vite' } }));
  fs.writeFileSync(path.join(a.proj, 'pnpm-lock.yaml'), '');
  const r = rodar(a, '--no-git');
  const md = fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8');
  checa('o AGENTS.md ganha a tabela de comandos canônicos', /## Comandos canônicos/.test(md));
  // Assertion on the TABLE ROW, not a loose substring: `pnpm install` contains
  // `npm install`, and the block's own prose cites npm as the example of the mistake.
  checa('o gerenciador vem do lockfile, não do palpite',
        /| Instalar | `pnpm install` |/.test(md));
  checa('o script do package.json vira comando', /pnpm run test/.test(md));
  // The origin is what keeps the block from aging silently when the manifest changes.
  checa('cada linha declara de onde saiu', /package.json > scripts.test/.test(md));
  checa('a lacuna manual some quando o script preencheu', !/como rodar teste e build/.test(md));
  checa('a saída anuncia o passo 1b', /1b. Canonical commands/.test(r.stdout));
  limpar(a);
}

// ── 9h. without a readable manifest the script does NOT invent a command — the manual gap stays.
{
  const a = arena('cmd-vazio');
  fs.rmSync(path.join(a.proj, 'package.json'));
  rodar(a, '--no-git');
  const md = fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8');
  checa('sem manifesto, nenhuma tabela de comando é inventada', !/## Comandos canônicos/.test(md));
  checa('sem manifesto, a lacuna manual permanece', /como rodar teste e build/.test(md));
  limpar(a);
}
// ── 9i. the note is fixed context and has a ceiling. The warning is only useful with a
//     DESTINATION — so the test covers both halves: that it measures, and that it says where the overflow goes.
{
  const a = arena('nota');
  rodar(a, '--no-git');
  const nota = path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md');
  const curta = rodar(a, '--dry-run');
  checa('a nota entra na conta do contexto fixo', /tk  onde_paramos\.md/.test(curta.stdout));
  checa('a fonte e o adaptador entram na mesma conta', /tk  AGENTS\.md/.test(curta.stdout) && /tk  CLAUDE\.md/.test(curta.stdout));
  checa('e a conta fecha com o total do que carrega sempre', /loads in EVERY session/.test(curta.stdout));
  checa('nota recém-criada não dispara aviso', !/not a report/.test(curta.stdout));

  // 12 KB: twice the ceiling, so the test does not depend on the exact value.
  fs.appendFileSync(nota, '#'.repeat(12 * 1024));
  const longa = rodar(a, '--dry-run');
  checa('nota longa é acusada', /not a report/.test(longa.stdout));
  checa('o aviso aponta o destino do transbordo', longa.stdout.includes('Contexto/Fluxos/<fluxo>.md') && /its Sobre\.md under/.test(longa.stdout));
  checa('o aviso lembra que o relato é git log', /→ git log/.test(longa.stdout));
  limpar(a);
}

// ── 9j. OLD LAYOUT (08_Memoria/, 10_Decisoes/): still detected, the junction goes to
//     where the notes ARE, nothing is moved, and the script warns. The decisions folder
//     is born explained — empty, it teaches nobody.
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
// ── 9k. the note promises three questions and delivers three. It delivered FOUR, and the
//     fourth ("Contexto que economiza tempo") duplicated AGENTS.md's `## Armadilhas` by
//     design — it was 41% of this repository's note and the only section without a ceiling.
{
  const a = arena('tres');
  rodar(a, '--no-git');
  const nota = fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8');
  const secoes = nota.split(NLQ).filter(l => l.startsWith('## '));
  checa('a nota gerada tem exatamente duas seções', secoes.length === 2, 'tem: ' + secoes.join(' | '));
  checa('e são: em andamento · travado', /## Em andamento/.test(nota) && /## Travado/.test(nota));
  checa('a seção que duplicava o AGENTS.md saiu', !/Contexto que economiza tempo/.test(nota));
  // The header has to say WHERE each thing goes — without a destination, "be brief" is
  // empty advice. And it has to NAME the loophole: everyone obeyed "do not create a new
  // file" by creating a new section inside the same file (18 of them in a real project).
  checa('o cabeçalho manda o estado da US para o Sobre.md dela', /Sobre\.md/.test(nota) && /não aqui/.test(nota));
  checa('o cabeçalho nomeia a brecha: seção de relato é o mesmo erro', /seção de relato/.test(nota));
  checa('o cabeçalho manda a US concluída para Releases', /Releases\/<versao>\.md/.test(nota));
  checa('o cabeçalho manda o histórico para o git log', /git log/.test(nota));
  limpar(a);
}
// ── 9l. an ORPHAN junction (points to a folder that no longer exists) is REPOINTED, not
//     just reported. Renaming the vault lands exactly here, and the script only warned —
//     two real occurrences in real projects on the same day brought this branch.
{
  const a = arena('orfa');
  rodar(a, '--no-git');
  const mem = caminhoMemoria(a.lar, a.proj);
  const vault = path.join(a.proj, '.marvin');
  fs.writeFileSync(path.join(vault, 'Memoria', 'prova.md'), '# prova' + NLQ);
  // Simulates the rename: the junction target stops existing, the content goes to another name.
  fs.renameSync(vault, path.join(a.proj, '.docs'));
  fs.renameSync(path.join(a.proj, '.docs'), vault);
  // Points the junction at a dead path, as the rename would.
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

// ── 9m. the pointer the person sees has to work for whoever installed through npm. The
//     clone path only works for whoever cloned — and the main route became the package.
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
// ── 9o. step 6's new branch GOES THROUGH the shim: --dry-run has to ANNOUNCE the
//     orphan fix and not execute it. A new write that calls fs directly makes the
//     dry-run lie silently — it is a trap declared in AGENTS.md.
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
// ── 9p. graph organization: every folder is born with the file that says what goes in
//     it, AGENTS.md carries the rule repeated before every US, and Design/ is only born
//     when there is a front end — read from package.json, not guessed.
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

// ── 9q. the docs side of the graph is generated by marvin, by regex, and appended
//     straight into graph.json — measured on 10/09: graphify only indexes .md through an
//     LLM and discards the doc→code edge. This test does not need graphify: with graph.json
//     present, the append runs even without the binary. With the binary, the result has to be the same.
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
  // code graph as `graphify extract --code-only` writes it — predictable ids
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

// ── 9r. --us: the physical trigger of the "before any US" rule. Creates the missing
//     Sobre.md chain, adds the child to the existing parent, puts the pointer in the note
//     — and running again duplicates nothing. /us and /fechar are born in 7b.
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

  // ── 9s. --status: reads the nodes, checks against the note, and the exit code is the message.
  const s1 = rodar(a, '--status');
  checa('--status sai 0 quando nota e nós concordam', s1.status === 0, s1.stdout.slice(-400));
  checa('--status lista as US com a cadeia Epic › Feature', /US-01-parcial/.test(s1.stdout) && /Pagamentos › Estorno/.test(s1.stdout));
  checa('--status mostra o progresso por Epic', /0\/2 US concluídas/.test(s1.stdout));
  checa('--status traz a conta do contexto fixo', /loads in EVERY session/.test(s1.stdout));
  checa('--status não escreve nada', fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8') === depois);
  // A concluded US still in the note: the most common loophole after closing a delivery.
  const usArq = path.join(P, 'Estorno', 'US-01-parcial', 'Sobre.md');
  fs.writeFileSync(usArq, fs.readFileSync(usArq, 'utf8').replace('estado: ativa', 'estado: concluida'));
  const s2 = rodar(a, '--status');
  checa('--status acusa US concluída que ainda está na nota', s2.status !== 0 && /still in the note/.test(s2.stdout));
  checa('--status acusa concluída sem Evidência', /without Evidência/.test(s2.stdout));
  // A report section inside the note: the loophole the text names and the status catches.
  fs.appendFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), NLQ + '## Última rodada' + NLQ + NLQ + 'fizemos muita coisa' + NLQ);
  const s3 = rodar(a, '--status');
  checa('--status acusa seção de relato na nota', /look like a report/.test(s3.stdout));
  limpar(a);
}

// ── 9t. --migrar: old layout → graph, with the backup verified before moving, links
//     rewritten, and what takes judgment listed instead of guessed.
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
  rodar(a, '--no-git');   // scaffolds on the old layout: junction → 08_Memoria
  // readlinkSync on a junction may come with a trailing separator (it happened on CI's
  // windows-latest, not on the local machine): resolve before looking at the name, instead of a regex on raw text.
  const alvoLink = () => { try { return path.basename(path.resolve(fs.readlinkSync(caminhoMemoria(a.lar, a.proj)))); } catch { return ''; } };
  checa('cenário: junction aponta para 08_Memoria', alvoLink() === '08_Memoria', 'alvo: ' + alvoLink());
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
  checa('o run seguinte reponta a junction para Memoria/', alvoLink() === 'Memoria', 'alvo: ' + alvoLink() + ' | ' + r2.stdout.slice(-300));
  checa('e cria os templates do layout novo', fs.existsSync(path.join(m, 'Contexto', 'Sobre.md')) && fs.existsSync(path.join(m, 'Planejamento', 'README.md')));
  checa('--migrar de novo: nada a migrar, sai 0', rodar(a, '--migrar').status === 0);
  limpar(a);
}

// ── 9u. step 3 tells a declared backup from shell junk. `firestore.rules.bak` in a real
//     repo was called "malformed shell command" — a warning that teaches the wrong thing.
{
  const a = arena('backup');
  fs.writeFileSync(path.join(a.proj, 'firestore.rules.bak'), 'x' + NLQ);
  fs.writeFileSync(path.join(a.proj, '{'), '');
  const r = rodar(a, '--no-git');
  checa('.bak é acusado como backup, com a pergunta certa', /firestore\.rules\.bak.*backup file in the root/.test(r.stdout) && /meant to be versioned/.test(r.stdout));
  checa('.bak NÃO entra na lista de lixo de shell nem no rm -f', !/rm -f.*firestore\.rules\.bak/.test(r.stdout));
  checa('lixo de shell continua sendo acusado como lixo', /rm -f.*"\{"/.test(r.stdout));
  limpar(a);
}

// ── 9v. --release closes the cycle. Invariant 1 in the script's most dangerous spot: it
//     REMOVES lines from the note — only the line whose US went in, with the count checked,
//     and the release written first. Without Evidência it writes nothing; running again refuses; dry-run does not touch the disk.
{
  const a = arena('release');
  rodar(a, '--no-git');
  for (const u of ['US-01-a', 'US-02-b', 'US-03-c']) rodar(a, '--us', 'Novos/E/F/' + u);
  const P = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E', 'F');
  const marcar = (u, evid) => { const p = path.join(P, u, 'Sobre.md'); let s = fs.readFileSync(p, 'utf8').replace('estado: ativa', 'estado: concluida'); if (evid) s = s.replace(/## Evidência[\s\S]*$/, '## Evidência' + NLQ + '- ' + evid + NLQ); fs.writeFileSync(p, s); };
  marcar('US-01-a', 'PR #1 verde');
  marcar('US-02-b', null);   // concluded WITHOUT evidence
  const nota = path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md');
  const antes = fs.readFileSync(nota, 'utf8');
  const r0 = rodar(a, '--release', '1.0.0');
  checa('--release aborta sem Evidência, com o nome, e não escreve nada', r0.status !== 0 && /US-02-b/.test(r0.stdout) && !fs.existsSync(path.join(a.proj, '.marvin', 'Releases', '1.0.0.md')) && fs.readFileSync(nota, 'utf8') === antes);
  marcar('US-02-b', 'teste x verde');
  const d = rodar(a, '--release', '1.0.0', '--dry-run');
  checa('--release --dry-run mostra o conteúdo e não escreve', /US-01-a/.test(d.stdout) && /US-02-b/.test(d.stdout) && !fs.existsSync(path.join(a.proj, '.marvin', 'Releases', '1.0.0.md')) && fs.readFileSync(nota, 'utf8') === antes);
  const r1 = rodar(a, '--release', '1.0.0');
  checa('--release sai 0 e escreve o índice', r1.status === 0, r1.stdout.slice(-400));
  const rel = fs.readFileSync(path.join(a.proj, '.marvin', 'Releases', '1.0.0.md'), 'utf8');
  checa('o índice tem as duas concluídas com evidência, e não a ativa', /US-01-a/.test(rel) && /US-02-b/.test(rel) && !/US-03-c/.test(rel) && /PR #1 verde/.test(rel));
  const depois = fs.readFileSync(nota, 'utf8');
  checa('a nota perde exatamente as duas linhas e mantém a ativa e as seções', !/US-01-a/.test(depois) && !/US-02-b/.test(depois) && /US-03-c/.test(depois) && /## Travado/.test(depois));
  checa('o --status volta a sair 0', rodar(a, '--status').status === 0);
  checa('--release de novo com a mesma versão recusa', rodar(a, '--release', '1.0.0').status !== 0);
  const r2 = rodar(a, '--release', '1.0.1');
  checa('versão nova sem US nova: nada a escrever, sai 0, sem arquivo', r2.status === 0 && !fs.existsSync(path.join(a.proj, '.marvin', 'Releases', '1.0.1.md')));
  checa('--release não faz tag nem commit — sugere', /git tag -a v1\.0\.0/.test(r1.stdout));
  limpar(a);
}

// ── 9w. --status --curto is hook output: no header, no color, and ALWAYS exits 0 — in a
//     hook, exit != 0 becomes a visible error and takes the session down. 7b generates the
//     hook; someone else's settings.json is untouched byte for byte.
{
  const a = arena('curto');
  rodar(a, '--no-git');
  const settings = path.join(a.proj, '.claude', 'settings.json');
  checa('o 7b gera o settings.json com o hook SessionStart', fs.existsSync(settings) && /SessionStart/.test(fs.readFileSync(settings, 'utf8')) && /--status --curto/.test(fs.readFileSync(settings, 'utf8')));
  checa('e ele é JSON válido', (() => { try { JSON.parse(fs.readFileSync(settings, 'utf8')); return true; } catch { return false; } })());
  rodar(a, '--us', 'Novos/E/F/US-1');
  const usArq = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E', 'F', 'US-1', 'Sobre.md');
  fs.writeFileSync(usArq, fs.readFileSync(usArq, 'utf8').replace('estado: ativa', 'estado: concluida'));
  checa('--status acusa e sai 1', rodar(a, '--status').status === 1);
  const c = rodar(a, '--status', '--curto');
  checa('--status --curto acusa a mesma coisa e sai 0', c.status === 0 && /still in the note/.test(c.stdout));
  checa('--curto não tem cabeçalho nem cor', !/agent memory/.test(c.stdout) && !/\x1b\[/.test(c.stdout));
  checa('--curto cabe no orçamento do hook (≤ 200 tk)', Buffer.byteLength(c.stdout) / 4 <= 200, Buffer.byteLength(c.stdout) + ' bytes');
  // someone else's settings.json
  const alheio = '{\n  "permissions": { "allow": ["Bash(ls)"] }\n}\n';
  fs.writeFileSync(settings, alheio);
  const r = rodar(a, '--no-git');
  checa('settings.json alheio fica intocado byte a byte, e o bloco é impresso', fs.readFileSync(settings, 'utf8') === alheio && /not merged/.test(r.stdout) && /SessionStart/.test(r.stdout));
  checa('o passo 10 cobra o hook que falta', /settings\.json — missing/.test(r.stdout));
  limpar(a);
}

// ── 9x. --status --html: the only form of --status that writes — and only in .marvin/.status/,
//     git-ignored. One point per COMMIT (git date, not Date.now()): two runs on the same
//     commit do not duplicate. Without --html the jsonl is not born. The HTML opens offline: inline JSON.
{
  const a = arena('html');
  rodar(a);   // with git init
  const git = (...args) => spawnSync('git', args, { cwd: a.proj, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } });
  git('add', '-A'); git('commit', '-q', '-m', 'um');
  const dir = path.join(a.proj, '.marvin', '.status');
  rodar(a, '--status');
  checa('--status sem --html não cria .status/', !fs.existsSync(dir));
  const h1 = rodar(a, '--status', '--html');
  checa('--status --html sai 0 e escreve index.html + historico.jsonl', h1.status === 0 && fs.existsSync(path.join(dir, 'index.html')) && fs.existsSync(path.join(dir, 'historico.jsonl')), h1.stdout.slice(-300));
  rodar(a, '--status', '--html');
  const linhas = () => fs.readFileSync(path.join(dir, 'historico.jsonl'), 'utf8').split(/\r?\n/).filter(Boolean);
  checa('dois runs no mesmo commit: um ponto só', linhas().length === 1);
  fs.appendFileSync(path.join(a.proj, 'AGENTS.md'), NLQ + '## Mais' + NLQ + 'x'.repeat(400) + NLQ);
  git('add', '-A'); git('commit', '-q', '-m', 'dois');
  rodar(a, '--status', '--html');
  checa('commit novo: segundo ponto, e o contexto fixo cresceu', linhas().length === 2 && JSON.parse(linhas()[1]).total > JSON.parse(linhas()[0]).total);
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  checa('o HTML embute a série (file:// bloqueia fetch) e desenha SVG', /<script type="application\/json" id="historico">/.test(html) && /<polyline/.test(html) && !/<script src=/.test(html));
  // US-15: the first fold answers 'what to do' — Corrigir (or 'tudo consistente') and the 4 cards
  // come before everything; the network is the last section and is born collapsed; both themes are in the <style>
  const ordem = ['<div class="cards">', 'id="andamento"', 'id="tendencia"', 'id="tokens"', '<details class="rede"'].map(s => html.indexOf(s));
  checa('HTML: Corrigir/ok antes dos cards, cards antes de tudo, rede colapsada por último', (html.indexOf('class="tudo-ok"') >= 0 || html.indexOf('class="corrigir"') >= 0) && Math.min(html.indexOf('class="tudo-ok"') < 0 ? Infinity : html.indexOf('class="tudo-ok"'), html.indexOf('class="corrigir"') < 0 ? Infinity : html.indexOf('class="corrigir"')) < ordem[0] && ordem.every((p, i) => p >= 0 && (i === 0 || p > ordem[i - 1])) && !/<details class="rede"[^>]*\sopen/.test(html));
  checa('HTML: os cards trazem o delta desde o commit anterior', /class="delta (up|down|)/.test(html) && /desde o último commit/.test(html));
  checa('HTML: tema claro e escuro por prefers-color-scheme, sem asset externo', html.includes(':root{color-scheme:light dark') && html.includes('@media(prefers-color-scheme:dark){:root:not([data-theme=light]){') && html.includes(':root[data-theme=dark]{') && html.includes('id="tema"') && !/<link/.test(html) && !/@import/.test(html));
  // and with a real problem: a concluded US still in the note → enters Corrigir, with a link relative to the page
  rodar(a, '--us', 'Novos/P/F/US-01-x');
  const usX = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'P', 'F', 'US-01-x', 'Sobre.md');
  fs.writeFileSync(usX, fs.readFileSync(usX, 'utf8').replace('estado: ativa', 'estado: concluida'));
  rodar(a, '--status', '--html');
  const html2 = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  checa('HTML: problema vira item de Corrigir, antes dos cards, com link para o Sobre.md', /class="corrigir"/.test(html2) && html2.indexOf('class="corrigir"') < html2.indexOf('<div class="cards">') && /href="\.\.\/Planejamento\/Novos\/P\/F\/US-01-x\/Sobre\.md"/.test(html2) && /still in the note/.test(html2));
  checa('.marvin/.status/ entrou no .gitignore', /^\.marvin\/\.status\/$/m.test(fs.readFileSync(path.join(a.proj, '.gitignore'), 'utf8')));
  checa('--status --html --dry-run não escreve', (() => { const antes = linhas().length; fs.rmSync(path.join(dir, 'index.html')); rodar(a, '--status', '--html', '--dry-run'); return !fs.existsSync(path.join(dir, 'index.html')) && linhas().length === antes; })());
  limpar(a);
}

// ── 9y. tokens spent: read from the transcripts, deduplicated by message id (the same
//     reply is recorded more than once while streaming), per model, subagent apart.
//     The cost is an estimate and the output says so.
{
  const a = arena('gastos');
  rodar(a, '--no-git');
  const dir = path.dirname(caminhoMemoria(a.lar, a.proj));
  const linha = (id, model, usage, extra = {}) => JSON.stringify({ type: 'assistant', timestamp: '2026-09-11T10:00:00Z', sessionId: 's1', message: { id, model, usage }, ...extra });
  fs.writeFileSync(path.join(dir, 's1.jsonl'), [
    JSON.stringify({ type: 'user', message: { role: 'user', content: 'oi' } }),
    linha('msg_1', 'claude-opus-5', { input_tokens: 10, cache_creation_input_tokens: 1000, cache_read_input_tokens: 0, output_tokens: 50 }),
    linha('msg_1', 'claude-opus-5', { input_tokens: 10, cache_creation_input_tokens: 1000, cache_read_input_tokens: 0, output_tokens: 200 }),   // same msg, final usage
    linha('msg_2', 'claude-sonnet-5', { input_tokens: 5, cache_creation_input_tokens: 0, cache_read_input_tokens: 1000, output_tokens: 100 }, { isSidechain: true }),
    ''].join(NLQ));
  const r = rodar(a, '--status');
  checa('--status lê as transcrições e conta turnos deduplicados', /2 model turns/.test(r.stdout) && /1 by subagents/.test(r.stdout), r.stdout.slice(-600));
  checa('o dedupe fica com o usage final da mensagem', /claude-opus-5.*200 out/.test(r.stdout));
  checa('um bloco por modelo', /claude-sonnet-5/.test(r.stdout));
  // opus: 10*5 + 200*25 + 1000*6.25 = 50+5000+6250 = 11300 / 1e6 = $0.0113 ; sonnet: 5*2+100*10+1000*0.2 = 1210/1e6
  checa('o custo é calculado pela tabela e declarado como estimativa', /≈ \$0\.01 total/.test(r.stdout) && /an estimate/.test(r.stdout));
  checa('a fatia do contexto fixo é dita', /fixed context is ~\d+% of it/.test(r.stdout));
  rodar(a, '--us', 'Novos/E/F/US-1');
  rodar(a, '--status', '--html');
  const html = fs.readFileSync(path.join(a.proj, '.marvin', '.status', 'index.html'), 'utf8');
  checa('o HTML traz a tabela por modelo e o aviso de estimativa', /claude-sonnet-5/.test(html) && /custariam na API/.test(html));
  checa('o HTML desenha a rede da base — nós de doc com estado, sem lib', /id="rede-dados"/.test(html) && /"cat":"us"/.test(html) && /"estado":"ativa"/.test(html) && !/<script src=/.test(html));
  const curto = rodar(a, '--status', '--curto', '--html');
  checa('--curto --html regera o dashboard em silêncio (é o hook)', curto.status === 0 && !/index\.html/.test(curto.stdout) && fs.statSync(path.join(a.proj, '.marvin', '.status', 'index.html')).size > 1000);
  checa('o hook gerado regera o HTML', /--status --curto --html/.test(fs.readFileSync(path.join(a.proj, '.claude', 'settings.json'), 'utf8')));
  limpar(a);
}

// ── 9z. the graph in our favor. Measured: in 23,745 turns the agent queried the graph
//     twice. So the script asks: Impacto in --us, collision in --status, drift in --fechar.
//     Synthetic graph in graphify's format — the test does not need the binary.
{
  const a = arena('grafo-favor');
  fs.mkdirSync(path.join(a.proj, 'src'), { recursive: true });
  fs.writeFileSync(path.join(a.proj, 'src', 'pag.js'), 'export function cobrar(){}' + NLQ);
  fs.writeFileSync(path.join(a.proj, 'src', 'ui.js'), 'export function tela(){}' + NLQ);
  rodar(a);   // with git
  const git = (...args) => spawnSync('git', args, { cwd: a.proj, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } });
  // src/ committed YESTERDAY: --fechar counts "commits since midnight", and the base commit is not today's work
  git('add', '-A'); spawnSync('git', ['commit', '-q', '-m', 'base'], { cwd: a.proj, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t', GIT_AUTHOR_DATE: '2020-01-01T00:00:00', GIT_COMMITTER_DATE: '2020-01-01T00:00:00' } });
  const saida = path.join(a.proj, 'graphify-out'); fs.mkdirSync(saida, { recursive: true });
  fs.writeFileSync(path.join(saida, 'graph.json'), JSON.stringify({ directed: true, nodes: [
    { id: 'src_pag', label: 'pag.js', file_type: 'code', source_file: 'src/pag.js', community: 0, _origin: 'ast' },
    { id: 'src_pag_cobrar', label: 'cobrar()', file_type: 'code', source_file: 'src/pag.js', source_location: 'L1', community: 0, _origin: 'ast' },
    { id: 'src_ui', label: 'ui.js', file_type: 'code', source_file: 'src/ui.js', community: 1, _origin: 'ast' },
    { id: 'src_ui_tela', label: 'tela()', file_type: 'code', source_file: 'src/ui.js', source_location: 'L1', community: 1, _origin: 'ast' }],
    edges: [{ source: 'src_pag', target: 'src_pag_cobrar', relation: 'contains' }, { source: 'src_ui', target: 'src_ui_tela', relation: 'contains' },
            { source: 'src_ui_tela', target: 'src_pag_cobrar', relation: 'calls' }] }));
  const abrir = (u, toca) => { rodar(a, '--us', 'Novos/E/F/' + u); const p = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E', 'F', u, 'Sobre.md'); fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/_\(crase com o caminho[^\n]*\n/, toca.map(x => '- ' + x).join(NLQ) + NLQ)); return p; };
  const usA = abrir('US-A', ['`src/pag.js` — `cobrar`']);
  const r1 = rodar(a, '--us', 'Novos/E/F/US-A');
  const sobreA = fs.readFileSync(usA, 'utf8');
  checa('--us de novo escreve o Impacto a partir do grafo', /Impacto —/.test(r1.stdout) && /## Impacto/.test(sobreA) && /tela\(\)/.test(sobreA), r1.stdout.slice(-400));
  checa('o Impacto é marcado como derivado', /gerado por `marvin --us`/.test(sobreA));
  rodar(a, '--us', 'Novos/E/F/US-A');
  checa('rodar de novo não duplica a seção', (fs.readFileSync(usA, 'utf8').match(/## Impacto/g) || []).length === 1);
  abrir('US-B', ['`src/pag.js` — `cobrar`']);
  const s1 = rodar(a, '--status');
  checa('--status acusa duas US ativas na mesma função', s1.status !== 0 && /US-A and US-B both touch cobrar/.test(s1.stdout), s1.stdout.slice(-600));
  // drift: a changed file no US declares
  fs.writeFileSync(path.join(a.proj, 'src', 'novo.js'), 'export const x = 1;' + NLQ);
  fs.appendFileSync(path.join(a.proj, 'src', 'pag.js'), '// mudou' + NLQ);
  const f1 = rodar(a, '--fechar');
  checa('--fechar acusa o arquivo mudado sem US e sai != 0', f1.status !== 0 && /src\/novo\.js/.test(f1.stdout) && /in NO active US/.test(f1.stdout), f1.stdout.slice(-500));
  checa('--fechar reconhece o arquivo coberto por uma US', /src\/pag\.js\s+→ US-[AB]/.test(f1.stdout));
  fs.unlinkSync(path.join(a.proj, 'src', 'novo.js'));
  const f2 = rodar(a, '--fechar');
  checa('sem deriva, --fechar sai 0', f2.status === 0 && /every changed code file is declared/.test(f2.stdout), f2.stdout.slice(-300));
  checa('/fechar chama o --fechar e /us pede a segunda rodada', /--fechar/.test(fs.readFileSync(path.join(a.proj, '.claude', 'commands', 'fechar.md'), 'utf8')) && /Impacto/.test(fs.readFileSync(path.join(a.proj, '.claude', 'commands', 'us.md'), 'utf8')));
  limpar(a);
}

// ── 9aa. git worktree (US-13). Memory follows the cwd: in the worktree Claude Code creates
//     a real, empty directory, and nothing warns. The hook (--status --curto, runs in EVERY
//     session) has to flag it BEFORE marvin runs there; after, it goes quiet. Running marvin
//     in the worktree mounts its junction — the notes travel with the branch. Needs git on PATH.
{
  const a = arena('worktree');
  const temGit = spawnSync('git', ['--version']).status === 0;
  // without git, the suite total drops by 5 and the last block would fail the READMEs: declared, not faked
  if (!temGit) { console.log('  - 9aa pulado: precisa de git no PATH (5 checks)'); pulados += 5; }
  else {
    const git = (...args) => spawnSync('git', args, { cwd: a.proj, encoding: 'utf8',
      env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } });
    rodar(a, '--no-questions');                       // scaffolds the main one, with .git
    git('add', '-A'); git('commit', '-q', '-m', 'base');
    const wt = path.join(a.base, 'wt');
    git('worktree', 'add', '-q', wt, '-b', 'ramo');
    const w = { proj: wt, lar: a.lar };
    checa('a worktree tem .git como ARQUIVO', fs.statSync(path.join(wt, '.git')).isFile());
    const antes = rodar(w, '--status', '--curto');
    checa('o hook acusa memória desligada na worktree e ainda sai 0', antes.status === 0 && /DESLIGADA.*git worktree/.test(antes.stdout), antes.stdout.slice(-300));
    const r = rodar(w, '--no-questions');
    checa('marvin na worktree diz que é worktree e monta a junction DELA', /git worktree/.test(r.stdout) && /junction created/.test(r.stdout));
    const memWt = path.join(a.lar, '.claude', 'projects', wt.replace(/[:\\/]/g, '-'), 'memory');
    checa('a junction aponta para o .marvin/Memoria da worktree, não do principal',
          fs.lstatSync(memWt).isSymbolicLink() && path.resolve(fs.readlinkSync(memWt)) === path.resolve(wt, '.marvin', 'Memoria'));
    const depois = rodar(w, '--status', '--curto');
    checa('depois de montar, o hook cala', depois.status === 0 && !/DESLIGADA/.test(depois.stdout));
    git('worktree', 'remove', '--force', wt);
  }
  limpar(a);
}

// ── 9. Copilot adapter — path checked against the official docs
{
  const a = arena('copilot');
  rodar(a, '--no-git', '--tools=claude,copilot');
  const p = path.join(a.proj, '.github', 'copilot-instructions.md');
  checa('gera .github/copilot-instructions.md', fs.existsSync(p));
  checa('o adaptador aponta para o AGENTS.md',
        fs.existsSync(p) && /AGENTS\.md/.test(fs.readFileSync(p, 'utf8')));
  limpar(a);
}

// ── LAST. The number of checks claimed in the READMEs matches the real one.
//
// It has drifted THREE times in this repository: 26 when there were 28, 48 when there
// were 73, 73 when there were 87. It is a derived number written by hand in a durable
// file — the disease this whole project fights, happening in its own documentation.
// Remembering did not work; the ruler does.
//
// Runs last on purpose: only here is `passou + falhou` the suite total. The `+ 2` counts
// this block's two assertions, which have not run yet. `pulados` is included because the
// number in the README is the whole suite's — on CI 9f skips (no graphify) and the total cannot drop.
{
  const total = passou + falhou + pulados + 2;
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
