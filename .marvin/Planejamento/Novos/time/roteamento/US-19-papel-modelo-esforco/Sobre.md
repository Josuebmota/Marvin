---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis

**Por quê:** hoje o modelo é fixo por papel e o esforço não é decidido por ninguém, então
tarefa fácil paga o preço de tarefa difícil. Papel diz **o que** fazer; modelo e esforço dizem
**quanto de cavalo** gastar, e isso varia por tarefa, não por papel. Exemplo do Josué: "a atividade
X precisa de um `po` em sonnet, esforço baixo".

Referência: reel do @donimas (*AI Levels*, ep. 01), visto em 05/10/2026, só pelos frames, sem
áudio. Quatro níveis sobre as mesmas 6 tarefas: *Junior* (tudo no modelo topo, esforço máximo),
*Middle* (modelo à mão, esforço sempre alto), *Senior* (mais barato primeiro, verifica, sobe se
falhar), *GOAT* (router escolhe modelo **e** esforço, verifica pelo risco, feedback). Custo por
tarefa resolvida: $5,10 → $0,32. ⚠️ É **simulação** (*"simulated workload · real Claude prices"*),
não medição. Na análise inicial de 05/10, o Marvin estava no nível *Middle*.

## Portabilidade — requisito confirmado em 05/10/2026

Josué quer que a escolha por tarefa se adeque às LLMs mais conhecidas. A política é
comum; modelo e esforço são escolhidos entre as capacidades disponíveis na ferramenta
usada. Uma limitação do Claude Code não vira regra para todos os fornecedores.

**Cobertura inicialmente proposta:** nove famílias — OpenAI/GPT, Anthropic/Claude,
Google/Gemini, DeepSeek, Qwen, Llama, Mistral, Grok e MiniMax. O foco de estudo atual
foi delimitado em 06/10 abaixo. Claude Code e Codex são as ferramentas iniciais do
piloto; isso não significa que essas combinações já foram testadas.

**Registro mínimo na US:** papel, fornecedor e modelo concreto, ferramenta usada e
esforço solicitado/configurado. Registrar a configuração aplicada quando ela puder
ser conferida; caso contrário, marcar **não confirmado**. **Herdado** deve indicar a
origem; **não aplicável** vale quando o modelo não oferece o controle.

Os nomes de esforço não provam equivalência entre modelos. Conferir o parâmetro,
os valores aceitos e o alcance (chamada, agente ou sessão) na documentação oficial
da combinação escolhida. Suporte na API não prova suporte no app ou CLI. Se o controle
necessário estiver indisponível, registrar a limitação e propor uma alternativa,
sem trocar fornecedor, modelo ou esforço em silêncio.

## Escopo ampliado — confirmado em 06/10/2026

A atividade determina **domínio → papéis/personas → skills → capacidades → modelo,
ferramenta e esforço disponíveis**, por etapa. Escolha justificada por qualidade
exigida, risco e custo completo, sem preferência fixa por marca. Instalar um plugin
não torna seu fornecedor o revisor obrigatório. O objetivo é gastar menos mantendo
o resultado exigido; isso precisa de medição, não é garantia de equivalência.

Entra um **glossário vivo de capacidades**, alimentado sob demanda por pesquisa
oficial datada e resultados de uso. Distinguir suporte documentado, acesso efetivo
e execução validada; registrar limitações e evidência de cada atividade. O piloto
reutiliza *Pesquisa de capacidades* abaixo antes de validar uma organização
reutilizável. Não pesquisar todas as marcas nem carregar todo o catálogo em cada
sessão. Acessos e quotas são do ambiente atual; nenhum segredo ou dado de conta
entra na base pública.

Exemplo confirmado: produção de vídeo pode separar roteiro em Claude e geração
em um modelo específico de vídeo da MiniMax, se os acessos e integrações permitirem.
É exemplo de decomposição, não ranking ou execução aprovada. Só Claude não prova
capacidade de gerar o arquivo de vídeo; acesso ao modelo de texto da MiniMax também
não prova acesso ao modelo de vídeo. Pesquisa de 06/10:
[saída textual do Claude](https://platform.claude.com/docs/en/models/overview) e
[geração de vídeo MiniMax](https://platform.minimax.io/docs/guides/video-generation).

Marvin guarda conhecimento e orienta a escolha; a sessão principal aplica a política;
plugins/gateways executam chamadas. Indisponibilidade refaz a seleção da etapa,
preservando contexto e progresso, sem substituir uma capacidade ausente por outra.
Troca automática quando a própria sessão principal perde quota exige executor
externo e continua fora da implementação deste piloto. O **handoff assistido** — a
pessoa abre outra sessão e o novo modelo refaz o de-para de modelo/ferramenta/esforço
mantendo papel e capacidade — é a [US-20](../US-20-handoff-de-executor-por-cota/Sobre.md).

### Divisão declarada pelo Josué — 07/10/2026

Declaração de uso, **não medida** e não ranking: Claude e Codex em conjunto para
planejar, arquitetar e revisar; MiniMax para vídeo, **se** o acesso ao modelo de vídeo
for confirmado; as demais opções entram conforme o uso. Quem é a sessão principal é
quem tem cota no momento, e o outro vira delegado. Cada linha ganha evidência (tarefa,
configuração, check, resultado) quando for usada numa atividade real, sem apagar a
declaração original.

### Foco de estudo e disponibilidade — confirmado em 06/10/2026

Josué define quais opções entram no estudo, ampliando a lista por conversa:
**Claude, Codex/OpenAI, MiniMax, DeepSeek, Gemini, Grok e Jev — sete opções**.
Não é contagem de modelos concretos ou integrações prontas. Qwen, Llama e Mistral
permanecem como referências anteriores, fora da prioridade atual. Estudar variantes
e modalidades dessas sete opções conforme as atividades, sem cadastrar toda versão
antecipadamente. Crescimento depende de inclusão confirmada, pesquisa e evidência;
uso não autoriza expandir a lista de fornecedores sozinho.

O usuário pode ter uma, algumas ou todas. Uma opção capaz pode assumir vários
papéis; ter todas não exige chamar todas. O conjunto estudado é comum, mas só as
capacidades acessíveis e executáveis no ambiente entram na seleção de uma etapa.

**Configuração inicial implementada por autorização em 06/10:** perguntar qual ferramenta
executa a sessão (Claude Code, Codex, OpenCode ou outra), quais dessas IAs o usuário
tem disponíveis e se já estão configuradas **nessa ferramenta**. Distinguir assinatura
usada pelo cliente oficial, API e execução local; conferir modelo/modalidade e orçamento
antes de uma chamada. Declarado, configurado e testado são estados distintos; login
detectado não confirma quota nem execução. Não importar credenciais de assinatura
para um gateway como se fossem chaves de API.

Fora do Claude Code, manter a política em `AGENTS.md` e a base `.marvin/`, usando o
adaptador da ferramenta escolhida. Codex e OpenCode já leem `AGENTS.md`; `--tools`
seleciona adaptadores, não conecta fornecedores. Conferir a integração concreta
para delegar a outro modelo: ferramenta/plugin/API disponível, ou acesso declarado
sem execução possível. Nesse último caso, orientar a configuração e continuar com
as capacidades prontas. Uma skill instalada ensina um procedimento; não prova acesso
à API nem transforma qualquer modelo em subagente nativo.

Reutilizado o padrão existente de perguntar e registrar uma vez, sem repetir em toda
sessão nem sobrescrever escolhas. Inventário em `<vault>/.local/disponibilidade.json`,
com ignore específico. Sem TTY/sem perguntas, ausência fica não informada; flags
`--executor` e `--ai=id:acesso:configurado` declaram opções, `--ai=none` declara nenhuma.
Dry-run não pergunta nem grava; argumentos inválidos falham antes de escrever.
Escrita por `fsw`; segredos ficam na configuração local da ferramenta, fora da base pública.

## Critérios de conclusão

**Pronto quando:** _(critérios do piloto; medição e publicação npm ainda pendentes)_
1. Cada US registra a combinação por etapa em *Time* e *Skills*, decidida na abertura/refino pelos gatilhos
   existentes (`/us` e Planejamento/README; `/refinar` onde já existir):
   etapa, domínio, papel, capacidade, modelo e esforço, com o fornecedor, a ferramenta,
   o motivo da escolha e as skills identificados conforme
   o registro acima. Exemplo de intenção no Claude: `` `po` · sonnet · baixo ``;
   a intenção não é evidência de que o controle foi aplicado.
2. Uma regra escrita de **verificação pelo risco**: código, escrita pelo script ou
   invariante → `npm run test` + `tl` lendo diff; documentação simples →
   `git diff --check` + revisão de conteúdo, conforme o fluxo de delegação.
3. Uma regra escrita de **subir quando falha por capacidade**: entender a reprovação;
   corrigir contexto/requisito inválido; capacidade ainda insuficiente → refaz um
   degrau acima (modelo ou esforço suportado), e o **Rumo** registra origem, destino,
   motivo e resultado da verificação. No topo disponível, manter pendente e escalar
   ao humano. Esse é o feedback.
4. Uma **linha de base medida** antes e depois, em 3 ou 4 US deste repo, usando os dados
   disponíveis na ferramenta (`cost-report` onde houver métricas compatíveis).
   Contar sessão principal, delegações, verificações e retrabalho; custo por tarefa
   aprovada, não só por chamada. Distinguir custo estimado de cobrança efetiva e
   consumo de assinatura; tokens isolados não provam economia entre fornecedores.
   Sem a medição, não se sabe se chegou ao GOAT ou só ficou mais complicado.
5. Só com número na mão a política é considerada validada para economia em outros
   projetos. A autorização de 06/10 antecipou onboarding, fontes e orientação portátil
   nos templates, sem configurar modelos, executar integrações ou prometer economia.
6. A regra pode ser aplicada com diferentes fornecedores, mantendo as mesmas
   verificações. Os controles usados no piloto têm fonte oficial e configuração
   conferida ou limitação explícita. Demais combinações são verificadas sob demanda.
7. O glossário é usado em atividades reais: entradas com fonte/data e modalidade,
   distinção entre documentado/acesso/testado, resultado e limitações. A descoberta
   de acesso/modelos e os controles de esforço são conferidos na integração concreta;
   catálogo textual não comprova execução. Cobrir decomposição de atividade e cenário
   de capacidade ausente, sem chamadas pagas para fabricar evidência.
8. Conferir no onboarding autorizado os cenários
   de uma opção, várias/todas e executor diferente de Claude Code. Perguntas e registro
   distinguem acesso de integração executável; sem configuração ou capacidade, a
   limitação é explícita. Conferir também repetição, execução sem perguntas e dry-run.

**Não entra:** router automático como peça de software. Aqui o "router" é a sessão principal
seguindo uma regra escrita. Peça nova para manter, sem ganho medido, é exatamente o que o `po`
barra.
Não entram rankings permanentes de marcas/preços, mapas antecipados para todos os
fornecedores, variantes duplicadas de papel nem chamadas pagas fora do orçamento
autorizado. A exclusão anterior de qualquer catálogo foi substituída em 06/10 pelo
glossário sob demanda descrito acima. Não instalar gateway nem ativar hooks como
efeito desta regra.

## Decisões do piloto — 05/10/2026
- **Ferramentas:** Claude Code e Codex. A execução desta sessão foi no Codex; a
  configuração Claude é documentada, mas ainda não foi comparada no piloto.
- **Esforço por tarefa é executável nessa combinação?** No Claude Code, a documentação
  confirma `effort` no frontmatter e `model` por chamada; não documenta override de
  esforço equivalente no Agent. Usar herança quando adequada ao risco, registrando
  origem e nível; se a tarefa exigir outro nível, registrar o limite antes de executar.
  Codex tem seus próprios controles de spawn e precedência, descritos abaixo.
  Não inventar convenção (invariante 3).
- **Modelo da sessão principal:** manter o escolhido pelo usuário até haver medição
  comparável. A política não muda sua preferência nem prova economia por si só.
- **Fable entra na escada Claude?** O alias é documentado. Uso como escalada excepcional
  fica reservado à escalada justificada e com acesso disponível; não é degrau
  obrigatório nem autoriza uso automático de créditos.
- **Como obter a linha de base?** O comando `cost-report` existe, mas os arquivos de
  métricas esperados estavam ausentes. As transcrições locais existem: reutilizar
  a medição Claude já oferecida pelo `marvin --status` (US-08), e os eventos de uso
  do Codex quando completos. Falta atribuição antes/depois por tarefa, não falta de
  qualquer dado. Não criar outro coletor para contornar uma comparação inexistente.

## Pesquisa de capacidades — 05/10/2026

Consulta de documentação, sem chamadas de inferência; não é validação de execução:

- [OpenAI API](https://developers.openai.com/api/docs/guides/reasoning):
  `reasoning.effort`, com valores dependentes do modelo.
  [Codex](https://learn.chatgpt.com/docs/config-file/config-reference):
  `model_reasoning_effort`, com níveis dependentes do modelo e cliente.
  [Subagentes](https://learn.chatgpt.com/docs/agent-configuration/subagents):
  modelo/esforço no spawn; configurações do agente podem prevalecer. Nesta sessão,
  spawn com histórico completo herda e não permite override nessa forma.
- [Claude Code](https://code.claude.com/docs/en/sub-agents): `effort` no frontmatter,
  herdado da sessão quando omitido, e `model` por chamada.
  [Modelos e esforço](https://code.claude.com/docs/en/model-config): Fable é um alias
  documentado; Haiku não aparece entre os modelos com controle de esforço.
- [Gemini API](https://ai.google.dev/gemini-api/docs/generate-content/thinking):
  `thinkingLevel` ou `thinkingBudget`, conforme a família do modelo.
- [DeepSeek API](https://api-docs.deepseek.com/guides/thinking_mode/): controles de
  thinking e esforço; há valores aceitos que são remapeados para outro nível.
  Reforça a necessidade de distinguir solicitado de aplicado.

- [Qwen Code](https://qwenlm.github.io/qwen-code-docs/en/users/configuration/model-providers/):
  mapeamento de esforço depende do provedor e da família; em algumas combinações,
  o nível vira apenas thinking ligado. Não generalizar a tradução.
- [Mistral API](https://docs.mistral.ai/studio/conversations/reasoning) e
  [Grok API](https://docs.x.ai/developers/model-capabilities/text/reasoning):
  `reasoning_effort` nos modelos documentados, com valores e restrições próprios.
- **Llama:** modelo e runtime não escolhidos; controle de esforço **não confirmado**.
  Conferir o runtime efetivo quando entrar no piloto, sem presumir parâmetro universal.

Todas as famílias precisam de conferência na combinação realmente usada. Essas
referências datadas não são um catálogo mantido de modelos ou prova de execução.

### Jev / TypeSafe AI — pesquisa de 06/10/2026

- [Apresentação oficial](https://typesafe.ai/blog/introducing-system-one-models-and-jev):
  modelo de decisões estruturadas para classificar, pontuar e escolher entre opções,
  com probabilidades/confiança; não gera texto livre. Candidato a triagem de atividade
  ou escolha entre opções elegíveis é uma hipótese do piloto, não superioridade medida
  nem componente obrigatório. Claude/Codex ou outro modelo generativo pode executar
  a etapa de escrita.
- [Skill oficial](https://docs.typesafe.ai/agent-skill): há plugin para Claude Code e
  instalação de skill para Codex/outros ambientes. Ensina a API; execução requer acesso
  e integração próprios. Nenhuma instalação, credencial ou chamada foi realizada.
- [Limitações de jev-1.13](https://docs.typesafe.ai/model-jaggedness/jev-1.13), revisadas
  pelo fornecedor em 02/10: pode decidir errado e é limitado em geração, aritmética,
  comparação de datas e raciocínio com várias etapas. Saída conforme o esquema não
  garante decisão correta. Manter cálculos e limites exatos em código.

Suporte documentado; acesso e execução neste piloto **não confirmados**. Não tratar
Jev como endpoint de chat intercambiável nem como gerador de código ou vídeo.

### FreeLLMAPI — gateway de failover por cota — visto em 07/10/2026

Executor/gateway, não capacidade de modelo. Seguimento na
[US-20](../US-20-handoff-de-executor-por-cota/Sobre.md).

- **Fonte:** reel do @99hud (Hudson Brendon), via análise automática do vídeo no vidIQ.
  **Não é documentação oficial**; o repositório não foi consultado.
- **O que o reel afirma, não verificado:** projeto open-source de um autor no GitHub,
  34 provedores, 635 modelos e 7,4 bilhões de tokens grátis por mês; liga o Claude Code
  a modelos gratuitos com um comando; ao bater o limite (erro 429) troca para o próximo
  modelo e deixa um resumo (feito, falta fazer, arquivos) para o novo continuar.
- **Fonte oficial, consultada em 07/10/2026** (resumo de página, não leitura integral):
  [repositório](https://github.com/tashfeenahmed/freellmapi) descreve roteador **local**
  com um endpoint compatível com OpenAI, 34 provedores gratuitos, seis estratégias de
  roteamento, failover com espera e rotação de chaves, provedor customizado para
  endpoints compatíveis, licença MIT e aviso de "uso pessoal/experimental".
  Confirma os números do reel. **Não confirmado:** como o comando de setup para Claude
  Code resolve o formato de API.
- **Limite do lado do Claude Code**, [documentação oficial](https://code.claude.com/docs/en/llm-gateway):
  a Anthropic não endossa gateways de terceiros e **não suporta rotear o Claude Code
  para modelos não-Claude por gateway nenhum**. Com credencial de gateway ativa, a
  cobrança é por token e a assinatura não se aplica.
- **Estado:** documentado — sim, pelo repositório · acesso — não confirmado ·
  testado — não.
- **A conferir antes de qualquer uso:** como se liga ao Claude Code e qual o alcance
  (chamada, agente ou sessão); critério de ordem dos modelos; política de dados e
  termos dos planos gratuitos; quota real; controle de esforço, que o reel não mostra.
  A troca automática conflita com o registro de modelo aplicado: sem aviso, é troca
  silenciosa. Não importar credenciais de assinatura para um gateway.

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
- `marvin.mjs`
- `teste.mjs`
- `README.md`
- `README.pt-BR.md`
- `package.json`
- `.marvin/Contexto/IA.md`
- `AGENTS.md`
- `CLAUDE.md`
- `.claude/agents/README.md`
- `.claude/agents/po.md`
- `.claude/agents/tl.md`
- `.claude/commands/us.md`
- `.marvin/Planejamento/README.md`
- `.marvin/Contexto/Fluxos/delegacao.md`

## Time
Registro do piloto de 05/10: `turn_context` dos logs locais do Codex confirma modelo e
configuração de esforço. Isso confirma a configuração, não a quantidade de raciocínio
interno nem economia. Os logs brutos ficam fora da base pública.

- `po` · OpenAI/gpt-6.1-sol · Codex · solicitado: herdado da sessão (`high`)
  — aplicado: gpt-6.1-sol / high, conferido nos logs; revisa escopo e critérios.
- `tl` · OpenAI/gpt-6.1-sol · Codex · solicitado: herdado da sessão (`high`)
  — aplicado: gpt-6.1-sol / high, conferido nos logs; revisa invariantes e diff local.
- `dev-back` · OpenAI/gpt-6.1-sol · Codex · solicitado: herdado da sessão (`high`)
  — política local escrita pela sessão principal e worker; aplicado: gpt-6.1-sol / high,
  conferido nos logs da sessão principal e do worker.
- `scout` · OpenAI/gpt-6.1-sol · Codex · solicitado: herdado da sessão (`high`)
  — pesquisa feita na sessão principal, sem subagente separado; aplicado conferido nos logs.

As referências Claude iniciais (`po`/`tl` em Opus, implementação em Sonnet e recuperação
em Haiku) são linha de base para comparação, não escolhas fixas. A política confirmada
em 06/10 escolhe por atividade e acesso. Registrar IDs concretos e controles aplicados;
não copiar a referência como evidência.

Atualização documental de 06/10: sessão principal redige, `po` revisa escopo e `tl`
revisa coerência/diff. Modelo e esforço herdados das sessões existentes; configuração
aplicada nesta atualização não conferida em logs. Não houve chamada pelo plugin Codex,
gateway ou fornecedor de vídeo.

Implementação autorizada em 06/10: sessão principal assume `dev-back` (script), `qa`
(cenários herméticos) e `scout` (padrões/fontes); `po` delimita escopo e `tl` revisa
invariantes/diff. Revisões especializadas de JavaScript e código foram delegadas.
Modelo/esforço herdados, aplicação não conferida; nenhuma inferência por provedor
externo. O inventário local não é configuração operacional de roteamento.

### Ensaio do formato por etapa — decisão do PO, 09/10/2026

Executar em ordem e atualizar o estado com evidência ao fechar cada etapa. A alocação
de fornecedor, modelo, ferramenta e esforço será decidida na abertura de cada etapa,
entre capacidades elegíveis; para as etapas abaixo, a configuração exata e o acesso
do executor ainda não estão confirmados.

**Próxima etapa: 1, pendente.** `po` + `tl` devem selecionar 3–4 US reais com tarefas
comparáveis e definir contexto inicial, checks e unidade de comparação. Evidência para
fechá-la: lista das US e registro desses três elementos. O modelo, ferramenta, esforço
e acesso dos executores serão escolhidos entre opções elegíveis quando a etapa começar;
nenhum está confirmado agora.
**Capacidade necessária:** seleção de escopo/produto pelo `po` e desenho de checks e
protocolo de medição pelo `tl`. A coleta de custos para as etapas posteriores depende
de fonte e acesso a métricas, ainda não confirmados.
1. `po` + `tl` — selecionar 3–4 US reais com critérios comparáveis e fixar contexto,
   checks e unidade de medição; estado: pendente; aplicado: não confirmado.
2. `scout` + papel executor definido na US escolhida — operar o glossário em atividade
   real, registrando fonte/data, capacidade documentada, acesso e execução como estados
   distintos; estado: pendente; aplicado: não confirmado.
3. `qa` + `tl` — registrar por US sessões atribuíveis, configurações efetivamente
   conferidas, verificações, tentativas, retrabalho, tempo e custo disponível; estado:
   pendente; aplicado: não confirmado.
4. `po` + `tl` — comparar somente amostras com atribuição suficiente, registrar
   limitações e decidir ajustes nos templates; estado: pendente; aplicado: não confirmado.

## Skills
- `rotear-tarefa` — proposta: decompor atividade/domínio, escolher papéis e skills,
  conferir capacidades/acessos e selecionar modelo/ferramenta/esforço. Vira `SKILL.md` se repetir.
- `cost-report` — usar quando houver métricas compatíveis; agregado Claude já existe
  no `marvin --status`. Nenhuma skill ou coletor novo foi criado para o piloto.

Reutilizar perguntas de stdlib e suíte existente; sem skill nova. A autorização atual
antecipa onboarding e orientação nos templates; benchmark continua pendente.

## Protocolo de medição — pronto para uso, comparação pendente

1. Selecionar 3–4 US reais com critérios verificáveis e tarefas comparáveis; não abrir
   US fictícias nem repetir trabalho só para produzir números. Fixar contexto inicial,
   verificação e unidade de comparação antes de executar.
2. Registrar por tarefa os turnos/sessões que pertencem a ela, incluindo subagentes,
   intervalo da medição, modelo/controle aplicado, revisão, tentativas e tempo. Se
   uma sessão misturar US sem atribuição confiável, não usá-la como amostra por US.
3. Comparar a configuração anterior com a política por tarefa, em contexto equivalente.
   Diferenças de dificuldade, cache ou tamanho da conversa devem ficar explícitas;
   amostras históricas incompletas não provam ganho antes/depois.
4. Usar `marvin --status` para o agregado Claude já existente. Ele estima custo com
   tabela datada; conferir preço e cobertura do modelo antes de usá-lo. Para Codex,
   usar eventos completos e o último acumulado por sessão, sem somar snapshots nem
   somar reasoning novamente se já estiver no total de saída. Dados incompletos
   impedem converter tokens em custo ou comparar fornecedores.
5. Registrar no Rumo de cada US: configuração antes/depois, fonte, custo estimado ou
   cobrança identificada, sucesso nos mesmos checks e retrabalho. Só então calcular
   custo por tarefa aprovada e decidir se a política deve virar template.

**Resultado da busca histórica:** há uso medido nos logs Claude e no `--status`, mas
as sessões misturam atividades de várias US. Parte do histórico Codex só informa
total de tokens, sem modelo/esforço ou categorias suficientes. A sessão do piloto de 05/10 permite
conferir configuração, mas não é comparação em 3–4 US. Ganho **não demonstrado**.

## Atividades

- [x] Responder perguntas de capacidade e definir as ferramentas iniciais do piloto.
- [x] Escrever política portátil no fluxo existente e ligá-la aos gatilhos locais.
- [x] Distinguir configuração solicitada, herdada, aplicada e não confirmada.
- [x] Localizar a fonte de uso existente sem criar outro coletor.
- [x] Definir o protocolo de comparação, verificação e escalada.
- [x] Revisar diff final e executar os checks locais (aprovado pelo `tl`; 237 testes).
- [x] Registrar ampliação confirmada e alinhar seleção por domínio, papéis, skills e capacidades nos gatilhos locais.
- [x] Delimitar as sete opções escolhidas, identificar Jev e registrar o onboarding portátil proposto.
- [ ] Operar o glossário em atividades reais e validar acesso, capacidade ausente e substituição por etapa.
- [ ] Medir antes/depois em 3–4 US reais com atribuição completa.
- [x] Implementar o onboarding de disponibilidade autorizado, cobrindo uma/várias opções e outros executores.
- [ ] Decidir ajustes da regra nos templates com os números do piloto; orientação inicial já antecipada por autorização.
- [ ] Handoff entre executores por cota — movido para a [US-20](../US-20-handoff-de-executor-por-cota/Sobre.md).

**Checks do piloto de 05/10:** `git diff --check`, links relativos dos 8 documentos,
`marvin --fechar` e `marvin --status --curto` passaram. `npm run test`: **237 passaram**
na suíte hermética fora do sandbox; no sandbox, as junctions temporárias não foram
criadas. Esses checks validam o estado local, não a economia ou execução multi-LLM.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 1 nó(s) de código em 1 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum

## Rumo
- **09/10/2026** — o `po` decidiu aplicar à US-19 o formato por etapa definido em
  `.marvin/Planejamento/README.md` e reensaiá-lo usando o trabalho já previsto nesta
  US: operar o glossário em atividades reais e medir antes/depois em 3–4 US, conforme
  o protocolo acima. As etapas e estados estão registrados em *Time*; executor,
  fornecedor, modelo, ferramenta, esforço e acesso serão confirmados ao iniciar cada
  etapa, sem pressupor a configuração herdada. Na triagem, Graphify continua obrigatório
  neste repositório, mas o grafo disponível é de 14/09, está velho e não mostra o
  impacto atual; buscas textuais (`rg`/Grep/Glob) ficam registradas como fallback para
  localizar os arquivos até o grafo ser atualizado.
- **09/10/2026** — após o primeiro ensaio, explicitei a próxima retomada no *Time*:
  etapa 1, selecionar 3–4 US reais e registrar contexto, checks e unidade de comparação.
  A evidência para fechá-la também está escrita; modelo, ferramenta, esforço e acesso
  continuam sem confirmação até o executor iniciar.
- **09/10/2026** — segunda leitura independente do `po`, limitada a *Time* e *Rumo*,
  identificou a etapa 1, os papéis, as configurações ainda não confirmadas e a evidência,
  mas não nomeou explicitamente as capacidades necessárias. O `tl` apontou a lacuna;
  o ensaio da US-20 ainda não passou. A seleção e medição continuam pendentes, sem
  ganho alegado.
- **09/10/2026** — terceira leitura independente do `tl`, limitada a *Time* e *Rumo*,
  identificou etapa 1, capacidades de `po`/`tl`, configurações não confirmadas e
  evidência. O formato passou no ensaio; seleção e medição seguem pendentes.
- **09/10/2026** — Josué confirmou que quer aplicar ao Marvin a organização apresentada nos [reels de GPT](https://www.instagram.com/reels/DeHdXeWsgph/) e [Claude](https://www.instagram.com/p/DeFS0Fes8yu/): escolher modelo e esforço por etapa, começar pela opção elegível de menor custo, verificar pelo risco e subir se a capacidade não bastar. Objetivo declarado: tentar reduzir custo mantendo o resultado exigido. Os valores dos reels são simulações de seis tarefas, não medição do Marvin; economia permanece hipótese até a linha de base comparável de 3–4 US prevista nos critérios 4–5. O "router" continua sendo a sessão principal seguindo a regra escrita, sem software novo ou chamadas adicionais autorizadas.
- **08/10/2026** — regra externa de um reel ("nunca faça sozinho, sempre delegue" + "complexo=Opus, simples=modelo mais simples") avaliada por `po` e `tl`. A de modelo já é a tabela do `CLAUDE.md` e não fixa fornecedor; a de delegação entrou no `AGENTS.md` **reescrita** (sessão principal coordena e delega; trivial não delega; subagente não delega; código ou invariante passa pelo `tl`), sem o "sempre" literal, que contradiz `delegacao.md` passo 1. **Hipótese para a medição de 3–4 US:** delegar mais reduz retrabalho ou só aumenta custo? Não gerar isso no template de `marvin.mjs` antes de haver número (invariante 4).
- **07/10/2026** — refinamento. Registrada a **divisão declarada** (Claude e Codex
  juntos, MiniMax para vídeo se houver acesso) como declaração, não medida, e o
  handoff assistido ficou na US-20. A regra desta US não muda: papel e capacidade vêm
  da atividade; modelo, ferramenta e esforço vêm do acesso. Documental; `po` e `tl` ainda
  não revisaram esta atualização.
- **07/10/2026** — Josué trouxe um segundo reel (@99hud, **FreeLLMAPI**), diferente do
  @donimas. Ele cobre o que esta US deixou fora, a troca de modelo por cota, e vira a
  [US-20](../US-20-handoff-de-executor-por-cota/Sobre.md). Aqui só entrou a entrada
  do glossário (*FreeLLMAPI*, acima); o failover continua fora do piloto. Reel lido pelo
  vidIQ; o `watch` com Gemini deu 503. Atualização documental, sem checks executados.
- **06/10/2026** — usuário escolheu **2.0.0** como versão desse fundamento. Versão
  local 1.9.0 foi substituída antes de publicação; pacote e seis marcas de migração
  agora usam 2.0.0. READMEs explicam a seleção por atividade e o limite de execução;
  exemplo YAML deixa `model` omitido para herança válida. A revisão encontrou EOF
  sem aborto controlado e caminho do script incorreto no driver TTY; ambos corrigidos,
  com cobertura de cancelamento inicial/parcial e caminho do hook. `tl` e revisores
  de JavaScript/código aprovaram. `npm run test`: **263 passaram** em Windows/Node
  22.19.0, suíte hermética fora do sandbox; sintaxe e `git diff --check` passaram.
  `npm pack --dry-run --ignore-scripts`: pacote 2.0.0 com os sete arquivos esperados,
  sem `.marvin/`, `.claude/` ou inventário local. Nenhum arquivo novo nesta revisão;
  benchmark e integrações reais seguem pendentes. Sem publicação npm, commit ou tag.
- **06/10/2026** — usuário autorizou implementar no Marvin. `po` aprovou onboarding
  declarativo local e glossário separado; `tl` revisou o desenho. Antecipados cadastro
  e orientação nos templates, revisando a espera anterior pelo benchmark; integração
  e economia continuam não demonstradas. Inventário é privado/ignorado, não config
  operacional. Novas perguntas, flags, validações e guarda idempotente via `fsw`;
  `--no-questions` passou a valer também para Fontes/Externas. Removida obrigação
  de marca/modelo por papel nos templates. Versão local 1.9.0, sem publicação npm.
  Novo `Contexto/IA.md` deste repo é ponteiro para fluxo/pesquisa existentes; necessário
  para exercitar a mesma porta de entrada dos templates sem duplicar o catálogo.
  `tl` e revisores de JavaScript/código aprovaram o diff após restringir o ignore ao
  inventário e corrigir compatibilidade do driver TTY com Node 18. `npm run test`:
  **260 passaram**, em Windows/Node 22.19.0 com HOME/USERPROFILE temporários fora do
  sandbox (junctions bloqueadas nele). Sintaxe, `git diff --check`, 32 links locais,
  `--fechar` e `--status --curto` passaram. Nenhuma inferência, publicação ou ganho
  medido; US permanece ativa para uso real do glossário e benchmark.
- **06/10/2026** — foco de estudo delimitado pelo usuário em Claude, Codex/OpenAI,
  MiniMax, DeepSeek, Gemini, Grok e Jev. Identificado Jev da TypeSafe AI e pesquisadas
  fontes oficiais sobre decisões estruturadas, skill e limitações; acesso não testado.
  Registradas perguntas iniciais de disponibilidade/configuração no executor escolhido,
  incluindo cenário fora do Claude Code. Onboarding permanece proposto, sem alteração
  no script ou instalação de integrações. As referências anteriores foram preservadas.
  Refinamento aprovado por `tl`; `git diff --check` passou e 20 links relativos
  foram conferidos nos 9 documentos modificados. Nenhum arquivo novo neste refinamento.
- **06/10/2026** — Josué confirmou que a escolha começa na atividade/domínio, define
  personas e skills e só então escolhe modelo/ferramenta/esforço entre capacidades
  disponíveis. Glossário cresce com pesquisa datada e uso; política não favorece
  Codex/Claude nem fixa revisor pelo plugin instalado. Exemplo de vídeo distingue
  roteiro de geração e acesso a chat de acesso a vídeo. `po` aprovou o registro mínimo
  sob demanda; operação do glossário, medição e templates permanecem pendentes.
  Atualização somente documental; nenhum executor, instalação ou hook foi ativado.
  Revisão documental aprovada por `tl`; `git diff --check` passou e 24 links locais
  foram conferidos nos 9 documentos. Nenhum arquivo novo foi criado nesta atualização.
- **05/10/2026** — aberta a partir do reel do @donimas. Ideia do Josué: o esforço tem que ser
  ajustável por tarefa, não fixo por papel. Proposta: decidir o trio no `/refinar` e gravar na
  seção *Time*, porque assim a escolha fica registrada e a subida de degrau vira dado no Rumo.
- **05/10/2026** — Josué confirmou a portabilidade para as LLMs mais conhecidas.
  A política passa a ser comum, com controles próprios por fornecedor/modelo/ferramenta.
  `po` revisou o escopo: conferir capacidades sob demanda, validar primeiro o piloto
  e medir o fluxo completo. Lista de famílias, herança de esforço no Claude e modelo
  da sessão principal continuam propostas. Sem alteração no script ou nos templates.
  A pesquisa encontrou ausência das métricas esperadas e do `/refinar` local; o README
  dos agentes também diz que não há agentes, embora `po` e `tl` existam. Resolver esses
  pontos conforme o piloto escolhido, sem tratar o registro antigo como execução validada.
- **05/10/2026** — autorização para avançar nas atividades pendentes. Política local
  implementada nos documentos e no gatilho `/us`, com revisão de desenho por `po` e `tl`.
  O `/refinar` ausente não impede o piloto: foi usado o gatilho existente, sem criar
  outro comando. Corrigida a afirmação de que não havia agentes no repo. A medição
  Claude da US-08 já existe no `--status`; logs locais permitem conferir a configuração
  atual Codex. Não foi encontrada comparação válida em 3–4 US, então o script e os
  templates publicados continuam pendentes. Estado mantido ativo; nenhum ganho alegado.
- **05/10/2026** — checks locais concluídos, incluindo 237 verificações da suíte.
  O `tl` encontrou divergência na regra de documentação trivial entre os critérios
  e o fluxo; os dois foram alinhados. Worker também conferido como gpt-6.1-sol/high
  nos logs. Revisão final da correção aprovada pelo `tl`; medição e templates pendentes.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->

Entrega parcial — onboarding de 06/10: `npm run test` com 260 verificações; inclui
uma/todas opções, outro executor, TTY real via driver, TTY sem perguntas, flags inválidas,
dry-run, repetição, guia humano e ignore preservados, vault antigo. Revisões aprovadas
por `tl`, `typescript-reviewer` e `code-reviewer`. Não comprova execução nos fornecedores
nem economia antes/depois; sem PR, commit, tag ou publicação nesta entrega.

Revisão da **2.0.0** em 06/10: **263 verificações passaram**, incluindo EOF sem
persistência parcial, caminho real do hook e YAML por herança. Sintaxe e diff limpos;
pacote em dry-run com sete arquivos, sem inventário local. Revisões finais aprovadas
por `tl`, `typescript-reviewer` e `code-reviewer`; publicação e benchmark pendentes.
