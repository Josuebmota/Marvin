---
tipo: us
estado: cancelada
pai: ../Sobre.md
---
# US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)

**Por quê:** hoje o usuário tem que *saber* que `--graphify` existe para ganhar Impacto, colisão e
rede; e não há lugar nenhum que registre "este projeto usa X" — quem chega depois não sabe o que
está ligado, e quem começa sem uma ferramenta não tem caminho para adotá-la depois.
**Pronto quando:** num repo com graphify no PATH, `marvin` sem flag constrói o grafo após
consentimento e escreve `.marvin/ferramentas.md`; sem TTY assume "não" sem travar; num repo sem a
ferramenta, sugere a instalação e registra `não`; `marvin --usar ponytail` depois flipa o registro e
escreve a seção no `AGENTS.md`; rodar duas vezes não pergunta de novo nem duplica; `--dry-run` não
escreve nada; `node teste.mjs` verde nos três SO.

## Fluxos ligados
- [montagem](../../../../../Contexto/Fluxos/montagem.md)

## Código tocado
- `marvin.mjs` — `temFlag` (flags novas: `--ponytail`, `--usar=<ferramenta>`, `--sem-perguntas`)
- `marvin.mjs` — `carregarGrafo` (consumo já é implícito; fica)
- `marvin.mjs` — `escreverSeFaltar` (o `ferramentas.md` nasce por aqui)
- `marvin.mjs` — passo 7c (seção *Ferramentas* no `AGENTS.md` gerado)
- `marvin.mjs` — passo 8b (a construção do grafo deixa de depender só da flag)
- `marvin.mjs` — `ATUALIZACOES` (marca para quem montou antes)
- `teste.mjs` — caso sem TTY e caso idempotência do registro
- `README.md` / `README.pt-BR.md` — tabela de ferramentas com coluna *alcance*

## Time
- tl — a US escreve no perfil (detecção lê `~/.claude/plugins/`) e muda o run padrão
- po — decide o que é pergunta e o que é flag; decide em que papel o ponytail entra
- dev-back — implementação
- qa — os dois casos novos do `teste.mjs` (sem TTY; registro idempotente)

## Skills
- adaptador-de-ferramenta — proposta: detectar → perguntar (só com TTY) → registrar em
  `ferramentas.md` → seção no `AGENTS.md` com selo de confiança → marca em `ATUALIZACOES` →
  linha nos dois READMEs. Vira SKILL.md no terceiro adaptador.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 6 nó(s) de código em 4 comunidade(s) — **escopo largo**: vale fatiar?.

**Quem depende do que ela toca** (1, até 2 níveis) — é o que o QA precisa cobrir:
- `calcularStatus()  marvin.mjs:L868`

**Outras US no mesmo código** — combine antes, não no merge:
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../organizacao-por-grafo/script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 3 nó(s) em comum

## Rumo
- **15/09/2026** — **cancelada no mesmo dia:** o Impacto acusou escopo largo. Fatiada em [US-11a](../US-11a-registro-e-graphify/Sobre.md) e [US-11b](../US-11b-ponytail-e-papeis/Sobre.md); as decisões abaixo valem para as duas.
- **15/09/2026** — aberta. Decidido:
  - **Detectar antes de perguntar.** graphify: binário no PATH ou `graphify-out/`. ponytail:
    instalado = `~/.claude/plugins/installed_plugins.json`; ativo = `~/.claude/.ponytail-active`
    (só nasce após `/ponytail <nível>`). São dois estados, e o registro distingue.
  - **Pergunta só com TTY.** Sem stdin assume `não` e avisa. Cada pergunta tem flag equivalente,
    para ser reproduzível e para o `--dry-run` continuar honesto.
  - **Registro versionado** em `.marvin/ferramentas.md`: ferramenta · usa · alcance · data.
    `--usar=<ferramenta>` flipa e reescreve a seção. Rodar de novo lê e não pergunta.
  - **Alcance por plataforma fica explícito.** graphify: saída é JSON/markdown, qualquer agente
    lê; só o hook é do Claude (e não é usado). ponytail: plugin no Claude Code/Codex; `.cursor/rules/`
    no Cursor; `AGENTS.md` no resto — a detecção segue `--tools=`.
  - **Nunca instala nada no perfil.** Ausente = sugere o comando e registra `não`.
  - **ponytail é adaptador de confiança baixa:** README lido, plugin instalado (v4.10.0), não
    medido. O "54% menos código" é do autor. Medir com o `--status` (tokens, US-08) em `lite`
    antes de recomendar `full`.
  - **O que o ponytail não substitui:** invariante escrito. Ele fala com o modelo; o que precisa
    valer sem plugin fica no `AGENTS.md`.
  - **Decidido pelo po (15/09) — em que papel o ponytail entra:** `dev-back`/`dev-front`
    (implementação, sonnet) **sim**; `qa` talvez (o "um check executável" dele conflita com
    suíte real); `tl` **não** (lê diff e precisa de explicação — a regra de saída dele corta o
    porquê); `po` **não** (é quem questiona requisito, não o plugin); `scout` **não** (haiku,
    só recuperação). O Marvin só *sugere* no `.claude/agents/README.md` — o corpo do agente é
    do humano (invariante 4).
  - Descartado: **obrigar** (quebra zero dependência e invariante 3) e **tirar** (jogaria fora
    Impacto/colisão/rede da US-10). Descartado o hook oficial do graphify (8b explica).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
