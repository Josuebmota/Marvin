#!/usr/bin/env node
// PreToolUse(Bash) lock: blocks `git commit` when the "tests passed" mark (written by
// teste.mjs inside the git dir) does not match marvin.mjs + teste.mjs + package.json.
// exit 2 blocks (stderr is the reason). ANY error of its own => exit 0: a buggy lock
// must never block every commit.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

try {
  const input = JSON.parse(fs.readFileSync(0, 'utf8'));
  const cmd = String(input?.tool_input?.command ?? '');
  if (!/\bgit\s+commit\b/.test(cmd)) process.exit(0);
  // the test runs in the same command and gates the commit: `node teste.mjs && ... git commit`
  if (/node\s+teste\.mjs[ \t]*&&[^;|\n]*?\bgit\s+commit\b/.test(cmd)) process.exit(0);

  const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  const start = input.cwd || process.cwd();
  const root = git(start, 'rev-parse', '--show-toplevel');
  const gitDir = path.resolve(root, git(root, 'rev-parse', '--git-dir'));

  const h = crypto.createHash('sha1');
  for (const f of ['marvin.mjs', 'teste.mjs', 'package.json']) h.update(fs.readFileSync(path.join(root, f)));
  const hash = h.digest('hex');

  let mark = '';
  try { mark = fs.readFileSync(path.join(gitDir, 'marvin-teste-passou'), 'utf8').trim(); } catch {}
  if (mark !== hash) {
    process.stderr.write('rode `node teste.mjs` antes de commitar (a marca do teste não bate com marvin.mjs/teste.mjs/package.json)\n');
    process.exit(2);
  }
} catch {
  // own error: release
}
process.exit(0);
