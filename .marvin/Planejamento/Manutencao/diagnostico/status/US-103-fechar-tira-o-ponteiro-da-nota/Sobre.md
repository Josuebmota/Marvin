---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-103-fechar-tira-o-ponteiro-da-nota
description: "Anotação: o /fechar tira da nota onde_paramos o ponteiro da US que fechou, porque o aviso do --status sozinho não foi atendido."
---
# US-103 — o `/fechar` tira o ponteiro da nota

**Por quê:** em 01/11 a nota `onde_paramos.md` apontava as US-91 e US-93 como abertas, com "_(uma frase)_", depois de concluídas. O `--status` já acusava `concluida` na nota (`marvin.mjs:1538`) e o hook também avisou; o dono confirmou (01/11/2026) que **ninguém rodou o `--status`**, então mais um aviso não resolve. A regra mora onde dispara: quem fecha a US é o `/fechar`, e é ali que o ponteiro deveria sair. Hoje eu tirei à mão (commits `5f5aee5` e `8672a35`).
**Pronto quando:** _(a refinar)_ — esboço: o texto do `/fechar` (`.claude/commands/fechar.md`) manda tirar o ponteiro da US que ficou `concluida` ou `cancelada` da seção "Em andamento" da nota e conferir com `marvin --status --curto`; o template do comando (gerado pelo `marvin.mjs`) recebe a mesma linha com marca em `UPDATES`. Medir antes quantas vezes o ponteiro velho ficou no `git log` da nota.

**Não entra:** o script reescrever a nota sozinho (a nota é do humano); o campo "Atualizado:" (US-99 deixou de fora).

## Fluxos ligados
- [US-99 — nota velha no `--status`](../US-99-nota-velha-no-status/Sobre.md)

## Rumo
- **01/11/2026** — anotada depois da resposta do dono à ❓ da US-99 ("ninguém rodou o `--status`"). Falta o refino com `tl` e `po`; mexe em template gerado, então pede `UPDATES` e o `tl` no diff.
