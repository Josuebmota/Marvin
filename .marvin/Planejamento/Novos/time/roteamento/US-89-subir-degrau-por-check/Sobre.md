---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-89-subir-degrau-por-check
description: "Issue #11: teto de subidas e subida com o erro do check no método gerado, tentativas registradas no Time e o --status medindo custo por US resolvida, subidas por papel e taxa de primeira tentativa. Parada em anotada: tl e po divergem entre refinar já e medir antes."
---
# US-89 — subir o degrau por check reprovado

**Por quê:** a [issue #11](https://github.com/Josuebmota/Marvin/issues/11) (29/10/2026) pede para, quando um check reprova, repetir a etapa um degrau acima, levando o erro e com teto de subidas, e para saber pelo `--status` se começar barato compensa.

**A escada já existe como texto.** Está na "Regra do sênior" do `Equipe.md` gerado (`marvin.mjs:3214-3216`: "sobe só se falhar — esforço antes de modelo —, com o motivo no Time"), no `IA.md` (L3155-3157) e no passo 5 do [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md). O `/continuar` já para depois de 2 tentativas (L4219). Faltam três coisas:
- o teto escrito;
- a regra "repete com o erro do check";
- uma forma legível de registrar a tentativa.

O *Time* é lido em `readNode` (L655-667), mas só saem `comModelo` e `papeis`; a coluna `estado` e a repetição de etapa ninguém lê. O custo por US já existe (`computeSpend` L809-840, `printSpend` L866-876), só não é cruzado com o estado da US.

**Contra (o `po`):** a [US-29](../US-29-medir-economia-do-roteamento/Sobre.md) mediu uma escada que começava no Haiku. Ele errou 7 de 8, e subir depois da falha custaria cerca de $0,34, contra $0,215 do Sonnet direto. Não há nenhuma subida registrada neste repositório. A comparação de custo da issue vem de um reel e não foi medida aqui.

**Proposta do `tl` (se for refinada agora):**
1. O `Equipe.md` e o `IA.md` gerados dizem que o teto é de 2 subidas por etapa (esforço conta como subida), que a subida repete a etapa com o erro do check e que, no teto, a etapa volta para o dono. Os dois arquivos ganham marca em `UPDATES`.
2. O formato do *Time* não muda. Cada subida é uma linha nova da mesma etapa, logo abaixo: a linha anterior fica com `estado` `reprovado`, e o `motivo` da nova começa com `sobe:` e diz o check que falhou. O comentário do *Time* no template mostra isso.
3. O `--status` mostra o custo das US concluídas, as subidas por papel, as etapas resolvidas de primeira sobre as registradas e "N de M com registro". As US antigas não contam como acerto de primeira. A taxa não sai das transcrições, porque lá não dá para separar "subiu por reprovação" de "outra etapa".
4. `teste.mjs` tem uma fixture com Haiku `reprovado` seguido de Sonnet `sobe: teste X` `feito`, e confere 1 subida no `dev-back` e taxa 0/1. A contagem nos READMEs acompanha.

**Não entra:** roteador por chamada de LLM (o script não chama LLM; o IA.md L3153 já diz "não há router"); mudar a matriz de esforço; ratear o custo "sem US".

## Perguntas
- ❓ 1. **Refinar agora ou medir antes** (divergência):
  - **`tl`:** refinar já. Cabe em 1 chat (ou duas fatias: método com `UPDATES`, depois leitura e `--status`), e a taxa medida é o que vai responder se começar barato compensa.
  - **`po`:** voltar para `anotada` com um passo 0. Contar, nos Rumo e *Time* do Parci e do heim-development, as etapas com check reprovado e o que se fez (subiu, corrigiu o contexto, repetiu no mesmo degrau). Reabrir só com pelo menos 3 subidas reais. Se a regra existe e ninguém sobe, o problema é a regra não disparar, não faltar métrica. Mesma régua que fez a US-88 voltar.
  - A US está parada em `anotada` até você responder.
- ❓ 2. **Onde registrar a subida:**
  - **`tl`:** numa linha nova do *Time* (`reprovado` e `sobe:`). Muda o comentário do template e exige marca em `UPDATES`.
  - **`po`:** numa linha de formato fixo no Rumo, onde o `delegacao.md` já manda registrar. Não muda o template.
- ❓ 3. O teto é de 2 subidas por etapa, com o esforço contando junto? E, ao bater no teto, a US vira `pausada` com `espera: dono`?
- ❓ 4. Esforço baixo como padrão: os dois dizem que não por ora. A matriz já diz "parte da tabela, nunca acima", e quem decide é a taxa medida.
- ❓ 5. Se for medir antes: posso ler os `.marvin/` do Parci e do heim-development (só leitura, contagem por grep)?

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
- `marvin.mjs` — `readNode` (L636)
- `marvin.mjs` — `computeSpend` (L749)
- `marvin.mjs` — `printSpend` (L843)
- `marvin.mjs` — `printStatus` (L1705)
- `marvin.mjs` — templates do `IA.md` (L3121), do `Equipe.md` (L3186) e do README do Planejamento (L3473)
- `marvin.mjs` — `UPDATES` (L5171)
- `teste.mjs`
- `README.md`
- `README.pt-BR.md`

## Time
Triagem 29/10/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo). Divergem na ❓1 e na ❓2. Valem a primeira tabela se refinar agora, a segunda se medir antes.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar o método e a leitura | dev-back | Sonnet · médio | partida | pendente |
| verificar | qa | Sonnet · baixo | partida | pendente |
| ler o diff | tl | Opus · médio | mexe em `UPDATES` e em template gerado | pendente |

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| passo 0: contar subidas nas bases do dono | scout | Haiku · baixo | só contagem por grep | pendente |
| julgar se reabre | po | Opus · médio | escopo | pendente |

Grafo (fresco, 29/10 11:58:50):
- `readNode` (L636): affected devolve `computeStatus` e `planningNodes`. US vizinhas: 73 e 64.
- `computeSpend` (L749): affected devolve `computeStatus`. US vizinhas: 41, 64 e 65.
- `printStatus` (L1705): affected devolve nada.
- `US_STATES`: o grafo não pega referência a const. Fallback por Grep.

## Skills
Nenhuma.

## Rumo
- **29/10/2026** — anotada a partir da [issue #11](https://github.com/Josuebmota/Marvin/issues/11).
- **29/10/2026** — passou pelo `/refinar` (`tl` e `po` no Opus · médio, em paralelo). Segue `anotada`: os dois divergem entre refinar já e medir antes (❓1).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
