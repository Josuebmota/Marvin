---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-99-nota-velha-no-status
description: "O --status passa a avisar a nota que aponta para US cancelada ou que traz o placeholder '_(uma frase)_', sem mudar o exit code."
---
# US-99 — nota velha no `--status`

**Por quê:** em 01/11 a nota `onde_paramos.md` apontava US concluídas como abertas, com "_(uma frase)_" no lugar do próximo passo. A detecção de `concluida` **já existe** (`marvin.mjs:1538`, dentro de `computeStatus` :1519, mostrada no `--curto` por `printStatus` :1717) e o hook também avisou: a nota envelheceu **com o alarme tocando**. Sobra de verdade: o estado `cancelada` passa calado, e o placeholder que o próprio `--us` escreve (`marvin.mjs:2125`) foi adicionado 8 vezes à nota; o incidente de 01/11 durou do commit `d8ffe4c` ao `5f5aee5`.
**Pronto quando:**
1. Ponteiro da nota para US `cancelada` gera o mesmo aviso que `concluida`.
2. Ponteiro com `_(uma frase)_` gera aviso.
3. Os dois são **aviso**, sem mudar o código de saída do `--status` (como fez a US-90); um teste para cada caso, `npm run test` verde, contagem nos dois READMEs.

**Não entra:** o campo "Atualizado:" da nota (compará-lo com a data do git rende pouco e a nota é do humano; o `po` sugeriu tirar o campo do template, o que pediria marca em `UPDATES`: fica de fora); mexer no `/fechar`; reescrever a nota sozinho.

## Perguntas
- ~~❓ Por que o aviso que já existia não foi atendido em 01/11? Se foi porque ninguém rodou o `--status`, mais um aviso não resolve; o conserto seria o `/fechar` tirar o ponteiro, e isso vira outra US.~~ → **ninguém rodou o `--status`** (dono, 01/11/2026): mais um aviso não resolve; o conserto de fundo é o `/fechar` tirar o ponteiro, anotado como [US-103](../US-103-fechar-tira-o-ponteiro-da-nota/Sobre.md).
- ~~❓ `cancelada` deve contar como problema (muda o código de saída do `--status`) ou só avisar? Está assim: só avisar.~~ → **só avisar** (dono, 01/11/2026).

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
- `marvin.mjs` — `computeStatus` (L1519; regra em L1538; `printStatus` L1717)
- `teste.mjs`
- `README.md` e `README.pt-BR.md` — contagem

## Time
Triagem 01/11/2026 (`tl` e `po` em Opus · médio; régua: só leitura, sem tocar disco de outro, saída igual → médio).

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| aviso para `cancelada` e placeholder + testes | dev-back | Sonnet · médio | leitura pura; vira alto só se o código de saída mudar | feito 02/11: 693 testes, ~48,4k tokens, 14 chamadas, ~7,3 min |
| ler o diff | tl | Opus · médio | não obrigatório se o código de saída ficar igual; entra se mudar | não acionado: código de saída igual; diff de 3 linhas lido na sessão principal |
| conferir | qa | Sonnet · baixo | teste, contagem, `git diff --check` | feito 02/11: 693 passaram, cenário reproduzido fora do repo |

Grafo (01/11): `computeStatus` (:1519) tem 10 US ligadas e nenhum dependente de código; `printStatus` idem. Blocos `--status` no topo do arquivo sem nó.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 3 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../US-56-contexto-vigiado-na-abertura/Sobre.md) — 2 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../US-74-grafo-velho-vira-alerta/Sobre.md) — 2 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../US-78-teto-por-documento/Sobre.md) — 2 nó(s) em comum
- [US-87 — o teto isenta US concluída e `Fontes/` vira raiz](../US-87-teto-isenta-concluida-e-fontes-raiz/Sobre.md) — 3 nó(s) em comum
- [US-90 — o estado da US não envelhece](../US-90-estado-que-nao-envelhece/Sobre.md) — 3 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 2 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 2 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 2 nó(s) em comum
- [US-82 — o hook do grafo com `core.hooksPath` (husky) não mente](../../../ferramentas-opcionais/adaptadores/US-82-hook-do-grafo-com-hookspath/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-98 — teste do aborto da migração](../../../memoria/migracao/US-98-teste-do-aborto-da-migracao/Sobre.md) — 1 nó(s) em comum
- [US-49 — identidade pública: equipe barata](../../../publicacao/identidade/US-49-identidade-equipe-barata/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../../Novos/ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 2 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../../Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../../Novos/ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../../Novos/ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 2 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../../Novos/ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 1 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../../Novos/ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 2 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../../Novos/ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 1 nó(s) em comum
- [US-96 — o agente do ECC que o marvin copia sai com Devolução e Escopo mínimo](../../../../Novos/ferramentas-opcionais/adaptadores/US-96-ecc-agentes-com-devolucao-e-escopo/Sobre.md) — 1 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../../../Novos/ferramentas-opcionais/curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
- [US-63 — skill citada nas instruções vem do ECC](../../../../Novos/ferramentas-opcionais/curadoria/US-63-skill-citada-vem-do-ecc/Sobre.md) — 1 nó(s) em comum
- [US-69 — a matriz chama os agentes do ECC; o que não casa sai](../../../../Novos/ferramentas-opcionais/curadoria/US-69-ecc-na-matriz/Sobre.md) — 1 nó(s) em comum
- [US-71 — o ponytail sai do obrigatório](../../../../Novos/ferramentas-opcionais/curadoria/US-71-ponytail-sai-do-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../../../Novos/organizacao-por-grafo/hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../../Novos/organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../../Novos/organizacao-por-grafo/script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../../Novos/organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../../Novos/organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../../Novos/organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../../Novos/organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 2 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../../Novos/organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 3 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../../Novos/organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 2 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../../Novos/organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 1 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../../../../Novos/organizacao-por-grafo/script/US-52-anotada-no-status/Sobre.md) — 1 nó(s) em comum
- [US-73 — estado `pausada` e estado inválido apontado](../../../../Novos/organizacao-por-grafo/script/US-73-estado-pausada/Sobre.md) — 2 nó(s) em comum
- [US-75 — o *Impacto* do `Sobre.md` com teto](../../../../Novos/organizacao-por-grafo/script/US-75-impacto-com-teto/Sobre.md) — 1 nó(s) em comum
- [US-76 — aba "Visão do dono" (resumo, em andamento, fila, depende de você)](../../../../Novos/organizacao-por-grafo/script/US-76-visao-do-dono/Sobre.md) — 2 nó(s) em comum
- [US-77 — "Visão do dono": épicos, filtro e repositórios](../../../../Novos/organizacao-por-grafo/script/US-77-visao-do-dono-epicos/Sobre.md) — 1 nó(s) em comum
- [US-79 — `--pausar`: pausar uma US sem editar o frontmatter à mão](../../../../Novos/organizacao-por-grafo/script/US-79-pausar/Sobre.md) — 1 nó(s) em comum
- [US-81 — anotação é US `anotada`, e sai do índice quando vira trabalho](../../../../Novos/organizacao-por-grafo/script/US-81-anotacao-vira-us-anotada/Sobre.md) — 1 nó(s) em comum
- [US-83 — `--us` aceita o caminho do `Sobre.md`](../../../../Novos/organizacao-por-grafo/script/US-83-us-aceita-caminho-do-sobre/Sobre.md) — 1 nó(s) em comum
- [US-85 — as anotadas por nome no `--status` do terminal](../../../../Novos/organizacao-por-grafo/script/US-85-anotadas-no-status-do-terminal/Sobre.md) — 2 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../../Novos/time/glossario/US-44-glossario-da-equipe/Sobre.md) — 2 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../../Novos/time/orquestracao/US-45-porta-unica/Sobre.md) — 1 nó(s) em comum
- [US-88 — travas por hook](../../../../Novos/time/orquestracao/US-88-travas-por-hook/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../../Novos/time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../../Novos/time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../../Novos/time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 1 nó(s) em comum
- [US-72 — o GPT na equipe: detectar, matriz e ponte](../../../../Novos/time/roteamento/US-72-gpt-na-equipe/Sobre.md) — 1 nó(s) em comum
- [US-89 — subir o degrau por check reprovado](../../../../Novos/time/roteamento/US-89-subir-degrau-por-check/Sobre.md) — 2 nó(s) em comum
- [US-91 — o Gemini na equipe: documentar, medir o par e só então mexer na matriz](../../../../Novos/time/roteamento/US-91-gemini-na-equipe/Sobre.md) — 1 nó(s) em comum
- [US-92 — Régua escrita de modelo e esforço por atividade, aplicada pelo tl e pelo po (e pelo subagente ao devolver)](../../../../Novos/time/roteamento/US-92-regua-de-esforco-por-atividade/Sobre.md) — 1 nó(s) em comum
- [US-97 — três pendências da régua e do ECC](../../../../Novos/time/roteamento/US-97-tres-pendencias-da-regua-e-do-ecc/Sobre.md) — 1 nó(s) em comum

## Rumo
- **01/11/2026** — anotada na conversa de 01/11; a anotação dizia "acusar a nota velha", mas o crivo mostrou que metade já existia. Reescrita. Divergência: o `po` quis cortar o campo "Atualizado" do template e o `tl` o deixou fora por não valer a comparação com o git; prevaleceu deixar fora. Ilha "status" com a US-102 (mesma região).
- **01/11/2026** — ❓ respondidas pelo dono: só avisar (sem mudar o código de saída); causa do alarme ignorado = ninguém rodou o `--status`, o que gerou a [US-103](../US-103-fechar-tira-o-ponteiro-da-nota/Sobre.md). Pronta para executar.
- **02/11/2026** — **feito.** `computeStatus` (`marvin.mjs:1542-1543`, +3 linhas): `cancelada` ainda na nota e ponteiro com `_(uma frase)_` viram aviso em `item.avisos`, a lista que `--status`, `--curto` e `--html` já imprimem; nenhum faz `st.problemas++`, então o código de saída (`marvin.mjs` ~L2004) não muda. 7 verificações novas (bloco `9w6`): nota limpa sem aviso, cada caso com aviso, código de saída igual ao da nota limpa, `--curto` e `--html`; 693 testes. `qa` reproduziu o cenário num projeto temporário fora do repo (os três saem 0). Custo do `dev-back` (Sonnet · médio): ~48,4k tokens, 14 chamadas, ~7,3 min.
- **02/11/2026** — limites: a US `cancelada` na nota aparece com `✗` vermelho porque o `STATE_MARK` não tem `cancelada` (já era assim; uma linha, fora do escopo); o aviso do placeholder só vale para ponteiro de US, epic ou feature que existe e não está `pausada`; o `--html` tem o exit code testado, o visual não foi conferido à mão; `tl` não foi chamado porque o código de saída não mudou (previsto no *Time*).

## Evidência
Teste: 693 passaram. Commit: `git log --grep "US-99 concluída"`.
