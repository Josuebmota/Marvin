# Fluxo delegação

Como uma tarefa sai da sessão principal e chega a um papel. **Política local da US-19:**
a atividade determina domínio, papéis, skills e capacidades necessárias; depois são
escolhidos modelo, ferramenta e esforço entre os acessos disponíveis. Papel define
responsabilidade, não fornecedor. A sessão principal aplica a regra escrita; o script
não executa chamadas nem troca provedores.

O foco de estudo definido pelo usuário em 06/10 reúne Claude, Codex/OpenAI, MiniMax,
DeepSeek, Gemini, Grok e Jev. São sete opções de estudo, não sete integrações validadas.
Conferir cada combinação usada na documentação oficial e no glossário sob demanda
descrito abaixo, sem ranking fixo de marcas. Jev é voltado a decisões estruturadas;
não presumir que todas as opções geram texto, código ou vídeo.

## Passos

1. **Decompor a atividade e classificar o risco:** resultado esperado, domínio, contexto
   necessário e verificação por etapa. Escolher os papéis pelo trabalho e pelo
   `description` do agente, e as skills pelo procedimento necessário. Só delegar
   etapas cuja independência ou especialização justifique o contexto adicional.
2. **Escolher a menor configuração adequada:** consultar as capacidades pertinentes
   no glossário; pesquisar lacunas ou informação desatualizada sob demanda. Filtrar
   modelo concreto, ferramenta/integração e capacidade pelo acesso autorizado,
   compatibilidade, quota conhecida e orçamento. Login detectado não prova chamada
   bem-sucedida; quota desconhecida é não confirmada. Escolher entre as opções
   elegíveis pela qualidade exigida e pelo custo completo da etapa, sem preferência
   fixa por fornecedor ou pelo plugin instalado. Conferir esforço, valores e alcance (chamada,
   agente ou sessão); nomes iguais de esforço não provam equivalência entre modelos.
   Suporte na API não implica suporte no app ou CLI.
3. **Registrar em Time e Skills antes de executar:** etapa/domínio/papel, skills,
   capacidade necessária, fornecedor/modelo, ferramenta, esforço solicitado e motivo
   da escolha. Após a execução, completar a configuração aplicada observável,
   com a origem da conferência; até lá, aplicado é **não confirmado**.
   Usar **herdado (origem)** quando houver herança, **não aplicável** quando o modelo não
   oferecer o controle, ou **não confirmado** quando a aplicação não puder ser conferida.
   Controle ausente na ferramenta é limitação explícita; propor alternativa e registrar
   a escolha, sem trocar fornecedor, modelo ou esforço em silêncio.
4. **Executar e verificar pelo risco:** neste repo, mudança de código, escrita em disco
   pelo script ou invariante exige `npm run test` e `tl` lendo o diff. Documentação
   simples exige `git diff --check` e revisão de conteúdo. Menor esforço jamais reduz
   verificação. Registrar resultado e evidência na US.
5. **Entender a reprovação:** corrigir contexto ou requisito inválido não exige modelo
   maior. Se a capacidade continuar insuficiente após a verificação, subir modelo ou
   esforço para uma opção suportada e repetir o check. Registrar no *Rumo*: origem,
   destino, motivo e check com resultado. Se já estiver no topo disponível, escalar
   ao humano e manter a tarefa pendente; não inventar outro degrau.

## Triagem — quem decide o time da atividade (US-26, 08/10/2026)

O dono (PM) passa a demanda; o **`tl` e o `po` fazem a triagem juntos**, com o contexto
inteiro da US: quem deve tocar, quais agentes e skills a atividade pede (só os que ela usa,
mais `design`/`dba`/`sec`/`infra` quando for o caso), com que **esforço** e **modelo**. É o
passo 2 do `/us`, agora com dono explícito; não é uma etapa nova.

- **Registro:** o resultado vai no *Time*/*Skills* da US. Agente ou skill novos nascem aí; só
  viram arquivo em `.claude/agents/` ou `.claude/skills/` com uma armadilha concreta (agente)
  ou na segunda execução (skill). Quem escreve o corpo é o `tl`+`po`, não o script.
- **O `tl` e o `po` também são escolhidos por atividade.** O `model:` do frontmatter é só o
  padrão; a chamada Agent aceita `model` por chamada. O esforço **não** tem override na chamada:
  vem do frontmatter ou é herdado da sessão — registrar "herdado (sessão)" é a limitação
  explícita. Esforço menor nunca reduz a revisão dos invariantes.
- **Grafo na triagem, quando houver:** se `graphify-out/graph.json` existir e estiver mais
  novo que o código, o `tl`/`po` partem da seção *Impacto* e das ilhas da US (quem depende do
  que ela toca, e qual o tamanho). Se não, registram "grafo ausente ou velho" no *Time* e usam
  Grep/Glob — a triagem **não fica bloqueada** por falta de grafo. Para **localizar** arquivo ou
  símbolo, Grep/Glob é mais barato (medido: ~1.650 tk pelo grafo contra ~18 com glob). Que o
  grafo economize tokens na triagem é **hipótese**, medida na US-19, nunca promessa.

## Glossário de capacidades — escopo confirmado em 06/10/2026

Registro curado que cresce com as atividades e os acessos usados, não pesquisa
antecipada de todos os fornecedores. O piloto reutiliza a seção *Pesquisa de
capacidades* da US-19; sua operação e organização reutilizável ainda precisam de
validação. Consultar só as entradas pertinentes, sem carregar todo o glossário em
cada sessão.

O usuário define a inclusão de novas opções; o uso aprofunda evidência dentro desse
escopo. Separar essa lista do acesso de cada instalação. Uma opção capaz pode cobrir
vários papéis; ter todas não exige chamar todas.

Cada entrada precisa identificar modelo/ferramenta/capacidade concreta, modalidades
de entrada e saída, controles de esforço, integração necessária, fonte/data e
limitações. Acesso, quota e orçamento são conferidos no ambiente de execução:
registros públicos não guardam credenciais, dados pessoais ou quotas de contas.
Separar **documentado**, **acesso não confirmado** e **testado na atividade**. O resultado
de uso guarda tarefa, configuração, check, retrabalho e métricas disponíveis; um
sucesso não prova superioridade geral. Informação nova acrescenta evidência e data,
sem apagar resultados anteriores.

Exemplo: produzir vídeo pode exigir roteirista e geração visual em etapas distintas.
Claude pode preparar texto; um modelo específico de vídeo da MiniMax é candidato
à geração somente se essa capacidade e a integração estiverem disponíveis. Acesso
ao chat da marca não prova acesso à geração de vídeo. Sem gerador elegível, entregar
as etapas possíveis e explicitar a lacuna, sem prometer vídeo gerado por modelo de texto.
Fontes da distinção: [Claude](https://platform.claude.com/docs/en/models/overview) e
[MiniMax](https://platform.minimax.io/docs/guides/video-generation), consultadas em
06/10/2026; não houve geração de vídeo ou comparação entre modelos.

## Disponibilidade na instalação — implementação autorizada em 06/10/2026

O script pergunta a ferramenta da sessão, quais IAs o usuário tem e se estão configuradas
nela. Distingue assinatura no cliente oficial, API e execução local; declarado,
configurado e testado não são equivalentes. Credenciais ficam no mecanismo local
da ferramenta, fora da base pública. Registrar a escolha uma vez, sem repetir
perguntas ou sobrescrever configuração existente. O inventário fica em
`<vault>/.local/disponibilidade.json`, com ignore específico para esse arquivo.
Sem TTY ou com `--no-questions`, não cria inventário sem declaração; ausência é não
informado. `--executor` e `--ai=id:acesso:configurado` permitem declaração por flags;
`--ai=none` registra nenhum acesso. Dry-run não pergunta; flags entram só no plano.

Claude Code é uma opção de executor. Codex e OpenCode já usam `AGENTS.md`; seus
adaptadores mantêm a mesma política e base. `--tools` escolhe adaptadores, não conecta
fornecedores. Verificar o meio efetivo de delegação antes de prometer execução em
outro provedor; skill instalada não prova acesso nem subagente nativo. Sem integração,
orientar a configuração e usar as capacidades prontas. Os cenários uma/todas,
outro executor, sem perguntas, dry-run e idempotência são cobertos na suíte hermética.

## Indisponibilidade e execução

Quota esgotada ou integração indisponível exige refazer a seleção para a etapa
restante, preservando objetivo, restrições, resultado parcial e verificações.
Substituição precisa suportar a mesma capacidade; não substituir vídeo por texto
nem reiniciar uma geração pendente sem conferir seu estado. Registrar motivo e
nova escolha, respeitando o orçamento autorizado. Sem opção elegível, manter a
etapa pendente e informar a limitação.

Plugin/gateway transporta a chamada escolhida; não define persona ou skill. Hook que
fixa revisão no Codex não é a política neutra e não é ativado por ela. A sessão
principal pode aplicar a seleção com as integrações disponíveis; assumir depois
que a própria sessão perde quota requer um executor externo, ainda fora deste
piloto. Nenhuma troca automática de sessão foi implementada.

## Handoff entre executores — proposta da US-20, 07/10/2026

Quando o executor para no meio da atividade (cota), outro modelo ou ferramenta assume
**a pedido da pessoa**: ela abre a nova sessão, nada troca sozinho. O que vale em
qualquer ferramenta, sem depender de comando de uma delas (o `/retomar` é do Claude Code):

**Pré-condição.** O *Time* da US traz o estado de cada etapa (`pendente`, `em andamento`,
`feita` com evidência), atualizado ao fechar a etapa. O executor que parou já não escreve.

**Primeira instrução da nova sessão:** ler `AGENTS.md`, `.marvin/Memoria/onde_paramos.md`
e o `Sobre.md` da US ativa, e seguir este handoff.

1. **Ler o estado, não o relato.** Conferir o que consta como `feita` pelo `git diff`
   e pelo check do risco da etapa; o que o anterior disse ter feito não é prova.
2. **Manter papel e capacidade** de cada etapa restante. São o requisito da atividade.
3. **Refazer só modelo, ferramenta e esforço**, entre os acessos disponíveis, pelo
   glossário. Nome de esforço igual não prova equivalência; controle ausente é
   limitação explícita.
4. **Capacidade sem substituto é lacuna**, não troca por outra: não trocar vídeo por
   texto, nem reiniciar uma geração pendente sem conferir seu estado.
5. **Sem opção elegível**, a etapa fica `pendente` e a pessoa é informada.
6. **Registrar no *Rumo***: origem, destino, motivo (cota), o de-para por etapa e o
   resultado da verificação; atualizar o *Time* com o novo modelo e o estado.
7. **Voltar ao executor original** repete os mesmos passos.

Fora do escopo: detectar a cota restante (as ferramentas não expõem de forma
confiável), qualquer troca sem humano e gateway para modelo não-Claude, que a
documentação do Claude Code não suporta.

## Controles e limites — conferidos em 05/10/2026

- [Claude Code](https://code.claude.com/docs/en/sub-agents): `model` por chamada;
  `effort` no frontmatter, com herança da sessão quando omitido. A documentação não
  descreve override equivalente de esforço na chamada Agent. Herança é fallback
  local quando apropriado, com origem registrada, não regra universal.
- [Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents): spawn aceita
  modelo/esforço; sem configuração, herda do pai. Modelo escolhido pelo spawn ou
  default sem esforço configurado usa o default do modelo. O TOML customizado
  prevalece nos campos que define; se só define modelo, preserva o esforço resolvido
  antes. Conferir a precedência e a compatibilidade efetivas.
  Nesta sessão, o esquema `collaboration.spawn_agent` com `fork_turns: all` herda
  modelo/esforço e não aceita overrides nessa forma; é limite desta chamada.
- Outros fornecedores: conferir sob demanda a combinação efetivamente escolhida.
  Uma fonte oficial prova suporte documentado; aplicação exige evidência da execução.

## Regras que não podem quebrar

- Passar ao subagente o contexto necessário e os invariantes; não presumir memória
  compartilhada. Instruções dos papéis: `.claude/agents/README.md`.
- As referências iniciais Claude de 05/10 são uma linha de base do piloto, não
  escolhas fixas por papel. O `tl` continua responsável pelos invariantes qualquer
  que seja o fornecedor; mudar a configuração exige adequação ao risco e verificação.
  Codex e outros fornecedores não recebem equivalências automáticas.
- Medir 3–4 US antes de tratar a política nos templates como economia validada: sessão principal,
  delegações, verificações e retrabalho por tarefa aprovada. Registrar fonte e
  limitações; custo estimado, cobrança e consumo de assinatura são medidas distintas.
  A autorização de 06/10 antecipou onboarding e orientação portátil no script/templates;
  não criou motor de inferência, nova skill ou configuração de modelos automática.

## Templates — orientação portátil; resultado do piloto pendente

- `marvin.mjs` — passo 0a (declarações), passo 5 (guia/glossário e Planejamento),
  passo 7 (agentes), passo 7b (`/us`) e passo 7c (`AGENTS.md` e adaptadores).
- Arquivos humanos existentes são preservados; passo 10 avisa se faltar orientação.

## US que passaram por aqui

- [US-19](../../Planejamento/Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md)
- [US-20](../../Planejamento/Novos/time/roteamento/US-20-handoff-de-executor-por-cota/Sobre.md)
