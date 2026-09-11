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

- **11/09/2026** — implementado em texto: US ativas com cadeia Epic › Feature e último Rumo, progresso por
  Epic, última release, a conta inteira do contexto fixo, idade do grafo. Sai != 0 quando a nota e os nós
  discordam (concluída ainda na nota, sem Evidência, seção de relato). Rodado nos quatro projetos reais.
  Junto vieram os dois gatilhos que faltavam — `--us`/`/us` e `/fechar` — e o `--migrar`. HTML fica para
  quando o texto tiver rodado o suficiente para saber o que mostrar.

## Evidência
- 149 verificações verdes (`teste.mjs` 9r, 9s, 9t); `--status` verde em Marvin, Zino, parci-front e parci-invest.
  Falta a release (1.2.0) para ir para `Releases/`.
