---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-10 — O grafo a nosso favor: Impacto, colisão, deriva

**Por quê:** medido em 14/09 — em 23.745 turnos nos quatro projetos, o grafo foi consultado duas vezes, as duas em teste. Construíamos e desenhávamos; ninguém perguntava. Então quem pergunta é o script, nos momentos que ele controla.
**Pronto quando:** `--us` escreve *Impacto* (quem depende do que a US toca + outras US no mesmo código); `--status` acusa colisão entre US ativas e dispersão; `--fechar` acusa código mudado sem US.

## Fluxos ligados
_(link para ../../../../../Contexto/Fluxos/<fluxo>.md — fluxo sem nota ganha uma agora)_

## Código tocado
- `marvin.mjs` — `carregarGrafo`
- `marvin.mjs` — `tocadoPorUS`
- `marvin.mjs` — `impactoDaUS`
- `marvin.mjs` — `calcularStatus`
- `teste.mjs`

## Time
- tl, dev-back, qa

## Skills
- nenhuma

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 5 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../US-07-status-html/Sobre.md) — 1 nó(s) em comum

## Rumo
- **14/09/2026** — feita. De quebra: o frontmatter era lido só com LF, e arquivos em CRLF (git autocrlf) perdiam `tipo`/`pai` em silêncio — 60 → 68 arestas depois do conserto. E o `--us` numa US concluída recolocava o ponteiro na nota; não mais.

## Evidência
- teste 9z: Impacto escrito e não duplicado; colisão acusada; deriva acusada e limpa. Rodado nos quatro projetos: `--fechar` aqui pegou este próprio trabalho sem US antes de eu abrir a US-10.
