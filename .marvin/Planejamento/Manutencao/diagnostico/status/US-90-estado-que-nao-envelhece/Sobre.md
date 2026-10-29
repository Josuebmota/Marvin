---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-90-estado-que-nao-envelhece
description: "Anotação da issue #10: o --status separa ativa em trabalho de ativa que só falta verificar e acusa ativa parada; a issue também pede arquivar concluída em historico/ e fechar sem aceite do dono, que esbarram em decisões já tomadas."
---
# US-90 — o estado da US não envelhece

**Por quê:** [issue #10](https://github.com/Josuebmota/Marvin/issues/10) (29/10/2026), com números medidos no Parci: 230 `Sobre.md`, dos quais 86 `concluida` e 86 `ativa`. A maior parte das ativas está codada e no ar, esperando só a passada de `qa` ou o aceite do dono. Com o `estado` de hoje, não dá para separar "em trabalho" de "pronta, falta conferir", e a contagem de ativas perde o sentido.

**Pronto quando:** _(a refinar)_ — esboço da parte que não esbarra em decisão anterior:
1. O `--status` separa as ativas em "em trabalho" e "falta só verificar", seja por um estado novo perto do `pausada` da [US-73](../../../../Novos/organizacao-por-grafo/script/US-73-estado-pausada/Sobre.md), seja lendo a *Evidência* e o *Time*.
2. O `--status` acusa com `!` a `ativa` sem commit nem edição no `Sobre.md` há mais de N dias, e a `ativa` com *Evidência* preenchida ("parece concluída").
3. `teste.mjs` tem a trava de cada aviso.

**Não entra (provisório):** o `--status --curto` do hook.

## Perguntas
- ❓ 1. **Arquivar concluída em `historico/`** (`marvin --arquivar`, com reescrita de links): esbarra no invariante 1, e a [US-81](../../../../Novos/organizacao-por-grafo/script/US-81-anotacao-vira-us-anotada/Sobre.md) já recusou mover no disco do usuário ("o histórico fica no Rumo e no git"). Um caminho mais barato é a busca e o grafo ignorarem a `concluida` que já está em release (o critério da US-87) sem mover arquivo. Reabre ou fica fora?
- ❓ 2. **`concluida` sem aceite manual do dono:** quem tirou a regra foi o dono do Parci. Vale para o Marvin (o template deixa de exigir o "é isso" e passa a pedir a *Evidência* do `qa` mais o diff lido pelo revisor) ou fica como escolha de cada projeto?
- ❓ 3. Estado novo (`verificar`) ou leitura da *Evidência*/*Time* no `--status`? O estado novo mexe no schema, no `--us` e em `UPDATES`.

## Fluxos ligados
- [status-html.md](../../../../../Contexto/Fluxos/status-html.md)

## Código tocado
_(a refinar)_ — provável: `marvin.mjs` — `computeStatus`, `printStatus`; `teste.mjs`.

## Time
_(a refinar — `/refinar` com `tl` e `po`)_

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|

## Skills
_(a refinar)_

## Rumo
- **29/10/2026** — anotada a partir da [issue #10](https://github.com/Josuebmota/Marvin/issues/10). O teto dos documentos que carregam sozinhos, citado na issue, é da #9, já entregue (US-78 e US-87).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
