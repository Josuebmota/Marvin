---
name: onde-paramos
aliases: ["onde-paramos", "ONDE PARAMOS"]
description: "ÚNICA porta de entrada do Marvin. Só ponteiros para as US em andamento — sempre sobrescrita."
tags: [moc, entrada]
metadata:
  type: project
  atualizado: 2026-09-16
---

# ▶ ONDE PARAMOS

> Esta nota é versionada e **pública**, porque este repositório é público. Ela é uma
> lista de ponteiros: o estado, as decisões e o rumo de cada US moram no `Sobre.md` dela —
> **não aqui**. Esta nota carrega em TODA sessão; o que ela aponta só carrega quando é seguido.
>
> - Concluiu e foi validada → entra em `Releases/<versao>.md` com a evidência, e **sai daqui**.
> - Duas sessões em paralelo editam **linhas diferentes**; nenhuma reescreve a outra.
> - Criar `onde_paramos_<data>.md` **ou uma seção de relato aqui dentro** é o mesmo erro:
>   o histórico já está no `git log`, e o porquê já está no Rumo da US.

**Atualizado:** 09/10/2026

## Em andamento

- [US-19-papel-modelo-esforco](../Planejamento/Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — medição bloqueada: histórico não tem pares atribuíveis; instrumentar 3–4 tarefas reais futuras antes de executá-las
- [US-20-handoff-de-executor-por-cota](../Planejamento/Novos/time/roteamento/US-20-handoff-de-executor-por-cota/Sobre.md) — concluída e aprovada pelo `tl`; aguarda a próxima release já motivada para entrar no índice, sem bump por documentação interna
- [US-28-modelos-por-papel-claude-e-chatgpt](../Planejamento/Novos/time/roteamento/US-28-modelos-por-papel-claude-e-chatgpt/Sobre.md) — 28a redigida, ensaiada e aprovada por `po` + `tl`; 28b aguarda segunda triagem real com diferença de disponibilidade

- Fila refinada em 07/10/2026 (`po` + `tl`), nesta ordem: US-23 (fechada na 2.0.1) → US-21 (fechada na 2.2.0) → [US-20](../Planejamento/Novos/time/roteamento/US-20-handoff-de-executor-por-cota/Sobre.md) (itens 1 e 3, documentação). [US-22](../Planejamento/Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) adiada

## Travado

- US-19 — faltam 3–4 pares comparáveis com contexto, checks, configuração e custo atribuíveis; não repetir trabalho concluído. Detalhes e candidatas no nó acima.
