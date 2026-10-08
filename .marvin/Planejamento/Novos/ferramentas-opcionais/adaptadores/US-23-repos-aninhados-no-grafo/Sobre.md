---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-23-repos-aninhados-no-grafo
description: "Pasta-mãe com os repos em repos/<x>: o --graphify não acha os sub-repos (só olha filhos diretos da raiz) e os links de Código tocado não pousam. Detecção em profundidade + resolução de caminho por sub-repo."
---
# US-23 — repos aninhados (`repos/<x>`) no grafo

**Por quê:** medido em 07/10/2026 numa pasta-mãe com `repos/parci-front` e `repos/parci-invest-service` (os dois com `.git`, ignorados pela raiz): `marvin --graphify` gerou **8.409 nós e 0 deles de `repos/`** — 3.118 de `.marvin`, 2.783 de `.claude` e 2.783 de `.agents` — e **360 links** de "Código tocado" caíram em "does not exist in the repository". É exatamente o defeito que o README descreve para monorepo (o grafo indexa tudo menos o produto), e nada avisou. Três causas:
1. **Detecção só olha os filhos diretos da raiz** — `SUBREPOS` varre `fs.readdirSync(ROOT)` (`marvin.mjs:~1792-1803`); `repos/<x>` está a dois níveis, então nunca entra na lista.
2. **O "Código tocado" é resolvido contra a raiz** — `docsGraph` faz `path.join(ROOT, codeFile)` (`marvin.mjs:~686`). A US de um repo diz `src/utils/calculos.ts` (relativo ao repo dele); na pasta-mãe só existe `repos/parci-front/src/utils/calculos.ts`.
3. **Ruído:** `.agents/` espelha `.claude/` (as mesmas skills, 2.783 nós a mais). Corrigido pelo `tl` em 07/10: o `IGNORE` (`marvin.mjs:~1780`) **não chega** ao `graphify extract` (`marvin.mjs:~3556` extrai `"."` inteiro), e diretório com ponto já é pulado nas varreduras do script. Pôr `.agents` no `IGNORE` não muda o grafo; o ponto de corte é a **extração**.

**Dividida em duas (`po`, 07/10/2026)** — cada uma paga sozinha:

**US-23a — detecção, merge e ruído**
1. Sub-repo = diretório com `.git`, **ignorado pela raiz**, até profundidade 2 (`repos/<x>`). Um sub-repo que a raiz **não** ignora continua fora da lista (senão entra duas vezes).
2. `--graphify` na pasta-mãe indexa cada sub-repo e faz o merge. **Trava:** num fixture com 2 sub-repos aninhados, o grafo tem nós de **ambos**; com a guarda removida a contagem do sub-repo cai a 0 → vermelho.
3. `.agents/` fica fora da **extração de código** do grafo (não basta o `IGNORE`, ver causa 3).
4. O `CLAUDE.md` gerado lista os sub-repos aninhados e repete o aviso de que `graphify update .` é o comando errado de atualização.

**US-23b — resolução de "Código tocado" e ilhas**
5. Caminho com prefixo (`repos/parci-front/src/a.ts`) resolve; **sem** prefixo tenta cada sub-repo — **um** achado liga; **dois ou mais** → aviso "ambíguo: existe em A e em B" e não liga a nenhum; **zero** → o aviso de hoje. O `idOf` do Marvin casa com o prefixo que o `merge-graphs` já aplica (`repo::`, `repo-2::`; ver `marvin.mjs:~3591`) — **já medido, não medir de novo**. **Trava:** um teste com o caminho com prefixo, sem prefixo e ambíguo.
6. `--us` (Impacto) e `--status` (ilhas) agrupam pelo **arquivo resolvido** — o mesmo arquivo, escrito com e sem prefixo, é uma ilha só.

**Cortado pelo `po` (07/10/2026):** `--repos-dir` e o registro dele em `ferramentas.md` (a profundidade 2 cobre o caso medido; a flag espera um segundo caso) e `.codex/` (não medido).

**Não entra:** onde o grafo mora (US-22); a escolha de versionar (US-21).

## Código tocado
- `marvin.mjs` — **23a:** `SUBREPOS` (~1792-1803), o laço `for target of ['.', ...subRepos]` do bloco 8b e a extração (~3556), a geração do `CLAUDE.md` do graphify. **23b:** `docsGraph` (~598 e a resolução em ~686), `idOf`
- `teste.mjs` — fixture com 2 sub-repos aninhados e as travas
- `README.md` e `README.pt-BR.md` — a seção de monorepo

## Time
- `po` · `tl` · `developer`

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../US-22-grafo-dentro-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../organizacao-por-grafo/script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 1 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 1 nó(s) em comum

## Rumo
- **07/10/2026** — **23b implementada, sem commit**; `tl` aprovou, 275 checks. `resolveCode` no `docsGraph` (prefixo → o repo; sem prefixo → o único repo que tem o arquivo; 2+ → "ambíguo", não liga; 0 → aviso de sempre); `canonFile` junta com/sem prefixo numa ilha só; `subReposOfGraph` faz o `--us` e o `--status --html` enxergarem os nós (o `tl` achou que eles chamavam `docsGraph` sem sub-repos). Aceito, só exibição: arquivo na raiz E num sub-repo (ilha usa a raiz, `--graphify` acusa ambíguo); `.git` como arquivo (submódulo/worktree) conta como repo na ilha. README (os dois) ganhou o parágrafo. **US-23 pronta para fechar após o commit**; próxima da fila: US-21 (só flags).
- **07/10/2026** — **23a implementada** (commit `2017bef`); `tl` aprovou, 268 checks verdes. Detecção em profundidade 2, nome do destino com `/`→`__`, `.graphifyignore` com `.agents/` (só se `.agents/` existe e o arquivo não). Medido: nós dos dois sub-repos, zero de `.agents/`. Lacuna conhecida: o `.graphifyignore` fica só na raiz — `.agents/` dentro de um sub-repo não foi testado. **Próximo: 23b** (resolução de Código tocado + ilhas).
- **07/10/2026** — revisada por `po` e `tl`: **1ª da fila** (única com medição forte), dividida em 23a e 23b, ordem 23a → 23b. Causa 3 e "medir antes" corrigidos (ver acima). Ordem geral: 23a → 23b → US-21 → US-20 (itens 1 e 3) → US-22 adiada.
- **07/10/2026** — aberta e refinada (pedido do Josué, depois de medir 0 nós de `repos/` num projeto real). Ordem sugerida: **US-23 antes da US-22** (sem os repos no grafo, mover o grafo de lugar só muda de endereço um grafo vazio). **Não implementar.**

## Evidência
<!-- preenchido ao concluir -->
