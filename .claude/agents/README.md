# Time deste projeto

Um `.md` por papel:

```yaml
---
name: qa
description: quando usar este papel — é isto que decide se ele é chamado
tools: Read, Grep, Glob, Bash
model: sonnet
---
```

## Referência de modelos — Claude Code

Modelos de partida, não escolhas permanentes por papel. No piloto local da US-19,
escolha por tarefa seguindo [o fluxo de delegação](../../.marvin/Contexto/Fluxos/delegacao.md).
O frontmatter dá a configuração inicial; registre o que a ferramenta realmente aplicou
quando puder conferir. Não trate esse mapeamento como equivalência com outras LLMs.

- **haiku** — só recuperação delimitada (achar arquivo, símbolo, uso).
  Erra onde a tarefa exige segurar um invariante e notar o que está *faltando*.
- **sonnet** — implementação, QA, documentação.
- **opus** — julgamento: arquitetura, conservação de dado, revisão de diff.

Sempre tenha um papel `tl` que lê diff e é dono dos invariantes. Opus é a referência
inicial Claude; a escolha efetiva segue tarefa, risco, capacidades e acesso, sem
equivalência automática com outros modelos. Instalar um plugin não fixa o revisor.

## O que ESTE projeto sugere

Detectado aqui: **Node/JS**.

- **Comece com dois papéis:** o `tl` acima e **um** de implementação. O terceiro só
  quando doer de verdade. Papel a mais é contexto fixo em toda sessão.
- **Não crie papel vazio para preencher a pasta.** Um `.md` sem as armadilhas concretas
  deste código entra no contexto de toda sessão e não devolve nada. Genérico é pior que
  ausente — é por isso que o marvin gera esta pasta e não os agentes.

> Este repositório tem os papéis `po` e `tl` escritos, com escopo e armadilhas concretas.
> Outros papéis só ganham arquivo quando a atividade exigir; o Marvin não escreve
> agentes genéricos para preencher a pasta.

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

## Contexto da delegação

Os agentes Claude deste repo não configuram memória persistente. O prompt de delegação
deve dizer o objetivo, os arquivos relevantes e as armadilhas; não dependa de histórico
que não foi fornecido. Contexto herdado ou fork depende da ferramenta usada e deve ser
registrado no piloto, porque também muda o custo.

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
