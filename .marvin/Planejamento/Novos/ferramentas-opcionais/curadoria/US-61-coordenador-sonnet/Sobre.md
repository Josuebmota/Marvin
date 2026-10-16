---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-61-coordenador-sonnet
description: "O marvin grava `'model': 'sonnet'` no `.claude/settings.json` do projeto (novo, ou existente sem model); model já definido não muda."
---
# US-61 — coordenador no Sonnet por padrão

**Por quê:** Decisão do dono, 16/10/2026. Medido na US-29: coordenar no Sonnet custou 31% menos com o mesmo resultado. A doc confirma: o model do settings de projeto vale para toda sessão, inclusive na app desktop.

**Pronto quando:** O marvin grava `"model": "sonnet"` no `.claude/settings.json` do projeto (novo, ou existente sem model); model já definido não muda.

## Time
| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | partida | feita |
| verificar | qa | Sonnet · baixo | partida | feita |
| ler o diff | tl | Opus · alto | instala e escreve no disco alheio; muda invariante 4 | feita |

## Rumo
- **16/10/2026** — aberta e concluída na mesma sessão; `tl` (Opus, alto) aprovou com dois ajustes de texto, aplicados.

## Evidência
- 447 verdes; qa: settings gerado com `"model": "sonnet"` e o hook SessionStart.
