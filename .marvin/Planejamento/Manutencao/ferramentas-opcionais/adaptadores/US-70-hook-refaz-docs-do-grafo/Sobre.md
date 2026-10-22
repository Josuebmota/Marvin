---
tipo: us
estado: concluida
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
| teste que falha | tdd-guide | Sonnet · médio | 6 cenários, hook e grafo falsos; Haiku não: precisa notar o que falta (`soCom`, mtime) | feito: 12 checks |
| implementar | dev-back | Sonnet · médio | escopo fechado (extração + flag + template + `UPDATES`) | feito, com 1 retrabalho (pedido do tl) |
| verificar | qa | Sonnet · baixo | o que o teste não cobre: npx, `soCom`, commit real neste repo | aprovado no clone (commit real → 154 nós da base) |
| ler o diff | tl | Opus · médio | invariante 1, `UPDATES` e escrita em `.git/hooks` alheio | barrou 1× (hook fora do `else`), aprovou |

Grafo (código fresco, 22/10 11:36; 0 nós-doc `marvin` — o defeito desta US): `docsGraph` → affected `touchedByUS` L960, `writeStatusHtml` L1103, `computeStatus` L1351. `pendingUpdates` (L4703) e `hasFlag` (L77): sem dependentes. Template do hook e bloco de docs **sem nó** (dentro do `if (GRAPHIFY)` de topo) — localizados por Read/Grep.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 4 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 3 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../../diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 1 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../US-40-linha-fora-da-tabela/Sobre.md) — 3 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../US-66-graphify-preserva-origem-doc/Sobre.md) — 2 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-49 — identidade pública: equipe barata](../../../publicacao/identidade/US-49-identidade-equipe-barata/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 3 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 3 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 3 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../../Novos/ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 2 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../../Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 3 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../../Novos/ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 3 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../../Novos/ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 3 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../../Novos/ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 2 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../../Novos/ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 3 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../../Novos/ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 2 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../../../Novos/ferramentas-opcionais/curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
- [US-63 — skill citada nas instruções vem do ECC](../../../../Novos/ferramentas-opcionais/curadoria/US-63-skill-citada-vem-do-ecc/Sobre.md) — 2 nó(s) em comum
- [US-69 — a matriz chama os agentes do ECC; o que não casa sai](../../../../Novos/ferramentas-opcionais/curadoria/US-69-ecc-na-matriz/Sobre.md) — 2 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../../../Novos/organizacao-por-grafo/hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../../Novos/organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../../Novos/organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../../Novos/organizacao-por-grafo/script/US-05-release/Sobre.md) — 2 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../../Novos/organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../../Novos/organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 2 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../../../../Novos/organizacao-por-grafo/script/US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../../Novos/organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 2 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../../Novos/organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 3 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../../Novos/organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 2 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../../Novos/organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 2 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../../Novos/organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 2 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../../../../Novos/organizacao-por-grafo/script/US-52-anotada-no-status/Sobre.md) — 1 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../../Novos/time/glossario/US-44-glossario-da-equipe/Sobre.md) — 3 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../../Novos/time/orquestracao/US-45-porta-unica/Sobre.md) — 2 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 3 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../../Novos/time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 3 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../../Novos/time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 2 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../../../../Novos/time/roteamento/US-39-time-na-primeira-rodada/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../../Novos/time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 2 nó(s) em comum

## Rumo
- **22/10/2026** — aberta e refinada. Primeira da fila (`po`): regressão de invariante já fechado, morde a cada commit; antes de US-68, US-69 e US-63.
- **22/10/2026** — concluída. `mergeDocs` e `detectSubRepos` extraídos; `--graph-docs` sai cedo e só refaz os docs; o hook roda `graphify update . && <marvin> --graph-docs`; o hook antigo com a assinatura do Marvin é reescrito com `--graphify-git-hook` e avisado pela `UPDATES` (`desde: '3.4.2'`; marca aceita `--graphify-rebuild` para não reescrever o de monorepo a cada rodada). O `tl` barrou o `dev-back` ter tirado o hook do `else` do 8b (instalaria hook sem graphify, falhando em silêncio a cada commit — invariante 3); o teste passou a plantar um `graph.json` mínimo. Grafo no crivo: velho (11:36 × commit 14:47, commit de refino feito com o hook pulado); `mergeDocs`, `detectSubRepos` e `HOOK_SIGNATURE` sem nó (novos) — lidos pelo diff. Fora, confirmado pelo `qa`: com `graph.json` mas sem o binário, o hook é instalado e falha só no log (comportamento anterior); caminho `_npx` só lido, não rodado.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- `node teste.mjs`: 507 passaram (bloco 9r, 12 checks `US-70:`).
- `qa`, clone com graphify real e o hook antigo deste repo: `--graph-docs` 0 → 154 nós da base, 2ª rodada mesmo hash, `--dry-run` sem escrita; sem a flag, aviso do passo 10 e hook intacto; com `--graphify-git-hook`, hook reescrito e 2ª rodada sem reescrever; `graphify update .` zerou a base, `git commit --allow-empty`, 70 s depois `--status` = 1288 nós, **154 da base, sem comando à mão**.
- Este repo: hook reescrito com `marvin --graphify --graphify-git-hook` (`--dry-run` antes: só o hook e o grafo).
