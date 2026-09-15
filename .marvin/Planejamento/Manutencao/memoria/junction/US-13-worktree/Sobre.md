---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso

**Por quê:** a memória é derivada do `cwd`. Numa worktree (ou clone em outro caminho) o
Claude Code cria `~/.claude/projects/<caminho-da-worktree>/memory` como diretório real e
vazio: o agente escreve, nada chega ao repositório, e nada avisa. Descoberto em 15/09/2026
ao perguntar se várias sessões no mesmo projeto se chocam — no mesmo diretório não (a nota
é só ponteiro, cada US tem seu `Sobre.md`); em worktree, sim, e em silêncio.

**Pronto quando:** rodar `marvin` de dentro de uma worktree (a) detecta que é worktree
(`.git` é **arquivo** com `gitdir:`, não pasta), (b) monta a junction para o
`.marvin/Memoria` **da própria worktree** — memória versionada anda com o branch, e apontar
para a raiz principal misturaria notas de dois branches num checkout só — e (c) diz no passo
6 que é worktree e que as notas ficam no branch dela. E o hook `SessionStart` (`--status
--curto`) acusa junction ausente/diretório real, para a sessão que abriu na worktree sem
rodar `marvin` não escrever no vazio. Teste no `teste.mjs` com uma worktree de verdade
(`git worktree add`), nos três SO do CI.

## Fluxos ligados
- [montagem](../../../../Contexto/Fluxos/montagem.md) — passo 3 (memória, passo 6 do script)

## Código tocado
- `marvin.mjs` — `MEM` (derivação do caminho da memória)
- `marvin.mjs` — passo 6 (junction invertida)
- `marvin.mjs` — `--check` (diagnóstico da montagem)
- `marvin.mjs` — `--status --curto` (o que o hook SessionStart roda)
- `teste.mjs` — caso novo: worktree

## Time
- tl — a mudança escreve no disco de alguém (junction) e toca o invariante 1
- dev-back — implementação
- qa — o teste hermético com `git worktree add` nos três SO
- po — decidir se a junction aponta para a worktree ou para a raiz principal (proposta acima: worktree)

## Skills
- nenhuma proposta — é um ramo novo no passo 6, não procedimento que se repete

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 3 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../../Novos/organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../../Novos/organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../../Novos/organizacao-por-grafo/script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../../Novos/organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../../Novos/organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../../Novos/organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum

## Rumo
- **15/09/2026** — aberta. Hipótese a confirmar antes de codar: rodar `marvin` de dentro da
  worktree **já** monta a junction certa (RAIZ = cwd), então o buraco pode ser só (1) ninguém
  roda, e (2) o hook não acusa. Se confirmar, a US vira: detectar worktree para o aviso do
  passo 6 + o `--status --curto` do hook chamar a checagem do `--check` sem sair != 0.
  Descartado: apontar para a raiz principal — mistura branches no mesmo checkout.

## Evidência
