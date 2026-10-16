---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-57-execucao-obedece-o-time
description: "O modelo é escolhido por etapa no refino (Time em tabela) e a execução delega passando esse modelo; etapa sem modelo é trava."
---
# US-57 — a execução obedece ao modelo do *Time*

**Por quê:** dono, 16/10: "por atividade, ele gera o modelo com base no glossário, visando sempre a economia". Medido nos projetos reais: a `heimnor` não tinha arquivo de papel e todo `dev` rodava no Opus herdado da sessão; a `andare` tinha 5 agentes sem `model:`; na `parci`, `general-purpose` no Opus custou ~$47. O glossário e o *Time* diziam o modelo, mas nenhum comando passava o modelo ao delegar.

**Pronto quando:**
1. *Time* da US em tabela `| etapa | papel | modelo · esforço | motivo | estado |`, preenchido no `/refinar` e no `/us` a partir do glossário.
2. `/continuar` e `/retomar` delegam cada etapa passando `model` e `effort` da linha; etapa sem modelo é trava (decisão do dono: para e refina).
3. `--status` conta US ativa/refinada sem modelo por etapa (critério estrito); `--curto` só o número.
4. `--status` avisa turnos de subagente sem papel no Opus; glossário com a regra "papel sem arquivo: passe o modelo ao delegar".
5. Marcas `UPDATES` 3.2.0 para os templates mudados; `node teste.mjs` passa.

## Time
| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | partida | feita |
| verificar | qa | Sonnet · baixo | partida | feita |
| ler o diff | tl | Opus · alto | escreve e remove no disco alheio (com a US-58) | feita |

## Rumo
- **16/10/2026** — aberta e concluída na mesma sessão; `tl` pediu 5 ajustes (poda, dry-run, caminho achatado, coluna estado, `comModelo` estrito), aplicados e reaprovados.

## Evidência
- `node teste.mjs` → 430 passaram. `qa` num temp: `--status` conta a US sem modelo e deixa de contar com a tabela preenchida.
