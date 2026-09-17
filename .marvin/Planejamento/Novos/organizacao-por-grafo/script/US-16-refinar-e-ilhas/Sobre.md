---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`

**Por quê:** entre `/us` (abre para trabalhar) e `/fechar` não existe o passo que transforma
anotação em US **sem começar a implementar**. No Parci (17/09/2026) isso nasceu à mão como
`/refinar` e rodou três vezes no mesmo dia — e junto nasceu o erro: "ilhas" como times
paralelos, com quadro de estado à mão em três arquivos, branch e worktree por ilha
(`.marvin/historico/ilhas-2026-09-17/` lá). Foi desfeito no mesmo dia. O que sobreviveu à
poda: **o corte por arquivo é o que diz quais US atacar em sequência** — mas isso é
derivável do `Código tocado`, não precisa de campo nem de quadro. E US refinada e não
iniciada hoje só pode ser `ativa`: no Parci são 27 assim, e o `--status` reclama de cada uma.

**Pronto quando:**
1. `marvin --us <caminho> --refinada` cria a US com `estado: refinada` e **não** aponta na
   nota; `/refinar` gerado em `.claude/commands/` (crivo `tl` + `po` → US com `Pronto quando`
   e `Código tocado`, na posição da fila; nada de código).
2. `--status` agrupa as US `refinada` + `ativa` em **ilhas** = componentes conexos por arquivo
   do `Código tocado`; arquivo tocado por ≥3 US é **núcleo** e sai do agrupamento (senão
   engole tudo); US sem `Código tocado` fica em "sem mapa". Sem grafo — só o parser que
   `--fechar` já usa. `--curto` imprime uma linha por ilha.
3. `/retomar` gerado oferece **duas portas**: desenvolver a ilha da vez (as US dela, em
   ordem, em palavras) ou refinar. Uma sessão de desenvolvimento por vez.
4. `refinada` não dispara "ativa but not in the note"; `--release` continua só com
   `concluida`; nota aceita seção "Anotações"/"Refino"; `ATUALIZACOES` marca a porta nova
   do `/retomar`; os dois READMEs citam `/refinar`; `node teste.mjs` verde com um caso novo.

**Não entra:** branch, worktree ou sessão por ilha (desfeito no Parci); qualquer campo
`Ilha:` no `Sobre.md`; paralelismo — ilha ordena, não paraleliza.

## Fluxos ligados
- [../../../../Contexto/Fluxos/README.md](../../../../Contexto/Fluxos/README.md)

## Código tocado
- `marvin.mjs` — `computeStatus`
- `marvin.mjs` — `printStatus`
- `teste.mjs`
- `README.md`
- `README.pt-BR.md`

## Time
`po` (Josué: decidiu uma por vez e ilha = contexto, 17/09) · `dev-back` (script) · `tl` no diff
(idempotência, `fsw`, `--curto` ≤ 200 tk) · `qa` = `node teste.mjs`.

## Skills
nenhuma nova.

## Rumo
- **17/09/2026** — aberta. Veio da tentativa de ilhas paralelas no Parci, desfeita no mesmo dia.

- **17/09/2026** — implementada: `--us --refinada`; `readNode` lê o `Código tocado`; `ilhasOf` (união por arquivo, núcleo ≥3 US, sem mapa) no `computeStatus`; `printIlhas` no `--status` e no `--curto` (cala quando há uma ilha só e fila vazia); `/refinar` gerado; `/retomar` com as duas portas; `refinada` no README de Planejamento e nas marcas do passo 10 (`desde: 1.8.0`); caso 13 no `teste.mjs` (11 checks). Decisão do Josué que moldou tudo: ilha **ordena**, não paraleliza — uma sessão de desenvolvimento por vez; refinar pode correr ao lado porque escreve em arquivos disjuntos. Próximo: commit, CI verde nos três SO, `--release 1.8.0`.

## Evidência
**17/09/2026** — commit `a205546`, CI verde nos três SO (run 35262684329: ubuntu, windows, macos — 236 checks). No Parci: 29 US `refinada`, 12 ilhas no hook, carimbo `"< 1.7.1"` → `1.7.1`.
