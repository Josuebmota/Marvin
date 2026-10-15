---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-44-glossario-da-equipe
description: "A instalação escreve Contexto/Equipe.md com cada papel: especialidade, atribuições e quando entra. É lido na triagem, não em toda sessão."
---
# US-44 — o glossário da equipe vem na instalação

**Por quê:** O dono quer contratar uma equipe que já sabe quem faz o quê. Hoje só os nomes dos papéis vêm na instalação, e a pasta de agentes nasce vazia. Arquitetura: [equipe-barata](../../../../../Contexto/Arquitetura/equipe-barata.md).

**Pronto quando (rascunho — o refino fecha):**
1. A tabela de papéis e a camada da atividade saem do template do `AGENTS.md` (`marvin.mjs` ~2586-2600, `TEAM_ROLES` :553) para `.marvin/Contexto/Equipe.md` (`writeIfMissing`/`fsw`), acrescidas de "quando entra" e "o que não faz". No `AGENTS.md` gerado fica uma linha-ponteiro. O passo 4b mostra o `AGENTS.md` gerado **menor** que o da 2.9.0.
2. O `Equipe.md` traz a coluna "ponto de partida no Claude" da [arquitetura](../../../../../Contexto/Arquitetura/equipe-barata.md) (Opus: `tl`/`po`; Sonnet e Haiku nos demais; Haiku no `scout`), sem nome de modelo em agente gerado.
3. Fica fora de `.claude/agents/`, referenciado por link e nunca por `@` (senão carrega em toda sessão); caminho via `DOCS`, vale para o layout antigo. Cabe numa tabela, uma linha por papel.
4. A 1ª rodada (US-39) lê o glossário e vira agente só quem o projeto usa, com as armadilhas daquele código.
5. Invariante 4 reescrito no `AGENTS.md` deste repo e no template com o texto do `tl` (Rumo de 15/10). Marca na `ATUALIZACOES` com `desde:`; base já montada mantém a tabela antiga e só é avisada (invariante 2). `teste.mjs`: o `Equipe.md` existe e o `AGENTS.md` gerado não contém `| \`scout\` |`.

**Não entra:** Armadilha de projeto específico escrita pelo script; criar arquivo de agente na instalação.

## Código tocado
- `marvin.mjs` — templates de instalação, `ATUALIZACOES`
- `AGENTS.md` — invariante 4
- `teste.mjs`

## Time
_(a triar no refino: `po` + `tl`, com o passo de estrutura do grafo)_

## Skills
_(a propor no refino)_

## ❓
_(o refino levanta)_

## Rumo
- **15/10/2026** — anotada a partir da definição "equipe barata" do dono. Está fora da fila até o `/refinar`.
- **15/10/2026** — revisão da arquitetura (`tl` + `po`, Opus medium): o `po` achou que a tabela de papéis já existe no `AGENTS.md` gerado, que carrega em toda sessão. Por isso a US passa a **mover** a tabela, não criar, e economiza contexto fixo. Texto do invariante 4 proposto pelo `tl`:
  > **4. O script não escreve conteúdo que exige conhecer o projeto.** Sobre a equipe, ele escreve só o glossário genérico (`.marvin/Contexto/Equipe.md`): papel, especialidade, atribuições, quando entra e o que não faz, igual em todo projeto, sem stack, caminho nem armadilha. O glossário é referência lida na triagem; nunca vai para `.claude/agents/`, nunca é importado com `@`, e não é lista do que criar: um papel só vira arquivo de agente com uma armadilha concreta do código, escrito pelo `tl` e pelo `po` na 1ª rodada ou na US que o pede; skill, na segunda execução. O corpo de agentes, de skills e do `AGENTS.md` nunca sai do `marvin.mjs`. (Mudado em 15/10/2026 por decisão do dono: a instalação passa a trazer o glossário.)
  O invariante 4 fica nesta US, não na US-49, para que o texto público não prometa o glossário antes de ele existir (`tl`). O `po` preferia na US-49.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
