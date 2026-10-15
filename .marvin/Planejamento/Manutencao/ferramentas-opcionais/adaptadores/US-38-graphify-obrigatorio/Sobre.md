---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-38-graphify-obrigatorio
description: "Graphify deixa de ser opcional nos projetos gerados. O que 'obrigatório' significa e se ele vira rota de toda busca dependem de decisão do dono e de medição Grep vs grafo."
---
# US-38 — graphify obrigatório nos projetos gerados

**Por quê:** item 1 dos requisitos de 14/10: o dono quer o grafo como rota de toda busca, porque é ali que vê a economia de tokens. Hoje o script trata graphify como opcional (pergunta; sem TTY assume `não`) e o `CLAUDE.md` gerado diz que Grep/Glob é mais barato para localizar.

**Contra-evidência registrada (não decidida aqui):** o ganho medido do graphify (9,3×) é em pergunta **estrutural**; o grafo já devolveu função apagada marcada `[EXTRACTED]` (`decisoes-fechadas.md`), e o hook `MANDATORY` foi recusado porque o grafo não avisa quando está velho. "Rota de toda busca" contradiz essas duas decisões; reabrir pede fato novo.

**Pronto quando:**
1. ~~Medição Grep × grafo~~: foi para a [US-43](../US-43-grafo-rota-de-busca/Sobre.md) (fatia do dono, 15/10).
2. Decisão (b) do dono: com graphify no PATH o registro grava `sim` por padrão; sem ele, aviso forte no fim da instalação, e o marvin **continua funcionando**.
3. ~~Texto "rota de toda busca"~~: foi para a US-43. Aqui, só o texto que descreve o novo default (`sim` com graphify no PATH, aviso sem ele) entra, com marca na `ATUALIZACOES` e `desde:`.
4. `teste.mjs` cobre o caminho **sem** graphify (o CI roda sem ele nos 3 SO).

**Não entra:** abortar a instalação sem graphify (o `tl` bloqueia: quebra quem não tem Python e o CI); graphify como dependência npm; graphify como hook.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md) — Triagem
- [decisoes-fechadas.md](../../../../../Contexto/Arquitetura/decisoes-fechadas.md)

## Código tocado
- `marvin.mjs` — flag e default (`:82-85`)
- `marvin.mjs` — registro de ferramentas, detecção e `não` sem TTY (`:1801-1900`, `:1840`, `:1875`)
- `marvin.mjs` — template "O grafo é opcional" (`:2515-2516`)
- `marvin.mjs` — seção Grafo de código do `CLAUDE.md` gerado (`:3508-3535`)
- `marvin.mjs` — `ATUALIZACOES` (`:4075`), aviso final (`:4182-4193`)
- `AGENTS.md`, `README.md`, `README.pt-BR.md` — juntos
- `teste.mjs`

## Time
Triagem 14/10/2026 (refino: `tl` + `po`). Ordem do dono: depois da US-29/US-37 — precisa do número.
- `dev-back`, `qa`, `tl` (diff + `ATUALIZACOES`; um dev por vez nela — cruza com US-37 e US-39).

## Skills
`adaptador-de-ferramenta` (já existe) cobre o registro.

## ❓
_(respondidas pelo dono em 15/10: (b), e fatiar; ver Rumo)_

## Rumo
- **14/10/2026** — refinada do item 1. Vai para `Manutencao/` (muda default de adaptador existente; a US-11a está concluída e não reabre). Divergência de ordem (`tl`: primeiro; `po`: só com medição) — o dono escolheu a ordem do `po`.

- **15/10/2026** — o dono decidiu: "obrigatório" = (b), `sim` por padrão com graphify no PATH e aviso forte sem ele; (a) descartado. Fatiou: a medição Grep × grafo e o texto "rota de toda busca" foram para a [US-43](../US-43-grafo-rota-de-busca/Sobre.md). Ficam aqui os itens 2 e 4, mais o texto do novo default. A decisão está em [decisoes-fechadas.md](../../../../../Contexto/Arquitetura/decisoes-fechadas.md).
- **15/10/2026** — implementada, sem commit. O `dev-back` (Sonnet, medium) fez a implementação. O `qa` (Sonnet, low) e o `tl` (Opus, medium) aprovaram, e a correção de texto do `tl` foi aplicada na principal: o aviso dizia "o registro diz `não`" mesmo com `sim`. `node teste.mjs` dá 366 passaram, somando as US-38 e US-39. Por execução, o `qa` viu o `sim` gravado sem TTY com o graphify real, o `não` do humano sobrevivendo, a instalação sem graphify saindo com exit 0 e aviso, e o `--dry-run` sem escrita.
  - **Consequência aceita (opção b):** base sem a linha do graphify no registro passa a ganhar `sim` e o grafo é construído sem pedir.
  - **Desligar o graphify:** não há flag; o caminho é editar o registro para `não`.
  - **Lacunas:**
    - O teste não exercita a marca da US-38 numa base antiga.
    - O graphify falso do teste só foi visto passar no Windows; Linux e macOS ficam com o CI.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
Commit `0750d64`; `node teste.mjs`: **366 passaram** (com a US-39). Os checks cobrem o `sim` gravado sem TTY com graphify no PATH, o `não` gravado que sobrevive, e a instalação sem graphify com exit 0, aviso e registro sem `sim`. O `qa` repetiu num projeto temporário com o graphify real: `sim` sem perguntar, hash igual no 2º run, `não` mantido e `--dry-run` sem escrita. O `tl` leu o diff e aprovou. Itens 1 e 3 foram para a US-43.
