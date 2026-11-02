---
tipo: us
estado: cancelada
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
- **02/11/2026** — crivo `tl` + `po`, **não refinada** (fica `anotada` até o dono responder as ❓). Os dois concordam que a premissa não se sustenta: o texto já existe (`fechar.md:12-13`, `marvin.mjs:4126-4127`), o passo 5 já manda rodar o `--status`, e `computeStatus` já acusa `concluida` com saída != 0 (`marvin.mjs:1539`) e `cancelada` como aviso (`:1542`). Causa medida pelo `tl` (230 commits da nota): a US-91 (`f13f475`) e a US-93 (`242d636`) foram concluídas **no meio do trabalho**, num commit que não mexeu na nota; o ponteiro só saiu em `5f5aee5`. Não é falha de texto: ninguém rodou o `/fechar` nem o `--status`. Medição: 25 US apareceram fechadas na nota; 11 ficaram além de um commit, em poucos episódios (lote de 15/10 e o de 31/10).
- **Divergência.** `po`: **cancelar** — uma ocorrência recente, mudança de texto é contexto morto, o conserto de verdade (se repetir) é trava e mora na US-88; estacionar não serve, não há o que esperar. `tl`: premissa falha, mas aceita o **mínimo** se o dono quiser: `concluida` ou `cancelada` no passo 2 (única lacuna real do texto), marca em `UPDATES` (`desde: '3.4.4'`, `soCom: !OLD_LAYOUT`, regex com `\s+`) e teste no padrão de `teste.mjs:3449`; ~3 linhas no script, 1 no comando, ~8 no teste, contagem dos READMEs muda; *Time*: `dev-back` Sonnet · médio, `tl` Opus no diff (mexe em `UPDATES`), nenhum sinal alto.
- Grafo: `graph.json` mais novo que o último commit; `computeStatus` L1519 (grau 27, US-74/99/73/87/90); `fechar.md` sem US ligada.
- **02/11/2026** — **cancelada pelo dono** (recomendação do `po`). O texto "sai da nota" já existe em `fechar.md:12-13` e no template; a falha de 31/10 foi de execução (US concluída no meio do trabalho, sem `/fechar` nem `--status`), n=1 episódio recente. Se repetir com o `/fechar` rodado, o conserto é trava e entra na US-88. Lacuna menor aceita como está: o passo 2 não cita `cancelada` (o `--status` já avisa).
