---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-24-fechar-por-sub-repo
description: "marvin --fechar só olha o git da raiz: numa pasta-mãe com repos/<x> o diff dos repos fica invisível e o drift passa calado. Roda git em cada sub-repo e compara com o Código tocado já resolvido pela US-23b."
---
# US-24 — `--fechar` por sub-repo

**Por quê:** o `--fechar` existe para acusar *drift* — código que mudou e não está no "Código tocado" de nenhuma US ativa. Hoje ele roda `git` **só na raiz**: o helper `git()` usa `cwd: ROOT` (`marvin.mjs:1450`). Numa pasta-mãe (o dono controla vários repos, cada um com git próprio e ignorado pela raiz) o diff de `repos/<x>` não aparece: o comando diz "nothing changed" ou "every changed code file is declared" com o trabalho inteiro fora do alcance dele. Falha **silenciosa** — a mesma classe da US-23 (o produto fora do mapa, e nada avisa). Medido em 07/10/2026 numa pasta-mãe com dois repos de código.

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
- `marvin.mjs` — bloco `--fechar` (~1443-1500: o `git()` com `cwd: ROOT`, `changedCode`, `filesOf`), a tabela `ATUALIZACOES` (~4034) e o template do `fechar.md` gerado
- `teste.mjs` — a trava com 2 sub-repos
- `README.md` e `README.pt-BR.md` — a descrição do `--fechar`

## Time
Triagem 10/10/2026 (sessão principal no papel de `tl` + `po`, com o dono). Grafo refeito no mesmo dia (`marvin --graphify --graphify-rebuild`, 269 nós). **Limite do grafo:** o *Código tocado* nomeia arquivos, e o `marvin.mjs` é um nó só, então o *Impacto* diz "folha, 22 US no mesmo arquivo". Isso não discrimina nada. O escopo real saiu da leitura do bloco `--fechar` (`marvin.mjs:1443-1500`).

| Etapa | Papel | Capacidade | Modelo / esforço | Motivo | Estado |
|---|---|---|---|---|---|
| implementar `--fechar` + template + `ATUALIZACOES` + trava | `dev-back` | Node, git, fixture hermética | sonnet (frontmatter) / herdado da sessão, aplicado não confirmado | escopo fechado abaixo; implementação | feita — 2 rodadas (a 2ª corrige o achado do `qa`) |
| verificar | `qa` | rodar `npm run test`, conferir o que a trava não cobre | sonnet (frontmatter) / herdado, não confirmado | independente do autor | feita — 1 bug real (nome entre aspas no porcelain) |
| ler o diff | `tl` | invariantes 1-3, dry-run, determinismo | opus (frontmatter) / herdado, não confirmado | mudança de código | feita — aprovado, mutações rodadas por ele |

**Decisões da triagem (tl):**
- **Lista de repos = `repoDirs()`** (`.git` em profundidade 1-2, só filesystem), **não** `SUBREPOS`. O `SUBREPOS` só existe com `--graphify` e só lista repo ignorado pela raiz. Um repo aninhado *não* ignorado também fica fora do `git status` da raiz, porque o git para no `.git` aninhado. Desvio consciente do "lista vem da 23a" do item 1.
- **Declarado = `readNode(...).tocados`** (já passa por `canonFile`, a resolução da 23b), unido ao `source_file` do grafo. Sem grafo o comando hoje não enxerga nada declarado. Com isso passa a enxergar.
- **Ambíguo:** um `tocado` sem prefixo que existe em 2+ repos é avisado e não cobre nada.
- **Pasta com `.git` que o git recusa** → aviso e segue. O `git()` atual engole erro e devolve `''`, ou seja, "limpo" em silêncio. É a falha que o item 3 proíbe.
- **Marca nova em `ATUALIZACOES`:** `/por repo/` no `fechar.md`, `desde: '2.3.0'` (proposta; a versão é do dono no release).

## Skills
Nenhuma nova. O padrão "fixture com git aninhado no `teste.mjs`" é a primeira execução. Só vira skill se repetir.

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
- [US-21 — o usuário escolhe se versiona o derivado](../US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../organizacao-por-grafo/script/US-05-release/Sobre.md) — 2 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 2 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../../../organizacao-por-grafo/script/US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 2 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 2 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum

## Rumo
- **07/10/2026** — aberta e refinada (pedido do Josué, ao notar que o `--fechar` não enxergava `repos/`). Fila: depois da 23b. **Não implementar.**
- **10/10/2026** — ativa. Grafo refeito e triagem registrada no *Time*: lista de repos por `repoDirs()`, declarado por `tocados` (23b), aviso para ambíguo e para `.git` recusado. Próximo: `dev-back` implementa.
- **10/10/2026** — implementada e validada. O `qa` achou que nome com espaço, aspas ou não-ASCII vinha entre aspas no porcelain e sumia do drift (bug anterior à US, agora também nos sub-repos); corrigido com `status -z` / `log -z`. Ressalvas do `tl` fechadas: marca `/por\s+repo\b/` e o `fechar.md` deste repo com o passo novo. Não coberto por teste: o ramo `C` (cópia) do parser, que segue o formato documentado mas não foi reproduzido; o filtro de entrada `dir/` (afeta só o "nothing changed"). `desde: '2.3.0'` é proposta; a versão sai no release.

## Evidência
- `node teste.mjs`: **310 passaram** (Windows), bloco 9z-b com 10 checks: raiz + `repos/svc-a` + `repos/svc-b`.
- Mutações rodadas pelo `tl` numa cópia: git só na raiz → 7 vermelhos; sem a guarda `rev-parse --show-prefix` → 1 vermelho (`.git` recusado); sem o `i++` que pula a origem do rename → 1 vermelho (nome com espaço). Cada guarda tem um teste que falha sem ela.
- Casos manuais do `qa` (scratchpad, HOME redirecionado): sub-repo em profundidade 1, sub-repo não ignorado pela raiz, rename, raiz sem git e sem `graphify-out` — todos ok.
