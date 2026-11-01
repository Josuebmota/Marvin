---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-92 — Régua escrita de modelo e esforço por atividade, aplicada pelo tl e pelo po (e pelo subagente ao devolver)

**Por quê:** o `tl` e o `po` escolhem modelo e esforço por julgamento solto, e o dono quer o mesmo resultado pelo menor custo; o effortless (github.com/HeyCubit/effortless) mostra a ideia de decidir esforço pela dificuldade do pedido, mas como plugin com juiz LLM por prompt, o que o Marvin não adota (sem dependência, uma ferramenta só, ganho medido em 4 tarefas).
**Pronto quando:** (1) a régua (sinais da etapa → esforço) mora num lugar só, `delegacao.md`, com `triagem.md` apontando para lá e o `Equipe.md` ressalvando "nunca acima" (fonte e limite da pesquisa registrados no *Rumo*; hipótese até 3–4 US); (2) a regra "etapa mais difícil que o Time previu → devolve a quem chamou, que leva ao `tl`" está no `.md` de cada papel (o subagente não lê o README) e no template do `.claude/agents/README.md` gerado pelo `marvin.mjs`, com marca em `UPDATES` e `npm run test` verde; (3) a régua foi aplicada na triagem de 1 US real, com a escolha da régua, a escolha que o julgamento solto teria feito, o resultado e o custo registrados; se a régua não mudar nenhuma escolha, sai; (4) `tl` leu o diff do `marvin.mjs` e `git diff --check` limpo.

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md)
- [triagem](../../../../../Contexto/Fluxos/delegacao/triagem.md)

## Código tocado
O grafo (atualizado em 31/10 com `graphify update .`) tem nó de documento; o trecho do template do `marvin.mjs` (passo 7) e a tabela `UPDATES` (passo 10) são código de script, sem símbolo de função.
- `.marvin/Contexto/Fluxos/delegacao.md` — seção "Régua de esforço por etapa" (antes de "Regras que não podem quebrar")
- `.marvin/Contexto/Fluxos/delegacao/triagem.md` — Triagem (aponta para a régua)
- `.marvin/Contexto/Equipe.md` — Regra do sênior ("nunca acima" com a ressalva)
- `.claude/agents/{dev-back,qa,scout,tl,po}.md` — bloco "Devolução"
- `.claude/agents/README.md` — bloco "Devolução" (cópia local do template)
- `marvin.mjs` — passo 7 (template do README dos agentes) e passo 10 (`UPDATES`, entrada `desde` da próxima versão)
- `teste.mjs` — verificação do bloco novo e da marca em `UPDATES`

## Time
| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| decidir os critérios da régua | po + tl | Opus · médio | decide o que entra como sinal e o que é especulação; é julgamento de rumo | pendente |
| pesquisar outros repos de roteamento | general-purpose | Sonnet · médio | leitura e síntese de fontes externas, sem editar; já rodando em segundo plano (31/10) | em andamento |
| revisar o rascunho | po + tl | Opus · médio | po cortou o que repete regra existente; tl achou conflito com Equipe.md, passo 5 e o README gerado | feito 31/10 |
| escrever a régua e a devolução nos docs e nos 5 papéis | sessão principal | Sonnet · médio | texto de documentação, sem código | feito 31/10 |
| template do README dos agentes + `UPDATES` + teste | dev-back | Sonnet · médio | toca `marvin.mjs` (template gerado e `UPDATES`): sinal alto pela régua, mas com spec fechada e o `tl` no diff, então mantém o degrau médio e o motivo fica aqui | feito 31/10: +15 em `marvin.mjs`, +14 em `teste.mjs`, 669 verificações |
| ler o diff do `marvin.mjs` | tl | Opus · médio | mudança em `UPDATES` pede o `tl` por risco (AGENTS.md) | feito 31/10: pode fechar, sem conflito com invariante |
| conferir o texto | qa | Sonnet · baixo | `git diff --check` e coerência entre os arquivos; não edita | feito 31/10: 669 passaram, links ok |
| aplicar a régua em 1 US real e medir | tl + sessão principal | Opus · médio | critério (3) do Pronto: escolha da régua × escolha do julgamento solto, resultado e custo | pendente (candidata: a triagem da próxima US) |
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
- **31/10/2026** — revisão do rascunho pelo `po` e pelo `tl` (Opus · médio): cortes do passo 3, 5, 6, 7 (repetem `Equipe.md` e `delegacao.md`), passo 4 restrito a baixar a partida, régua num lugar só, sinais "alto" com a lista de invariantes. Conflitos do `tl`: "nunca acima" do `Equipe.md`, passo 5 do fluxo, rótulos ≠ valores de `effort`, e a regra de devolução não funciona no `.claude/agents/README.md` (o subagente não o lê; o README é gerado por `marvin.mjs`). **Decisão do dono, 31/10:** a devolução entra também no template, o que tira a US do "sem código" (marca em `UPDATES`, `tl` no diff).
- **31/10/2026** — escrita feita: régua em `delegacao.md`, "nunca acima" ressalvado no `Equipe.md`, apontamento no `triagem.md`, bloco "Devolução" nos 5 papéis e no README local e gerado. `npm run test`: 669 passaram; `tl` e `qa` sem conflito. Itens (1), (2) e (4) do Pronto cumpridos; **(3) pendente**: aplicar em 1 US real. Antes do release, conferir se a 3.4.4 já saiu (a entrada em `UPDATES` usa `desde: '3.4.4'`, como a da US-90). Âncora: `triagem.md` e `Equipe.md` linkam o arquivo, não a seção.
- **31/10/2026** — **item 3 (aplicar a régua), dado retrospectivo, n=1, NÃO conta como cumprido** (a régua foi escrita antes e aplicada depois à revisão do par 2 da US-91; o item pede aplicação *na triagem*, antes de rodar). Aplicada ao `qa` que revisou o `96ef126` (o diff tocava `UPDATES`, sinal **alto**): régua → um degrau acima da partida (Sonnet · médio); julgamento solto, o que foi feito → Sonnet · baixo, conforme a tabela do `Equipe.md`. O `qa` em baixo achou 0 bloqueios e 2 menores reais em ~24 s, e **não** achou o furo do `tdd-guide` (quem achou foi o `tl`, Opus · médio). Não dá para dizer se médio acharia: a régua teria mudado a escolha, e o resultado não a prova nem a refuta. Pendente: aplicar na triagem da próxima US antes de executar, registrando as duas escolhas.
- **31/10/2026** — achado novo (par 2 da US-91, pelo `tl`): os agentes do ECC que o script copia (`tdd-guide` e os que vierem) saem sem o bloco de Devolução, e o README gerado promete "TODO agente que executa". `tdd-guide.md` local foi corrigido à mão; para o resto, decidir se o script anexa o bloco na cópia do ECC (mexe no `marvin.mjs`, em invariante 4) ou se o README gerado passa a dizer que a cópia do ECC precisa receber o bloco. Fica para uma US própria.
- **31/10/2026** — **Jev descartado (dono): não quer pagar** (US$ 0,042/M tokens de entrada, saída grátis, acesso antecipado por lista de espera). A classificação do sinal segue com o `tl` e o `po`; nenhum classificador automático (nem Haiku) é testado agora. Se um dia voltar: regra determinística pelo *Código tocado* e pelo grafo primeiro, Haiku para o resíduo, e a pergunta é se concorda com o `tl`/`po` em ~20 etapas já registradas.
- **31/10/2026** — **item 3 cumprido pela [US-96](../../../ferramentas-opcionais/adaptadores/US-96-ecc-agentes-com-devolucao-e-escopo/Sobre.md)**, uma US real (a alternativa, uma US inventada, foi recusada). A régua foi aplicada na triagem *antes* de executar e a tabela traz as duas escolhas lado a lado: **mudou 1 de 4** (o `dev-back` em Sonnet · alto, por escrever no disco de alguém; o julgamento solto teria dado médio); as outras 3 saíram iguais, então a régua não é texto morto. Resultado: 673 de 673, `tl` sem bloqueio, `qa` confere, sem retrabalho; custo do `dev-back` ~48,6k tokens, 19 chamadas, ~8,6 min. **O que isso não prova:** um braço só, sem controle em médio, então não se sabe se alto pagou ou foi só mais caro; n=1. A régua **continua hipótese** até 3–4 US. Dado de calibragem: "decide rumo" lido literal faz o `tl` e o `po` saírem sempre em alto; na prática foi lido como decisão nova, não rotina, e a régua precisa dizer isso se for reaplicada.
- **31/10/2026** — **US-92 `concluida`** com os 4 itens do Pronto cumpridos (1 e 2 em `96ef126` e `f13f475`; 3 pela US-96; 4 nos testes). Pendências que não bloqueiam: devolver a cláusula "ou que a idempotência exige" ao Escopo mínimo do ECC; marca em `UPDATES` para agente do ECC já copiado (reabrir com caso real); `soCom`/âncora dos links para a seção da régua.
- **31/10/2026** — achado em aberto: `dev-back.md` e `.claude/agents/README.md` ainda dizem que o ponytail "não paga e não é carregado em nenhum papel", mas `ferramentas.md` agora o mantém `sim` até a US-93. Acertar quando a US-93 decidir.
- **31/10/2026** — pendente de conferir: se o effortless age nos subagentes com `model`/`effort` explícitos e se o Handoff/Compact dele colidem com `/fechar` e `/retomar` (não bloqueia a régua).
- **31/10/2026** — fora desta US, achado na conversa: `AGENTS.md` (invariante 4, 16/10) diz que ponytail é obrigatório, mas `ferramentas.md` o tem como `não` desde a US-68 (+22%, n=1). Decisão do dono pendente.

## Evidência
Régua: `delegacao.md` (seção "Régua de esforço por etapa"); devolução nos papéis e no template do README de agentes com marca em `UPDATES`; teste 673 passaram. Aplicação real: [US-96](../../../ferramentas-opcionais/adaptadores/US-96-ecc-agentes-com-devolucao-e-escopo/Sobre.md). Commits: `96ef126`, `f13f475` e o que fecha estas duas (`git log --grep "US-96 concluída"`).
