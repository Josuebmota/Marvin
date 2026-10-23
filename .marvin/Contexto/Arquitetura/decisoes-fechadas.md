# Decisões que não se reabrem

> As restrições de desenho do marvin. Relitigar qualquer uma exige fato novo.
> Movido de `onde_paramos.md` em 09/09/2026, quando a nota passou do teto e o próprio
> marvin a acusou. O regime aqui é outro: **acrescenta, nunca sobrescreve.**

- **Nenhuma dependência de runtime.** O `package.json` existe só para dar `bin`. Se
  aparecer uma `dependency` ali, a regra foi quebrada.
- **Um arquivo só.** Não quebrar `marvin.mjs` em módulos — poder ler de cima a baixo é
  feature numa ferramenta que escreve no repositório dos outros.
- **Sem arquivo de config.** Flags são a interface inteira.
- **Sem número de versão gravado.** O passo 10 confere o conteúdo real dos arquivos; um
  `.marvin-versao` seria mais um artefato derivado capaz de envelhecer em silêncio.
- **Graphify entra como consulta, nunca como hook.** Medido: o grafo dele responde com
  função apagada, arquivo e linha, marcada `[EXTRACTED]`, sem avisar. O hook oficial diz
  `MANDATORY` sobre isso. Ganho real medido: **9,3×**, não os 71× divulgados — e contra
  "ler o repo inteiro". Só compensa em pergunta estrutural. **Reafirmado em 09/08**, com
  caso real: num monorepo o hook estava exigindo consulta a um grafo que não tinha uma
  linha do produto dentro. Garantia de uso não é garantia de acerto.
- **Nada que gaste dinheiro ou tempo do usuário roda sem flag.** Nomear comunidade exige
  LLM, então o padrão é `--no-label`. `--graphify-label` existe, mas não é o caminho feliz.
- **Invariante 4 mantido; a 1ª rodada só propõe o time** (dono, 15/10/2026, US-39). Depois de
  instalar, a 1ª rodada com a LLM **propõe** papéis e skills a partir do glossário e do código.
  O piso é o do `tl`: só papel ligado a uma fronteira detectada no código (stack, schema, CI),
  nunca o catálogo inteiro. A proposta fica registrada, e o arquivo continua nascendo pela regra
  atual: agente com armadilha concreta, skill na segunda execução. Descartados: revogar com o
  piso (arquivo já na 1ª rodada) e criar o time inteiro, que é o "genérico pior que ausente".
- **Graphify "obrigatório" nos projetos gerados = `sim` por padrão, nunca aborto** (dono,
  15/10/2026, US-38). Com graphify no PATH, o registro grava `sim` sem perguntar. Sem ele, a
  instalação termina com um aviso forte e o `marvin` continua. O texto "rota de toda busca" e a
  troca de "Grep é mais barato para localizar" esperam a medição Grep × grafo (US-43). A
  decisão "consulta, nunca hook" acima continua valendo até lá.
- **Grafo obrigatório no passo de estrutura** (dono, 15/10/2026). Antes de decidir, o `tl`, o
  `po` e os comandos `/us`, `/refinar` e `/retomar` rodam `graphify affected` e `graphify
  explain` sobre o *Código tocado*. O que o grafo respondeu fica no *Time* da US. Grep/Glob
  continuam só para localizar (medido: ~18 tk contra ~1.650 pelo grafo). O frescor vem do
  hook `post-commit` (`--graphify-git-hook`), que é um hook de git e não o hook do Claude:
  "consulta, nunca hook do Claude" continua valendo.
- **O que o Marvin é: uma equipe barata de desenvolvimento** (dono, 15/10/2026). Ele entrega o
  mesmo esforço e o mesmo resultado de uma equipe, com o menor custo de token, como uma equipe
  terceirizada que se contrata. Você entrega as atividades, e o Marvin lembra de tudo pelo
  grafo (graphify) e lista as pendências sem gastar token. O `po` e o `tl` montam a equipe
  de cada atividade (papel, modelo, esforço) como um Scrum Master, em duas cerimônias: refino
  e desenvolvimento. Os subagentes executam no menor recurso que entrega o mesmo resultado.
  Substitui a régua "suporte, não motor / monta a base e sai da frente".
  - **O que a decisão separa:** o script continua sendo a memória (determinístico, zero
    dependência, não gasta token). A orquestração é dos agentes e dos comandos.
  - **Muda o invariante 4:** a instalação passa a trazer o **glossário da equipe**: cada
    papel com especialidade, atribuições e quando entra (`tl`, `po`, `dev-back`,
    `dev-front`, `design`, `dba`, `qa`, `scout`…). Ele fica como documento lido na
    triagem, não em `.claude/agents/`, para não carregar em toda sessão. O script segue sem
    escrever as armadilhas de um projeto específico; elas nascem na 1ª rodada, quando a LLM
    mapeia o projeto. Revisa a decisão da US-39 desta mesma data ("a 1ª rodada só propõe").
  - **Reabre a US-25:** o Superpowers deixa de ser "só citar no README" e passa a ser
    avaliado para uso, ao lado do graphify, como ferramenta de contexto.
  - **Hierarquia:** Epic → Feature → US/**Defect** → **Task**. Hoje só existem Epic, Feature e
    US; bug vira US em `Manutencao/`.
  - **A aplicação vem por US**, refinadas a partir das anotações ⚪ de 15/10/2026 na nota.
    Sem a medição da US-29, "menor custo" continua sendo promessa.
- **Ponto de partida por papel no Claude** (dono, 15/10/2026). Opus para `tl` e `po`. Sonnet
  para `dev-*`, `qa`, `design` e `dba`. Haiku para os mesmos papéis em tarefa simples e para
  o `scout`. Vale a regra do sênior: começa no mais barato que serve, verifica e só sobe se a
  verificação falhar. O roteamento é regra escrita, aplicada sem chamada cara. A tabela está em
  [equipe-barata.md](equipe-barata.md). Revoga o "Não entra" da US-42 ("padrão por papel só
  depois do número"): o padrão entra agora, e a US-29 confirma ou corrige. Referência: o reel de
  @donimas, que é simulação do autor e não benchmark.
- **O Marvin é o único plugin do Claude e o curador das ferramentas, por projeto** (dono,
  15/10/2026). Nada de ferramenta global: ao ser chamado num projeto, o Marvin instala no
  **escopo daquele projeto** só o que a equipe usa (ECC, graphify, ponytail, Superpowers) e guarda
  o que só ele tem: memória versionada, grafo das US, equipe e roteamento de custo. Motivo: o
  que é global é pago em toda sessão de todo projeto, inclusive onde não serve. Responde ao ❓
  "carapaça/plugin" da arquitetura: é empacotamento de verdade, não metáfora.
  - **Limpeza feita na máquina do dono no mesmo dia, reversível:** o ECC global (16 agentes, 22
    skills, 26 comandos, inclusive as de .NET) foi movido para `~/.claude/_backup-2026-10-15/`.
    Também saíram os plugins firebase (duas cópias), codex, copilot-studio e ponytail (desligados),
    os 12 hooks do Orca, o MCP Higgsfield deste projeto e as seções Ruflo e graphify do
    `CLAUDE.md` global. Cópia dos três arquivos de configuração está no mesmo backup.
  - **Esbarra em:** "zero dependência / só npm" (empacotar como plugin do Claude é outro canal de
    distribuição) e invariante 3 (convenção de plugin muda rápido). A US-50 trata os dois.
- **Superpowers fica fora** (dono, 22/10/2026). Reafirma o par da US-48: +31% de custo para o
  mesmo resultado. O desenho original o incluía; a medição venceu. Reabre só com par que mostre
  ganho.
- **Ponytail: ligar e medir** (dono, 22/10/2026). Liga só neste projeto
  (`.claude/settings.local.json`), mede o par com × sem no `dev-back` (US-68) e vira `sim` só se
  pagar. Até lá, confiança baixa. A detecção precisa ver o `enabledPlugins` antes (US-67).
- **A matriz chama os agentes do ECC; o que não casa sai** (dono, 22/10/2026). A triagem usa
  agente do ECC quando a etapa casa com o verbo dele (teste-primeiro → `tdd-guide`, revisão de
  linguagem → `<lang>-reviewer`, build → `*-build-resolver` só com build); agente do ECC que não
  casa com nenhuma etapa sai do projeto e não volta na rodada seguinte (US-69).
- **Ferramenta é obrigatória no Marvin quando ajuda; medida e não pagou, sai do obrigatório** (dono,
  23/10/2026). O Marvin é o apoio que se acopla ao projeto para o desenvolvimento por LLM: o que ajuda
  nesse apoio — economia de tokens, memória, montagem de personas, decisão, ou outra coisa — vira
  obrigatório; quando aparecer algo novo que otimize, acha-se e acopla-se. O mapa de hoje: **ECC** para
  personas e skills, **graphify** para economia e memória, **ponytail** para decisão. O ponytail foi
  medido no `dev-back` (US-68: +22%, n=1) e não pagou, então deixa de ser obrigatório (US-71); o uso
  dele em **decisão** (`tl`/`po`) nunca foi medido — é a condição para ele voltar.
