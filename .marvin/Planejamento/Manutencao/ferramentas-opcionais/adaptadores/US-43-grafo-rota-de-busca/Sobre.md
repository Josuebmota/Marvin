---
tipo: us
estado: cancelada
pai: ../Sobre.md
name: US-43-grafo-rota-de-busca
description: "Fatia da US-38 que espera número: medir Grep × grafo em 'onde está X' e, só com o resultado, reescrever o texto gerado ('O grafo é opcional', 'Grep/Glob é mais barato')."
---
# US-43 — o grafo como rota de busca, só depois da medição

**Por quê:** é o que sobrou da [US-38](../US-38-graphify-obrigatorio/Sobre.md), que o dono fatiou em 15/10/2026. Contradiz duas decisões fechadas ("consulta, nunca hook" e "Grep é mais barato para localizar"); reabrir pede fato novo. O único número que existe (~18 tk Grep × ~1.650 tk grafo) **contradiz** a US — falta medir o acerto. Fase 5 do [plano](../../../../../Contexto/Arquitetura/equipe-barata.md).

**Pronto quando:**
1. Tabela no Rumo com N ≥ 5 perguntas "onde está X" tiradas de US reais, cada uma com tokens e acerto pelos dois caminhos (Grep e grafo).
2. Se o ganho de acerto do grafo não pagar o custo (régua no ❓1), a US **fecha sem código**, registrando o número.
3. Só se pagar: o texto de `marvin.mjs:2607` e `:3697` muda, com marca em `UPDATES` (`desde:`, marca com `\s+`), os dois READMEs juntos, e `node teste.mjs` passa.

**Não entra:** graphify como hook; abortar sem graphify.

## Código tocado
- `marvin.mjs` — :2607 ("O grafo é opcional", template `Planejamento/README`), :3697 ("Grep/Glob é mais barato", `CLAUDE.md` gerado), :4217 `UPDATES`
- `AGENTS.md`, `README.md`, `README.pt-BR.md` — só se o item 3 valer

## Time
- **Grafo (15/10, fresco: graph.json 4 s depois do `b0fe0a3`):** templates literais, sem nó; `UPDATES` sem affected, grau 2. Fallback: Grep (só para localizar).
- `scout` Haiku baixo — roda as perguntas pelos dois caminhos
- `tl` Opus médio — monta a régua e decide
- `dev-back` Sonnet baixo — só se o texto mudar
- **Bloqueio:** US-29 e Fases 1–4.

## Skills
_(nenhuma)_

## ❓
1. Quantos acertos a mais pagam ~90× mais tokens? (`tl`)
2. **Divergência:** o `po` recomenda **fechar já** com o número existente, a menos que você tenha um caso em que o Grep errou o "onde está X"; o `tl` recomenda medir N ≥ 5 antes. Você tem esse caso?

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-27 — atualizar a base do Marvin com o que o próprio Marvin gera](../../../diagnostico/atualizacoes/US-27-atualizar-a-base-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../US-40-linha-fora-da-tabela/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-51 — AGENTS.md deste repo enxuto](../../../publicacao/contexto-fixo/US-51-agents-md-enxuto/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../../Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../../Novos/ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 1 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../../Novos/ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 1 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../../Novos/ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 1 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../../Novos/ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 1 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../../Novos/ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../../Novos/organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../../Novos/organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../../Novos/organizacao-por-grafo/script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../../Novos/organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../../Novos/organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../../../../Novos/organizacao-por-grafo/script/US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../../Novos/organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../../Novos/organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../../Novos/organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 1 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../../Novos/time/glossario/US-44-glossario-da-equipe/Sobre.md) — 2 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../../Novos/time/orquestracao/US-45-porta-unica/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../../Novos/time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 1 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../../Novos/time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 1 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../../../../Novos/time/roteamento/US-39-time-na-primeira-rodada/Sobre.md) — 2 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../../Novos/time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 1 nó(s) em comum

## Rumo
- **15/10/2026** — aberta ao fatiar a US-38 (decisão do dono). Espera a medição da US-29.
- **15/10/2026** — `/refinar` (logo tudo): refinada. Divergência `tl` (medir N≥5) × `po` (fechar já com o número existente) no ❓2.
- **15/10/2026** — **cancelada** pelo dono, pela régua "mesmo resultado gastando menos" (o `po` a classificou como especulação): o único número (Grep ~18 tk × grafo ~1.650 tk) é contra; reabre com um caso em que o Grep errou o "onde está X".

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
