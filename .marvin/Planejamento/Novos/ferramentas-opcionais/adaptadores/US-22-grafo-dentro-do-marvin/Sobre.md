---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-22-grafo-dentro-do-marvin
description: "O grafo sai de graphify-out/ na raiz e passa a viver dentro do .marvin/ — tudo que o Marvin deriva num lugar só, uma única decisão de versionar (US-21)."
---
# US-22 — o grafo dentro do `.marvin/`

**Por quê:** o Marvin escreve `graphify-out/` na **raiz** do projeto (`graph.json`, `GRAPH_REPORT.md`, `graph.html`, cache — 16 MB num projeto real). Isso polui a raiz e vira uma **segunda pasta** para decidir se ignora ou versiona, ao lado do `.marvin/.status/` que já mora no vault. (Josué, 07/10/2026: *"acho melhor colocar o graphify dentro do marvin"*.) Dentro do `.marvin/` o derivado e o conhecimento ficam juntos, e a decisão da US-21 vale para tudo.

**Pronto quando:**
1. `marvin --graphify` e `--graphify-rebuild` escrevem em `.marvin/<pasta>/` (`graph.json`, `GRAPH_REPORT.md`, `graph.html`, `manifest.json`, cache); a raiz do projeto fica **limpa** (`git status` sem `graphify-out/`).
2. Projeto com `graphify-out/` antigo na raiz: **migração conferida** (invariante 1 — copia, confere a contagem de nós e de arquivos, só então remove; copiou menos → aborta e não apaga nada), com pergunta.
3. `graphify query` / `affected` / `explain`, o `post-commit` (`--graphify-git-hook`) e o `CLAUDE.md` gerado apontam para o caminho novo. ❓ **Medir antes:** o `graphify query` aceita `--graph <caminho>`? O padrão dele é ler `graphify-out/graph.json` do diretório atual. Se não aceitar, o Marvin cria `graphify-out` como junction para o local novo, ou o `CLAUDE.md` instrui o comando completo.
4. `marvin --us` e `--status` (o *Impacto*) leem o grafo do caminho novo.
5. `AGENTS.md`/`CLAUDE.md` gerados e os READMEs dizem o caminho novo.
6. **Trava em `teste.mjs`:** build num projeto-fixture grava só dentro de `.marvin/`; a raiz não ganha `graphify-out/`; a migração aborta se a cópia for menor que a origem.

❓ **Nome da pasta:** `.marvin/grafo/` (consistente com o vault em português) ou `.marvin/graphify-out/` (o nome que o graphify usa — menos surpresa)?

**Não entra:** a pergunta de versionar (US-21); sub-repos aninhados em `repos/<x>` (hoje a detecção olha só os filhos diretos da raiz — `SUBREPOS`, `marvin.mjs:~1792-1803` — e não acha o código; é outro defeito, medido no mesmo dia).

## Código tocado
- `marvin.mjs` — `OUT_DIR` e `GRAPH` (bloco do `--graphify`, ~3496), a geração do `CLAUDE.md` do graphify (~3317-3340), o hook `post-commit`, `docsGraph`
- `teste.mjs` — as travas
- `README.md` e `README.pt-BR.md`

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
- **07/10/2026** — aberta e refinada (pedido do Josué). Depende de medir o `graphify query --graph`. **Não implementar.**

## Evidência
<!-- preenchido ao concluir -->
