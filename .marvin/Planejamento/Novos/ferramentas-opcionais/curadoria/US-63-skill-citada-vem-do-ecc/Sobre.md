---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-63-skill-citada-vem-do-ecc
description: "Skill citada entre crases nas instruções do projeto (ex.: /council) e ausente em .claude/skills sai do catálogo do ECC; se o ECC não tiver, o marvin avisa pelo nome e o texto manda a LLM criar com a origem registrada."
---
# US-63 — skill citada nas instruções vem do ECC

**Por quê:** [issue #6](https://github.com/Josuebmota/Marvin/issues/6). No Parci (19/10), o `CLAUDE.md` mandava usar `/council`; a skill não estava no projeto, o agente recebeu `Unknown skill` e montou o conselho à mão, com `skills/council/` no ECC já clonado. A [US-60](../US-60-ecc-fonte-da-equipe/Sobre.md) só copia o que o `ECC_PLAN` deriva da stack. **Correção da issue (`tl` e `po`):** o `marvin.mjs` nunca escreve `council` (Grep zero) — a citação foi escrita pela LLM ou pelo dono; e o texto já dá o caminho `~/.claude/plugins/marketplaces/ecc`, só que como pergunta condicional ("Precisa de…?"), que o agente não liga ao `Unknown skill`.

**Pronto quando:**
1. O `marvin` acha as citações `` `/<id>` `` entre crases em `CLAUDE.md`, `AGENTS.md` e `.claude/commands/*.md` do projeto; quando `<ecc>/skills/<id>/SKILL.md` existe e `.claude/skills/<id>/` não, a skill entra no plano do ECC e é copiada com o mesmo rewrite de `model`/`effort` da US-60. Rodar de novo não muda nada (invariante 2).
2. `marvin --check` diz o nome de cada citação ausente no projeto, e se o ECC a tem ("`/council` citado no CLAUDE.md, ausente; o ECC tem: rode `marvin`") ou não.
3. O texto gerado ganha o gatilho explícito: "`Unknown skill /x` → `cp -r ~/.claude/plugins/marketplaces/ecc/skills/x .claude/skills/`; se o ECC não tiver, crie e registre a origem". A frase antiga fica (é marca da `UPDATES`) e o texto novo ganha marca própria com `desde: '<versão>'`.
4. `teste.mjs`: `CLAUDE.md` falso cita `` `/council` `` e ECC falso tem `skills/council/` → copiada; citação sem catálogo → aviso, nenhum arquivo; comando do Marvin (`/retomar`) → nenhum aviso; 2ª rodada e `--dry-run` sem escrita.

**Não entra:** o script criar a skill "com palavras próprias" (invariante 4 — é da LLM, pelo texto); agente citado por nome (ambíguo demais); prosa sem crase; hooks, regras e comandos do ECC; caminho absoluto pessoal no texto gerado (ver ❓).

## Perguntas
- ❓ Copiar sozinho a skill citada (item 1), ou só avisar e deixar a cópia para a LLM? Copiar escreve no disco do usuário; o `tl` lê o diff por isso. Partida do refino: copiar, porque é a mesma cópia literal que a US-60 já faz.
- ❓ **Divergência `po` × `tl`:** o `po` aceita o caminho resolvido por `os.homedir()` no texto gerado (com marcador em repo público); o `tl` diz não — o CLAUDE.md gerado é versionado no projeto, o caminho absoluto vaza o usuário e quebra na máquina do colega, e `~/` já é o caminho certo. O refino partiu do `tl`.
- ❓ Quanto custou montar o conselho à mão no Parci? Sem esse número o item 1 é conveniência, não economia medida.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md): o "procure primeiro no ECC".

## Código tocado
- `marvin.mjs` — `ECC_PLAN`
- `marvin.mjs` — bloco instalador do ECC (`if (ECC)`)
- `marvin.mjs` — check do ECC no `--check`
- `marvin.mjs` — `UPDATES`
- `teste.mjs`

## Time
Triagem 19/10/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo).

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | partida | pendente |
| verificar | qa | Sonnet · baixo | partida; cenários: 2 rodadas, `--dry-run`, layout antigo, `/retomar` falso | pendente |
| ler o diff | tl | Opus · médio | obrigatório: escreve em `.claude/` alheio e mexe em `UPDATES` | pendente |

Grafo (fresco, 16/10 16:59, depois do último commit): `ECC_PLAN` tem nó (grau 1, constante; `affected` sem dependente); bloco instalador **sem nó** (não é função) — localizado por Grep; check e templates localizados por Grep.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 3 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../../Manutencao/diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../../../Manutencao/diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../../Manutencao/diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../../Manutencao/diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 1 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 2 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 2 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 2 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../adaptadores/US-34-playwright-front-mobile/Sobre.md) — 2 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
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
- [US-44 — o glossário da equipe vem na instalação](../../../time/glossario/US-44-glossario-da-equipe/Sobre.md) — 2 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../time/orquestracao/US-45-porta-unica/Sobre.md) — 2 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 2 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../../../time/roteamento/US-39-time-na-primeira-rodada/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 2 nó(s) em comum

## Rumo
- **19/10/2026** — aberta da issue #6. `tl` e `po` corrigem a causa (o script não escreve `/council`; o texto não tem gatilho). Prioridade média, depois da US-64 (`po`): uma mordida só, sem número de custo.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
