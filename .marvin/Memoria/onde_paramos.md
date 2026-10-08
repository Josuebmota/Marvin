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

**Atualizado:** 08/10/2026

## Em andamento

- [US-19-papel-modelo-esforco](../Planejamento/Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — onboarding implementado; próximo passo: operar glossário e medir 3–4 US para avaliar ajustes da política
- [US-27-atualizar-a-base-do-marvin](../Planejamento/Manutencao/diagnostico/atualizacoes/US-27-atualizar-a-base-do-marvin/Sobre.md) — aberta 08/10/2026; próximo passo: `dev-back` aplica os 10 itens do passo 10 (lista no `Sobre.md`), `qa` roda o `--dry-run`, `tl` lê o diff
- [US-21](../Planejamento/Novos/ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — implementada e aprovada pelo `tl` em 08/10/2026, **não commitada**; falta commit, `package.json` 2.2.0 e Releases
- Fila refinada em 07/10/2026 (`po` + `tl`), nesta ordem: US-23 (fechada na 2.0.1) → US-21 (acima) → [US-20](../Planejamento/Novos/time/roteamento/US-20-handoff-de-executor-por-cota/Sobre.md) (itens 1 e 3, documentação). [US-22](../Planejamento/Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) adiada

## Travado

- US-19 — faltam amostras comparáveis antes/depois; detalhes no nó acima
