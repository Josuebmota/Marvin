---
tipo: us
estado: anotada
pai: ../Sobre.md
---
# US-112 — par medido Haiku 5.5 vs Sonnet 5.5 em implementação com spec fechada

**Por quê:** o dono acha que o Haiku 5.5 também é bom dev, e o `CLAUDE.md` o restringe a recuperação ("erra onde a tarefa exige segurar um invariante"); a página oficial o indica para trabalho delimitado e como subagente, mas o Terminal-Bench 4.0 mostra distância grande do Sonnet em tarefa agêntica longa ([US-111](../US-111-fundamentar-cache-e-haiku-na-regua/Sobre.md)). Nenhuma medição no Marvin decide isso.
**Pronto quando:** _(rascunho, o `/refinar` fecha)_ a mesma etapa de implementação com spec fechada, numa US real que **toque invariante** do `AGENTS.md`, rodou com Haiku e com Sonnet no mesmo esforço, e o *Rumo* traz lado a lado: aceite do `tl`, `npm run test`, retrabalho, tokens, chamadas e minutos; n declarado; e o dono decide se a regra "Haiku só para recuperação" muda.

**Não entra:** mexer na tabela de modelo por papel (`Equipe.md`, `CLAUDE.md`) antes do resultado; classificador automático (nem Haiku); escolher a US do par agora (é do `/refinar`).

## Perguntas
- ❓ Qual é a US real do par? Precisa ser uma de implementação com spec fechada que toque invariante; o `/refinar` propõe candidatas.

## Fluxos ligados
_(a preencher no `/refinar`)_ Hoje: [delegacao](../../../../../Contexto/Fluxos/delegacao.md) · [Equipe](../../../../../Contexto/Equipe.md). Relacionadas: [US-111](../US-111-fundamentar-cache-e-haiku-na-regua/Sobre.md), [US-92](../US-92-regua-de-esforco-por-atividade/Sobre.md), [US-29](../US-29-medir-economia-do-roteamento/Sobre.md).

## Código tocado
_(a preencher no `/refinar`: depende da US escolhida para o par)_

## Time
_(a preencher no `/refinar`)_

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|

## Skills
Nenhuma por enquanto.

## Rumo
- **07/11/2026** — anotada a pedido do dono ("sim, anotar agora"), como resposta à ❓ 1 da US-111. Origem: a dúvida do dono sobre o Haiku 5.5 e a pesquisa de 07/11 nas docs oficiais (fontes no *Rumo* da US-111). Falta para virar `refinada`: escolher a US do par, preencher *Código tocado* e *Time* (dois braços na mesma etapa, `qa` e `tl` lendo o diff como nos pares da US-68 e da US-93) e fechar o *Pronto quando*.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
