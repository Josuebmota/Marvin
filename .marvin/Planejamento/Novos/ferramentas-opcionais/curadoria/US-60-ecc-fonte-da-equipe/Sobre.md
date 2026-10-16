---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-60-ecc-fonte-da-equipe
description: "O marvin copia do catálogo ECC só os agentes e skills que o projeto usa, com model/effort da matriz de custo e sem auto-chamada; agente/skill nova é procurada no ECC antes de ser escrita."
---
# US-60 — o ECC é a fonte da equipe

**Por quê:** Decisão do dono, 16/10/2026: "só o que o projeto usa, e caso precise de uma nova skill e agente ela pesquisa no ECC". O instalador oficial do ECC não é seletivo (lang:typescript copiaria 122 regras, 94 comandos, 67 agentes, 116 skills), então o Marvin copia direto do catálogo `agents/<id>.md` e `skills/<id>/`. Invariante 4 alterado.

**Pronto quando:** O marvin copia do catálogo ECC só os agentes e skills que o projeto usa, com model/effort da matriz de custo e sem auto-chamada; agente/skill nova é procurada no ECC antes de ser escrita.

## Time
| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | partida | feita |
| verificar | qa | Sonnet · baixo | partida | feita |
| ler o diff | tl | Opus · alto | instala e escreve no disco alheio; muda invariante 4 | feita |

## Rumo
- **16/10/2026** — aberta e concluída na mesma sessão; `tl` (Opus, alto) aprovou com dois ajustes de texto, aplicados.

## Evidência
- qa num projeto TS+React real: 6 agentes + 2 skills copiados, todos `sonnet · medium`, sem "MUST BE USED", YAML válido; nenhum hook/regra/comando do ECC; 2ª rodada idêntica; contexto fixo sem aumento (45,8k × 46,9k pasta vazia).
