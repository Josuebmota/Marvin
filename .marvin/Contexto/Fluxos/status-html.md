# Fluxo status-html

`marvin --status --html`: a única forma do `--status` que **escreve** — e só em
`.marvin/.status/` (ignorada pelo git, derivada). Regera um `index.html` único, sem rede e
sem lib, e anexa um ponto por commit em `historico.jsonl`. A página é a *leitura*; o jsonl é
a *medida*. Mudar a página nunca pode mudar a medida.

## Passos
1. medir — `marvin.mjs` — `calcularStatus` (ativas, avisos/problemas, epics, contexto fixo, grafo, gastos)
2. garantir `.status/` no `.gitignore` — `marvin.mjs` — `escreverStatusHtml`, início
3. registrar o ponto — `marvin.mjs` — `escreverStatusHtml`: `git log -1 --format=%h%x09%cI` dá commit e data; mesmo commit já gravado → não duplica; sem git → não grava, só desenha; série corta em 500
4. desenhar — `marvin.mjs` — `escreverStatusHtml`: `grafico` (polyline, uma função para as séries por commit), `barras` (tokens por dia), `tabelaModelos`, `rede` (força em JS inline, posições iniciais determinísticas), template `html`
5. embutir a série — `<script type="application/json" id="historico">` — `file://` bloqueia fetch, então nada é lido de fora
6. teste — `teste.mjs` — passo 9x: sem `--html` não nasce `.status/`; dois runs no mesmo commit = um ponto; HTML embute a série e não tem `<script src=`

## Regras que não podem quebrar
- **O que é medido não muda com o layout.** Qualquer US de template deve deixar `historico.jsonl` e a saída do `--status` texto byte a byte iguais. O `ponto` gravado é a única ponte entre medida e página — campo novo no ponto é mudança de medida, não de layout.
- Zero rede, zero asset externo: sem `<link>`, sem `<script src=`, sem fonte. Tokens visuais são copiados como **valores** para dentro do `<style>`.
- Determinístico: sem `Date.now()`/`Math.random()`; a data vem do commit, a espiral da rede é fixa.
- Toda escrita passa por `fsw` — o `--dry-run` não pode mentir.
- `--curto` silencia o log, não a escrita.

## US que passaram por aqui
- [US-07](../../Planejamento/Novos/organizacao-por-grafo/script/US-07-status-html/Sobre.md) — a série histórica e a primeira página
- [US-15](../../Planejamento/Novos/organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — hierarquia, tema e "o que fazer" primeiro; a nota nasceu aqui
