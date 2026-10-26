---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-78-teto-por-documento
description: "Teto de tamanho por documento (constante, aviso no --status) e aviso de fragmento órfão, sem pai no grafo. Issue #9; a parte das anotações (#8) foi para a US-81."
---
# US-78 — teto por documento e fragmento órfão

**Por quê:** issue #9, princípio do dono (26/10/2026): todo documento precisa de tamanho-limite para não prejudicar a leitura da LLM, e fragmentar ajuda desde que o grafo ache cada fragmento. Medido no Parci: linhas de tabela do `escopo.md` com milhares de caracteres e `Sobre.md` com 200+ linhas. O Marvin só tem teto para o que carrega sozinho: `NOTE_CEILING` e `FIXED_TK_CEILING` (`marvin.mjs:394-395`).

**Pronto quando:**
1. Constante de teto por documento ao lado de `NOTE_CEILING`/`FIXED_TK_CEILING` (sugestão da issue: ~12–15 KB ou ~300 linhas; linha de tabela acima de ~600 caracteres), sem arquivo de configuração.
2. `--status` varre os arquivos de `planningNodes` (L663) e da base e lista os que passam do teto com `!` e o caminho, dizendo **como** quebrar: índice curto + um arquivo por assunto, cada pedaço com link para o pai.
3. Fragmento órfão: documento da base sem aresta de pai em `docsGraph` (L838) — ninguém aponta para ele — gera aviso com o caminho.
4. O `--curto` do hook só fala do teto para o que carrega sozinho (como hoje); o resto fica no `--status` completo.
5. `teste.mjs`: documento acima do teto dispara o aviso; fragmento sem pai dispara o órfão; documento ligado não dispara.

**Não entra:** mover para `historico/` (escrita destrutiva no disco do usuário, invariante 1); `marvin.json` (decisão fechada "sem arquivo de config"); anotações (US-81); o *Impacto* (US-75).

## Decisão do dono (26/10/2026)
O `tl` e o `po` divergiram: o `tl` propôs fazer já, com constante e aviso de órfão; o `po`, medir antes os tk que um documento grande custa, porque o lido sob demanda já se mostrou de custo zero (lição do `10_Decisoes/`). **O dono ficou com o `tl`**, e o fragmento órfão entra.

## Perguntas
- ~~❓ 1. Teto para documento lido sob demanda: já ou depois de medir?~~ → já, com constante (dono, 26/10).
- ~~❓ 2. A #8 vira "anotação = US `anotada`"?~~ → sim (US-81).
- ~~❓ 3. Fragmento órfão entra?~~ → sim.

## Código tocado
- `marvin.mjs` — `NOTE_CEILING`
- `marvin.mjs` — `computeStatus`
- `marvin.mjs` — `printStatus`
- `marvin.mjs` — `docsGraph`
- `teste.mjs`

## Time
Triagem 26/10/2026 (`/refinar`, `tl` e `po` no Opus · médio); forma fechada com a resposta do dono.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | varredura nova e regra do órfão sobre o `docsGraph` | pendente |
| verificar | qa | Sonnet · baixo | `node teste.mjs` + `--status` nesta base (deve achar os grandes daqui) | pendente |

Sem `tl` no diff: só leitura, sem `UPDATES`.

Grafo (fresco): `NOTE_CEILING` sem nó (Grep L394); `docsGraph` (L838) → affected `mergeDocs` L1912, `touchedByUS` L1006, `writeStatusHtml` L1149, `computeStatus` L1397; `computeStatus` (L1361) grau 13.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 5 nó(s) de código em 5 comunidade(s) — **escopo largo**: vale fatiar?.

**Quem depende do que ela toca** (3, até 2 níveis) — é o que o QA precisa cobrir:
- `mergeDocs()  marvin.mjs:L1897`
- `touchedByUS()  marvin.mjs:L1004`
- `writeStatusHtml()  marvin.mjs:L1043`

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../US-56-contexto-vigiado-na-abertura/Sobre.md) — 2 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../US-74-grafo-velho-vira-alerta/Sobre.md) — 3 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../../../ferramentas-opcionais/adaptadores/US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 4 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 2 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 2 nó(s) em comum
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
- [US-71 — o ponytail sai do obrigatório](../../../../Novos/ferramentas-opcionais/curadoria/US-71-ponytail-sai-do-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../../../Novos/organizacao-por-grafo/hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../../Novos/organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../../Novos/organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../../Novos/organizacao-por-grafo/script/US-05-release/Sobre.md) — 2 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../../Novos/organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../../Novos/organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 2 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../../../../Novos/organizacao-por-grafo/script/US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../../Novos/organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 2 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../../Novos/organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 2 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../../Novos/organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 3 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../../Novos/organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 2 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../../Novos/organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 3 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../../../../Novos/organizacao-por-grafo/script/US-52-anotada-no-status/Sobre.md) — 2 nó(s) em comum
- [US-73 — estado `pausada` e estado inválido apontado](../../../../Novos/organizacao-por-grafo/script/US-73-estado-pausada/Sobre.md) — 5 nó(s) em comum
- [US-75 — o *Impacto* do `Sobre.md` com teto](../../../../Novos/organizacao-por-grafo/script/US-75-impacto-com-teto/Sobre.md) — 2 nó(s) em comum
- [US-76 — aba "Visão do dono" (resumo, em andamento, fila, depende de você)](../../../../Novos/organizacao-por-grafo/script/US-76-visao-do-dono/Sobre.md) — 3 nó(s) em comum
- [US-77 — "Visão do dono": épicos, filtro e repositórios](../../../../Novos/organizacao-por-grafo/script/US-77-visao-do-dono-epicos/Sobre.md) — 2 nó(s) em comum
- [US-79 — `--pausar`: pausar uma US sem editar o frontmatter à mão](../../../../Novos/organizacao-por-grafo/script/US-79-pausar/Sobre.md) — 2 nó(s) em comum
- [US-81 — anotação é US `anotada`, e sai do índice quando vira trabalho](../../../../Novos/organizacao-por-grafo/script/US-81-anotacao-vira-us-anotada/Sobre.md) — 2 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../../Novos/time/glossario/US-44-glossario-da-equipe/Sobre.md) — 2 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../../Novos/time/orquestracao/US-45-porta-unica/Sobre.md) — 2 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../../Novos/time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../../Novos/time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 2 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../../../../Novos/time/roteamento/US-39-time-na-primeira-rodada/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../../Novos/time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 3 nó(s) em comum
- [US-72 — o GPT na equipe: detectar, matriz e ponte](../../../../Novos/time/roteamento/US-72-gpt-na-equipe/Sobre.md) — 2 nó(s) em comum

## Rumo
- **26/10/2026** — anotada das issues #8 e #9 com a divergência `tl` × `po`; no mesmo dia o dono decidiu (com o `tl`, órfão entra) e ela virou `refinada`. As anotações foram para a US-81; as partes medidas da #9 viraram US-74 e US-75.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
