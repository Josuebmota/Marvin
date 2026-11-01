---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-96 — o agente do ECC que o marvin copia sai com Devolução e Escopo mínimo

**Por quê:** o README de agentes gerado diz que a Devolução vai em "TODO agente que executa", mas o `eccAgent()` só reescreve o frontmatter; o agente do ECC chega sem o bloco, e o `tl` achou isso no par 2 da US-91 (`tdd-guide`). Mesmo vale para o "Escopo mínimo" da US-93. É também **a primeira US em que a régua da [US-92](../../../time/roteamento/US-92-regua-de-esforco-por-atividade/Sobre.md) é aplicada na triagem, antes de executar** (item 3 dela).
**Pronto quando:**
1. `eccAgent()` acrescenta ao corpo do agente do ECC que o script instala os blocos "Devolução: etapa mais difícil que o Time previu" e "Escopo mínimo" (mesmo texto dos agentes locais), uma vez só: se o texto já traz o bloco, não duplica.
2. Agente que já existe em `.claude/agents/` não é reescrito (invariante 2): o teste cobre instalação nova (traz os dois blocos), segunda rodada (sem duplicar) e agente existente (intocado).
3. `npm run test` verde com a contagem nos dois READMEs; `tl` leu o diff; `git diff --check` limpo.
4. A tabela *Time* abaixo foi escrita **antes** de executar, com a escolha da régua e a do julgamento solto lado a lado; ao fim, resultado e custo registrados aqui e no *Rumo* da US-92.

**Não entra:** reescrever agente do ECC que o projeto já tem (o humano pode ter editado); marca em `UPDATES` para projeto já montado (o README de agentes e a US-92 já ensinam a regra; reabrir com caso real); mudar o frontmatter ou o `description` além do que o `eccAgent()` já faz.

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md): régua de esforço e devolução.
- [Equipe](../../../../../Contexto/Equipe.md): "O ECC é a fonte do time" e "Escopo mínimo".

## Código tocado
- `marvin.mjs` — `eccAgent` (L2581; chamado na cópia de agentes do ECC, ~L4339)
- `teste.mjs` — bloco de teste do ECC

## Time
Triagem 31/10/2026 (sessão principal, `tl` e `po` consultados no desenho). **Régua da US-92 aplicada antes de executar**; a coluna "julgamento solto" é o que a tabela do `Equipe.md` daria sem a régua.

| etapa | papel | régua (sinal → escolha) | julgamento solto | motivo / estado |
|---|---|---|---|---|
| triagem e escopo | po + tl | spec fechada, sem decisão de rumo → médio → Opus · médio | Opus · médio | **igual.** Dúvida de calibragem: "decide rumo" lido literal faria o `tl` e o `po` sempre alto; aqui li como decisão nova, não rotina. | feito 31/10 |
| `eccAgent()` + teste | dev-back | **escreve no disco de alguém** (agente copiado no projeto do usuário) + toca `marvin.mjs` → alto → Sonnet · alto | Sonnet · médio | **diferente: a régua sobe um degrau de esforço.** Teste: o custo e o resultado dizem se pagou. | feito 31/10: 673 de 673, ~48,6k tokens, 19 chamadas, ~8,6 min |
| ler o diff do `marvin.mjs` | tl | invariante (escrita no disco de alguém, idempotência) → obrigatório → Opus · médio | Opus · médio | igual | feito 31/10: pode fechar |
| conferir | qa | roda teste e `git diff --check` → baixo → Sonnet · baixo | Sonnet · baixo | igual | feito 31/10: 673 passaram, itens 1 a 3 conferem |

Grafo (31/10, fresco): `eccAgent()` — `affected`: nenhum; `explain`: grau 2, chama só `eccCost()`; sem dependente fora da cópia de agentes. Modelo e esforço aplicados: não confirmados até a execução.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../../Manutencao/diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../../../Manutencao/diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../../Manutencao/diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../../Manutencao/diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 1 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../../../../Manutencao/diagnostico/status/US-74-grafo-velho-vira-alerta/Sobre.md) — 1 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../../../../Manutencao/diagnostico/status/US-78-teto-por-documento/Sobre.md) — 1 nó(s) em comum
- [US-87 — o teto isenta US concluída e `Fontes/` vira raiz](../../../../Manutencao/diagnostico/status/US-87-teto-isenta-concluida-e-fontes-raiz/Sobre.md) — 1 nó(s) em comum
- [US-90 — o estado da US não envelhece](../../../../Manutencao/diagnostico/status/US-90-estado-que-nao-envelhece/Sobre.md) — 1 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 1 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 1 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 1 nó(s) em comum
- [US-82 — o hook do grafo com `core.hooksPath` (husky) não mente](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-82-hook-do-grafo-com-hookspath/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../US-22-grafo-dentro-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../US-23-repos-aninhados-no-grafo/Sobre.md) — 1 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../US-24-fechar-por-sub-repo/Sobre.md) — 1 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../US-31-use-duplo-perde-escrita/Sobre.md) — 1 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../US-32-graphify-e-ponytail-juntos/Sobre.md) — 1 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../US-34-playwright-front-mobile/Sobre.md) — 1 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
- [US-63 — skill citada nas instruções vem do ECC](../../curadoria/US-63-skill-citada-vem-do-ecc/Sobre.md) — 1 nó(s) em comum
- [US-69 — a matriz chama os agentes do ECC; o que não casa sai](../../curadoria/US-69-ecc-na-matriz/Sobre.md) — 1 nó(s) em comum
- [US-71 — o ponytail sai do obrigatório](../../curadoria/US-71-ponytail-sai-do-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../../organizacao-por-grafo/hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../organizacao-por-grafo/script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 1 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 1 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../../../organizacao-por-grafo/script/US-52-anotada-no-status/Sobre.md) — 1 nó(s) em comum
- [US-73 — estado `pausada` e estado inválido apontado](../../../organizacao-por-grafo/script/US-73-estado-pausada/Sobre.md) — 1 nó(s) em comum
- [US-75 — o *Impacto* do `Sobre.md` com teto](../../../organizacao-por-grafo/script/US-75-impacto-com-teto/Sobre.md) — 1 nó(s) em comum
- [US-76 — aba "Visão do dono" (resumo, em andamento, fila, depende de você)](../../../organizacao-por-grafo/script/US-76-visao-do-dono/Sobre.md) — 1 nó(s) em comum
- [US-77 — "Visão do dono": épicos, filtro e repositórios](../../../organizacao-por-grafo/script/US-77-visao-do-dono-epicos/Sobre.md) — 1 nó(s) em comum
- [US-79 — `--pausar`: pausar uma US sem editar o frontmatter à mão](../../../organizacao-por-grafo/script/US-79-pausar/Sobre.md) — 1 nó(s) em comum
- [US-81 — anotação é US `anotada`, e sai do índice quando vira trabalho](../../../organizacao-por-grafo/script/US-81-anotacao-vira-us-anotada/Sobre.md) — 1 nó(s) em comum
- [US-83 — `--us` aceita o caminho do `Sobre.md`](../../../organizacao-por-grafo/script/US-83-us-aceita-caminho-do-sobre/Sobre.md) — 1 nó(s) em comum
- [US-85 — as anotadas por nome no `--status` do terminal](../../../organizacao-por-grafo/script/US-85-anotadas-no-status-do-terminal/Sobre.md) — 1 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../time/glossario/US-44-glossario-da-equipe/Sobre.md) — 1 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../time/orquestracao/US-45-porta-unica/Sobre.md) — 1 nó(s) em comum
- [US-88 — travas por hook](../../../time/orquestracao/US-88-travas-por-hook/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 1 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 1 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 1 nó(s) em comum
- [US-72 — o GPT na equipe: detectar, matriz e ponte](../../../time/roteamento/US-72-gpt-na-equipe/Sobre.md) — 1 nó(s) em comum
- [US-89 — subir o degrau por check reprovado](../../../time/roteamento/US-89-subir-degrau-por-check/Sobre.md) — 1 nó(s) em comum
- [US-91 — o Gemini na equipe: documentar, medir o par e só então mexer na matriz](../../../time/roteamento/US-91-gemini-na-equipe/Sobre.md) — 1 nó(s) em comum
- [US-92 — Régua escrita de modelo e esforço por atividade, aplicada pelo tl e pelo po (e pelo subagente ao devolver)](../../../time/roteamento/US-92-regua-de-esforco-por-atividade/Sobre.md) — 1 nó(s) em comum

## Rumo
- **31/10/2026** — aberta por pedido do dono para cumprir o item 3 da US-92 com uma US real (a alternativa, uma US inventada, foi recusada). Dos 4 estágios, a régua só muda 1 escolha (o `dev-back` em esforço alto). Resultado e custo entram aqui ao fim.
- **31/10/2026** — **resultado.** `dev-back` em Sonnet · alto (a escolha da régua): `eccAgent()` acrescenta "Devolução" e "Escopo mínimo" ao fim do corpo, cada um só se o texto ainda não o traz; teste 669 → 673; `tl` (Opus · médio): pode fechar, nenhum cenário que quebre; `qa` (Sonnet · baixo): itens 1 a 3 do Pronto conferem, `git diff --check` limpo. **Custo do `dev-back`: ~48,6k tokens, 19 chamadas, ~8,6 min** (leitura do relatório do subagente; dólar não medido). Sem retrabalho.
  - **Desvio do item 1 do Pronto:** o texto dos blocos não é idêntico ao dos agentes locais. Saíram a referência ao `AGENTS.md` e ao `delegacao.md` (o projeto de outra pessoa pode não ter esses arquivos) e a cláusula "ou que a idempotência exige" do Escopo mínimo; o `tl` aceitou o corte das referências e sugeriu devolver a cláusula (genérica): **não feito**, fica como melhoria.
  - **Limites do teste (dito pelo `tl` e pelo `dev-back`):** a segunda rodada prova o guard do `existsSync`, não chama `eccAgent` duas vezes; só o CRLF cobre "já traz o bloco" para o Escopo mínimo; agente do catálogo sem frontmatter sai sem os blocos (como antes) e não tem teste.
  - **`AGENTS.md`, invariante 4:** a exceção "cópia literal do catálogo ECC" foi ajustada para dizer que a cópia recebe ao fim os dois blocos.

## Evidência
Teste: 673 passaram. Régua aplicada e comparada na tabela *Time* acima (1 de 4 escolhas mudou) e fechando o item 3 da [US-92](../../../time/roteamento/US-92-regua-de-esforco-por-atividade/Sobre.md). Commit: `git log --grep "US-96 concluída"`.
