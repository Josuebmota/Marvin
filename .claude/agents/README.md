# Time deste projeto

Um `.md` por papel:

```yaml
---
name: qa
description: quando usar este papel — é isto que decide se ele é chamado
tools: Read, Grep, Glob, Bash
# model: <modelo válido nesta ferramenta> — declare; sem esta linha o agente herda a sessão
---
```

Sem `model:`, o agente herda o modelo da sessão. Declare o modelo ou registre na US
por que ele herda; o `marvin --status` avisa o agente que herda.

## Modelo por atividade

Papel define responsabilidade. Atividade, capacidade e acesso determinam modelo e
esforço; consulte `.marvin/Contexto/IA.md`.
Registre solicitado/aplicado em Time e Skills da US; não fixe fornecedor pelo plugin.
O papel `tl` lê diff e é dono dos invariantes, com capacidade adequada ao risco.
O modelo de cada etapa vem da tabela do *Time* da US; o `model` do frontmatter é só a partida
([fluxo de delegação](../../.marvin/Contexto/Fluxos/delegacao.md)). Haiku só para recuperação
delimitada: erra onde a tarefa exige segurar um invariante e notar o que está *faltando*.

## O que ESTE projeto sugere

Detectado aqui: **Node/JS**.

- **Uma fronteira só:** `dev-front` e `dev-back` da base do `AGENTS.md` podem ser um
  `dev` único aqui. O resto da base (`tl`, `po`, `qa`, `scout`) vale igual.
- **Este repositório** tem os papéis `po`, `tl`, `dev-back`, `qa` e `scout` escritos, com escopo e
  armadilhas concretas (dono, 08/10/2026). `design`, `dba`, `sec` e `infra` só ganham arquivo
  quando a atividade exigir.
- **Não crie papel vazio para preencher a pasta.** Um `.md` sem as armadilhas concretas
  deste código entra no contexto de toda sessão e não devolve nada. Genérico é pior que
  ausente — é por isso que o marvin gera esta pasta e não os agentes.

### Ponytail: em que papel entra

Este projeto usa o ponytail (`.marvin/ferramentas.md`). A escada dele vale para quem
**implementa** sem convenção escrita — não para quem lê diff ou decide requisito. Sugestão,
não regra; o corpo de cada agente é seu. Aqui, `tl` e `po` existem e **não** o carregam:

| papel | ponytail | por quê |
|---|---|---|
| `dev-back` / `dev-front` | **sim** | implementação: o menor diff que funciona |
| `qa` | talvez | o "um check executável" dele conflita com suíte real |
| `tl` | **não** | lê diff; precisa do porquê, não do mais curto |
| `po` | **não** | questiona requisito — a escada começa depois disso |
| `scout` | **não** | recuperação em haiku; não escreve código |


## Subagente NÃO tem memória

Cada um nasce com contexto limpo: não vê a conversa, não vê a memória do
projeto, não vê o que outro agente fez. Ele sabe só (1) o próprio .md,
(2) o prompt que recebe, (3) o que ler do disco.

**Por isso o .md dele É a memória dele.** Escreva as armadilhas concretas
lá dentro. Genérico ("você é um dev sênior de React") não vale nada;
concreto ("`conta.saldo` é a abertura, não o saldo exibido") evita bug.

Escreva os agentes **depois** de conhecer o projeto, nunca antes.

## Higiene — coloque isto em TODO agente que escreve arquivo

```
NUNCA deixe lixo no repositório:
- não crie arquivo que a tarefa não pediu — nem README, nem resumo, nem relatório
- não crie arquivo "temporário" na raiz do projeto; use o diretório de scratchpad
- prefira editar arquivo existente a criar um novo
- se um comando falhar, confira se ele não deixou arquivo de nome estranho
  (um caractere só, começando com \`, {, ,, -) — é redirect de shell mal-formado
- ao terminar, rode `git status --short` e explique cada arquivo novo.
  Se não souber justificar, apague.
```

Não é preciosismo: um `.gitignore` pega os padrões conhecidos, a regra pega o resto.
Arquivo vazio commitado passa despercebido por meses.
