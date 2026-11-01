---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-101-especificacao-do-agente
description: "Anotação: especificação do que um agente precisa ter (frontmatter com effort, blocos obrigatórios, o que não faz) e um --check que confere."
---
# US-101-especificacao-do-agente

**Por quê:** o esforço dos agentes locais não está codificado: 5 dos 6 arquivos em `.claude/agents/` só declaram o modelo (só o `tdd-guide`, do ECC, tem `effort:`). Os blocos obrigatórios (Higiene, Devolução, Escopo mínimo) são copiados à mão em cada arquivo, porque o subagente só lê o próprio `.md`, e já falharam duas vezes (o `tdd-guide` ficou sem; texto do ponytail desencontrado). O 'o que não faz' mora só no glossário. Generaliza o item 2 da US-97, que avisa só o ECC.
**Pronto quando:** _(a refinar)_ — esboço: uma especificação curta (campos obrigatórios do frontmatter incluindo `effort`, blocos obrigatórios no corpo, 'o que não faz') e o `--check` acusando o agente que não a cumpre, sem reescrever o arquivo.

**Não entra:** criar agente sem armadilha concreta; reescrever agente do humano.

## Rumo
- **01/11/2026** — anotada na conversa de 01/11 sobre o desenho do fluxo do Marvin. A evidência vem de 31/10 e 01/11; falta o refino (`/refinar`) com `tl` e `po`.
