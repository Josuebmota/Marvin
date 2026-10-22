---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-66-graphify-preserva-origem-doc
description: "Desde o graphify 0.9.37 o refresh indexa os .md sozinho, com o mesmo id dos nós-doc do Marvin: os nossos perdem _origin/tipo/estado e a próxima mesclagem duplica 149 ids. A mesclagem passa a reconhecer os nós pelo id que ela mesma gera."
---
# US-66 — o refresh do graphify não apaga nem duplica os nós da base

**Por quê:** auditoria de 22/10. O graphify 0.9.37 passou a indexar `.md` por conta própria (1021 nós `document`), com o mesmo id que o `idOf` do Marvin gera (`.marvin/...Sobre.md` → `marvin_..._sobre`). O hook `post-commit` roda só `graphify update .`, e os nós-doc do Marvin foram trocados pelos do graphify: 0 nós com `_origin: 'marvin'`, 0 com `tipo`/`estado`; as 997 arestas do Marvin sobreviveram. Efeitos: o `--status` conta 0 docs (`marvin.mjs:1410`); e a mesclagem (`marvin.mjs:4482` filtra só por `_origin`, `:4485` faz o push) **duplica os 149 ids** no próximo `marvin --graphify` — confirmado pelo `tl` em simulação (1383 nós, 1234 ids únicos). Invariante 2.

**Pronto quando:**
1. Na mesclagem, o `docsGraph` roda antes e o filtro remove de `g.nodes` também os nós cujo id está entre os que ele gera (`!newIds.has(n.id)`); os nós de seção do graphify ficam (ligam ao mesmo id).
2. `--status`: docs = 0 com arestas `marvin` > 0 vira aviso "o refresh do graphify apagou o lado dos docs — rode `marvin --graphify`".
3. `teste.mjs` (junto do teste da mesclagem): grafo falso com `{id:<id da US>, file_type:'document', _origin:'ast'}` → depois da rodada, ids únicos e o nó volta com `_origin:'marvin'` e `tipo`; 2ª rodada idêntica; `--dry-run` sem escrita.

**Não entra:** fazer o hook do git rodar o `marvin` (escreve no repo dos outros — US própria se pedir); mudar o network do `index.html` (o efeito lá é cosmético); mexer no graphify.

## Perguntas
- ❓ (`po`) Adotar os nós-doc do graphify e parar de gerar os nossos seria mais barato? O `tl` partiu de manter os nossos por cima (é o que carrega `tipo`/`estado`, que o graphify não tem). Partida do refino: manter os nossos.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md): o passo de estrutura lê este grafo.

## Código tocado
- `marvin.mjs` — `docsGraph`
- `marvin.mjs` — `computeStatus`
- `marvin.mjs` — bloco de mesclagem dos docs no grafo (topo, ~L4479-4500)
- `teste.mjs`

## Time
Triagem 22/10/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo).

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| teste que falha | tdd-guide | Sonnet · baixo | defeito com cenário concreto; agente do ECC que casa com a etapa (decisão do dono 22/10) | pendente |
| implementar | dev-back | Sonnet · médio | partida | pendente |
| verificar | qa | Sonnet · baixo | cenários: 2 rodadas, `--dry-run`, grafo sem docs | pendente |
| ler o diff | tl | Opus · médio | escreve `graph.json` (disco de alguém) e toca o invariante 2 | pendente |

Grafo (fresco, 22/10 07:01, depois do 43e789e; graphify 0.9.37): `docsGraph` → affected `touchedByUS` L960, `writeStatusHtml` L1103, `computeStatus` L1351; explain: touches da US-18. `computeStatus` → chama `loadGraph`, `touchedByUS`, `usImpact`; touches das US-16 e US-56. Bloco de mesclagem **sem nó** (nível de topo) — localizado por Grep.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 4 nó(s) de código em 4 comunidade(s) — **escopo largo**: vale fatiar?.

**Quem depende do que ela toca** (2, até 2 níveis) — é o que o QA precisa cobrir:
- `touchedByUS()  marvin.mjs:L958`
- `writeStatusHtml()  marvin.mjs:L997`

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../../diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 2 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../../Novos/ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 2 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../../Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../../Novos/ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../../Novos/ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 2 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../../Novos/ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 2 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../../Novos/ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 2 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../../Novos/ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 2 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../../../Novos/ferramentas-opcionais/curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
- [US-63 — skill citada nas instruções vem do ECC](../../../../Novos/ferramentas-opcionais/curadoria/US-63-skill-citada-vem-do-ecc/Sobre.md) — 2 nó(s) em comum
- [US-69 — a matriz chama os agentes do ECC; o que não casa sai](../../../../Novos/ferramentas-opcionais/curadoria/US-69-ecc-na-matriz/Sobre.md) — 2 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../../../Novos/organizacao-por-grafo/hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../../Novos/organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../../Novos/organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../../Novos/organizacao-por-grafo/script/US-05-release/Sobre.md) — 2 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../../Novos/organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../../Novos/organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 2 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../../../../Novos/organizacao-por-grafo/script/US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../../Novos/organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 2 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../../Novos/organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 2 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../../Novos/organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 2 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../../Novos/organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 2 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../../Novos/organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 3 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../../../../Novos/organizacao-por-grafo/script/US-52-anotada-no-status/Sobre.md) — 2 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../../Novos/time/glossario/US-44-glossario-da-equipe/Sobre.md) — 2 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../../Novos/time/orquestracao/US-45-porta-unica/Sobre.md) — 2 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../../Novos/time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../../Novos/time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 2 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../../../../Novos/time/roteamento/US-39-time-na-primeira-rodada/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../../Novos/time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 2 nó(s) em comum

## Rumo
- **22/10/2026** — aberta e refinada (auditoria "o Marvin usa graphify/ponytail como um todo?").

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
