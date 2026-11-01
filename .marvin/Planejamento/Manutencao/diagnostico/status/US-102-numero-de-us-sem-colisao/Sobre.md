---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-102-numero-de-us-sem-colisao
description: "Anotação estacionada: avisar quando o prefixo US-NN já existe em outro caminho. Premissa corrigida: o --us não sugere número; n=1."
---
# US-102 — número de US sem colisão

**Por quê:** dois escritores numeraram US sem se falar: a US-94 era do dono, aberta por fora, e a sessão da modularização renumerou a sua para US-95 (commit `8fbd9a4`). **Premissa corrigida pelo crivo:** o `marvin --us` não sugere número nenhum (`marvin.mjs:2013-2018`: o nome vem de quem chama; `normUsPath` :748), e não há checagem de duplicata; em todo o `git log --all` há **uma** colisão (n=1, `po` e `tl`).
**Pronto quando:** _(estacionada)_ — só depois de uma segunda colisão. Esboço mínimo do `tl`: o `--us` **avisa** quando o prefixo `US-NN` já existe em outro caminho do Planejamento local (barato via `planningNodes`), sem `git fetch`, sem sugerir número e sem bloquear a escrita; branches só entrariam se o `po` aceitar, e respeitando `--no-git`.

**Não entra:** renumerar, sugerir número, consultar o remoto por rede.

## Perguntas
- ❓ A colisão foi você abrindo a US por fora sem commitar? Se foi, o conserto é de processo (anotar com `--anotada` e commitar na hora), não de script.
- ❓ Cancela, ou fica estacionada esperando a segunda colisão? O `po` recomenda um dos dois; também notou que a Feature certa seria `Novos/organizacao-por-grafo/script`, ao lado das US-79 e 81, e não `diagnostico/status`.

## Rumo
- **01/11/2026** — anotada na conversa de 01/11. Crivo `tl` + `po`: **não refinada**. O `po` a quer cancelada ou estacionada (n=1, premissa errada); o `tl` descreve o menor escopo possível, mas pede que o `po` pese se vale com n=1. Fica `anotada` até o dono responder as ❓.
