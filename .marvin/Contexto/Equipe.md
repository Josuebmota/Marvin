# Glossário da equipe

Lido na **triagem** (`tl` + `po`), não em toda sessão. Nunca vai para `.claude/agents/`
nem é importado com `@`. Não é lista do que criar: um papel só vira arquivo de agente
com uma armadilha concreta do código; skill, na segunda execução.

| Papel | Dono de | Quando entra | O que não faz | Partida no Claude: modelo · esforço |
|---|---|---|---|---|
| sessão principal | dividir a atividade, delegar, juntar e registrar | sempre — é quem conversa com o dono | implementar o que um papel faz; julgar invariante (é do `tl`) | Sonnet · médio |
| `tl` | invariantes, diff, decisão de rumo | mudança que toca invariante, escreve no disco de alguém ou mexe em atualização/release | implementar a feature; achar arquivo | Opus · médio |
| `po` | o porquê, o critério de pronto, a prioridade | ao abrir ou refinar uma US | decidir como o código é feito | Opus · médio |
| `dev-front` | tela e componente | a atividade muda a interface | serviço, schema, deploy | Sonnet · médio |
| `dev-back` | serviço, regra, integração | a atividade muda regra ou integração | tela; fechar a própria revisão | Sonnet · médio |
| `qa` | evidência: teste, cenário, o que ainda não foi provado | antes de fechar qualquer US | corrigir o código que reprova | Sonnet · baixo |
| `scout` | achar arquivo, símbolo, uso — e só isso | leitura delimitada, sem julgamento | decidir, editar, concluir | Haiku · baixo |
| `design` | a tela nova: fluxo, estado, acessibilidade | há tela nova | implementar o componente | Sonnet · médio |
| `dba` | schema e migração | há schema ou migração | regra de negócio da aplicação | Sonnet · médio |
| `sec` | auth e dado sensível | há auth, segredo ou dado pessoal | aprovar a própria correção | Sonnet · médio |
| `infra` | deploy e CI | há deploy, pipeline ou ambiente | regra de negócio | Sonnet · baixo |

`dev` serve de fusão de `dev-front` + `dev-back` quando o projeto tem uma fronteira só.

**É isto que barateia — quem decide não é quem executa.** O `tl` e o `po` julgam no Opus;
a sessão principal coordena no Sonnet (ela relê o contexto inteiro a cada turno, então o
modelo dela pesa mais que o de qualquer papel); quem executa começa no degrau abaixo
(`dev-back` no Sonnet, esforço médio), e quem só
localiza vai no Haiku. Spec clara faz o pensamento antes: o esforço parte do que a tabela diz, nunca acima.

**Regra do sênior:** começa no degrau mais barato que serve (Haiku para tarefa mecânica
bem especificada); a verificação (`qa`, teste) confere; **sobe só se falhar** — esforço
antes de modelo —, com o motivo no *Time* da US. Tarefa trivial vai direto, sem triagem.
A última coluna é ponto de partida no Claude, não regra fixa: com outro fornecedor,
consulte o guia de IA em [`IA.md`](IA.md).

**Papel sem arquivo de agente:** ao delegar, passe na chamada o modelo da tabela (o parâmetro `model` do subagente); sem isso ele herda o modelo da sessão — e a execução sai no Opus. Ao criar o arquivo do papel, declare `model:` e `effort:`.

**A sessão principal abre no Sonnet** (`.claude/settings.json`); troque com `/model` quando a
conversa pedir julgamento.

**O ECC é a fonte do time.** O Marvin já copiou para `.claude/agents/` e `.claude/skills/` só o que
este projeto usa (a lista está em `ferramentas.md`), com `model`/`effort` desta tabela e sem as
frases que fazem o agente se chamar sozinho (`MUST BE USED`, `Use PROACTIVELY`).

**Precisa de agente ou skill que o projeto não tem? Procure primeiro no ECC** (`<ecc>/agents`,
`<ecc>/skills`, com `<ecc>` = `~/.claude/plugins/marketplaces/ecc`) e instale só aquele: copie
`<ecc>/agents/<id>.md` para `.claude/agents/` ou `<ecc>/skills/<id>/` para `.claude/skills/`.
Não use o `install-apply.js`: cada `--with`/`--skills` traz o módulo inteiro (dezenas de agentes,
comandos e regras sempre carregadas). Depois ajuste `model`/`effort` por esta tabela e troque na
`description` o que faz o agente se chamar sozinho por "Chame quando a linha do Time indicar este
papel." Só escreva do zero se o ECC não tiver.
