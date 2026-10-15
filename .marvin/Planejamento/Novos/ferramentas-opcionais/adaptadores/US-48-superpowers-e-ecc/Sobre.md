---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-48-superpowers-e-ecc
description: "Avalia Superpowers (reabre a US-25) e ECC como ferramentas de execução chamadas pela equipe do Marvin, nunca como segunda equipe nem segunda memória."
---
# US-48 — Superpowers e ECC como ferramentas de execução da equipe

**Por quê:** O dono pediu ferramentas que ajudem o contexto: o Superpowers (a US-25 decidiu só citá-lo no README) e o [ECC](https://github.com/affaan-m/ECC) (71 agentes, 311 skills, hooks, memória, AgentShield). Parte do ECC já está instalada à mão no perfil global desta máquina: 23 skills, 16 agentes e 26 comandos. Os agentes globais entram em toda sessão de todo projeto e disputam papel com a equipe do Marvin. Em 15/10, o `code-reviewer` do ECC ("MUST BE USED for all code changes") competiu com o `tl`. Arquitetura: [equipe-barata](../../../../../Contexto/Arquitetura/equipe-barata.md).

**Pronto quando (rascunho — o refino fecha):**
1. Instalado numa sessão autorizada pelo dono e usado numa US real; medido contra a mesma classe de US sem ele (US-29).
2. Decisão registrada: adaptar (adaptador-de-ferramenta), complemento ou descartar, com o número.
3. A spec do Superpowers e a memória do ECC (`ecc memory`, sessão salva) não substituem o `Sobre.md` nem a nota: um lugar por decisão.
4. O ECC entra como skills que a equipe chama (`tdd-workflow`, `build-fix`, `security-scan`), não como agentes concorrentes. Os agentes globais que duplicam papel do Marvin (`code-reviewer`, `planner`, `architect`…) são inventariados com o custo fixo de cada um; sair ou ficar é decisão do dono, com o número.
5. O custo fixo por sessão (as descrições de skill carregadas) é medido pelo passo 4b antes e depois de instalar. Se o custo fixo não se paga na US medida, o Superpowers é descartado.

**Não entra:** Instalar na máquina de alguém sem pedir; estado em `docs/superpowers/` competindo com `.marvin/`.

## Código tocado
- `.marvin/ferramentas.md`
- `~/.claude/agents/`, `~/.claude/skills/`, `~/.claude/commands/` — inventário do ECC (leitura; mudar o perfil é do dono)
- `marvin.mjs` — `OPTIONAL_TOOLS` (só se adaptar)

## Time
_(a triar no refino: `po` + `tl`, com o passo de estrutura do grafo)_

## Skills
_(a propor no refino)_

## ❓
_(o refino levanta)_

## Rumo
- **15/10/2026** — anotada a partir da definição "equipe barata" do dono. Está fora da fila até o `/refinar`.
- **15/10/2026** — revisão da arquitetura (`tl` + `po`, Opus medium): conta como amostra da US-29 e não depende da US-45.
- **15/10/2026** — o dono acrescentou o ECC; a US passa a avaliar os dois com a mesma régua (custo fixo pelo passo 4b, par medido pela US-29).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
