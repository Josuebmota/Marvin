---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-45-porta-unica
description: "Um comando recebe uma lista de atividades e leva cada uma por refino, triagem de custo, subagentes, qa, tl e fechamento, registrando o custo."
---
# US-45 — porta única: entrego as atividades e o Marvin orquestra

**Por quê:** Hoje o dono conduz cada rito (/refinar, /us, /continuar). Uma equipe terceirizada recebe o serviço e se organiza. Arquitetura: [equipe-barata](../../../../../Contexto/Arquitetura/equipe-barata.md).

**Pronto quando (rascunho — o refino fecha):**
1. Um comando novo (gerado com `writeIfMissing` + `fsw` + `ATUALIZACOES`) recebe N atividades e, para cada uma, faz refino → triagem (papel, modelo e esforço pela tabela de partida) → delegação → qa → tl → fecha.
2. Paradas obrigatórias do `/continuar` valem: push, publish, invariante, teste vermelho, pergunta que só o dono responde.
3. Cada atividade sai com o custo lido do `--status` (US-41) e anotado pelo comando no *Time* da US; o script só lê. Nenhum comando executa duas US no mesmo contexto: cada execução é uma rodada própria.

**Não entra:** Troca de executor sem humano (US-20); router como software.

## Código tocado
- `marvin.mjs` — comandos gerados, `ATUALIZACOES`
- `.claude/commands/`
- `teste.mjs`

## Time
_(a triar no refino: `po` + `tl`, com o passo de estrutura do grafo)_

## Skills
_(a propor no refino)_

## ❓
- ❓ O `po` propõe o mínimo: o `/refinar` aceita N atividades e devolve N US refinadas e triadas, e a execução segue uma US por rodada do `/continuar`, sem comando novo. Isso cobre a "porta única" que o dono descreveu, ou ele quer o comando que leva do pedido à entrega? (Decisão do dono.)

## Rumo
- **15/10/2026** — anotada a partir da definição "equipe barata" do dono. Está fora da fila até o `/refinar`.
- **15/10/2026** — revisão da arquitetura (`tl` + `po`, Opus medium): a "unidade" entregue ao subagente é a linha do *Time* (papel, modelo, esforço); a US-47 não muda o formato do comando. Ordem: depois de a US-29 ter 2 amostras.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
