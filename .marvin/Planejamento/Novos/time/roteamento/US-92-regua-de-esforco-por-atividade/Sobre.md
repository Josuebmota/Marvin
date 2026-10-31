---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-92 — Régua escrita de modelo e esforço por atividade, aplicada pelo tl e pelo po (e pelo subagente ao devolver)

**Por quê:** o `tl` e o `po` escolhem modelo e esforço por julgamento solto, e o dono quer o mesmo resultado pelo menor custo; o effortless (github.com/HeyCubit/effortless) mostra a ideia de decidir esforço pela dificuldade do pedido, mas como plugin com juiz LLM por prompt, o que o Marvin não adota (sem dependência, uma ferramenta só, ganho medido em 4 tarefas).
**Pronto quando:** (1) a régua (sinais da etapa → esforço mínimo) está escrita no passo 2 de `delegacao.md` e em `delegacao/triagem.md`, com critérios validados pela pesquisa de outros repos (fonte e limite registrados no *Rumo*); (2) a regra "etapa mais difícil que o Time previu → devolve e o `tl` sobe pelo passo 5" está nos agentes; (3) a régua foi aplicada na triagem de 1 US real, com esforço escolhido, motivo, resultado e custo registrados; (4) `npm run test` verde e `git diff --check` limpo.

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md)
- [triagem](../../../../../Contexto/Fluxos/delegacao/triagem.md)

## Código tocado
Só documentação; o grafo (atualizado em 31/10 com `graphify update .`) tem nó de documento, não de função.
- `.marvin/Contexto/Fluxos/delegacao.md` — passo 2 (Escolher a menor configuração adequada) e passo 5 (Entender a reprovação)
- `.marvin/Contexto/Fluxos/delegacao/triagem.md` — Triagem
- `.marvin/Contexto/Equipe.md` — Regra do sênior
- `.claude/agents/README.md` — regra de devolução do subagente

## Time
| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| decidir os critérios da régua | po + tl | Opus · médio | decide o que entra como sinal e o que é especulação; é julgamento de rumo | pendente |
| pesquisar outros repos de roteamento | general-purpose | Sonnet · médio | leitura e síntese de fontes externas, sem editar; já rodando em segundo plano (31/10) | em andamento |
| escrever a régua e a regra de devolução | sessão principal | Sonnet · médio | texto em 4 arquivos de documentação; sem código nem invariante | pendente |
| conferir o texto | qa | Sonnet · baixo | `git diff --check` e coerência entre os 4 arquivos; não edita | pendente |
| aplicar a régua em 1 US real e medir | tl + sessão principal | Opus · médio | o `tl` lê a decisão de esforço contra o resultado; custo medido como na US-68 | pendente |

Grafo (estrutura): `triagem.md` é lido por `delegacao.md`, `mapa-capacidades.md`, `IA.md` e a US-91; `delegacao.md` é referenciado por `AGENTS.md`, `CLAUDE.md`, `/continuar`, `/refinar`, `agents/README.md` e os filhos de `delegacao/`; `Equipe.md` pela US-91, `Planejamento/README.md` e `controles.md`. Sem nó de função: nenhum código do `marvin.mjs` muda, então não entra `UPDATES` nem `--release`.

## Skills
Nenhuma. A régua é texto lido na triagem; vira skill só se se repetir na segunda execução.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 4 nó(s) de código em 1 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-27 — atualizar a base do Marvin com o que o próprio Marvin gera](../../../../Manutencao/diagnostico/atualizacoes/US-27-atualizar-a-base-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-84 — quebrar o `delegacao.md` e ligar os órfãos](../../../../Manutencao/publicacao/contexto-fixo/US-84-quebrar-delegacao-e-ligar-orfaos/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-28 — mapa de personas, skills e modelos (Claude e ChatGPT/Codex) e arranjos por disponibilidade](../US-28-modelos-por-papel-claude-e-chatgpt/Sobre.md) — 1 nó(s) em comum

## Rumo
- **31/10/2026** — aberta a partir do link do dono (effortless). Decisões: sem plugin, sem juiz LLM por prompt, sem dependência; o que se traz é a metodologia (sinais da etapa → esforço) como critério escrito do `tl` e do `po`; o subagente não muda o próprio esforço (vem fixado na chamada), só devolve a etapa mais difícil que o previsto e o `tl` sobe pelo passo 5.
- **31/10/2026** — pesquisa de 9 fontes (relato do subagente, não conferido por mim fonte a fonte): RouteLLM, alexei-led/claude-router, Ares (arXiv 2603.07915), vLLM Semantic Router, AutoMix, RouterBench, docs da Anthropic sobre esforço, Aider architect/editor (0xrdan/claude-router não pôde ser lido). **Limite:** nenhuma mede economia em código agêntico com modelos Claude; as medições reais são de chat, QA e agentes web, então a transferência para o Marvin é inferência. Sinais que se repetem: (1) tipo e horizonte da tarefa; (2) papel da etapa, pensar × executar; (3) ponto crítico do fluxo; (4) falha ou dúvida como gatilho de subida; (5) descer só com qualidade medida; (6) custo de trocar de modelo no meio (cache); (7) modelo e esforço como eixos separados. Candidatos a regra escrita: tabela por atividade com padrão barato; subida por evidência (teste vermelho, diff recusado, risco listado); esforço por etapa e não por US; descer só comparando uma saída real; trocar na fronteira de etapa; registrar modelo, esforço e resultado na US.
- **31/10/2026** — pendente de conferir: se o effortless age nos subagentes com `model`/`effort` explícitos e se o Handoff/Compact dele colidem com `/fechar` e `/retomar` (não bloqueia a régua).
- **31/10/2026** — fora desta US, achado na conversa: `AGENTS.md` (invariante 4, 16/10) diz que ponytail é obrigatório, mas `ferramentas.md` o tem como `não` desde a US-68 (+22%, n=1). Decisão do dono pendente.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
