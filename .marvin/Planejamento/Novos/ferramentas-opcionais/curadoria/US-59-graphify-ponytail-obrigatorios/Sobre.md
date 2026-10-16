---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-59-graphify-ponytail-obrigatorios
description: "graphify e ponytail deixam de ser opcionais: registro novo nasce sim e o marvin instala sozinho o que falta."
---
# US-59 — graphify e ponytail obrigatórios

**Por quê:** Decisão do dono, 16/10/2026: "não são mais opcionais, é obrigatório" — para baratear o custo (grafo na triagem, escada de simplicidade na implementação).

**Pronto quando:** graphify e ponytail deixam de ser opcionais: registro novo nasce sim e o marvin instala sozinho o que falta.

## Time
| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | partida | feita |
| verificar | qa | Sonnet · baixo | partida | feita |
| ler o diff | tl | Opus · alto | instala e escreve no disco alheio; muda invariante 4 | feita |

## Rumo
- **16/10/2026** — aberta e concluída na mesma sessão; `tl` (Opus, alto) aprovou com dois ajustes de texto, aplicados.

## Evidência
- 447 verdes; qa num projeto real: registro com graphify e ponytail `sim`; falha de instalação vira aviso e sai 0.
