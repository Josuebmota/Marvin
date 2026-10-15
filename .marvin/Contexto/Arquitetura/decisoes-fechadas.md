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
