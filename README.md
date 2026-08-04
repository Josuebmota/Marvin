# Marvin

**English** · [Português](README.pt-BR.md)

[![teste](https://github.com/Josuebmota/Marvin/actions/workflows/teste.yml/badge.svg)](https://github.com/Josuebmota/Marvin/actions/workflows/teste.yml)

Scaffolds a project's **knowledge base** for working with AI agents — in a way that
survives switching tools and switching LLMs.

Not a framework. Nothing runs in the background. No dependencies. It's a ~1390-line Node
script that creates a structure and gets out of the way.

```bash
npx marvin-kb --tools=claude,codex
```

> **The package is `marvin-kb`, the command is `marvin`.** `marvin` was already taken on
> npm, so `npx marvin` would fetch someone else's package — use `npx marvin-kb`. After
> `npm i -g marvin-kb` the command on your PATH is just `marvin`.

Or clone it and run the file directly — it's a single script with no dependencies:

```bash
node /path/to/marvin/marvin.mjs --tools=claude,codex
```

## The problem

Every AI tool wants your project context in its own format: `CLAUDE.md`,
`.cursor/rules/`, `CONVENTIONS.md`, `AGENT.md`, `AGENTS.md`. Use more than one and you end
up with the same content in N places — and **N copies diverge**. By week three one of them
is lying, and the agent believes it.

Worse: agent memory usually lives in your user profile, outside the repository. Not in
git, not backed up, gone when the machine dies.

## How it solves it

**One source, N thin adapters.** All durable content lives in `AGENTS.md` — the standard
that Codex, Cursor, Aider, Zed and opencode read. Each tool's file is a **15-line
pointer** with no content of its own. Divergence becomes structurally impossible.

**Memory inside the repository, via an inverted junction:**

```
~/.claude/projects/<path>/memory  ──junction──►  .docs/08_Memoria/
```

The tool writes to its own default path; the files are born inside the repository. Memory
versioned in git, browsable as an Obsidian vault, one source. Switch tools and **the files
stay** — only the auto-loading goes away.

## What it creates

```
<project>/
├── AGENTS.md                   source of truth — all durable content
├── CLAUDE.md                   adapter (only if you pick claude)
├── .cursor/rules/projeto.mdc   adapter (only if you pick cursor)
├── .claude/
│   ├── agents/README.md        guide for writing your team
│   ├── skills/README.md        skill vs. agent vs. command: the discriminator
│   └── commands/retomar.md     /retomar: the entry point
└── .docs/                      ← Obsidian vault
    ├── 00_Inicio.md
    ├── 00_Fontes_Externas.md   where user stories, roadmap and design live
    ├── 08_Memoria/
    │   └── onde_paramos.md     the only door; always overwritten
    └── 99_Backup/
```

> Generated file and folder names are in Portuguese, matching the templates the script
> ships. They are yours to rename — nothing in the script depends on the names except the
> vault markers below.

## Where the vault lands — and why it isn't always `.docs`

The script **looks for an existing vault by its markers** (`08_Memoria/` or `.obsidian/`),
not by folder name. The rule:

| Situation | Result |
|---|---|
| New project | creates **`.docs/`** |
| A vault already exists in `Docs/` (or `docs/`) | **reuses it**, no duplicate |
| A `Docs/` exists that is **not** a vault (product documentation) | creates `.docs/` alongside and says: *"living next to product Docs/ — untouched"* |

The dot in the name exists so it **won't collide with product documentation**. If the
project's `Docs/` is already where knowledge lives, merging beats separating: wikilinks
between memory and docs stay in the same Obsidian graph. Separating would create two
vaults that can't see each other, and `[[link]]` across them breaks.

**Practical consequence:** migrated projects tend to sit in `Docs/`, new ones in `.docs/`.
That's the design, not an inconsistency. Only rename to `.docs` if the folder is **100%
tooling** — and if you do rename it, **rebuild the junction**, because it still points at
the old path and goes orphaned silently:

```powershell
# PowerShell — removes ONLY the link, never the content
[System.IO.Directory]::Delete("$env:USERPROFILE\.claude\projects\<path>\memory", $false)
git mv Docs .docs
New-Item -ItemType Junction -Path "$env:USERPROFILE\.claude\projects\<path>\memory" `
         -Target "$PWD\.docs\08_Memoria"
```

Then update the references to `Docs/` in `AGENTS.md`, in the tool adapter, in
`retomar.md`, and in the memory notes.

## What it deliberately does NOT do

**It doesn't write your agents, and it doesn't write the body of `AGENTS.md`.** That
requires knowing the project's traps, and a generic agent is worse than no agent.
`PROMPT.md` carries the prompt that guides this part.

The difference between an agent that helps and one that gets in the way isn't the role
description — it's the concrete trap written inside it. `"you are a senior React dev"` is
worth nothing; `` "`account.balance` is the opening balance, not the displayed one" ``
prevents a bug.

Same for skills: the script creates the folder and the guide, **no skills**.

## Agent, skill, or command?

The scaffold ships the discriminator, because getting this wrong is common:

|  | Where the text loads | Who uses it |
|---|---|---|
| **Agent** | its **own clean** context | spawned, isolated |
| **Skill** | the **current** context | whoever invokes it |
| **Command** | current context | **you** trigger it |

> **A fact the subagent must know** → in the agent's `.md`.
> **A procedure 2+ roles run** → skill.
> **Something you trigger** → command.

**The catch:** a subagent starts with a clean context. It doesn't read `AGENTS.md`, doesn't
read the adapter, and doesn't read skills — unless it has the `Skill` tool in its list. So
**repeating a critical fact inside every agent that needs it isn't sloppiness, it's the
only way.** What must not be repeated is *procedure*.

**Cost rule:** a new skill only after the procedure has run **twice**. Every skill's
description loads in every session — thirty skills become the problem skills were supposed
to solve.

## Tools

| Flag | Generates | Confidence |
|---|---|---|
| `codex`, `opencode` | nothing — they read `AGENTS.md` natively | high |
| `claude` | `CLAUDE.md` + `/retomar` | high |
| `copilot` | `.github/copilot-instructions.md` | high |
| `cursor` | `.cursor/rules/projeto.mdc` | **medium** |
| `aider` | `CONVENTIONS.md` | **medium** |
| `zed` | `AGENT.md` | **low** |

GitHub Copilot's agent also reads `AGENTS.md` anywhere in the repo, but chat and code
completion don't — that's why the pointer file is generated anyway.

Medium and low confidence adapters ship with a warning at the top telling you to verify
the current convention. **An adapter that doesn't load fails silently** — worse than no
adapter at all.

Running again with a different list **adds** what's missing; nothing is removed.

## Diagnostics

Beyond creating things, it points out problems that slip by:

- **Real stack per directory** — doesn't trust folder names
- **Directories that look like a service but are empty** — stops you from writing an agent
  for code that doesn't exist
- **Junk in the root** — a file with a strange name is a malformed shell command, not content
- **Empty files tracked in git** — almost always junk that slipped in via `git add -A`
- **Fixed context** — counts agents, skills and commands per level and estimates how many
  tokens each `description` costs in **every** session. A heavy global level is paid in
  every project, used or not. Also warns when more than 2 levels have agents — the most
  specific one wins silently
- **Leftovers from old orchestration tools** — only shows up if detected

## Flags

```
--tools=<list>    adapters to generate. default: claude
                  valid: claude, codex, copilot, cursor, aider, zed, opencode
                  running again with a different list ADDS what's missing
--check           diagnoses the memory mount and exits non-zero if it is broken.
                  Writes nothing. Run it after moving or renaming the project
--dry-run         print everything it would do, write nothing
--clean-legacy    removes old orchestrator leftovers
--no-git          skips git init and .gitignore
--graphify        builds a code graph for structural queries (needs graphify on PATH)
--help, -h        usage; exits without writing
```

### After moving or renaming the project folder

The junction survives the folder it points at. Move or rename the project and it keeps
pointing at the old path, while your agent creates a **real, empty directory** at the new
one. Nothing warns you: the agent writes memory, and none of it reaches the repository.

```bash
marvin --check
```

Read-only, and the exit code is the message — so it works in a hook, in CI, or as a shell
alias. It also lists orphan junctions left behind by projects that moved. To repair, run
`marvin` normally: an empty directory sitting where the link belongs is removed and the
junction recreated. If there are notes in it, they're copied and counted first — never
deleted before the count checks out.

**Try it safely first.** The script writes into your repository *and* creates a junction
in `~/.claude/projects/`, outside it. `--dry-run` lists every operation — every folder,
every file, the junction, and `git init` — and writes nothing:

```bash
node /path/to/marvin/marvin.mjs --dry-run
```

Every disk-mutating call goes through a single shim, so a write that skipped `--dry-run`
would be a bug, not a gap. A dry run that lies is worse than no dry run.

The older Portuguese names (`--ferramentas=`, `--limpar-legado`, `--sem-git`) still work as
aliases. Renaming a flag without an alias would break anyone with a script already wired
up — which is exactly the problem the script now handles.

## Upgrading a project that's already set up

Every write is guarded by `if (!fs.existsSync(...))` — that's what makes the script
idempotent. The side effect: **a file that already exists is frozen at the version that
created it.** Set a project up in July, run the August version, and you get nothing,
because the script says "already exists" and moves on.

Running it again now checks, in each file it generates but doesn't overwrite, whether the
blocks newer versions added are present — and **reports the missing ones**. It rewrites
nothing: the file is yours and may have been edited on purpose.

There is no version file. The check reads the actual content, because a stored version
number would be one more derived artifact — and derived artifacts go stale silently.

## `--graphify` — queries, no hook

Optional and never a dependency. Builds `graphify-out/graph.json` with
[graphify](https://github.com/Graphify-Labs/graphify) to answer **structural** questions:
what calls what, type hierarchy, cross-package dependencies. That's where a graph beats
`grep` — which gives you the name, but not the relationship.

Without it on PATH the step warns and skips, changing nothing else.

### Should you use it?

Only if you ask **structural** questions often — "what calls this", "what breaks if I change
this interface", "which packages depend on which". If your questions are "where is X" or
"which file has Y", `grep` and `glob` are cheaper and always fresh. Read the measured numbers
at the end of this section before deciding.

### Installing and using it

It's a Python tool, so it installs outside npm. Either works:

```bash
uv tool install graphifyy
```

```bash
pipx install graphifyy
```

Confirm it's on PATH — if this fails, the `--graphify` step will skip:

```bash
graphify --version
```

Then build the graph from the project root:

```bash
npx marvin-kb --graphify
```

Ask it structural questions:

```bash
graphify query "what calls the payment service"
```

After changing code, refresh it before trusting an answer — **it does not warn you when it's
stale**:

```bash
graphify update .
```

Running `marvin --graphify` again does not rebuild an existing graph (running twice must not
overwrite), but it does compare the graph's timestamp against the whole tree and tell you if
it went stale.

**What it deliberately does NOT do:**

- **It doesn't run `graphify claude install`.** That command installs a `PreToolUse` hook
  answering `MANDATORY: you MUST run graphify before reading` on every `Read` and `Grep` —
  and its freshness check only looks at the *target file's* mtime: it relaxes on the file
  you just edited and hardens everywhere else, including `grep`, which is how you'd
  discover the change. A stale graph carrying MANDATORY authority is worse than no graph.
- **It doesn't version the graph.** `graphify-out/` goes into `.gitignore`. A committed
  derived artifact is how it goes stale silently — and it generates merge conflicts too.
- **It doesn't index markdown.** Runs with `--code-only`: local AST only, no LLM key and no
  cost. Graphify's `.md` pass requires paid extraction.

In exchange, the step compares the graph's mtime against the **whole tree** and warns when
it's stale — the check the original hook lacks. A warning, never an order.

> **Measured gain** (195-file Python repo, 2,640 nodes): **9.3×** by graphify's own
> benchmark — not the 71× advertised — and that 9.3× is against *reading the entire
> repository*. Against targeted `grep`, the graph only pays off on structural questions:
> locating a file costs it ~1,650 tokens versus ~18 for a glob.

## Requirements

Node 18+. No dependencies.

**Windows** — uses a *junction*, which needs no admin rights. Primary platform.

**Linux** — tested on `node:20-alpine`. Node ignores the `'junction'` type outside Windows
and creates a directory symlink, which behaves identically: writing through the profile
path lands in the repository. Verified end to end, including memory migration (5 notes
copied, counted, profile replaced by the link) and idempotency.

**macOS** — covered by CI. It takes the same code path as Linux, and the workflow runs the
suite on `macos-latest` at every push.

## A note on language

The script's output is in English. The **generated templates** are in Portuguese — they are
the files you'll rewrite for your own project anyway, so treat them as a starting shape
rather than final text.

## Tests

```bash
node teste.mjs
```

48 checks, no dependencies, ~2 seconds. It covers the invariants that protect other
people's disks — `--help`, `--dry-run` and `--check` write nothing, running twice doesn't
duplicate, existing memory is copied and counted before the profile is replaced by the
link, and a junction broken by a moved folder is repaired instead of merely reported.
The dry-run plan is checked too: on an already-set-up project it must promise nothing.

The test is **hermetic**: it redirects `HOME`/`USERPROFILE` to a temp directory, so running
it never creates a junction in your real profile. CI runs it on Linux, Windows and macOS.

One declared gap: the migration's **abort** branch (copied fewer notes than the source) is
not tested — forcing a partial copy needs mocking or directory permissions. It's written
down in the test header rather than faked. A test that pretends to cover is worse than a
declared gap.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The short version: run `node teste.mjs`, and
read the four invariants in [AGENTS.md](AGENTS.md) before changing behaviour.

## License

MIT.
