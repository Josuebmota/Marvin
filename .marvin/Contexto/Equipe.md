# Glossário da equipe

Lido na **triagem** (`tl` + `po`), não em toda sessão. Nunca vai para `.claude/agents/`
nem é importado com `@`. Não é lista do que criar: um papel só vira arquivo de agente
com uma armadilha concreta do código; skill, na segunda execução.

| Papel | Dono de | Quando entra | O que não faz | Ponto de partida (Claude) |
|---|---|---|---|---|
| `tl` | invariantes, diff, decisão de rumo | toda mudança que toca um invariante ou o rumo | implementar a feature; achar arquivo | Opus |
| `po` | o porquê, o critério de pronto, a prioridade | ao abrir ou refinar uma US | decidir como o código é feito | Opus |
| `dev-front` | tela e componente | a atividade muda a interface | serviço, schema, deploy | Sonnet |
| `dev-back` | serviço, regra, integração | a atividade muda regra ou integração | tela; fechar a própria revisão | Sonnet |
| `qa` | evidência: teste, cenário, o que ainda não foi provado | antes de fechar qualquer US | corrigir o código que reprova | Sonnet |
| `scout` | achar arquivo, símbolo, uso — e só isso | leitura delimitada, sem julgamento | decidir, editar, concluir | Haiku |
| `design` | a tela nova: fluxo, estado, acessibilidade | há tela nova | implementar o componente | Sonnet |
| `dba` | schema e migração | há schema ou migração | regra de negócio da aplicação | Sonnet |
| `sec` | auth e dado sensível | há auth, segredo ou dado pessoal | aprovar a própria correção | Sonnet |
| `infra` | deploy e CI | há deploy, pipeline ou ambiente | regra de negócio | Sonnet |

`dev` serve de fusão de `dev-front` + `dev-back` quando o projeto tem uma fronteira só.

**Regra do sênior:** começa no degrau mais barato que serve (Haiku para tarefa mecânica
bem especificada); a verificação confere; sobe só se falhar, com o motivo no *Time* da US.
A última coluna é ponto de partida no Claude, não regra fixa: com outro fornecedor,
consulte o guia de IA em [`IA.md`](IA.md).
