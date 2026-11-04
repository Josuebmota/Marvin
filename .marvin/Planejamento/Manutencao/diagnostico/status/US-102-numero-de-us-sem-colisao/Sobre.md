---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-102-numero-de-us-sem-colisao
description: "Ativa por ordem do dono (04/11/2026): o --us avisa quando o prefixo US-NN já existe em outro caminho do Planejamento local. Sem sugerir número, sem bloquear, sem rede."
---
# US-102 — número de US sem colisão

**Por quê:** dois escritores numeraram US sem se falar: a US-94 era do dono, aberta por fora, e a sessão da modularização renumerou a sua para US-95 (commit `8fbd9a4`). **Premissa corrigida pelo crivo:** o `marvin --us` não sugere número nenhum (`marvin.mjs:2013-2018`: o nome vem de quem chama; `normUsPath` :748), e não há checagem de duplicata; em todo o `git log --all` há **uma** colisão (n=1, `po` e `tl`).
**Pronto quando** (dono, 04/11/2026: desenvolver mesmo com n=1, a regra "esperar a segunda colisão" foi dispensada):
1. `marvin --us <caminho>` que **cria** uma US nova e encontra outra US com o mesmo prefixo `US-NN` em caminho diferente do Planejamento local imprime um aviso (`warn`) com os dois caminhos. Escreve a US mesmo assim e sai com 0.
2. Não avisa na US que já existe no mesmo caminho (idempotência), nem em `--pausar`, `--ativa` ou `--anotada` de uma existente.
3. Sem rede, sem `git fetch`, sem sugerir número, respeita `--no-git` (nem lê git).
4. `teste.mjs` cobre: colisão avisa e escreve; sem colisão não avisa; repetir o mesmo caminho não avisa. `node teste.mjs` passa.

**Não entra:** renumerar, sugerir número, consultar o remoto por rede.

## Perguntas
- ~~❓ A colisão foi você abrindo a US por fora sem commitar? Se foi, o conserto é de processo (anotar com `--anotada` e commitar na hora), não de script.~~ → **sim, aberta por fora** (dono, 01/11/2026): o conserto é de processo, anotar com `--anotada` e commitar na hora.
- ~~❓ Cancela, ou fica estacionada esperando a segunda colisão? O `po` recomenda um dos dois; também notou que a Feature certa seria `Novos/organizacao-por-grafo/script`, ao lado das US-79 e 81, e não `diagnostico/status`.~~ → **estacionar** (dono, 01/11/2026); reabre se houver uma segunda colisão.

## Código tocado
- `marvin.mjs` — o ramo `--us` que cria a US (L2009 em diante) e `planningNodes` (L716)
- `teste.mjs`

## Time
Refinada e ativada em 04/11/2026 por ordem do dono ("refina e desenvolve as restantes").

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar e testar | dev-back | Sonnet · médio | mudança pequena no `--us` com teste hermético | pendente |
| ler o diff | tl | Opus · médio | toca o `--us`, que escreve no disco | pendente |

Grafo (fresco, 04/11 17:21): `planningNodes` e `normUsPath`/`usKeyOf` (L716, L751-752) são o que o aviso reaproveita; o ramo `--us` é top-level, sem nó (Grep para localizar).

## Rumo
- **01/11/2026** — anotada na conversa de 01/11. Crivo `tl` + `po`: **não refinada**. O `po` a quer cancelada ou estacionada (n=1, premissa errada); o `tl` descreve o menor escopo possível, mas pede que o `po` pese se vale com n=1. Fica `anotada` até o dono responder as ❓.
- **01/11/2026** — ❓ respondidas pelo dono: a colisão foi US aberta por fora sem commit (conserto de processo) e a US fica estacionada.
- **04/11/2026** — o dono mandou refinar e desenvolver as três anotadas (US-88, 89, 102); a espera pela segunda colisão foi dispensada. Ativa.

## Evidência
`marvin.mjs`, ramo `--us` (guarda de colisão antes de criar) + 3 verificações em `teste.mjs`; `node teste.mjs`: 727 passaram no commit `0e716c8` (04/11/2026). Diff lido pela sessão principal: sem escrita nova, sem rede nem git.
