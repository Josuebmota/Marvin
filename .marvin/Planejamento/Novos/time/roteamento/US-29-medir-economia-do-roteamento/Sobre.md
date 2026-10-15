---
tipo: us
estado: ativa
pai: ../Sobre.md
name: US-29-medir-economia-do-roteamento
description: "A política da US-19 está em uso sem número na mão. Mede custo por tarefa aprovada em 3–4 US reais comparáveis e opera o glossário quando uma atividade pedir outro fornecedor ou esbarrar em capacidade ausente."
---
# US-29 — medir a economia do roteamento por atividade

**Por quê:** a [US-19](../US-19-papel-modelo-esforco/Sobre.md) fechou como *pronta para uso*: a política de escolher papel, modelo e esforço pela atividade já vale e foi aplicada na US-24. Mas a alegação que motivou a política, reduzir custo mantendo o resultado, **não tem nenhuma amostra**. Sem medição, não se sabe se a política economizou ou só complicou o processo. Esta US carrega o que a US-19 deixou aberto (critérios 4, 5 e 7 dela), sem bloquear o uso da política.

**Pronto quando:**
1. **Linha de base medida** em 3 ou 4 US reais do Marvin, ou de projetos que o Josué autorizar explicitamente para este piloto. Cada US real roda uma vez só, então o par vem de **alternância declarada antes de começar**: a US real N, de uma classe, roda na configuração anterior, e a N+1, da mesma classe e no mesmo projeto, roda pela política. Isso fica registrado no *Time* antes de abrir a sessão. Linha de base histórica não vale, porque o protocolo já a declarou inválida. Conta a sessão principal, as delegações, as verificações, o retrabalho e, em pergunta estrutural, o uso do Graphify. A unidade é o **custo por tarefa aprovada**, não por chamada. Custo estimado, cobrança efetiva e consumo de assinatura ficam separados. O detalhe completo, com idade e cobertura do grafo, `cost-report` e o aviso de que tokens isolados não provam economia entre fornecedores, está no [critério 4 da US-19](../US-19-papel-modelo-esforco/Sobre.md#critérios-de-conclusão).
2. **Economia declarada só para o que foi medido.** Com os números, o Rumo diz se a política economizou nas tarefas e contextos medidos. Estender a economia para outro projeto continua hipótese. Só então se decide se a regra vira template (o último item aberto da US-19).
3. **Glossário operado numa atividade real** que peça outro fornecedor ou esbarre em capacidade ausente: entrada com fonte, data e modalidade; distinção entre documentado, acesso e testado; resultado e limitações; substituição por etapa ou lacuna declarada. Sem chamada paga para fabricar evidência. **"Não ocorreu no período" é resultado válido**, registrado como lacuna.
4. **Time e esforço declarados antes de rodar** (itens 3 e 5 dos requisitos de 14/10, decisão do dono no refino): cada etapa delegada nas amostras tem papel, modelo e **esforço** registrados no *Time* antes de começar, começando pelo menor esforço adequado; o par medido diz se o menor esforço manteve a aprovação. O `delegacao.md` passa a dizer que o esforço vai explícito no prompt de delegação (a ferramenta `Agent` só aceita `effort` quando o dono ou o `CLAUDE.md` pede — a autorização precisa estar escrita). A **matriz gerada** em cada projeto (seção-esqueleto no `IA.md` gerado, sem nome de modelo) só entra com o resultado desta US.
5. **Saída:** se até **31/12/2026**, ou em 6 US reais, não houver par elegível, a US fecha como **"não mensurável com o que temos"**, com a lacuna registrada. Ela não fica ativa para sempre na nota.

**Não entra:** abrir US fictícia ou repetir trabalho só para gerar número (o protocolo proíbe); router como peça de software; mudar a política da US-19 antes de haver número.

**Como medir:** o [Protocolo de medição da US-19](../US-19-papel-modelo-esforco/Sobre.md#protocolo-de-medição--pronto-para-uso-comparação-pendente) vale como está. A fonte do agregado Claude é o `marvin --status`. Uma sessão que mistura atividades sem atribuição confiável não vira amostra. **Lição da US-24 (10/10):** a sessão misturou triagem, implementação, release e consulta, e por isso não serve. Para virar amostra, a tarefa precisa de sessão própria ou de corte de turnos registrado antes de começar.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md): a política medida.

## Código tocado
_(nenhum: medição e registro na base; o `--status` já existe)_

## Time
Triagem 10/10/2026 (sessão principal com o dono; decisão do dono: fatiar a US-19 pela opção (b)).
- `po`: escolhe quais US reais contam como amostra e barra a amostra fabricada.
- `tl`: confere se cada par é comparável e se os checks são os mesmos.
- `scout`: recuperação delimitada nos logs e no `--status`, quando a atribuição estiver clara.

Modelo e esforço por etapa ficam para quando a primeira amostra for escolhida, no formato por etapa da US-19.

## Skills
Nenhuma ainda. Medir a mesma coisa pela segunda vez é o gatilho para uma skill de medição.

## Rumo
- **10/10/2026** — aberta ao fatiar a US-19 (decisão do Josué, opção (b)): os critérios 4 e 5 (economia) e 7 (glossário em atividade real) vieram para cá. Nenhuma amostra elegível até agora. Revisão do `po` aprovada com ressalva, ressalvas aplicadas: par por alternância declarada antes (sem linha de base histórica), saída em 31/12/2026 ou 6 US, "não ocorreu" valendo para o glossário. Próximo: na próxima US real, declarar a configuração (anterior ou política), fixar contexto, checks e corte de turnos **antes** de começar.
- **14/10/2026** — refino dos requisitos de 14/10: itens 3 e 5 entram aqui (critério 4), por decisão do dono (parecer do `po`; o `tl` propunha US própria). A [US-37](../US-37-condutor-autonomo-sessoes-curtas/Sobre.md) é o veículo: cada rodada do `/continuar` numa sessão curta é uma amostra. "Mostrar quem será chamado" vai para a coluna Time do painel ([US-36](../../../organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md)).
- **15/10/2026** — o refino da issue #4 achou que o `--status` não conta os subagentes. O `computeSpend` lê só os `.jsonl` do topo da pasta do projeto, e cada delegação fica em `<sessão>/subagents/`. Por isso os custos medidos até aqui, inclusive os das rodadas da US-36, estão subestimados. A [US-41](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) corrige, e nenhuma amostra conta antes dela.
- **15/10/2026** — recebeu duas medições de outras US, por decisão do dono:
  - Grep × grafo em "onde está X" ([US-43](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-43-grafo-rota-de-busca/Sobre.md)).
  - Proposta da 1ª rodada × agentes de fato usados nas 3 primeiras US de um projeto real autorizado ([US-39](../US-39-time-na-primeira-rodada/Sobre.md), item 3).
- **15/10/2026** — recebe a ex-US-46 (tabela de partida), por proposta do `po` na revisão da arquitetura [equipe-barata](../../../../../Contexto/Arquitetura/equipe-barata.md). **Saída nova:** a tabela atividade → papel, modelo e esforço de partida, cada linha com o par medido que a sustenta. Ela mora no `Equipe.md` (coluna) ou no `IA.md`, nunca num quarto lugar. Os reels do dono entram aqui como referência. Passa a ser a **porta** da sequência: 2 amostras (US-49 e US-44 contam) antes da US-45.
- **15/10/2026** — o dono fixou o ponto de partida no Claude (Opus: `tl`/`po`; Sonnet: `dev-*`/`qa`/`design`/`dba`; Haiku: os mesmos em tarefa simples, e o `scout`), com a regra do sênior. Esta US deixa de **criar** a tabela: passa a **medir** se ela entrega o mesmo resultado mais barato, e a corrigi-la com o par medido. Referência do dono: o reel de @donimas (escada de $5,10 a $0,32; simulação, não benchmark).
- **15/10/2026** — 5 US da Fase 1+ executadas num chat só, por ordem do dono, com configuração declarada antes de rodar: **anterior** (tudo na sessão Opus) na US-49 e na US-51 (doc); **política** (`dev-back`/`qa` Sonnet, `tl` Opus) na US-44, US-52 e US-50 (código). **Limite da amostra:** sem sessão própria nem corte de turnos registrado por US, o `--status` dá o custo do chat inteiro, não por US — a regra de custo 6 ("executar cada uma em rodada própria") foi quebrada por decisão do dono. Sinal qualitativo: o `tl` em Opus achou um bloqueio real na US-50 (hook nunca escrito) que o `dev-back` em Sonnet e o teste dele não pegaram — a verificação no degrau de cima pagou ali.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
