---
tipo: us
estado: cancelada
pai: ../Sobre.md
name: US-45-porta-unica
description: "O /refinar recebe N atividades e devolve N US refinadas e triadas; a execução segue uma US por rodada do /continuar. Sem comando novo."
---
# US-45 — porta única: entrego as atividades e o Marvin orquestra

**Por quê:** Hoje o dono conduz cada rito. Uma equipe terceirizada recebe o serviço e se organiza. `tl` e `po` concordam no mínimo: a regra de custo 6 do [plano](../../../../../Contexto/Arquitetura/equipe-barata.md) já descreve o fluxo (refinar as N num chat, executar cada uma em rodada própria). Evidência de 15/10: `/refinar logo tudo` levou 5 US de uma vez sem comando novo. Comando ponta a ponta não tem problema medido (`po`: especulação). Fase 4.

**Pronto quando:**
1. O template do `/refinar` declara que aceita N atividades e devolve N US refinadas com *Time* triado (papel, modelo, esforço); a execução segue uma por rodada do `/continuar`.
2. Uma rodada real com ≥ 3 atividades passa pelo `/refinar` e gera 3 `Sobre.md` com *Time* preenchido, com o custo registrado (US-29).
3. Rodar o `marvin` duas vezes não toca o comando que já existe (invariante 2); `UPDATES` acusa a seção nova num projeto da versão anterior.
4. O texto que manda escolher modelo de subagente vale só para o Claude Code: sai com selo ou restrito a ele (invariante 3).
5. `node teste.mjs` cobre os itens 3 e 4.

**Não entra:** comando novo; executar várias US num contexto; router como software; troca de executor sem humano (US-20).

## Código tocado
- `marvin.mjs` — :3295 template `/refinar`, :3371 `/continuar` (só leitura), :4217 `UPDATES`
- `.claude/commands/refinar.md` — deste repo
- `teste.mjs`

## Time
- **Grafo (15/10, fresco: graph.json 4 s depois do `b0fe0a3`):** templates de comando são literais, sem nó; `UPDATES` sem affected. Fallback: Grep.
- `po` + `tl` Opus médio — escopo
- `dev-back` Sonnet médio — template e `UPDATES`
- `qa` Sonnet baixo — verifica
- `tl` Opus médio — diff
- **Bloqueio:** portão da Fase 2 (US-29 com 2 amostras) e US-44 (a tabela de partida passa a morar no glossário).

## Skills
_(nenhuma)_

## ❓
- ❓ O mínimo (`/refinar` com N + `/continuar` por rodada) cobre a "porta única" que você descreveu, ou você quer o comando que vai do pedido à entrega? Se o mínimo basta, a US pode fechar só com os itens 1 e 2. (Decisão do dono.)

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 3 nó(s) de código em 3 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 2 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 2 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 2 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 2 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../../ferramentas-opcionais/curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../../organizacao-por-grafo/hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../organizacao-por-grafo/script/US-05-release/Sobre.md) — 2 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 2 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../../../organizacao-por-grafo/script/US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 2 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 2 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 2 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../../../organizacao-por-grafo/script/US-52-anotada-no-status/Sobre.md) — 1 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../glossario/US-44-glossario-da-equipe/Sobre.md) — 2 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 2 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../../roteamento/US-39-time-na-primeira-rodada/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 2 nó(s) em comum

## Rumo
- **15/10/2026** — anotada a partir da definição "equipe barata" do dono. Está fora da fila até o `/refinar`.
- **15/10/2026** — revisão da arquitetura (`tl` + `po`, Opus medium): a "unidade" entregue ao subagente é a linha do *Time* (papel, modelo, esforço); a US-47 não muda o formato do comando. Ordem: depois de a US-29 ter 2 amostras.
- **15/10/2026** — `/refinar` (logo tudo): refinada no mínimo que `tl` e `po` concordam — `/refinar` com N atividades, sem comando novo.
- **15/10/2026** — **cancelada** pelo dono, pela régua "mesmo resultado gastando menos" (o `po` a classificou como especulação): o `/refinar` já levou 5 atividades de uma vez nesta data, sem comando novo; reabre se a condução à mão se mostrar cara (US-29).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
