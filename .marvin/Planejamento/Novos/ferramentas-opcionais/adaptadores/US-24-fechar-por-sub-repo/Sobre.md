---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-24-fechar-por-sub-repo
description: "marvin --fechar só olha o git da raiz: numa pasta-mãe com repos/<x> o diff dos repos fica invisível e o drift passa calado. Roda git em cada sub-repo e compara com o Código tocado já resolvido pela US-23b."
---
# US-24 — `--fechar` por sub-repo

**Por quê:** o `--fechar` existe para acusar *drift* — código que mudou e não está no "Código tocado" de nenhuma US ativa. Hoje ele roda `git` **só na raiz**: o helper `git()` usa `cwd: ROOT` (`marvin.mjs:~1367`). Numa pasta-mãe (o dono controla vários repos, cada um com git próprio e ignorado pela raiz) o diff de `repos/<x>` não aparece: o comando diz "nothing changed" ou "every changed code file is declared" com o trabalho inteiro fora do alcance dele. Falha **silenciosa** — a mesma classe da US-23 (o produto fora do mapa, e nada avisa). Medido em 07/10/2026 numa pasta-mãe com dois repos de código.

**Pronto quando:**
1. `--fechar` roda `git status --porcelain` e `git log --since=midnight --name-only` na raiz **e em cada sub-repo** (a lista vem da US-23a), prefixando `repos/<x>/` nos caminhos; o relatório agrupa por repo.
2. A comparação com o "Código tocado" usa a **resolução da US-23b** — o arquivo escrito com ou sem prefixo é o mesmo arquivo; nome ambíguo entre dois repos é avisado, não adivinhado.
3. Sub-repo limpo e sem commit hoje → silêncio. Pasta listada que não é repositório git → ignorada **com aviso** (não derruba o comando).
4. "nothing changed" só vale quando **todos** os repos estão limpos; exit 1 se **qualquer** repo tem arquivo de código fora das US ativas.
5. A tabela `ATUALIZACOES` (passo 10) ganha a marca do passo novo do `.claude/commands/fechar.md` gerado (conferir o `git status` por repo), com `desde: '<versão>'`; o template do `fechar.md` diz "por repo".
6. **Trava em `teste.mjs`** — fixture com raiz + 2 sub-repos aninhados: arquivo de código alterado em `repos/a/` fora do Código tocado → acusado (exit 1); declarado, com e sem prefixo → ok. **Com a guarda removida** (git só na raiz) o drift passa calado → vermelho.

**Não entra:** onde o grafo mora (US-22); versionar (US-21); mudar a definição de "mudou" (continua sendo uncommitted + commits de hoje).

**Depende de:** US-23a (lista de sub-repos aninhados) e US-23b (resolução de caminho). Ordem: **depois da 23b**.

## Código tocado
- `marvin.mjs` — bloco `--fechar` (~1360-1420: o `git()` com `cwd: ROOT`, `changedCode`, `filesOf`), a tabela `ATUALIZACOES` (~3892) e o template do `fechar.md` gerado
- `teste.mjs` — a trava com 2 sub-repos
- `README.md` e `README.pt-BR.md` — a descrição do `--fechar`

## Time
- `po` · `tl` · `developer`

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 2 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../organizacao-por-grafo/script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 1 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 2 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 2 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum

## Rumo
- **07/10/2026** — aberta e refinada (pedido do Josué, ao notar que o `--fechar` não enxergava `repos/`). Fila: depois da 23b. **Não implementar.**

## Evidência
<!-- preenchido ao concluir -->
