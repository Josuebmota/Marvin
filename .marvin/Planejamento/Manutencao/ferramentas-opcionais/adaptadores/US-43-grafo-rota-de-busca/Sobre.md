---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-43-grafo-rota-de-busca
description: "Fatia da US-38 que espera número: medir Grep × grafo em 'onde está X' e, só com o resultado, reescrever o texto gerado ('O grafo é opcional', 'Grep/Glob é mais barato')."
---
# US-43 — o grafo como rota de busca, só depois da medição

**Por quê:** é o que sobrou da [US-38](../US-38-graphify-obrigatorio/Sobre.md), que o dono fatiou em 15/10/2026. Essa parte contradiz duas decisões fechadas: "consulta, nunca hook" e "Grep é mais barato para localizar". Reabrir as duas pede fato novo, e o fato é a medição.

**Pronto quando:**
1. **Medição:** o mesmo tipo de pergunta "onde está X" é respondido pelo grafo e pelo Grep, com tokens e acerto, em US reais (amostra da [US-29](../../../../Novos/time/roteamento/US-29-medir-economia-do-roteamento/Sobre.md)). Sem ela, a regra "rota de toda busca" não entra.
2. **Texto gerado:** o `AGENTS.md`/`CLAUDE.md` gerado ("O grafo é opcional", "Grep/Glob é mais barato") muda conforme o item 1, com marca na `ATUALIZACOES` e `desde:`. Se a medição não sustentar a mudança, a US fecha registrando isso.

**Não entra:** graphify como hook; abortar sem graphify.

## Código tocado
- `marvin.mjs` — template "O grafo é opcional"; seção Grafo de código do `CLAUDE.md` gerado; `ATUALIZACOES`
- `AGENTS.md`, `README.md`, `README.pt-BR.md`

## Time
_(a triar quando a medição existir)_

## Rumo
- **15/10/2026** — aberta ao fatiar a US-38 (decisão do dono). Espera a medição da US-29.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
