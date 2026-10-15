---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-54-ilha-sem-nome
description: "Ilha cujo arquivo principal começa com ponto (.env, .github, .claude-plugin/) aparece sem nome no --status e no painel."
---
# US-54 — ilha sem nome quando o arquivo começa com ponto

**Por quê:** defeito visto em 15/10 no `/refinar`: a US-53 (`Código tocado`: `.claude-plugin/`) apareceu como `▹   1 US`. Causa: `marvin.mjs:585`, `path.basename(top).replace(/\.[^.]+$/, '')` trata o nome inteiro de um dotfile como extensão e apaga tudo. Vale para `.env`, `.github`, `.gitignore`, `.claude-plugin/`.

**Pronto quando:**
1. Ilha cujo arquivo é `.claude-plugin/` se chama `.claude-plugin`; `.env` se chama `.env`; `.github/workflows/ci.yml` continua `ci`; `src/app.test.js` continua `app.test`.
2. Nenhuma linha `▹` sem nome no `--status`.
3. `node teste.mjs` passa, com um check novo que cobre dotfile; contagem nos dois READMEs.

**Não entra:** mudar como a ilha é agrupada; o painel além do nome.

## Código tocado
- `marvin.mjs` — `ilhasOf` :569 (nome da ilha, :585)
- `teste.mjs`

## Time
- **Grafo (15/10):** `ilhasOf` :564 — affected: `computeStatus` (:1228).
- Amostra da US-29, três braços em clones separados, julgados por aceite escondido (fora do agente): Opus sozinho · Sonnet sozinho · Sonnet coordenando + `tl` Opus no diff.

## Skills
_(nenhuma)_

## Rumo
- **15/10/2026** — aberta e refinada na sessão principal: defeito pequeno, causa com linha, sem ❓.
- **15/10/2026** — concluída. Rodada como amostra da US-29: a mesma US em três clones, cada um num chat sem UI próprio, julgada por aceite escondido (4 casos: `.claude-plugin/`, `.env`, `.github/workflows/ci.yml`, `src/app.test.js`, mais "nenhuma ilha sem nome"). Os três acertaram com a mesma correção (regex que não trata o ponto inicial como extensão). Aplicada a do **Sonnet sozinho** (a mais barata e menor); o `tl` revisou correção equivalente no braço 3.

## Evidência
| Braço | Custo | Turnos | `teste.mjs` | Aceite escondido |
|---|---|---|---|---|
| Opus sozinho (configuração anterior) | $0,974 | 30 | 389 ✅ | ✅ |
| **Sonnet sozinho** | **$0,357** | 12 | 389 ✅ | ✅ |
| Sonnet + `tl` Opus no diff | $0,784 (Sonnet $0,521 + Opus $0,263) | 4 | 389 ✅ | ✅ |
- No repo principal, depois de aplicar: 389 passaram; aceite ok.
