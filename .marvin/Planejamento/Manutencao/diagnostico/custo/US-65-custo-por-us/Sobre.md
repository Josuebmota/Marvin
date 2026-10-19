---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-65-custo-por-us
description: "O --status soma o custo por US (e por etapa, se o sinal existir) a partir de um sinal que já está na transcrição, sem subtração manual do total; turno sem sinal vai para 'sem US', nunca é rateado."
---
# US-65 — custo por US

**Por quê:** [issue #5](https://github.com/Josuebmota/Marvin/issues/5), a outra metade. Hoje o custo da rodada sai da diferença do total no começo e no fim, o que mistura orquestração e atraso de transcrição. **Não há vínculo sessão → US:** o `--us` só escreve o `Sobre.md` e o ponteiro. A [US-41](../US-41-custo-dos-subagentes/Sobre.md) deixou isto de fora de propósito ("a sessão não diz de qual US era o turno").

**Pronto quando:**
1. A atribuição do turno à US sai de um sinal que já existe na transcrição (ver ❓ da regra), decidida e escrita aqui antes de implementar.
2. `marvin --status --us US-NN` soma a sessão principal e os subagentes daquela US; turno sem sinal vai para "sem US", com o tamanho do balde à vista — nunca rateado.
3. `teste.mjs` com transcrições falsas: duas US numa sessão, delegação sem sinal, sessão sem `--us`.
4. Só leitura: o script mostra; quem escreve o custo no Rumo é quem conhece o projeto.

**Não entra:** escrever no `Sobre.md` pelo script; linha de "orquestração" no template do *Time* (é da [US-29](../../../../Novos/time/roteamento/US-29-medir-economia-do-roteamento/Sobre.md) ou de texto); preço novo.

## Perguntas
- ✅ **Regra de atribuição** (decidida pelo `po`, Opus · médio, 19/10/2026; **confirmada pelo dono ao aprovar**): **só a janela do `--us`**, sem reserva. Um turno da sessão principal é da US-NN se cair na janela que abre no tool_use Bash que roda `marvin`/`marvin.mjs` com `--us <caminho>` (US-NN = último segmento do caminho; o próprio turno da chamada entra) e fecha no próximo `--us <caminho>` ou `--fechar`. Não abrem janela: comando com `--status` (o próprio `marvin --status --us US-NN`), com `--dry-run`, ou cujo tool_result deu erro. Subagente herda a US da janela que contém o tool_use `Agent` cujo `id` é o `toolUseId` do `agent-<id>.meta.json`. Fora de janela, sem meta ou com `toolUseId` órfão → **sem US**, à vista, sem rateio; soma das US + sem US = total. `US-NN` no prompt **não** atribui: na sessão da US-64 pegaria 1 de 5 subagentes e o prompt cita várias US. Custo aceito: a sessão que implementou a US-64 (`3bebfbc3`) cai inteira em "sem US", porque não rodou `--us`; a janela da US-64 que o `--status` mostra vem da sessão `47700f96`, que rodou `--us` para ela (conferido pelo `tl`). O `delegacao.md` não muda.
- ✅ **Etapa fica fora:** exige o nome dela em texto livre, e nenhuma sessão medida traz o sinal.
- ❓ **Divergência `po` × `tl` sobre a US-29:** o `po` diz que esta US **não é porta** da US-29 (ela já mede com um chat por US e espera só o seu aceite); o `tl` diz que é **pré-requisito**, porque sem corte de turnos a amostra em sessão de várias US não conta. Partida do refino: não bloqueia a US-29 — abre amostra nova em sessão autônoma.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md): a convenção do prompt de delegação, se a regra do `po` vencer.

## Código tocado
- `marvin.mjs` — `computeSpend`
- `marvin.mjs` — `printSpend`
- `teste.mjs`

## Time
Triagem 19/10/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo). Destravada: a regra foi decidida pelo `po` em 19/10.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| decidir a regra de atribuição | po | Opus · médio | partida; julgamento; o dono confirma ao aprovar | feito |
| localizar o sinal no `.jsonl` e os pontos de `computeSpend`/`printSpend` | scout | Haiku · baixo | recuperação delimitada; entra pelo parecer do `tl` (mesmo Time de baixo da US-64) | feito |
| implementar | dev-back | Sonnet · médio | partida | feito |
| verificar | qa | Sonnet · baixo | partida | feito |
| ler o diff | tl | Opus · médio | sobe por motivo: a regra alimenta a medição da US-29 e erro ali vira número falso | feito |

**19/10/2026** — amostra da [US-29](../../../../Novos/time/roteamento/US-29-medir-economia-do-roteamento/Sobre.md), braço **anterior** (coordenador Opus · médio), par da US-64 (braço política, coordenador Sonnet · médio). Chat próprio, só a US-65 até o commit (sem release, push nem refino); id da sessão: c8558000-0944-4106-b3d7-2c6aad31a7e3. Mesmo Time de baixo da US-64 (`scout` Haiku · baixo, `dev-back` Sonnet · médio, `qa` Sonnet · baixo), com `model` e `effort` em cada delegação. Linhas à parte, fora da comparação (parecer do `tl`): o `po` que decide a regra e o `tl` que lê o diff. Checks: `node teste.mjs` e o aceite dos critérios 1–4. Juiz: o dono. Custo medido com o `--status` de `00ecc72`.

Grafo (fresco): `computeSpend` → `affected`: `computeStatus`; `explain`: liga à US-41. `printSpend` → `affected`: `printStatus`.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 3 nó(s) de código em 3 comunidade(s).

**Quem depende do que ela toca** (2, até 2 níveis) — é o que o QA precisa cobrir:
- `computeStatus()  marvin.mjs:L1280`
- `printStatus()  marvin.mjs:L1398`

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../US-41-custo-dos-subagentes/Sobre.md) — 3 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../US-64-desvio-de-papel-no-status/Sobre.md) — 3 nó(s) em comum
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
- **19/10/2026** — aberta da issue #5 (fatia 3 do `tl`). Depois da US-64, que mexe nas mesmas funções.
- **19/10/2026** — implementada na amostra da US-29 (braço anterior, coordenador Opus · médio; sessão `c8558000`). `computeSpend` lê os tool_use/tool_result da sessão principal em ordem e abre a janela só no segmento de comando que começa com `marvin`, `node …marvin.mjs` ou `npx marvin-kb` e traz `--us <caminho>` com chave `^US-\d+$`; `--status`, `--dry-run`, `--refinada` e tool_result com erro não abrem; `--us`/`--fechar` (sem `--dry-run`) fecham, e o turno do `--fechar` fica na janela que fecha. Subagente herda pelo `meta.toolUseId`; o resto vai para "sem US". Devolve `porUs`; `printSpend` mostra a US pedida e "sem US" com `--status --us US-NN`, e uma linha por US sem `--us` (só se houver janela). O `qa` achou US falsas (`$u` ≈ $231 de loops de shell) e falsos positivos de `marvin` em texto; corrigidos com check. `teste.mjs`: 8 checks novos, 481 verdes; READMEs 473→481. `tl`: aprovado com ressalva. **Fora:** a janela não atravessa arquivo de sessão (sessão retomada em transcript novo cai em "sem US"); com `--us`, o total das outras US não aparece, então a soma não fecha à vista (opcional, ressalva do `tl`). Não concluída: aguarda o dono confirmar a regra e olhar a saída do `--status`.

## Evidência
- Commit `16f86e8`; `node teste.mjs` 481 passaram (8 checks novos: duas US numa sessão, delegação sem sinal, sessão sem `--us`, US falsa de variável de shell, `marvin` em texto).
- `marvin --status` deste repo: linha "by US" por janela do `--us` e balde "sem US" à vista, sem rateio; `--status --us US-64` filtra.
- **Aprovada pelo dono em 19/10/2026**, com a regra da janela `--us` confirmada.
