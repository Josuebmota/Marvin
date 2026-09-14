---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-08 — Tokens gastos por modelo, medidos das transcrições

**Por quê:** o 4b media o que carrega; ninguém media o que foi pago. O dado existe em `~/.claude/projects/<projeto>/*.jsonl` (`model` + `usage` por resposta).
**Pronto quando:** `--status` e o HTML mostram tokens por modelo (in, cache write, cache read, out), custo estimado com tabela datada, e a fatia do contexto fixo por turno.

## Fluxos ligados
_(link para ../../../../../Contexto/Fluxos/<fluxo>.md — fluxo sem nota ganha uma agora)_

## Código tocado
- `marvin.mjs` — `calcularGastos`
- `marvin.mjs` — `imprimirGastos`
- `marvin.mjs` — `custoDe`

## Time
_(base: tl · po · dev-front · dev-back · qa · scout; mais design/dba/sec/infra se a atividade pede. O que ela não usa não entra.)_

## Skills
_(procedimento que vai repetir — proposta aqui, SKILL.md na segunda vez)_

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 3 nó(s) de código em 1 comunidade(s).

**Quem depende do que ela toca** (3, até 2 níveis) — é o que o QA precisa cobrir:
- `calcularStatus()  marvin.mjs:L865`
- `imprimirStatus()  marvin.mjs:L912`
- `escreverStatusHtml()  marvin.mjs:L628`

Nenhuma outra US passa por este código.

## Rumo
- **11/09/2026** — pedida e feita. Dedupe por id de mensagem (a mesma resposta é gravada 3× enquanto streama); subagentes contam à parte. Achado que muda a leitura: neste repo o contexto fixo é ~1% do que cada turno relê — a conversa longa é o custo, não o arquivo grande. A regra de higiene de sessão ganhou um número.

## Evidência
- teste 9y (dedupe, modelo, subagente, custo, fatia); aqui: 5 sessões, 1.020 turnos, 305M cache-read, ≈ $231.
