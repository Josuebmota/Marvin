---
tipo: us
estado: cancelada
pai: ../Sobre.md
name: US-53-marvin-como-plugin
description: "Pesquisa: o Marvin empacotado como plugin do Claude Code (.claude-plugin/) ao lado do npm, sem dependencies. Decide com o motivo registrado."
---
# US-53 — o Marvin como plugin do Claude Code

**Por quê:** Item 4 da [US-50](../../../../Novos/ferramentas-opcionais/curadoria/US-50-marvin-plugin-e-curador/Sobre.md), separado no refino de 15/10: o dono decidiu que o Marvin é "o único plugin do Claude". Empacotar é outra pergunta que instalar ferramentas. O `po` aponta que é especulação: nenhum número mostra que o npm perde para o plugin.

**Pronto quando:**
1. Nota em `.marvin/Contexto/Arquitetura/` com: o que o `.claude-plugin/` exige, o que ganha sobre `npx marvin-kb`, confiança declarada (invariante 3) e a decisão (plugin, npm ou os dois), com o motivo.
2. Se a decisão for plugin: o `package.json` continua sem `dependencies` e o `files` não leva `.marvin/` nem `.claude/`. A implementação é outra US.

**Não entra:** implementar o plugin; publicar; instalar ferramentas (US-50).

## Código tocado
- `package.json` — só leitura (`files`, `bin`)
- `.claude-plugin/` — não existe; pesquisa

## Time
- **Grafo (15/10, fresco: graph.json 4 s depois do `b0fe0a3`):** `package.json` — sem dependentes de código; fallback: leitura.
- `scout` Haiku baixo — documentação do formato de plugin
- `tl` Opus médio — decisão e confiança
- **Bloqueio:** Fase 3, depois da US-50.

## Skills
_(nenhuma)_

## ❓
1. O plugin paga? Que problema de adoção você viu com o `npx marvin-kb` que o plugin resolve? Sem caso, a US desce para depois da Fase 4. (`po`)

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 1 nó(s) de código em 1 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-17 — o `marvin` crava a versão com que montou a base](../../../diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-03 — Publicar o 1.1.1 (ou já o 1.2.0)](../../npm/US-03-publicar-1-1-1/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 1 nó(s) em comum

## Rumo
- **15/10/2026** — aberta no `/refinar` (logo tudo), a partir do item 4 da US-50.
- **15/10/2026** — **cancelada** pelo dono, pela régua "mesmo resultado gastando menos" (o `po` a classificou como especulação): nenhum problema de adoção visto com o `npx marvin-kb`; reabre com um.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
