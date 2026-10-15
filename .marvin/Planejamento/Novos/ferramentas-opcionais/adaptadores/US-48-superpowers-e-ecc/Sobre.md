---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-48-superpowers-e-ecc
description: "Avalia Superpowers (reabre a US-25) e ECC, uma ferramenta por vez e no escopo do projeto, como ferramentas de execução chamadas pela equipe — portão de entrada de ferramenta da US-50."
---
# US-48 — Superpowers e ECC como ferramentas de execução da equipe

**Por quê:** O dono pediu ferramentas que ajudem o contexto: o Superpowers (a US-25 decidiu só citá-lo no README) e o [ECC](https://github.com/affaan-m/ECC). O custo de tê-las no **global** está medido e foi eliminado na Fase 0 (backup em `~/.claude/_backup-2026-10-15/`); o **ganho** de qualquer uma não está. Esta US é o portão: a [US-50](../../curadoria/US-50-marvin-plugin-e-curador/Sobre.md) só instala o que aqui virar `sim` no `ferramentas.md` (`po` + `tl`). Arquitetura: [equipe-barata](../../../../../Contexto/Arquitetura/equipe-barata.md). Fase 3, a primeira da fase.

**Pronto quando** — **uma ferramenta por vez**, cada uma com seu próprio par:
1. Inventário do que a ferramenta traria, a partir do backup (não mais do global), com o custo fixo de cada item (skills, agentes, comandos). Os agentes que duplicam papel do Marvin (`code-reviewer`, `planner`, `architect`…) ficam de fora por padrão.
2. Instalada no escopo do projeto escolhido no ❓2, com autorização do dono; passo 4b e `/context` antes e depois.
3. Usada numa US real e medida contra o par da mesma classe sem ela (US-29).
4. Decisão `sim`/`não` em `.marvin/ferramentas.md`, com o número. Sem par medido que pague, sai (`não`).
5. Nenhum estado paralelo: spec do Superpowers e memória do ECC não substituem o `Sobre.md` nem a nota.

**Não entra:** instalar no global ou na máquina de alguém sem pedir; `docs/superpowers/` competindo com `.marvin/`; o `marvin.mjs` (só a US-50 instala); inventário do perfil global atual (já limpo).

## Código tocado
- `.marvin/ferramentas.md` — a decisão
- `~/.claude/_backup-2026-10-15/` — inventário (leitura)
- `marvin.mjs` — `OPTIONAL_TOOLS` :1911, só se adaptar (e aí na US-50)

## Time
- **Grafo (15/10, fresco: graph.json 4 s depois do `b0fe0a3`):** `OPTIONAL_TOOLS` :1911 — sem affected, grau 1. É avaliação, não código.
- **Ação do dono:** autorizar e rodar a instalação; escolher a US cobaia; decidir com o número.
- `scout` Haiku baixo — inventário a partir do backup
- `tl` Opus médio — régua e decisão
- **Bloqueio:** portão da Fase 2 (US-29).
- **Divisão:** o `tl` propõe 48a Superpowers / 48b ECC (1 chat cada); o `po` pede uma por vez. Ficou uma US com uma ferramenta por rodada — divide se o dono preferir.

## Skills
`adaptador-de-ferramenta` (se alguma virar `sim`).

## ❓
1. ~~Qual primeiro~~ Respondido em 15/10: **os dois** — "se estamos refinando e refatorando, pode reabrir" a US-25. Qual vai primeiro: ECC (só `tdd-workflow`/`build-fix`/`security-scan`) ou Superpowers? O Superpowers já foi recusado na US-25: que fato novo você tem? (`po`)
2. ~~Onde~~ Respondido em 15/10: **projeto descartável**. Qual US real serve de cobaia, e instala no repo do Marvin ou num projeto descartável? (`tl`)

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-25 — avaliar Superpowers e Claude Octopus contra o fluxo do Marvin](../US-25-avaliar-superpowers-e-octopus/Sobre.md) — 1 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum

## Rumo
- **15/10/2026** — anotada a partir da definição "equipe barata" do dono. Está fora da fila até o `/refinar`.
- **15/10/2026** — revisão da arquitetura (`tl` + `po`, Opus medium): conta como amostra da US-29 e não depende da US-45.
- **15/10/2026** — o dono acrescentou o ECC; a US passa a avaliar os dois com a mesma régua (custo fixo pelo passo 4b, par medido pela US-29).
- **15/10/2026** — `/refinar` (logo tudo): refinada como portão da US-50, uma ferramenta por vez; item 4 (inventário global) reescrito a partir do backup — o global já foi limpo na Fase 0.
- **15/10/2026** — critério 1 (inventário) feito na sessão principal, a partir do backup, sem baixar nada. **ECC:** 63 itens (22 skills, 16 agentes, 26 comandos), **~2,6k tk por sessão** estimados pelas descrições/4 (skills 1.130, agentes 850, comandos 633); 9 agentes disputam papel com a equipe (`architect`, `planner`, `code-reviewer`, `tdd-guide`, `security-reviewer`, `refactor-cleaner`, `code-simplifier`, `doc-updater`, `build-error-resolver`, ~490 tk), todos com modelo fixo (`opus`/`sonnet`) e descrição "MUST BE USED"/"PROACTIVELY". **Achado:** o ECC tem um roteador de modelo — `/model-route` (haiku mecânico, sonnet implementação, opus arquitetura, com fallback) —, mas avulso, sem esforço, sem registro por etapa e sem medição. O que o Marvin acrescenta é isso: aplicado na triagem, com esforço, gravado no *Time* e medido (US-29). **Superpowers:** está no marketplace oficial (`claude-plugins-official`), não instalado; instalar é baixar de fonte externa — ação do dono. **Falta (dono):** instalar ECC (só `tdd-workflow`/`build-fix`/`security-scan`) e Superpowers no projeto descartável, `/context` antes e depois, e uma tarefa real com e sem cada um (par da US-29). Sem isso, a decisão `sim`/`não` não tem número — a US segue na fila.
- **15/10/2026** — concluída na sessão principal, com autorização do dono para baixar o Superpowers. Régua: contexto fixo sem UI (`claude -p … --output-format json`, soma de `input`+`cache_*`) e a mesma tarefa real (slugify + testes `node:test`) no Sonnet, num projeto descartável. **Decisão: ECC `não`, Superpowers `não`** — nenhum dos dois entregou o mesmo resultado gastando menos. Limite: uma amostra por braço, tarefa pequena; reabre com par que mostre ganho. Perfil do dono restaurado (installed_plugins.json e cache iguais aos de antes). A US-50 não instala nenhum dos dois.

## Evidência
| Braço | Contexto fixo | Tarefa: custo · turnos · testes |
|---|---|---|
| Sem ferramenta | 48.211 | $0,214 · 4 · 7 verdes |
| ECC mínimo (`tdd-workflow`, `build-fix`, `security-scan`) | 48.234 (+23) | $0,213 · 4 · 6 verdes |
| ECC inteiro (22 skills, 26 comandos, 16 agentes) | 50.201 (+1.990) | — |
| Superpowers 6.4.1 | 50.262 (+2.051) | $0,280 · 8 · 8 verdes |
- Registro: `.marvin/ferramentas.md`, linhas `ecc` e `superpowers`.
