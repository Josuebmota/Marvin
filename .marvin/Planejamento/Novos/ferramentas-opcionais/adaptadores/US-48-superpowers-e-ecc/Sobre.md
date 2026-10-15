---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-48-superpowers-e-ecc
description: "Avalia Superpowers (reabre a US-25) e ECC, uma ferramenta por vez e no escopo do projeto, como ferramentas de execução chamadas pela equipe — portão de entrada de ferramenta da US-50."
---
# US-48 — Superpowers e ECC como ferramentas de execução da equipe

**Por quê:** O dono pediu ferramentas que ajudem o contexto: o Superpowers (a US-25 decidiu só citá-lo no README) e o [ECC](https://github.com/affaan-m/ECC). O custo de tê-las no **global** está medido e foi eliminado na Fase 0 (backup em `~/.claude/_backup-2026-10-15/`); o **ganho** de qualquer uma não está. Esta US é o portão: a [US-50](../../curadoria/US-50-marvin-plugin-e-curador/Sobre.md) só instala o que aqui virar `sim` no `ferramentas.md` (`po` + `tl`). Arquitetura: [equipe-barata](../../../../../Contexto/Arquitetura/equipe-barata.md). Fase 3, a primeira da fase.

**Pronto quando** — **uma ferramenta por vez**, cada uma com seu próprio par:
1. Inventário do que a ferramenta traria, a partir do backup (não mais do global), com o custo fixo de cada item (skills, agentes, comandos). Os agentes que duplicam papel do Marvin (`code-reviewer`, `planner`, `architect`…) ficam de fora por padrão.
2. Instalada no escopo do projeto escolhido no ❓2, com autorização do dono; passo 4b e `/context` antes e depois.
3. Usada numa US real e medida contra o par da mesma classe sem ela (US-29).
4. Decisão `sim`/`não` em `.marvin/ferramentas.md`, com o número. Sem par medido que pague, sai (`não`).
5. Nenhum estado paralelo: spec do Superpowers e memória do ECC não substituem o `Sobre.md` nem a nota.

**Não entra:** instalar no global ou na máquina de alguém sem pedir; `docs/superpowers/` competindo com `.marvin/`; o `marvin.mjs` (só a US-50 instala); inventário do perfil global atual (já limpo).

## Código tocado
- `.marvin/ferramentas.md` — a decisão
- `~/.claude/_backup-2026-10-15/` — inventário (leitura)
- `marvin.mjs` — `OPTIONAL_TOOLS` :1911, só se adaptar (e aí na US-50)

## Time
- **Grafo (15/10, fresco: graph.json 4 s depois do `b0fe0a3`):** `OPTIONAL_TOOLS` :1911 — sem affected, grau 1. É avaliação, não código.
- **Ação do dono:** autorizar e rodar a instalação; escolher a US cobaia; decidir com o número.
- `scout` Haiku baixo — inventário a partir do backup
- `tl` Opus médio — régua e decisão
- **Bloqueio:** portão da Fase 2 (US-29).
- **Divisão:** o `tl` propõe 48a Superpowers / 48b ECC (1 chat cada); o `po` pede uma por vez. Ficou uma US com uma ferramenta por rodada — divide se o dono preferir.

## Skills
`adaptador-de-ferramenta` (se alguma virar `sim`).

## ❓
1. Qual vai primeiro: ECC (só `tdd-workflow`/`build-fix`/`security-scan`) ou Superpowers? O Superpowers já foi recusado na US-25: que fato novo você tem? (`po`)
2. Qual US real serve de cobaia, e instala no repo do Marvin ou num projeto descartável? (`tl`)

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-25 — avaliar Superpowers e Claude Octopus contra o fluxo do Marvin](../US-25-avaliar-superpowers-e-octopus/Sobre.md) — 1 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum

## Rumo
- **15/10/2026** — anotada a partir da definição "equipe barata" do dono. Está fora da fila até o `/refinar`.
- **15/10/2026** — revisão da arquitetura (`tl` + `po`, Opus medium): conta como amostra da US-29 e não depende da US-45.
- **15/10/2026** — o dono acrescentou o ECC; a US passa a avaliar os dois com a mesma régua (custo fixo pelo passo 4b, par medido pela US-29).
- **15/10/2026** — `/refinar` (logo tudo): refinada como portão da US-50, uma ferramenta por vez; item 4 (inventário global) reescrito a partir do backup — o global já foi limpo na Fase 0.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
