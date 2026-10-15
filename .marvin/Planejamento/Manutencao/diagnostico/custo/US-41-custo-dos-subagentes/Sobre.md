---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-41-custo-dos-subagentes
description: "O --status não conta o custo dos subagentes: o computeSpend lê só os .jsonl do topo do projeto, e o Claude Code grava cada delegação em <sessão>/subagents/. Contar e mostrar o custo por papel."
---
# US-41 — o `--status` conta o custo dos subagentes, por papel

**Por quê:** a [issue #4](https://github.com/Josuebmota/Marvin/issues/4) mediu ≈ US$ 27 num projeto real e atribuiu o gasto a `dev` e `qa` rodando em Opus. No refino de 15/10, o `tl` achou que o número não enxerga delegação nenhuma. O `computeSpend` (`marvin.mjs:620-660`) lê só os `*.jsonl` do topo de `~/.claude/projects/<slug>/`, mas o Claude Code grava cada subagente em `<sessão>/subagents/agent-*.jsonl`. Neste repo havia 51 transcrições assim, fora da conta. Sem esse custo não há número nem para a [US-42](../../../../Novos/time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) nem para a [US-29](../../../../Novos/time/roteamento/US-29-medir-economia-do-roteamento/Sobre.md). Os custos das rodadas da US-36 (≈ $1,17 e ≈ $1,04) foram subestimados pelo mesmo motivo.

**Pronto quando:**
1. O `computeSpend` soma também `<sessão>/subagents/agent-*.jsonl`. Turno que aparece nos dois lugares não conta duas vezes; o id da mensagem já desduplica (`byId`).
2. O `--status`, texto e HTML, mostra o custo por papel, agrupado pelo `agentType` do `agent-*.meta.json` vizinho, com modelo e esforço. Sessão principal e subagentes saem separados. Subagente sem meta ou sem `agentType` vai para "sem papel", sem quebrar.
3. `teste.mjs`: com o HOME redirecionado, uma transcrição falsa de subagente (com meta) entra no total e na linha do papel; a mesma mensagem nos dois lugares conta uma vez; subagente sem meta não derruba. A contagem dos dois READMEs é atualizada junto.
4. Só leitura: nada novo passa por `fsw`, e nada entra na `UPDATES`.

**Não entra:**
- O aviso de agente sem `model:` (US-42).
- Mudar a tabela de preços.
- Atribuir custo a US: a sessão não diz de qual US era o turno, e esse limite fica com a US-29.

## Fluxos ligados
_(nenhum fluxo novo)_

## Código tocado
- `marvin.mjs` — `computeSpend` (`:620-660`)
- `marvin.mjs` — `printSpend` e a seção Tokens do `writeStatusHtml`
- `teste.mjs` — caso novo do custo de subagente

## Time
Triagem 15/10/2026 (refino: `tl` + `po` em paralelo; o dono escolheu "custo primeiro" e "duas US", com o `tl`).
- `dev-back`: implementa. Sonnet, esforço medium: é execução e o `tl` já decidiu a forma.
- `qa`: roda o teste e confere que o total de uma sessão real só sobe (Sonnet, low).
- `tl`: lê o diff (Opus, medium).
Graphify: o `tl` localizou por Read/Grep, sem consultar o grafo; fica registrado como limitação.

## Skills
Nenhuma.

## ❓
_(nenhuma: a forma foi decidida no refino)_

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 3 nó(s) de código em 3 comunidade(s).

**Quem depende do que ela toca** (2, até 2 níveis) — é o que o QA precisa cobrir:
- `computeStatus()  marvin.mjs:L1192`
- `printStatus()  marvin.mjs:L1293`

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../../Novos/ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../../Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../../Novos/ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 1 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../../Novos/ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 1 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../../Novos/ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 1 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../../Novos/ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 1 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../../Novos/ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../../Novos/organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../../Novos/organizacao-por-grafo/script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../../Novos/organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../../Novos/organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../../Novos/organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../../Novos/organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 1 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../../Novos/organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 3 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../../Novos/organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../../Novos/organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 1 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../../Novos/time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 1 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../../Novos/time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../../Novos/time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 2 nó(s) em comum

## Rumo
- **15/10/2026** — refinada a partir da issue #4. O `tl` achou o bug (subagentes fora da conta) e o confirmei no disco: 51 `agent-*.jsonl` em `subagents/`, e o meta traz `agentType`, `model` e `effort`. O `po` tinha deixado de fora o custo por papel (item 5 da issue) porque não sabia do bug. O dono decidiu que esta US vem antes da US-42.
- **15/10/2026** — implementada, sem commit. O `dev-back` (Sonnet, medium) fez a mudança. O `qa` (Sonnet, low) aprovou, e o `tl` (Opus, medium) aprovou com uma correção: a linha "(main session)" no texto e no HTML, porque o item 2 pede a principal separada. A correção foi aplicada na sessão principal. `node teste.mjs` dá 354, com os checks da principal somados aos que já existiam. Neste repo, o `--status` passou de 2854 turnos (≈ $512,87) para 3339, sendo 476 de subagentes. Os papéis somam ≈ $21,6: tl $10,18, general-purpose $4,07, dev-back $3,63, po $2,70, qa $0,65, codex $0,39. **Lacunas declaradas:**
  - Não há amostra de subagente aninhado (`spawnDepth` 2), então não se sabe onde ele grava.
  - O teste não exercita `meta.json` corrompido nem meta sem `agentType`, embora os dois ramos estejam no código.
  - O `contextoMedio` agora inclui os turnos de subagente.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
Commit `abfeec8`; `node teste.mjs`: **354 passaram**. Os checks do bloco US-41 conferem quatro coisas: o `subagents/` entra no total, a mesma mensagem nos dois lugares conta uma vez, a linha `dev-back` traz modelo e esforço, e o subagente sem meta vai para "sem papel". A "(main session)" sai separada no texto e no HTML. O `qa` aprovou, e o `tl` leu o diff e aprovou depois da correção da linha da principal.
