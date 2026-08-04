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
