---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-68-ponytail-medido
description: "Ligar o ponytail só neste projeto (settings.local.json) e medir o par com × sem no dev-back, no molde da US-48: vira 'sim' só se pagar."
---
# US-68 — ponytail ligado e medido

**Por quê:** auditoria de 22/10: o ponytail está instalado, desligado e nunca foi medido, mas o `ferramentas.md` diz `sim` e o `dev-back` manda carregar a escada. **Decisão do dono, 22/10/2026: ligar e medir.** Método da [US-48](../US-48-superpowers-e-ecc/Sobre.md) (par, mesma tarefa, mesmo modelo); instrumento da [US-65](../../../../Manutencao/diagnostico/custo/US-65-custo-por-us/Sobre.md) (custo por US pelo `--status`).

**Pronto quando:**
1. Protocolo escrito no Rumo antes de rodar: tarefa real do `dev-back` (a [US-66](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) ou a [US-67](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md)), duas cópias limpas, Sonnet · médio nos dois braços, aceite escondido.
2. Antes de medir: conferido na transcrição do `dev-back` que o nível do ponytail **chega ao subagente** (o SessionStart injeta na sessão principal). Se não chegar, o par mede nada — registrar e parar.
3. Tabela no Rumo: custo fixo por sessão, $, turnos, testes verdes, com × sem.
4. A linha do ponytail em `ferramentas.md` troca "não medido" pelo número; se não pagar, vira `não` (como o superpowers) e sai do `dev-back`.

**Não entra:** ligar em `~/.claude` (afeta todos os projetos, inclusive os de cliente) ou no `.claude/settings.json` versionado (repo público; o par viraria commit de ida e volta) — liga em `.claude/settings.local.json`, git-ignorado; medir em outros papéis ou no Codex/Copilot; código no `marvin.mjs`.

## Perguntas
- ❓ Uma amostra por braço basta para o veredito? A US-48 aceitou n=1.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md): o `dev-back` é quem carrega a escada.

## Código tocado
- `.claude/settings.local.json` — `enabledPlugins` (só durante a medição)
- `.marvin/ferramentas.md` — linha do ponytail

## Time
Triagem 22/10/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo).

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| protocolo | po | Sonnet · baixo | molde da US-48 já existe | pendente |
| rodar o par | dev-back | Sonnet · médio | o mesmo modelo nos dois braços | pendente |
| ler o resultado | po | Sonnet · baixo | leitura pelo `--status` por US | pendente |

Grafo: sem símbolo de código tocado — não há o que perguntar ao `affected`/`explain`.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 1 nó(s) de código em 1 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-25 — avaliar Superpowers e Claude Octopus contra o fluxo do Marvin](../US-25-avaliar-superpowers-e-octopus/Sobre.md) — 1 nó(s) em comum
- [US-48 — Superpowers e ECC como ferramentas de execução da equipe](../US-48-superpowers-e-ecc/Sobre.md) — 1 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum

## Rumo
- **22/10/2026** — aberta e refinada. Depende da US-67.
- **23/10/2026** — protocolo (`po`), no molde da US-48 (par, mesma tarefa, mesmo modelo, n=1). **Tarefa:** a implementação da [US-63](../../curadoria/US-63-skill-citada-vem-do-ecc/Sobre.md) (Pronto quando 1-4), no lugar da US-66/67 do item 1 (já entregues). Braço **A** sem e **B** com ponytail 5.2.0, cada um numa sessão headless num clone descartável do repo no mesmo HEAD (`par68/A`, `par68/B` no scratch). Única diferença: `.claude/settings.local.json` = `{"enabledPlugins":{"ponytail@ponytail":false}}` (A) × `true` (B). Rodar nas duas, nada mais: `claude -p "<prompt>" --model sonnet --effort medium --output-format json --allowedTools "Read,Edit,Write,Grep,Glob,Agent,Bash(node *),Bash(git diff*),Bash(git status*)"` (`Agent` é acréscimo ao já combinado: sem ele a sessão não chama o `dev-back` e o SubagentStart nunca dispara).
  - **Prompt (idêntico):** "Implemente a US-63 em `.marvin/Planejamento/Novos/ferramentas-opcionais/curadoria/US-63-skill-citada-vem-do-ecc/Sobre.md`. Leia o Sobre.md e o AGENTS.md e entregue o *Pronto quando* 1 a 4. Faça o trabalho chamando o subagente `dev-back` (Sonnet · médio) e não escreva código você mesmo. Escreva os testes no `teste.mjs` (item 4), rode `node teste.mjs` até zerar falhas e, se a contagem de checks aparece nos `README.md`/`README.pt-BR.md`, atualize os dois. Não faça commit. Termine com um parágrafo: o que mudou e o resultado do `node teste.mjs`."
  - **Aceite escondido (o braço não vê; rodamos nós, no clone, depois):** (1) `node teste.mjs` com 0 falhas; (2) projeto falso com ECC falso: `CLAUDE.md` cita `` `/council` `` e `skills/council/SKILL.md` existe, `.claude/skills/council` ausente, então a rodada copia com `model`/`effort` reescritos; (3) 2ª rodada não muda nada e `--dry-run` não escreve; (4) citação sem catálogo, então `--check` avisa pelo nome e nenhum arquivo nasce; `` `/retomar` `` não avisa; id em `ecc fora:` não é copiado; (5) a `UPDATES` tem marca nova com `desde:` e o texto gerado traz o gatilho `Unknown skill` com `~/` (sem caminho absoluto). Passa = 5 de 5.
  - **Métricas (do JSON e do clone):** `total_cost_usd` (inclui o subagente), `num_turns`, `duration_ms`; linhas de `git diff --numstat marvin.mjs` e `teste.mjs`; `node teste.mjs` verde (checks/falhas); aceite escondido (n de 5). Custo fixo por sessão fica fora (já medido na US-65).
  - **Ponytail realmente ativo em B (conferir antes de ler qualquer número):** a transcrição da sessão e a do `dev-back` (`~/.claude/projects/<clone-B>/…/subagents/*.jsonl`) contêm `PONYTAIL MODE ACTIVE — level: full`; em A, zero ocorrências nas duas. Sinal do hook: o SessionStart escreve o flag `.ponytail-active` (em `~/.claude` e/ou no projeto) e o SubagentStart injeta o `additionalContext` no subagente. Se a transcrição do `dev-back` de B não tiver a frase, o par mede nada: registrar e parar (Pronto quando 2). Se A tiver, a configuração vazou: refazer A.
  - **Veredito (n=1, diga isso na tabela):** custo dentro de ±10% = empate técnico, não dá ganho. B vira `sim` só se aceite de B >= A (e B passa 5/5) **e** custo de B <= 0,9 x A (ou diff menor com custo <= A). Aceite pior em B, ou custo > A: `não`, sai do `dev-back`. Empate: fica `sim` apenas por reabrir com par maior; escrever "n=1, empate" no `ferramentas.md`, nunca "pagou".
  - **Destino do resultado:** o braço que passa no aceite e no `tl` (Opus · médio lê o diff: toca `UPDATES` e escreve em `.claude/` alheio) vira a implementação da US-63 (aplicar o diff no repo real); se os dois passam, o mais barato. Se nenhum passa, a US-63 volta ao `dev-back` normal e o par vale só como número. Ao fim, remover o `settings.local.json` de medição e apagar os clones.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
