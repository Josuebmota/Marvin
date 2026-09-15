---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-11b — ponytail como adaptador, e em que papel ele entra

**Por quê:** a escada do ponytail vale para quem implementa em projetos sem convenção escrita — não para quem lê diff ou decide requisito. Decisões comuns em [US-11](../US-11-ferramentas-opcionais/Sobre.md). Depende da US-11a (o registro).
**Pronto quando:** `marvin` distingue ponytail *instalado* (`~/.claude/plugins/installed_plugins.json`) de *ativo* (`~/.claude/.ponytail-active`) por plataforma de `--tools=`; registra em `ferramentas.md`; ausente, sugere `claude plugin marketplace add DietrichGebert/ponytail` e registra `não`; a seção no `AGENTS.md` gerado tem selo de confiança **baixa** e diz o que ele não substitui; o `.claude/agents/README.md` gerado sugere a tabela de papéis; `--dry-run` honesto; teste verde.

## Fluxos ligados
- [montagem](../../../../../Contexto/Fluxos/montagem.md)

## Código tocado
- `marvin.mjs` — passo 7 (`.claude/agents/README.md`: a sugestão de papéis)
- `marvin.mjs` — passo 7c (seção *Ferramentas* no `AGENTS.md` gerado)
- `marvin.mjs` — `ATUALIZACOES`
- `README.md` / `README.pt-BR.md` — linha do ponytail na tabela, com alcance por plataforma

## Time
- tl — a seção gerada não pode contradizer o `AGENTS.md`
- po — dono da tabela de papéis
- dev-back — implementação
- qa — o adaptador ausente não pode falhar em silêncio

## Skills
- adaptador-de-ferramenta — segunda vez; se a 11a já tiver virado skill, é ela.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 1 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum

## Rumo
- **15/09/2026** — aberta, fatiada da US-11. **Tabela de papéis, decidida pelo po:**
  `dev-back`/`dev-front` **sim** (implementação, sonnet); `qa` talvez (o "um check executável"
  conflita com suíte real); `tl` **não** (lê diff, precisa do porquê); `po` **não** (quem
  questiona requisito); `scout` **não** (haiku, recuperação). O Marvin só *sugere* — o corpo
  do agente é do humano (invariante 4). Alcance: plugin no Claude Code/Codex; `.cursor/rules/`
  no Cursor; `AGENTS.md` no resto. Confiança baixa: plugin instalado (v4.10.0), README lido,
  não medido — medir em `lite` com o `--status` (US-08) antes de recomendar `full`.
  O `--status` acusa colisão com a 11a em `ATUALIZACOES`: é sabida e sequenciada — a 11b só
  começa depois da 11a mergeada.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
