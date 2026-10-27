---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-82-hook-do-grafo-com-hookspath
description: "Com `core.hooksPath` (husky), o marvin não instala o hook do grafo em `.git/hooks` (onde o git não o roda) e não diz que instalou: avisa e dá a linha para colar. O --status deixa de dizer que o hook está ok. Invariante 3."
---
# US-82 — o hook do grafo com `core.hooksPath` (husky) não mente

**Por quê:** anotação de 26/10 (lacuna apontada pelo `tl` na US-80). Com o hook ligado por padrão, todo projeto com husky (`core.hooksPath=.husky`) recebe `.git/hooks/post-commit`, que o git nunca roda, e o `ok` diz que o grafo se atualiza a cada commit. O `--status` também mente: `hookOk` (em `computeStatus`) lê `.git/hooks/post-commit` e o alerta `semHook` da US-74 some. Invariante 3: adaptador que não carrega falha em silêncio.

**Pronto quando:**
1. O passo 8b lê `git config --get core.hooksPath` (leitura; vale no `--dry-run`). Se ele existe e não resolve para `.git/hooks`: não escreve em `.git/hooks`, não imprime `ok`, imprime `warn` citando o `core.hooksPath` e a linha para colar no `post-commit` dele (mesmo formato do caminho "hook alheio"), ou `--no-graph-hook`.
2. Hook do Marvin já instalado em `.git/hooks` (morto) com hooksPath desviado: avisa, não apaga.
3. `computeStatus`: hooksPath desviado conta como `semHook`, com texto próprio no `--status` e no `--curto`.
4. `--graphify-git-hook` respeita a mesma regra.
5. `teste.mjs`: repo com `core.hooksPath .husky` → nada novo em `.git/hooks` nem em `.husky/`, `warn` com `core.hooksPath`, sem `ok`, `--status` alerta; segunda rodada não escreve; `--dry-run` não escreve; repo sem hooksPath segue byte-idêntico à US-80.

**Não entra:** escrever no `post-commit` do hooksPath (`.husky/` é pasta versionada da equipe — ❓1); lefthook, pre-commit e afins por nome; marca em `UPDATES` (nenhum texto gerado muda; o `warn` roda a cada `marvin`, como na US-80).

## Perguntas
- ❓ 1. Com `core.hooksPath`, o Marvin só avisa (o mínimo acima) ou também escreve no `post-commit` do hooksPath? `tl` e `po` recomendam só avisar. Esta US não depende da resposta.

## Fluxos ligados
- [ferramentas.md](../../../../../ferramentas.md)

## Código tocado
- `marvin.mjs` — passo 8b, bloco top-level do post-commit (~L4864-4945)
- `marvin.mjs` — `computeStatus`
- `marvin.mjs` — `hookOptedOut`
- `marvin.mjs` — `HOOK_SIGNATURE`
- `marvin.mjs` — `printStatus`
- `marvin.mjs` — `divertedHooksPath`
- `marvin.mjs` — `userPostCommit`
- `marvin.mjs` — `hooksPathRunsRefresh`
- `teste.mjs`

## Time
Triagem 27/10/2026 (`/refinar` na sessão, `tl` e `po` no Opus · médio, em paralelo).

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | escopo fechado pelo `tl` | feito |
| verificar | qa | Sonnet · baixo | `node teste.mjs` + repo com hooksPath + `--dry-run` | feito |
| ler o diff | tl | Opus · médio | invariante 3 e escrita no disco de alguém (`.git/hooks`) | feito |

Grafo (fresco, 26/10 17:40 > 8ea5ca7):
- `HOOK_SIGNATURE` — sem nó (const); Grep L1396, L1543, L4913, L5231
- `hookOptedOut` — affected `computeStatus` L1546; grau 2
- `computeStatus` — affected: nada; grau 19
- passo 8b — sem nó (top-level); Grep L4864

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 4 nó(s) de código em 3 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../../diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 2 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../../../diagnostico/status/US-74-grafo-velho-vira-alerta/Sobre.md) — 2 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../../../diagnostico/status/US-78-teto-por-documento/Sobre.md) — 3 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../US-66-graphify-preserva-origem-doc/Sobre.md) — 3 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../US-70-hook-refaz-docs-do-grafo/Sobre.md) — 2 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../US-80-hook-do-grafo-por-padrao/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../../Novos/ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- … e mais 38

## Rumo
- **27/10/2026** — refinada da anotação da nota (lacuna da US-80): `tl` e `po` de acordo no mínimo (só avisar); o `tl` achou a segunda mentira no `--status`.
- **27/10/2026** — feita, em três leituras do `tl`. `divertedHooksPath()` lê `git config --path --get core.hooksPath` (só leitura; `~` expandido; só com `.git` diretório). Desviado: o passo 8b não escreve nem diz `ok`, dá `warn` com a linha para colar e `--no-graph-hook`; hook do Marvin morto em `.git/hooks` é avisado, nunca apagado; `--graphify-git-hook` cai na mesma regra; o `--status` conta `semHook` com texto próprio (sai com 1, como a US-74). Ajustes do `tl`: (A) a linha colada é reconhecida (`hooksPathRunsRefresh`, só linha não comentada), senão o alerta seria eterno; (B) `--path`; (C) uma chamada só; (D) `hermeticEnv()` no teste (`GIT_CONFIG_NOSYSTEM`, sem `XDG_CONFIG_HOME`/`GIT_CONFIG_GLOBAL`); husky 9 (`core.hooksPath=.husky/_`, pasta gerada): `userPostCommit` aponta para `.husky/post-commit`. ❓1 segue aberta; esta US só avisa.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- `node teste.mjs`: 632 passaram (+17: hooksPath `.husky`, `.husky/_` com `h`, linha colada, linha comentada, hook morto, `--dry-run`, segunda rodada, `--graphify-git-hook`, `--no-graph-hook`, hooksPath = `.git/hooks`).
- qa: repo temporário com `core.hooksPath .husky` — árvore idêntica em duas rodadas e no `--dry-run`; a linha colada no `.husky/post-commit` disparou o refresh num commit real; sem hooksPath instala como a US-80.
- tl: aprovado na terceira leitura.
