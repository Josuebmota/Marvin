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
