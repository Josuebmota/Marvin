---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-89-subir-degrau-por-check
description: "Anotação da issue #11: a escada barato → check → sobe um degrau se o check falhar (teto de subidas), com as tentativas no Time da US e o --status medindo custo por US resolvida, subidas por papel e taxa de primeira tentativa."
---
# US-89 — subir o degrau por check reprovado

**Por quê:** [issue #11](https://github.com/Josuebmota/Marvin/issues/11) (29/10/2026). A [US-42](../US-42-execucao-nao-herda-opus/Sobre.md) faz a execução partir do degrau mais barato, e a [US-64](../../../../Manutencao/diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) e a [US-65](../../../../Manutencao/diagnostico/custo/US-65-custo-por-us/Sobre.md) medem o custo por papel e por US. Falta a outra metade: hoje o motivo para subir o degrau é texto livre no *Time*. Não existe o passo "o check do *Pronto quando* falhou → repete um degrau acima com o erro", e por isso não dá para saber se começar barato compensa. O caso que motivou a issue veio do `heim-development`: o produto escolhe modelo e esforço por atividade, mas não sobe o degrau quando um check reprova. A comparação citada na issue (custo por tarefa resolvida) é do autor de um reel e **não foi medida aqui**.

**Pronto quando:** _(a refinar)_ — esboço da issue:
1. O `IA.md` gerado descreve a escada (barato → check → sobe) e o teto de subidas (a issue propõe duas por etapa).
2. O *Time* da US registra cada tentativa (degrau, esforço, check rodado, resultado), e o `--status` lê esses registros.
3. O `--status` mostra o custo por US resolvida (todas as tentativas somadas), as subidas por papel e a taxa de primeira tentativa.
4. `teste.mjs` cobre uma US que sobe um degrau depois de um check reprovado.

**Não entra (provisório):** roteador por chamada de LLM (a triagem do `tl` e do `po` já é o roteador por regra).

## Perguntas
- ❓ 1. O *Time* ganha linhas por tentativa ou uma coluna nova? Mudar a tabela mexe no template gerado e exige marca em `UPDATES`. (a refinar com o `tl`)
- ❓ 2. Esforço baixo como padrão quando o *Pronto quando* está claro, como a issue propõe? Conversa com a matriz do glossário.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
_(a refinar)_ — provável: `marvin.mjs` (template do `IA.md`, leitura do *Time* no `computeStatus`), `teste.mjs`.

## Time
_(a refinar — `/refinar` com `tl` e `po`)_

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|

## Skills
_(a refinar)_

## Rumo
- **29/10/2026** — anotada a partir da [issue #11](https://github.com/Josuebmota/Marvin/issues/11).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
