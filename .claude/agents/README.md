# Time deste projeto

Um `.md` por papel:

```yaml
---
name: qa
description: quando usar este papel — é isto que decide se ele é chamado
tools: Read, Grep, Glob, Bash
model: haiku | sonnet | opus
---
```

## Modelo por papel

- **haiku** — só recuperação delimitada (achar arquivo, símbolo, uso).
  Erra onde a tarefa exige segurar um invariante e notar o que está *faltando*.
- **sonnet** — implementação, QA, documentação.
- **opus** — julgamento: arquitetura, conservação de dado, revisão de diff.

Sempre tenha um papel `tl` em **opus** que lê diff e é dono dos invariantes.

## O que ESTE projeto sugere

Detectado aqui: **Node/JS**.

- **Comece com dois papéis:** o `tl` acima e **um** de implementação. O terceiro só
  quando doer de verdade. Papel a mais é contexto fixo em toda sessão.
- **Não crie papel vazio para preencher a pasta.** Um `.md` sem as armadilhas concretas
  deste código entra no contexto de toda sessão e não devolve nada. Genérico é pior que
  ausente — é por isso que o marvin gera esta pasta e não os agentes.

> Este repositório **não tem agente nenhum escrito**, e isso é coerente: são ~1810 linhas
> num arquivo só, que cabem inteiras na cabeça de quem lê. Papel aqui seria contexto fixo
> pago em toda sessão sem devolver nada — exatamente o que o passo 4 acusa nos outros.

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
