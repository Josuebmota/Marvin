---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-88-travas-por-hook
description: "Rituais do Marvin que hoje são só conselho (teste antes do commit, tl depois da última edição) viram trava por hook do Claude Code (PreToolUse/Stop), escritos pelo script no .claude/settings.json. Separada da US-86: não precisa de plugin."
---
# US-88 — travas por hook

**Por quê:** pergunta do dono (27/10/2026): "como eu sei que a LLM está seguindo o Marvin a todo momento?". O `--status` mede papel, modelo e custo pelas transcrições, mas os rituais são só conselho: o hook que o script escreve (`SessionStart`, `marvin.mjs:4250`) avisa, não impede. Caso de 29/10: um commit da nota saiu sem `node teste.mjs` antes, contra a convenção do AGENTS.md. Separada da [US-86](../../../../Manutencao/publicacao/empacotamento/US-86-plugin-fino-sobre-o-npm/Sobre.md) por decisão do dono (29/10): a trava não precisa de plugin.

**Pronto quando:** _(a refinar)_ — esboço:
1. Escolher os rituais que viram trava, começando por um: `git commit` bloqueado (`PreToolUse` no Bash) quando há edição de código depois do último teste que passou.
2. Conferir o formato atual de hook do Claude Code antes de escrever (invariante 3; o `SessionStart` já sai com confiança média).
3. Idempotente e sem sobrescrever hook do usuário (invariante 2), com saída explicada: a trava diz o que rodar.
4. Medir antes e depois: quantos commits sem teste aparecem nas transcrições.

**Não entra:** plugin (US-86); trava que exige saber o projeto (invariante 4); bloquear o humano, só a LLM.

## Perguntas
- ❓ 1. Como o hook sabe que o teste passou depois da última edição? Marca em arquivo git-ignorado escrita pelo próprio teste, ou leitura da transcrição? (a refinar com o `tl`)

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
- `marvin.mjs` — passo do `.claude/settings.json` (hook `SessionStart`)
- `teste.mjs`

## Time
_(a refinar — `/refinar` com `tl` e `po`)_

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|

## Skills
_(a refinar)_

## Rumo
- **29/10/2026** — anotada: separada da US-86 por resposta do dono à ❓1 dela.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
