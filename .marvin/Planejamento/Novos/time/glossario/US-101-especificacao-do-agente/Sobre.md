---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-101-especificacao-do-agente
description: "Declarar o effort no frontmatter dos 5 agentes locais conforme a tabela do Equipe.md; a especificação completa e o --check esperam uma segunda falha."
---
# US-101 — `effort:` nos agentes locais

**Por quê:** 5 dos 6 arquivos em `.claude/agents/` (`tl`, `po`, `dev-back`, `qa`, `scout`) só declaram o modelo; só o `tdd-guide`, do ECC, tem `effort:`. Com isso o esforço da tabela do `Equipe.md` só vale se quem delega o passar na chamada. O custo de não ter o campo não foi medido (o *Time* passa o `effort` de qualquer jeito); o número que paga é 5 de 6.
**Pronto quando:**
1. Os 5 agentes ganham `effort:` conforme o glossário: `tl` e `po` `medium`, `dev-back` `medium`, `qa` e `scout` `low`. O formato é o do `tdd-guide` (`effort: medium`) e a fonte é a documentação já citada em `triagem.md` (a chamada do Agent prevalece sobre o frontmatter).
2. A fonte (link) fica registrada no *Rumo*; `git diff --check` limpo.

**Não entra:** a especificação completa do agente e o `--check` que a confere; criar ou reescrever agente de outro projeto. O `--check` genérico espera uma **segunda falha em agente local** (a do `tdd-guide` já foi coberta pelas US-96 e 97; o texto do ponytail desencontrado é n=1). Se voltar, o `warn` (não `fail`: o código de saída do `--check` é da junction) generaliza o laço de `pendingUpdates` (`marvin.mjs:5440-5452`) em vez de duplicá-lo.

## Perguntas
- ❓ Quando o `--check` voltar, deve rodar em agente **escrito pelo humano** em projeto de terceiro? Acusar ali o bloco "Higiene" do Marvin é impor convenção (a US-97 decidiu que agente à mão é do humano). Mora no `--check` ou no passo 10?

## Fluxos ligados
- [Equipe](../../../../../Contexto/Equipe.md) · [triagem](../../../../../Contexto/Fluxos/delegacao/triagem.md)

## Código tocado
- `.claude/agents/tl.md`, `po.md`, `dev-back.md`, `qa.md`, `scout.md` — frontmatter

## Time
Triagem 01/11/2026 (`tl` e `po` em Opus · médio; régua: edição de configuração, reversível → médio).

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| acrescentar `effort:` nos 5 | sessão principal | Sonnet · médio | 5 linhas de frontmatter; sem código | feito 01/11 |
| conferir | qa | Sonnet · baixo | os 5 arquivos, valores iguais ao `Equipe.md` | feito 01/11: 6 agentes, valores iguais ao `Equipe.md` |

Grafo (01/11): arquivos de agente não têm nó de código; o `--check` (`marvin.mjs:549`) fica sem nó e fora desta versão.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 1 nó(s) de código em 1 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../roteamento/US-19-papel-modelo-esforco/Sobre.md) — 1 nó(s) em comum

## Rumo
- **01/11/2026** — anotada na conversa de 01/11 (especificação + `--check`); o crivo reduziu ao recorte barato. `po` e `tl` concordam que o `--check` genérico espera a segunda falha; o `tl` ainda notou o invariante 3 (supor que o Claude Code lê `effort:` do frontmatter): a documentação já citada em `triagem.md` cobre, e o `tdd-guide` já usa o campo. Depende da US-100 só para o valor do degrau acima, não para estes 5 valores.
- **01/11/2026** — **feito.** `effort:` acrescentado logo abaixo do `model:` nos 5 agentes: `tl` e `po` `medium`, `dev-back` `medium`, `qa` e `scout` `low` (o `tdd-guide`, do ECC, já tinha `medium`). Conferido: os 6 arquivos têm `model` e `effort` iguais à tabela do `Equipe.md`. Fonte do campo: o `tdd-guide` copiado do ECC já o usa, e `triagem.md` cita a documentação de subagentes ("a chamada do Agent prevalece sobre o frontmatter"). Efeito prático: quem chamar um desses agentes sem passar `effort` na chamada agora roda no valor da tabela, não no da sessão. Feito na sessão principal (Sonnet · médio), 5 linhas, sem subagente.

## Evidência
Frontmatter dos 6 agentes em `.claude/agents/`; teste verde. Commit: `git log --grep "US-101 concluída"`.
