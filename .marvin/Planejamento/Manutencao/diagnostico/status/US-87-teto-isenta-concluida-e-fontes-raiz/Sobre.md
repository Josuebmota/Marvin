---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-87-teto-isenta-concluida-e-fontes-raiz
description: "O --status não aplica o teto por documento (US-78) a US concluída, e Fontes/ vira raiz por regra como Releases/ (sem aviso de órfão). Respostas do dono às ❓ da US-84."
---
# US-87 — o teto isenta US concluída e `Fontes/` vira raiz

**Por quê:** respostas do dono (29/10/2026) às ❓ da [US-84](../../../publicacao/contexto-fixo/US-84-quebrar-delegacao-e-ligar-orfaos/Sobre.md). O teto da [US-78](../US-78-teto-por-documento/Sobre.md) existe para o que a LLM lê; US concluída é histórico quase nunca lido, e hoje 5 delas (US-19, 29, 36, 44, 69) ficam no `--status` como aviso permanente que ninguém vai resolver. `Fontes/` é histórico como `Releases/`: o que entra lá não precisa de quem o linke.

**Pronto quando:** _(a refinar)_ — esboço:
1. Em `computeStatus`, o arquivo de US com `estado: concluida` sai de "Documentos grandes" (`cancelada` também? — a refinar).
2. A regra de raiz do órfão (hoje `README.md`, `onde_paramos.md`, `Memoria/`, `Releases/`) ganha `Fontes/`.
3. `teste.mjs`: US concluída grande não avisa; US aberta grande avisa; arquivo solto em `Fontes/` não é órfão.
4. Nesta base, o `--status` deixa de listar as 5 concluídas; sobra só o `equipe-barata.md`.

**Não entra:** quebrar as US concluídas; mudar os números do teto.

## Fluxos ligados
- [status-html.md](../../../../../Contexto/Fluxos/status-html.md)

## Código tocado
- `marvin.mjs` — `computeStatus`
- `teste.mjs`

## Time
_(a refinar — `/refinar` com `tl` e `po`)_

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|

## Skills
_(a refinar)_

## Rumo
- **29/10/2026** — anotada a partir das respostas do dono às ❓1 e ❓2 da US-84.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
