---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador

**Por quê:** ninguém sabe que `--graphify` existe; e não há onde registrar "este projeto usa X". Decisões comuns em [US-11](../US-11-ferramentas-opcionais/Sobre.md).
**Pronto quando:** com graphify no PATH, `marvin` sem flag pergunta (só com TTY; sem TTY assume `não` e avisa), constrói o grafo se `sim` e escreve `.marvin/ferramentas.md`; sem graphify, sugere `pip install graphify` e registra `não`; `--usar=graphify` flipa o registro depois; rodar duas vezes não pergunta nem duplica; `--dry-run` não escreve; `node teste.mjs` verde nos três SO.

## Fluxos ligados
- [montagem](../../../../../Contexto/Fluxos/montagem.md)

## Código tocado
- `marvin.mjs` — `temFlag` (flags `--usar=<ferramenta>`, `--sem-perguntas`)
- `marvin.mjs` — `escreverSeFaltar` (o `ferramentas.md` nasce por aqui)
- `marvin.mjs` — passo 8b (a construção do grafo deixa de depender só da flag)
- `marvin.mjs` — `ATUALIZACOES` (marca para quem montou antes)
- `teste.mjs` — caso sem TTY e caso idempotência do registro
- `README.md` / `README.pt-BR.md` — tabela de ferramentas com coluna *alcance*

## Time
- tl — muda o run padrão e lê o perfil
- po — decide o que é pergunta e o que é flag
- dev-back — implementação
- qa — os dois casos novos do `teste.mjs`

## Skills
- adaptador-de-ferramenta — proposta: detectar → perguntar (só com TTY) → registrar → seção no `AGENTS.md` com selo → marca em `ATUALIZACOES` → linha nos dois READMEs. Vira SKILL.md no terceiro adaptador.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 5 nó(s) de código em 3 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../US-11-ferramentas-opcionais/Sobre.md) — 5 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../organizacao-por-grafo/script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum

## Rumo
- **15/09/2026** — aberta, fatiada da US-11. Formato do registro: `ferramenta · usa · alcance · data`. Alcance do graphify: saída JSON/markdown, qualquer agente lê; só o hook é do Claude, e não é usado.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
