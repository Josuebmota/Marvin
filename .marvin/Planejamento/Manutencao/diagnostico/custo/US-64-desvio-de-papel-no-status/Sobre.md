---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-64-desvio-de-papel-no-status
description: "O --status mostra o que rodou fora do Time e quanto custou: esforço por turno, sessão principal como papel, desvio com sessão e data, papel declarado sem medição e papel misto quebrado por modelo. Só leitura."
---
# US-64 — desvio de papel no `--status`

**Por quê:** [issue #5](https://github.com/Josuebmota/Marvin/issues/5), metade do diagnóstico. No heimnor (17/10), ≈ $76 de ≈ $272 (28%) rodaram fora do *Time* — $40 "sem papel" com `effort ?` e $36 em `general-purpose` no Opus — e o `--status` só avisa "sem papel no Opus", agregado (`computeSpend`/`printSpend`). Estende a [US-41](../US-41-custo-dos-subagentes/Sobre.md). **O esforço é observável:** todo registro `assistant` recente traz `effort` no topo (o `tl` contou 62/62 e 1157/1158; conferido 65/65 numa sessão deste repo) — o `?` vem de ler só `meta.effort`.

**Pronto quando:**
1. O esforço sai do turno (`effort` do registro, com `meta.effort` de reserva); `?` só sobra para transcrição antiga, escrito como "não registrado".
2. A sessão principal aparece como papel ("sessão principal", como no `Equipe.md`), com modelo, esforço e custo.
3. Todo turno de `general-purpose` ou sem papel, em qualquer modelo, vira linha de desvio com sessão (id curto), data e ≈ $.
4. Papel com modelos misturados sai uma linha por modelo.
5. Papel declarado num *Time* e sem nenhum turno (o `po` da issue) sai como "sem medição".
6. `teste.mjs` cobre 1–5 com transcrições falsas; só leitura — nada em `fsw` nem na `UPDATES`.

**Não entra:** custo por US ou por etapa ([US-65](../US-65-custo-por-us/Sobre.md)); escrever no `Sobre.md`; preço novo; o `--html`.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md): o *Time* com que o desvio compara.

## Código tocado
- `marvin.mjs` — `computeSpend`
- `marvin.mjs` — `printSpend`
- `marvin.mjs` — `readNode`
- `teste.mjs`

## Time
Triagem 19/10/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo). `tl` fora do diff: só exibição, não toca invariante nem escreve.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| localizar os campos no `.jsonl` | scout | Haiku · baixo | recuperação delimitada | pendente |
| implementar | dev-back | Sonnet · médio | partida | pendente |
| verificar | qa | Sonnet · baixo | partida; aceite com transcrições falsas | pendente |

Grafo (fresco): `computeSpend` → `affected`: `computeStatus`; `explain`: chama `costOf`, liga à US-41. `printSpend` → `affected`: `printStatus`. `readNode` → `affected`: `computeStatus`, `planningNodes`.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 4 nó(s) de código em 4 comunidade(s) — **escopo largo**: vale fatiar?.

**Quem depende do que ela toca** (3, até 2 níveis) — é o que o QA precisa cobrir:
- `computeStatus()  marvin.mjs:L1257`
- `printStatus()  marvin.mjs:L1375`
- `planningNodes()  marvin.mjs:L614`

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../US-41-custo-dos-subagentes/Sobre.md) — 3 nó(s) em comum
- [US-65 — custo por US](../US-65-custo-por-us/Sobre.md) — 3 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 2 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
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
- [US-50 — o Marvin instala as ferramentas por projeto](../../../../Novos/ferramentas-opcionais/curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
- [US-63 — skill citada nas instruções vem do ECC](../../../../Novos/ferramentas-opcionais/curadoria/US-63-skill-citada-vem-do-ecc/Sobre.md) — 1 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../../../Novos/organizacao-por-grafo/hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../../Novos/organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../../Novos/organizacao-por-grafo/script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../../Novos/organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../../Novos/organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../../Novos/organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../../Novos/organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 1 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../../Novos/organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 3 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../../Novos/organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../../Novos/organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 1 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../../../../Novos/organizacao-por-grafo/script/US-52-anotada-no-status/Sobre.md) — 1 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../../Novos/time/glossario/US-44-glossario-da-equipe/Sobre.md) — 1 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../../Novos/time/orquestracao/US-45-porta-unica/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 1 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../../Novos/time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 1 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../../Novos/time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../../Novos/time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 2 nó(s) em comum

## Rumo
- **19/10/2026** — aberta da issue #5 (fatias 1 e 2 do `tl`). Primeira na ordem do `po`: maior número medido, só leitura, uma rodada.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
