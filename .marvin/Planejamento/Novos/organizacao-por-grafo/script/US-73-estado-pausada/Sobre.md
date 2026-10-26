---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-73-estado-pausada
description: "Estado `pausada` (com `espera:` e `desde:`) para a US que não está sendo trabalhada mas não acabou; estado fora da lista vira aviso com sugestão. Issue #7."
---
# US-73 — estado `pausada` e estado inválido apontado

**Por quê:** issue #7, medido no heimnor em 19/10/2026: 8 US com `estado: ativa` sem ninguém trabalhando (esperando o dono ou a operação), uma sessão gravou `estado: feita` e outra `estado: em andamento`, e a seção inventada "Esperando…" na nota caiu no aviso de relato. Causa no código (`tl`): não existe lista de estados válidos, só o comentário do template (`marvin.mjs:3138`); `readNode` lê o `estado` cru (L621) e `stateMark` (L1463) cai em `✗` sem dizer o que estava errado; o filtro de seção-relato (L1386) aceita `Travado`/`Depende`, não `Pausad`.

**Pronto quando:**
1. Constante com os estados válidos (`anotada | refinada | ativa | pausada | concluida | cancelada`) usada por `stateMark`, roadmap e épicos (L1429, L1439), badges do HTML (L1298, L1311) e o histórico (L1070).
2. `estado: pausada` com `espera:` e `desde:` aparece no `--status` num bloco "Pausadas" com o `espera` e a idade (`days()`, dentro da exceção que já existe para o `--status` e o HTML).
3. Pausada não entra em "Em andamento" nem na contagem de ativas.
4. `pausada` sem `espera:` gera aviso.
5. Estado fora da lista gera aviso com sugestão (`feita` → `concluida`, `em andamento` → `ativa`).
6. A pausada aparece também na nota, numa seção "Pausadas" só com ponteiros, e essa seção não é acusada como relato (`Pausad` no regex de L1386).
7. O comentário de estados do template (L3138) lista `pausada`, com marca nova em `UPDATES` (`desde`, `\s+`, `soCom: !OLD_LAYOUT`).
8. `teste.mjs` cobre 2 a 6.

**Não entra:** o limite de 2 ativas (convenção de cada projeto, não regra do script — dono, 26/10); o comando `--pausar` (US-79); aviso de "pausada há mais de N dias" (o dono não quer).

## Perguntas
- ~~❓ 1. A pausada aparece na nota ou só no `--status`?~~ → nos dois (dono, 26/10).
- ~~❓ 2. Aviso de "pausada há mais de 14 dias"?~~ → não precisa.
- ~~❓ 3. O limite de 2 ativas vira regra do Marvin?~~ → não, convenção de cada projeto.
- ~~❓ 4. `--pausar` entra?~~ → sim, na US-79.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
- `marvin.mjs` — `readNode`
- `marvin.mjs` — `stateMark`
- `marvin.mjs` — `computeStatus`
- `marvin.mjs` — `printStatus`
- `marvin.mjs` — `writeStatusHtml`
- `marvin.mjs` — `UPDATES`
- `teste.mjs`

## Time
Triagem 26/10/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo). Os dois concordam no escopo e em fazê-la primeiro.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | escopo fechado; a lista de estados aparece em 5 lugares | pendente |
| verificar | qa | Sonnet · baixo | `node teste.mjs` + base com ativas e pausadas | pendente |
| ler o diff | tl | Opus · médio | marca em `UPDATES` (template guardado por `existsSync`) | pendente |

Grafo (fresco, 23/10 23:15, mais novo que o último commit): `readNode` (L595) → affected `computeStatus` L1372 e `planningNodes` L671; `computeStatus` (L1361) grau 13, affected vazio (chamado do topo); `stateMark` (L1463) → affected `printStatus` L1482; `printStatus` (L1479) grau 10; `writeStatusHtml` (L1043) grau 13; `UPDATES` sem nó próprio (`pendingUpdates` L4822, grau 1) — usos por Grep.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 7 nó(s) de código em 5 comunidade(s) — **escopo largo**: vale fatiar?.

**Quem depende do que ela toca** (1, até 2 níveis) — é o que o QA precisa cobrir:
- `planningNodes()  marvin.mjs:L663`

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../../Manutencao/diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 2 nó(s) em comum
- [US-65 — custo por US](../../../../Manutencao/diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../../Manutencao/diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../../Manutencao/diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 2 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../../../../Manutencao/diagnostico/status/US-74-grafo-velho-vira-alerta/Sobre.md) — 3 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../../../../Manutencao/diagnostico/status/US-78-teto-por-documento/Sobre.md) — 4 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 3 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 2 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 2 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 2 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 2 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 2 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 2 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../../ferramentas-opcionais/curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
- [US-63 — skill citada nas instruções vem do ECC](../../../ferramentas-opcionais/curadoria/US-63-skill-citada-vem-do-ecc/Sobre.md) — 2 nó(s) em comum
- [US-69 — a matriz chama os agentes do ECC; o que não casa sai](../../../ferramentas-opcionais/curadoria/US-69-ecc-na-matriz/Sobre.md) — 2 nó(s) em comum
- [US-71 — o ponytail sai do obrigatório](../../../ferramentas-opcionais/curadoria/US-71-ponytail-sai-do-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../US-05-release/Sobre.md) — 2 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../US-07-status-html/Sobre.md) — 2 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../US-10-grafo-a-nosso-favor/Sobre.md) — 2 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../US-15-status-html-legivel/Sobre.md) — 2 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../US-16-refinar-e-ilhas/Sobre.md) — 3 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 3 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../US-52-anotada-no-status/Sobre.md) — 2 nó(s) em comum
- [US-75 — o *Impacto* do `Sobre.md` com teto](../US-75-impacto-com-teto/Sobre.md) — 2 nó(s) em comum
- [US-76 — aba "Visão do dono" (resumo, em andamento, fila, depende de você)](../US-76-visao-do-dono/Sobre.md) — 3 nó(s) em comum
- [US-77 — "Visão do dono": épicos, filtro e repositórios](../US-77-visao-do-dono-epicos/Sobre.md) — 2 nó(s) em comum
- [US-79 — `--pausar`: pausar uma US sem editar o frontmatter à mão](../US-79-pausar/Sobre.md) — 2 nó(s) em comum
- [US-81 — anotação é US `anotada`, e sai do índice quando vira trabalho](../US-81-anotacao-vira-us-anotada/Sobre.md) — 2 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../time/glossario/US-44-glossario-da-equipe/Sobre.md) — 2 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../time/orquestracao/US-45-porta-unica/Sobre.md) — 2 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 2 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../../../time/roteamento/US-39-time-na-primeira-rodada/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 3 nó(s) em comum
- [US-72 — o GPT na equipe: detectar, matriz e ponte](../../../time/roteamento/US-72-gpt-na-equipe/Sobre.md) — 2 nó(s) em comum

## Rumo
- **26/10/2026** — refinada da issue #7 (`tl` + `po`). Primeira da fila: pequena, medida, e a US-76 usa o chip `pausada`.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
