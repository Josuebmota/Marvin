---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-28 — mapa de personas, skills e modelos (Claude e ChatGPT/Codex) e arranjos por disponibilidade

> O nome da pasta ficou `modelos-por-papel-claude-e-chatgpt`; o escopo cresceu em 09/10/2026 (ver *Rumo*). Renomear quebraria os links da nota e da feature, então a pasta fica.

**Por quê:** quando o dono pede o time de uma atividade, o modelo de cada papel é **suposto a partir de premissas**. Não existe tabela dizendo para que cada modelo serve, nem quais personas e skills existem para montar o time. Para o Claude há só a referência de partida do `CLAUDE.md`; para o ChatGPT/Codex nada além de "herdado da sessão" no piloto da [US-19](../US-19-papel-modelo-esforco/Sobre.md). Sem o mapa, cada atividade repete a pesquisa, e pesquisa custa token.

**O objetivo (dono, 09/10/2026):** usar **toda a capacidade que a pessoa tem**, para gastar menos e entregar o mesmo resultado. É para isso que existem o ponytail, o graphify, os arranjos e as estruturas. O mapa dá uma referência curta à escolha; economia e resultado equivalente ainda precisam de medição.

**Cenários pedidos pelo dono para avaliar 28b, ainda sem arranjo validado:**
- **só Claude** → o time se baseia só nos modelos Claude;
- **só ChatGPT/Codex** → só nos modelos OpenAI;
- **os dois** → usa os dois em proveito (quem faz o quê é decisão do arranjo, não "os dois em tudo");
- **os dois mais outra IA, e por aí vai** → o glossário sob demanda ([US-19](../US-19-papel-modelo-esforco/Sobre.md)) acrescenta o terceiro; só Claude e ChatGPT/Codex são mapeados agora, porque são os que o dono domina.

O mapa só vale para quem tem o fornecedor. Ter o Codex configurado **não** é ter o Claude, e vice-versa: o inventário de disponibilidade da US-19 (`.local/disponibilidade.json`) é quem diz qual coluna do mapa está elegível.

## Divisão decidida pelo `po` — 09/10/2026

**28a: mapa concluído. 28b: não necessária no escopo atual; a política foi incorporada à US-19.** Os dois reels que motivaram o pedido descrevem o mesmo princípio: selecionar modelo e esforço por tarefa, começar pela opção elegível de menor custo, verificar e escalar se necessário. Esse princípio já está na US-19; uma matriz separada de arranjos por fornecedor duplicaria a regra. A organização está adotada, mas a economia do Marvin ainda depende da medição prevista na US-19.

**US-28a — o mapa (três camadas independentes de fornecedor)**
1. **Personas:** para cada papel, a **capacidade que ele exige** (julgar, implementar, verificar, recuperar, desenhar, modelar dados, auditar segurança, infra). Papéis escritos hoje: `po`, `tl`, `dev-back`, `qa`, `scout`. Papéis só da base do `AGENTS.md`, sem arquivo: `dev-front`, `design`, `dba`, `sec`, `infra`. **O mapa descreve o perfil de capacidade; não escreve o corpo do agente** (invariante 4: agente só vira arquivo com armadilha concreta do código).
2. **Skills:** quais existem e foram pertinentes à triagem real (incluindo `adaptador-de-ferramenta`, `publicar-no-npm` quando aplicáveis), que papel as usa e em que etapa; registrar ponytail para implementação e graphify para triagem no alcance já decidido.
3. **Modelos Claude e OpenAI/Codex:** registrar capacidade documentada pertinente à etapa, modelo concreto, ferramenta onde o controle de esforço foi confirmado, fonte oficial datada e estado (documentado / acesso / testado). Papel é filtro de responsabilidade; **não há modelo padrão por papel**, nem equivalência de esforço entre fornecedores. Vazio e "não confirmado" são respostas válidas; palpite sem fonte não entra.

**US-28b — absorvida pela US-19; sem matriz ou implementação própria.** Se uma triagem real revelar uma lacuna que a política da US-19 não resolva, reabrir com esse caso concreto, acesso e verificação registrados. Um, dois ou mais fornecedores não justificam uma matriz fixa: a US-19 já seleciona por tarefa entre configurações elegíveis, e a [US-20](../US-20-handoff-de-executor-por-cota/Sobre.md) trata o handoff por cota.

**Pronto quando (US-28a):**
- inventário de personas e skills existentes, sem criar agentes ou skills; referência curta, carregada só na escolha, com fonte oficial datada para cada afirmação sobre modelo/controle;
- numa etapa real da US-19, segundo leitor identifica papel, skill, capacidade e opção elegível **ou** registra lacuna que exige pesquisa sob demanda; confere acesso e esforço na ferramenta antes de afirmar execução;
- `git diff --check`, links relativos e revisão `po` + `tl`.

**US-28b não tem critério de entrega próprio enquanto estiver absorvida.** Uma lacuna concreta numa triagem real pode justificar reabertura, sem cenários inventados.

**Tensão com a US-19 resolvida:** sua regra continua sendo atividade → capacidade → opção elegível. Tabela de "bom para", "evitar quando", vencedor por papel ou divisão fixa entre marcas seria ranking antecipado e sai. Fontes oficiais datadas descrevem suporte e limites, não superioridade. A US-19 não precisa de exceção.

**Não entra:** MiniMax, DeepSeek, Gemini, Grok, Jev e demais (glossário sob demanda); preço e benchmark; medir economia nesta US (isso permanece na US-19); traduzir esforço entre fornecedores (nome igual não prova equivalência); escrever o corpo de `dev-front`, `design`, `dba`, `sec`, `infra`; o script ler o mapa; mexer no `CLAUDE.md`/`AGENTS.md`.

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md) — o passo de escolha pode consultar o mapa; a política por tarefa e sua medição pertencem à US-19
- [IA](../../../../../Contexto/IA.md) — o glossário aponta para o mapa

## Código tocado
Nenhum arquivo de código: documentação. Sem nó de código, o grafo não calcula *Impacto*.
- `.marvin/Contexto/IA.md` — ponteiro
- `.marvin/Contexto/Fluxos/delegacao.md` — apontar a referência na etapa de escolha, sem arranjo fixo
- `.marvin/Contexto/mapa-capacidades.md` — referência sob demanda; arquivo novo justificado porque `IA.md` é lido com mais frequência

## Time
Decomposição ([delegacao](../../../../../Contexto/Fluxos/delegacao.md)): **inventário do que existe** (personas, skills, ferramentas) → **pesquisa em fonte oficial** dos modelos → **redação** → **revisão de escopo** → **revisão de coerência e ensaio**. Risco baixo-médio: documentação, mas um mapa errado orienta escolhas futuras. Check: `git diff --check`, links, ensaio. A execução desta etapa ocorreu no Codex; modelo e esforço efetivamente aplicados não foram confirmados. Isso não confirma acesso ao Claude nem cota para novas chamadas.
- `scout` · capacidade: busca em documentação oficial e inventário do repo, só leitura · fornecedor/modelo: agente `scout` Codex, configuração herdada da sessão; ferramenta: Codex; esforço: herdado (sessão), nível não confirmado
  — inventariou personas/skills e fontes oficiais Claude/OpenAI em 09/10/2026; estado: feito; configuração aplicada: não confirmada
- sessão principal · capacidade: redação de texto · fornecedor/modelo: Codex, configuração herdada da sessão; ferramenta: Codex; esforço: herdado (sessão), nível não confirmado
  — escreveu o mapa e os ponteiros após decisão do `po` e inventário do `scout`; estado: feito; configuração aplicada: não confirmada
- `po` · capacidade: julgamento de escopo · fornecedor/modelo: agente `po` Codex, configuração herdada da sessão; ferramenta: Codex; esforço: herdado (sessão), nível não confirmado
  — decidiu 28a agora, 28b condicionada ao segundo uso real; removeu ranking implícito sem exceção à US-19. Estado: feito nesta etapa; configuração aplicada: não confirmada. O frontmatter do agente Claude não comprova esta execução Codex.
- `tl` · capacidade: julgamento de coerência · fornecedor/modelo: agente `tl` Codex, configuração herdada da sessão; ferramenta: Codex; esforço: herdado (sessão), nível não confirmado
  — revisou mapa e fluxo, apontou contradição de esforço Claude Code, aprovou a correção e ensaiou a etapa real da US-19; estado: feito; configuração aplicada: não confirmada
- segunda triagem (US-27) · `po` + `tl` · capacidade: escopo e invariantes · fornecedor/modelo: agentes Codex, configuração herdada da sessão; ferramenta: Codex; esforço: herdado (sessão), nível não confirmado
  — usaram o mapa para decompor a próxima etapa real; Graphify velho e consulta indisponível, fallback por links e `rg`; estado: feito; configuração aplicada: não confirmada

## Skills
- Nenhuma nova. Se "pesquisar fonte oficial → registrar linha datada" se repetir para outro fornecedor, vira skill na segunda vez.

## Rumo
- **10/10/2026** — retomada no Claude Code, depois das etapas no Codex. Nada foi refeito: divisão, inventário e mapa já estavam fechados. Lado Claude conferido na ferramenta: CLI 2.1.292, sessão em `claude-opus-5-5` com esforço `medium`; registrado no [mapa](../../../../../Contexto/mapa-capacidades.md) como acesso observado, sem cota nem desempenho. Sonnet/Haiku/Fable seguem só documentados. 28b **não reaberta**: a troca Codex → Claude foi de executor, não mudou papel, capacidade nem escolha, então não é a lacuna concreta que a reabertura exige. Graphify não consultado: alteração só de documentação, sem nó de código.
- **09/10/2026** — o Josué esclareceu que os dois reels de OpenAI e Claude enviados nesta conversa são a origem da proposta de roteamento por tarefa e que esperava ver essa organização incorporada ao Marvin. O `po` verificou que o princípio já pertence à US-19; 28b como matriz de arranjos duplicaria seu escopo, então fica absorvida, reabrível só diante de lacuna concreta numa triagem real. Valores dos vídeos são simulação, não evidência de economia do Marvin. A analogia Luna/Sonnet, Sol/Opus e Astra/Fable é mnemônica informal registrada no glossário, sem equivalência técnica. A medição de economia, inclusive Graphify quando aplicável a perguntas estruturais, segue na US-19. US-28 concluída: 28a aprovada e conteúdo de 28b absorvido; não há matriz nem ganho medido a publicar nesta US.
- **09/10/2026** — Josué propôs Luna ↔ Sonnet, Sol ↔ Opus e Astra ↔ Fable como referência para o glossário. O `po` delimitou os pares como mnemônico informal de posição relativa entre três opções escolhidas de cada fornecedor, sem equivalência de capacidade, desempenho, custo ou esforço; registrado em `IA.md`, sem mudar o mapa oficial nem a regra de seleção da US-19. Graphify segue velho e esta alteração documental não tem nó de código/*Impacto*; triagem por links e `rg`.
- **09/10/2026** — segundo uso real do mapa na etapa pendente da US-27 (10 avisos do passo 10 em seis arquivos): `po` e `tl` identificaram `dev-back` para editar, `qa` para conferir e `tl` para revisar `AGENTS.md`/`CLAUDE.md`; nenhuma skill nova, Ponytail na implementação e Graphify na triagem. O grafo de 14/09 está velho, sem nó da US-27 ou *Impacto* atual; a consulta Graphify falhou (`uv trampoline failed to canonicalize script path`), então foram usados US, links e `rg` como fallback declarado. Codex funciona nesta sessão; `claude --version` mostra Claude Code 2.1.292 instalado, mas acesso, cota de novas chamadas, modelo concreto e esforço aplicado não estão confirmados. Não foi observada escolha diferente por disponibilidade: `po` manteve a 28b em espera e `tl` aprovou a triagem. A US-27 não foi executada.
- **09/10/2026** — 28a redigida e aprovada por `po` (escopo) e `tl` (coerência). O ensaio na etapa pendente da US-19 de operar o glossário identificou `scout`, recuperação de fonte oficial e nenhuma skill nova; Luna/Codex é candidato documentado para pesquisa delimitada, mas o inventário local de disponibilidade está ausente, então acesso, cota e esforço aplicado seguem lacunas e não há execução elegível confirmada. `tl` encontrou e a sessão principal corrigiu a frase antiga que negava `effort` por invocação no Claude Code; revisão pontual aprovada. 28b segue condicionada à segunda triagem real com diferença de disponibilidade.
- **09/10/2026** — `scout` encontrou cinco agentes escritos, dois skills locais e os limites oficiais de Claude Code e Codex/Work. A sessão principal publicou a referência sob demanda e os ponteiros, sem escolher modelo padrão por papel. Fontes datadas no mapa; acesso, cota e desempenho locais não confirmados. A documentação oficial atualizada de Claude Code indica `effort` por invocação a partir da v2.1.292; corrigido o limite antigo em `delegacao.md`. Revisão `tl` e ensaio pendentes.
- **09/10/2026** — `po` decidiu: prioridade de 28a é alta para resolver a triagem por premissa já observada na US-19, mas economia de tokens segue hipótese sem número. 28b não resolve nada medido ainda: aguarda segunda triagem real em que disponibilidade mude a decisão, sem matriz de cenários antecipada. Retirados "bom para"/"evitar quando" e modelo padrão por papel; capacidade oficial e limite concreto podem entrar, superioridade entre marcas não. US-19 permanece sem exceção. Graphify consultado na triagem: `graphify-out/graph.json` data de 14/09/2026, anterior à US-28; esta US documental não tem nó de código nem *Impacto* calculável. Limitação registrada; links e `rg` foram o fallback para US-19, fluxo e decisões fechadas. Nenhum mapa redigido nesta etapa.
- **09/10/2026** — escopo ampliado pelo dono: além dos modelos, mapear **personas** (incluindo `qa`, design, front, dba) e **skills**, e fechar **arranjos por disponibilidade** (só Claude / só ChatGPT / os dois / os dois mais outra). Objetivo: usar toda a capacidade disponível para gastar menos com o mesmo resultado (ponytail, graphify, arranjos, estruturas). Proposta de dividir em 28a (mapa) e 28b (arranjos) aguarda o `po`. Nada pesquisado nem escrito. **Próximo passo:** `po` decide divisão e tensão com a US-19; `scout` faz o inventário e coleta as fontes oficiais.
- **09/10/2026** — aberta por pedido do dono: o time é montado por premissa, sem tabela de "para que cada modelo serve"; quer Claude e ChatGPT mapeados, os outros depois, para o glossário escolher modelo e esforço gastando menos token.

## Evidência
28a: [mapa](../../../../../Contexto/mapa-capacidades.md), fontes oficiais datadas em cada linha; inventário do `scout` em 09/10/2026; revisão final `po` e `tl` aprovadas. Ensaio sem chamada paga sobre a etapa pendente da US-19: papel e capacidade identificados, nenhuma skill nova, disponibilidade local ausente e lacuna registrada. Segundo uso real na triagem da US-27 aprovado por `tl`, sem diferença observada por disponibilidade. `git diff --check` e links relativos conferidos na 28a; nenhum código alterado. Não há medição de economia nem arranjo 28b validado.
