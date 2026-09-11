---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-07 — `--status --html`: a série histórica

**Por quê:** o texto é uma foto; "medição" é filme. "O contexto fixo cresceu ou encolheu desde a última
release?" não tem resposta hoje porque ninguém guarda a foto anterior. HTML sem série é só o texto mais
bonito — descartado. HTML **com** série é a primeira métrica de tendência do projeto.
**Pronto quando:** `--status --html` escreve `.marvin/.status/index.html` (no `.gitignore`, sem lib, SVG
inline, histórico em `<script type="application/json">` — `file://` bloqueia fetch); cada run anexa uma
linha em `.marvin/.status/historico.jsonl` datada pelo `git log -1 --format=%cI`, e dois runs no mesmo
commit não duplicam; sem `--html` o jsonl não nasce; gráficos: contexto fixo por commit, US ativas vs
concluídas (contadas dos nós, não da nota), idade do grafo (gravar o mtime ISO, não dias); abre sem rede.

## Fluxos ligados
_(nenhum)_

## Código tocado
- `marvin.mjs` — `contextoFixo`
- `marvin.mjs` — `nosDoPlanejamento`
- `teste.mjs`

## Time
- po, tl, dev-front, qa

## Skills
- nenhuma

## Rumo
- **11/09/2026** — aberta. **PO:** fora — comparação entre projetos (exigiria `~/.marvin/`, config
  disfarçada), servidor, abrir browser. **TL:** L; um `index.html` único regerado com JSON inline; o jsonl
  só com `--html` (o `--status` prometeu não escrever, e o hook da US-06 vai rodá-lo a cada sessão);
  teto de 500 linhas; sem git, gera o HTML do que já existe e avisa. Fazer depois da 05 e da 06 — a
  separação cálculo/impressão que a 06 força deixa esta mais barata.

## Evidência
<!-- preenchido ao concluir -->
