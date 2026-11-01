---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-98-teste-do-aborto-da-migracao
description: "Anotação: cobrir com teste o ramo de aborto da migração de memória (invariante 1), lacuna declarada no cabeçalho do teste.mjs."
---
# US-98-teste-do-aborto-da-migracao

**Por quê:** o invariante 1 (nunca destruir dado sem conferir a contagem) é o mais importante do projeto, e o ramo que aborta quando a cópia sai menor que a origem não tem teste; o `qa` apontou isso em 3 relatórios em 31/10, e é lacuna declarada no cabeçalho do `teste.mjs`.
**Pronto quando:** _(a refinar)_ — esboço: teste hermético em que a cópia sai menor que a origem: a migração aborta, não apaga nada e sai com código diferente de zero; `tl` lê o diff.

**Não entra:** mudar a migração em si; migrar memória de outra ferramenta.

## Rumo
- **01/11/2026** — anotada na conversa de 01/11 sobre o desenho do fluxo do Marvin. A evidência vem de 31/10 e 01/11; falta o refino (`/refinar`) com `tl` e `po`.
