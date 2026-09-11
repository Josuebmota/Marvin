# Contributing

Thanks for looking. This is a small tool with strong opinions, so it's worth knowing what
gets merged before you spend an evening on a patch.

## Before anything

```bash
node teste.mjs
```

28 checks, no dependencies, ~2 seconds. Everything must pass on your platform. If you can,
run it on a second one — the memory link is the part that behaves differently across
operating systems, and it's the part that would hurt someone if it broke.

## The four invariants

These are not style preferences. A change that breaks one of them will be asked to change,
however good the rest of it is. They're explained in [AGENTS.md](AGENTS.md); the short
version:

1. **Never destroy data without checking first.** The memory migration copies, *counts*,
   and only then deletes. If it copied fewer notes than the source, it aborts and deletes
   nothing.
2. **Always idempotent.** Running twice must not duplicate or overwrite. Every write block
   is guarded by `if (!fs.existsSync(...))`.
3. **Don't invent tool conventions.** An adapter with medium or low confidence ships with a
   warning telling the user to verify. **An adapter that doesn't load fails silently** —
   worse than no adapter at all. If you add a tool, say honestly how sure you are, and add
   it to the confidence table in both READMEs.
4. **Don't write content that requires knowing the project.** Agents, skills, and the body
   of `AGENTS.md` belong to the human using the tool. Generic is worse than absent. This is
   the one people most often want to "fix" — please don't.

## Two rules that follow from those

**Every disk-mutating call goes through `fsw` / `exec`.** That's what makes `--dry-run`
honest. If you add a write that calls `fs.writeFileSync` directly, `--dry-run` silently
starts lying — and a dry run that lies is worse than no dry run.

**No `Date.now()`, no `Math.random()`.** The script has to be deterministic to be
idempotent.

## Dependencies

There are none, and there won't be. `package.json` exists only to provide `bin` so `npx
marvin-kb` works — it has no `dependencies` and no `devDependencies`. A PR that adds one
needs to argue why the feature is worth breaking the property that makes this thing easy to
audit and trust.

## Language

- **Output, flags, and these docs:** English.
- **Code comments and commit messages:** Portuguese. This is the author's project and that
  isn't changing. Don't let it stop you — write your comments in English if that's what you
  have, and they'll be translated on merge.
- **The generated templates** (`AGENTS.md`, `Contexto/Sobre.md`, the READMEs it scaffolds) are
  Portuguese. Translating those is a real, wanted contribution, but it's a bigger change
  than it looks — open an issue first so we agree on how the two versions stay in sync.

## What's most useful right now

- **Real-world runs.** CI covers Linux, Windows and macOS on every push, so the platform
  question is settled. What it can't cover is your *actual* repo — a monorepo, an existing
  `Docs/` vault, a project already wired to another tool. Reports from those are the gap now.
- **Tool conventions that changed.** Cursor, Aider and Zed are marked medium/low confidence
  on purpose. If you know a current path is right or wrong, that's the highest-value fix
  here — and please update the confidence table and the seal in `marvin.mjs` together.
- **The migration abort branch has no test.** Forcing a partial copy needs mocking or
  directory permissions; it's a declared gap in the header of `teste.mjs`. A clean way to
  cover it without adding a dependency would be welcome.

## Things that will be declined

- Making the script write agents, skills, or the body of `AGENTS.md` (invariant 4).
- Adding a runtime dependency.
- A config file. Flags are the whole interface on purpose.
- Splitting `marvin.mjs` into modules. One file you can read top to bottom is a feature
  for a tool that writes into other people's repositories.

## Opening a PR

Small and focused. Say which invariant your change touches, if any, and paste the output of
`node teste.mjs`. If you changed behaviour, show a before/after of the relevant step's
output — that's usually more convincing than a description.

## Note

There is a hand-maintained table in step 10 (`ATUALIZACOES` in `marvin.mjs`) listing blocks
that newer versions added to files the script generates but never overwrites. If you add a
section to a generated template, add a marker for it there too — otherwise people who set
their project up with an older version will never hear about it. This is the part of the
codebase most likely to drift; it's a known cost, not an oversight.
