---
tipo: us
estado: cancelada
pai: ../Sobre.md
name: US-47-defect-e-task
description: "tipo: defect como sinônimo de US via um único isUS(n); Task só vira nó se o dono pedir. O 'anotada no --status' saiu para a US-52."
---
# US-47 — Defect e Task na hierarquia

**Por quê:** O Marvin trabalha como Scrum: Defect é defeito com causa e reprodução, Task é a etapa que vai para o subagente. Hoje só existem Epic, Feature e US. Arquitetura: [equipe-barata](../../../../../Contexto/Arquitetura/equipe-barata.md). **Refino de 15/10:** o item 5 (`anotada` no `--status`) virou a [US-52](../../script/US-52-anotada-no-status/Sobre.md). O `po` aponta que nada aqui está medido: Defect já funciona como US em `Manutencao/` e Task já existe como linha do *Time*.

**Pronto quando:**
1. Um único `isUS(n)` substitui as 9 comparações `tipo === 'us'` (`marvin.mjs` :565, 870, 1017, 1229, 1248, 1276, 1281, 1291, 1638) e aceita `tipo: defect`.
2. `marvin --us` cria Defect (`tipo: defect` no frontmatter).
3. `teste.mjs` com fixture de Defect concluído: o `--release` remove a linha da nota e a conta `antes − depois === n` fecha.
4. Base antiga continua válida; nenhuma US vira Defect sem o dono mover.
5. Task: só se o ❓1 pedir nó; senão continua linha do *Time*.

**Não entra:** migrar US antigas; Task como nó sem decisão; `anotada` no `--status` (US-52).

## Código tocado
- `marvin.mjs` — `ilhasOf` :564, `planningNodes` :588, `docsGraph` :700, `touchedByUS` :866, `writeStatusHtml` :905/:1017, `computeStatus` :1223, `--us` :1399-1473, `--release` :1607/:1638
- `teste.mjs`

## Time
- **Grafo (15/10, fresco: graph.json 4 s depois do `b0fe0a3`):**
  - `planningNodes` :588 — affected: `computeStatus` (:1224)
  - `ilhasOf` :564 — affected: `computeStatus` (:1228)
  - `docsGraph` :700 — affected: `touchedByUS`, `writeStatusHtml`, `computeStatus`; ligada à US-18
  - `touchedByUS` :866 — affected: `computeStatus`
  - `computeStatus` :1223 — sem affected, grau 11; ligada à US-16
  - `writeStatusHtml` :905 — sem affected, grau 12; ligada à US-36, US-21
  - lacuna: o grafo não vê comparação no nível de módulo — as 9 `tipo === 'us'` vieram do Grep (`tl`).
- **Risco (`tl`):** o `--release` apaga linha da nota; reconhecer Defect num lugar e não no outro faz a conta errar e o release abortar. Por isso um `isUS` só.
- `dev-back` Sonnet médio — implementa
- `qa` Sonnet médio — o release é destrutivo
- `tl` Opus **alto** — diff do `--release` (motivo: escrita destrutiva na nota)
- **Bloqueio:** uma US de núcleo por vez; Fase 4.

## Skills
_(nenhuma)_

## ❓
1. Task como nó já, ou como linha do *Time* (`etapa | papel | modelo | esforço`) até a US-29 pedir custo por Task? (Decisão do dono, mantida.)
2. **Divergência:** o `po` recomenda **descartar** "Defect como tipo" se você não trouxer um caso em que a pasta `Manutencao/` falhou; o `tl` propõe Defect como sinônimo via `isUS` (1 chat). Qual?

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

**Quem depende do que ela toca** (1, até 2 níveis) — é o que o QA precisa cobrir:
- `computeStatus()  marvin.mjs:L1223`

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 1 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 1 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 1 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 1 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 1 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../../ferramentas-opcionais/curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../script/US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../script/US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../script/US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../script/US-15-status-html-legivel/Sobre.md) — 1 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../script/US-16-refinar-e-ilhas/Sobre.md) — 2 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 1 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../../script/US-52-anotada-no-status/Sobre.md) — 1 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../time/glossario/US-44-glossario-da-equipe/Sobre.md) — 1 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../time/orquestracao/US-45-porta-unica/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 1 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 1 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 1 nó(s) em comum

## Rumo
- **15/10/2026** — anotada a partir da definição "equipe barata" do dono. Está fora da fila até o `/refinar`.
- **15/10/2026** — revisão da arquitetura (`tl` + `po`, Opus medium): o `tl` fez o passo de estrutura: o grafo não vê quem chama `planningNodes` no nível de módulo (`--release` em :1625 e `--us` em :1399-1473), por isso o *Código tocado* foi completado por Grep.
- **15/10/2026** — `/refinar` (logo tudo): refinada. Item 5 virou a US-52; Defect via um `isUS` único (`tl`); `po` propõe descartar Defect sem caso (❓2).
- **15/10/2026** — **cancelada** pelo dono, pela régua "mesmo resultado gastando menos" (o `po` a classificou como especulação): nenhum caso pediu: Defect já funciona como US em `Manutencao/`, Task já é linha do *Time*. O item 5 segue vivo na US-52. Reabre com um caso real.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
