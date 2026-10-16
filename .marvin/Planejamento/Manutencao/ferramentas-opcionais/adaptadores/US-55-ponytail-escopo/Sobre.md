---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-55-ponytail-escopo
description: "A detecção do ponytail considera o escopo: instalado no projeto de outro repo não conta; escopo de usuário é avisado como global."
---
# US-55 — o ponytail instalado em outro projeto não conta como instalado aqui

**Por quê:** `detectPonytail` (`marvin.mjs:1899`) testa `/ponytail/i` no `~/.claude/plugins/installed_plugins.json` inteiro. Desde a US-50 a instalação é por projeto, e cada entrada do arquivo tem `scope` (`user`, `project`, `local`) e, nos dois últimos, `projectPath` (formato conferido em 15/10 instalando e desinstalando numa pasta temporária). Hoje, um ponytail instalado no projeto A faz o projeto B achar que já tem: o `--install` nunca instala em B e o plugin não carrega lá. Achado do `tl` na US-50.

**Pronto quando:**
1. Entrada `project`/`local` só conta se o `projectPath` for a raiz deste projeto (comparação de caminho normalizada; no Windows, sem diferenciar maiúsculas).
2. Entrada `user` conta como instalado, e a mensagem diz que é **escopo de usuário** (global, carrega em todo projeto) — não reinstala no projeto.
3. Com `ponytail | sim` no registro e só uma entrada de outro projeto, `--install --dry-run` lista `run claude plugin install ponytail --scope project`.
4. Arquivo ausente ou JSON inválido continua sendo "não instalado", sem exceção.
5. `node teste.mjs` passa com checks novos; contagem nos dois READMEs.

**Não entra:** desinstalar ou mover a instalação de usuário; outros plugins.

## Código tocado
- `marvin.mjs` — `detectPonytail` :1899, `OPTIONAL_TOOLS` :1914
- `teste.mjs`

## Time
- **Grafo (15/10):** `detectPonytail` — referenciado por `OPTIONAL_TOOLS` (:1914); `OPTIONAL_TOOLS` sem affected.
- **Risco:** decide se o `--install` roda `exec` no projeto de alguém → `tl` obrigatório (regra de 15/10).
- Amostra da US-29: **coordenador Opus × coordenador Sonnet**, mesma delegação (`dev-back` Sonnet, `qa` Sonnet, `tl` Opus), clones e chats próprios, aceite escondido.

## Skills
_(nenhuma)_

## Rumo
- **15/10/2026** — aberta e refinada na sessão principal, a partir do achado do `tl` na US-50.
- **15/10/2026** — concluída. Amostra da US-29: **coordenador Opus × coordenador Sonnet**, mesma delegação (`dev-back` e `qa` Sonnet, `tl` Opus), clones e chats próprios. Os dois resolveram: entrada `project`/`local` só conta com `projectPath` = raiz (normalizado; minúsculas no Windows); `user` conta e é avisado como global. Aplicada a do coordenador Sonnet. **Limitação:** com o registro já em `sim`, o aviso de escopo de usuário não é reimpresso (só aparece na detecção) — o 3º caso do meu aceite exigia isso e falhou nos dois braços; conferido à mão que o aviso sai na detecção.

## Evidência
| Coordenador | Custo | Por modelo | `teste.mjs` | Aceite escondido |
|---|---|---|---|---|
| Opus | $2,481 | Opus $1,327 · Sonnet $1,140 · Haiku $0,014 | 397 ✅ | 3/4 + aviso conferido na detecção |
| **Sonnet** | **$1,720 (−31%)** | Sonnet $1,210 · Opus ($`tl`) $0,510 | 396 ✅ | 3/4 + aviso conferido na detecção |
- No repo principal, depois de aplicar: 396 passaram.
