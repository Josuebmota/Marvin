---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-47-defect-e-task
description: "tipo: defect e tipo: task como nós do grafo, com estados, no --us, no --status e no painel."
---
# US-47 — Defect e Task na hierarquia

**Por quê:** O Marvin trabalha como Scrum: Defect é defeito com causa e reprodução, Task é a etapa que vai para o subagente. Hoje só existem Epic, Feature e US. Arquitetura: [equipe-barata](../../../../../Contexto/Arquitetura/equipe-barata.md).

**Pronto quando (rascunho — o refino fecha):**
1. `marvin --us` aceita criar Defect e Task; `tipo: defect|task` no frontmatter.
2. `--status`, ilhas, `--release` e painel tratam Defect como US e mostram as Task da US.
3. Base antiga continua válida (US vira Defect só se o dono mover).
4. `teste.mjs` cobre.
5. `anotada` entra no `--status`: contagem do epic e grupo "Anotadas" no roadmap e no painel, no `stateMark` e no comentário de estados do template. Hoje ela não aparece em lugar nenhum, o que contraria "listar sem custo".

**Não entra:** Migrar US antigas automaticamente.

## Código tocado
- `marvin.mjs` — `planningNodes`, `ilhasOf`, `docsGraph`, `touchedByUS`, `computeStatus` (contagem de epics), `stateMark`, `--us`, `--release` (filtro `concluded`), `writeStatusHtml` (`cat`), template de estados
- `teste.mjs`

## Time
_(a triar no refino: `po` + `tl`, com o passo de estrutura do grafo)_

## Skills
_(a propor no refino)_

## ❓
- ❓ O `po` propõe: Defect como sinônimo de US no script, e Task continuando como linha do *Time* (`etapa | papel | modelo | esforço`), virando nó só quando a US-29 pedir custo por Task, porque Task como arquivo gasta mais (um nó a ler por etapa). O dono quer Task como nó já, ou como linha do *Time* por enquanto? (Decisão do dono.)

## Rumo
- **15/10/2026** — anotada a partir da definição "equipe barata" do dono. Está fora da fila até o `/refinar`.
- **15/10/2026** — revisão da arquitetura (`tl` + `po`, Opus medium): o `tl` fez o passo de estrutura: o grafo não vê quem chama `planningNodes` no nível de módulo (`--release` em :1625 e `--us` em :1399-1473), por isso o *Código tocado* foi completado por Grep.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
