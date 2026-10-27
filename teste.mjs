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
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync, spawn } from 'node:child_process';

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

// US-38: with graphify on PATH marvin records `sim` and builds the graph. CI has none, so by
// default every case runs with a fake `graphify` that fails at the head of PATH (the key is
// `Path` on Windows — a second `PATH` would duplicate the variable). `arena.real = true` opts out.
const PATH_KEY = Object.keys(process.env).find(k => k.toUpperCase() === 'PATH') || 'PATH';
function fakeGraphify(dir, code) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'graphify'), '#!/bin/sh\nexit ' + code + '\n', { mode: 0o755 });
  fs.writeFileSync(path.join(dir, 'graphify.cmd'), '@exit /b ' + code + '\r\n');
  // US-59: graphify, ponytail and ecc install themselves without a flag. Every case therefore also gets
  // `claude` and `uv` that FAIL at the head of PATH — a test must never reach the real ones.
  for (const bin of ['claude', 'uv']) {
    fs.writeFileSync(path.join(dir, bin), '#!/bin/sh\nexit 1\n', { mode: 0o755 });
    fs.writeFileSync(path.join(dir, bin + '.cmd'), '@exit /b 1\r\n');
  }
  return dir;
}
const NO_GRAPHIFY = fakeGraphify(fs.mkdtempSync(path.join(os.tmpdir(), 'marvin-teste-sem-graphify-')), 1);
// `arena.real` keeps the REAL graphify on PATH but must still never reach the real `claude`/`uv`.
const NO_INSTALL = fs.mkdtempSync(path.join(os.tmpdir(), 'marvin-teste-sem-install-'));
for (const bin of ['claude', 'uv']) {
  fs.writeFileSync(path.join(NO_INSTALL, bin), '#!/bin/sh\nexit 1\n', { mode: 0o755 });
  fs.writeFileSync(path.join(NO_INSTALL, bin + '.cmd'), '@exit /b 1\r\n');
}
process.on('exit', () => { for (const d of [NO_GRAPHIFY, NO_INSTALL]) try { fs.rmSync(d, { recursive: true, force: true }); } catch {} });
const pathWith = (dir) => ({ [PATH_KEY]: dir + path.delimiter + process.env[PATH_KEY] });
// Git config from outside the arena (system, XDG, global override) must not change a test's core.hooksPath.
const hermeticEnv = () => { const e = { ...process.env, GIT_CONFIG_NOSYSTEM: '1' }; delete e.XDG_CONFIG_HOME; delete e.GIT_CONFIG_GLOBAL; return e; };

/** Runs marvin with HOME/USERPROFILE redirected. */
function run({ proj: proj, lar: home, real, bin }, ...flags) {
  return spawnSync(process.execPath, [SCRIPT, ...flags], {
    cwd: proj,
    encoding: 'utf8',
    env: { ...hermeticEnv(), HOME: home, USERPROFILE: home, ...pathWith(bin || (real ? NO_INSTALL : NO_GRAPHIFY)) },
  });
}

/** US-59: a machine that already has the mandatory tools (graphify on PATH, ponytail at user scope, ECC catalog),
 *  so a run has nothing to install. `fill` adds files to the fake ECC catalog (agents/<id>.md, skills/<id>/SKILL.md). */
function equipped(x, fill = {}) {
  const plug = path.join(x.lar, '.claude', 'plugins');
  fs.mkdirSync(path.join(plug, 'marketplaces', 'ecc', 'agents'), { recursive: true });
  fs.writeFileSync(path.join(plug, 'installed_plugins.json'), '{"plugins":{"ponytail@ponytail":[{"scope":"user"}]}}\n');
  fs.writeFileSync(path.join(x.lar, '.claude', '.ponytail-active'), 'full\n');
  for (const [rel, txt] of Object.entries(fill)) {
    const p = path.join(plug, 'marketplaces', 'ecc', rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, txt);
  }
  x.bin = fakeGraphify(path.join(x.base, 'bin'), 0);
  return x;
}

// Exercise real readline with a TTY marker and prompt-driven pipe input. No mocked
// answers API: a missing/repeated prompt or a hung question times out and fails.
function runInteractive({ proj, lar }, answers, ...flags) {
  return new Promise(resolve => {
    const driver = 'process.argv.splice(1, 0, ' + JSON.stringify(SCRIPT) + '); process.stdin.isTTY = true; await import('
      + JSON.stringify(pathToFileURL(SCRIPT).href) + ');';
    const child = spawn(process.execPath, ['--input-type=module', '--eval', driver, '--', ...flags], {
      cwd: proj, env: { ...hermeticEnv(), HOME: lar, USERPROFILE: lar, ...pathWith(NO_GRAPHIFY) },
    });
    let stdout = '', stderr = '', pending = '', index = 0;
    const timer = setTimeout(() => child.kill(), 30000);
    child.stdout.on('data', bytes => {
      const text = bytes.toString(); stdout += text; pending += text;
      while (index < answers.length && pending.includes(answers[index][0])) {
        const [prompt, answer] = answers[index++];
        pending = pending.slice(pending.indexOf(prompt) + prompt.length);
        if (answer === null) child.stdin.end();
        else child.stdin.write(answer + '\n');
      }
    });
    child.stderr.on('data', bytes => { stderr += bytes; });
    child.on('error', e => { clearTimeout(timer); resolve({ status: null, stdout, stderr: e.message }); });
    child.on('close', status => { clearTimeout(timer); resolve({ status, stdout, stderr }); });
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
  const a = equipped(arena('planolimpo'));
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
  run(a, '--no-git');
  // US-59: graphify is mandatory, so the mention only shows for whoever wrote `não` on purpose.
  const recG = path.join(a.proj, '.marvin', 'ferramentas.md');
  fs.writeFileSync(recG, fs.readFileSync(recG, 'utf8').replace(/^\| graphify \| sim \|/m, '| graphify | não |'));
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
  check('US-59: sem TTY o registro nasce com `sim` (obrigatório), sem perguntar',
        fs.existsSync(rec) && /^\| graphify \| sim \|/m.test(fs.readFileSync(rec, 'utf8'))
        && /graphify not found — recording `sim` \(mandatory\)/.test(r.stdout), r.stdout.slice(-400));
  // US-59/US-38: graphify missing and the install failing (here a failing fake `uv`) → exit 0, warning, never an abort.
  check('US-59: sem graphify no PATH, o `uv` falhando: exit 0, aviso do install e aviso forte de como instalar',
        r.status === 0 && /graphify: `uv tool install graphifyy` failed/.test(r.stdout) && /graphify NOT found on PATH/.test(r.stdout) && /uv tool install graphifyy/.test(r.stdout), r.stdout.slice(-500));
  // The owner's explicit `não` is respected (invariant 2), with a warning that the default is mandatory.
  fs.writeFileSync(rec, fs.readFileSync(rec, 'utf8').replace(/^\| graphify \| sim \|/m, '| graphify | não |'));
  const before = fs.readFileSync(rec, 'utf8');
  const rNao = run(a, '--no-git');
  check('US-59: `não` explícito é respeitado, com aviso de que o padrão é obrigatório',
        fs.readFileSync(rec, 'utf8') === before && /graphify is `não`[^\n]*MANDATORY/.test(rNao.stdout) && !/graphify: `uv/.test(rNao.stdout), rNao.stdout.slice(-500));
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
  // US-31: two --use in one run must both land (the second read a stale record and lost the first).
  for (const arg of ['--use=graphify --use=ponytail', '--use=graphify,ponytail']) {
    const c = arena('registro-use-duplo');
    run(c, '--no-git');
    const recC = path.join(c.proj, '.marvin', 'ferramentas.md');
    fs.writeFileSync(recC, fs.readFileSync(recC, 'utf8').replace(/^\| (graphify|ponytail) \| sim \|/mg, '| $1 | não |'));
    run(c, '--no-git', ...arg.split(' '));
    const t = fs.readFileSync(recC, 'utf8');
    check('`' + arg + '` grava as duas linhas com `sim`', /^\| graphify \| sim \|/m.test(t) && /^\| ponytail \| sim \|/m.test(t), t.slice(-400));
    cleanup(c);
  }
}

// ── 9e2. ponytail: installed ≠ active, and absent does not fail silently (US-11b)
// The plugin lives in HOME (~/.claude/plugins/installed_plugins.json, ~/.claude/.ponytail-active),
// and HOME here is the arena's `lar` — so the test plants both files and does not depend
// on the machine. Without a TTY it never asks: what is checked is the state MESSAGE and the record.
{
  const a = arena('ponytail');
  const r0 = run(a, '--no-git');
  check('US-59: ponytail ausente registra `não` (opcional), não tenta instalar e sai 0',
        /^\| ponytail \| não \|/m.test(fs.readFileSync(path.join(a.proj, '.marvin', 'ferramentas.md'), 'utf8'))
        && !/DietrichGebert/.test(r0.stdout) && r0.status === 0, r0.stdout.slice(-600));
  check('US-59: ponytail opcional: sem --use, AGENTS.md não ganha a seção e agents/README não ganha a tabela',
        !/ponytail/i.test(fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8'))
        && !/Ponytail: em que papel entra/.test(fs.readFileSync(path.join(a.proj, '.claude', 'agents', 'README.md'), 'utf8')));
  cleanup(a);

  const b = arena('ponytail-inst');
  const cl = path.join(b.lar, '.claude', 'plugins'); fs.mkdirSync(cl, { recursive: true });
  fs.writeFileSync(path.join(cl, 'installed_plugins.json'), '{"version":2,"plugins":{"ponytail@ponytail":[{"scope":"user"}]}}');
  const r1 = run(b, '--no-git');
  check('instalado sem .ponytail-active avisa "NOT active"', /ponytail is installed but NOT active/.test(r1.stdout), r1.stdout.slice(-400));
  cleanup(b);

  const c = arena('ponytail-ativo');
  const cl2 = path.join(c.lar, '.claude', 'plugins'); fs.mkdirSync(cl2, { recursive: true });
  fs.writeFileSync(path.join(cl2, 'installed_plugins.json'), '{"plugins":{"ponytail@ponytail":[{"scope":"user"}]}}');
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

  // US-67: enabledPlugins in the settings files disables an installed plugin. Precedence: local > project > user.
  // The project's .claude/settings.json is planted BEFORE the run: marvin never overwrites an existing one.
  const plant = (name, userCfg, projFile, projCfg) => {
    const x = arena(name);
    const dir = path.join(x.lar, '.claude', 'plugins'); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'installed_plugins.json'), '{"plugins":{"ponytail@ponytail":[{"scope":"user"}]}}');
    fs.writeFileSync(path.join(x.lar, '.claude', '.ponytail-active'), 'full\n');
    if (userCfg !== null) fs.writeFileSync(path.join(x.lar, '.claude', 'settings.json'), userCfg);
    if (projFile) {
      fs.mkdirSync(path.join(x.proj, '.claude'), { recursive: true });
      fs.writeFileSync(path.join(x.proj, '.claude', projFile), projCfg);
    }
    return x;
  };
  const OFF = '{"enabledPlugins":{"ponytail@ponytail":false}}';
  const ON = '{"enabledPlugins":{"ponytail@ponytail":true}}';

  const d1 = plant('ponytail-desligado', OFF, null);
  const s1 = run(d1, '--no-git');
  check('US-67: enabledPlugins false no usuário: "installed but DISABLED", cita o arquivo, sem "loads in every project"',
        /installed but DISABLED/.test(s1.stdout) && /enabledPlugins in/.test(s1.stdout)
        && !/loads in every project/.test(s1.stdout) && !/run \/ponytail/.test(s1.stdout), s1.stdout.slice(-500));
  cleanup(d1);

  const d2 = plant('ponytail-local-vence', OFF, 'settings.local.json', ON);
  const s2 = run(d2, '--no-git');
  check('US-67: settings.local.json do projeto com true vence o false do usuário (não diz DISABLED)',
        !/DISABLED/.test(s2.stdout) && s2.status === 0, s2.stdout.slice(-500));
  cleanup(d2);

  const d3 = plant('ponytail-projeto-vence', OFF, 'settings.json', ON);
  const s3 = run(d3, '--no-git');
  check('US-67: settings.json do projeto com true vence o false do usuário (não diz DISABLED)',
        !/DISABLED/.test(s3.stdout) && s3.status === 0, s3.stdout.slice(-500));
  cleanup(d3);

  const d4 = plant('ponytail-json-ruim', '{ not json', null);
  const s4 = run(d4, '--no-git');
  check('US-67: settings.json do usuário com JSON inválido não quebra (exit 0) e não diz DISABLED',
        s4.status === 0 && !/DISABLED/.test(s4.stdout), s4.stdout.slice(-500));
  cleanup(d4);

  // US-67: project already has the record `sim` → the 2nd run must still warn DISABLED.
  const d5 = plant('ponytail-desligado-registrado', ON, null);
  run(d5, '--no-git', '--use=ponytail');
  fs.writeFileSync(path.join(d5.lar, '.claude', 'settings.json'), OFF);
  const s5 = run(d5, '--no-git');
  check('US-67: registro já `sim` + false no usuário: a 2ª rodada avisa DISABLED',
        /\| ponytail \| sim \|/.test(fs.readFileSync(path.join(d5.proj, '.marvin', 'ferramentas.md'), 'utf8'))
        && /ponytail installed but DISABLED/.test(s5.stdout), s5.stdout.slice(-500));
  cleanup(d5);

  // US-67: local false beats project true.
  const d6 = plant('ponytail-local-false', ON, 'settings.local.json', OFF);
  fs.writeFileSync(path.join(d6.proj, '.claude', 'settings.json'), ON);
  const s6 = run(d6, '--no-git');
  check('US-67: settings.local.json false vence settings.json true: DISABLED citando o local',
        /installed but DISABLED \(enabledPlugins in \.claude\/settings\.local\.json\)/.test(s6.stdout), s6.stdout.slice(-500));
  cleanup(d6);
}

// ── 9e3. Playwright adapter (US-34), one warning for two tools (US-32), Makefile target (US-35)
// KNOWN GAP: the TTY branch `y → sim` of Playwright is not tested — it is the same generic loop
// graphify and ponytail already go through; 9e covers it for them with no TTY here either.
// The trigger is the project (a web front in a package.json), not the machine: outside a web
// front the record gets no line and the output no word about it.
{
  const withDeps = (name, pkg, extra) => {
    const x = arena(name);
    fs.writeFileSync(path.join(x.proj, 'package.json'), JSON.stringify(pkg));
    if (extra) extra(x);
    return x;
  };
  const recOf = (x) => path.join(x.proj, '.marvin', 'ferramentas.md');
  const agentsOf = (x) => fs.readFileSync(path.join(x.proj, 'AGENTS.md'), 'utf8');

  const a = withDeps('pw-react', { dependencies: { react: '18' } });
  const r1 = run(a, '--no-git');
  check('US-34: front web sem TTY registra `não` e avisa com o comando',
        /^\| playwright \| não \|/m.test(fs.readFileSync(recOf(a), 'utf8'))
        && /playwright is suggested \(web front in package\.json\)[^\n]*no interactive terminal[^\n]*--use=[a-z,]*playwright/.test(r1.stdout), r1.stdout.slice(-500));
  check('US-34: registrado `não`, o AGENTS.md não ganha a regra', !/Playwright/.test(agentsOf(a)));
  const before = fs.readFileSync(recOf(a), 'utf8');
  run(a, '--no-git');
  check('US-34: segundo run deixa o registro igual', fs.readFileSync(recOf(a), 'utf8') === before);
  const r4 = run(a, '--no-git', '--use=playwright');
  check('US-34: base antiga + --use=playwright: o passo 10 acusa a seção faltando (desde 2.4.0)',
        /AGENTS\.md — missing the "Ferramentas" section on Playwright[^\n]*\(desde 2\.4\.0\)/.test(r4.stdout), r4.stdout.slice(-500));
  cleanup(a);

  const b = withDeps('pw-use', { dependencies: { react: '18' } });
  run(b, '--no-git', '--use=playwright', '--dry-run');
  check('US-34: --use=playwright --dry-run não cria o registro', !fs.existsSync(recOf(b)));
  run(b, '--no-git', '--use=playwright');
  check('US-34: --use=playwright grava `sim` com o alcance web/PWA',
        /^\| playwright \| sim \| .*web\/PWA/m.test(fs.readFileSync(recOf(b), 'utf8')));
  check('US-34: o AGENTS.md ganha a regra (selo baixa, só fecha com evidência, mobile nativo fora)',
        /## Ferramentas[\s\S]*\*\*Playwright CLI\*\*[\s\S]*confiança \*\*baixa\*\*[\s\S]*só\s+fecha\s+com\s+evidência[\s\S]*mobile\s+nativo/.test(agentsOf(b)));
  cleanup(b);

  const c = arena('pw-sem-front');
  const rc = run(c, '--no-git');
  check('US-34: sem front web, nada de playwright no registro, no AGENTS.md nem na saída',
        !/playwright/i.test(fs.readFileSync(recOf(c), 'utf8')) && !/playwright/i.test(agentsOf(c)) && !/playwright/i.test(rc.stdout), rc.stdout.slice(-400));
  cleanup(c);

  const d = withDeps('pw-nativo', { dependencies: { react: '18', 'react-native': '0.74' } });
  run(d, '--no-git');
  check('US-34: React Native sem react-dom é app nativo — nenhuma linha playwright',
        !/playwright/i.test(fs.readFileSync(recOf(d), 'utf8')));
  cleanup(d);

  const e = arena('pw-subrepo');
  fs.mkdirSync(path.join(e.proj, 'repos', 'web'), { recursive: true });
  fs.writeFileSync(path.join(e.proj, 'repos', 'web', 'package.json'), '{"dependencies":{"react":"18"}}');
  run(e, '--no-git');
  check('US-34: front só no sub-repo (repos/web) também oferece o playwright',
        /^\| playwright \| não \|/m.test(fs.readFileSync(recOf(e), 'utf8')));
  cleanup(e);

  // A new row goes inside the table, not at EOF after the project's own sections (14/10/2026).
  const s = arena('pw-secao');
  run(s, '--no-git');
  fs.appendFileSync(recOf(s), '\n## Painel do projeto\n\ntexto do projeto\n');
  run(s, '--no-git', '--use=playwright');
  const sAfter = fs.readFileSync(recOf(s), 'utf8');
  run(s, '--no-git', '--use=playwright');
  check('linha nova entra na tabela, antes da seção do projeto; 2º run não muda nada',
        /^\| ponytail \|[^\n]*\n\| ecc \|[^\n]*\n\| playwright \| sim \|[^\n]*\n\n## Painel do projeto\n\ntexto do projeto\n$/m.test(sAfter)
        && fs.readFileSync(recOf(s), 'utf8') === sAfter, sAfter.slice(-600));
  cleanup(s);

  // US-38: graphify on PATH is recorded as `sim` WITHOUT asking (no TTY here), ponytail still
  // defers to `não` with its warning. Hermetic: a fake `graphify` that succeeds at the head of PATH
  // and the ponytail planted in the arena's home. (Two tools deferring at once, the old US-32
  // "Flip them" line, cannot happen now that graphify never defers: that branch has no test.)
  const f = arena('juntos');
  fs.mkdirSync(path.join(f.lar, '.claude', 'plugins'), { recursive: true });
  fs.writeFileSync(path.join(f.lar, '.claude', 'plugins', 'installed_plugins.json'), '{"plugins":{"ponytail@ponytail":[{"scope":"user"}]}}');
  fs.writeFileSync(path.join(f.lar, '.claude', '.ponytail-active'), 'full\n');
  const bin = fakeGraphify(path.join(f.base, 'bin'), 0);
  const rf = spawnSync(process.execPath, [SCRIPT, '--no-git'], {
    cwd: f.proj, encoding: 'utf8',
    env: { ...hermeticEnv(), HOME: f.lar, USERPROFILE: f.lar, ...pathWith(bin) },
  });
  const recF = fs.readFileSync(recOf(f), 'utf8');
  check('US-38: graphify no PATH e sem TTY grava `sim` sem perguntar; ponytail instalado sem terminal grava `não` e avisa --use=ponytail (opcional)',
        /^\| graphify \| sim \|/m.test(recF) && /^\| ponytail \| não \|/m.test(recF) && /--use=ponytail/.test(rf.stdout) && rf.status === 0, rf.stdout.slice(-500));
  check('US-38: com graphify no PATH não há aviso de falta', !/graphify NOT found/.test(rf.stdout), rf.stdout.slice(-500));
  // an explicit `não` from the human survives graphify being on PATH (invariant 2)
  fs.writeFileSync(recOf(f), recF.replace(/^\| graphify \| sim \|/m, '| graphify | não |'));
  const noBefore = fs.readFileSync(recOf(f), 'utf8');
  spawnSync(process.execPath, [SCRIPT, '--no-git'], {
    cwd: f.proj, encoding: 'utf8',
    env: { ...hermeticEnv(), HOME: f.lar, USERPROFILE: f.lar, ...pathWith(bin) },
  });
  check('US-38: `não` gravado pelo humano não é sobrescrito com graphify no PATH', fs.readFileSync(recOf(f), 'utf8') === noBefore);
  cleanup(f);


  // US-35: `tests:` is not the `test` target; `test :` is.
  const mk = (name, text) => {
    const x = arena(name); fs.writeFileSync(path.join(x.proj, 'Makefile'), text); run(x, '--no-git'); return x;
  };
  const m1 = mk('mk-tests', 'tests:\n\techo x\n');
  check('US-35: Makefile só com `tests:` não vira `make test`', !/make test/.test(agentsOf(m1)));
  cleanup(m1);
  const m2 = mk('mk-espaco', 'test :\n\techo x\n');
  check('US-35: Makefile com `test :` vira `make test`', /make test/.test(agentsOf(m2)));
  cleanup(m2);
  // `build := ./out` is a variable (:=), not a target.
  const m3 = mk('mk-var', 'build := ./out\n');
  check('US-35: variável `build := …` não vira `make build`', !/make build/.test(agentsOf(m3)));
  cleanup(m3);
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

    // 23a: the repos live under a parent folder (`repos/<x>`), two levels down.
    const n = arena('monorepo-aninhado'); n.real = true;
    spawnSync('git', ['init', '-q', '.'], { cwd: n.proj });
    for (const r of ['svc-a', 'svc-b']) {
      const dir = path.join(n.proj, 'repos', r, 'src');
      fs.mkdirSync(dir, { recursive: true });
      spawnSync('git', ['init', '-q', '.'], { cwd: path.join(n.proj, 'repos', r) });
      fs.writeFileSync(path.join(dir, r + '.ts'), 'export function f_' + r.replace('-', '_') + '() { return 1 }\n');
    }
    fs.writeFileSync(path.join(n.proj, '.gitignore'), 'repos/\n');
    run(n, '--no-git', '--graphify');
    const nt = fs.existsSync(path.join(n.proj, 'CLAUDE.md')) ? fs.readFileSync(path.join(n.proj, 'CLAUDE.md'), 'utf8') : '';
    check('sub-repos aninhados em repos/<x> são detectados e nomeados', /repos\/svc-a/.test(nt) && /repos\/svc-b/.test(nt));
    check('o CLAUDE.md aninhado desaconselha o `graphify update .`', /Não rode/.test(nt));
    // Real extraction needs the binary (CI does not have it) — same skip as 9f.
    if (spawnSync('graphify', ['--version'], { encoding: 'utf8', shell: true }).status !== 0) {
      console.log('  - 9e (grafo aninhado) pulado: graphify ausente no PATH (3 checks)'); skipped += 3;
    } else {
      fs.mkdirSync(path.join(n.proj, '.agents', 'x'), { recursive: true });
      fs.writeFileSync(path.join(n.proj, '.agents', 'x', 'espelho.py'), 'def espelho_unico(): return 1\n');
      fs.rmSync(path.join(n.proj, 'graphify-out'), { recursive: true, force: true });
      run(n, '--no-git', '--graphify');
      let nodes = [];
      try { nodes = JSON.parse(fs.readFileSync(path.join(n.proj, 'graphify-out', 'graph.json'), 'utf8')).nodes || []; } catch {}
      const has = (s) => nodes.filter(x => JSON.stringify(x).includes(s)).length;
      check('o grafo tem nós dos DOIS sub-repos aninhados', has('svc_a') > 0 && has('svc_b') > 0);
      check('.agents/ fica fora da extração', has('espelho_unico') === 0);
      check('.graphifyignore é criado', fs.existsSync(path.join(n.proj, '.graphifyignore')));
    }
    cleanup(n);
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
    const a = arena('githook'); a.real = true;
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
  check('função que não existe vira AVISO, não nó fantasma', /`sumiu` is not a node in `src\/pag\.js`/.test(r.stdout) && !g.nodes.some(n => n.id === 'src_pag_sumiu'));
  check('função que não existe NÃO derruba o arquivo da US', has(usId, 'src_pag', 'touches'), JSON.stringify(edges.filter(e => e._origin === 'marvin').map(e => e.source + '>' + e.target)));
  check('exemplo dentro de bloco de código não vira aresta', !edges.some(e => e.target === 'src_checkout_pagamento_calcularestorno'));
  const before = edges.filter(e => e._origin === 'marvin').length;
  run(a, '--no-git', '--graphify');
  const g2 = JSON.parse(fs.readFileSync(path.join(output, 'graph.json'), 'utf8'));
  check('rodar de novo não duplica o lado dos docs', (g2.edges || g2.links).filter(e => e._origin === 'marvin').length === before);
  cleanup(a);
}

// ── 9q-c. US-66: graphify 0.9.37 indexes .md itself and its doc file node has the SAME id
//      marvin generates. The merge only removed `_origin === 'marvin'`, so ids came out duplicated.
{
  const a = arena('docgrafo-colisao');
  run(a, '--no-git');
  const relUs = '.marvin/Planejamento/Novos/E1/F1/US-1/Sobre.md';
  const us = path.join(a.proj, ...relUs.split('/').slice(0, -1));
  fs.mkdirSync(us, { recursive: true });
  fs.writeFileSync(path.join(us, 'Sobre.md'), ['---', 'tipo: us', 'estado: ativa', '---', '# US-1 — colisão', ''].join(NLQ));
  // same id formula as `idOf` in marvin.mjs (docsGraph)
  const idOf = (rel) => rel.replace(/\\/g, '/').replace(/\.[^./]+$/, '')
    .replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
  const usId = idOf(relUs);
  const output = path.join(a.proj, 'graphify-out');
  fs.mkdirSync(output, { recursive: true });
  const graph = { directed: true, nodes: [
    { id: usId, label: 'Sobre.md', file_type: 'document', source_file: relUs, _origin: 'ast' },
    { id: usId + '_secao', label: 'US-1 — colisão', file_type: 'document', source_file: relUs, _origin: 'ast' }],
    edges: [{ source: usId, target: usId + '_secao', relation: 'contains', _origin: 'ast' }] };
  fs.writeFileSync(path.join(output, 'graph.json'), JSON.stringify(graph));
  const read = () => JSON.parse(fs.readFileSync(path.join(output, 'graph.json'), 'utf8'));
  const dups = (g) => { const seen = new Set(); return g.nodes.map(n => n.id).filter(id => seen.has(id) || !seen.add(id)); };

  run(a, '--no-git', '--graphify');
  const g1 = read();
  const mine = g1.nodes.filter(n => n.id === usId);
  check('US-66: nó do doc que o graphify já indexou não duplica o id', dups(g1).length === 0, 'duplicados: ' + dups(g1).join(', '));
  check('US-66: o nó do doc fica com _origin marvin e o tipo do frontmatter',
        mine.length === 1 && mine[0]._origin === 'marvin' && mine[0].tipo === 'us', JSON.stringify(mine));
  check('US-66: o nó de seção do graphify continua no grafo', g1.nodes.some(n => n.id === usId + '_secao'));

  run(a, '--no-git', '--graphify');
  const g2 = read();
  check('US-66: 2ª rodada deixa os nós idênticos (mesma contagem, ids únicos)',
        g2.nodes.length === g1.nodes.length && dups(g2).length === 0 &&
        JSON.stringify(g2.nodes.map(n => n.id).sort()) === JSON.stringify(g1.nodes.map(n => n.id).sort()),
        g1.nodes.length + ' -> ' + g2.nodes.length);

  // already-duplicated graph (left by the old merge) with the marvin nodes up to date: must be cleaned ON DISK
  const gp = path.join(output, 'graph.json');
  const g3 = read();
  g3.nodes.push({ id: usId, label: 'Sobre.md', file_type: 'document', source_file: relUs, _origin: 'ast' });
  fs.writeFileSync(gp, JSON.stringify(g3));
  const dirty = fs.readFileSync(gp, 'utf8');
  run(a, '--no-git', '--graphify');
  const clean = fs.readFileSync(gp, 'utf8');
  check('US-66: grafo já duplicado e docs em dia: a rodada seguinte limpa e escreve', dups(read()).length === 0 && clean !== dirty, 'dups: ' + dups(read()).join(', '));
  run(a, '--no-git', '--graphify');
  check('US-66: 3ª rodada não reescreve o grafo', fs.readFileSync(gp, 'utf8') === clean);
  check('US-66: a limpeza mantém o nó marvin e o de seção', read().nodes.filter(n => n.id === usId && n._origin === 'marvin').length === 1 && read().nodes.some(n => n.id === usId + '_secao'));

  // --status: every doc node is `ast` but marvin edges exist -> the doc side was never merged
  const alien = { directed: true, nodes: [
    { id: usId, label: 'Sobre.md', file_type: 'document', source_file: relUs, _origin: 'ast' },
    { id: 'src_x', label: 'x.js', file_type: 'code', source_file: 'src/x.js', _origin: 'ast' }],
    edges: [{ source: usId, target: 'src_x', relation: 'touches', _origin: 'marvin' }] };
  fs.writeFileSync(path.join(output, 'graph.json'), JSON.stringify(alien));
  const st = run(a, '--status').stdout.replace(/\x1b\[[0-9;]*m/g, '');
  check('US-66: --status avisa quando os nós-doc são todos do graphify e há arestas do marvin',
        /marvin --graphify/.test(st), st.slice(-400));
  cleanup(a);
}

// ── 9q-b. US-23b: "Código tocado" in a parent folder with repos/<x>. Needs git (sub-repo
//      detection) but not graphify: the graph.json is synthetic, ids as merge-graphs writes them.
{
  const hasGit = spawnSync('git', ['--version'], { encoding: 'utf8' }).status === 0;
  if (!hasGit) { console.log('  - 9q-b pulado: git ausente (7 checks)'); skipped += 7; }
  else {
    const a = arena('docgrafo-aninhado');
    spawnSync('git', ['init', '-q', '.'], { cwd: a.proj });
    fs.writeFileSync(path.join(a.proj, '.gitignore'), 'repos/\n');
    for (const [r, files] of [['svc-a', ['a.js', 'dup.js']], ['svc-b', ['b.js', 'dup.js']]]) {
      const dir = path.join(a.proj, 'repos', r);
      fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
      spawnSync('git', ['init', '-q', '.'], { cwd: dir });
      for (const f of files) fs.writeFileSync(path.join(dir, 'src', f), 'export const x = 1' + NLQ);
    }
    run(a, '--no-git');
    const feat = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E1', 'F1');
    fs.mkdirSync(feat, { recursive: true });
    fs.writeFileSync(path.join(feat, 'Sobre.md'), '---' + NLQ + 'tipo: feature' + NLQ + '---' + NLQ + '# F1' + NLQ);
    const mkUs = (n, est, lines) => {
      const d = path.join(feat, 'US-' + n); fs.mkdirSync(d, { recursive: true });
      fs.writeFileSync(path.join(d, 'Sobre.md'), ['---', 'tipo: us', 'estado: ' + est, 'pai: ../Sobre.md', '---', '# US-' + n + ' — teste',
        '## Código tocado', ...lines, '', '## Rumo', '- **07/10/2026** — teste', ''].join(NLQ));
    };
    mkUs(1, 'refinada', ['- `repos/svc-a/src/a.js`', '- `src/b.js`', '- `src/dup.js`', '- `src/nada.js`']);
    mkUs(2, 'refinada', ['- `repos/svc-b/src/b.js`']);
    const output = path.join(a.proj, 'graphify-out'); fs.mkdirSync(output, { recursive: true });
    const code = (repo, local, file) => ({ id: repo + '::' + local, repo, local_id: local, label: file, file_type: 'code', source_file: file, _origin: 'ast' });
    fs.writeFileSync(path.join(output, 'graph.json'), JSON.stringify({ directed: true, edges: [], nodes: [
      code('repos__svc-a', 'src_a', 'src/a.js'), code('repos__svc-b', 'src_b', 'src/b.js'),
      code('repos__svc-a', 'src_dup', 'src/dup.js'), code('repos__svc-b', 'src_dup', 'src/dup.js')] }));
    const r = run(a, '--no-git', '--graphify');
    const g = JSON.parse(fs.readFileSync(path.join(output, 'graph.json'), 'utf8'));
    const touched = new Set((g.edges || g.links || []).filter(e => e.relation === 'touches' && /us_1_sobre$/.test(e.source)).map(e => e.target));
    check('caminho COM prefixo resolve para o nó do sub-repo', touched.has('repos__svc-a::src_a'), [...touched].join(','));
    check('caminho SEM prefixo, achado em um só repo, liga', touched.has('repos__svc-b::src_b'), [...touched].join(','));
    check('caminho em dois repos é ambíguo: avisa e não liga a nenhum', /`src\/dup\.js` is ambiguous/.test(r.stdout) && ![...touched].some(t => /src_dup/.test(t)));
    check('caminho que não existe em nenhum cai no aviso de sempre', /`src\/nada\.js` does not exist/.test(r.stdout));
    const st = run(a, '--status').stdout.replace(/\x1b\[[0-9;]*m/g, '');
    const ilhas = st.slice(st.indexOf('Ilhas'));
    check('--status: o mesmo arquivo, com e sem prefixo, é uma ilha só', /[▹▶] \S+\s+2 US:.*US-1.*US-2/.test(ilhas), ilhas.slice(0, 400));
    const ru = run(a, '--us', 'Novos/E1/F1/US-1'); 
    const imp = fs.readFileSync(path.join(feat, 'US-1', 'Sobre.md'), 'utf8');
    check('--us: o Impacto enxerga os nós dos sub-repos (2 resolvidos)', /Toca 2 nó\(s\) de código/.test(imp), imp.slice(imp.indexOf('## Impacto')).slice(0, 300));
    check('o sub-repo não ganha arquivo novo do marvin', !fs.existsSync(path.join(a.proj, 'repos', 'svc-a', 'graphify-out')));
    cleanup(a);
  }
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

  { const a = arena('us83'); run(a, '--no-git');
  // US-83: the path the note and --status show works too. `../Planejamento/…` is the note's own form (relative to
  // .marvin/Memoria/); the script cuts up to `Planejamento/`, so the cwd does not matter and the test does not need one.
  const PL = path.join(a.proj, '.marvin', 'Planejamento');
  const tree = (d) => { const o = []; (function w(x) { for (const e of fs.readdirSync(x, { withFileTypes: true })) { const p = path.join(x, e.name); o.push(path.relative(d, p)); if (e.isDirectory()) w(p); } })(d); return o.sort().join('|'); };
  const ref = 'Novos/E83/F83/US-83x';
  const forms = [ref, '.marvin/Planejamento/' + ref + '/Sobre.md', path.join(PL, ...ref.split('/'), 'Sobre.md'), '../Planejamento/' + ref + '/Sobre.md',
                 '.marvin\\Planejamento\\' + ref.replace(/\//g, '\\') + '\\Sobre.md', path.join(PL, ...ref.split('/')) + path.sep];
  run(a, '--us', ref);
  const treeRef = tree(a.proj), noteRef = fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8');
  check('US-83: a US de referência nasceu no lugar certo', fs.existsSync(path.join(PL, 'Novos', 'E83', 'F83', 'US-83x', 'Sobre.md')));
  check('US-83: as formas do caminho (curta, .marvin/, absoluta, ../, com \\ e com / final) resolvem para a mesma US, sem pasta extra e sem ponteiro duplicado',
        forms.every(f => { const rr = run(a, '--us', f); return rr.status === 0 && tree(a.proj) === treeRef; }) && fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8') === noteRef);
  check('US-83: a forma --us=<caminho> também', run(a, '--us=.marvin/Planejamento/' + ref + '/Sobre.md').status === 0 && tree(a.proj) === treeRef);
  // a path form creates a NEW US in the right place (not under a duplicated chain)
  const rn = run(a, '--us', '.marvin/Planejamento/Novos/E83/F83/US-83n/Sobre.md');
  check('US-83: caminho com Sobre.md cria a US nova só no lugar certo', rn.status === 0 && fs.existsSync(path.join(PL, 'Novos', 'E83', 'F83', 'US-83n', 'Sobre.md')) && !fs.existsSync(path.join(PL, '.marvin')) && !fs.existsSync(path.join(PL, 'Planejamento')) && !fs.existsSync(path.join(a.proj, '.marvin', '.marvin')));
  const ra = run(a, '--us', '.marvin/Planejamento/Novos/E83/F83/US-83a/Sobre.md', '--anotada');
  check('US-83: com --anotada o caminho do Sobre.md cria a US anotada no lugar certo', ra.status === 0 && /estado: anotada/.test(fs.readFileSync(path.join(PL, 'Novos', 'E83', 'F83', 'US-83a', 'Sobre.md'), 'utf8')) && !fs.existsSync(path.join(PL, 'Planejamento')));
  const rr = run(a, '--us', '../Planejamento/Novos/E83/F83/US-83r/Sobre.md', '--refinada');
  check('US-83: com --refinada o caminho do Sobre.md cria a US refinada no lugar certo', rr.status === 0 && /estado: refinada/.test(fs.readFileSync(path.join(PL, 'Novos', 'E83', 'F83', 'US-83r', 'Sobre.md'), 'utf8')) && !fs.existsSync(path.join(PL, 'Planejamento')), rr.stdout.slice(-300) + rr.stderr.slice(-300));
  const t0 = tree(a.proj);
  const bad = [run(a, '--us', '/tmp/x/Novos/E/F/US-1/Sobre.md'), run(a, '--us', '.marvin/Memoria/Planejamento-x/Novos/E/F/US-1'), run(a, '--us', 'Outro/Planejamento/E/F/US-1/Sobre.md')];
  check('US-83: caminho fora de Planejamento/ recusa com código 2, mostra um exemplo e não cria nada', bad.every(b => b.status === 2 && /e\.g\. Novos\//.test(b.stdout + b.stderr)) && tree(a.proj) === t0);
  cleanup(a); }

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
  // US-61: the only thing marvin adds to someone else's settings.json is `model` (when absent); the rest stays.
  check('settings.json alheio: só ganha o `model`, o resto fica igual, e o bloco do hook é impresso',
        JSON.stringify(JSON.parse(fs.readFileSync(settings, 'utf8'))) === JSON.stringify({ ...JSON.parse(foreign), model: 'sonnet' }) && /not merged/.test(r.stdout) && /SessionStart/.test(r.stdout));
  check('o passo 10 cobra o hook que falta', /settings\.json — missing/.test(r.stdout));
  cleanup(a);
}

// ── 9w2. US-78: --status flags a document above the ceiling and a fragment nobody points to;
//      a small linked one triggers neither; --curto stays silent about both.
{
  const a = arena('teto-doc');
  run(a, '--no-git');
  const ctx = path.join(a.proj, '.marvin', 'Contexto');
  fs.mkdirSync(ctx, { recursive: true });
  fs.writeFileSync(path.join(ctx, 'indice.md'), '# Índice\n\n- [ligado](ligado.md)\n- [grande](grande.md)\n');
  fs.writeFileSync(path.join(ctx, 'ligado.md'), '# Ligado\n\npequeno e apontado.\n');
  fs.writeFileSync(path.join(ctx, 'grande.md'), '# Grande\n\n' + 'linha de texto\n'.repeat(320));
  fs.writeFileSync(path.join(ctx, 'solto.md'), '# Solto\n\nninguém aponta para mim.\n');
  fs.writeFileSync(path.join(ctx, 'filho.md'), '---\npai: indice.md\n---\n# Filho\n\ntem pai declarado.\n');
  const before = fs.readFileSync(path.join(ctx, 'solto.md'), 'utf8');
  const s = run(a, '--status').stdout.replace(/\x1b\[[0-9;]*m/g, '');
  check('--status acusa documento acima do teto, com o caminho e como quebrar', /Documentos grandes[\s\S]*Contexto\/grande\.md[\s\S]*índice curto/.test(s), s.slice(0, 600));
  check('--status acusa fragmento órfão com o caminho', /Fragmentos órfãos[\s\S]*Contexto\/solto\.md/.test(s), s.slice(0, 600));
  check('documento ligado e pequeno não dispara nenhum aviso', !/! \.marvin\/Contexto\/(ligado|filho|indice)\.md/.test(s), s.slice(0, 600));
  check('o --status do teto não escreve nada', fs.readFileSync(path.join(ctx, 'solto.md'), 'utf8') === before);
  const c = run(a, '--status', '--curto').stdout;
  check('--curto não fala de documento grande nem de órfão', !/Documentos grandes|Fragmentos órfãos|grande\.md|solto\.md/.test(c), c.slice(0, 300));
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
  check('HTML: tema claro e escuro por prefers-color-scheme, sem asset externo', html.includes(':root{color-scheme:light dark') && html.includes('@media(prefers-color-scheme:dark){:root:not([data-theme=light]){') && html.includes(':root[data-theme=dark]{') && html.includes('id="tema"') && !/<link(?![^>]*fonts\.(googleapis|gstatic)\.com)/.test(html) && !/@import/.test(html));   // US-76: Google Fonts is the one allowed exception
  // and with a real problem: a concluded US still in the note → enters Corrigir, with a link relative to the page
  run(a, '--us', 'Novos/P/F/US-01-x');
  const usX = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'P', 'F', 'US-01-x', 'Sobre.md');
  fs.writeFileSync(usX, fs.readFileSync(usX, 'utf8').replace('estado: ativa', 'estado: concluida'));
  run(a, '--status', '--html');
  const html2 = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  check('HTML: problema vira item de Corrigir, antes dos cards, com link para o Sobre.md', /class="corrigir"/.test(html2) && html2.indexOf('class="corrigir"') < html2.indexOf('<div class="cards">') && /href="\.\.\/Planejamento\/Novos\/P\/F\/US-01-x\/Sobre\.md"/.test(html2) && /still in the note/.test(html2));
  check('.marvin/.status/ entrou no .gitignore', /^\.marvin\/\.status\/$/m.test(fs.readFileSync(path.join(a.proj, '.gitignore'), 'utf8')));
  check('--status --html --dry-run não escreve', (() => { const before = lines().length; fs.rmSync(path.join(dir, 'index.html')); run(a, '--status', '--html', '--dry-run'); return !fs.existsSync(path.join(dir, 'index.html')) && lines().length === before; })());
  // US-36: Time column, open ❓ list and Decisões section — all derived, nothing new written
  const sobreOf = (id) => path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'P', 'F', id, 'Sobre.md');
  run(a, '--us', 'Novos/P/F/US-02-y');
  run(a, '--us', 'Novos/P/F/US-03-z');
  const s3 = sobreOf('US-03-z'); fs.writeFileSync(s3, fs.readFileSync(s3, 'utf8').replace('estado: ativa', 'estado: refinada') + NLQ + '- ❓ pergunta-refinada-w' + NLQ);
  const rowOf = (h, id) => (h.match(new RegExp('<tr class="ativa">(?:(?!</tr>)[\\s\\S])*' + id + '[\\s\\S]*?</tr>')) || [''])[0];
  run(a, '--status', '--html');
  const h3 = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  check('Time: o placeholder do template não vira papel (coluna vazia)', /<span class="dim">—<\/span><\/td><\/tr>$/.test(rowOf(h3, 'US-02-y')), rowOf(h3, 'US-02-y').slice(-200));
  const s2 = sobreOf('US-02-y');
  fs.writeFileSync(s2, fs.readFileSync(s2, 'utf8').replace(/^## Time\s*\n[^\n]*\n/m, () => '## Time' + NLQ + '- `dev-back`: o código' + NLQ + '- qa' + NLQ) + NLQ + '- ❓ pergunta-teste-x' + NLQ + '- ~~❓ respondida-y~~' + NLQ + '<!-- - ❓ comentada-c -->' + NLQ);
  fs.mkdirSync(path.join(a.proj, '.marvin', 'Contexto', 'Arquitetura'), { recursive: true });
  fs.writeFileSync(path.join(a.proj, '.marvin', 'Contexto', 'Arquitetura', 'decisao-x.md'), '# Título X' + NLQ + 'corpo' + NLQ);
  // US-36 roadmap fixture: ilha "zz" (2 refinadas: 05, 06) outranks ilha "aa" (1: 04) — opposite of alphabetical
  for (const [id, f] of [['US-04-a', 'aa'], ['US-05-b', 'zz'], ['US-06-c', 'zz']]) {
    run(a, '--us', 'Novos/P/F/' + id);
    const s = sobreOf(id); fs.writeFileSync(s, fs.readFileSync(s, 'utf8').replace('estado: ativa', 'estado: refinada').replace(/^## Código tocado\n/m, () => '## Código tocado' + NLQ + '- `src/' + f + '.js`' + NLQ));
  }
  run(a, '--status', '--html');   // first run after the edits; also adds nothing outside .status/ (checked below)
  const snap = () => { const o = []; (function w(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (p === dir || e.name === '.git') continue; e.isDirectory() ? w(p) : o.push(p + '\0' + fs.readFileSync(p, 'utf8')); } })(a.proj); return o.sort().join('\n'); };
  const before = snap(), textBefore = run(a, '--status').stdout, lastKeys = Object.keys(JSON.parse(lines()[lines().length - 1])).join(',');
  run(a, '--status', '--html');
  const h4 = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  check('Perguntas: ❓ aberta aparece com link para o Sobre.md; respondida e comentada não', h4.includes('pergunta-teste-x') && /href="\.\.\/Planejamento\/Novos\/P\/F\/US-02-y\/Sobre\.md"[^>]*><span class="dim">US-02/.test(h4) && !h4.includes('respondida-y') && !h4.includes('comentada-c'));
  check('Perguntas: US refinada também entra', h4.includes('pergunta-refinada-w'));
  check('Perguntas: a seção fica depois do Em andamento e antes da Tendência', h4.indexOf('id="andamento"') < h4.indexOf('id="perguntas"') && h4.indexOf('id="perguntas"') < h4.indexOf('id="tendencia"'));
  check('Time: dev-back e qa aparecem como "dev-back · qa" (dev não casa dentro de dev-back)', /dev-back · qa<\/td><\/tr>$/.test(rowOf(h4, 'US-02-y')), rowOf(h4, 'US-02-y').slice(-200));
  check('Decisões: nota de Contexto/Arquitetura linkada, entre Planejamento e Contexto fixo', /id="decisoes"[\s\S]*<a href="\.\.\/Contexto\/Arquitetura\/decisao-x\.md"[^>]*>Título X<\/a>/.test(h4) && h4.indexOf('id="epics"') < h4.indexOf('id="decisoes"') && h4.indexOf('id="decisoes"') < h4.indexOf('id="contexto"'));
  const rmap = h4.slice(h4.indexOf('id="roadmap"'), h4.indexOf('id="epics"')), at = (id) => rmap.indexOf('>' + id);
  check('Roadmap: seção existe, entre Perguntas e Planejamento', h4.includes('id="roadmap"') && h4.indexOf('id="perguntas"') < h4.indexOf('id="roadmap"') && h4.indexOf('id="roadmap"') < h4.indexOf('id="epics"'));
  check('Roadmap: ativa antes de refinada', at('US-02') > 0 && at('US-02') < at('US-03'));
  check('Roadmap: refinadas na ordem das ilhas (maior primeiro), não alfabética; sem mapa por último', at('US-05') > 0 && at('US-05') < at('US-06') && at('US-06') < at('US-04') && at('US-04') < at('US-03'));
  check('Roadmap: concluída dentro do <details>, com link para o Sobre.md', /<details><summary>Concluídas \(1\)<\/summary>[\s\S]*<a href="\.\.\/Planejamento\/Novos\/P\/F\/US-01-x\/Sobre\.md"[^>]*>US-01/.test(rmap) && rmap.indexOf('<details>') > at('US-03'));
  check('--status --html não escreve nada fora de .marvin/.status/', snap() === before);
  check('--status (texto) igual com e sem um --status --html no meio', run(a, '--status').stdout === textBefore);
  check('o ponto do historico.jsonl mantém exatamente as chaves de antes', lastKeys === Object.keys(JSON.parse(lines()[lines().length - 1])).join(',') && /^commit,data,total,tk,us_ativas,/.test(lastKeys), lastKeys);
  cleanup(a);
}

// ── US-76. --status --html: "Visão do dono" tab, in words, no US code visible (only in `title=`).
//     Queue = the ilhas order of the text --status; "Depende de você" = open ❓ of the unfinished USs.
{
  const a = arena('dono');
  run(a, '--no-git', '--no-questions');
  const sobre = (id) => path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'P', 'F', id, 'Sobre.md');
  const mk = (id, estado, titulo, extra = '', tocado = '', pronto = '') => {
    run(a, '--us', 'Novos/P/F/' + id);
    const s = sobre(id);
    let t = fs.readFileSync(s, 'utf8').replace('estado: ativa', 'estado: ' + estado).replace(/^# .*$/m, () => '# ' + titulo);
    if (pronto) t = t.replace('_(critério verificável)_', () => pronto);
    if (tocado) t = t.replace(/^## Código tocado\n/m, () => '## Código tocado' + NLQ + '- `src/' + tocado + '.js`' + NLQ);
    fs.writeFileSync(s, t + NLQ + extra + NLQ);
  };
  mk('US-01-alfa', 'ativa', 'US-01 — Alfa em curso', '- ❓ pergunta-da-ativa com a US-77 junto' + NLQ + '- ~~❓ pergunta-riscada~~');
  mk('US-02-bravo', 'refinada', 'US-02 — Bravo na fila', '- ❓ pergunta-da-fila', '', 'o bravo responde 200 (ver US-99)');
  mk('US-03-charlie', 'refinada', 'US-03 — Charlie na fila', '', 'zz');
  mk('US-04-delta', 'refinada', 'US-04 — Delta na fila', '', 'zz');
  mk('US-05-eco', 'concluida', 'US-05 — Eco feita', '- ❓ pergunta-da-concluida');
  const textBefore = run(a, '--status').stdout;
  run(a, '--status', '--html');
  const html = fs.readFileSync(path.join(a.proj, '.marvin', '.status', 'index.html'), 'utf8');
  const i0 = html.indexOf('<div class="painel p1"'), tab = html.slice(i0, html.indexOf('<script>', i0));
  const words = tab.replace(/<[^>]*>/g, ' ');
  const res = (rot) => (tab.match(new RegExp('<span class="rot">' + rot + '</span><span class="val">(\\d+)</span>')) || [])[1];
  check('US-76: a aba "Visão do dono" existe ao lado da atual, que segue no seu painel', i0 > 0 && /for="aba1">visão do dono</.test(html) && /<div class="painel p0">[\s\S]*id="andamento"[\s\S]*<details class="rede"/.test(html) && html.indexOf('class="painel p0"') < i0);
  check('US-76: nenhum código de US visível na aba (só no title)', !/\bUS-\d+/.test(words) && /title="US-01"/.test(tab) && /Alfa em curso/.test(words), words.replace(/\s+/g, ' ').slice(0, 500));
  check('US-76: resumo com as contagens (1 em andamento, 3 na fila, 1 concluída, 2 perguntas, 5 no total) e a barra por estado',
        res('em andamento') === '1' && res('na fila') === '3' && res('concluídas') === '1' && res('perguntas') === '2' && res('total') === '5' && /class="barra"/.test(tab) && /class="seg e-refinada" style="flex:3"/.test(tab), tab.slice(0, 700));
  const pos = (s) => words.indexOf(s);
  check('US-76: a fila segue a ordem das ilhas (a ilha de duas primeiro, depois a US sem mapa)', pos('Charlie') > 0 && pos('Charlie') < pos('Delta') && pos('Delta') < pos('Bravo na fila'), words.replace(/\s+/g, ' '));
  check('US-76: "Depende de você" tem a ❓ aberta de ativa e de refinada; a riscada e a da concluída não', words.includes('pergunta-da-ativa') && words.includes('pergunta-da-fila') && !words.includes('pergunta-riscada') && !words.includes('pergunta-da-concluida'));
  check('US-76: código de US dentro do texto de uma ❓ vira palavra, não código', /pergunta-da-ativa com a outra US junto/.test(words));
  check('US-76: abre em file:// — só o Google Fonts é externo, e localStorage da aba fica em try/catch',
        [...html.matchAll(/(?:href|src)="(https?:[^"]+)"/g)].every(m => /^https:\/\/fonts\.(googleapis|gstatic)\.com/.test(m[1])) && !/<script src=/.test(html) && /try\{var s=localStorage\.getItem\('marvin-aba'\)/.test(html));
  check('US-76: o --status em texto não muda com a aba', run(a, '--status').stdout === textBefore);
  // US-77: epic block (bar + counts), only the open USs listed, the done ones summarised, ❓ and "Pronto quando" per US
  const epico = (tab.match(/<section class="bloco epico"[\s\S]*?<\/section>/) || [''])[0];
  const epWords = epico.replace(/<[^>]*>/g, ' ');
  check('US-77: bloco do épico com barra e a contagem (1 de 5 concluídas, 20%)', /id="dono-epico-0"/.test(epico) && /class="barra"/.test(epico) && /1 de 5 concluídas · 20%/.test(epWords), epico.slice(0, 600));
  check('US-77: só as abertas listadas, com chip de estado; a concluída não aparece e vira "✓ 1 concluída"',
        (epico.match(/class="us-item"/g) || []).length === 4 && /class="chip">em andamento</.test(epico) && /class="chip">na fila</.test(epico) && !epWords.includes('Eco') && /✓ 1 concluída/.test(epWords), epico);
  check('US-77: ❓ só em US não concluída (2 marcas, nenhuma da concluída)', (epico.match(/❓/g) || []).length === 2 && !tab.includes('pergunta-da-concluida'));
  check('US-77: "Pronto quando" vai no title (e o texto dele não aparece solto)', /title="US-02 — Pronto quando: o bravo responde 200 \(ver US-99\)"/.test(epico) && !epWords.includes('o bravo responde'));
  check('US-77: filtro por estado e busca em JS inline, sem rede', /id="f-estado"/.test(tab) && /id="f-busca"/.test(tab) && /data-estado="refinada"/.test(tab) && /getElementById\('f-estado'\)/.test(html) && !/<script src=/.test(html));
  check('US-77: sem repos/ não há bloco de repositórios', !/id="dono-repos"/.test(html));
  check('US-77: nenhuma origem externa nova (só o Google Fonts)', [...html.matchAll(/(?:href|src)="(https?:[^"]+)"/g)].every(m => /^https:\/\/fonts\.(googleapis|gstatic)\.com/.test(m[1])));
  const hasGit = spawnSync('git', ['--version'], { encoding: 'utf8' }).status === 0;
  if (!hasGit) { console.log('  - US-77 repos pulado: git ausente (1 check)'); skipped += 1; } else {
    const rp =(...args) => spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd: path.join(a.proj, 'repos', 'app') });
    fs.mkdirSync(path.join(a.proj, 'repos', 'app'), { recursive: true });
    spawnSync('git', ['init', '-q', '-b', 'main', '.'], { cwd: path.join(a.proj, 'repos', 'app') });
    rp('commit', '-q', '--allow-empty', '-m', 'x'); rp('branch', 'feat-solta');
    fs.mkdirSync(path.join(a.proj, 'repos', 'wt'), { recursive: true });
    fs.writeFileSync(path.join(a.proj, 'repos', 'wt', '.git'), 'gitdir: ../app/.git/worktrees/wt\n');   // a worktree: `.git` is a file
    run(a, '--status', '--html');
    const h2 = fs.readFileSync(path.join(a.proj, '.marvin', '.status', 'index.html'), 'utf8');
    const rb = (h2.match(/<section class="bloco" id="dono-repos">[\s\S]*?<\/section>/) || [''])[0];
    check('US-77: com repos/ o bloco mostra a main e as branches fora dela; worktree (.git arquivo) ignorada',
          /repos\/app/.test(rb) && /class="chip">main</.test(rb) && /fora dela: feat-solta/.test(rb) && !/repos\/wt/.test(rb), rb);
  }
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
  // US-41: sub-agents live in <session>/subagents/agent-*.jsonl with a .meta.json beside them
  const sd = path.join(dir, 's1', 'subagents'); fs.mkdirSync(sd, { recursive: true });
  fs.writeFileSync(path.join(sd, 'agent-x.jsonl'), [
    line('msg_3', 'claude-sonnet-5', { input_tokens: 7, cache_creation_input_tokens: 0, cache_read_input_tokens: 0, output_tokens: 70 }, { isSidechain: true }),
    line('msg_2', 'claude-sonnet-5', { input_tokens: 5, cache_creation_input_tokens: 0, cache_read_input_tokens: 1000, output_tokens: 100 }, { isSidechain: true }),   // also in s1.jsonl: counts once
    ''].join(NLQ));
  fs.writeFileSync(path.join(sd, 'agent-x.meta.json'), JSON.stringify({ agentType: 'dev-back', model: 'sonnet', effort: 'medium' }));
  fs.writeFileSync(path.join(sd, 'agent-y.jsonl'), line('msg_4', 'claude-haiku-5', { input_tokens: 3, output_tokens: 30 }, { isSidechain: true }) + NLQ);   // no meta
  const r2 = run(a, '--status');
  check('subagents/ entra no total e a mesma mensagem nos dois lugares conta uma vez', /4 model turns/.test(r2.stdout) && /3 by subagents/.test(r2.stdout) && /sessão principal\s+claude-opus-5\s+effort não registrado\s+1 turns/.test(r2.stdout), r2.stdout.slice(-700));
  check('a linha do papel traz modelo, esforço, turnos e custo', /dev-back\s+claude-sonnet-5\s+effort medium\s+2 turns\s+≈ \$0\.00/.test(r2.stdout), r2.stdout.slice(-700));
  check('subagente sem meta vai para "sem papel" sem derrubar', r2.status === 0 && /sem papel\s+claude-haiku-5\s+effort não registrado\s+1 turns/.test(r2.stdout));
  // US-64: effort from the turn, main session as a role, deviations with session+day, mixed models, "sem medição"
  const sdz = path.join(dir, 'abcdef123456', 'subagents'); fs.mkdirSync(sdz, { recursive: true });
  const ex = { sessionId: 'abcdef123456' };
  const us = { input_tokens: 1, output_tokens: 10 };
  fs.writeFileSync(path.join(dir, 'abcdef123456.jsonl'), [
    line('m_a', 'claude-opus-5', us, { ...ex, effort: 'xhigh' }),
    line('m_b', 'claude-sonnet-5', us, { ...ex, effort: 'low' }),
    ''].join(NLQ));
  fs.writeFileSync(path.join(sdz, 'agent-g.jsonl'), line('m_c', 'claude-opus-5', us, { ...ex, isSidechain: true, effort: 'high', timestamp: '2026-09-12T10:00:00Z' }) + NLQ);
  fs.writeFileSync(path.join(sdz, 'agent-g.meta.json'), JSON.stringify({ agentType: 'general-purpose' }));
  fs.writeFileSync(path.join(sdz, 'agent-d.jsonl'), [
    line('m_d', 'claude-opus-5', us, { ...ex, isSidechain: true }),
    line('m_e', 'claude-sonnet-5', us, { ...ex, isSidechain: true }), ''].join(NLQ));
  fs.writeFileSync(path.join(sdz, 'agent-d.meta.json'), JSON.stringify({ agentType: 'dev-back', effort: 'medium' }));
  const usDir = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E', 'F', 'US-9-x'); fs.mkdirSync(usDir, { recursive: true });
  fs.writeFileSync(path.join(usDir, 'Sobre.md'), '---\ntipo: us\nestado: ativa\n---\n# US-9 — x\n\n## Time\n\n| etapa | papel | modelo · esforço | motivo | estado |\n|---|---|---|---|---|\n| a | dev-back · skill-x | Sonnet · médio | p | pendente |\n| b | dba | Sonnet · baixo | p | pendente |\n| c | dono | Humano | p | pendente |\n');
  const r3 = run(a, '--status');
  check('US-64: esforço vem do turno (xhigh/low na sessão principal) e meta.effort é reserva', /sessão principal\s+claude-opus-5\s+effort xhigh\s+2 turns/.test(r3.stdout) && /dev-back\s+claude-opus-5\s+effort medium/.test(r3.stdout), r3.stdout.slice(-1500));
  check('US-64: papel com modelos misturados sai uma linha por modelo', /dev-back\s+claude-opus-5/.test(r3.stdout) && /dev-back\s+claude-sonnet-5/.test(r3.stdout) && /sessão principal\s+claude-sonnet-5\s+effort low/.test(r3.stdout));
  check('US-64: turno de general-purpose em qualquer modelo vira linha de desvio com sessão curta, dia e custo', /abcdef12\s+2026-09-12\s+general-purpose\s+claude-opus-5\s+1 turns\s+≈ \$0\.00/.test(r3.stdout), r3.stdout.slice(-1500));
  check('US-64: o turno sem papel (haiku) também aparece como desvio', /s1\s+2026-09-11\s+sem papel\s+claude-haiku-5\s+1 turns/.test(r3.stdout));
  check('US-64: papel declarado no Time e sem turno sai como "sem medição" (o medido não)', /sem medição[^\n]*dba/.test(r3.stdout) && !/sem medição[^\n]*dev-back/.test(r3.stdout), r3.stdout.slice(-1500));
  check('US-64: papel humano (dono) no Time não sai em "sem medição"', !/sem medição[^\n]*dono/.test(r3.stdout), r3.stdout.slice(-1500));
  run(a, '--us', 'Novos/E/F/US-1');
  run(a, '--status', '--html');
  const html = fs.readFileSync(path.join(a.proj, '.marvin', '.status', 'index.html'), 'utf8');
  check('o HTML traz a tabela por modelo e o aviso de estimativa', /claude-sonnet-5/.test(html) && /custariam na API/.test(html));
  check('o HTML traz a tabela por papel', /papel \(subagente\)/.test(html) && /<td>dev-back<\/td>/.test(html) && /<td>sem papel<\/td>/.test(html) && /sessão principal/.test(html));
  check('o HTML desenha a rede da base — nós de doc com estado, sem lib', /id="rede-dados"/.test(html) && /"cat":"us"/.test(html) && /"estado":"ativa"/.test(html) && !/<script src=/.test(html));
  const short = run(a, '--status', '--curto', '--html');
  check('--curto --html regera o dashboard em silêncio (é o hook)', short.status === 0 && !/index\.html/.test(short.stdout) && fs.statSync(path.join(a.proj, '.marvin', '.status', 'index.html')).size > 1000);
  check('o hook gerado regera o HTML', /--status --curto --html/.test(fs.readFileSync(path.join(a.proj, '.claude', 'settings.json'), 'utf8')));
  cleanup(a);
}

// ── 9y2. US-65: cost per US from the `--us` windows in the main session. A sub-agent inherits the
//      window of the Agent tool_use named by its meta.toolUseId; no signal → "sem US", never apportioned.
{
  const a = arena('gastos-us');
  run(a, '--no-git');
  const dir = path.dirname(memoryPath(a.lar, a.proj));
  const u = { input_tokens: 1, output_tokens: 10 };
  const turn = (id, blocks = [], extra = {}) => JSON.stringify({ type: 'assistant', timestamp: '2026-10-19T10:00:00Z', sessionId: 's65', message: { id, model: 'claude-sonnet-5', usage: u, content: blocks }, ...extra });
  const bash = (id, command) => ({ type: 'tool_use', id, name: 'Bash', input: { command } });
  const agent = (id) => ({ type: 'tool_use', id, name: 'Agent', input: { prompt: 'faça algo da US-01' } });
  const res = (id, isErr) => JSON.stringify({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, is_error: !!isErr, content: 'x' }] } });
  fs.writeFileSync(path.join(dir, 's65.jsonl'), [
    turn('t0'),
    turn('tf', [bash('bf', 'marvin --us Novos/E/F/US-03-z')]), res('bf', true),                      // errored: opens nothing
    turn('tq', [bash('bq', 'marvin --status --us US-03')]), res('bq'),                               // --status: opens nothing
    turn('t1', [bash('b1', 'marvin --us Novos/E/F/US-01-x')]), res('b1'),
    turn('t1b', [agent('a1')]),
    turn('t2', [bash('b2', 'node marvin.mjs --us=Manutencao/E/F/US-02-y')]), res('b2'),
    turn('t2b', [agent('a2')]),
    turn('td', [bash('bd', 'marvin --fechar --dry-run')]), res('bd'),                                                  // dry-run closes nothing
    turn('t3', [bash('b3', 'marvin --fechar')]), res('b3'),
    turn('t4', [agent('a3')]),
    turn('l1', [bash('bl', 'for u in US-07-a US-08-b; do node marvin.mjs --us Novos/E/F/$u; done')]), res('bl'),   // $u: no signal
    turn('l2', [bash('bg', 'git commit -m "marvin --us Novos/E/F/US-09-g"')]), res('bg'),                          // not a marvin command
    turn('l3', [bash('br', 'marvin --us Novos/E/F/US-10-r --refinada')]), res('br'),                                // refinement opens nothing
    ''].join(NLQ));
  const sub = (name, id, toolUseId) => {
    const sd = path.join(dir, 's65', 'subagents'); fs.mkdirSync(sd, { recursive: true });
    fs.writeFileSync(path.join(sd, 'agent-' + name + '.jsonl'), turn(id, [], { isSidechain: true }) + NLQ);
    fs.writeFileSync(path.join(sd, 'agent-' + name + '.meta.json'), JSON.stringify({ agentType: 'dev-back', toolUseId }));
  };
  sub('1', 's1', 'a1'); sub('2', 's2', 'a2'); sub('3', 's3', 'a3'); sub('4', 's4', 'orfao');
  const r = run(a, '--status', '--us', 'Manutencao/E/F/US-01-x');
  check('US-65: duas US numa sessão — US-01 = t1 + Agent + subagente', /US-01\s+3 turns \(1 by subagents\)/.test(r.stdout), r.stdout.slice(-900));
  check('US-65: US-02 inclui o turno do --fechar que a fecha', /US-02\s+5 turns \(1 by subagents\)/.test(run(a, '--status', '--us=US-02').stdout));
  check('US-65: Agent depois do --fechar, id órfão, comando com erro e --status caem em "sem US"', /sem US\s+9 turns \(2 by subagents\)/.test(r.stdout), r.stdout.slice(-900));
  check('US-65: loop com $u, git commit com --us, --refinada e --fechar --dry-run não criam nem fecham janela', !/US-(0[7-9]|10)\s/.test(r.stdout) && !r.stdout.includes('$u'), r.stdout.slice(-900));
  check('US-65: a soma das US mais "sem US" é o total', /17 model turns/.test(r.stdout), r.stdout.slice(-900));
  const full = run(a, '--status', '--us', '.marvin\\Planejamento\\Manutencao\\E\\F\\US-01-x\\Sobre.md');
  check('US-83: --status --us com o caminho completo dá a mesma conta que o curto', full.status === r.status && /US-01\s+3 turns \(1 by subagents\)/.test(full.stdout) && /US-02\s+5 turns/.test(run(a, '--status', '--us=../Planejamento/Manutencao/E/F/US-02-y/Sobre.md').stdout), full.stdout.slice(-600));
  const sem = run(a, '--status');
  check('US-65: --status sem --us lista uma linha por US e "sem US"', /US-01\s+3 turns/.test(sem.stdout) && /US-02\s+5 turns/.test(sem.stdout) && /sem US\s+9 turns/.test(sem.stdout));
  cleanup(a);
}
{
  const a = arena('gastos-us2');
  run(a, '--no-git');
  const dir = path.dirname(memoryPath(a.lar, a.proj));
  const mk = (id, blocks) => JSON.stringify({ type: 'assistant', sessionId: 's9', timestamp: '2026-10-19T10:00:00Z', message: { id, model: 'claude-sonnet-5', usage: { input_tokens: 1, output_tokens: 10 }, content: blocks } });
  fs.writeFileSync(path.join(dir, 's9.jsonl'), [mk('x1', []), mk('x2', [{ type: 'tool_use', id: 'bb', name: 'Bash', input: { command: 'marvin --status --us US-01' } }]), ''].join(NLQ));
  const snap = () => { const o = []; (function w(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (p === dir || e.name === '.git') continue; e.isDirectory() ? w(p) : o.push(p + '\0' + fs.readFileSync(p, 'utf8')); } })(a.proj); return o.sort().join('\n'); };
  const before = snap();
  const r = run(a, '--status', '--us', 'US-01');
  check('US-65: sessão sem janela — US-01 = 0 e tudo em "sem US", sem erro', /US-01\s+0 turns\s+≈ \$0\.00/.test(r.stdout) && /sem US\s+2 turns/.test(r.stdout), r.stdout.slice(-700));
  check('US-65: --status --us só lê (não cria US nem arquivo)', snap() === before);
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

// ── 9z-c. US-75: the "Outras US no mesmo código" list is capped at 25, like the dependents.
{
  const a = arena('impacto-teto');
  fs.mkdirSync(path.join(a.proj, 'src'), { recursive: true });
  fs.writeFileSync(path.join(a.proj, 'src', 'pag.js'), 'export function cobrar(){}' + NLQ);
  run(a);
  const output = path.join(a.proj, 'graphify-out'); fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, 'graph.json'), JSON.stringify({ directed: true, nodes: [
    { id: 'src_pag', label: 'pag.js', file_type: 'code', source_file: 'src/pag.js', community: 0, _origin: 'ast' },
    { id: 'src_pag_cobrar', label: 'cobrar()', file_type: 'code', source_file: 'src/pag.js', source_location: 'L1', community: 0, _origin: 'ast' }],
    edges: [{ source: 'src_pag', target: 'src_pag_cobrar', relation: 'contains' }] }));
  const sobres = [];
  for (let i = 1; i <= 28; i++) {
    const u = 'US-T' + String(i).padStart(2, '0');
    run(a, '--us', 'Novos/E/F/' + u);
    const p = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E', 'F', u, 'Sobre.md');
    fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/_\(crase com o caminho[^\n]*\n/, '- `src/pag.js` — `cobrar`' + NLQ));
    sobres.push(p);
  }
  run(a, '--us', 'Novos/E/F/US-T01');
  const t1 = fs.readFileSync(sobres[0], 'utf8');
  const bloco = t1.slice(t1.indexOf('**Outras US no mesmo código**'));
  check('US-75: com 27 outras US, a lista para em 25', (bloco.match(/^- \[US-T/gm) || []).length === 25, bloco.slice(0, 300));
  check('US-75: a lista fecha com "… e mais 2"', /^- … e mais 2$/m.test(bloco));
  run(a, '--us', 'Novos/E/F/US-T01');
  check('US-75: segundo --us deixa o Sobre.md byte-idêntico', fs.readFileSync(sobres[0], 'utf8') === t1);
  cleanup(a);
}

// ── 9z-b. US-24: --fechar looks at every sub-repo, not only the root. A nested .git hides its
//      files from the root's status, so with git at the root alone the drift passes silent.
{
  const hasGit = spawnSync('git', ['--version'], { encoding: 'utf8' }).status === 0;
  if (!hasGit) { console.log('  - 9z-b pulado: git ausente (10 checks)'); skipped += 10; }
  else {
    const a = arena('fechar-subrepo');
    spawnSync('git', ['init', '-q', '.'], { cwd: a.proj });
    fs.writeFileSync(path.join(a.proj, '.gitignore'), 'repos/\n');
    for (const [r, files] of [['svc-a', ['a.js', 'dup.js']], ['svc-b', ['b.js', 'dup.js']]]) {
      const dir = path.join(a.proj, 'repos', r);
      fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
      spawnSync('git', ['init', '-q', '.'], { cwd: dir });
      for (const f of files) fs.writeFileSync(path.join(dir, 'src', f), 'export const x = 1' + NLQ);
    }
    run(a, '--no-git');
    const feat = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E1', 'F1');
    fs.mkdirSync(feat, { recursive: true });
    fs.writeFileSync(path.join(feat, 'Sobre.md'), '---' + NLQ + 'tipo: feature' + NLQ + '---' + NLQ + '# F1' + NLQ);
    const mkUs = (n, est, lines) => {
      const d = path.join(feat, 'US-' + n); fs.mkdirSync(d, { recursive: true });
      fs.writeFileSync(path.join(d, 'Sobre.md'), ['---', 'tipo: us', 'estado: ' + est, 'pai: ../Sobre.md', '---', '# US-' + n + ' — teste',
        '## Código tocado', ...lines, '', '## Rumo', '- **07/10/2026** — teste', ''].join(NLQ));
    };
    const strip = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
    const f0 = run(a, '--fechar'); const o0 = strip(f0.stdout);
    check('--fechar acusa código mudado num sub-repo fora de toda US, com o prefixo', f0.status !== 0 && /repos\/svc-a\/src\/a\.js/.test(o0) && /repos\/svc-b\/src\/b\.js/.test(o0) && /in NO active US/.test(o0), o0.slice(-500));
    mkUs(1, 'ativa', ['- `repos/svc-a/src/a.js`', '- `src/b.js`', '- `src/dup.js`']);
    const f1 = run(a, '--fechar'); const o1 = strip(f1.stdout);
    check('declarado COM prefixo cobre o arquivo do sub-repo', /repos\/svc-a\/src\/a\.js\s+→ US-1/.test(o1), o1.slice(-500));
    check('declarado SEM prefixo (um só repo o tem) resolve pelo canonFile', /repos\/svc-b\/src\/b\.js\s+→ US-1/.test(o1), o1.slice(-500));
    check('nome sem prefixo em dois repos é avisado como ambíguo e não cobre nada', /`src\/dup\.js` is ambiguous/.test(o1) && f1.status !== 0 && /repos\/svc-a\/src\/dup\.js/.test(o1), o1.slice(-500));
    mkUs(1, 'ativa', ['- `repos/svc-a/src/a.js`', '- `src/b.js`', '- `repos/svc-a/src/dup.js`', '- `repos/svc-b/src/dup.js`']);
    const f2 = run(a, '--fechar');
    check('tudo declarado, com e sem prefixo: sai 0', f2.status === 0 && /every changed code file is declared/.test(f2.stdout), strip(f2.stdout).slice(-500));
    fs.mkdirSync(path.join(a.proj, 'repos', 'ruim', '.git'), { recursive: true });
    fs.writeFileSync(path.join(a.proj, 'repos', 'ruim', 'x.js'), 'export const x = 1' + NLQ);
    const f3 = run(a, '--fechar'); const o3 = strip(f3.stdout);
    check('.git que o git recusa: avisa, não confere aquela pasta e não derruba o comando', /repos\/ruim has a \.git that git does not accept/.test(o3) && f3.status === 0 && !/repos\/ruim\/x\.js/.test(o3), o3.slice(-500));
    fs.rmSync(path.join(a.proj, 'repos', 'ruim'), { recursive: true, force: true });
    for (const r of ['', 'repos/svc-a', 'repos/svc-b']) {   // everything committed "yesterday": all three repos clean
      const env = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t', GIT_AUTHOR_DATE: '2020-01-01T00:00:00', GIT_COMMITTER_DATE: '2020-01-01T00:00:00' };
      spawnSync('git', ['add', '-A'], { cwd: path.join(a.proj, r), env });
      spawnSync('git', ['commit', '-q', '-m', 'base'], { cwd: path.join(a.proj, r), env });
    }
    const f4 = run(a, '--fechar');
    check('sub-repos limpos e sem commit de hoje: "nothing changed" (só quando todos estão limpos)', f4.status === 0 && /nothing changed/.test(f4.stdout), strip(f4.stdout).slice(-300));
    fs.writeFileSync(path.join(a.proj, 'repos', 'svc-b', 'src', 'novo.js'), 'export const y = 2' + NLQ);
    const f5 = run(a, '--fechar');
    check('um só sub-repo sujo basta para acusar (exit != 0)', f5.status !== 0 && /repos\/svc-b\/src\/novo\.js/.test(f5.stdout) && !/nothing changed/.test(f5.stdout), strip(f5.stdout).slice(-300));
    // names with spaces: plain porcelain/log quote them and the quote hid the extension (drift passed silent)
    const svcA = path.join(a.proj, 'repos', 'svc-a'), envA = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t', GIT_AUTHOR_DATE: '2020-01-01T00:00:00', GIT_COMMITTER_DATE: '2020-01-01T00:00:00' };
    for (const n of ['mod x.js', 'old name.js']) fs.writeFileSync(path.join(svcA, 'src', n), 'export const m = 1' + NLQ);
    spawnSync('git', ['add', '-A'], { cwd: svcA, env: envA }); spawnSync('git', ['commit', '-q', '-m', 'espacos'], { cwd: svcA, env: envA });
    fs.appendFileSync(path.join(svcA, 'src', 'mod x.js'), '// mudou' + NLQ);
    spawnSync('git', ['mv', 'src/old name.js', 'src/new name.js'], { cwd: svcA });
    const f6 = run(a, '--fechar');
    check('nome com espaço, alterado e renomeado, num sub-repo: os dois são acusados', f6.status !== 0 && /repos\/svc-a\/src\/mod x\.js/.test(f6.stdout) && /repos\/svc-a\/src\/new name\.js/.test(f6.stdout) && !/old name\.js/.test(f6.stdout), strip(f6.stdout).slice(-400));
    check('o template do /fechar diz "por repo"', /por repo/.test(fs.readFileSync(path.join(a.proj, '.claude', 'commands', 'fechar.md'), 'utf8')));
    cleanup(a);
  }
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
  touch('US-04', ['.claude-plugin/']);
  const outDot = run(a, '--status', '--curto').stdout;
  check('US-54: ilha cujo arquivo começa com ponto mantém o nome (.claude-plugin), nunca fica sem nome', /▹ \.claude-plugin\s+1 US: ○ US-04/.test(outDot) && !/[▹▶]\s+\d+ US/.test(outDot), outDot);
  check('/refinar é gerado', fs.existsSync(path.join(a.proj, '.claude', 'commands', 'refinar.md')));
  check('/refinar aceita US existente e faz só a triagem de custo (a tabela do Time), em lote só a próxima ilha',
        /só a triagem de custo/.test(fs.readFileSync(path.join(a.proj, '.claude', 'commands', 'refinar.md'), 'utf8'))
        && /só as da próxima ilha/.test(fs.readFileSync(path.join(a.proj, '.claude', 'commands', 'refinar.md'), 'utf8')));
  const cont = path.join(a.proj, '.claude', 'commands', 'continuar.md');
  const contTxt = fs.readFileSync(cont, 'utf8');
  check('/continuar é gerado', /sem esperar confirmação/.test(contTxt));
  check('/continuar não leva link de delegacao nem teto fixo, e aponta a nota real', !/delegacao/.test(contTxt) && !contTxt.includes('$3') && contTxt.includes('.marvin/Memoria/onde_paramos.md'));
  run(a, '--no-git', '--no-questions');
  check('/continuar: 2ª passada não muda o arquivo', fs.readFileSync(cont, 'utf8') === contTxt);
  fs.writeFileSync(cont, 'meu /continuar\n');
  run(a, '--no-git', '--no-questions');
  check('/continuar editado pelo humano não é sobrescrito', fs.readFileSync(cont, 'utf8') === 'meu /continuar\n');
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
  check('base atrás: o hook avisa em uma linha', /base desatualizada \(Marvin [0-9.]+ > base 0\.0\.1/.test(run(a, '--status', '--curto').stdout));
  const up = run(a, '--no-git', '--no-questions').stdout;
  check('base atrás: a passada avança o carimbo e diz de onde', /marvin 0\.0\.1 → /.test(up) && new RegExp('^marvin: ' + version + '$', 'm').test(read()));
  check('marvin_montado nunca é reescrito', new RegExp('^marvin_montado: ' + version + '$', 'm').test(read()));
  // US-30: a base ahead of this script is not downgraded; the run warns and the hook says to update.
  fs.writeFileSync(rec, read().replace(/^marvin: .+$/m, 'marvin: 99.0.0'));
  const ahead = run(a, '--no-git', '--no-questions').stdout;
  check('base à frente: o carimbo não é rebaixado', /^marvin: 99\.0\.0$/m.test(read()));
  check('base à frente: a passada avisa para atualizar', /atualize: npm i -g marvin-kb@latest/.test(ahead), ahead.slice(-300));
  const hook = run(a, '--status', '--curto').stdout;
  check('base à frente: o hook manda atualizar, não rodar `marvin`', /atualize o marvin/.test(hook) && !/rode `marvin`/.test(hook), hook);
  // A quoted YAML value is the same version: quotes must not make it compare as older.
  fs.writeFileSync(rec, read().replace(/^marvin: .+$/m, 'marvin: "99.0.0"'));
  run(a, '--no-git', '--no-questions');
  check('base à frente entre aspas: o carimbo não é rebaixado', /^marvin: "99\.0\.0"$/m.test(read()));
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

// ── 15. Availability declarations: no auth, no inference, no overwritten choices.
{
  const inventory = a => path.join(a.proj, '.marvin', '.local', 'disponibilidade.json');
  const a = arena('ai-one');
  const one = run(a, '--no-git', '--no-questions', '--executor=codex', '--ai=codex:subscription:yes');
  check('um acesso sem Claude cria inventário', one.status === 0 && fs.existsSync(inventory(a)), one.stderr);
  if (fs.existsSync(inventory(a))) {
    const first = fs.readFileSync(inventory(a), 'utf8');
    const record = JSON.parse(first);
    check('declaração não vira execução testada', record.executor === 'codex' && record.providers.length === 1
      && record.providers[0].id === 'codex' && record.providers[0].configured === 'yes'
      && record.providers[0].tested === 'not-confirmed');
    run(a, '--no-git', '--executor=other', '--ai=deepseek:api:no');
    check('rerun preserva escolhas', fs.readFileSync(inventory(a), 'utf8') === first);
    fs.writeFileSync(inventory(a), '{invalid');
    const badRecord = run(a, '--no-git');
    check('inventário inválido falha sem sobrescrever', badRecord.status !== 0 && fs.readFileSync(inventory(a), 'utf8') === '{invalid');
  } else {
    check('declaração não vira execução testada', false);
    check('rerun preserva escolhas', false);
    check('inventário inválido falha sem sobrescrever', false);
  }
  check('inventário tem exclusão local mesmo com --no-git', fs.existsSync(path.join(a.proj, '.marvin', '.local', '.gitignore'))
    && /^\/disponibilidade\.json$/m.test(fs.readFileSync(path.join(a.proj, '.marvin', '.local', '.gitignore'), 'utf8')));
  cleanup(a);

  const b = arena('ai-all');
  const ids = ['claude', 'codex', 'minimax', 'deepseek', 'gemini', 'grok', 'jev'];
  const all = run(b, '--executor=opencode', ...ids.map(id => '--ai=' + id + ':api:unknown'));
  check('todas as sete opções em outro executor', all.status === 0 && fs.existsSync(inventory(b))
    && JSON.parse(fs.readFileSync(inventory(b), 'utf8')).providers.length === 7, all.stderr);
  const ignored = spawnSync('git', ['check-ignore', '.marvin/.local/disponibilidade.json'], { cwd: b.proj, encoding: 'utf8' });
  check('git ignora inventário local', ignored.status === 0, ignored.stderr);
  cleanup(b);

  const c = arena('ai-unknown');
  const unknown = run(c, '--no-git', '--no-questions');
  check('sem TTY/perguntas não inventa disponibilidade', unknown.status === 0 && !fs.existsSync(inventory(c))
    && /availability not declared/.test(unknown.stdout), unknown.stderr);
  check('orientação gerada funciona por ponteiro', /Disponibilidade de IA/.test(fs.readFileSync(path.join(c.proj, 'AGENTS.md'), 'utf8'))
    && fs.existsSync(path.join(c.proj, '.marvin', 'Contexto', 'IA.md'))
    && !/^model:/m.test(fs.readFileSync(path.join(c.proj, '.claude', 'agents', 'README.md'), 'utf8')));
  const noQuestions = await runInteractive(c, [], '--no-git', '--no-questions');
  check('--no-questions com TTY não trava em perguntas', noQuestions.status === 0 && !fs.existsSync(inventory(c)), noQuestions.stderr);
  cleanup(c);

  const d = arena('ai-dry');
  const dry = run(d, '--dry-run', '--executor=other', '--ai=jev:api:no');
  check('dry-run planeja disponibilidade sem escrever', dry.status === 0 && /disponibilidade\.json/.test(dry.stdout)
    && files(d.proj).length === 0 && !fs.existsSync(memoryPath(d.lar, d.proj)));
  cleanup(d);

  for (const args of [ ['--executor=bad', '--ai=codex:api:yes'], ['--executor=codex', '--ai=bad:api:yes'],
    ['--executor=codex', '--ai=codex:password:yes'], ['--executor=codex', '--ai=codex:api:maybe'],
    ['--ai=codex:api:yes'], ['--executor=codex', '--ai=codex:api:yes', '--ai=codex:local:no'] ]) {
    const e = arena('ai-invalid');
    const invalid = run(e, ...args);
    check('entrada inválida falha antes de escrever: ' + args.join(' '), invalid.status !== 0 && files(e.proj).length === 0
      && !fs.existsSync(memoryPath(e.lar, e.proj)));
    cleanup(e);
  }
  const f = arena('ai-none');
  run(f, '--no-git', '--executor=other', '--ai=none');
  check('nenhum acesso declarado difere de não informado', fs.existsSync(inventory(f))
    && JSON.parse(fs.readFileSync(inventory(f), 'utf8')).providers.length === 0);
  cleanup(f);

  const g = arena('ai-ignore-existing');
  fs.writeFileSync(path.join(g.proj, '.gitignore'), '# user rules\n*.user\n');
  fs.mkdirSync(path.join(g.proj, '.marvin', '.local'), { recursive: true });
  fs.writeFileSync(path.join(g.proj, '.marvin', '.local', '.gitignore'), '!compartilhado.md\n');
  fs.writeFileSync(path.join(g.proj, '.marvin', '.local', 'compartilhado.md'), '# user file\n');
  run(g, '--no-questions', '--executor=codex', '--ai=codex:api:yes');
  check('ignore existente não é sobrescrito', fs.readFileSync(path.join(g.proj, '.gitignore'), 'utf8') === '# user rules\n*.user\n'
    && spawnSync('git', ['check-ignore', '.marvin/.local/disponibilidade.json'], { cwd: g.proj }).status === 0
    && spawnSync('git', ['check-ignore', '.marvin/.local/compartilhado.md'], { cwd: g.proj }).status === 1
    && fs.readFileSync(path.join(g.proj, '.marvin', '.local', '.gitignore'), 'utf8').startsWith('!compartilhado.md\n'));
  fs.unlinkSync(path.join(g.proj, '.marvin', '.local', '.gitignore'));
  run(g, '--no-git');
  check('inventário existente recupera exclusão ausente', fs.existsSync(path.join(g.proj, '.marvin', '.local', '.gitignore')));
  cleanup(g);

  const h = arena('ai-old-vault');
  fs.mkdirSync(path.join(h.proj, 'Docs', '08_Memoria'), { recursive: true });
  run(h, '--no-git', '--executor=other', '--ai=gemini:local:unknown');
  check('vault antigo reutilizado sem criar .marvin/Contexto', fs.existsSync(path.join(h.proj, 'Docs', '.local', 'disponibilidade.json'))
    && fs.existsSync(path.join(h.proj, 'Docs', 'IA.md')) && !fs.existsSync(path.join(h.proj, '.marvin'))
    && !fs.existsSync(path.join(h.proj, 'Docs', 'Contexto')));
  cleanup(h);

  const i = arena('ai-interactive');
  fs.mkdirSync(path.join(i.proj, '.marvin', 'Memoria'), { recursive: true });
  fs.writeFileSync(path.join(i.proj, '.marvin', 'ferramentas.md'), '| graphify | não | | |\n| ponytail | não | | |\n');
  fs.mkdirSync(path.join(i.proj, '.marvin', 'Fontes'), { recursive: true });
  fs.writeFileSync(path.join(i.proj, '.marvin', 'Fontes', 'Externas.md'), '# existing sources\n');
  const interactive = await runInteractive(i, [
    ['Session tool (', 'bad'], ['Session tool (', 'codex'], ['Available AI (', 'jev'],
    ['jev access (', 'password'], ['jev access (', 'api'], ['already configured in codex?', 'no'],
  ], '--no-git');
  check('perguntas TTY validam e registram sem configurar provedor', interactive.status === 0 && fs.existsSync(inventory(i))
    && JSON.parse(fs.readFileSync(inventory(i), 'utf8')).source === 'prompt'
    && JSON.parse(fs.readFileSync(inventory(i), 'utf8')).providers[0].configured === 'no', interactive.stderr + interactive.stdout.slice(-400));
  const hook = JSON.parse(fs.readFileSync(path.join(i.proj, '.claude', 'settings.json'), 'utf8')).hooks.SessionStart[0].hooks[0].command;
  check('driver TTY preserva o caminho real do hook', hook === 'node "' + SCRIPT.replace(/\\/g, '/') + '" --status --curto --html');
  cleanup(i);

  for (const answers of [ [['Session tool (', null]], [['Session tool (', 'codex'], ['Available AI (', 'jev'], ['jev access (', null]] ]) {
    const cancelledArena = arena('ai-cancelled');
    const cancelled = await runInteractive(cancelledArena, answers, '--no-git');
    check('EOF no onboarding aborta sem gravar respostas parciais', cancelled.status === 1
      && /AI setup cancelled/.test(cancelled.stdout) && !/unsettled top-level await/.test(cancelled.stderr)
      && files(cancelledArena.proj).length === 0 && !fs.existsSync(memoryPath(cancelledArena.lar, cancelledArena.proj)), cancelled.stderr);
    cleanup(cancelledArena);
  }

  const j = arena('ai-guide-existing');
  fs.mkdirSync(path.join(j.proj, '.marvin', 'Contexto'), { recursive: true });
  const guide = path.join(j.proj, '.marvin', 'Contexto', 'IA.md');
  fs.writeFileSync(guide, '# user guide\n');
  const existing = run(j, '--no-git', '--no-questions');
  check('guia existente preservado com aviso de atualização', fs.readFileSync(guide, 'utf8') === '# user guide\n'
    && /Contexto\/IA\.md — missing[\s\S]*desde 2\.0\.0/.test(existing.stdout));
  cleanup(j);
}

// ── 12. US-26: team suggestion printed in the terminal (read-only) + triage update mark
// Frontier = directory with a stack marker, not marker type. Printed only while
// .claude/agents has no *.md besides the README.
{
  const a = arena('time1');
  const r = run(a, '--no-git');
  check('uma fronteira (só package.json): sugere 1 e um dev único',
        /1 frontier\(s\) detected/.test(r.stdout) && /base roles: tl, po, dev, qa, scout/.test(r.stdout), r.stdout.slice(-600));
  cleanup(a);

  const b = arena('time2');
  fs.unlinkSync(path.join(b.proj, 'package.json'));
  fs.mkdirSync(path.join(b.proj, 'web')); fs.mkdirSync(path.join(b.proj, 'api'));
  fs.writeFileSync(path.join(b.proj, 'web', 'package.json'), '{"name":"web"}\n');
  fs.writeFileSync(path.join(b.proj, 'api', 'go.mod'), 'module api\n');
  const rb = run(b, '--no-git');
  check('package.json + go.mod em subpastas: 2 fronteiras, dev-front e dev-back separados',
        /2 frontier\(s\) detected/.test(rb.stdout) && /base roles: tl, po, dev-front, dev-back, qa, scout/.test(rb.stdout));
  cleanup(b);

  const c = arena('time3');
  fs.writeFileSync(path.join(c.proj, 'tsconfig.json'), '{}\n');
  const rc = run(c, '--no-git');
  check('package.json + tsconfig.json na raiz: 1 fronteira (regressão da contagem por marcador)',
        /1 frontier\(s\) detected/.test(rc.stdout) && !/2 frontier/.test(rc.stdout));
  cleanup(c);

  const d = arena('time4');
  const before = fs.readdirSync(d.proj).sort().join(',');
  const rd = run(d, '--no-git', '--dry-run');
  check('--dry-run imprime a sugestão e não cria arquivo',
        /Suggested team/.test(rd.stdout) && /design \/ dba \/ sec \/ infra/.test(rd.stdout)
        && fs.readdirSync(d.proj).sort().join(',') === before);
  cleanup(d);

  const e = arena('time5');
  fs.mkdirSync(path.join(e.proj, '.claude', 'agents'), { recursive: true });
  fs.writeFileSync(path.join(e.proj, '.claude', 'agents', 'algo.md'), '---\nname: algo\n---\n');
  const re = run(e, '--no-git');
  check('com um agente já escrito a sugestão não é impressa', !/Suggested team/.test(re.stdout));
  cleanup(e);

  // Ignored sub-repo WITH a marker inside is one frontier, not two (walk does not skip it).
  // Detection runs at the top and needs git only, not the graphify binary (same as 9e).
  if (spawnSync('git', ['--version'], { encoding: 'utf8' }).status !== 0) {
    console.log('  - 12 (sub-repo) pulado: git ausente nesta máquina (2 checks)'); skipped += 2;
  } else {
    const g = arena('time-subrepo');
    fs.unlinkSync(path.join(g.proj, 'package.json'));
    spawnSync('git', ['init', '-q', '.'], { cwd: g.proj });
    fs.mkdirSync(path.join(g.proj, 'app'));
    spawnSync('git', ['init', '-q', '.'], { cwd: path.join(g.proj, 'app') });
    fs.writeFileSync(path.join(g.proj, 'app', 'package.json'), '{"name":"app"}\n');
    fs.writeFileSync(path.join(g.proj, '.gitignore'), 'app/\n');
    const rg = run(g, '--no-git', '--graphify');
    check('sub-repo ignorado com package.json dentro: 1 fronteira no terminal, não 2',
          /1 frontier\(s\) detected/.test(rg.stdout) && !/2 frontier/.test(rg.stdout), rg.stdout.slice(-600));
    const ar = path.join(g.proj, '.claude', 'agents', 'README.md');
    check('o agents/README gerado também conta 1 fronteira',
          fs.existsSync(ar) && /Uma fronteira só/.test(fs.readFileSync(ar, 'utf8'))
          && /mais 1 sub-repositório/.test(fs.readFileSync(ar, 'utf8')));
    cleanup(g);
  }

  const z = arena('time0');
  fs.unlinkSync(path.join(z.proj, 'package.json'));
  const rz = run(z, '--no-git');
  check('nenhum marcador: o terminal não diz "0 frontier(s)"',
        /no stack marker found — single dev/.test(rz.stdout) && !/0 frontier/.test(rz.stdout));
  cleanup(z);

  // Triage text (desde 2.1.0): old base is flagged by step 10, new is not, twice does not duplicate.
  const f = arena('triagem');
  run(f, '--no-git');
  const plan = path.join(f.proj, '.marvin', 'Planejamento', 'README.md');
  const fresh = run(f, '--no-git');
  check('base nova com a triagem: o passo 10 não acusa', !/desde 2\.1\.0/.test(fresh.stdout));
  const txt = fs.readFileSync(plan, 'utf8');
  check('rodar duas vezes não duplica a triagem', (txt.match(/grafo é opcional/g) || []).length === 1);
  fs.writeFileSync(plan, txt.replace(/\*\*Quem faz a triagem:\*\*[\s\S]*?grafo ausente" na US\.\n/, ''));
  const old = run(f, '--no-git');
  check('base antiga sem a triagem: o passo 10 acusa com desde 2.1.0',
        /Planejamento\/README\.md — missing[\s\S]*desde 2\.1\.0/.test(old.stdout), old.stdout.slice(-500));
  cleanup(f);
}

// ── 9z. US-21: --track/--untrack — the owner decides whether the derived output is versioned.
//     The graph is synthetic (no graphify binary needed). Run the guards removed to see red.
{
  const gi = (x) => path.join(x.proj, '.gitignore');
  const readGi = (x) => fs.existsSync(gi(x)) ? fs.readFileSync(gi(x), 'utf8') : null;
  const withGraph = (x) => { fs.mkdirSync(path.join(x.proj, 'graphify-out'), { recursive: true }); fs.writeFileSync(path.join(x.proj, 'graphify-out', 'graph.json'), JSON.stringify({ directed: true, nodes: [], edges: [] })); };
  const derive = (x, ...f) => { run(x, '--no-git', '--graphify', ...f); return run(x, '--no-git', '--status', '--html', ...f); };

  // (a) no record, no flag → the line is added (compatibility)
  const a = arena('versiona-a'); run(a, '--no-git'); withGraph(a); fs.writeFileSync(gi(a), 'x\n');
  const ra = derive(a);
  check('US-21 (a): sem registro e sem flag, acrescenta graphify-out/ e .marvin/.status/', /^graphify-out\/$/m.test(readGi(a)) && /^\.marvin\/\.status\/$/m.test(readGi(a)));
  check('US-21 (a): a saída diz que assumiu `não`', /assumed `não`/.test(ra.stdout));
  cleanup(a);

  // (b) sim, in a project with NO .gitignore: step 8 creates it without the graph line; nothing is added afterwards
  const b = arena('versiona-b'); const rb0 = run(b, '--track=grafo,status'); withGraph(b);
  const giB = readGi(b);
  check('US-21 (b): o passo 8 cria o .gitignore sem graphify-out/', giB !== null && !/graphify-out/.test(giB), String(giB).slice(0, 200));
  const rec = () => fs.readFileSync(path.join(b.proj, '.marvin', 'ferramentas.md'), 'utf8');
  check('US-21: a escolha vai para o ferramentas.md', /^versiona: grafo=sim, status=sim$/m.test(rec()), rb0.stdout.slice(-300));
  const rb = derive(b);   // no flag: reads the record
  check('US-21 (b): --graphify e --status --html deixam o .gitignore byte a byte igual', readGi(b) === giB && !/chose to version/.test(rb.stdout));
  const before = rec(); run(b, '--track=grafo,status');
  check('US-21: repetir a flag não reescreve o registro', rec() === before);
  run(b, '--untrack=grafo');
  check('US-21: --untrack flipa só o item pedido', /^versiona: grafo=não, status=sim$/m.test(rec()));
  // graphify is mandatory (US-59), so the run that records `não` already builds the graph and git-ignores it: that line stays.
  const giU = readGi(b);
  run(b, '--no-git', '--graphify', '--track=grafo');
  check('US-21: a flag vence o registro', readGi(b) === giU && giU.startsWith(giB) && /^versiona: grafo=sim/m.test(rec()));
  cleanup(b);

  // (c) the line is already there and the owner chose sim → warning, nothing removed
  const c = arena('versiona-c'); run(c, '--no-git'); withGraph(c);
  const text = '# meu\ngraphify-out/\n.marvin/.status/\n'; fs.writeFileSync(gi(c), text);
  const rc = derive(c, '--track=grafo,status');
  check('US-21 (c): linha presente com sim → avisa e não remove', readGi(c) === text && /graphify-out\/ is in \.gitignore/.test(run(c, '--no-git', '--graphify').stdout));
  check('US-21 (c): o aviso do .status (writeStatusHtml) aparece sozinho, na saída do --status --html', /\.marvin\/\.status\/ is in \.gitignore but you chose to version it/.test(rc.stdout), rc.stdout.slice(-400));
  // --status --html --track holds for this run only: says so, and records nothing
  const recC = () => fs.readFileSync(path.join(c.proj, '.marvin', 'ferramentas.md'), 'utf8');
  const beforeC = recC(), rs = run(c, '--no-git', '--status', '--html', '--untrack=status');
  check('US-21: --status --html com --track avisa que vale só nesta execução e não grava', /holds for this run only/.test(rs.stdout) && recC() === beforeC, rs.stdout.slice(-300));
  // ferramentas.md without frontmatter: warns, does not record
  fs.writeFileSync(path.join(c.proj, '.marvin', 'ferramentas.md'), '# sem cabeçalho\n');
  const rn = run(c, '--no-git', '--track=grafo');
  check('US-21: ferramentas.md sem frontmatter avisa e não grava', /has no frontmatter/.test(rn.stdout) && !/versiona:/.test(fs.readFileSync(path.join(c.proj, '.marvin', 'ferramentas.md'), 'utf8')), rn.stdout.slice(-300));
  cleanup(c);

  // dry-run in a new project: the template is not on disk yet, so no false "not recorded"
  const e = arena('versiona-e'); const re = run(e, '--dry-run', '--track=grafo');
  check('US-21: dry-run com --track num projeto novo não diz "not recorded"', !/not recorded/.test(re.stdout) && /would record versiona: grafo=sim/.test(re.stdout), re.stdout.slice(-300));
  cleanup(e);

  // invalid arguments abort before ANY write
  const d = arena('versiona-d');
  const r1 = run(d, '--track=banana'), r2 = run(d, '--track=grafo', '--untrack=grafo'), r3 = run(d, '--track'), r4 = run(d, '--track=');
  check('US-21: argumento inválido, conflito, flag sem valor e --track= vazio abortam sem escrever', [r1, r2, r3, r4].every(r => r.status === 1) && files(d.proj).length === 0);
  cleanup(d);
}

// ── US-42. The cost criterion is in the generated text, "omit model to inherit" is gone, and
//     --status notices an agent that inherits the session model — a notice, never a problem.
{
  const a = arena('us42');
  run(a, '--no-git', '--no-questions');
  const rd = (...p) => fs.readFileSync(path.join(a.proj, ...p), 'utf8');
  const crit = /mesmo\s+resultado\s+com\s+o\s+menor\s+gasto/;
  check('US-42: IA.md, CLAUDE.md e README de agentes trazem o critério de custo e o fim do "omita"',
        crit.test(rd('.marvin', 'Contexto', 'IA.md')) && crit.test(rd('CLAUDE.md')) &&
        /herda\s+o\s+modelo\s+da\s+sessão/.test(rd('.claude', 'agents', 'README.md')) && !/Omita model/.test(rd('.claude', 'agents', 'README.md')));
  const ag = path.join(a.proj, '.claude', 'agents');
  const clean = run(a, '--status');
  check('US-42: sem agente, o --status não avisa', !/without model:/.test(clean.stdout));
  fs.writeFileSync(path.join(ag, 'dev.md'), '---\nname: dev\ndescription: x\ntools: Read\n---\ncorpo\n');
  fs.writeFileSync(path.join(ag, 'qa.md'), '---\nname: qa\ndescription: x\nmodel: sonnet\n---\ncorpo\n');
  fs.writeFileSync(path.join(ag, 'tl.md'), '---\nname: tl\ndescription: x\nmodel: inherit\n---\ncorpo\n');
  const w = run(a, '--status');
  check('US-42: --status avisa agente sem model: e com inherit, e não o que declara', /without model:[^\n]*\bdev\b[^\n]*\btl\b/.test(w.stdout) && !/without model:[^\n]*\bqa\b/.test(w.stdout), w.stdout.slice(-500));
  check('US-42: o aviso não muda o código de saída', w.status === clean.status);
  check('US-42: --status --curto não muda', !/without model:/.test(run(a, '--status', '--curto').stdout));
  fs.writeFileSync(path.join(ag, 'dev.md'), '---\nname: dev\nmodel: haiku\n---\n');
  fs.writeFileSync(path.join(ag, 'tl.md'), '---\nname: tl\nmodel: opus\n---\n');
  check('US-42: com model: em todos, não avisa', !/without model:/.test(run(a, '--status').stdout));
  // Base from before 2.8.0: step 10 flags the missing text, once, with desde 2.8.0.
  fs.writeFileSync(path.join(ag, 'README.md'), '# Time\n\nModelo por atividade\n');
  const old = run(a, '--no-git', '--no-questions');
  check('US-42: base antiga sem o texto novo: o passo 10 acusa com desde 2.8.0', /agents\/README\.md — missing[^\n]*desde 2\.8\.0/.test(old.stdout), old.stdout.slice(-500));
  cleanup(a);
}

// ── US-39. The first round only proposes the team: the text is generated, and an old base is flagged.
{
  const a = arena('us39');
  run(a, '--no-git', '--no-questions');
  const rd = (...p) => fs.readFileSync(path.join(a.proj, ...p), 'utf8');
  check('US-39: AGENTS.md e Planejamento/README gerados trazem a regra de proposta na primeira rodada',
        /primeira\s+rodada\s+com\s+a\s+LLM\s+depois\s+de\s+instalar/.test(rd('AGENTS.md')) &&
        /primeira\s+rodada\s+depois\s+de\s+instalar/.test(rd('.marvin', 'Planejamento', 'README.md')));
  fs.writeFileSync(path.join(a.proj, 'AGENTS.md'), '# Projeto\n');
  const old = run(a, '--no-git', '--no-questions');
  check('US-39: base antiga sem o texto novo: o passo 10 acusa com desde 2.9.0', /AGENTS\.md — missing[^\n]*desde 2\.9\.0/.test(old.stdout), old.stdout.slice(-500));
  cleanup(a);
}

// ── US-44. The generic team glossary is born once, at the layout's path, read at triage only.
{
  const a = arena('us44');
  run(a, '--no-git', '--no-questions');
  const eq = path.join(a.proj, '.marvin', 'Contexto', 'Equipe.md');
  const txt = fs.existsSync(eq) ? fs.readFileSync(eq, 'utf8') : '';
  const roles = ['tl', 'po', 'dev-front', 'dev-back', 'qa', 'scout', 'design', 'dba', 'sec', 'infra'];
  check('US-44: Contexto/Equipe.md nasce com uma linha por papel e as colunas "Quando entra" e "O que não faz"',
        roles.every(r => txt.includes('| `' + r + '` |')) && /Quando entra/.test(txt) && /O que não faz/.test(txt));
  check('US-44: o glossário traz modelo e esforço de partida por papel (dev-back no Sonnet, esforço médio)',
        /\| `dev-back` \|[^\n]*\| Sonnet · médio \|/.test(txt) && /sobe só se falhar/.test(txt));
  check('US-29: o glossário põe a sessão principal (coordenador) no Sonnet e o tl por risco, não em toda mudança',
        /\| sessão principal \|[^\n]*\| Sonnet · médio \|/.test(txt) && /\| `tl` \|[^\n]*escreve no disco de alguém/.test(txt));
  check('US-60: o glossário manda procurar primeiro no ECC e instalar só aquele agente/skill, e diz que a sessão abre no Sonnet',
        /Procure primeiro no ECC/.test(txt) && /só aquele/.test(txt) && /só escreva do zero se o ECC não tiver/i.test(txt)
        && !/Catálogo de referência, não instalação/.test(txt) && /sessão principal abre no Sonnet/.test(txt));
  const plan = fs.readFileSync(path.join(a.proj, '.marvin', 'Planejamento', 'README.md'), 'utf8');
  check('US-44: o Planejamento/README gerado não tem a tabela de papéis e linka o glossário da equipe',
        !plan.includes('| `scout` |') && /\[glossário\s+da\s+equipe\]\(\.\.\/Contexto\/Equipe\.md\)/.test(plan));
  const all = files(a.proj).filter(f => !f.startsWith('.git' + path.sep));
  const imported = all.filter(f => /@\S*Equipe\.md/.test(fs.readFileSync(path.join(a.proj, f), 'utf8')));
  check('US-44: nenhum arquivo gerado importa o glossário com @, e ele não cria nada em .claude/agents/',
        imported.length === 0 && !all.some(f => f.includes('Equipe') && f.startsWith('.claude')), imported.join(', '));
  check('US-44: o AGENTS.md gerado aponta o glossário por caminho, não por @',
        /glossário da equipe \(`\.marvin\/Contexto\/Equipe\.md`\)/.test(fs.readFileSync(path.join(a.proj, 'AGENTS.md'), 'utf8')));
  const again = run(a, '--no-git', '--no-questions');
  check('US-44: a segunda rodada numa base nova não imprime o passo 10 (nenhuma marca órfã)', !/10\. Updates/.test(again.stdout), again.stdout.slice(-400));
  // Old base: the glossary is a new file (created); the planning README is the owner's (only flagged, byte-identical).
  fs.rmSync(eq);
  const pr = path.join(a.proj, '.marvin', 'Planejamento', 'README.md');
  const oldPlan = '# Planejamento\n\ndeclaração não prova acesso\ngrafo é opcional\nCódigo tocado\nrefinada\nprimeira rodada depois de instalar\n';
  fs.writeFileSync(pr, oldPlan);
  const old = run(a, '--no-git', '--no-questions');
  check('US-44: base antiga recebe o glossário, só o aviso (desde 3.0.0) no Planejamento/README, que fica byte-idêntico',
        fs.existsSync(eq) && /Planejamento\/README\.md — missing[^\n]*desde 3\.0\.0/.test(old.stdout)
        && fs.readFileSync(pr, 'utf8') === oldPlan, old.stdout.slice(-500));
  cleanup(a);

  const b = arena('us44-antigo');
  fs.mkdirSync(path.join(b.proj, '.marvin', '08_Memoria'), { recursive: true });
  run(b, '--no-git', '--no-questions');
  check('US-44: no layout antigo o glossário nasce na raiz de .marvin/ e Contexto/ não nasce',
        fs.existsSync(path.join(b.proj, '.marvin', 'Equipe.md')) && !fs.existsSync(path.join(b.proj, '.marvin', 'Contexto')));
  cleanup(b);
}

// ── Role without an agent file: the glossary says to pass the model; --status warns about Opus turns.
{
  const a = arena('semarquivo');
  run(a, '--no-git', '--no-questions');
  const eq = path.join(a.proj, '.marvin', 'Contexto', 'Equipe.md');
  check('Equipe.md gerado traz "Papel sem arquivo de agente" com o parâmetro model',
        /\*\*Papel sem arquivo de agente:\*\*[^\n]*`model`[^\n]*herda o modelo da sessão/.test(fs.readFileSync(eq, 'utf8')));
  const oldTxt = '# Glossário da equipe\n\n**Regra do sênior:** começa no degrau mais barato.\n';
  fs.writeFileSync(eq, oldTxt);
  const old = run(a, '--no-git', '--no-questions');
  check('Equipe.md antigo: passo 10 acusa desde 3.2.0 e não reescreve',
        /Equipe\.md — missing[^\n]*desde 3\.2\.0/.test(old.stdout) && fs.readFileSync(eq, 'utf8') === oldTxt, old.stdout.slice(-500));
  const dir = path.dirname(memoryPath(a.lar, a.proj));
  const sd = path.join(dir, 's1', 'subagents'); fs.mkdirSync(sd, { recursive: true });
  const turn = (model) => JSON.stringify({ type: 'assistant', timestamp: '2026-09-11T10:00:00Z', sessionId: 's1', isSidechain: true,
    message: { id: 'msg_g', model, usage: { input_tokens: 10, output_tokens: 100 } } }) + NLQ;
  fs.writeFileSync(path.join(sd, 'agent-g.meta.json'), JSON.stringify({ agentType: 'general-purpose' }));
  fs.writeFileSync(path.join(sd, 'agent-g.jsonl'), turn('claude-opus-5'));
  const opus = run(a, '--status');
  check('--status avisa subagente sem papel no Opus', /1 turno\(s\) de subagente sem papel no Opus \(≈ \$0\.00\)[^\n]*Equipe\.md/.test(opus.stdout), opus.stdout.slice(-500));
  fs.writeFileSync(path.join(sd, 'agent-g.jsonl'), turn('claude-sonnet-5'));
  const son = run(a, '--status');
  check('--status não avisa quando o subagente sem papel está no Sonnet', !/subagente sem papel no Opus/.test(son.stdout) && /general-purpose/.test(son.stdout), son.stdout.slice(-500));
  cleanup(a);
}

// ── US-52. `estado: anotada` is visible: counted in --status, only a number in the hook.
{
  const a = arena('us52');
  run(a, '--no-git', '--no-questions');
  run(a, '--us', 'Novos/P/F/US-01-nota-x');
  const sb = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'P', 'F', 'US-01-nota-x', 'Sobre.md');
  fs.writeFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), '# Onde paramos\n');   // an anotada is never in the note
  const orig = fs.readFileSync(sb, 'utf8');
  const nLines = (o) => o.stdout.split('\n').filter(l => l.trim()).length;
  fs.writeFileSync(sb, orig.replace('estado: ativa', 'estado: cancelada'));
  const semCurto = nLines(run(a, '--status', '--curto'));
  check('US-52: sem anotada, o --curto não tem a linha nova', !/anotada/.test(run(a, '--status', '--curto').stdout));
  fs.writeFileSync(sb, orig.replace('estado: ativa', 'estado: anotada'));
  const full = run(a, '--status').stdout, curto = run(a, '--status', '--curto');
  check('US-52: a US anotada aparece no --status completo (contagem por epic)', /1 anotada\(s\)/.test(full), full.slice(-500));
  check('US-52: no --curto só o número, numa linha; o nome da US não aparece', /1 anotada\(s\) fora da fila/.test(curto.stdout) && !/nota-x/.test(curto.stdout), curto.stdout);
  check('US-52: com anotada o --curto cresce exatamente uma linha', nLines(curto) === semCurto + 1, nLines(curto) + ' vs ' + semCurto);
  run(a, '--status', '--html');
  const html = fs.readFileSync(path.join(a.proj, '.marvin', '.status', 'index.html'), 'utf8');
  check('US-52: o painel tem o grupo Anotadas com link para a US', /<h3>Anotadas<\/h3><ul><li><a href="[^"]*US-01-nota-x\/Sobre\.md"/.test(html));
  cleanup(a);
}

// ── Ceilings in the hook + pointers to context files (not US).
{
  const a = arena('teto-hook');
  run(a, '--no-git', '--no-questions');
  const normal = run(a, '--status', '--curto').stdout;
  check('teto no hook: base normal não tem a linha do contexto fixo', !/contexto fixo/.test(normal) && !/onde_paramos\.md \d+ KB/.test(normal), normal);
  fs.appendFileSync(path.join(a.proj, 'AGENTS.md'), '\n' + 'x'.repeat(26000) + '\n');
  const big = run(a, '--status', '--curto');
  check('teto no hook: AGENTS.md grande → UMA linha de contexto fixo, sai 0', big.status === 0 && (big.stdout.match(/contexto fixo ~\d+ tk \(teto ~6000\)/g) || []).length === 1, big.stdout);
  fs.writeFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), '# Onde paramos\n\n' + 'y'.repeat(7 * 1024) + '\n');
  const nota = run(a, '--status', '--curto').stdout;
  check('teto no hook: nota acima de NOTE_CEILING avisa', /onde_paramos\.md \d+ KB — é lista de ponteiros/.test(nota), nota);
  cleanup(a);
}
{
  const a = arena('ponteiro-contexto');
  run(a, '--no-git', '--no-questions');
  fs.mkdirSync(path.join(a.proj, '.marvin', 'Contexto'), { recursive: true });
  fs.writeFileSync(path.join(a.proj, '.marvin', 'Contexto', 'x.md'), '# Canal x\n\nso contexto\n');
  fs.writeFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), '# Onde paramos\n\n- [canal x](../Contexto/x.md) — referência\n- [sumiu](../Contexto/nao-existe.md)\n');
  const full = run(a, '--status').stdout, curto = run(a, '--status', '--curto').stdout;
  check('ponteiro para contexto: sem ✗ para ele e com a linha agregada', !/✗[^\n]*Canal x/.test(full) && /1 ponteiro\(s\) para contexto \(não US\) na nota: x/.test(full), full);
  check('ponteiro para contexto: alvo inexistente continua erro', /nao-existe\.md/.test(full) && /not found/.test(full));
  check('ponteiro para contexto: o --curto não lista', !/ponteiro\(s\) para contexto/.test(curto), curto);
  cleanup(a);
}

// ── US-59. graphify, ponytail and ecc are mandatory: the ones the machine lacks install themselves, no flag.
// Dry-run honest, failure = warning + exit 0. Hermetic: fake `claude` and `uv` that log every call.
{
  const a = arena('us59');
  run(a, '--no-git', '--no-questions');   // the record is born `sim` for all three; the installs fail (failing fake claude/uv)
  const snap = () => JSON.stringify([files(a.proj), files(a.lar)]);
  const PT = 'claude plugin install ponytail --scope project';
  const before = snap();
  const dry = run(a, '--no-git', '--no-questions', '--dry-run');
  check('US-59: --dry-run (sem flag) lista os installs dos obrigatórios (graphify e o catálogo ECC) e não o do ponytail',
        dry.status === 0 && !/DietrichGebert\/ponytail/.test(dry.stdout) && !new RegExp('run +' + PT).test(dry.stdout)
        && /run +uv tool install graphifyy/.test(dry.stdout) && /run +claude plugin marketplace add affaan-m\/ECC --scope project/.test(dry.stdout), dry.stdout.slice(-700));
  check('US-59: --dry-run não escreve nada', snap() === before);
  // Fake `claude` and `uv` that log each call (a regression must never reach the REAL ones).
  const fake = fs.mkdtempSync(path.join(os.tmpdir(), 'marvin-teste-claude-'));
  const logf = path.join(fake, 'chamadas.log');
  const logging = () => {
    fs.writeFileSync(path.join(fake, 'claude'), '#!/bin/sh\necho "claude $@" >> "' + logf + '"\n', { mode: 0o755 });
    fs.writeFileSync(path.join(fake, 'claude.cmd'), '@echo claude %* >> "' + logf + '"\r\n');
    fs.writeFileSync(path.join(fake, 'uv'), '#!/bin/sh\necho "uv $@" >> "' + logf + '"\n', { mode: 0o755 });
    fs.writeFileSync(path.join(fake, 'uv.cmd'), '@echo uv %* >> "' + logf + '"\r\n');
  };
  logging();
  const calls = () => fs.existsSync(logf) ? fs.readFileSync(logf, 'utf8').split(/\r?\n/).map(l => l.trim()).filter(Boolean) : [];
  const comFake = (...flags) => spawnSync(process.execPath, [SCRIPT, '--no-git', '--no-questions', ...flags], {
    cwd: a.proj, encoding: 'utf8', env: { ...hermeticEnv(), HOME: a.lar, USERPROFILE: a.lar, ...pathWith(fake + path.delimiter + NO_GRAPHIFY) },
  });
  const r1 = comFake();
  const c1 = calls();
  check('US-59: sem nenhuma flag o marvin instala o que falta, na ordem (graphify, catálogo ECC), sem ponytail',
        r1.status === 0 && c1.length === 2 && /^uv tool install graphifyy/.test(c1[0]) && /marketplace add affaan-m\/ECC --scope project/.test(c1[1])
        && !c1.some(l => /ponytail/.test(l)), r1.stdout.slice(-500) + JSON.stringify(c1));
  { const k = calls().length; const ri = comFake('--install'); const c2 = calls().slice(k);
    check('US-59: --install continua aceita e faz o mesmo (graphify e ECC; o `não` do ponytail é respeitado)', ri.status === 0 && c2.length === 2 && !c2.some(l => /ponytail/.test(l)), JSON.stringify(c2)); }

  // Missing commands: PATH with an empty directory, so neither `claude` nor `uv` exist (the shell itself is found by absolute path).
  const vazio = fs.mkdtempSync(path.join(os.tmpdir(), 'marvin-teste-vazio-'));
  const semClaude = spawnSync(process.execPath, [SCRIPT, '--no-git', '--no-questions'], {
    cwd: a.proj, encoding: 'utf8', env: { ...hermeticEnv(), HOME: a.lar, USERPROFILE: a.lar, [PATH_KEY]: vazio },
  });
  check('US-59: `claude` e `uv` ausentes do PATH: sai 0, um aviso por install, não aborta',
        semClaude.status === 0 && /graphify: `uv tool install graphifyy` failed/.test(semClaude.stdout) && /ecc: `claude plugin marketplace add affaan-m\/ECC[^\n]*failed/.test(semClaude.stdout),
        semClaude.status + ' ' + semClaude.stdout.slice(-600) + semClaude.stderr);
  fs.rmSync(vazio, { recursive: true, force: true });

  // Everything detected → the next run executes nothing. Detection is simulated inside the hermetic home.
  const n0 = calls().length;
  const plug = path.join(a.lar, '.claude');
  fs.mkdirSync(path.join(plug, 'plugins', 'marketplaces', 'ecc', 'agents'), { recursive: true });
  fs.writeFileSync(path.join(plug, 'plugins', 'installed_plugins.json'), '{"plugins":{"ponytail@x":[{"scope":"user"}]}}\n');
  fs.writeFileSync(path.join(plug, '.ponytail-active'), 'full\n');
  fakeGraphify(fake, 0);   // a graphify that works, ahead of everything; it also resets the claude/uv stubs, so log again
  logging();
  const r3 = comFake();
  check('US-59: com os três detectados, a execução seguinte não roda nenhum exec', r3.status === 0 && calls().length === n0, JSON.stringify(calls().slice(n0)) + r3.stdout.slice(-400));
  fs.rmSync(fake, { recursive: true, force: true });
  cleanup(a);

  // US-71: old `sim` record + plugin absent. Without --install nothing is installed (only the hint); with it, both steps run.
  {
    const u = arena('us71-sim');
    run(u, '--no-git', '--no-questions', '--use=ponytail');   // the record gets `sim` on request
    const fk2 = fs.mkdtempSync(path.join(os.tmpdir(), 'marvin-teste-claude-'));
    const lg = path.join(fk2, 'chamadas.log');
    fs.writeFileSync(path.join(fk2, 'claude'), '#!/bin/sh\necho "claude $@" >> "' + lg + '"\n', { mode: 0o755 });
    fs.writeFileSync(path.join(fk2, 'claude.cmd'), '@echo claude %* >> "' + lg + '"\r\n');
    fs.writeFileSync(path.join(fk2, 'uv'), '#!/bin/sh\necho "uv $@" >> "' + lg + '"\n', { mode: 0o755 });
    fs.writeFileSync(path.join(fk2, 'uv.cmd'), '@echo uv %* >> "' + lg + '"\r\n');
    const ct = () => fs.existsSync(lg) ? fs.readFileSync(lg, 'utf8').split(/\r?\n/).map(l => l.trim()).filter(Boolean) : [];
    const go = (...fl) => spawnSync(process.execPath, [SCRIPT, '--no-git', '--no-questions', ...fl], {
      cwd: u.proj, encoding: 'utf8', env: { ...hermeticEnv(), HOME: u.lar, USERPROFILE: u.lar, ...pathWith(fk2 + path.delimiter + NO_GRAPHIFY) },
    });
    const g1 = go();
    check('US-71: registro `sim` antigo + plugin ausente, sem --install: nenhum `claude plugin install ponytail` e a dica aparece',
          g1.status === 0 && !ct().some(l => /ponytail/.test(l)) && /ponytail not found/.test(g1.stdout) && /claude plugin install ponytail/.test(g1.stdout), g1.stdout.slice(-500) + JSON.stringify(ct()));
    const antes = ct().length;
    const g2 = go('--install');
    const novos = ct().slice(antes).filter(l => /ponytail/.test(l));
    check('US-71: registro `sim` + plugin ausente, com --install: os dois passos (marketplace add e plugin install)',
          g2.status === 0 && novos.length === 2 && /marketplace add DietrichGebert\/ponytail/.test(novos[0]) && /plugin install ponytail --scope project/.test(novos[1]), g2.stdout.slice(-500) + JSON.stringify(novos));
    fs.rmSync(fk2, { recursive: true, force: true });
    cleanup(u);

    const v = arena('us71-nao');
    const rv1 = run(v, '--no-git', '--no-questions');
    const rv2 = run(v, '--no-git', '--no-questions');
    check('US-71: registro `não` não imprime MANDATORY (nem na primeira rodada, nem na seguinte)',
          /^\| ponytail \| não \|/m.test(fs.readFileSync(path.join(v.proj, '.marvin', 'ferramentas.md'), 'utf8'))
          && !/MANDATORY/.test(rv1.stdout.split('\n').filter(l => /ponytail/i.test(l)).join('\n'))
          && !/MANDATORY/.test(rv2.stdout.split('\n').filter(l => /ponytail/i.test(l)).join('\n')), rv1.stdout.slice(-400) + rv2.stdout.slice(-400));
    cleanup(v);
  }

  // The plugin CLI creates .claude/settings.json: the install must run AFTER marvin's SessionStart hook is written.
  const b = arena('us59-hook');
  const fk = fs.mkdtempSync(path.join(os.tmpdir(), 'marvin-teste-claude-'));
  fs.writeFileSync(path.join(fk, 'claude'), '#!/bin/sh\n[ -f .claude/settings.json ] || { mkdir -p .claude; echo \'{"x":1}\' > .claude/settings.json; }\n', { mode: 0o755 });
  fs.writeFileSync(path.join(fk, 'claude.cmd'), '@if not exist .claude\\settings.json (mkdir .claude 2>nul & echo {"x":1}> .claude\\settings.json)\r\n');
  const rh = spawnSync(process.execPath, [SCRIPT, '--no-git', '--no-questions'], {
    cwd: b.proj, encoding: 'utf8', env: { ...hermeticEnv(), HOME: b.lar, USERPROFILE: b.lar, ...pathWith(fk + path.delimiter + NO_GRAPHIFY) },
  });
  let cfg = ''; try { cfg = fs.readFileSync(path.join(b.proj, '.claude', 'settings.json'), 'utf8'); } catch {}
  check('US-59: projeto novo: o settings.json final tem o hook SessionStart do marvin (o install do plugin não o atropela)',
        rh.status === 0 && /SessionStart/.test(cfg) && /--status --curto/.test(cfg), cfg + rh.stdout.slice(-500));
  fs.rmSync(fk, { recursive: true, force: true });
  cleanup(b);
}

// ── US-60. ECC is the source of the team: ONLY the agents/skills the project uses are copied from the catalog
// clone, with the cost matrix on top, and never what is already there. The ECC installer is NOT used: it brings
// the whole module (measured: 67 agents, 94 commands, 122 rules, 116 skills for one `--with`). Hermetic: a fake
// catalog whose `scripts/install-apply.js` leaves a marker if anyone runs it, plus commands/rules/hooks that must not arrive.
{
  const agent = (name, model, desc) => '---\nname: ' + name + '\ndescription: ' + desc + '\ntools: Read, Grep, Glob, Bash\nmodel: ' + model + '\n---\n\n# ' + name + '\n';
  const catalog = (marker) => ({
    'agents/code-reviewer.md': agent('code-reviewer', 'opus', 'Expert code review specialist. Proactively reviews code. Use immediately after writing code. MUST BE USED for all code changes.'),
    'agents/tdd-guide.md': agent('tdd-guide', 'opus', 'TDD specialist. Use PROACTIVELY when writing new features. Ensures 80%+ test coverage.'),
    'agents/typescript-reviewer.md': agent('typescript-reviewer', 'sonnet', 'TypeScript reviewer. Use for all TypeScript changes. MUST BE USED for TypeScript projects.'),
    'agents/build-error-resolver.md': agent('build-error-resolver', 'sonnet', 'Build error specialist. Use for all build failures. MUST BE USED for broken builds. Use PROACTIVELY when build fails.'),
    'agents/python-reviewer.md': agent('python-reviewer', 'sonnet', 'Python reviewer. MUST BE USED for Python projects.'),
    'agents/planner.md': agent('planner', 'opus', 'Planning. Use PROACTIVELY. Automatically activated for planning tasks.'),
    'skills/python-patterns/SKILL.md': '---\nname: python-patterns\ndescription: Python idioms\n---\n',
    'skills/python-patterns/ref/extra.md': 'extra\n',
    'commands/plan.md': 'a command that must not arrive\n',
    'rules/common.md': 'an always-loaded rule that must not arrive\n',
    'hooks/hooks.json': '{"hooks":{}}\n',
    'scripts/install-apply.js': 'require("fs").writeFileSync(' + JSON.stringify(marker) + ', process.argv.slice(2).join(" "));\n',
  });
  const rd = (x, ...p) => fs.readFileSync(path.join(x.proj, ...p), 'utf8');
  const has = (x, id) => fs.existsSync(path.join(x.proj, '.claude', 'agents', id + '.md'));

  // a TypeScript project
  const a = arena('us60-ts');
  fs.writeFileSync(path.join(a.proj, 'tsconfig.json'), '{}\n');
  fs.writeFileSync(path.join(a.proj, 'package.json'), '{"name":"cobaia","scripts":{"build":"tsc"}}\n');   // scripts.build is what brings the build-resolver (US-69)
  const marker = path.join(a.base, 'install-apply-invocado.txt');
  equipped(a, catalog(marker));
  const r = run(a, '--no-git', '--no-questions');
  check('US-60: projeto TS com scripts.build recebe tdd-guide e build-error-resolver, e só eles (US-69: sem code-reviewer nem typescript-reviewer)',
        r.status === 0 && ['tdd-guide', 'build-error-resolver'].every(id => has(a, id)) && !has(a, 'code-reviewer') && !has(a, 'typescript-reviewer') && !has(a, 'python-reviewer') && !has(a, 'planner'), r.stdout.slice(-600));
  const rec = rd(a, '.marvin', 'ferramentas.md');
  check('US-60: o registro ganha `| ecc | sim | componentes: … |` com os componentes escolhidos',
        /^\| ecc \| sim \| componentes: agent:tdd-guide, lang:typescript /m.test(rec), rec.slice(-500));
  const cr = rd(a, '.claude', 'agents', 'build-error-resolver.md');
  check('US-60: o agente instalado sai com model: sonnet, effort: medium e sem "MUST BE USED"/"Proactively"/"Use immediately"',
        /^model: sonnet$/m.test(cr) && !/^model: opus/m.test(cr) && /^effort: medium$/m.test(cr) && !/MUST BE USED|proactively|use immediately/i.test(cr)
        && /^description: Build error specialist\. Chame quando a linha do Time indicar este papel\.$/m.test(cr), cr);
  check('US-60: o corpo do agente fica como veio', /\n# build-error-resolver\n/.test(cr) && /^tools: Read, Grep, Glob, Bash$/m.test(cr));
  const tdd = rd(a, '.claude', 'agents', 'tdd-guide.md');
  check('US-60: tdd-guide também (opus vira sonnet · medium; a descrição fica só com a 1ª frase — o resto é gatilho)',
        /^model: sonnet$/m.test(tdd) && /^effort: medium$/m.test(tdd) && !/PROACTIVELY|Ensures 80%/.test(tdd), tdd);
  check('3.4.0: "Use for all …", "MUST BE USED …" e qualquer frase de gatilho depois da 1ª saem (mapeado no catálogo inteiro)',
        !/Use for all|build failures|broken builds/.test(cr) && /^description: Build error specialist\. Chame quando a linha do Time indicar este papel\.$/m.test(cr), cr);
  const outsiders = ['commands/plan.md', 'rules/common.md', 'hooks/hooks.json'].filter(p => fs.existsSync(path.join(a.proj, '.claude', ...p.split('/'))));
  const hookKeys = Object.keys(JSON.parse(rd(a, '.claude', 'settings.json')).hooks || {});
  check('US-60: nenhum comando, regra ou hook do ECC chega ao projeto; o instalador do ECC nunca é chamado',
        outsiders.length === 0 && hookKeys.join() === 'SessionStart' && !fs.existsSync(marker), outsiders.join(', ') + ' ' + hookKeys);
  const treeAgents = () => JSON.stringify(fs.readdirSync(path.join(a.proj, '.claude', 'agents')).sort().map(f => [f, rd(a, '.claude', 'agents', f)]));
  const t1 = treeAgents();
  run(a, '--no-git', '--no-questions');
  check('US-60: rodar de novo não duplica nem reescreve nada', treeAgents() === t1);
  cleanup(a);

  // an agent that already existed is the human's
  const d = arena('us60-existente');
  fs.writeFileSync(path.join(d.proj, 'tsconfig.json'), '{}\n');
  equipped(d, catalog(path.join(d.base, 'm.txt')));
  fs.mkdirSync(path.join(d.proj, '.claude', 'agents'), { recursive: true });
  const mine = agent('tdd-guide', 'opus', 'O meu guia. MUST BE USED nas minhas regras.');
  fs.writeFileSync(path.join(d.proj, '.claude', 'agents', 'tdd-guide.md'), mine);
  const rdx = run(d, '--no-git', '--no-questions');
  check('US-60: agente que já existia não é tocado (continua opus e com a frase dele)',
        rd(d, '.claude', 'agents', 'tdd-guide.md') === mine && /tdd-guide\.md already exists/.test(rdx.stdout), rdx.stdout.slice(-500));
  cleanup(d);

  // skills are copied whole (the folder), and only the ones the stack asks for
  const p = arena('us60-py');
  fs.rmSync(path.join(p.proj, 'package.json'));   // the arena's Node marker would also bring the TypeScript pair
  fs.writeFileSync(path.join(p.proj, 'requirements.txt'), 'flask\n');
  equipped(p, catalog(path.join(p.base, 'm.txt')));
  run(p, '--no-git', '--no-questions');
  check('US-60: projeto Python recebe a skill python-patterns inteira (com subpasta); o python-reviewer saiu na US-69',
        !has(p, 'python-reviewer') && fs.existsSync(path.join(p.proj, '.claude', 'skills', 'python-patterns', 'ref', 'extra.md')) && !has(p, 'typescript-reviewer'));
  cleanup(p);

  // dry-run: the plan lists the copies and writes nothing
  const f = arena('us60-dry');
  fs.writeFileSync(path.join(f.proj, 'tsconfig.json'), '{}\n');
  equipped(f, catalog(path.join(f.base, 'm.txt')));
  const snapF = () => JSON.stringify([files(f.proj), files(f.lar).filter(x => !x.includes('marketplaces'))]);
  const bf = snapF();
  const df = run(f, '--no-git', '--no-questions', '--dry-run');
  check('US-60: --dry-run lista os agentes que viriam e não escreve nada',
        df.status === 0 && /create file +\.claude[\\/]agents[\\/]tdd-guide\.md/.test(df.stdout) && snapF() === bf && !fs.existsSync(path.join(f.proj, '.claude')), df.stdout.slice(-700));
  cleanup(f);

  // the catalog is missing and cannot be installed: a warning, not an abort, and nothing invented
  const g = arena('us60-sem-catalogo');
  const rg = run(g, '--no-git', '--no-questions');
  check('US-60: sem catálogo (e o install falhando) avisa, sai 0 e não cria agente nenhum',
        rg.status === 0 && /ecc: catalog not found/.test(rg.stdout) && !has(g, 'tdd-guide'), rg.stdout.slice(-500));
  cleanup(g);

  // capabilities follow what the project has
  const h = arena('us60-cap');
  fs.mkdirSync(path.join(h.proj, 'migrations'), { recursive: true });
  fs.writeFileSync(path.join(h.proj, 'package.json'), JSON.stringify({ dependencies: { jsonwebtoken: '9' } }));
  equipped(h, { ...catalog(path.join(h.base, 'm.txt')), 'agents/database-reviewer.md': agent('database-reviewer', 'sonnet', 'DB.'), 'agents/security-reviewer.md': agent('security-reviewer', 'sonnet', 'Sec. Use PROACTIVELY.') });
  run(h, '--no-git', '--no-questions');
  check('US-60: migrations/ traz o database-reviewer e jsonwebtoken traz o security-reviewer',
        has(h, 'database-reviewer') && has(h, 'security-reviewer') && /capability:database, capability:security/.test(rd(h, '.marvin', 'ferramentas.md')));
  cleanup(h);
}

// ── US-69. The triage calls ECC agents when the stage matches; ECC_PLAN stops installing what the stack does not ask for;
// `ecc fora: <id>` in ferramentas.md is the human's exclusion list (never recopied, never "missing").
{
  const agent = (name) => '---\nname: ' + name + '\ndescription: ' + name + ' agent.\ntools: Read, Grep, Glob, Bash\nmodel: sonnet\n---\n\n# ' + name + '\n';
  const ids = ['tdd-guide', 'code-reviewer', 'typescript-reviewer', 'build-error-resolver', 'python-reviewer', 'security-reviewer', 'database-reviewer'];
  const catalog = () => Object.fromEntries(ids.map(id => ['agents/' + id + '.md', agent(id)]));
  const has = (x, id) => fs.existsSync(path.join(x.proj, '.claude', 'agents', id + '.md'));
  const rd = (x, ...p) => fs.readFileSync(path.join(x.proj, ...p), 'utf8');
  const node = (name, pkg) => {
    const x = arena(name);
    fs.writeFileSync(path.join(x.proj, 'package.json'), JSON.stringify(pkg));
    return equipped(x, catalog());
  };

  // 1. plain Node
  const a = node('us69-puro', { name: 'cobaia' });
  const ra = run(a, '--no-git', '--no-questions');
  check('US-69: Node puro (sem typescript, sem scripts.build) recebe tdd-guide e NÃO recebe code-reviewer, typescript-reviewer nem build-error-resolver',
        ra.status === 0 && has(a, 'tdd-guide') && !has(a, 'code-reviewer') && !has(a, 'typescript-reviewer') && !has(a, 'build-error-resolver'),
        ['tdd-guide', 'code-reviewer', 'typescript-reviewer', 'build-error-resolver'].map(i => i + '=' + has(a, i)).join(' '));

  // 2. scripts.build vs a dependency named "build"
  const b = node('us69-build', { name: 'cobaia', scripts: { build: 'tsc' } });
  run(b, '--no-git', '--no-questions');
  check('US-69: Node com scripts.build recebe build-error-resolver', has(b, 'build-error-resolver'));
  const b2 = node('us69-build-dep', { name: 'cobaia', dependencies: { build: '1.0.0' } });
  run(b2, '--no-git', '--no-questions');
  check('US-69: "build" só como dependência não traz build-error-resolver (o critério é scripts.build)', !has(b2, 'build-error-resolver'));
  cleanup(b); cleanup(b2);

  // 3. Python
  const p = arena('us69-py');
  fs.rmSync(path.join(p.proj, 'package.json'));
  fs.writeFileSync(path.join(p.proj, 'requirements.txt'), 'flask\n');
  equipped(p, catalog());
  run(p, '--no-git', '--no-questions');
  check('US-69: projeto Python não recebe python-reviewer (não há etapa de revisão de linguagem)', !has(p, 'python-reviewer') && !has(p, 'code-reviewer'));
  cleanup(p);

  // 4. `ecc fora:`
  const ferr = path.join(a.proj, '.marvin', 'ferramentas.md');
  fs.rmSync(path.join(a.proj, '.claude', 'agents', 'tdd-guide.md'));
  fs.appendFileSync(ferr, '\necc fora: tdd-guide\n');
  const r4 = run(a, '--no-git', '--no-questions');
  check('US-69: `ecc fora: tdd-guide` — a 2ª rodada não recopia o agente', r4.status === 0 && !has(a, 'tdd-guide'), r4.stdout.slice(-400));
  const st = run(a, '--status', '--curto').stdout + run(a, '--status').stdout + run(a, '--check').stdout;
  check('US-69: id em `ecc fora:` não aparece como "agente do ECC faltando" no --status/--check', !/agentes? do ECC faltando/.test(st), st.slice(-500));

  // 4b. the line formatted as the templates show it (backticks, list item) excludes just the same
  for (const [nome, linha] of [['em crase', '`ecc fora: tdd-guide`'], ['com crase nos ids', 'ecc fora: `tdd-guide`, `outro`'], ['item de lista', '- ecc fora: tdd-guide']]) {
    const x = node('us69-fora', { name: 'cobaia' });
    run(x, '--no-git', '--no-questions');
    fs.rmSync(path.join(x.proj, '.claude', 'agents', 'tdd-guide.md'));
    fs.appendFileSync(path.join(x.proj, '.marvin', 'ferramentas.md'), '\n' + linha + '\n');
    const rx = run(x, '--no-git', '--no-questions');
    check('US-69: `ecc fora:` ' + nome + ' também exclui (não recopia)', rx.status === 0 && !has(x, 'tdd-guide'), rx.stdout.slice(-300));
    cleanup(x);
  }

  // 5. a second run with nothing to change writes nothing
  const snap = () => JSON.stringify(files(a.proj).map(f => [f, fs.statSync(path.join(a.proj, f)).mtimeMs]));
  const before = snap();
  run(a, '--no-git', '--no-questions');
  const dry = run(a, '--no-git', '--no-questions', '--dry-run');
  check('US-69: 2ª rodada sem mudança não escreve nada (--dry-run: nothing to do)', snap() === before && /nothing to do/.test(dry.stdout), dry.stdout.slice(-400));
  cleanup(a);

  // 6. the generic rule lands in the three generated templates
  const t = equipped(arena('us69-tpl'));
  run(t, '--no-git', '--no-questions');
  for (const rel of [['.marvin', 'Contexto', 'Equipe.md'], ['.claude', 'commands', 'refinar.md'], ['.claude', 'commands', 'us.md']]) {
    const txt = fs.existsSync(path.join(t.proj, ...rel)) ? rd(t, ...rel) : '';
    check('US-69: ' + rel.join('/') + ' traz a regra "etapa casa com o verbo" e o `ecc fora:`',
          /etapa\s+casa\s+com\s+o\s+verbo/.test(txt) && /ecc fora:/.test(txt), txt ? '' : 'arquivo ausente');
  }

  // 7. the ecc scope in the generated registry no longer claims "reference only"
  check('US-69: o alcance do `ecc` no ferramentas.md não diz "Catálogo de referência, não instalação"',
        !/Catálogo de referência, não instalação/.test(rd(t, '.marvin', 'ferramentas.md')) && /\| ecc \|/.test(rd(t, '.marvin', 'ferramentas.md')));
  cleanup(t);
}

// ── US-63. A skill cited as `/<id>` in CLAUDE.md/AGENTS.md/.claude/commands comes from the ECC catalog when the project lacks it.
{
  const skillDir = (x, id) => path.join(x.proj, '.claude', 'skills', id);
  const x = equipped(arena('us63'), { 'skills/council/SKILL.md': '---\nname: council\ndescription: council.\n---\n# council\n', 'skills/council/extra/nota.md': 'x\n' });
  run(x, '--no-git', '--no-questions');
  const claude = path.join(x.proj, 'CLAUDE.md');
  fs.appendFileSync(claude, '\nPara decidir, use `/council`; fluxo: `/retomar`; sem catálogo: `/fantasma`.\n');

  // --check names both citations (and not /retomar), exit != 0
  const ck = run(x, '--check');
  check('US-63: --check nomeia `/council` (ECC tem) e `/fantasma` (ECC não tem), não `/retomar`, e sai != 0',
        ck.status === 0 && /`\/council` citado no CLAUDE\.md, ausente[^\n]*o ECC tem: rode `marvin`/.test(ck.stdout + ck.stderr)
        && /`\/fantasma` citado no CLAUDE\.md[^\n]*o ECC não tem/.test(ck.stdout + ck.stderr) && !/`\/retomar` citado/.test(ck.stdout + ck.stderr),
        (ck.stdout + ck.stderr).slice(-600));

  const dry = run(x, '--no-git', '--no-questions', '--dry-run');
  check('US-63: --dry-run não copia a skill citada', dry.status === 0 && !fs.existsSync(skillDir(x, 'council')), dry.stdout.slice(-300));

  const r = run(x, '--no-git', '--no-questions');
  const out = r.stdout + r.stderr;
  check('US-63: a skill citada que o ECC tem é copiada inteira (com subpasta)',
        r.status === 0 && fs.existsSync(path.join(skillDir(x, 'council'), 'SKILL.md')) && fs.existsSync(path.join(skillDir(x, 'council'), 'extra', 'nota.md')), out.slice(-400));
  check('US-63: citação sem catálogo avisa pelo nome e não cria arquivo; `/retomar` não avisa',
        /`\/fantasma` cited/.test(out) && !fs.existsSync(skillDir(x, 'fantasma')) && !/`\/retomar` cited/.test(out), out.slice(-500));
  check('US-63: depois da cópia o --check só reclama da que o ECC não tem', !/`\/council` citado/.test(run(x, '--check').stdout));

  const snap = () => JSON.stringify(files(x.proj).map(f => [f, fs.statSync(path.join(x.proj, f)).mtimeMs]));
  const before = snap();
  run(x, '--no-git', '--no-questions');
  check('US-63: 2ª rodada não muda nada', snap() === before);

  // `ecc fora:` keeps the cited id out
  fs.rmSync(skillDir(x, 'council'), { recursive: true });
  fs.appendFileSync(path.join(x.proj, '.marvin', 'ferramentas.md'), '\necc fora: council\n');
  run(x, '--no-git', '--no-questions');
  check('US-63: id em `ecc fora:` não volta pela citação', !fs.existsSync(skillDir(x, 'council')));
  cleanup(x);

  // the generated glossary carries the trigger
  const t = equipped(arena('us63-tpl'));
  run(t, '--no-git', '--no-questions');
  const eq = fs.readFileSync(path.join(t.proj, '.marvin', 'Contexto', 'Equipe.md'), 'utf8');
  check('US-63: Equipe.md traz o gatilho `Unknown skill /x` com caminho `~/`, sem caminho absoluto',
        /Unknown\s+skill\s+\/x/.test(eq) && /cp -r ~\/\.claude\/plugins\/marketplaces\/ecc\/skills\/x/.test(eq) && !eq.includes(t.lar));
  cleanup(t);
}

// ── US-61. The main session opens on Sonnet:`.claude/settings.json` gets "model": "sonnet" when it has none.
{
  const setOf = (x) => path.join(x.proj, '.claude', 'settings.json');
  const n = arena('us61-novo');
  run(n, '--no-git', '--no-questions');
  const cfgN = JSON.parse(fs.readFileSync(setOf(n), 'utf8'));
  check('US-61: settings.json novo nasce com "model": "sonnet" e o hook', cfgN.model === 'sonnet' && !!cfgN.hooks?.SessionStart);
  cleanup(n);

  const s = arena('us61-sem-model');
  fs.mkdirSync(path.join(s.proj, '.claude'), { recursive: true });
  fs.writeFileSync(setOf(s), '{"permissions":{"allow":["Bash(ls)"]}}\n');
  run(s, '--no-git', '--no-questions');
  const cfgS = JSON.parse(fs.readFileSync(setOf(s), 'utf8'));
  check('US-61: settings.json existente sem `model` ganha a chave e mantém o resto', cfgS.model === 'sonnet' && cfgS.permissions.allow[0] === 'Bash(ls)');
  const bytes = fs.readFileSync(setOf(s), 'utf8');
  run(s, '--no-git', '--no-questions');
  check('US-61: rodar de novo não reescreve', fs.readFileSync(setOf(s), 'utf8') === bytes);
  cleanup(s);

  const m = arena('us61-com-model');
  fs.mkdirSync(path.join(m.proj, '.claude'), { recursive: true });
  const own = '{\n    "model": "opus",\n    "permissions": {}\n}\n';
  fs.writeFileSync(setOf(m), own);
  run(m, '--no-git', '--no-questions');
  check('US-61: settings.json com `model` definido não é alterado (escolha do dono)', fs.readFileSync(setOf(m), 'utf8') === own);
  cleanup(m);

  const i = arena('us61-invalido');
  fs.mkdirSync(path.join(i.proj, '.claude'), { recursive: true });
  fs.writeFileSync(setOf(i), '{not json');
  const ri = run(i, '--no-git', '--no-questions');
  check('US-61: JSON inválido: avisa e não toca no arquivo', ri.status === 0 && fs.readFileSync(setOf(i), 'utf8') === '{not json' && /not a valid JSON object/.test(ri.stdout), ri.stdout.slice(-400));
  cleanup(i);

  const dr = arena('us61-dry');
  fs.mkdirSync(path.join(dr.proj, '.claude'), { recursive: true });
  fs.writeFileSync(setOf(dr), '{"a":1}\n');
  run(dr, '--no-git', '--no-questions', '--dry-run');
  check('US-61: --dry-run não escreve o model', fs.readFileSync(setOf(dr), 'utf8') === '{"a":1}\n');
  cleanup(dr);
}

// ── US-55. Ponytail detection honors the entry scope (hermetic: plants installed_plugins.json in the arena home).
{
  const plant = (x, json) => {
    fs.mkdirSync(path.join(x.lar, '.claude', 'plugins'), { recursive: true });
    fs.writeFileSync(path.join(x.lar, '.claude', 'plugins', 'installed_plugins.json'), typeof json === 'string' ? json : JSON.stringify(json));
  };
  const mine = (x) => fs.realpathSync(x.proj);
  const entry = (scope, projectPath) => ({ plugins: { 'ponytail@ponytail': [{ scope, projectPath }] } });
  const state = (x) => run(x, '--no-git', '--no-questions').stdout;

  const a = arena('us55-proj');
  plant(a, entry('project', mine(a)));
  check('US-55: entrada `project` com o projectPath deste projeto conta como instalado', /ponytail is installed but NOT active/.test(state(a)) && !/user scope/.test(state(a)));
  cleanup(a);

  const l = arena('us55-local');
  plant(l, entry('local', process.platform === 'win32' ? mine(l).toUpperCase() : mine(l)));
  check('US-55: `local` conta, e no Windows a comparação ignora maiúsculas', /ponytail is installed but NOT active/.test(state(l)));
  cleanup(l);

  const u = arena('us55-user');
  plant(u, { plugins: { 'ponytail@ponytail': [{ scope: 'user' }] } });
  check('US-55: escopo de usuário conta e a mensagem diz que é global', /ponytail is installed[^\n]*user scope \(global/.test(state(u)));
  run(u, '--no-git', '--no-questions', '--use=ponytail');
  const again = state(u);
  check('US-55: com o registro já em `sim`, o escopo de usuário segue avisado como global (e nada é instalado)',
        /ponytail installed[^\n]*user scope \(global/.test(again) && !/run +claude plugin/.test(again), again.slice(-400));
  cleanup(u);

  const o = arena('us55-outro');
  plant(o, entry('project', path.join(path.dirname(mine(o)), 'outro-projeto')));
  const ro = state(o);
  check('US-55: só entrada de outro projeto = não instalado (registra `não`, opcional, e ensina a instalar)',
        /ponytail not found/.test(ro) && /^\| ponytail \| não \|/m.test(fs.readFileSync(path.join(o.proj, '.marvin', 'ferramentas.md'), 'utf8')), ro.slice(-400));
  cleanup(o);

  const d = arena('us55-dry');
  run(d, '--no-git', '--no-questions', '--use=ponytail');
  plant(d, entry('project', path.join(path.dirname(mine(d)), 'outro-projeto')));
  const rd = run(d, '--no-git', '--no-questions', '--install', '--dry-run');
  check('US-55: registro `sim` + só outro projeto: --install --dry-run lista o install em escopo de projeto',
        /run +claude plugin install ponytail --scope project/.test(rd.stdout), rd.stdout.slice(-500));
  cleanup(d);

  const m = arena('us55-ruim');
  const rm = run(m, '--no-git', '--no-questions');
  cleanup(m);
  const m2 = arena('us55-json');
  plant(m2, '{not json');
  const rb = run(m2, '--no-git', '--no-questions');
  check('US-55: arquivo ausente ou JSON inválido = não instalado, sem exceção',
        rm.status === 0 && rb.status === 0 && /ponytail not found/.test(rm.stdout) && /ponytail not found/.test(rb.stdout) && !/SyntaxError/.test(rb.stdout + rb.stderr), rm.stdout.slice(-300) + rb.stdout.slice(-300) + rb.stderr);
  cleanup(m2);

  const w = arena('us55-nome');
  plant(w, { plugins: { 'ponytail-x@y': [{ scope: 'user' }] } });
  check('US-55: outro plugin com prefixo `ponytail-x@y` não conta como ponytail', /ponytail not found/.test(state(w)));
  cleanup(w);
}

// ── The note: a "Contexto" section is not a report, and every link of a line counts as "in the note".
{
  const a = arena('nota-contexto');
  run(a, '--no-git', '--no-questions');
  run(a, '--us', 'Novos/epy/featy/US-01-a');
  run(a, '--us', 'Novos/epy/featy/US-02-b');
  const nota = path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md');
  let n = fs.readFileSync(nota, 'utf8').replace(/^## Em andamento[\s\S]*?(?=^## |(?![\s\S]))/m, '');
  n += '\n## Em andamento\n\n- [US-01](../Planejamento/Novos/epy/featy/US-01-a/Sobre.md) e [US-02](../Planejamento/Novos/epy/featy/US-02-b/Sobre.md) — esperam o mesmo bruto\n\n## Contexto — canais\n\n- [Sobre](../Contexto/Sobre.md) — ponteiro de contexto\n';
  fs.writeFileSync(nota, n);
  const out = run(a, '--status').stdout.replace(/\x1b\[[0-9;]*m/g, '');
  check('nota: seção "Contexto" não é relato, e a 2ª US da mesma linha conta como "na nota"',
        !/look like a report/.test(out) && !/marked ativa but not in the note/.test(out), out.slice(-700));
  cleanup(a);
}

// ── 3.3.1: android/build.gradle beside a package.json is a JS app's Android shell, not Java;
// and a settings.json with a BOM is valid JSON (Windows editors write one).
{
  const agent = (id) => `---\nname: ${id}\ndescription: ${id}. MUST BE USED.\nmodel: opus\n---\nbody\n`;
  const fill = { 'agents/code-reviewer.md': agent('code-reviewer'), 'agents/tdd-guide.md': agent('tdd-guide'),
    'agents/java-reviewer.md': agent('java-reviewer'), 'agents/java-build-resolver.md': agent('java-build-resolver') };
  const a = equipped(arena('ecc-android'), fill);
  fs.writeFileSync(path.join(a.proj, 'package.json'), '{"name":"app","dependencies":{"@capacitor/core":"6"}}');
  fs.mkdirSync(path.join(a.proj, 'android'), { recursive: true });
  fs.writeFileSync(path.join(a.proj, 'android', 'build.gradle'), 'apply plugin: "com.android.application"\n');
  run(a, '--no-git', '--no-questions');
  const ag = (x, id) => fs.existsSync(path.join(x.proj, '.claude', 'agents', id + '.md'));
  check('ECC: android/build.gradle de um app JS não traz os agentes de Java', ag(a, 'tdd-guide') && !ag(a, 'java-reviewer') && !ag(a, 'java-build-resolver'));
  check('ECC: o agente copiado cita a origem (MIT) no frontmatter',
        /^# origem: ECC \(MIT\)/m.test(fs.readFileSync(path.join(a.proj, '.claude', 'agents', 'tdd-guide.md'), 'utf8')));
  cleanup(a);
  const b = equipped(arena('ecc-java'), fill);
  fs.writeFileSync(path.join(b.proj, 'pom.xml'), '<project></project>\n');
  run(b, '--no-git', '--no-questions');
  check('ECC: projeto Java de verdade (pom.xml) traz o build-resolver de Java (o reviewer saiu na US-69)', ag(b, 'java-build-resolver') && !ag(b, 'java-reviewer'));
  cleanup(b);
  const fl = equipped(arena('ecc-flutter'), { ...fill, 'agents/flutter-reviewer.md': agent('flutter-reviewer'), 'agents/dart-build-resolver.md': agent('dart-build-resolver') });
  fs.writeFileSync(path.join(fl.proj, 'pubspec.yaml'), 'name: app\n');
  fs.mkdirSync(path.join(fl.proj, 'android', 'app'), { recursive: true });
  fs.writeFileSync(path.join(fl.proj, 'android', 'build.gradle'), '// shell\n');
  fs.writeFileSync(path.join(fl.proj, 'android', 'app', 'build.gradle'), '// shell\n');
  run(fl, '--no-git', '--no-questions');
  check('ECC: app Flutter (android/ e android/app/ com gradle) traz os agentes de Flutter e nenhum de Java',
        ag(fl, 'dart-build-resolver') && !ag(fl, 'flutter-reviewer') && !ag(fl, 'java-reviewer') && !ag(fl, 'java-build-resolver'));
  cleanup(fl);
  const c = equipped(arena('settings-bom'));
  fs.mkdirSync(path.join(c.proj, '.claude'), { recursive: true });
  fs.writeFileSync(path.join(c.proj, '.claude', 'settings.json'), '﻿{\n  "hooks": {}\n}\n');
  run(c, '--no-git', '--no-questions');
  let cfg = {}; try { cfg = JSON.parse(fs.readFileSync(path.join(c.proj, '.claude', 'settings.json'), 'utf8').replace(/^﻿/, '')); } catch {}
  check('US-61: settings.json com BOM recebe "model": "sonnet" e mantém o que tinha', cfg.model === 'sonnet' && 'hooks' in cfg);
  cleanup(c);
}

// ── Epic marks: a known state never shows as ✗ (refinada/anotada epics did, before 3.0.0).
{
  const a = arena('epic-mark');
  run(a, '--no-git', '--no-questions');
  run(a, '--us', 'Novos/epx/featx/US-01-x', '--refinada');
  const ep = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'epx', 'Sobre.md');
  fs.writeFileSync(ep, fs.readFileSync(ep, 'utf8').replace(/^estado: \w+$/m, 'estado: anotada'));
  const out = run(a, '--status').stdout.replace(/\x1b\[[0-9;]*m/g, '');
  check('epic com estado anotada aparece com ·, não com ✗', /· epx/.test(out) && !/✗ epx/.test(out), out.slice(-600));
  cleanup(a);
}

// ── --graphify: `cluster-only` must run BEFORE the docs nodes are appended (graphify 0.9.37
// refuses to overwrite a graph.json with a smaller one). Hermetic: a fake `graphify` driven by a node script.
// Gap: the refusal itself is the real binary's behavior and is not reproduced; the check pins the ORDER.
{
  const a = arena('graphify-ordem');
  run(a, '--no-git', '--no-questions');
  run(a, '--us', 'Novos/epx/featx/US-01-x');
  const fk = fs.mkdtempSync(path.join(os.tmpdir(), 'marvin-teste-gfy-'));
  const logf = path.join(fk, 'cluster.log');
  fs.writeFileSync(path.join(fk, 'fake.mjs'), [
    "import fs from 'node:fs';",
    "const a = process.argv.slice(2);",
    "if (a[0] === '--version') console.log('graphify 0.9.37');",
    "else if (a[0] === 'cluster-only') {",
    "  const g = JSON.parse(fs.readFileSync('graphify-out/graph.json', 'utf8'));",
    "  fs.appendFileSync(" + JSON.stringify(logf) + ", g.nodes.length + ' docs=' + g.nodes.filter(n => n._origin === 'marvin').length + '\\n');",
    "} else if (a.includes('--code-only')) {",
    "  fs.mkdirSync('graphify-out', { recursive: true });",
    "  fs.writeFileSync('graphify-out/graph.json', JSON.stringify({ nodes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }], edges: [] }));",
    "}",
  ].join('\n') + '\n');
  fs.writeFileSync(path.join(fk, 'graphify'), '#!/bin/sh\nexec "' + process.execPath + '" "' + path.join(fk, 'fake.mjs') + '" "$@"\n', { mode: 0o755 });
  fs.writeFileSync(path.join(fk, 'graphify.cmd'), '@"' + process.execPath + '" "' + path.join(fk, 'fake.mjs') + '" %*\r\n');
  const rg = spawnSync(process.execPath, [SCRIPT, '--no-git', '--no-questions', '--graphify'], {
    cwd: a.proj, encoding: 'utf8', env: { ...hermeticEnv(), HOME: a.lar, USERPROFILE: a.lar, ...pathWith(fk + path.delimiter + NO_GRAPHIFY) },
  });
  const seen = fs.existsSync(logf) ? fs.readFileSync(logf, 'utf8').trim() : '(cluster-only não foi chamado)';
  let finalNodes = 0; try { finalNodes = JSON.parse(fs.readFileSync(path.join(a.proj, 'graphify-out', 'graph.json'), 'utf8')).nodes.length; } catch {}
  check('--graphify: cluster-only roda antes dos docs e vê só os nós de código', seen === '3 docs=0', seen + '\n' + rg.stdout.slice(-600));
  check('--graphify: sem "report step failed", e os nós de docs entram depois', !/report step failed/.test(rg.stdout) && finalNodes > 3, 'nós finais: ' + finalNodes);
  fs.rmSync(fk, { recursive: true, force: true });
  cleanup(a);
}

// ── US-57. The Time is a table with a model per stage; execution obeys it and --status flags the gap.
{
  const a = arena('us57');
  run(a, '--no-git', '--no-questions');
  run(a, '--us', 'Novos/epx/featx/US-01-x');
  const sobre = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'epx', 'featx', 'US-01-x', 'Sobre.md');
  const cmd = (n) => fs.readFileSync(path.join(a.proj, '.claude', 'commands', n + '.md'), 'utf8');
  const rule = /Cada\s+etapa\s+roda\s+no\s+modelo\s+da\s+sua\s+linha\s+do\s+\*Time\*/;
  check('US-57: Sobre.md novo traz o Time como tabela etapa/papel/modelo/motivo', /\| etapa \| papel \| modelo · esforço \| motivo \| estado \|/.test(fs.readFileSync(sobre, 'utf8')));
  check('US-57: /continuar e /retomar gerados têm a regra do modelo por etapa', rule.test(cmd('continuar')) && rule.test(cmd('retomar')) && /proponha\s+o\s+`\/refinar`/.test(cmd('retomar')) && /refinar: falta o modelo por etapa/.test(cmd('continuar')));
  check('US-57: /refinar e /us gerados mandam preencher a tabela', /etapa \| papel \| modelo/.test(cmd('refinar')) && /etapa \| papel \| modelo/.test(cmd('us')));
  const full = run(a, '--status').stdout, curto = run(a, '--status', '--curto').stdout;
  check('US-57: --status acusa a US sem modelo, com o id', /1 US sem modelo por etapa no Time — \/refinar antes de executar: US-01-x/.test(full), full.slice(-500));
  check('US-57: --curto só o número, numa linha', /1 US sem modelo por etapa no Time — \/refinar/.test(curto) && !/US-01-x\b[^\n]*sem modelo/.test(curto) && curto.split('\n').filter(l => /sem modelo/.test(l)).length === 1, curto);
  const txt = fs.readFileSync(sobre, 'utf8');
  const SEP = '|---|---|---|---|---|\n', ROW = '| implementar | dev-back | Sonnet · médio | partida | pendente |\n';
  fs.writeFileSync(sobre, txt.replace(SEP, () => SEP + ROW + '| verificar | qa |  | partida | pendente |\n'));
  check('US-57: uma linha preenchida e outra sem modelo conta como sem modelo', /1 US sem modelo por etapa/.test(run(a, '--status', '--curto').stdout));
  fs.writeFileSync(sobre, txt.replace(SEP, () => '').replace('| etapa | papel | modelo · esforço | motivo | estado |\n', () => 'Usar Sonnet aqui.\n'));
  check('US-57: prosa "usar Sonnet" sem tabela conta como sem modelo', /1 US sem modelo por etapa/.test(run(a, '--status', '--curto').stdout));
  fs.writeFileSync(sobre, txt.replace(SEP, () => SEP + ROW));
  const okFull = run(a, '--status').stdout, okCurto = run(a, '--status', '--curto').stdout;
  check('US-57: tabela preenchida não é acusada (nem no --curto)', !/sem modelo por etapa/.test(okFull) && !/sem modelo por etapa/.test(okCurto), okFull.slice(-500));
  cleanup(a);
  const b = arena('us57-antigo');
  run(b, '--no-git', '--no-questions');
  const old = path.join(b.proj, '.claude', 'commands', 'continuar.md');
  const oldTxt = 'Continue o roadmap sem esperar confirmação\n';
  fs.writeFileSync(old, oldTxt);
  const r = run(b, '--no-git', '--no-questions');
  check('US-57: base 3.1.0 só recebe o aviso desde 3.2.0 no /continuar, sem reescrever', /continuar\.md — missing[^\n]*desde 3\.2\.0/.test(r.stdout) && fs.readFileSync(old, 'utf8') === oldTxt, r.stdout.slice(-600));
  cleanup(b);
}

// ── US-58. --regenerar: backup byte-identical first, then the generated files are rebuilt from the template.
{
  const a = arena('regenerar');
  const BASE = ['--no-git', '--no-questions'];
  run(a, ...BASE);
  run(a, '--us', 'Novos/epx/featx/US-01-x');
  const read = (...p) => fs.readFileSync(path.join(a.proj, ...p));
  const snap = (dir) => { const out = []; (function w(d) { for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((x, y) => x.name.localeCompare(y.name))) {
    const p = path.join(d, e.name); if (e.isSymbolicLink()) out.push('L ' + path.relative(dir, p)); else if (e.isDirectory()) { out.push('D ' + path.relative(dir, p)); w(p); } else out.push('F ' + path.relative(dir, p) + ' ' + fs.readFileSync(p).toString('base64')); } })(dir); return out.join('\n'); };
  const contRel = ['.claude', 'commands', 'continuar.md'];
  const oldCont = 'Continue o roadmap sem esperar confirmação\nlinha antiga do template, que o novo não tem\nlinha extra do projeto que o humano escreveu aqui\n';
  fs.writeFileSync(path.join(a.proj, ...contRel), oldCont);
  const untouched = [['AGENTS.md'], ['.marvin', 'Memoria', 'onde_paramos.md'], ['.marvin', 'Planejamento', 'Novos', 'epx', 'featx', 'US-01-x', 'Sobre.md']];
  const before = untouched.map(p => read(...p));
  const treeBefore = snap(a.proj), homeBefore = snap(a.lar);
  const flatRel = ['claude', 'commands', 'continuar.md'];
  const dry = run(a, ...BASE, '--dry-run', '--regenerar');
  check('US-58: --dry-run --regenerar não escreve nada e mostra backup e remoção', snap(a.proj) === treeBefore && snap(a.lar) === homeBefore && /copy[^\n]*continuar\.md[^\n]*99_Backup/.test(dry.stdout) && /REMOVE[^\n]*continuar\.md/.test(dry.stdout) && /rewrite file\s+\.claude[\\/]commands[\\/]continuar\.md/.test(dry.stdout), dry.stdout.slice(-800));
  const ver = JSON.parse(fs.readFileSync(path.join(HERE, 'package.json'), 'utf8')).version;
  const bk = path.join(a.proj, '.marvin', '99_Backup', 'regenerar-' + ver);
  const r = run(a, ...BASE, '--regenerar');
  check('US-58: backup do /continuar antigo é byte-idêntico, em caminho achatado (sem .claude aninhado)', fs.existsSync(path.join(bk, ...flatRel)) && fs.readFileSync(path.join(bk, ...flatRel), 'utf8') === oldCont && !fs.existsSync(path.join(bk, '.claude')), r.stdout.slice(-800));
  check('US-58: o /continuar novo tem a regra do modelo por etapa', /Cada\s+etapa\s+roda\s+no\s+modelo/.test(read(...contRel).toString('utf8')));
  check('US-58: a linha extra do projeto aparece no relatório, com o caminho do backup', /linhas suas que não estão no template novo[^\n]*\n[^\n]*continuar\.md[^\n]*99_Backup[\s\S]*linha extra do projeto que o humano escreveu aqui/.test(r.stdout), r.stdout.slice(-900));
  check('US-58: AGENTS.md, a nota e a US ficam byte-idênticos', untouched.every((p, i) => read(...p).equals(before[i])));
  check('US-58: os outros comandos regenerados saem do template (sem backup fantasma quando idênticos)', fs.existsSync(path.join(a.proj, '.claude', 'commands', 'retomar.md')) && !fs.existsSync(path.join(bk, 'claude', 'commands', 'retomar.md')));
  const bkTree = snap(path.join(a.proj, '.marvin', '99_Backup'));
  const again = run(a, ...BASE, '--regenerar');
  check('US-58: rodar --regenerar de novo não duplica nem altera o backup', again.status === 0 && snap(path.join(a.proj, '.marvin', '99_Backup')) === bkTree, again.stdout.slice(-600));
  check('US-58: sem a flag nada muda (segunda passada normal não reescreve)', (() => { const c = read(...contRel); run(a, ...BASE); return read(...contRel).equals(c); })());
  cleanup(a);
  // pruning never removes a 99_Backup that was already there, even empty, when every backup is identical
  const e = arena('regenerar-vazio');
  run(e, ...BASE);
  fs.mkdirSync(path.join(e.proj, '.marvin', '99_Backup'));
  const er = run(e, ...BASE, '--regenerar');
  check('US-58: 99_Backup vazio pré-existente sobrevive a um --regenerar com tudo idêntico', er.status === 0 && fs.existsSync(path.join(e.proj, '.marvin', '99_Backup')) && fs.readdirSync(path.join(e.proj, '.marvin', '99_Backup')).length === 0, er.stdout.slice(-600));
  cleanup(e);
}

// ── US-62. The owner never runs `marvin` by hand: the hook (--status --curto) must say, in ONE line and
// reading only, that the base is stale; /retomar is what syncs it. Silent when nothing is behind.
{
  const agent = (id) => `---\nname: ${id}\ndescription: ${id}. Use PROACTIVELY.\nmodel: opus\n---\nbody\n`;
  const a = equipped(arena('us62'), { 'agents/tdd-guide.md': agent('tdd-guide') });
  run(a, '--no-git', '--no-questions');
  const curto = () => run(a, '--status', '--curto').stdout;
  const linhas = (s) => s.split('\n').filter(l => /base desatualizada/.test(l));
  check('US-62: base atual e completa: o hook não diz "base desatualizada"', linhas(curto()).length === 0, curto());
  const rec = path.join(a.proj, '.marvin', 'ferramentas.md');
  const orig = fs.readFileSync(rec, 'utf8');
  fs.writeFileSync(rec, orig.replace(/^marvin: .+$/m, 'marvin: 0.0.1'));
  const velho = linhas(curto());
  check('US-62: carimbo velho: UMA linha "Marvin X > base 0.0.1 … o /retomar sincroniza"', velho.length === 1 && /Marvin [0-9.]+ > base 0\.0\.1/.test(velho[0]) && /o \/retomar sincroniza/.test(velho[0]) && !/base montada com marvin/.test(curto()), velho.join('|'));
  fs.writeFileSync(rec, orig.replace(/^marvin: .+$/m, 'marvin: 99.0.0'));
  check('US-62: base mais NOVA que o marvin não conta como desatualizada (US-30 segue valendo)', linhas(curto()).length === 0 && /base montada com marvin[^\n]*mais velho/.test(curto()), curto());
  fs.writeFileSync(rec, orig);
  // an agent of the plan that the catalog has and the project lacks
  fs.writeFileSync(path.join(a.proj, 'package.json'), '{"name":"cobaia","scripts":{"build":"tsc"}}\n');   // a build now exists: the plan asks for the resolver
  fs.writeFileSync(path.join(a.lar, '.claude', 'plugins', 'marketplaces', 'ecc', 'agents', 'build-error-resolver.md'), agent('build-error-resolver'));
  const ecc = linhas(curto());
  check('US-62: agente do plano que o catálogo tem e o projeto não: a linha cita agentes do ECC', ecc.length === 1 && /1 agente do ECC faltando/.test(ecc[0]), ecc.join('|'));
  // the hook writes nothing: same tree before and after
  const tree = (d) => fs.readdirSync(d, { withFileTypes: true }).filter(e => e.name !== '.git').flatMap(e => e.isDirectory() ? tree(path.join(d, e.name)) : [e.name + ':' + fs.readFileSync(path.join(d, e.name), 'utf8').length + ':' + fs.statSync(path.join(d, e.name)).mtimeMs]).sort().join('\n');
  const before = tree(a.proj);
  run(a, '--status', '--curto');
  check('US-62: --curto não escreve nada (a árvore do projeto fica idêntica)', tree(a.proj) === before);
  // the generated /retomar carries the rule; a 3.4.0 base gets the notice
  const ret = path.join(a.proj, '.claude', 'commands', 'retomar.md');
  const txt = fs.readFileSync(ret, 'utf8');
  check('US-62: /retomar gerado manda rodar o marvin quando o resumo diz "base desatualizada", antes das portas', /disser\s+`base\s+desatualizada`/.test(txt) && txt.indexOf('base desatualizada') < txt.indexOf('As **duas portas**') && /Nunca push/.test(txt));
  const antigo = txt.replace(/Se o resumo de abertura disser[\s\S]*?Nunca push\.\n/, () => '');
  fs.writeFileSync(ret, antigo);
  const r = run(a, '--no-git', '--no-questions');
  check('US-62: base 3.4.0 só recebe o aviso desde 3.4.1 no /retomar, sem reescrever', /retomar\.md — missing[^\n]*base desatualizada[^\n]*desde 3\.4\.1/.test(r.stdout) && fs.readFileSync(ret, 'utf8') === antigo, r.stdout.slice(-600));
  // skill per stage: `agent · skill` in the role column, the table format (3rd cell = model) untouched
  const plan = fs.readFileSync(path.join(a.proj, '.marvin', 'Planejamento', 'README.md'), 'utf8');
  check('US-62: o exemplo do Time traz "agente · skill" na coluna papel', /\| implementar \| dev-back · dotnet-patterns \| Sonnet · médio \|/.test(plan) && /skill\s+da\s+etapa\s+depois\s+do/.test(plan));
  const cmdTxt = (n) => fs.readFileSync(path.join(a.proj, '.claude', 'commands', n + '.md'), 'utf8');
  check('US-62: /refinar, /us, /continuar e /retomar gerados falam da skill por etapa', /o\s+refino\s+escolhe\s+o\s+agente,\s+a\s+skill/.test(cmdTxt('refinar')) && /o\s+refino\s+escolhe\s+o\s+agente,\s+a\s+skill/.test(cmdTxt('us')) && /com\s+a\s+skill\s+da\s+linha/.test(cmdTxt('continuar')) && /Cada\s+etapa\s+roda\s+no\s+modelo/.test(cmdTxt('continuar')));
  run(a, '--us', 'Novos/epx/featx/US-01-x');
  const sobre = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'epx', 'featx', 'US-01-x', 'Sobre.md');
  const s = fs.readFileSync(sobre, 'utf8'), SEP = '|---|---|---|---|---|\n';
  fs.writeFileSync(sobre, s.replace(SEP, () => SEP + '| implementar | dev-back · dotnet-patterns | Sonnet · médio | partida | pendente |\n'));
  check('US-62: linha com "agente · skill" no papel: o comModelo segue lendo a 3ª célula', !/sem modelo por etapa/.test(run(a, '--status', '--curto').stdout));
  fs.writeFileSync(sobre, s.replace(SEP, () => SEP + '| implementar | dev-back · dotnet-patterns |  | partida | pendente |\n'));
  check('US-62: com a 3ª célula vazia segue contando como sem modelo', /1 US sem modelo por etapa/.test(run(a, '--status', '--curto').stdout));
  // the hook sits BEFORE every block that writes (0a availability, --us …): it never creates, prompts or fails for them
  const loc = path.join(a.proj, '.marvin', '.local'), disp = path.join(loc, 'disponibilidade.json');
  fs.mkdirSync(loc, { recursive: true });
  fs.writeFileSync(disp, JSON.stringify({ schema: 1, executor: 'claude', source: 'flags', providers: [] }));
  const t0 = tree(a.proj), v = run(a, '--status', '--curto');
  check('US-62: --curto com disponibilidade.json válido e sem .local/.gitignore não cria arquivo', v.status === 0 && tree(a.proj) === t0 && !fs.existsSync(path.join(loc, '.gitignore')), v.stdout.slice(-300));
  fs.writeFileSync(disp, '{ não é json');
  const iv = run(a, '--status', '--curto');
  check('US-62: disponibilidade.json inválido: o --curto sai 0 (não derruba o hook)', iv.status === 0, iv.stdout.slice(-300));
  fs.rmSync(disp);
  const us = run(a, '--status', '--us', 'Novos/epz/featz/US-09-z');
  check('US-62: --status --us X sai antes do --us (não cria o Sobre.md)', us.status === 0 && !fs.existsSync(path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'epz')), us.stdout.slice(-300));
  cleanup(a);
}

// ── 9r. US-70: the post-commit hook refreshes the docs side of the graph too.
//     `graphify update .` rewrites graph.json and drops the marvin doc nodes; `--graph-docs` puts them back.
//     No real graphify needed: the graph is synthetic and `equipped` puts a fake one (exit 0) on PATH.
{
  const OLD_HOOK = [
    '#!/bin/sh',
    '# marvin — atualiza o grafo de código depois do commit.',
    '# O grafo é DERIVADO: envelhece a cada commit e não avisa. Isto é o que fecha essa lacuna.',
    '# Instalado por: marvin --graphify --graphify-git-hook   ·   remover: apague este arquivo.',
    '',
    '[ "${MARVIN_SKIP_GRAPH_HOOK:-0}" = "1" ] && exit 0',
    'export PYTHONHASHSEED=0',
    'LOG="${TMPDIR:-/tmp}/marvin-graph-refresh.log"',
    '{ graphify update . ; } >"$LOG" 2>&1 &', ''].join(NLQ);
  const idOf = (rel) => rel.replace(/\\/g, '/').replace(/\.[^./]+$/, '')
    .replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
  const hookOf = (x) => path.join(x.proj, '.git', 'hooks', 'post-commit');
  const readHook = (x) => { try { return fs.readFileSync(hookOf(x), 'utf8'); } catch { return ''; } };
  // Minimal graph: the fake graphify prints no version, so step 8b only reaches the hook via an existing graph.json.
  const plantGraph = (x) => {
    fs.mkdirSync(path.join(x.proj, 'graphify-out'), { recursive: true });
    fs.writeFileSync(path.join(x.proj, 'graphify-out', 'graph.json'), JSON.stringify({ directed: true, nodes: [], edges: [] }));
  };
  const plantHook = (x, txt) => { fs.mkdirSync(path.dirname(hookOf(x)), { recursive: true }); fs.writeFileSync(hookOf(x), txt); };

  // 1-3. --graph-docs on a bare arena: only `.marvin/` docs and a graph without marvin doc nodes
  const a = arena('graphdocs');
  const relUs = '.marvin/Planejamento/Novos/E1/F1/US-1/Sobre.md';
  const usDir = path.join(a.proj, ...relUs.split('/').slice(0, -1));
  fs.mkdirSync(usDir, { recursive: true });
  fs.writeFileSync(path.join(usDir, 'Sobre.md'), ['---', 'tipo: us', 'estado: ativa', '---', '# US-1 — hook', ''].join(NLQ));
  const output = path.join(a.proj, 'graphify-out');
  fs.mkdirSync(output, { recursive: true });
  const gp = path.join(output, 'graph.json');
  fs.writeFileSync(gp, JSON.stringify({ directed: true,
    nodes: [{ id: 'src_x', label: 'x.js', file_type: 'code', source_file: 'src/x.js', _origin: 'ast' }], edges: [] }));
  const past = new Date('2020-01-01T00:00:00Z');
  fs.utimesSync(gp, past, past);
  const mtimeBefore = fs.statSync(gp).mtimeMs;

  const r1 = run(a, '--graph-docs');
  const g1 = JSON.parse(fs.readFileSync(gp, 'utf8'));
  const mine = g1.nodes.filter(n => n._origin === 'marvin');
  check('US-70: --graph-docs repõe os nós-doc (_origin marvin, com tipo) num grafo que não os tem',
        mine.some(n => n.id === idOf(relUs) && n.tipo === 'us'), r1.stdout.slice(-400) + r1.stderr.slice(-200));
  check('US-70: --graph-docs sai cedo: não roda o scaffold (AGENTS.md e .claude/ não nascem)',
        !fs.existsSync(path.join(a.proj, 'AGENTS.md')) && !fs.existsSync(path.join(a.proj, '.claude')));
  const bytes1 = fs.readFileSync(gp);
  const mtime1 = fs.statSync(gp).mtimeMs;
  check('US-70: --graph-docs preserva o mtime do graph.json (frescor da extração)',
        Math.abs(mtime1 - mtimeBefore) < 2000, mtimeBefore + ' -> ' + mtime1);
  run(a, '--graph-docs');
  check('US-70: 2ª rodada de --graph-docs deixa o graph.json byte a byte igual',
        Buffer.compare(bytes1, fs.readFileSync(gp)) === 0);
  check('US-70: 2ª rodada mantém o mtime do graph.json', Math.abs(fs.statSync(gp).mtimeMs - mtimeBefore) < 2000);

  // --dry-run: on a graph without the docs, nothing is written
  fs.writeFileSync(gp, JSON.stringify({ directed: true,
    nodes: [{ id: 'src_x', label: 'x.js', file_type: 'code', source_file: 'src/x.js', _origin: 'ast' }], edges: [] }));
  const bare = fs.readFileSync(gp);
  run(a, '--graph-docs', '--dry-run');
  check('US-70: --graph-docs --dry-run não escreve o graph.json', Buffer.compare(bare, fs.readFileSync(gp)) === 0);
  cleanup(a);

  // 4. new hook: `--graph-docs` chained with && right after `graphify update .`, same subshell
  const b = equipped(arena('graphdocs-hook'));
  fs.mkdirSync(path.join(b.proj, '.git'), { recursive: true });
  plantGraph(b);
  run(b, '--no-git', '--graphify', '--graphify-git-hook');
  const nh = readHook(b);
  check('US-70: hook novo roda `graphify update . && … --graph-docs` no mesmo subshell',
        /\{[^\n}]*graphify update \.\s*&&[^\n}]*--graph-docs[^\n}]*\}/.test(nh), nh.slice(-400));
  cleanup(b);

  // 5. old Marvin hook: rewritten with the flag, warned (step 10) without it
  const c = equipped(arena('graphdocs-velho'));
  fs.mkdirSync(path.join(c.proj, '.git'), { recursive: true });
  plantHook(c, OLD_HOOK);
  plantGraph(c);
  // US-80: without the opt-out the default install would already rewrite it, so the warn needs `--no-graph-hook`.
  const w = run(c, '--no-git', '--no-graph-hook');
  check('US-70: hook antigo do Marvin com o opt-out: o passo 10 avisa e cita --graphify-git-hook',
        /post-commit — missing[^\n]*/.test(w.stdout) && /--graphify-git-hook/.test(w.stdout), w.stdout.slice(-600));
  check('US-70: com o opt-out o hook antigo não é reescrito', readHook(c) === OLD_HOOK);
  run(c, '--no-git', '--graphify', '--graphify-git-hook');
  const rewritten = readHook(c);
  check('US-70: hook antigo do Marvin é reescrito com --graphify-git-hook e passa a conter --graph-docs',
        /--graph-docs/.test(rewritten) && /marvin\s+—\s+atualiza\s+o\s+grafo/.test(rewritten), rewritten.slice(-300));
  cleanup(c);

  // 6. someone else's hook: untouched with the flag, no UPDATES warning without it
  const d = equipped(arena('graphdocs-alheio'));
  fs.mkdirSync(path.join(d.proj, '.git'), { recursive: true });
  const alheio = '#!/bin/sh\necho lint\n';
  plantHook(d, alheio);
  plantGraph(d);
  const wd = run(d, '--no-git');
  check('US-70: hook alheio: o passo 10 não acusa o post-commit', !/post-commit/.test(wd.stdout.split('10. Updates')[1] || ''), wd.stdout.slice(-500));
  run(d, '--no-git', '--graphify', '--graphify-git-hook');
  check('US-70: hook alheio fica intocado byte a byte com --graphify-git-hook', readHook(d) === alheio);
  cleanup(d);
}

// ── US-73. `estado: pausada` (with `espera:` and `desde:`) is listed apart from "Em andamento";
// an invalid estado is a warning with a suggestion; the "Pausadas" note section is not a report.
{
  const a = arena('us73');
  run(a, '--no-git', '--no-questions');
  run(a, '--us', 'Novos/P/F/US-01-pausa-x');
  const sb = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'P', 'F', 'US-01-pausa-x', 'Sobre.md');
  const note = path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md');
  const orig = fs.readFileSync(sb, 'utf8');
  const setEstado = (fm) => fs.writeFileSync(sb, orig.replace('estado: ativa', fm));
  fs.writeFileSync(note, '# Onde paramos\n\n## Pausadas\n- [US-01](../Planejamento/Novos/P/F/US-01-pausa-x/Sobre.md) — esperando o dono\n');
  setEstado('estado: pausada\nespera: aprovação do dono\ndesde: 01/01/2026');
  const full = run(a, '--status').stdout;
  const emAnd = full.split('Pausadas')[0];
  check('US-73: a pausada aparece num bloco "Pausadas" com o espera e a idade', /Pausadas[\s\S]*US-01[\s\S]*espera: aprovação do dono · há \d+d/.test(full), full.slice(0, 700));
  check('US-73: a pausada não entra em "Em andamento", mesmo apontada pela nota', /Em andamento/.test(emAnd) && !/US-01/.test(emAnd), emAnd);
  check('US-73: a seção "Pausadas" da nota não é acusada como relato, e pausada com espera não gera aviso', !/look like a report/.test(full) && !/pausada without/.test(full) && !/not valid/.test(full), full);
  const curto = run(a, '--status', '--curto').stdout;
  check('US-73: no --curto só o número de pausadas, sem o nome da US', /1 pausada\(s\)/.test(curto) && !/pausa-x|aprovação/.test(curto), curto);
  run(a, '--status', '--html');
  const html = fs.readFileSync(path.join(a.proj, '.marvin', '.status', 'index.html'), 'utf8');
  check('US-73: o painel tem o grupo Pausadas com link para a US', /<h3>Pausadas<\/h3><ul><li><a href="[^"]*US-01-pausa-x\/Sobre\.md"/.test(html));
  setEstado('estado: pausada');
  const semEspera = run(a, '--status').stdout;
  check('US-73: pausada sem espera: gera aviso', /US-01-pausa-x: pausada without "espera:"/.test(semEspera), semEspera);
  setEstado('estado: feita');
  const feita = run(a, '--status').stdout;
  check('US-73: estado "feita" avisa e sugere concluida', /estado "feita" is not valid — use "concluida"/.test(feita), feita);
  setEstado('estado: em andamento');
  check('US-73: estado "em andamento" avisa e sugere ativa', /estado "em andamento" is not valid — use "ativa"/.test(run(a, '--status').stdout));
  setEstado('estado: qualquer-coisa');
  check('US-73: estado desconhecido lista os válidos', /not valid — valid: anotada \| refinada \| ativa \| pausada \| concluida \| cancelada/.test(run(a, '--status').stdout));
  // epic and feature get the same warning
  const ep = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'P', 'Sobre.md');
  const epOrig = fs.readFileSync(ep, 'utf8');
  setEstado('estado: ativa');
  fs.writeFileSync(ep, epOrig.replace(/^estado: \w+$/m, 'estado: feita'));
  check('US-73: epic com estado inválido também avisa', /not valid — use "concluida"/.test(run(a, '--status').stdout));
  fs.writeFileSync(ep, epOrig);
  check('US-73: estado válido não gera aviso de estado', !/not valid/.test(run(a, '--status').stdout));
  // UPDATES: a base whose state comment predates `pausada` is flagged; a new base is not.
  const pr = path.join(a.proj, '.marvin', 'Planejamento', 'README.md');
  check('US-73: o template novo lista pausada no comentário de estados', /ativa\s+\|\s+pausada/.test(fs.readFileSync(pr, 'utf8')));
  fs.writeFileSync(pr, fs.readFileSync(pr, 'utf8').replace(/ativa\s+\|\s+pausada\s+\|/, 'ativa |'));
  const old = run(a, '--no-git', '--no-questions').stdout;
  check('US-73: base sem pausada no comentário de estados ganha o aviso do passo 10', /10\. Updates/.test(old) && /estado: pausada/.test(old), old.slice(-600));
  cleanup(a);
}

// ── US-74. --status: graph older than the last commit, and graphify without Marvin's post-commit hook, are `!`.
{
  const hasGit = spawnSync('git', ['--version'], { encoding: 'utf8' }).status === 0;
  if (!hasGit) console.log('  (git ausente — US-74 pulado)');
  else {
    const a = arena('us74');
    run(a, '--no-git', '--no-questions');
    const git = (...args) => spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd: a.proj, encoding: 'utf8',
      env: { ...process.env, GIT_COMMITTER_DATE: '2025-06-01T12:00:00Z', GIT_AUTHOR_DATE: '2025-06-01T12:00:00Z' } });
    git('init', '-q', '.'); git('add', '-A'); git('commit', '-q', '-m', 'x');
    const gp = path.join(a.proj, 'graphify-out', 'graph.json');
    fs.mkdirSync(path.dirname(gp), { recursive: true });
    fs.writeFileSync(gp, JSON.stringify({ directed: true, nodes: [], edges: [] }));
    const setAge = (iso) => { const t = new Date(iso); fs.utimesSync(gp, t, t); };
    const hookP = path.join(a.proj, '.git', 'hooks', 'post-commit');
    const putHook = (txt) => { fs.mkdirSync(path.dirname(hookP), { recursive: true }); fs.writeFileSync(hookP, txt); };
    const OURS = '#!/bin/sh\n# marvin — atualiza o grafo de código depois do commit.\ngraphify update .\n';
    const VELHO = /grafo é mais velho que o último commit — refaça com: marvin --graphify --graphify-rebuild/;
    const SEMHOOK = /sem o hook de post-commit do Marvin.*marvin --graphify --graphify-git-hook/;
    putHook(OURS);
    setAge('2025-01-01T00:00:00Z');
    let r = run(a, '--status');
    check('US-74: grafo mais velho que o último commit vira ! com o comando de conserto', VELHO.test(r.stdout), r.stdout.slice(-500));
    check('US-74: com o hook do Marvin, o grafo velho avisa mas não muda o exit code (o hook está refazendo)', r.status === 0 && !SEMHOOK.test(r.stdout), String(r.status));
    // The docs append restores the mtime (utimesSync): the extraction time, still older than the commit.
    const before = fs.statSync(gp).mtimeMs;
    run(a, '--graph-docs');
    check('US-74: o mtime restaurado pelo anexo de docs não engana (grafo velho segue velho)', Math.abs(fs.statSync(gp).mtimeMs - before) < 2000 && VELHO.test(run(a, '--status').stdout));
    setAge('2025-12-01T00:00:00Z');
    r = run(a, '--status');
    check('US-74: grafo mais novo que o último commit, com hook do Marvin: nenhum aviso de grafo', !VELHO.test(r.stdout) && !SEMHOOK.test(r.stdout) && r.status === 0, r.stdout.slice(-400));
    fs.rmSync(hookP);
    r = run(a, '--status');
    check('US-74: graphify sem hook vira ! com marvin --graphify-git-hook e muda o exit code', SEMHOOK.test(r.stdout) && r.status === 1 && !VELHO.test(r.stdout), r.stdout.slice(-400));
    putHook('#!/bin/sh\necho do-outro\n');
    check('US-74: hook de outra pessoa (sem a marca) também avisa', SEMHOOK.test(run(a, '--status').stdout));
    setAge('2025-01-01T00:00:00Z');
    const curto = run(a, '--status', '--curto').stdout.split('\n').filter(l => /grafo:/.test(l));
    check('US-74: --curto soma os dois numa linha só', curto.length === 1 && /mais velho que o último commit e sem o hook/.test(curto[0]), curto.join('|'));
    putHook(OURS); setAge('2025-12-01T00:00:00Z');
    check('US-74: --curto não diz nada quando nenhum dispara', !/grafo:/.test(run(a, '--status', '--curto').stdout));
    fs.rmSync(gp);
    fs.rmSync(hookP);
    check('US-74: sem graph.json (sem graphify) nenhum aviso', !VELHO.test(run(a, '--status').stdout) && !SEMHOOK.test(run(a, '--status').stdout));
    cleanup(a);
    const b = arena('us74b');
    run(b, '--no-git', '--no-questions');
    fs.mkdirSync(path.join(b.proj, 'graphify-out'), { recursive: true });
    fs.writeFileSync(path.join(b.proj, 'graphify-out', 'graph.json'), JSON.stringify({ nodes: [], edges: [] }));
    const sb = run(b, '--status').stdout;
    check('US-74: sem .git nenhum aviso de grafo', !VELHO.test(sb) && !SEMHOOK.test(sb), sb.slice(-300));
    cleanup(b);
  }
}

// ── US-79. --us <path> --pausar "<wait>" / --ativa: edits the frontmatter and the Rumo of an existing US, nothing else.
{
  const a = arena('us79');
  run(a, '--no-git');
  const key = 'Novos/E/F/US-1';
  run(a, '--us', key);
  const f = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E', 'F', 'US-1', 'Sobre.md');
  const rd = () => fs.readFileSync(f, 'utf8');
  const noteBefore = fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8');
  const orig = rd();
  const dry = run(a, '--us', key, '--pausar', 'o dono responder', '--dry-run');
  check('US-79: --dry-run não escreve', dry.status === 0 && rd() === orig, dry.stdout.slice(-300));
  const r1 = run(a, '--us', key, '--pausar', 'o dono responder');
  const t1 = rd();
  check('US-79: pausar grava estado, espera e desde no frontmatter', r1.status === 0 && /^estado: pausada$/m.test(t1) && /^espera: o dono responder$/m.test(t1) && /^desde: \d\d\/\d\d\/\d{4}$/m.test(t1) && (t1.match(/^---/gm) || []).length === 2, r1.stdout.slice(-300));
  check('US-79: pausar acrescenta a linha no Rumo', /^- \*\*\d\d\/\d\d\/\d{4}\*\* — pausada: o dono responder$/m.test(t1));
  check('US-79: o resto do arquivo fica intacto', t1.replace(/^estado:.*\nespera:.*\ndesde:.*\n/m, 'estado: ativa\n').replace(/^- \*\*[^\n]*pausada:[^\n]*\n/m, '') === orig, t1);
  check('US-79: pausar não mexe na nota', fs.readFileSync(path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md'), 'utf8') === noteBefore);
  run(a, '--us', key, '--pausar=o dono responder');
  check('US-79: pausar de novo com a mesma espera deixa o arquivo byte-idêntico (forma --pausar=)', rd() === t1);
  const desde1 = (t1.match(/^desde: (.*)$/m) || [])[1];
  run(a, '--us', key, '--pausar', 'outra coisa');
  const t2 = rd();
  check('US-79: espera diferente troca só a espera, mantém o desde e soma uma linha no Rumo',
        /^espera: outra coisa$/m.test(t2) && (t2.match(/^espera:/gm) || []).length === 1 && (t2.match(/^desde: (.*)$/m) || [])[1] === desde1 && (t2.match(/^- \*\*[^\n]*pausada:/gm) || []).length === 2, t2);
  check('US-79: --pausar sem espera, ou junto de --ativa, é erro de uso e não escreve',
        run(a, '--us', key, '--pausar').status === 2 && run(a, '--us', key, '--pausar', '').status === 2 && run(a, '--us', key, '--pausar', 'x', '--ativa').status === 2 && rd() === t2);
  run(a, '--us', key, '--ativa', '--dry-run');
  check('US-79: --ativa --dry-run não escreve', rd() === t2);
  run(a, '--us', key, '--ativa');
  const t3 = rd();
  check('US-79: --ativa põe ativa, tira espera e desde e escreve no Rumo', /^estado: ativa$/m.test(t3) && !/^(espera|desde):/m.test(t3) && /^- \*\*\d\d\/\d\d\/\d{4}\*\* — volta a ativa$/m.test(t3), t3);
  run(a, '--us', key, '--ativa');
  check('US-79: --ativa de novo não escreve nada', rd() === t3);
  // espera with " #": free text, not a comment — the same espera twice must stay byte-identical.
  run(a, '--us', key, '--pausar', 'issue #12');
  const t4 = rd();
  run(a, '--us', key, '--pausar', 'issue #12');
  check('US-79: espera com " #": pausar duas vezes é byte-idêntico', /^espera: issue #12$/m.test(t4) && rd() === t4 && (t4.match(/pausada: issue #12/g) || []).length === 1, t4);
  check('US-79: --status mostra a espera inteira, com o " #"', /espera: issue #12/.test(run(a, '--status').stdout.replace(/\x1b\[[0-9;]*m/g, '')));
  run(a, '--us', key, '--ativa');
  // CRLF is preserved.
  fs.writeFileSync(f, rd().replace(/\r?\n/g, '\r\n'));
  run(a, '--us', key, '--pausar', 'crlf');
  const t5 = rd();
  check('US-79: CRLF preservado no --pausar', /^estado: pausada\r$/m.test(t5) && !/[^\r]\n/.test(t5.replace(/^\n/, '')), JSON.stringify(t5.slice(0, 120)));
  run(a, '--us', key, '--ativa');
  // concluida and non-US paths refuse without writing.
  const conc = rd().replace(/^estado: ativa/m, 'estado: concluida');
  fs.writeFileSync(f, conc);
  const rc = run(a, '--us', key, '--pausar', 'x');
  check('US-79: US concluida dá erro e não escreve', rc.status !== 0 && rd() === conc);
  const ra = run(a, '--us', key, '--ativa');
  check('US-79: --ativa em US concluida dá erro e o arquivo fica byte-idêntico', ra.status === 1 && rd() === conc);
  const canc = conc.replace(/^estado: concluida/m, 'estado: cancelada');
  fs.writeFileSync(f, canc);
  check('US-79: cancelada recusa --pausar e --ativa sem escrever', run(a, '--us', key, '--pausar', 'x').status === 1 && run(a, '--us', key, '--ativa').status === 1 && rd() === canc);
  // UPDATES: the template teaches the command; a base without it is flagged, a new one is not.
  const pr79 = path.join(a.proj, '.marvin', 'Planejamento', 'README.md');
  const pt = fs.readFileSync(pr79, 'utf8');
  check('US-79: o template novo ensina o --pausar', /--pausar\s+"/.test(pt));
  fs.writeFileSync(pr79, pt.replace(/\s*Pausa-se com[\s\S]*?à mão\./, ''));
  const old79 = run(a, '--no-git', '--no-questions').stdout;
  check('US-79: base sem o --pausar no template ganha o aviso do passo 10', /10\. Updates/.test(old79) && /--pausar/.test(old79), old79.slice(-600));
  const feat = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E', 'F', 'US-2', 'Sobre.md');
  fs.mkdirSync(path.dirname(feat), { recursive: true });
  fs.writeFileSync(feat, '---\ntipo: feature\nestado: ativa\n---\n# x\n');
  const rf = run(a, '--us', 'Novos/E/F/US-2', '--pausar', 'x');
  check('US-79: caminho que não é US dá erro e não escreve', rf.status !== 0 && fs.readFileSync(feat, 'utf8') === '---\ntipo: feature\nestado: ativa\n---\n# x\n');
  const lost = run(a, '--us', 'Novos/E/F/US-9', '--pausar', 'x');
  check('US-79: US inexistente dá erro e não cria', lost.status !== 0 && !fs.existsSync(path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E', 'F', 'US-9')));
  cleanup(a);
}

// ── US-81. --us <path> --anotada: born `anotada`, outside the note and the queue; /refinar text carries the mark.
{
  const a = arena('us81');
  run(a, '--no-git');
  const noteF = path.join(a.proj, '.marvin', 'Memoria', 'onde_paramos.md');
  const noteBefore = fs.readFileSync(noteF, 'utf8');
  const key = 'Novos/E/F/US-7';
  const f = path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E', 'F', 'US-7', 'Sobre.md');
  const strip = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
  const r1 = run(a, '--us', key, '--anotada');
  const t1 = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
  check('US-81: --anotada cria a US com estado: anotada', r1.status === 0 && /^tipo: us\r?\nestado: anotada$/m.test(t1), r1.stdout.slice(-300));
  check('US-81: --anotada não põe ponteiro na nota', fs.readFileSync(noteF, 'utf8') === noteBefore && !/US-7/.test(fs.readFileSync(noteF, 'utf8')));
  const st = strip(run(a, '--status').stdout);
  check('US-81: a anotada é contada e não entra na fila', /1 anotada\(s\)/.test(st) && !/refinada\(s\)/.test(st) && !/Ilhas/.test(st), st.slice(-400));
  run(a, '--us', key, '--anotada');
  check('US-81: rodar de novo deixa a US e a nota byte-idênticas', fs.readFileSync(f, 'utf8') === t1 && fs.readFileSync(noteF, 'utf8') === noteBefore);
  const bad = ['--refinada', '--ativa'].map(x => run(a, '--us', 'Novos/E/F/US-8', '--anotada', x));
  const badP = run(a, '--us', 'Novos/E/F/US-8', '--anotada', '--pausar', 'x');
  check('US-81: --anotada com --refinada, --ativa ou --pausar recusa e não cria nada', bad.every(r => r.status === 2) && badP.status === 2 && !fs.existsSync(path.join(a.proj, '.marvin', 'Planejamento', 'Novos', 'E', 'F', 'US-8')));
  // Refining switches the state in the same file: it leaves the annotated count, nothing moves.
  fs.writeFileSync(f, t1.replace(/^estado: anotada/m, 'estado: refinada'));
  const st2 = strip(run(a, '--status').stdout);
  check('US-81: a anotada que virou refinada sai da contagem das anotadas', !/anotada\(s\)/.test(st2) && fs.existsSync(f), st2.slice(-400));
  // UPDATES: the generated /refinar teaches --anotada; a base without it is flagged.
  const rf = path.join(a.proj, '.claude', 'commands', 'refinar.md');
  const rt = fs.readFileSync(rf, 'utf8');
  check('US-81: o /refinar gerado ensina o --anotada', /marvin\s+--us\s+<caminho>\s+--anotada/.test(rt));
  fs.writeFileSync(rf, rt.replace(/marvin\s+--us\s+<caminho>\s+--anotada/g, 'marvin --us <caminho> --x'));
  const old81 = run(a, '--no-git', '--no-questions').stdout;
  check('US-81: refinar.md sem o --anotada ganha o aviso do passo 10', /10\. Updates/.test(old81) && /--anotada/.test(old81), old81.slice(-600));
  cleanup(a);
}

// ── US-80. The post-commit hook of the graph is installed by default (graphify in use + git directory);
//     `--no-graph-hook` turns it off and records `hook do grafo: desligado` in ferramentas.md; `--graphify-git-hook` forces.
//     No real graphify: `equipped` puts a fake one (exit 0) on PATH and a synthetic graph.json makes step 8b reach the hook.
{
  const hookOf = (x) => path.join(x.proj, '.git', 'hooks', 'post-commit');
  const readHook = (x) => { try { return fs.readFileSync(hookOf(x), 'utf8'); } catch { return null; } };
  const recOf = (x) => { try { return fs.readFileSync(path.join(x.proj, '.marvin', 'ferramentas.md'), 'utf8'); } catch { return ''; } };
  const OFFLINE = /^hook do grafo: desligado/gm;
  const SEMHOOK = /sem o hook de post-commit do Marvin/;
  const mk = (name) => {
    const x = equipped(arena(name));
    fs.mkdirSync(path.join(x.proj, '.git'), { recursive: true });
    fs.mkdirSync(path.join(x.proj, 'graphify-out'), { recursive: true });
    fs.writeFileSync(path.join(x.proj, 'graphify-out', 'graph.json'), JSON.stringify({ directed: true, nodes: [], edges: [] }));
    return x;
  };

  // 1. no flag: installed; a second run leaves it byte-identical
  const a = mk('us80-padrao');
  const r1 = run(a, '--no-git', '--no-questions');
  const h1 = readHook(a);
  check('US-80: sem flag, graphify em uso e .git: o post-commit é instalado', h1 !== null && /marvin\s+—\s+atualiza\s+o\s+grafo/.test(h1) && /--graph-docs/.test(h1), r1.stdout.slice(-500));
  check('US-80: a instalação diz o que fez e como desligar', /graph refreshes itself after each commit/.test(r1.stdout) && /--no-graph-hook/.test(r1.stdout), r1.stdout.slice(-500));
  run(a, '--no-git', '--no-questions');
  check('US-80: duas rodadas não duplicam nem reescrevem o hook (byte-idêntico)', readHook(a) === h1);
  check('US-80: o --status não acusa hook ausente quando o hook está lá', !SEMHOOK.test(run(a, '--status').stdout));
  cleanup(a);

  // 2. opt-out: not installed, recorded once, the next run without the flag does not re-enable it
  const b = mk('us80-optout');
  const ro = run(b, '--no-git', '--no-questions', '--no-graph-hook');
  check('US-80: --no-graph-hook não instala o hook', readHook(b) === null && ro.status === 0, ro.stdout.slice(-400));
  check('US-80: --no-graph-hook registra `hook do grafo: desligado` no ferramentas.md, uma vez', (recOf(b).match(OFFLINE) || []).length === 1, recOf(b).slice(-300));
  run(b, '--no-git', '--no-questions');
  check('US-80: a rodada seguinte sem flag não religa o hook', readHook(b) === null);
  run(b, '--no-git', '--no-questions', '--no-graph-hook');
  check('US-80: repetir --no-graph-hook não duplica a linha no ferramentas.md', (recOf(b).match(OFFLINE) || []).length === 1);
  const st = run(b, '--status');
  check('US-80: com o opt-out o --status não acusa hook ausente', !SEMHOOK.test(st.stdout), st.stdout.slice(-400));
  // 3. --graphify-git-hook lifts the recorded opt-out
  run(b, '--no-git', '--no-questions', '--graphify-git-hook');
  check('US-80: --graphify-git-hook força: instala e tira a linha do opt-out', readHook(b) !== null && !/hook do grafo:\s*desligado/i.test(recOf(b)), recOf(b).slice(-300));
  cleanup(b);

  // 4. someone else's post-commit is untouched, by default and with the opt-out
  const c = mk('us80-alheio');
  const alheio = '#!/bin/sh\necho lint\n';
  fs.mkdirSync(path.dirname(hookOf(c)), { recursive: true });
  fs.writeFileSync(hookOf(c), alheio);
  const rc = run(c, '--no-git', '--no-questions');
  check('US-80: hook alheio fica intocado byte a byte, sem flag', readHook(c) === alheio);
  check('US-80: hook alheio: avisa e mostra a linha para acrescentar à mão', /a post-commit hook already exists/.test(rc.stdout) && /--graph-docs/.test(rc.stdout), rc.stdout.slice(-500));
  cleanup(c);

  // 5. --dry-run writes neither the hook nor the opt-out line
  const d = mk('us80-dry');
  run(d, '--no-git', '--no-questions');   // the base exists, the hook too: remove it so the dry-run has something to (not) write
  fs.rmSync(hookOf(d));
  const recBefore = recOf(d);
  run(d, '--no-git', '--no-questions', '--dry-run');
  check('US-80: --dry-run não escreve o hook', readHook(d) === null);
  run(d, '--no-git', '--no-questions', '--dry-run', '--no-graph-hook');
  check('US-80: --dry-run --no-graph-hook não registra o opt-out', recOf(d) === recBefore && readHook(d) === null);
  cleanup(d);

  // 6. a git worktree (`.git` is a FILE): no crash, no hook
  const e = mk('us80-worktree');
  fs.rmSync(path.join(e.proj, '.git'), { recursive: true });
  fs.writeFileSync(path.join(e.proj, '.git'), 'gitdir: ../elsewhere\n');
  const rw = run(e, '--no-git', '--no-questions');
  check('US-80: worktree (.git é arquivo): não quebra e avisa que pulou', rw.status === 0 && /post-commit hook skipped: this is a git worktree/.test(rw.stdout), rw.stdout.slice(-400) + rw.stderr.slice(-300));
  cleanup(e);
}

// ── US-82. With `core.hooksPath` (husky) git never runs .git/hooks: the Marvin does not install the graph hook
//     there, does not say `ok`, writes nothing in the hooksPath, and `--status` stops saying the hook is fine.
{
  const hookOf = (x) => path.join(x.proj, '.git', 'hooks', 'post-commit');
  const treeHash = (dir) => {   // names + contents of every file under dir
    const out = [];
    const walk = (d) => { for (const n of fs.readdirSync(d).sort()) { const p = path.join(d, n); const s = fs.statSync(p);
      if (s.isDirectory()) { out.push('D ' + path.relative(dir, p)); walk(p); } else out.push('F ' + path.relative(dir, p) + ' ' + fs.readFileSync(p, 'latin1').length + ' ' + fs.readFileSync(p, 'latin1')); } };
    walk(dir); return out.join('\n');
  };
  const mk = (name, hooksPath) => {
    const x = equipped(arena(name));
    spawnSync('git', ['init', '-q'], { cwd: x.proj });
    if (hooksPath !== undefined) spawnSync('git', ['config', 'core.hooksPath', hooksPath], { cwd: x.proj });
    fs.mkdirSync(path.join(x.proj, 'graphify-out'), { recursive: true });
    fs.writeFileSync(path.join(x.proj, 'graphify-out', 'graph.json'), JSON.stringify({ directed: true, nodes: [], edges: [] }));
    return x;
  };
  const exists = (x, ...p) => fs.existsSync(path.join(x.proj, ...p));
  const DESVIO = /core\.hooksPath=\.husky/;

  const a = mk('us82-husky', '.husky');
  const r1 = run(a, '--no-git', '--no-questions');
  check('US-82: core.hooksPath=.husky: nada em .git/hooks nem em .husky/', !exists(a, '.git', 'hooks', 'post-commit') && !exists(a, '.husky'), r1.stdout.slice(-500));
  check('US-82: avisa citando core.hooksPath, com a linha para colar e o --no-graph-hook, e sem o ok', DESVIO.test(r1.stdout) && /graphify update \./.test(r1.stdout) && /--no-graph-hook/.test(r1.stdout) && !/graph refreshes itself/.test(r1.stdout), r1.stdout.slice(-600));
  const s1 = run(a, '--status'), s2 = run(a, '--status', '--curto');
  check('US-82: --status completo alerta o desvio do core.hooksPath', DESVIO.test(s1.stdout) && !/sem o hook de post-commit do Marvin/.test(s1.stdout) && s1.status === 1, s1.stdout.slice(-500));
  check('US-82: --status --curto alerta o desvio do core.hooksPath', /core\.hooksPath desvia/.test(s2.stdout), s2.stdout.slice(-300));
  const t1 = treeHash(a.proj);
  run(a, '--no-git', '--no-questions');
  check('US-82: segunda rodada não escreve nada (árvore idêntica)', treeHash(a.proj) === t1);
  run(a, '--no-git', '--no-questions', '--dry-run');
  check('US-82: --dry-run não escreve nada', treeHash(a.proj) === t1);
  const rf = run(a, '--no-git', '--no-questions', '--graphify-git-hook');
  check('US-82: --graphify-git-hook com core.hooksPath também não escreve o hook', !exists(a, '.git', 'hooks', 'post-commit') && !exists(a, '.husky') && DESVIO.test(rf.stdout) && !/graph refreshes itself/.test(rf.stdout), rf.stdout.slice(-500));
  // the opt-out still silences everything
  const ro = run(a, '--no-git', '--no-questions', '--no-graph-hook');
  check('US-82: --no-graph-hook silencia o aviso e o --status', !DESVIO.test(ro.stdout) && !DESVIO.test(run(a, '--status').stdout), ro.stdout.slice(-300));
  cleanup(a);

  // a dead Marvin hook already in .git/hooks: warned about, not deleted
  const b = mk('us82-morto', '.husky');
  const morto = '#!/bin/sh\n# marvin — atualiza o grafo de código depois do commit.\ngraphify update . && node marvin.mjs --graph-docs\n';
  fs.mkdirSync(path.dirname(hookOf(b)), { recursive: true });
  fs.writeFileSync(hookOf(b), morto);
  const rb = run(b, '--no-git', '--no-questions');
  check('US-82: hook do Marvin morto em .git/hooks é avisado e não é apagado nem reescrito', fs.readFileSync(hookOf(b), 'utf8') === morto && /dead with this core\.hooksPath/.test(rb.stdout) && DESVIO.test(rb.stdout), rb.stdout.slice(-600));
  check('US-82: hook morto não engana o --status', DESVIO.test(run(b, '--status').stdout));
  cleanup(b);

  // the line Marvin tells the user to paste is recognised: no warn, --status does not alert, nothing written
  const p = mk('us82-colada', '.husky');
  fs.mkdirSync(path.join(p.proj, '.husky'));
  const colada = '#!/bin/sh\n{ graphify update . && node "/x/marvin.mjs" --graph-docs ; } &\n';
  fs.writeFileSync(path.join(p.proj, '.husky', 'post-commit'), colada);
  const rp = run(p, '--no-git', '--no-questions');
  check('US-82: linha colada no post-commit do hooksPath: sem warn do desvio, diz que nada há a fazer', !DESVIO.test(rp.stdout) && /already runs the refresh/.test(rp.stdout) && fs.readFileSync(path.join(p.proj, '.husky', 'post-commit'), 'utf8') === colada, rp.stdout.slice(-500));
  const sp = run(p, '--status');
  check('US-82: linha colada no post-commit do hooksPath: o --status não alerta', !DESVIO.test(sp.stdout) && !/sem o hook de post-commit do Marvin/.test(sp.stdout), sp.stdout.slice(-400));
  cleanup(p);

  // a commented-out paste does not count: the alert stays
  const q = mk('us82-comentada', '.husky');
  fs.mkdirSync(path.join(q.proj, '.husky'));
  fs.writeFileSync(path.join(q.proj, '.husky', 'post-commit'), '#!/bin/sh\n# { graphify update . && node "/x/marvin.mjs" --graph-docs ; } &\n');
  const rq = run(q, '--no-git', '--no-questions'), sq = run(q, '--status');
  check('US-82: linha colada mas comentada não conta: o warn e o alerta continuam', DESVIO.test(rq.stdout) && !/already runs the refresh/.test(rq.stdout) && DESVIO.test(sq.stdout), rq.stdout.slice(-400));
  cleanup(q);

  // husky 9: core.hooksPath=.husky/_ (generated, has the script `h`); the user's file is .husky/post-commit
  const h9 = mk('us82-husky9', '.husky/_');
  fs.mkdirSync(path.join(h9.proj, '.husky', '_'), { recursive: true });
  fs.writeFileSync(path.join(h9.proj, '.husky', '_', 'h'), '#!/bin/sh\n');
  const r9 = run(h9, '--no-git', '--no-questions'), s9 = run(h9, '--status');
  check('US-82: husky 9 (.husky/_): sem a linha, o aviso cita .husky/post-commit', /core\.hooksPath=\.husky\/_/.test(r9.stdout) && /add this line to \.husky\/post-commit/.test(r9.stdout) && /em \.husky\/post-commit/.test(s9.stdout), r9.stdout.slice(-500) + s9.stdout.slice(-300));
  fs.writeFileSync(path.join(h9.proj, '.husky', 'post-commit'), colada);
  const r9b = run(h9, '--no-git', '--no-questions'), s9b = run(h9, '--status');
  check('US-82: husky 9: com a linha em .husky/post-commit, sem warn e sem alerta', !/core\.hooksPath=/.test(r9b.stdout) && /\.husky\/post-commit already runs/.test(r9b.stdout) && !/core\.hooksPath=/.test(s9b.stdout), r9b.stdout.slice(-400) + s9b.stdout.slice(-300));
  cleanup(h9);

  // hooksPath pointing at .git/hooks itself, and no hooksPath at all: the US-80 behaviour
  const c = mk('us82-aponta-git-hooks', '.git/hooks');
  run(c, '--no-git', '--no-questions');
  check('US-82: core.hooksPath=.git/hooks instala o hook como antes', exists(c, '.git', 'hooks', 'post-commit'));
  cleanup(c);
  const d = mk('us82-sem-hookspath');
  const rd = run(d, '--no-git', '--no-questions');
  check('US-82: sem core.hooksPath o hook é instalado e o ok aparece', exists(d, '.git', 'hooks', 'post-commit') && /graph refreshes itself/.test(rd.stdout) && !/core\.hooksPath/.test(rd.stdout), rd.stdout.slice(-400));
  cleanup(d);
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
