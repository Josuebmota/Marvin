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
 *  13. --us --refinada is born in the queue, not in the note; --status groups the queue into
 *      ilhas by shared file, a file in 3+ USs is núcleo, an unmapped US is "sem mapa"
 *  14. the version stamp: written once, not rewritten on the same version, and the hook
 *      warns when the base is behind
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

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(HERE, 'marvin.mjs');
const NLQ = String.fromCharCode(10);

let skipped = 0;  // checks a block skipped for lack of a tool — the README counts the whole suite
let passed = 0, failed = 0;
const green = (s) => '\x1b[32m' + s + '\x1b[0m';
const red = (s) => '\x1b[31m' + s + '\x1b[0m';

function check(description, condition, detail = '') {
  if (condition) { console.log('  ' + green('✓') + ' ' + description); passed++; }
  else { console.log('  ' + red('✗') + ' ' + description + (detail ? '\n      ' + detail : '')); failed++; }
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
function arena(name) {
  const base = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'marvin-teste-' + name + '-')));
  const proj = path.join(base, 'projeto');
  const home = path.join(base, 'lar');
  fs.mkdirSync(proj, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  fs.writeFileSync(path.join(proj, 'package.json'), '{"name":"cobaia"}\n');
  return { base, proj: proj, lar: home };
}

/** Runs marvin with HOME/USERPROFILE redirected. */
function run({ proj: proj, lar: home }, ...flags) {
  return spawnSync(process.execPath, [SCRIPT, ...flags], {
    cwd: proj,
    encoding: 'utf8',
    env: { ...process.env, HOME: home, USERPROFILE: home },
  });
}

/** Counts files, ignoring the package.json the arena plants. */
function files(dir) {
  const found = [];
  (function walks(d) {
    let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walks(p);
      else found.push(path.relative(dir, p));
    }
  })(dir);
  return found.filter(f => f !== 'package.json');
}

/** The memory path marvin would derive for this project. */
const memoryPath = (home, proj) =>
  path.join(home, '.claude', 'projects', proj.replace(/[:\\/]/g, '-'), 'memory');

/**
 * Removes the arena. The link has to go as a LINK: rm -rf on a Windows junction can
 * follow the link and delete the target — it is the AGENTS.md trap, and the test
 * would be a ridiculous way to discover it.
 */
function cleanup({ base, lar: home, proj: proj }) {
  const mem = memoryPath(home, proj);
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
  const r = run(a, '--help');
  check('--help sai com código 0', r.status === 0, 'saiu ' + r.status);
  check('--help imprime as flags', /--dry-run/.test(r.stdout));
  check('--help não cria arquivo', files(a.proj).length === 0,
        'criou: ' + files(a.proj).join(', '));
  check('--help não cria link no perfil', !fs.existsSync(memoryPath(a.lar, a.proj)));
  cleanup(a);
}

// ── 2. --dry-run writes nothing
{
  const a = arena('dry');
  const r = run(a, '--dry-run');
  check('--dry-run sai com código 0', r.status === 0, 'saiu ' + r.status);
  // Matches the plan's structure, not a specific word: that way the assertion
  // survives a text rewrite without becoming a false negative.
  check('--dry-run lista o plano', /create file\s+AGENTS\.md/.test(r.stdout),
        'não achou a linha do AGENTS.md no plano');
  check('--dry-run não cria arquivo', files(a.proj).length === 0,
        'criou: ' + files(a.proj).join(', '));
  check('--dry-run não cria link no perfil', !fs.existsSync(memoryPath(a.lar, a.proj)));
  check('--dry-run não roda git init', !fs.existsSync(path.join(a.proj, '.git')));
  cleanup(a);
}

// ── 3. a real run creates the structure
{
  const a = arena('real');
  const r = run(a, '--no-git');
  check('execução real sai com código 0', r.status === 0, r.stderr.slice(0, 300));
  const expected = [
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
  const created = files(a.proj);
  for (const e of expected) check('cria ' + e, created.includes(e));

  const mem = memoryPath(a.lar, a.proj);
  let isLink = false;
  try { isLink = fs.lstatSync(mem).isSymbolicLink(); } catch {}
  // The detail exists for CI: when this fails on a platform that is not in front of
  // you, knowing WHICH path was checked is the difference between diagnosing and guessing.
  check('perfil vira link para o repositório', isLink, 'conferido em ' + mem);

  if (isLink) {
    // The real proof: writing through the agent's path has to land in the repository.
    fs.writeFileSync(path.join(mem, 'prova.md'), '# prova\n');
    check('escrita pelo perfil aparece dentro do repo',
          fs.existsSync(path.join(a.proj, '.marvin', 'Memoria', 'prova.md')));
  }
  cleanup(a);
}

// ── 4. running 2× does not duplicate (invariant 2)
{
  const a = arena('idem');
  run(a, '--no-git');
  const before = files(a.proj).sort();
  const contentBefore = fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8');
  const r = run(a, '--no-git');
  const after = files(a.proj).sort();
  check('2ª execução sai com código 0', r.status === 0, r.stderr.slice(0, 300));
  check('2ª execução não cria arquivo novo',
        JSON.stringify(before) === JSON.stringify(after),
        'antes ' + before.length + ', depois ' + after.length);
  check('2ª execução não sobrescreve o AGENTS.md',
        fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8') === contentBefore);
  cleanup(a);
}

// ── 5. memory migration (invariant 1)
{
  const a = arena('migra');
  const mem = memoryPath(a.lar, a.proj);
  fs.mkdirSync(mem, { recursive: true });
  const N = 5;
  for (let i = 1; i <= N; i++) fs.writeFileSync(path.join(mem, 'nota' + i + '.md'), '# nota ' + i + '\n');

  const r = run(a, '--no-git');
  check('migração sai com código 0', r.status === 0, r.stderr.slice(0, 300));

  const destination = path.join(a.proj, '.marvin', 'Memoria');
  const survivors = fs.existsSync(destination)
    ? fs.readdirSync(destination).filter(f => /^nota\d+\.md$/.test(f)).length : 0;
  check(`as ${N} notas sobrevivem no repositório`, survivors === N,
        'sobraram ' + survivors);

  let isLink = false;
  try { isLink = fs.lstatSync(mem).isSymbolicLink(); } catch {}
  check('perfil vira link DEPOIS de copiar', isLink);
  check('notas seguem visíveis pelo caminho do agente',
        isLink && fs.readdirSync(mem).filter(f => /^nota\d+\.md$/.test(f)).length === N);
  cleanup(a);
}

// ── 6. a project INSIDE the home does not count the global level twice
// Regression: the tree climb found ~/.claude and added it, and right after the
// GLOBAL level was added again — doubling the displayed total. It showed up running
// in a temporary directory under the user profile, not in a test.
{
  // realpath for the same reason as the arena — see the comment there.
  const base = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'marvin-teste-home-')));
  const home = path.join(base, 'lar');
  const proj = path.join(home, 'projeto');   // <- project BELOW the home
  fs.mkdirSync(proj, { recursive: true });
  fs.writeFileSync(path.join(proj, 'package.json'), '{"name":"cobaia"}\n');
  // a global .claude with one agent, so the GLOBAL level has measurable weight
  const globalAgents = path.join(home, '.claude', 'agents');
  fs.mkdirSync(globalAgents, { recursive: true });
  fs.writeFileSync(path.join(globalAgents, 'x.md'), '---\ndescription: um agente global qualquer\n---\n');

  const r = run({ proj: proj, lar: home }, '--dry-run');
  const lines = r.stdout.split('\n').filter(l => /\bagents\b.*\bskills\b.*\bcommands\b/.test(l));
  const globals = lines.filter(l => /GLOBAL/.test(l));
  check('nível GLOBAL aparece uma vez só', globals.length === 1, 'apareceu ' + globals.length + 'x');
  // The assertion has to be exactly the regression: the fake home cannot show up
  // as a level of its own. Counting lines does not work — on Windows the tmpdir is
  // INSIDE the real profile, so the climb finds the real `~/.claude`, and listing
  // it is the correct behavior (it is the stacked-levels detection).
  const duplicatedHome = lines.filter(l => !/GLOBAL/.test(l) && l.trimEnd().endsWith(home));
  check('a home não é listada como nível separado', duplicatedHome.length === 0,
        duplicatedHome.join(' | '));
  cleanup({ base, lar: home, proj: proj });
}

// ── 7. a junction broken by a moved folder is FIXED
// A real regression, and the most likely of all: moving or renaming the project folder
// leaves the memory path existing as a REAL, empty directory — it is what Claude Code
// creates at the new path. That knocked the symlink down with EEXIST and the script
// still exited 0: the memory was disconnected from the repository while looking mounted.
{
  const a = arena('quebrada');
  run(a, '--no-git');
  const mem = memoryPath(a.lar, a.proj);
  try { fs.unlinkSync(mem); } catch { fs.rmdirSync(mem); }
  fs.mkdirSync(mem, { recursive: true });
  check('cenário montado: diretório real no lugar do link',
        fs.existsSync(mem) && !fs.lstatSync(mem).isSymbolicLink());

  const r = run(a, '--no-git');
  check('conserto sai com código 0', r.status === 0, r.stderr.slice(0, 300));
  let isLink = false;
  try { isLink = fs.lstatSync(mem).isSymbolicLink(); } catch {}
  check('junction recriada por cima do diretório vazio', isLink);
  if (isLink) {
    fs.writeFileSync(path.join(mem, 'prova2.md'), '# prova\n');
    check('a memória volta a cair dentro do repositório',
          fs.existsSync(path.join(a.proj, '.marvin', 'Memoria', 'prova2.md')));
  }
  cleanup(a);
}

// ── 8. --check: diagnoses, writes nothing, and the exit code is the message
{
  const a = arena('check');
  const r0 = run(a, '--check');
  check('--check acusa projeto não montado', r0.status !== 0, 'saiu ' + r0.status);
  check('--check não cria arquivo', files(a.proj).length === 0,
        'criou: ' + files(a.proj).join(', '));
  check('--check não cria link no perfil', !fs.existsSync(memoryPath(a.lar, a.proj)));

  run(a, '--no-git');
  const before = files(a.proj).sort();
  const r1 = run(a, '--check');
  check('--check sai 0 com a memória montada', r1.status === 0, r1.stdout.slice(-300));
  check('--check não mexe em projeto já montado',
        JSON.stringify(files(a.proj).sort()) === JSON.stringify(before));

  const mem = memoryPath(a.lar, a.proj);
  try { fs.unlinkSync(mem); } catch { fs.rmdirSync(mem); }
  fs.mkdirSync(mem, { recursive: true });
  const r2 = run(a, '--check');
  check('--check pega a junction virada em diretório', r2.status !== 0, 'saiu ' + r2.status);
  cleanup(a);
}

// ── 9c. the dry-run plan does not invent work
// On an already scaffolded project marvin would do nothing, and that is what the plan
// needed to say. It listed 9 "create dir" for existing folders — mkdir recursive on an
// existing directory creates nothing — and the "nothing to do" message never showed.
{
  const a = arena('planolimpo');
  run(a, '--no-git');
  const r = run(a, '--dry-run', '--no-git');
  check('dry-run em projeto montado não promete trabalho',
        !/create dir/.test(r.stdout), 'ainda lista create dir');
  check('dry-run em projeto montado diz que não há o que fazer',
        /already set up/.test(r.stdout), r.stdout.slice(-200));
  cleanup(a);
}

// ── 9b. --check is announced where the person will look, and step 10 nags whoever
// scaffolded before it existed. A flag that only shows in --help is a flag nobody uses —
// and who needs it most is precisely who scaffolded the project on the previous version.
{
  const a = arena('anuncio');
  run(a, '--no-git');
  const claude = fs.readFileSync(path.join(a.proj, 'CLAUDE.md'), 'utf8');
  check('o CLAUDE.md gerado ensina o marvin --check', /--check/.test(claude));
  check('o 00_Inicio.md do layout antigo não nasce mais', !fs.existsSync(path.join(a.proj, '.marvin', '00_Inicio.md')));

  // Simulates a project scaffolded by an old version: CLAUDE.md without the section.
  fs.writeFileSync(path.join(a.proj, 'CLAUDE.md'), '# projeto\n\nAponta para AGENTS.md.\n');
  const r = run(a, '--no-git');
  check('o passo 10 cobra o CLAUDE.md que não tem a nota', /--check/.test(r.stdout) &&
        /CLAUDE\.md/.test(r.stdout), 'o aviso de atualização não apareceu');
  cleanup(a);
}

// ── 9d. --graphify is mentioned in the normal output, and goes away once in use
// Same disease as --check: a feature that only exists in --help nobody discovers. The
// mention has to be one line, after what matters, and say to read the caveats first.
{
  const a = arena('grafomencao');
  const r = run(a, '--no-git');
  check('a saída normal menciona o graphify e o --use', /--use=graphify/.test(r.stdout));
  check('a menção ensina como instalar', /graphifyy/.test(r.stdout));
  const r2 = run(a, '--no-git', '--graphify');
  check('a menção some quando o --graphify já foi usado',
        !/Optional, and never required/.test(r2.stdout));
  cleanup(a);
}

// ── 9e. the .marvin/ferramentas.md record (US-11a)
// The test runs without a TTY, so the question never shows: it is the "assume não and
// warn" branch. With graphify on the machine's PATH the warning is "no interactive
// terminal"; without, "not on PATH" — both record `não`. The cases that matter for
// someone else's disk: born once, no duplicates, --use flips without rewriting the rest, --dry-run writes nothing.
{
  const a = arena('registro');
  const rec = path.join(a.proj, '.marvin', 'ferramentas.md');
  const r0 = run(a, '--no-git', '--dry-run');
  check('--dry-run não escreve o registro', !fs.existsSync(rec) && /ferramentas\.md/.test(r0.stdout));
  const r = run(a, '--no-git');
  check('sem TTY o registro nasce com `não` e avisa',
        fs.existsSync(rec) && /^\| graphify \| não \|/m.test(fs.readFileSync(rec, 'utf8'))
        && /(no interactive terminal|not on PATH)/.test(r.stdout), r.stdout.slice(-400));
  const before = fs.readFileSync(rec, 'utf8');
  run(a, '--no-git');
  check('rodar de novo não pergunta nem duplica a linha', fs.readFileSync(rec, 'utf8') === before);
  check('sem TTY nada trava esperando resposta', !/Use it in this project/.test(r.stdout));
  const r3 = run(a, '--no-git', '--use=graphify', '--dry-run');
  check('--use no dry-run anuncia e não escreve', fs.readFileSync(rec, 'utf8') === before && /graphify → sim/.test(r3.stdout));
  run(a, '--no-git', '--use=graphify');
  const after = fs.readFileSync(rec, 'utf8');
  check('--use=graphify flipa a linha para `sim`', /^\| graphify \| sim \|/m.test(after));
  check('o flip muda só a coluna usa', after.replace('| sim |', '| não |') === before);
  check('a marca do AGENTS.md aponta para o registro',
        /ferramentas\.md/.test(fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8')));
  cleanup(a);
  // --use on a project WITHOUT a record has to create the line, not just flip it (caught on 15/09).
  const b = arena('registro-use');
  run(b, '--no-git', '--use=graphify');
  const recB = path.join(b.proj, '.marvin', 'ferramentas.md');
  check('--use=graphify sem registro cria a linha com `sim`',
        fs.existsSync(recB) && /^\| graphify \| sim \|/m.test(fs.readFileSync(recB, 'utf8')));
  cleanup(b);
}

// ── 9e2. ponytail: installed ≠ active, and absent does not fail silently (US-11b)
// The plugin lives in HOME (~/.claude/plugins/installed_plugins.json, ~/.claude/.ponytail-active),
// and HOME here is the arena's `lar` — so the test plants both files and does not depend
// on the machine. Without a TTY it never asks: what is checked is the state MESSAGE and the record.
{
  const a = arena('ponytail');
  const r0 = run(a, '--no-git');
  check('ponytail ausente registra `não` e ensina a instalar',
        /^\| ponytail \| não \|/m.test(fs.readFileSync(path.join(a.proj, '.marvin', 'ferramentas.md'), 'utf8'))
        && /ponytail not found[\s\S]*marketplace add DietrichGebert\/ponytail/.test(r0.stdout), r0.stdout.slice(-400));
  check('ausente: nada de ponytail no AGENTS.md nem no agents/README',
        !/ponytail/i.test(fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8'))
        && !/ponytail/i.test(fs.readFileSync(path.join(a.proj, '.claude', 'agents', 'README.md'), 'utf8')));
  cleanup(a);

  const b = arena('ponytail-inst');
  const cl = path.join(b.lar, '.claude', 'plugins'); fs.mkdirSync(cl, { recursive: true });
  fs.writeFileSync(path.join(cl, 'installed_plugins.json'), '{"version":2,"plugins":{"ponytail@ponytail":[{"scope":"user"}]}}');
  const r1 = run(b, '--no-git');
  check('instalado sem .ponytail-active avisa "NOT active"', /ponytail is installed but NOT active/.test(r1.stdout), r1.stdout.slice(-400));
  cleanup(b);

  const c = arena('ponytail-ativo');
  const cl2 = path.join(c.lar, '.claude', 'plugins'); fs.mkdirSync(cl2, { recursive: true });
  fs.writeFileSync(path.join(cl2, 'installed_plugins.json'), '{"plugins":{"ponytail@ponytail":[]}}');
  fs.writeFileSync(path.join(c.lar, '.claude', '.ponytail-active'), 'full\n');
  const r2 = run(c, '--no-git', '--dry-run');
  check('ativo: a mensagem traz o nível', /ponytail is installed and active \(full\)/.test(r2.stdout), r2.stdout.slice(-400));
  check('o dry-run não cria o registro', !fs.existsSync(path.join(c.proj, '.marvin', 'ferramentas.md')));
  run(c, '--no-git', '--use=ponytail');
  const agent = fs.readFileSync(path.join(c.proj, 'AGENTS.md'), 'utf8');
  const rd = fs.readFileSync(path.join(c.proj, '.claude', 'agents', 'README.md'), 'utf8');
  check('--use=ponytail: AGENTS.md ganha a seção com selo baixa e o que ele não substitui',
        /## Ferramentas[\s\S]*confiança \*\*baixa\*\*[\s\S]*não substitui/.test(agent));
  check('--use=ponytail: agents/README sugere a tabela de papéis', /Ponytail: em que papel entra[\s\S]*\| `tl` \| \*\*não\*\*/.test(rd));
  check('o registro guarda o alcance por plataforma', /\| ponytail \| sim \| .*Claude Code\/Codex/.test(fs.readFileSync(path.join(c.proj, '.marvin', 'ferramentas.md'), 'utf8')));
  cleanup(c);
}

// ── 9e. monorepo: the sub-repo ignored by the root reaches the generated CLAUDE.md
// In a monorepo the graph was born useless IN SILENCE: the root ignores the sub-repos,
// graphify respects .gitignore, and what was left was a graph without the product code.
// Measured in a real monorepo: 2,783 of 2,854 nodes came from `.claude/` and zero from the product.
// The test does NOT need graphify installed — CI does not have it. Detection lives at the
// top of the script and the warning is written by step 7, which runs before step 8b gives up.
{
  const hasGit = spawnSync('git', ['--version'], { encoding: 'utf8' }).status === 0;
  if (!hasGit) {
    console.log('  - 9e pulado: git ausente nesta máquina');
  } else {
    const a = arena('monorepo');
    spawnSync('git', ['init', '-q', '.'], { cwd: a.proj });
    fs.mkdirSync(path.join(a.proj, 'svc-a'), { recursive: true });
    spawnSync('git', ['init', '-q', '.'], { cwd: path.join(a.proj, 'svc-a') });
    fs.writeFileSync(path.join(a.proj, '.gitignore'), 'svc-a/\n');
    run(a, '--no-git', '--graphify');
    const claude = path.join(a.proj, 'CLAUDE.md');
    const txt = fs.existsSync(claude) ? fs.readFileSync(claude, 'utf8') : '';
    check('o CLAUDE.md gerado avisa que o projeto é monorepo', /monorepo/i.test(txt));
    check('ele nomeia o sub-repo ignorado', /svc-a/.test(txt));
    check('ele desaconselha o `graphify update .`', /Não rode/.test(txt));
    cleanup(a);
  }
}

// ── 9f. --graphify-git-hook: writes the post-commit and NEVER overwrites an existing one
// The graph ages with every commit and does not warn; the hook closes that gap. But
// post-commit is contested ground — it may already have someone's lint, changelog or CI.
// Overwriting there is destroying someone else's work, which is invariant 1 applied outside memory.
// Skips without graphify on PATH: the block lives after the version check, and CI does not have it.
{
  const hasGraphify = spawnSync('graphify', ['--version'], { encoding: 'utf8', shell: true }).status === 0;
  const hasGit = spawnSync('git', ['--version'], { encoding: 'utf8' }).status === 0;
  if (!hasGraphify || !hasGit) {
    console.log('  - 9f pulado: precisa de git e graphify no PATH (4 checks)'); skipped += 4;
  } else {
    const a = arena('githook');
    spawnSync('git', ['init', '-q', '.'], { cwd: a.proj });
    run(a, '--no-git', '--graphify', '--graphify-git-hook');
    const hook = path.join(a.proj, '.git', 'hooks', 'post-commit');
    check('--graphify-git-hook escreve o post-commit', fs.existsSync(hook));
    const txt = fs.existsSync(hook) ? fs.readFileSync(hook, 'utf8') : '';
    check('o hook traz a válvula de escape', /MARVIN_SKIP_GRAPH_HOOK/.test(txt));
    check('o hook fixa PYTHONHASHSEED — grafo tem que ser reprodutível',
          /PYTHONHASHSEED=0/.test(txt));
    const mine = '#!/bin/sh\necho hook-de-outra-pessoa\n';
    fs.writeFileSync(hook, mine);
    run(a, '--no-git', '--graphify', '--graphify-git-hook');
    check('post-commit que já existe NÃO é sobrescrito',
          fs.readFileSync(hook, 'utf8') === mine);
    cleanup(a);
  }
}

// ── 9g. canonical commands: read from the manifest, never guessed. The manager comes
//     from the LOCKFILE — it is the most expensive mistake (npm install in a pnpm project dirties the lock).
{
  const a = arena('cmd');
  fs.writeFileSync(path.join(a.proj, 'package.json'),
    JSON.stringify({ name: 'cobaia', scripts: { test: 'vitest', build: 'tsc', dev: 'vite' } }));
  fs.writeFileSync(path.join(a.proj, 'pnpm-lock.yaml'), '');
  const r = run(a, '--no-git');
  const md = fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8');
  check('o AGENTS.md ganha a tabela de comandos canônicos', /## Comandos canônicos/.test(md));
  // Assertion on the TABLE ROW, not a loose substring: `pnpm install` contains
  // `npm install`, and the block's own prose cites npm as the example of the mistake.
  check('o gerenciador vem do lockfile, não do palpite',
        /| Instalar | `pnpm install` |/.test(md));
  check('o script do package.json vira comando', /pnpm run test/.test(md));
  // The origin is what keeps the block from aging silently when the manifest changes.
  check('cada linha declara de onde saiu', /package.json > scripts.test/.test(md));
  check('a lacuna manual some quando o script preencheu', !/como rodar teste e build/.test(md));
  check('a saída anuncia o passo 1b', /1b. Canonical commands/.test(r.stdout));
  cleanup(a);
}

// ── 9h. without a readable manifest the script does NOT invent a command — the manual gap stays.
{
  const a = arena('cmd-vazio');
  fs.rmSync(path.join(a.proj, 'package.json'));
  run(a, '--no-git');
  const md = fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8');
  check('sem manifesto, nenhuma tabela de comando é inventada', !/## Comandos canônicos/.test(md));
  check('sem manifesto, a lacuna manual permanece', /como rodar teste e build/.test(md));
  cleanup(a);
}
// ── 9i. the note is fixed context and has a ceiling. The warning is only useful with a
//     DESTINATION — so the test covers both halves: that it measures, and that it says where the overflow goes.
{
  const a = arena('nota');
  run(a, '--no-git');
  const note = path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md');
  const shortOne = run(a, '--dry-run');
  check('a nota entra na conta do contexto fixo', /tk  onde_paramos\.md/.test(shortOne.stdout));
  check('a fonte e o adaptador entram na mesma conta', /tk  AGENTS\.md/.test(shortOne.stdout) && /tk  CLAUDE\.md/.test(shortOne.stdout));
  check('e a conta fecha com o total do que carrega sempre', /loads in EVERY session/.test(shortOne.stdout));
  check('nota recém-criada não dispara aviso', !/not a report/.test(shortOne.stdout));

  // 12 KB: twice the ceiling, so the test does not depend on the exact value.
  fs.appendFileSync(note, '#'.repeat(12 * 1024));
  const longOne = run(a, '--dry-run');
  check('nota longa é acusada', /not a report/.test(longOne.stdout));
  check('o aviso aponta o destino do transbordo', longOne.stdout.includes('Contexto/Fluxos/<fluxo>.md') && /its Sobre\.md under/.test(longOne.stdout));
  check('o aviso lembra que o relato é git log', /→ git log/.test(longOne.stdout));
  cleanup(a);
}

// ── 9j. OLD LAYOUT (08_Memoria/, 10_Decisoes/): still detected, the junction goes to
//     where the notes ARE, nothing is moved, and the script warns. The decisions folder
//     is born explained — empty, it teaches nobody.
{
  const a = arena('dec');
  fs.mkdirSync(path.join(a.proj, '.marvin', '08_Memoria'), { recursive: true });
  const r = run(a, '--no-git');
  check('layout antigo é acusado, não migrado', /old layout/.test(r.stdout) && /nothing was moved/.test(r.stdout));
  check('Memoria/ NÃO nasce ao lado do 08_Memoria/', !fs.existsSync(path.join(a.proj, '.marvin', 'Memoria')));
  check('Contexto/ NÃO nasce no layout antigo', !fs.existsSync(path.join(a.proj, '.marvin', 'Contexto')));
  let target = null; try { target = fs.readlinkSync(memoryPath(a.lar, a.proj)); } catch {}
  check('a junction aponta para onde as notas estão',
        target !== null && path.resolve(target) === path.resolve(path.join(a.proj, '.marvin', '08_Memoria')), 'aponta para ' + target);
  const rd = path.join(a.proj, '.marvin', '10_Decisoes', 'README.md');
  check('10_Decisoes nasce com README', fs.existsSync(rd));
  const txt = fs.existsSync(rd) ? fs.readFileSync(rd, 'utf8') : '';
  check('o README contrasta os dois regimes', /sobrescrito, sempre um/.test(txt) && /imutável, um por decisão/.test(txt));
  check('o README ensina o descarte, que é a parte que paga', /descartado/i.test(txt));
  check('o README resolve publicar-ou-não sem config', txt.includes('10_Decisoes/privado/'));
  const md = fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8');
  check('o AGENTS.md ensina para onde vai o transbordo da nota', /A nota é curta; a decisão é imutável/.test(md));
  cleanup(a);
}
// ── 9k. the note promises three questions and delivers three. It delivered FOUR, and the
//     fourth ("Contexto que economiza tempo") duplicated AGENTS.md's `## Armadilhas` by
//     design — it was 41% of this repository's note and the only section without a ceiling.
{
  const a = arena('tres');
  run(a, '--no-git');
  const note = fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8');
  const sections = note.split(NLQ).filter(l => l.startsWith('## '));
  check('a nota gerada tem exatamente duas seções', sections.length === 2, 'tem: ' + sections.join(' | '));
  check('e são: em andamento · travado', /## Em andamento/.test(note) && /## Travado/.test(note));
  check('a seção que duplicava o AGENTS.md saiu', !/Contexto que economiza tempo/.test(note));
  // The header has to say WHERE each thing goes — without a destination, "be brief" is
  // empty advice. And it has to NAME the loophole: everyone obeyed "do not create a new
  // file" by creating a new section inside the same file (18 of them in a real project).
  check('o cabeçalho manda o estado da US para o Sobre.md dela', /Sobre\.md/.test(note) && /não aqui/.test(note));
  check('o cabeçalho nomeia a brecha: seção de relato é o mesmo erro', /seção de relato/.test(note));
  check('o cabeçalho manda a US concluída para Releases', /Releases\/<versao>\.md/.test(note));
  check('o cabeçalho manda o histórico para o git log', /git log/.test(note));
  cleanup(a);
}
// ── 9l. an ORPHAN junction (points to a folder that no longer exists) is REPOINTED, not
//     just reported. Renaming the vault lands exactly here, and the script only warned —
//     two real occurrences in real projects on the same day brought this branch.
{
  const a = arena('orfa');
  run(a, '--no-git');
  const mem = memoryPath(a.lar, a.proj);
  const vault = path.join(a.proj, '.marvin');
  fs.writeFileSync(path.join(vault, 'Memoria', 'prova.md'), '# prova' + NLQ);
  // Simulates the rename: the junction target stops existing, the content goes to another name.
  fs.renameSync(vault, path.join(a.proj, '.docs'));
  fs.renameSync(path.join(a.proj, '.docs'), vault);
  // Points the junction at a dead path, as the rename would.
  try { fs.unlinkSync(mem); } catch {}
  fs.symlinkSync(path.join(a.proj, '.docs', 'Memoria'), mem, 'junction');

  const r = run(a, '--no-git');
  check('junction órfã é acusada', /no longer exists/.test(r.stdout), r.stdout.slice(-400));
  check('e é repontada para o vault vivo', /repointed to/.test(r.stdout));
  let target = null;
  try { target = fs.readlinkSync(mem); } catch {}
  check('a junction aponta para o vault de verdade',
        target !== null && path.resolve(target) === path.resolve(path.join(vault, 'Memoria')),
        'aponta para ' + target);
  check('a nota continua visível pelo caminho do agente',
        fs.existsSync(path.join(mem, 'prova.md')));
  cleanup(a);
}

// ── 9m. the pointer the person sees has to work for whoever installed through npm. The
//     clone path only works for whoever cloned — and the main route became the package.
{
  const a = arena('ponteiro');
  const h = run(a, '--help');
  check('o --help mostra o comando instalado primeiro', h.stdout.includes("    marvin [flags]"));
  check('o --help mostra o npx como alternativa', h.stdout.includes("npx marvin-kb [flags]"));
  check('o --help não ensina mais <path>/marvin/marvin.mjs',
        !h.stdout.includes('<path>/marvin/marvin.mjs'));
  const r = run(a, '--no-git');
  check('o rodapé aponta o PROMPT.md por URL, que serve a clone e npm',
        r.stdout.includes('github.com/Josuebmota/Marvin/blob/main/PROMPT.md'));
  cleanup(a);
}
// ── 9o. step 6's new branch GOES THROUGH the shim: --dry-run has to ANNOUNCE the
//     orphan fix and not execute it. A new write that calls fs directly makes the
//     dry-run lie silently — it is a trap declared in AGENTS.md.
{
  const a = arena('dry-orfa');
  run(a, '--no-git');
  const mem = memoryPath(a.lar, a.proj);
  try { fs.unlinkSync(mem); } catch {}
  const dead = path.join(a.proj, '.docs', 'Memoria');
  fs.symlinkSync(dead, mem, 'junction');

  const r = run(a, '--dry-run');
  check('o dry-run anuncia a remoção do link', /remove link/.test(r.stdout), r.stdout.slice(-300));
  check('e diz que é SÓ o link', /only the link/.test(r.stdout));
  let target = null;
  try { target = fs.readlinkSync(mem); } catch {}
  check('o dry-run NÃO mexeu na junction',
        target !== null && path.resolve(target) === path.resolve(dead),
        'aponta para ' + target);
  cleanup(a);
}
// ── 9p. graph organization: every folder is born with the file that says what goes in
//     it, AGENTS.md carries the rule repeated before every US, and Design/ is only born
//     when there is a front end — read from package.json, not guessed.
{
  const a = arena('grafo');
  fs.writeFileSync(path.join(a.proj, 'package.json'), '{"name":"x","dependencies":{"react":"18"}}');
  run(a, '--no-git');
  const m = path.join(a.proj, '.marvin');
  const sobre = fs.readFileSync(path.join(m, 'Contexto', 'Sobre.md'), 'utf8');
  check('Contexto/Sobre.md é o nó raiz e explica a organização', /Como esta base está organizada/.test(sobre) && /## Rumo/.test(sobre));
  check('Contexto/Design/ nasce quando há front', fs.existsSync(path.join(m, 'Contexto', 'Design')) && /## Design/.test(sobre));
  const plan = fs.readFileSync(path.join(m, 'Planejamento', 'README.md'), 'utf8');
  check('o formato da US tem Rumo, Código tocado, Time e Skills',
        /## Rumo/.test(plan) && /## Código tocado/.test(plan) && /## Time/.test(plan) && /## Skills/.test(plan));
  check('11_Sessoes/ e as pastas numeradas não nascem mais',
        !fs.existsSync(path.join(m, '11_Sessoes')) && !fs.existsSync(path.join(m, '10_Decisoes')) && !fs.existsSync(path.join(m, '08_Memoria')));
  const md = fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8');
  check('o AGENTS.md só lembra a regra "antes de qualquer US"; ela mora no Planejamento/README', /## Antes de qualquer US/.test(md) && /## Antes de qualquer US/.test(plan) && /scout/.test(plan) && /em camadas/.test(plan));
  const ret = fs.readFileSync(path.join(a.proj, '.claude', 'commands', 'retomar.md'), 'utf8');
  check('a regra de fechar sessão mora no /retomar, onde dispara', /## Ao fechar/.test(ret) && /primeira frase/.test(ret) && !/## Higiene de sessão — quando/.test(md));
  check('a tabela de portabilidade mora no Sobre.md, não no AGENTS.md', /## Portabilidade/.test(sobre) && !/## Portabilidade/.test(md));
  check('o AGENTS.md ensina "a nota aponta; o nó guarda"', /A nota aponta; o nó guarda/.test(md));
  check('o AGENTS.md nomeia a brecha da seção de relato', /seção de relato dentro dela/.test(md));

  const b = arena('semfront');
  run(b, '--no-git');
  check('sem front, Design/ não nasce', !fs.existsSync(path.join(b.proj, '.marvin', 'Contexto', 'Design')));
  cleanup(a); cleanup(b);
}

// ── 9q. the docs side of the graph is generated by marvin, by regex, and appended
//     straight into graph.json — measured on 10/09: graphify only indexes .md through an
//     LLM and discards the doc→code edge. This test does not need graphify: with graph.json
//     present, the append runs even without the binary. With the binary, the result has to be the same.
{
  const a = arena('docgrafo');
  fs.mkdirSync(path.join(a.proj, 'src'), { recursive: true });
  fs.writeFileSync(path.join(a.proj, 'src', 'pag.js'), 'export function estornar(v) { return v; }' + NLQ);
  run(a, '--no-git');
  const us = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E1', 'F1', 'US-1');
  fs.mkdirSync(us, { recursive: true });
  fs.writeFileSync(path.join(us, 'Sobre.md'), [
    '---', 'tipo: us', 'estado: ativa', 'pai: ../Sobre.md', '---', '# US-1 — estorno',
    '## Fluxos ligados', '- [pag](../../../../../Contexto/Fluxos/pag.md)',
    '## Código tocado', '- `src/pag.js` — `estornar`', '- `src/pag.js` — `sumiu`', ''].join(NLQ));
  fs.writeFileSync(path.join(us, '..', 'Sobre.md'), '---' + NLQ + 'tipo: feature' + NLQ + '---' + NLQ + '# F1' + NLQ);
  fs.writeFileSync(path.join(a.proj, '.marvin', 'Contexto', 'Fluxos', 'pag.md'), '# Fluxo pag' + NLQ + '[US-1](../../Planejamento/Novos/E1/F1/US-1/Sobre.md)' + NLQ);
  // code graph as `graphify extract --code-only` writes it — predictable ids
  const output = path.join(a.proj, 'graphify-out');
  fs.mkdirSync(output, { recursive: true });
  const graph = { directed: true, nodes: [
    { id: 'src_pag', label: 'pag.js', file_type: 'code', source_file: 'src/pag.js', _origin: 'ast' },
    { id: 'src_pag_estornar', label: 'estornar()', file_type: 'code', source_file: 'src/pag.js', _origin: 'ast' }],
    edges: [{ source: 'src_pag', target: 'src_pag_estornar', relation: 'contains', _origin: 'ast' }] };
  fs.writeFileSync(path.join(output, 'graph.json'), JSON.stringify(graph));

  const r = run(a, '--no-git', '--graphify');
  check('o anexo dos docs roda e conta nós e arestas', /knowledge base in the graph — \d+ doc node\(s\), \d+ edge\(s\)/.test(r.stdout), r.stdout.slice(-600));
  const g = JSON.parse(fs.readFileSync(path.join(output, 'graph.json'), 'utf8'));
  const edges = g.edges || g.links || [];
  const has = (s, t, rel) => edges.some(e => e.source === s && e.target === t && e.relation === rel);
  const usId = 'marvin_planejamento_novos_e1_f1_us_1_sobre';
  check('US → função de código vira touches', has(usId, 'src_pag_estornar', 'touches'), JSON.stringify(edges.filter(e => e._origin === 'marvin').map(e => e.source + '>' + e.target)));
  check('US → fluxo vira references', has(usId, 'marvin_contexto_fluxos_pag', 'references'));
  check('pai: vira child_of', has(usId, 'marvin_planejamento_novos_e1_f1_sobre', 'child_of'));
  check('o nó da US carrega tipo e estado', g.nodes.some(n => n.id === usId && n.estado === 'ativa' && n.tipo === 'us'));
  check('função que não existe vira AVISO, não nó fantasma', /`sumiu` is not in `src\/pag\.js`/.test(r.stdout) && !g.nodes.some(n => n.id === 'src_pag_sumiu'));
  check('exemplo dentro de bloco de código não vira aresta', !edges.some(e => e.target === 'src_checkout_pagamento_calcularestorno'));
  const before = edges.filter(e => e._origin === 'marvin').length;
  run(a, '--no-git', '--graphify');
  const g2 = JSON.parse(fs.readFileSync(path.join(output, 'graph.json'), 'utf8'));
  check('rodar de novo não duplica o lado dos docs', (g2.edges || g2.links).filter(e => e._origin === 'marvin').length === before);
  cleanup(a);
}

// ── 9r. --us: the physical trigger of the "before any US" rule. Creates the missing
//     Sobre.md chain, adds the child to the existing parent, puts the pointer in the note
//     — and running again duplicates nothing. /us and /fechar are born in 7b.
{
  const a = arena('us');
  run(a, '--no-git');
  check('/us nasce no 7b', fs.existsSync(path.join(a.proj, '.claude', 'commands', 'us.md')));
  check('/fechar nasce no 7b, o par do /retomar', fs.existsSync(path.join(a.proj, '.claude', 'commands', 'fechar.md')));
  const r = run(a, '--us', 'Novos/Pagamentos/Estorno/US-01-parcial');
  check('--us sai 0', r.status === 0, r.stdout.slice(-300));
  const P = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'Pagamentos');
  check('--us cria Epic, Feature e US', ['Sobre.md', 'Estorno/Sobre.md', 'Estorno/US-01-parcial/Sobre.md'].every(f => fs.existsSync(path.join(P, f))));
  const us = fs.readFileSync(path.join(P, 'Estorno', 'US-01-parcial', 'Sobre.md'), 'utf8');
  check('a US nasce no formato: Time, Skills, Código tocado, Rumo datado', /tipo: us/.test(us) && /## Time/.test(us) && /## Skills/.test(us) && /## Código tocado/.test(us) && /- \*\*\d\d\/\d\d\/\d{4}\*\*/.test(us));
  const note1 = fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8');
  check('o ponteiro entra na nota e o placeholder sai', note1.includes('](../Planejamento/Novos/Pagamentos/Estorno/US-01-parcial/Sobre.md)') && !/_\(uma por linha/.test(note1));
  run(a, '--us', 'Novos/Pagamentos/Estorno/US-02-total');
  const feat = fs.readFileSync(path.join(P, 'Estorno', 'Sobre.md'), 'utf8');
  check('a segunda US entra em Filhos da Feature que já existia', /US-01-parcial\/Sobre\.md/.test(feat) && /US-02-total\/Sobre\.md/.test(feat));
  const before = fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8');
  run(a, '--us', 'Novos/Pagamentos/Estorno/US-02-total');
  const after = fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8');
  check('--us duas vezes não duplica o ponteiro', before === after && (after.match(/^- \[US-02-total\]/gm) || []).length === 1);
  check('--us com caminho errado sai != 0 e não cria nada', run(a, '--us', 'Errado/x').status !== 0 && !fs.existsSync(path.join(a.proj, '.marvin', 'Planejamento', 'Errado')));

  // ── 9s. --status: reads the nodes, checks against the note, and the exit code is the message.
  const s1 = run(a, '--status');
  check('--status sai 0 quando nota e nós concordam', s1.status === 0, s1.stdout.slice(-400));
  check('--status lista as US com a cadeia Epic › Feature', /US-01-parcial/.test(s1.stdout) && /Pagamentos › Estorno/.test(s1.stdout));
  check('--status mostra o progresso por Epic', /0\/2 US concluídas/.test(s1.stdout));
  check('--status traz a conta do contexto fixo', /loads in EVERY session/.test(s1.stdout));
  check('--status não escreve nada', fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8') === after);
  // A concluded US still in the note: the most common loophole after closing a delivery.
  const usFile = path.join(P, 'Estorno', 'US-01-parcial', 'Sobre.md');
  fs.writeFileSync(usFile, fs.readFileSync(usFile, 'utf8').replace('estado: ativa', 'estado: concluida'));
  const s2 = run(a, '--status');
  check('--status acusa US concluída que ainda está na nota', s2.status !== 0 && /still in the note/.test(s2.stdout));
  check('--status acusa concluída sem Evidência', /without Evidência/.test(s2.stdout));
  // A report section inside the note: the loophole the text names and the status catches.
  fs.appendFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), NLQ + '## Última rodada' + NLQ + NLQ + 'fizemos muita coisa' + NLQ);
  const s3 = run(a, '--status');
  check('--status acusa seção de relato na nota', /look like a report/.test(s3.stdout));
  cleanup(a);
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
  run(a, '--no-git');   // scaffolds on the old layout: junction → 08_Memoria
  // readlinkSync on a junction may come with a trailing separator (it happened on CI's
  // windows-latest, not on the local machine): resolve before looking at the name, instead of a regex on raw text.
  const linkTarget = () => { try { return path.basename(path.resolve(fs.readlinkSync(memoryPath(a.lar, a.proj)))); } catch { return ''; } };
  check('cenário: junction aponta para 08_Memoria', linkTarget() === '08_Memoria', 'alvo: ' + linkTarget());
  const d = run(a, '--migrar', '--dry-run');
  check('--migrar --dry-run não move nada', fs.existsSync(path.join(m, '08_Memoria', 'onde_paramos.md')) && !fs.existsSync(path.join(m, 'Memoria')));
  const r = run(a, '--migrar');
  check('--migrar sai 0', r.status === 0, r.stdout.slice(-400));
  check('backup completo antes de mover', fs.existsSync(path.join(m, '99_Backup', 'antes-do-grafo', '08_Memoria', 'onde_paramos.md')) && fs.existsSync(path.join(m, '99_Backup', 'antes-do-grafo', '10_Decisoes', 'x.md')));
  check('memória inteira em Memoria/, 08_Memoria some', fs.existsSync(path.join(m, 'Memoria', 'onde_paramos.md')) && fs.existsSync(path.join(m, 'Memoria', 'MEMORY.md')) && !fs.existsSync(path.join(m, '08_Memoria')));
  check('decisão vai para Contexto/Arquitetura; o README antigo para o backup', fs.existsSync(path.join(m, 'Contexto', 'Arquitetura', 'x.md')) && fs.existsSync(path.join(m, '99_Backup', '10_Decisoes-README.md')) && !fs.existsSync(path.join(m, '10_Decisoes')));
  check('fontes e índice antigo', fs.existsSync(path.join(m, 'Fontes', 'Externas.md')) && fs.existsSync(path.join(m, '99_Backup', '00_Inicio.md')) && !fs.existsSync(path.join(m, '11_Sessoes')));
  check('links reescritos nos dois sentidos',
        /\.\.\/Contexto\/Arquitetura\/x\.md/.test(fs.readFileSync(path.join(m, 'Memoria', 'onde_paramos.md'), 'utf8')) &&
        /\.marvin\/Memoria\/onde_paramos\.md/.test(fs.readFileSync(path.join(m, 'Contexto', 'Arquitetura', 'x.md'), 'utf8')));
  check('--migrar diz o que ficou para o humano', /left for you/.test(r.stdout) && /the note/.test(r.stdout));
  const r2 = run(a, '--no-git');
  check('o run seguinte reponta a junction para Memoria/', linkTarget() === 'Memoria', 'alvo: ' + linkTarget() + ' | ' + r2.stdout.slice(-300));
  check('e cria os templates do layout novo', fs.existsSync(path.join(m, 'Contexto', 'Sobre.md')) && fs.existsSync(path.join(m, 'Planejamento', 'README.md')));
  check('--migrar de novo: nada a migrar, sai 0', run(a, '--migrar').status === 0);
  cleanup(a);
}

// ── 9u. step 3 tells a declared backup from shell junk. `firestore.rules.bak` in a real
//     repo was called "malformed shell command" — a warning that teaches the wrong thing.
{
  const a = arena('backup');
  fs.writeFileSync(path.join(a.proj, 'firestore.rules.bak'), 'x' + NLQ);
  fs.writeFileSync(path.join(a.proj, '{'), '');
  const r = run(a, '--no-git');
  check('.bak é acusado como backup, com a pergunta certa', /firestore\.rules\.bak.*backup file in the root/.test(r.stdout) && /meant to be versioned/.test(r.stdout));
  check('.bak NÃO entra na lista de lixo de shell nem no rm -f', !/rm -f.*firestore\.rules\.bak/.test(r.stdout));
  check('lixo de shell continua sendo acusado como lixo', /rm -f.*"\{"/.test(r.stdout));
  cleanup(a);
}

// ── 9v. --release closes the cycle. Invariant 1 in the script's most dangerous spot: it
//     REMOVES lines from the note — only the line whose US went in, with the count checked,
//     and the release written first. Without Evidência it writes nothing; running again refuses; dry-run does not touch the disk.
{
  const a = arena('release');
  run(a, '--no-git');
  for (const u of ['US-01-a', 'US-02-b', 'US-03-c']) run(a, '--us', 'Novos/E/F/' + u);
  const P = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E', 'F');
  const mark = (u, evid) => { const p = path.join(P, u, 'Sobre.md'); let s = fs.readFileSync(p, 'utf8').replace('estado: ativa', 'estado: concluida'); if (evid) s = s.replace(/## Evidência[\s\S]*$/, '## Evidência' + NLQ + '- ' + evid + NLQ); fs.writeFileSync(p, s); };
  mark('US-01-a', 'PR #1 verde');
  mark('US-02-b', null);   // concluded WITHOUT evidence
  const note = path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md');
  const before = fs.readFileSync(note, 'utf8');
  const r0 = run(a, '--release', '1.0.0');
  check('--release aborta sem Evidência, com o nome, e não escreve nada', r0.status !== 0 && /US-02-b/.test(r0.stdout) && !fs.existsSync(path.join(a.proj, '.marvin', 'Releases', '1.0.0.md')) && fs.readFileSync(note, 'utf8') === before);
  mark('US-02-b', 'teste x verde');
  const d = run(a, '--release', '1.0.0', '--dry-run');
  check('--release --dry-run mostra o conteúdo e não escreve', /US-01-a/.test(d.stdout) && /US-02-b/.test(d.stdout) && !fs.existsSync(path.join(a.proj, '.marvin', 'Releases', '1.0.0.md')) && fs.readFileSync(note, 'utf8') === before);
  const r1 = run(a, '--release', '1.0.0');
  check('--release sai 0 e escreve o índice', r1.status === 0, r1.stdout.slice(-400));
  const rel = fs.readFileSync(path.join(a.proj, '.marvin', 'Releases', '1.0.0.md'), 'utf8');
  check('o índice tem as duas concluídas com evidência, e não a ativa', /US-01-a/.test(rel) && /US-02-b/.test(rel) && !/US-03-c/.test(rel) && /PR #1 verde/.test(rel));
  const after = fs.readFileSync(note, 'utf8');
  check('a nota perde exatamente as duas linhas e mantém a ativa e as seções', !/US-01-a/.test(after) && !/US-02-b/.test(after) && /US-03-c/.test(after) && /## Travado/.test(after));
  check('o --status volta a sair 0', run(a, '--status').status === 0);
  check('--release de novo com a mesma versão recusa', run(a, '--release', '1.0.0').status !== 0);
  const r2 = run(a, '--release', '1.0.1');
  check('versão nova sem US nova: nada a escrever, sai 0, sem arquivo', r2.status === 0 && !fs.existsSync(path.join(a.proj, '.marvin', 'Releases', '1.0.1.md')));
  check('--release não faz tag nem commit — sugere', /git tag -a v1\.0\.0/.test(r1.stdout));
  cleanup(a);
}

// ── 9w. --status --curto is hook output: no header, no color, and ALWAYS exits 0 — in a
//     hook, exit != 0 becomes a visible error and takes the session down. 7b generates the
//     hook; someone else's settings.json is untouched byte for byte.
{
  const a = arena('curto');
  run(a, '--no-git');
  const settings = path.join(a.proj, '.claude', 'settings.json');
  check('o 7b gera o settings.json com o hook SessionStart', fs.existsSync(settings) && /SessionStart/.test(fs.readFileSync(settings, 'utf8')) && /--status --curto/.test(fs.readFileSync(settings, 'utf8')));
  check('e ele é JSON válido', (() => { try { JSON.parse(fs.readFileSync(settings, 'utf8')); return true; } catch { return false; } })());
  run(a, '--us', 'Novos/E/F/US-1');
  const usFile = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E', 'F', 'US-1', 'Sobre.md');
  fs.writeFileSync(usFile, fs.readFileSync(usFile, 'utf8').replace('estado: ativa', 'estado: concluida'));
  check('--status acusa e sai 1', run(a, '--status').status === 1);
  const c = run(a, '--status', '--curto');
  check('--status --curto acusa a mesma coisa e sai 0', c.status === 0 && /still in the note/.test(c.stdout));
  check('--curto não tem cabeçalho nem cor', !/agent memory/.test(c.stdout) && !/\x1b\[/.test(c.stdout));
  check('--curto cabe no orçamento do hook (≤ 200 tk)', Buffer.byteLength(c.stdout) / 4 <= 200, Buffer.byteLength(c.stdout) + ' bytes');
  // someone else's settings.json
  const foreign = '{\n  "permissions": { "allow": ["Bash(ls)"] }\n}\n';
  fs.writeFileSync(settings, foreign);
  const r = run(a, '--no-git');
  check('settings.json alheio fica intocado byte a byte, e o bloco é impresso', fs.readFileSync(settings, 'utf8') === foreign && /not merged/.test(r.stdout) && /SessionStart/.test(r.stdout));
  check('o passo 10 cobra o hook que falta', /settings\.json — missing/.test(r.stdout));
  cleanup(a);
}

// ── 9x. --status --html: the only form of --status that writes — and only in .marvin/.status/,
//     git-ignored. One point per COMMIT (git date, not Date.now()): two runs on the same
//     commit do not duplicate. Without --html the jsonl is not born. The HTML opens offline: inline JSON.
{
  const a = arena('html');
  run(a);   // with git init
  const git = (...args) => spawnSync('git', args, { cwd: a.proj, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } });
  git('add', '-A'); git('commit', '-q', '-m', 'um');
  const dir = path.join(a.proj, '.marvin', '.status');
  run(a, '--status');
  check('--status sem --html não cria .status/', !fs.existsSync(dir));
  const h1 = run(a, '--status', '--html');
  check('--status --html sai 0 e escreve index.html + historico.jsonl', h1.status === 0 && fs.existsSync(path.join(dir, 'index.html')) && fs.existsSync(path.join(dir, 'historico.jsonl')), h1.stdout.slice(-300));
  run(a, '--status', '--html');
  const lines = () => fs.readFileSync(path.join(dir, 'historico.jsonl'), 'utf8').split(/\r?\n/).filter(Boolean);
  check('dois runs no mesmo commit: um ponto só', lines().length === 1);
  fs.appendFileSync(path.join(a.proj, 'AGENTS.md'), NLQ + '## Mais' + NLQ + 'x'.repeat(400) + NLQ);
  git('add', '-A'); git('commit', '-q', '-m', 'dois');
  run(a, '--status', '--html');
  check('commit novo: segundo ponto, e o contexto fixo cresceu', lines().length === 2 && JSON.parse(lines()[1]).total > JSON.parse(lines()[0]).total);
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  check('o HTML embute a série (file:// bloqueia fetch) e desenha SVG', /<script type="application\/json" id="historico">/.test(html) && /<polyline/.test(html) && !/<script src=/.test(html));
  // US-15: the first fold answers 'what to do' — Corrigir (or 'tudo consistente') and the 4 cards
  // come before everything; the network is the last section and is born collapsed; both themes are in the <style>
  const order = ['<div class="cards">', 'id="andamento"', 'id="tendencia"', 'id="tokens"', '<details class="rede"'].map(s => html.indexOf(s));
  check('HTML: Corrigir/ok antes dos cards, cards antes de tudo, rede colapsada por último', (html.indexOf('class="tudo-ok"') >= 0 || html.indexOf('class="corrigir"') >= 0) && Math.min(html.indexOf('class="tudo-ok"') < 0 ? Infinity : html.indexOf('class="tudo-ok"'), html.indexOf('class="corrigir"') < 0 ? Infinity : html.indexOf('class="corrigir"')) < order[0] && order.every((p, i) => p >= 0 && (i === 0 || p > order[i - 1])) && !/<details class="rede"[^>]*\sopen/.test(html));
  check('HTML: os cards trazem o delta desde o commit anterior', /class="delta (up|down|)/.test(html) && /desde o último commit/.test(html));
  check('HTML: tema claro e escuro por prefers-color-scheme, sem asset externo', html.includes(':root{color-scheme:light dark') && html.includes('@media(prefers-color-scheme:dark){:root:not([data-theme=light]){') && html.includes(':root[data-theme=dark]{') && html.includes('id="tema"') && !/<link/.test(html) && !/@import/.test(html));
  // and with a real problem: a concluded US still in the note → enters Corrigir, with a link relative to the page
  run(a, '--us', 'Novos/P/F/US-01-x');
  const usX = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'P', 'F', 'US-01-x', 'Sobre.md');
  fs.writeFileSync(usX, fs.readFileSync(usX, 'utf8').replace('estado: ativa', 'estado: concluida'));
  run(a, '--status', '--html');
  const html2 = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  check('HTML: problema vira item de Corrigir, antes dos cards, com link para o Sobre.md', /class="corrigir"/.test(html2) && html2.indexOf('class="corrigir"') < html2.indexOf('<div class="cards">') && /href="\.\.\/Planejamento\/Novos\/P\/F\/US-01-x\/Sobre\.md"/.test(html2) && /still in the note/.test(html2));
  check('.marvin/.status/ entrou no .gitignore', /^\.marvin\/\.status\/$/m.test(fs.readFileSync(path.join(a.proj, '.gitignore'), 'utf8')));
  check('--status --html --dry-run não escreve', (() => { const before = lines().length; fs.rmSync(path.join(dir, 'index.html')); run(a, '--status', '--html', '--dry-run'); return !fs.existsSync(path.join(dir, 'index.html')) && lines().length === before; })());
  cleanup(a);
}

// ── 9y. tokens spent: read from the transcripts, deduplicated by message id (the same
//     reply is recorded more than once while streaming), per model, subagent apart.
//     The cost is an estimate and the output says so.
{
  const a = arena('gastos');
  run(a, '--no-git');
  const dir = path.dirname(memoryPath(a.lar, a.proj));
  const line = (id, model, usage, extra = {}) => JSON.stringify({ type: 'assistant', timestamp: '2026-09-11T10:00:00Z', sessionId: 's1', message: { id, model, usage }, ...extra });
  fs.writeFileSync(path.join(dir, 's1.jsonl'), [
    JSON.stringify({ type: 'user', message: { role: 'user', content: 'oi' } }),
    line('msg_1', 'claude-opus-5', { input_tokens: 10, cache_creation_input_tokens: 1000, cache_read_input_tokens: 0, output_tokens: 50 }),
    line('msg_1', 'claude-opus-5', { input_tokens: 10, cache_creation_input_tokens: 1000, cache_read_input_tokens: 0, output_tokens: 200 }),   // same msg, final usage
    line('msg_2', 'claude-sonnet-5', { input_tokens: 5, cache_creation_input_tokens: 0, cache_read_input_tokens: 1000, output_tokens: 100 }, { isSidechain: true }),
    ''].join(NLQ));
  const r = run(a, '--status');
  check('--status lê as transcrições e conta turnos deduplicados', /2 model turns/.test(r.stdout) && /1 by subagents/.test(r.stdout), r.stdout.slice(-600));
  check('o dedupe fica com o usage final da mensagem', /claude-opus-5.*200 out/.test(r.stdout));
  check('um bloco por modelo', /claude-sonnet-5/.test(r.stdout));
  // opus: 10*5 + 200*25 + 1000*6.25 = 50+5000+6250 = 11300 / 1e6 = $0.0113 ; sonnet: 5*2+100*10+1000*0.2 = 1210/1e6
  check('o custo é calculado pela tabela e declarado como estimativa', /≈ \$0\.01 total/.test(r.stdout) && /an estimate/.test(r.stdout));
  check('a fatia do contexto fixo é dita', /fixed context is ~\d+% of it/.test(r.stdout));
  run(a, '--us', 'Novos/E/F/US-1');
  run(a, '--status', '--html');
  const html = fs.readFileSync(path.join(a.proj, '.marvin', '.status', 'index.html'), 'utf8');
  check('o HTML traz a tabela por modelo e o aviso de estimativa', /claude-sonnet-5/.test(html) && /custariam na API/.test(html));
  check('o HTML desenha a rede da base — nós de doc com estado, sem lib', /id="rede-dados"/.test(html) && /"cat":"us"/.test(html) && /"estado":"ativa"/.test(html) && !/<script src=/.test(html));
  const short = run(a, '--status', '--curto', '--html');
  check('--curto --html regera o dashboard em silêncio (é o hook)', short.status === 0 && !/index\.html/.test(short.stdout) && fs.statSync(path.join(a.proj, '.marvin', '.status', 'index.html')).size > 1000);
  check('o hook gerado regera o HTML', /--status --curto --html/.test(fs.readFileSync(path.join(a.proj, '.claude', 'settings.json'), 'utf8')));
  cleanup(a);
}

// ── 9z. the graph in our favor. Measured: in 23,745 turns the agent queried the graph
//     twice. So the script asks: Impacto in --us, collision in --status, drift in --fechar.
//     Synthetic graph in graphify's format — the test does not need the binary.
{
  const a = arena('grafo-favor');
  fs.mkdirSync(path.join(a.proj, 'src'), { recursive: true });
  fs.writeFileSync(path.join(a.proj, 'src', 'pag.js'), 'export function cobrar(){}' + NLQ);
  fs.writeFileSync(path.join(a.proj, 'src', 'ui.js'), 'export function tela(){}' + NLQ);
  run(a);   // with git
  const git = (...args) => spawnSync('git', args, { cwd: a.proj, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } });
  // src/ committed YESTERDAY: --fechar counts "commits since midnight", and the base commit is not today's work
  git('add', '-A'); spawnSync('git', ['commit', '-q', '-m', 'base'], { cwd: a.proj, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t', GIT_AUTHOR_DATE: '2020-01-01T00:00:00', GIT_COMMITTER_DATE: '2020-01-01T00:00:00' } });
  const output = path.join(a.proj, 'graphify-out'); fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, 'graph.json'), JSON.stringify({ directed: true, nodes: [
    { id: 'src_pag', label: 'pag.js', file_type: 'code', source_file: 'src/pag.js', community: 0, _origin: 'ast' },
    { id: 'src_pag_cobrar', label: 'cobrar()', file_type: 'code', source_file: 'src/pag.js', source_location: 'L1', community: 0, _origin: 'ast' },
    { id: 'src_ui', label: 'ui.js', file_type: 'code', source_file: 'src/ui.js', community: 1, _origin: 'ast' },
    { id: 'src_ui_tela', label: 'tela()', file_type: 'code', source_file: 'src/ui.js', source_location: 'L1', community: 1, _origin: 'ast' }],
    edges: [{ source: 'src_pag', target: 'src_pag_cobrar', relation: 'contains' }, { source: 'src_ui', target: 'src_ui_tela', relation: 'contains' },
            { source: 'src_ui_tela', target: 'src_pag_cobrar', relation: 'calls' }] }));
  const open = (u, touches) => { run(a, '--us', 'Novos/E/F/' + u); const p = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E', 'F', u, 'Sobre.md'); fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/_\(crase com o caminho[^\n]*\n/, touches.map(x => '- ' + x).join(NLQ) + NLQ)); return p; };
  const usA = open('US-A', ['`src/pag.js` — `cobrar`']);
  const r1 = run(a, '--us', 'Novos/E/F/US-A');
  const sobreA = fs.readFileSync(usA, 'utf8');
  check('--us de novo escreve o Impacto a partir do grafo', /Impacto —/.test(r1.stdout) && /## Impacto/.test(sobreA) && /tela\(\)/.test(sobreA), r1.stdout.slice(-400));
  check('o Impacto é marcado como derivado', /gerado por `marvin --us`/.test(sobreA));
  run(a, '--us', 'Novos/E/F/US-A');
  check('rodar de novo não duplica a seção', (fs.readFileSync(usA, 'utf8').match(/## Impacto/g) || []).length === 1);
  open('US-B', ['`src/pag.js` — `cobrar`']);
  const s1 = run(a, '--status');
  check('--status acusa duas US ativas na mesma função', s1.status !== 0 && /US-A and US-B both touch cobrar/.test(s1.stdout), s1.stdout.slice(-600));
  // drift: a changed file no US declares
  fs.writeFileSync(path.join(a.proj, 'src', 'novo.js'), 'export const x = 1;' + NLQ);
  fs.appendFileSync(path.join(a.proj, 'src', 'pag.js'), '// mudou' + NLQ);
  const f1 = run(a, '--fechar');
  check('--fechar acusa o arquivo mudado sem US e sai != 0', f1.status !== 0 && /src\/novo\.js/.test(f1.stdout) && /in NO active US/.test(f1.stdout), f1.stdout.slice(-500));
  check('--fechar reconhece o arquivo coberto por uma US', /src\/pag\.js\s+→ US-[AB]/.test(f1.stdout));
  fs.unlinkSync(path.join(a.proj, 'src', 'novo.js'));
  const f2 = run(a, '--fechar');
  check('sem deriva, --fechar sai 0', f2.status === 0 && /every changed code file is declared/.test(f2.stdout), f2.stdout.slice(-300));
  check('/fechar chama o --fechar e /us pede a segunda rodada', /--fechar/.test(fs.readFileSync(path.join(a.proj, '.claude', 'commands', 'fechar.md'), 'utf8')) && /Impacto/.test(fs.readFileSync(path.join(a.proj, '.claude', 'commands', 'us.md'), 'utf8')));
  cleanup(a);
}

// ── 9aa. git worktree (US-13). Memory follows the cwd: in the worktree Claude Code creates
//     a real, empty directory, and nothing warns. The hook (--status --curto, runs in EVERY
//     session) has to flag it BEFORE marvin runs there; after, it goes quiet. Running marvin
//     in the worktree mounts its junction — the notes travel with the branch. Needs git on PATH.
{
  const a = arena('worktree');
  const hasGit = spawnSync('git', ['--version']).status === 0;
  // without git, the suite total drops by 5 and the last block would fail the READMEs: declared, not faked
  if (!hasGit) { console.log('  - 9aa pulado: precisa de git no PATH (5 checks)'); skipped += 5; }
  else {
    const git = (...args) => spawnSync('git', args, { cwd: a.proj, encoding: 'utf8',
      env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } });
    run(a, '--no-questions');                       // scaffolds the main one, with .git
    git('add', '-A'); git('commit', '-q', '-m', 'base');
    const wt = path.join(a.base, 'wt');
    git('worktree', 'add', '-q', wt, '-b', 'ramo');
    const w = { proj: wt, lar: a.lar };
    check('a worktree tem .git como ARQUIVO', fs.statSync(path.join(wt, '.git')).isFile());
    const before = run(w, '--status', '--curto');
    check('o hook acusa memória desligada na worktree e ainda sai 0', before.status === 0 && /DESLIGADA.*git worktree/.test(before.stdout), before.stdout.slice(-300));
    const r = run(w, '--no-questions');
    check('marvin na worktree diz que é worktree e monta a junction DELA', /git worktree/.test(r.stdout) && /junction created/.test(r.stdout));
    const memWt = path.join(a.lar, '.claude', 'projects', wt.replace(/[:\\/]/g, '-'), 'memory');
    check('a junction aponta para o .marvin/Memoria da worktree, não do principal',
          fs.lstatSync(memWt).isSymbolicLink() && path.resolve(fs.readlinkSync(memWt)) === path.resolve(wt, '.marvin', 'Memoria'));
    const after = run(w, '--status', '--curto');
    check('depois de montar, o hook cala', after.status === 0 && !/DESLIGADA/.test(after.stdout));
    git('worktree', 'remove', '--force', wt);
  }
  cleanup(a);
}

// ── 13. Refined USs and ilhas (US-16). Five USs: 01+02 (F1) share a.js, 03 (F2) shares b.js
// with the active 05 (F2), core.js is in three of them across two features (núcleo), 04 has
// no Código tocado. The grouping is the one non-trivial logic added since the graph — this
// is its one runnable check.
{
  const a = arena('ilhas');
  run(a, '--no-git', '--no-questions');
  const feat = { 'US-01': 'F1', 'US-02': 'F1', 'US-03': 'F2', 'US-04': 'F1', 'US-05': 'F2' };
  for (const u of ['US-01', 'US-02', 'US-03', 'US-04']) run(a, '--us', 'Novos/E1/' + feat[u] + '/' + u, '--refinada');
  run(a, '--us', 'Novos/E1/F2/US-05');
  const sobre = (u) => path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E1', feat[u], u, 'Sobre.md');
  const note = fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8');
  check('--us --refinada nasce com estado: refinada', /^estado: refinada$/m.test(fs.readFileSync(sobre('US-01'), 'utf8')));
  check('US refinada NÃO entra na nota', !note.includes('US-01/Sobre.md'));
  check('US sem --refinada continua ativa e na nota', /^estado: ativa$/m.test(fs.readFileSync(sobre('US-05'), 'utf8')) && note.includes('US-05/Sobre.md'));
  const touch = (u, files) => {
    const t = fs.readFileSync(sobre(u), 'utf8').replace(/## Código tocado\n_\([^)]*\)_\n/, '## Código tocado\n' + files.map(f => '- `' + f + '`' + NLQ).join(''));
    fs.writeFileSync(sobre(u), t);
  };
  touch('US-01', ['src/a.js', 'src/core.js']); touch('US-02', ['src/a.js', 'src/core.js']);
  touch('US-03', ['src/b.js', 'src/core.js']); touch('US-05', ['src/b.js']);
  const out = run(a, '--status', '--curto').stdout;
  check('--curto imprime as ilhas', /Ilhas/.test(out) && /4 US refinada/.test(out));
  check('01 e 02 caem na mesma ilha (a.js)', /▹ a\s+2 US: ○ US-01 · ○ US-02/.test(out), out);
  check('a ilha com US ativa vem primeiro (▶ b)', /▶ b\s+2 US: ● US-05 · ○ US-03/.test(out), out);
  check('arquivo em 3 US de 2 features é núcleo e não engole as ilhas', /núcleo \(≥3 US, 2\+ features\): core\.js/.test(out), out);
  check('US sem Código tocado é "sem mapa"', /sem mapa[^\n]*US-04/.test(out), out);
  check('refinada não dispara "ativa but not in the note"', !/marked ativa but not in the note/.test(out), out);
  check('/refinar é gerado', fs.existsSync(path.join(a.proj, '.claude', 'commands', 'refinar.md')));
  check('/retomar tem as duas portas', /duas portas/.test(fs.readFileSync(path.join(a.proj, '.claude', 'commands', 'retomar.md'), 'utf8')));
  cleanup(a);
}

// ── 14. Version stamp (US-17). The record is the user's file: written once, rewritten only
// when the version changes, and the hook is where a base left behind gets noticed.
{
  const a = arena('carimbo');
  const version = JSON.parse(fs.readFileSync(path.join(HERE, 'package.json'), 'utf8')).version;
  run(a, '--no-git', '--no-questions');
  const rec = path.join(a.proj, '.marvin', 'ferramentas.md');
  const read = () => fs.readFileSync(rec, 'utf8');
  check('ferramentas.md carimba marvin_montado e marvin', new RegExp('^marvin_montado: ' + version + '$', 'm').test(read()) && new RegExp('^marvin: ' + version + '$', 'm').test(read()));
  const before = read();
  const again = run(a, '--no-git', '--no-questions');
  check('mesma versão: 2ª passada não reescreve o registro', read() === before && !/ferramentas\.md: marvin/.test(again.stdout));
  check('mesma versão: o hook cala', !/base montada com marvin/.test(run(a, '--status', '--curto').stdout));
  fs.writeFileSync(rec, read().replace(/^marvin: .+$/m, 'marvin: 0.0.1'));
  check('base atrás: o hook avisa em uma linha', /base montada com marvin[^\n]*última passada 0\.0\.1/.test(run(a, '--status', '--curto').stdout));
  const up = run(a, '--no-git', '--no-questions').stdout;
  check('base atrás: a passada avança o carimbo e diz de onde', /marvin 0\.0\.1 → /.test(up) && new RegExp('^marvin: ' + version + '$', 'm').test(read()));
  check('marvin_montado nunca é reescrito', new RegExp('^marvin_montado: ' + version + '$', 'm').test(read()));
  cleanup(a);
}

// ── 9. Copilot adapter — path checked against the official docs
{
  const a = arena('copilot');
  run(a, '--no-git', '--tools=claude,copilot');
  const p = path.join(a.proj, '.github', 'copilot-instructions.md');
  check('gera .github/copilot-instructions.md', fs.existsSync(p));
  check('o adaptador aponta para o AGENTS.md',
        fs.existsSync(p) && /AGENTS\.md/.test(fs.readFileSync(p, 'utf8')));
  cleanup(a);
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
  const total = passed + failed + skipped + 2;
  const targets = [['README.md', /([0-9]+) checks, no dependencies/],
                 ['README.pt-BR.md', /([0-9]+) verificações, zero dependência/]];
  for (const [file, re] of targets) {
    let m = null;
    try { m = fs.readFileSync(path.join(HERE, file), 'utf8').match(re); } catch {}
    check(file + ' afirma o número real de verificações',
          m !== null && Number(m[1]) === total,
          'diz ' + (m ? m[1] : '(não achou a frase)') + ', são ' + total);
  }
}
// ═══════════════════════════════════════════════════════════════════════
console.log('\n' + (failed === 0
  ? green(`${passed} passaram`)
  : red(`${failed} falharam`) + `, ${passed} passaram`) + '\n');
process.exit(failed === 0 ? 0 : 1);
