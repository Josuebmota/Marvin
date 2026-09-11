---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-02 — `marvin --status`, o dashboard derivado

**Por quê:** com `estado` no frontmatter de todo `Sobre.md` e `Releases/` como índice, o
estado do projeto está estruturado — falta só lê-lo. É a ideia antiga do "painel de
fechamento", agora com dado de verdade por trás.
**Pronto quando:** `marvin --status` imprime, sem escrever nada: US ativas com pai e último
Rumo · progresso por Epic (`3/7 concluídas · 1 cancelada`) · travadas há N dias · última
release · orçamento de contexto (os três arquivos) · frescor do grafo.

## Fluxos ligados
_(nenhum)_

## Código tocado
- `marvin.mjs`

## Time
- tl, dev-back, qa

## Skills
- nenhuma

## Rumo
- **10/09/2026** — aberta. Restrições fechadas na decisão: derivado, nunca versionado; zero
  dependência; primeiro em texto no terminal, HTML estático depois.

## Evidência
_(vazio)_
