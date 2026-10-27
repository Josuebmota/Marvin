---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-84-quebrar-delegacao-e-ligar-orfaos
description: "Só base, sem script: quebrar o delegacao.md (lido em toda triagem) em índice + um arquivo por assunto, encurtar a linha de tabela de 773 caracteres do ferramentas.md e ligar os 3 órfãos que o --status (US-78) aponta."
---
# US-84 — quebrar o `delegacao.md` e ligar os órfãos

**Por quê:** o `--status` da US-78 aponta nesta base 8 documentos acima do teto e 3 órfãos. Lido sob demanda só custa quando é lido, então paga quebrar só o que é lido sempre: o `Contexto/Fluxos/delegacao.md` (18 KB, ~4,5k tk) é linkado do AGENTS.md, CLAUDE.md, `/refinar`, `/continuar` e `/us` — entra em toda triagem. A linha de 773 caracteres do `ferramentas.md` é trivial de quebrar. Os órfãos o grafo não acha.

**Pronto quando:**
1. `delegacao.md` vira índice curto + um arquivo por assunto, cada pedaço com `pai:` e link de volta; quem aponta para ele (AGENTS.md, CLAUDE.md, comandos) continua apontando para arquivo que existe; o índice diz em uma linha onde está cada regra.
2. A linha de tabela longa do `ferramentas.md` fica abaixo de 600 caracteres sem perder informação (detalhe vai para baixo da tabela) — e o script continua lendo a tabela (`node teste.mjs` passa; `--status` mostra as ferramentas como antes).
3. `Contexto/Fluxos/status-html.md`, `Fontes/Externas.md` e `Fontes/sessoes-de-03-08.md` ganham link de quem os cita ou `pai:` (ligar, nunca apagar).
4. `node marvin.mjs --graphify` e depois `--status`: `delegacao.md` e `ferramentas.md` fora de "Documentos grandes", "Fragmentos órfãos" vazio, consistência ok.

**Não entra:** as US concluídas grandes (US-19, 29, 36, 44, 69) e o `equipe-barata.md` (1 KB acima, lido só por quem segue a ⚪) — ❓1; mudança no script.

## Perguntas
- ❓ 1. O teto da US-78 vale para US concluída (histórico, quase nunca lido)? Se não, uma US de script isenta concluída no `--status`; se sim, os 5 avisos ficam ou elas são quebradas (o `tl` deixou a regra para quebrar o `Sobre.md` sem perder estado, Rumo, Time, Evidência nem ❓).
- ❓ 2. Os dois de `Fontes/` são histórico: ligar a quem os cita, ou viram raiz por regra como `Releases/` (mudança no script)? Esta US liga; a regra fica com o dono.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
- `.marvin/Contexto/Fluxos/delegacao.md`
- `.marvin/ferramentas.md`
- `.marvin/Contexto/Fluxos/status-html.md`
- `.marvin/Fontes/Externas.md`
- `.marvin/Fontes/sessoes-de-03-08.md`

## Time
Triagem 27/10/2026 (`/refinar` na sessão, `tl` e `po` no Opus · médio). O `tl` propunha também as 5 concluídas, em dois chats; o `po` só o que é lido sempre — ficou o do `po`, as concluídas viram ❓1.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| quebrar e ligar | dev-back | Sonnet · médio | o corte exige separar regra viva de histórico; não é haiku | pendente |
| verificar | qa | Sonnet · baixo | `--status` antes e depois + `node teste.mjs` | pendente |

Sem `tl` no diff: só texto da base, sem invariante nem `UPDATES`.

Grafo: `docsGraph` L868 grau 8; `readNode` affected `computeStatus`, `planningNodes`. Nenhum símbolo de código tocado.

## Skills
Nenhuma.

## Rumo
- **27/10/2026** — refinada da anotação da nota (o que o `--status` da US-78 achou aqui).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
