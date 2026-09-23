---
tipo: feature
estado: ativa
pai: ../Sobre.md
---
# O script gera, mede e consulta o layout por grafo

**Por quê:** sem o script, a organização é uma convenção que só este repositório segue.
**Pronto quando:** as duas US abaixo estão em release.

## Filhos
- [US-01 — layout por grafo no script](US-01-layout-por-grafo/Sobre.md)
- [US-02 — `marvin --status`](US-02-status/Sobre.md)
- [US-05-release](US-05-release/Sobre.md)
- [US-06-hook-sessao](US-06-hook-sessao/Sobre.md)
- [US-07-status-html](US-07-status-html/Sobre.md)
- [US-08-tokens-gastos](US-08-tokens-gastos/Sobre.md)
- [US-09-rede-e-auto-update](US-09-rede-e-auto-update/Sobre.md)
- [US-10-grafo-a-nosso-favor](US-10-grafo-a-nosso-favor/Sobre.md)
- [US-15-status-html-legivel](US-15-status-html-legivel/Sobre.md)
- [US-16-refinar-e-ilhas](US-16-refinar-e-ilhas/Sobre.md)
- [US-18-simbolo-nao-derruba-o-arquivo](US-18-simbolo-nao-derruba-o-arquivo/Sobre.md)

## Rumo
- **10/09/2026** — aberta.
- **19/09/2026** — ideia: roadmap no `--status`. **Autorar** (ordenar/priorizar): descartado —
  invariante 4, e `Fontes/Externas.md` já diz que a ferramenta externa vence para roadmap.
  **Renderizar**: sem dado nos nós (nenhum `ordem:`; `treeHtml` ordena por `readdirSync`).
  Medido no Parci: `Roadmap.md` com 12 épicos × 8 nós, 3 em comum, 4 dias depois de escrito —
  a cópia já descolou, mas ninguém foi mordido. Zino resolve dentro do nó. **Esperar a segunda
  mordida.** Gatilho: uma sessão perder decisão que só estava no roadmap, ou o segundo projeto
  também criar roadmap separado dos nós. Aí a US é `ordem:` opcional no Epic, e só isso.
