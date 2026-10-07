---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-21-usuario-escolhe-versionar-o-derivado
description: "O Marvin acrescenta graphify-out/ e .marvin/.status/ ao .gitignore sem perguntar. O usuário escolhe se versiona o grafo e o status — uma vez, registrado em ferramentas.md."
---
# US-21 — o usuário escolhe se versiona o derivado

**Por quê:** hoje o Marvin **decide sozinho** que o derivado não vai para o git — em dois lugares, sem pergunta e sem registro:
1. `--graphify` acrescenta `graphify-out/` ao `.gitignore` ("# grafo de código: DERIVADO, não versionar") — bloco 8b, `marvin.mjs:~3510-3518`;
2. `--status --html` acrescenta `.marvin/.status/` — `writeStatusHtml`, `marvin.mjs:~787-794`.

Medido em 07/10/2026 num projeto-pasta-mãe de um multi-repo (repo privado, em que o dono quer **versionar a estrutura e os grafos**): ele tirou a linha à mão e o `marvin --graphify` seguinte a recolocou. Política de versionamento é do dono do repositório — o Marvin não deve impô-la (a mesma regra que ele já segue: "o arquivo é do usuário, nunca reescrito sozinho").

**Pronto quando:**
1. Na 1ª vez que um passo precisa decidir (grafo ou status html), o Marvin **pergunta** (só com terminal): "versionar o grafo? (`graph.json` tem N MB e muda a cada rebuild)" e "versionar o `.status`?". A resposta vai para `.marvin/ferramentas.md` (`versiona: grafo=sim|não, status=sim|não`) e é **lida** nas passadas seguintes — nunca pergunta duas vezes.
2. Sem terminal ou com `--no-questions`: assume **não versionar** (o comportamento de hoje — compatibilidade) e **diz** na saída que assumiu.
3. Flags para script: `--track=grafo,status` / `--untrack=grafo,status`.
4. Resposta **sim**: o Marvin **não** acrescenta a linha; se ela já existe no `.gitignore`, **avisa** ("`graphify-out/` está no .gitignore mas você escolheu versionar — remova a linha") e **não** reescreve o arquivo sozinho.
5. Resposta **sim** com grafo grande: mostra o tamanho e avisa do ruído de diff (e que o `post-commit` do graphify regenera o grafo a cada commit); o limite do GitHub é 100 MB por arquivo.
6. **Trava em `teste.mjs`** — rodar com a guarda removida e ver o vermelho: (a) sem registro e sem terminal → acrescenta a linha (compat); (b) `versiona: sim` → `--graphify` e `--status --html` deixam o `.gitignore` **byte a byte igual**; (c) linha já presente com `sim` → aviso, nada removido.

**Não entra:** onde o grafo mora (US-22); detecção de sub-repos aninhados.

## Código tocado
- `marvin.mjs` — `writeStatusHtml` (a linha do `.status`), bloco 8b do `--graphify` (a linha do `graphify-out/`), registro em `ferramentas.md`
- `teste.mjs` — as três travas
- `README.md` e `README.pt-BR.md` — seção do graphify e do status

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
- [US-22 — o grafo dentro do `.marvin/`](../US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
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
- **07/10/2026** — aberta e refinada (pedido do Josué). **Não implementar.**

## Evidência
<!-- preenchido ao concluir -->
