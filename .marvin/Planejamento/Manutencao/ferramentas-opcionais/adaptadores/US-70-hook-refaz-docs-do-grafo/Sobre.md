---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-70-hook-refaz-docs-do-grafo
description: "O hook post-commit roda `graphify update . && marvin --graph-docs`: a cada commit o lado dos docs volta ao grafo sem comando à mão. Flag nova só-docs; hook antigo do Marvin é reescrito com --graphify-git-hook; hook alheio intocado."
---
# US-70 — o hook pós-commit refaz o lado dos docs do grafo

**Por quê:** medido em 22/10, logo depois da [US-66](../US-66-graphify-preserva-origem-doc/Sobre.md) (2da061b): `marvin --graphify` repôs os 153 nós-doc; segundos depois o `.git/hooks/post-commit` rodou só `graphify update .` e trocou o lado dos docs de novo — `--status` volta a "0 from the knowledge base" e avisa. Acontece **a cada commit**: a triagem (`--us` Impacto, ilhas, passo de estrutura) perde `tipo`/`estado` das US, e o hook que a decisão "Grafo obrigatório no passo de estrutura" usa como frescor é o mesmo que estraga o grafo. A US-66 deixou isto fora ("US própria se pedir"); o dono pediu. O hook nasceu sem US (db56867, 11/08, "passo 8b"; corrigido no 8a0af16, 11/09, aponta para o script que montou).

**Pronto quando:**
1. O bloco de mesclagem dos docs (`marvin.mjs` ~L4477-4540) vira uma função (`mergeDocs`), usada pelo passo 8b e por uma flag nova **`--graph-docs`**, que sai cedo (como `--status`) e faz só isso; calcula os subrepos sem depender de `GRAPHIFY`; leva junto o `utimesSync` que preserva o mtime (frescor).
2. O template do hook roda, no mesmo subshell em segundo plano: `graphify update . && <marvin> --graph-docs`. `<marvin>` = `node "<process.argv[1]>"`, exceto quando ele está num cache do npx (`_npx`): aí `npx --no-install marvin-kb --graph-docs`. Mantém `PYTHONHASHSEED`, o skip e as guardas de rebase/merge.
3. **Hook antigo (decisão do dono, 22/10):** `marvin --graphify --graphify-git-hook` reescreve o `post-commit` quando ele tem a assinatura do Marvin (`#\s+marvin\s+—\s+atualiza\s+o\s+grafo`) e não tem `--graph-docs`. Hook sem a assinatura: intocado, com o warn de hoje (invariante 1).
4. `UPDATES`: entrada com `arquivo: '.git/hooks/post-commit'`, `marca: /--graph-docs/`, `desde: '<versão>'`, e `soCom` = a assinatura do Marvin (hook alheio não recebe aviso falso); o texto diz o comando (`marvin --graphify --graphify-git-hook`).
5. `teste.mjs` (hermético, graphify falso): `--graph-docs` repõe os docs num grafo sem eles; 2ª rodada não muda nada; mtime preservado; o hook novo contém `--graph-docs`; hook antigo do Marvin é reescrito com a flag e avisado sem ela; hook alheio intocado e sem aviso de `UPDATES`; `--dry-run` não escreve hook nem grafo.
6. Neste repo: hook reescrito; depois de um commit e do segundo plano terminar, `--status` mostra N>0 nós da base sem nenhum comando à mão (medir: 153).

**Não entra:** mexer no graphify; adotar os nós-doc dele; hook do Claude ("consulta, nunca hook do Claude" continua); instalar o hook sem a flag; lock contra dois commits seguidos; log por projeto (`$TMPDIR/marvin-graph-refresh.log` é compartilhado — hoje mostra outro repo); o ramo monorepo (`--graphify --graphify-rebuild` já mescla).

## Perguntas
- ✅ Reescrever o hook antigo: **com a flag** (dono, 22/10). O `tl` defendia só avisar (invariante 1 vale até para o nosso arquivo, que pode ter sido editado à mão); o dono decidiu pelo `po`, limitado à assinatura do Marvin.
- ✅ Modo só-docs: o `tl` mostrou que não existe modo barato (`--graphify` roda o scaffold inteiro); a flag é o mínimo.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md): o passo de estrutura lê este grafo.

## Código tocado
- `marvin.mjs` — bloco de mesclagem dos docs (passo 8b, ~L4477-4540)
- `marvin.mjs` — template do hook post-commit (~L4571-4620)
- `marvin.mjs` — `UPDATES`
- `marvin.mjs` — `hasFlag`
- `teste.mjs`
- `README.md` / `README.pt-BR.md` — a flag nova

## Time
Triagem 22/10/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo).

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| teste que falha | tdd-guide | Sonnet · médio | 6 cenários, hook e grafo falsos; Haiku não: precisa notar o que falta (`soCom`, mtime) | pendente |
| implementar | dev-back | Sonnet · médio | escopo fechado (extração + flag + template + `UPDATES`) | pendente |
| verificar | qa | Sonnet · baixo | o que o teste não cobre: npx, `soCom`, commit real neste repo | pendente |
| ler o diff | tl | Opus · médio | invariante 1, `UPDATES` e escrita em `.git/hooks` alheio | pendente |

Grafo (código fresco, 22/10 11:36; 0 nós-doc `marvin` — o defeito desta US): `docsGraph` → affected `touchedByUS` L960, `writeStatusHtml` L1103, `computeStatus` L1351. `pendingUpdates` (L4703) e `hasFlag` (L77): sem dependentes. Template do hook e bloco de docs **sem nó** (dentro do `if (GRAPHIFY)` de topo) — localizados por Read/Grep.

## Skills
Nenhuma.

## Rumo
- **22/10/2026** — aberta e refinada. Primeira da fila (`po`): regressão de invariante já fechado, morde a cada commit; antes de US-68, US-69 e US-63.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
