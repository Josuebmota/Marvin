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

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
