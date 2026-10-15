---
tipo: us
estado: ativa
pai: ../Sobre.md
name: US-39-time-na-primeira-rodada
description: "Agentes e skills definidos na 1ª rodada com a LLM depois de instalar, pelo glossário e pelo código, e criados quando faltam. Contradiz o espírito do invariante 4 — espera decisão do dono."
---
# US-39 — time proposto na primeira rodada

**Por quê:** itens 2 e 4 dos requisitos de 14/10 (fundidos): na 1ª rodada com a LLM após instalar, agentes e skills saem do glossário e do código; o que faltar no glossário é criado para aquele contexto. Hoje o template diz que agente só vira arquivo com armadilha concreta e skill na segunda execução (invariante 4, reescrito em 08/10).

**O conflito:** a letra do invariante 4 fica (quem escreve é a LLM com o dono, não o script); o espírito não — "genérico é pior que ausente" é exatamente o agente escrito pelo glossário antes de existir armadilha. A US-26 (concluída) já mostra e oferece as personas.

**Pronto quando:**
1. Decisão do dono registrada em `Contexto/Arquitetura/` (feito em 15/10: invariante 4 **mantido**). O invariante 4 do `AGENTS.md` deste repo e o do template gerado ganham uma frase: a 1ª rodada propõe, e o arquivo nasce pela regra atual.
2. Na 1ª rodada a LLM **propõe** o time a partir do glossário e do código — piso proposto pelo `tl`: só papel ligado a fronteira detectada no código (stack, schema, CI), nunca o catálogo inteiro — registrado como proposta; o arquivo nasce conforme a regra decidida em 1.
3. ~~Medição em projeto real~~: foi para a [US-29](../US-29-medir-economia-do-roteamento/Sobre.md), como amostra a declarar (ela depende de projeto autorizado e de 3 US, e não cabe nesta entrega).
4. Comando gerado novo (se houver) com `writeIfMissing`, `fsw` e entrada na `ATUALIZACOES`.

**Não entra:** o script escrever corpo de agente ou skill; catálogo genérico gerado.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
- `marvin.mjs` — template do `AGENTS.md` gerado, Time/Skills e "só vira arquivo" (`:2495-2524`)
- `marvin.mjs` — README de agentes, "O que ESTE projeto sugere" (`:2865-2893`)
- `marvin.mjs` — comandos gerados (`:3034-3203`), saída final (`:4213-4214`), `ATUALIZACOES` (`:4040-4145`)
- `AGENTS.md` — invariante 4

## Time
Triagem 14/10/2026 (refino: `tl` + `po`). Ordem do dono: por último.
- `po`: decide com o dono o texto do invariante.
- `tl`: guarda a letra do invariante 4 e lê o diff.
- `dev-back` + `qa`.

## Skills
Nenhuma.

## ❓
_(respondidas pelo dono em 15/10; ver Rumo)_

## Rumo
- **14/10/2026** — refinada dos itens 2 e 4 (fundidos pelos dois). Bloqueada pela decisão do invariante 4.

- **15/10/2026** — o dono decidiu: o invariante 4 fica. A 1ª rodada só **propõe**, com o piso do `tl` (papel ligado a fronteira detectada no código), e a proposta fica registrada. O arquivo continua nascendo pela regra atual. Descartados: revogar com o piso, e criar o time inteiro. A decisão está em [decisoes-fechadas.md](../../../../../Contexto/Arquitetura/decisoes-fechadas.md). A medição (item 3) foi para a US-29. Desbloqueada.
- **15/10/2026** — implementada, sem commit. O `dev-back` (Sonnet, medium) implementou; o `qa` (Sonnet, low) e o `tl` (Opus, medium) aprovaram. O `tl` confirmou que o invariante 4 fica na letra e no espírito: o script não escreve corpo de agente nem catálogo. A frase entrou em três lugares: no invariante 4 do `AGENTS.md` deste repo, no `AGENTS.md` gerado (seção "O time") e no README de Planejamento gerado (passo de triagem). Há duas marcas `desde: '2.9.0'`. `node teste.mjs` dá 366 passaram. **Lacuna:** a marca do README de Planejamento não tem check numa base antiga; só a do `AGENTS.md` tem.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
