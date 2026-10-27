# Fluxo delegação

Como uma tarefa sai da sessão principal e chega a um papel. **Política local da US-19:**
a atividade determina domínio, papéis, skills e capacidades necessárias; depois são
escolhidos modelo, ferramenta e esforço entre os acessos disponíveis. Papel define
responsabilidade, não fornecedor. A sessão principal aplica a regra escrita; o script
não executa chamadas nem troca provedores.

O foco de estudo definido pelo usuário em 06/10 reúne Claude, Codex/OpenAI, MiniMax,
DeepSeek, Gemini, Grok e Jev. São sete opções de estudo, não sete integrações validadas.
Conferir cada combinação usada na documentação oficial e no glossário sob demanda
([capacidades](delegacao/capacidades.md)), sem ranking fixo de marcas. Jev é voltado a decisões estruturadas;
não presumir que todas as opções geram texto, código ou vídeo.

## Passos

1. **Decompor a atividade e classificar o risco:** resultado esperado, domínio, contexto
   necessário e verificação por etapa. Escolher os papéis pelo trabalho e pelo
   `description` do agente, e as skills pelo procedimento necessário. Só delegar
   etapas cuja independência ou especialização justifique o contexto adicional.
2. **Escolher a menor configuração adequada:** consultar o
   [mapa de capacidades](../mapa-capacidades.md) para Claude/OpenAI e as capacidades
   pertinentes no glossário; pesquisar lacunas ou informação desatualizada sob demanda. Filtrar
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

## Onde está o resto

- [triagem](delegacao/triagem.md) — a triagem do `tl` com o `po`: registro, `model`/`effort` por chamada, grafo obrigatório
- [capacidades](delegacao/capacidades.md) — o glossário de capacidades: o que cada entrada precisa ter e o exemplo do vídeo
- [disponibilidade](delegacao/disponibilidade.md) — a Disponibilidade na instalação: perguntas, inventário, flags e executores
- [indisponibilidade](delegacao/indisponibilidade.md) — quota esgotada ou integração fora: refazer a seleção da etapa restante
- [handoff](delegacao/handoff.md) — handoff entre executores (US-20): o que vale quando outro modelo assume
- [controles](delegacao/controles.md) — controles e limites por ferramenta (Claude Code, Codex, outros), conferidos em 05/10/2026
- [templates](delegacao/templates.md) — quais passos do `marvin.mjs` carregam a orientação portátil
- [movido-do-agents](delegacao/movido-do-agents.md) — o que saiu do `AGENTS.md` na US-51: passada de triagem, sessão que coordena, catálogo antes de folha em branco

## US que passaram por aqui

- [US-19](../../Planejamento/Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md)
- [US-20](../../Planejamento/Novos/time/roteamento/US-20-handoff-de-executor-por-cota/Sobre.md)
