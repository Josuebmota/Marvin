---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-51-agents-md-enxuto
description: "O AGENTS.md deste repo desce para o alvo da Fase 1: o que é regra de comando volta ao comando; nada sai sem destino."
---
# US-51 — AGENTS.md deste repo enxuto

**Por quê:** É o grosso da economia da Fase 1 do [plano equipe barata](../../../../../Contexto/Arquitetura/equipe-barata.md): o `AGENTS.md` deste repo carrega em toda sessão (4b: 3.400 tk ≈ 13.598 chars/4; `/context`: 5,7k). Saiu da US-44 (era o critério 6) no refino de 15/10 — `tl` e `po` concordaram: outro problema, não toca `marvin.mjs`, risco é perder regra e não dado.

**Pronto quando:**
1. `AGENTS.md` dentro da meta da régua escolhida (❓1): `wc -c AGENTS.md` ≤ 7.200 bytes **ou** `/context` (Memory files) mostra ≤ 3k. A outra régua fica registrada na Evidência, antes e depois.
2. Cada trecho removido tem destino nomeado com link (comando em `.claude/commands/`, nota em `Contexto/`, agente) — tabela "trecho → destino" na Evidência. Nenhum trecho apagado sem destino.
3. O invariante 4 fica com o texto fechado na US-44 (se a US-44 ainda não fechou, o trecho não é tocado).
4. `node teste.mjs` passa (o teste não lê o `AGENTS.md`, mas a regra do repo é rodar antes de commit).

**Não entra:** `marvin.mjs`, o template do `AGENTS.md` gerado, os READMEs, o `CLAUDE.md` (ponteiro, já pequeno).

## Fluxos ligados
_(nenhum fluxo novo — a regra "regra mora onde dispara" está no plano)_

## Código tocado
- `AGENTS.md` — seções Higiene de sessão, A memória deste repo, Ferramentas, Armadilhas (candidatas)
- `.claude/commands/` — destino do que é regra de comando

## Time
- **Grafo (15/10, fresco: graph.json 6 s depois do último commit):** `AGENTS.md` — nó de documento, sem `affected` (texto não vira dependência); fallback: leitura direta.
- **Configuração da amostra (US-29):** ❓3 — se esta US e a US-49 forem o par da Fase 2, uma roda na configuração anterior e a outra na política.
- `po` Opus médio — curadoria do que sai (gargalo é decisão do dono)
- `dev-back` Sonnet baixo — mover os trechos e pôr os links
- `tl` Opus baixo — ler o diff: regra nenhuma perdida, invariantes intactos
- `scout` Haiku — localizar destinos possíveis em `.claude/commands/`
- **Ordem:** divergência ❓2 — antes ou depois da US-44.

## Skills
_(nenhuma — atividade única)_

## ❓
1. **Régua:** `tl` quer o 4b / `wc -c` (verificável por comando; o 4b conta chars/4 e o português rende ~1,7× no tokenizador real); `po` quer o `/context`. Qual vale como critério?
2. **Ordem:** `po` põe esta US em 2º (US-49 → US-51 → US-44) para formar par de doc com a US-49 na US-29; `tl` põe por último (US-49 → US-44 → US-51), porque o invariante 4 só fecha na US-44. Qual?
3. Aceita trocar o par da Fase 2 para US-49 + US-51 (as duas doc, mesma classe), deixando a US-44 fora do par? Qual roda na configuração anterior?

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 1 nó(s) de código em 1 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-27 — atualizar a base do Marvin com o que o próprio Marvin gera](../../../diagnostico/atualizacoes/US-27-atualizar-a-base-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../../../ferramentas-opcionais/adaptadores/US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../../Novos/time/glossario/US-44-glossario-da-equipe/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 1 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../../../../Novos/time/roteamento/US-39-time-na-primeira-rodada/Sobre.md) — 1 nó(s) em comum

## Rumo
- **15/10/2026** — aberta no `/refinar` da Fase 1, a partir do critério 6 da US-44. `tl` e `po` concordaram em separar.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
