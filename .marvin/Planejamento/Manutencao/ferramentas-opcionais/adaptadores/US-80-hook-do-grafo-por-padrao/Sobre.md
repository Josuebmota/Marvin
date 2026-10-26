---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-80-hook-do-grafo-por-padrao
description: "Com o graphify presente, o marvin instala o hook de post-commit por padrão (opção de desligar), para o grafo não envelhecer. Inverte a decisão de marvin.mjs:106. Issue #9."
---
# US-80 — o hook que atualiza o grafo vem ligado por padrão

**Por quê:** issue #9 e decisão do dono (26/10/2026: "liga sozinho"). O graphify é obrigatório desde 16/10, mas o hook de post-commit é opt-in (`--graphify-git-hook`, `marvin.mjs:107`) e no Parci ninguém rodou: grafo 11 dias atrasado. O comentário de L106 registra o motivo do opt-in ("a hook lives in `.git/`, is not versioned and fires invisibly") — esta US inverte essa decisão.

**Pronto quando:**
1. No passo 8b (L4485), com graphify instalado e repositório git, o `marvin` instala o hook como hoje faz o `--graphify-git-hook` (L4675), sem a flag.
2. Opção de desligar: `--no-graph-hook` (nome proposto) e, uma vez desligado, a escolha fica registrada no `ferramentas.md` para o próximo `marvin` não religar.
3. Hook de outra pessoa em `.git/hooks/post-commit` continua intocado (L4720 em diante, invariante 1): só avisa e mostra a linha para acrescentar à mão.
4. Projeto já montado: o `marvin` seguinte instala o hook e diz isso em uma linha (é escrita nova no disco de quem atualiza — marca em `UPDATES` se o texto gerado mudar).
5. O comentário de L106 e os dois READMEs dizem a regra nova.
6. `teste.mjs`: instala sem flag; não instala com o opt-out; não sobrescreve hook alheio; rodar duas vezes não duplica.

**Não entra:** mudar o que o hook faz (US-70); o aviso de hook ausente (US-74).

## Fluxos ligados
- [ferramentas.md](../../../../../ferramentas.md)

## Código tocado
- `marvin.mjs` — `GRAPHIFY_GIT_HOOK`
- `marvin.mjs` — passo 8b do graphify (~L4485, hook em ~L4675-4730)
- `marvin.mjs` — `UPDATES`
- `README.md`
- `README.pt-BR.md`
- `teste.mjs`

## Time
Triagem 26/10/2026 (`/refinar`): o `tl` marcou que ligar por padrão escreve em `.git/hooks` de terceiros e inverte a decisão de L106; o dono decidiu ligar.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | o instalador já existe; muda o gatilho e o opt-out | feito |
| verificar | qa | Sonnet · baixo | `node teste.mjs` + os dois READMEs | feito — aprovou, com prático numa base temporária |
| ler o diff | tl | Opus · médio | escreve no `.git` do usuário por padrão; `UPDATES` | feito — aprovado com 1 ajuste opcional, aplicado |

Grafo (fresco): `GRAPHIFY_GIT_HOOK` (L107) grau 1, só `contains` — uso real em L4675 por Grep; passo 8b é código de topo, sem nó.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 5 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 3 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../../diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 1 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../../../diagnostico/status/US-74-grafo-velho-vira-alerta/Sobre.md) — 2 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../../../diagnostico/status/US-78-teto-por-documento/Sobre.md) — 2 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../US-40-linha-fora-da-tabela/Sobre.md) — 3 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../US-66-graphify-preserva-origem-doc/Sobre.md) — 2 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../US-70-hook-refaz-docs-do-grafo/Sobre.md) — 3 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-49 — identidade pública: equipe barata](../../../publicacao/identidade/US-49-identidade-equipe-barata/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 3 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 3 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 3 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../../Novos/ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 2 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../../Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 3 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../../Novos/ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 3 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../../Novos/ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 3 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../../Novos/ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 2 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../../Novos/ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 3 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../../Novos/ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 2 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../../../Novos/ferramentas-opcionais/curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
- [US-63 — skill citada nas instruções vem do ECC](../../../../Novos/ferramentas-opcionais/curadoria/US-63-skill-citada-vem-do-ecc/Sobre.md) — 2 nó(s) em comum
- [US-69 — a matriz chama os agentes do ECC; o que não casa sai](../../../../Novos/ferramentas-opcionais/curadoria/US-69-ecc-na-matriz/Sobre.md) — 2 nó(s) em comum
- [US-71 — o ponytail sai do obrigatório](../../../../Novos/ferramentas-opcionais/curadoria/US-71-ponytail-sai-do-obrigatorio/Sobre.md) — 3 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../../../Novos/organizacao-por-grafo/hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../../Novos/organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../../Novos/organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../../Novos/organizacao-por-grafo/script/US-05-release/Sobre.md) — 2 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../../Novos/organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../../Novos/organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 2 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../../../../Novos/organizacao-por-grafo/script/US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../../Novos/organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 2 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../../Novos/organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 3 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../../Novos/organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 3 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../../Novos/organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 3 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../../Novos/organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 2 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../../../../Novos/organizacao-por-grafo/script/US-52-anotada-no-status/Sobre.md) — 1 nó(s) em comum
- [US-73 — estado `pausada` e estado inválido apontado](../../../../Novos/organizacao-por-grafo/script/US-73-estado-pausada/Sobre.md) — 2 nó(s) em comum
- [US-75 — o *Impacto* do `Sobre.md` com teto](../../../../Novos/organizacao-por-grafo/script/US-75-impacto-com-teto/Sobre.md) — 2 nó(s) em comum
- [US-76 — aba "Visão do dono" (resumo, em andamento, fila, depende de você)](../../../../Novos/organizacao-por-grafo/script/US-76-visao-do-dono/Sobre.md) — 1 nó(s) em comum
- [US-77 — "Visão do dono": épicos, filtro e repositórios](../../../../Novos/organizacao-por-grafo/script/US-77-visao-do-dono-epicos/Sobre.md) — 1 nó(s) em comum
- [US-79 — `--pausar`: pausar uma US sem editar o frontmatter à mão](../../../../Novos/organizacao-por-grafo/script/US-79-pausar/Sobre.md) — 2 nó(s) em comum
- [US-81 — anotação é US `anotada`, e sai do índice quando vira trabalho](../../../../Novos/organizacao-por-grafo/script/US-81-anotacao-vira-us-anotada/Sobre.md) — 2 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../../Novos/time/glossario/US-44-glossario-da-equipe/Sobre.md) — 3 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../../Novos/time/orquestracao/US-45-porta-unica/Sobre.md) — 2 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 4 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../../Novos/time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 3 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../../Novos/time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 2 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../../../../Novos/time/roteamento/US-39-time-na-primeira-rodada/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../../Novos/time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 2 nó(s) em comum
- [US-72 — o GPT na equipe: detectar, matriz e ponte](../../../../Novos/time/roteamento/US-72-gpt-na-equipe/Sobre.md) — 2 nó(s) em comum

## Rumo
- **26/10/2026** — refinada da issue #9 com a resposta do dono ("liga sozinho"). Pode vir junto ou depois da US-74.
- **26/10/2026** — feita. Opt-out = linha solta `hook do grafo: desligado — …` no fim do `ferramentas.md` (o hook não é ferramenta `sim/não`; segue o padrão do `ecc fora:`); `--graphify-git-hook` força e apaga a linha. Worktree (`.git` arquivo) e projeto sem git pulam com `info` — antes, com a flag, o `mkdir` sob `.git` arquivo dava ENOTDIR. Sem marca no `UPDATES` (tl): nenhum texto gerado muda; o aviso do projeto já montado é o `ok` do passo 8b. Hook antigo do Marvin sem `--graph-docs` é reescrito com `ok(... updated)`; o que já está em dia ganha a linha "turn it off for good" se o cabeçalho for o velho (ajuste do tl). Teste da US-70 item 5 passou a usar `--no-graph-hook` (o tl conferiu que não enfraquece). Fica para outra US (tl): projeto com `core.hooksPath` (husky) — o hook vai para `.git/hooks`, o git não roda, e a saída diz que roda (invariante 3).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- `node teste.mjs`: 594 passaram (+15 do bloco US-80).
- qa: prático numa base temporária — instala por padrão, segunda rodada sem mudança, `--no-graph-hook` registra e não religa, `--graphify-git-hook` religa, hook alheio byte-idêntico, `--dry-run` sem escrita; READMEs EN/PT dizem o mesmo.
- tl: aprovado (invariantes 1 e 2 no `ferramentas.md`, worktree, sem marca no `UPDATES`).
