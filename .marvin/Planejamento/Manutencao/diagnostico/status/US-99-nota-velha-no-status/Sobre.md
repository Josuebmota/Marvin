---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-99-nota-velha-no-status
description: "Anotação: o --status acusa a nota onde_paramos que lista US concluída ou com placeholder, e a data de atualização velha."
---
# US-99-nota-velha-no-status

**Por quê:** em 01/11 a nota dizia 'Atualizado: 27/10' e listava as US-91 e US-93 como abertas, com '(uma frase)' no lugar do próximo passo, quando já estavam concluídas; o hook acusava 'base desatualizada'. O estado vive no frontmatter da US e na nota, e o `/fechar` não os sincroniza.
**Pronto quando:** _(a refinar)_ — esboço: o `--status` lista ponteiro da nota cuja US está `concluida` ou `cancelada` e ponteiro com '_(uma frase)_'; medir antes quantas vezes isso aconteceu no `git log` da nota.

**Não entra:** reescrever a nota sozinho (a nota é do humano).

## Rumo
- **01/11/2026** — anotada na conversa de 01/11 sobre o desenho do fluxo do Marvin. A evidência vem de 31/10 e 01/11; falta o refino (`/refinar`) com `tl` e `po`.
