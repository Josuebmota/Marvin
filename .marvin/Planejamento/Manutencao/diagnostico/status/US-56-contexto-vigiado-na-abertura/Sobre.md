---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-56-contexto-vigiado-na-abertura
description: "O hook de toda sessão (--status --curto) avisa quando o contexto fixo passa do teto ou a nota vira relatório; ponteiro de contexto na nota não é US."
---
# US-56 — o contexto fixo é vigiado na abertura de cada sessão

**Por quê:** pedido do dono em 15/10 ("isso deveria virar regra do Marvin"), depois de atualizar três projetos reais para a 3.0.0. Na `parci`, o contexto fixo chegou a ~12,1k tk e a `onde_paramos.md` a 14 KB sem ninguém ver: os avisos de teto só saíam no `marvin` completo, e o hook de toda sessão roda `--status --curto`. Na `heimnor`, ponteiros da nota para canais e ADR (contexto, não US) apareciam com ✗, e US agrupadas numa mesma linha eram acusadas de "fora da nota".

**Pronto quando:**
1. `--status --curto` avisa, em uma linha cada, contexto fixo acima de `FIXED_TK_CEILING` e nota acima de `NOTE_CEILING`; abaixo do teto, nada.
2. Ponteiro da nota para arquivo que não é nó de planejamento não vira US (sem ✗, sem problema); o `--status` completo agrega numa linha.
3. Seção "Contexto" da nota não é acusada como relato; toda US linkada em qualquer ponto da nota conta como "na nota".
4. `node teste.mjs` cobre os três.

**Não entra:** enxugar sozinho — o script avisa; quem move o texto é quem conhece o projeto (invariante 4).

## Código tocado
- `marvin.mjs` — `computeStatus` (ponteiros, seções, `notInNote`), `printStatus` (`--curto`)
- `teste.mjs`

## Time
- `dev-back` Sonnet médio — itens 1 e 2 (avisos e ponteiro de contexto)
- sessão principal — itens 3 (seção Contexto, todos os links), achados ao verificar na `heimnor`
- `tl` dispensado pela regra de risco: só exibição, sem escrita, sem `UPDATES`

## Rumo
- **15/10/2026** — aberta e concluída na mesma sessão da atualização dos projetos para a 3.0.0. Aplicada na prática: `parci` de 12.086 → 6.484 tk (nenhuma das 187 linhas removidas ficou sem destino, conferido por script); `heimnor` com a nota só de US ativas e canais em "Contexto".

## Evidência
- `node teste.mjs` → 408 passaram (8 checks novos).
- `heimnor-development`, `--status --curto`: nenhum ✗ de canal; nenhum "ativa but not in the note"; nenhum "look like a report".
