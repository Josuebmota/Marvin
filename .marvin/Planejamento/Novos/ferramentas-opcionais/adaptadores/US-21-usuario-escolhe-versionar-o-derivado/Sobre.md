---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-21-usuario-escolhe-versionar-o-derivado
description: "O Marvin acrescenta graphify-out/ e .marvin/.status/ ao .gitignore sem perguntar. O usuário escolhe se versiona o grafo e o status — uma vez, registrado em ferramentas.md."
---
# US-21 — o usuário escolhe se versiona o derivado

**Por quê:** hoje o Marvin **decide sozinho** que o derivado não vai para o git — em dois lugares, sem pergunta e sem registro:
1. `--graphify` (bloco 8b e, num projeto sem `.gitignore`, também o passo 8) acrescenta `graphify-out/` ao `.gitignore` ("# grafo de código: DERIVADO, não versionar") — bloco 8b, `marvin.mjs:~3510-3518`;
2. `--status --html` acrescenta `.marvin/.status/` — `writeStatusHtml`, `marvin.mjs:~787-794`.

Medido em 07/10/2026 num projeto-pasta-mãe de um multi-repo (repo privado, em que o dono quer **versionar a estrutura e os grafos**): ele tirou a linha à mão e o `marvin --graphify` seguinte a recolocou. Política de versionamento é do dono do repositório — o Marvin não deve impô-la (a mesma regra que ele já segue: "o arquivo é do usuário, nunca reescrito sozinho").

**Pronto quando:**
1. **Flags** `--track=grafo,status` / `--untrack=grafo,status`. A escolha vai para `.marvin/ferramentas.md` (`versiona: grafo=sim|não, status=sim|não`) e é **lida** nas passadas seguintes. Sem registro e sem flag: **não versionar** (o comportamento de hoje — compatibilidade), e a saída **diz** que assumiu.
2. Resposta **sim**, nos **três** lugares que escrevem `graphify-out/` ou `.marvin/.status/` no `.gitignore`: o passo 8 (`.gitignore` novo, `marvin.mjs:~3443`), o bloco 8b e `writeStatusHtml`. Nenhum acrescenta a linha. Se ela já existe, **avisa** ("`graphify-out/` está no .gitignore mas você escolheu versionar — remova a linha") e **não** reescreve o arquivo sozinho. Cuidado: o passo 8 cria o arquivo; sem ele cobrir o caso, o 8b avisaria sobre uma linha que o próprio Marvin acabou de escrever.
3. Entrada nova na tabela `ATUALIZACOES` (`desde:` a versão em que entrar), porque a linha `versiona:` passa a existir no `ferramentas.md` gerado.
4. **Trava em `teste.mjs`** — rodar com a guarda removida e ver o vermelho: (a) sem registro e sem flag → acrescenta a linha (compat); (b) `versiona: sim` → `--graphify` e `--status --html` deixam o `.gitignore` **byte a byte igual**, **inclusive num projeto sem `.gitignore`** (o passo 8 não cria a linha); (c) linha já presente com `sim` → aviso, nada removido.

**Cortado pelo `po` (07/10/2026):** a pergunta interativa na 1ª vez e o aviso de tamanho do grafo (limite de 100 MB). Um projeto decide uma vez; a flag basta. Reabre se alguém errar a flag em silêncio.

**Não entra:** onde o grafo mora (US-22); detecção de sub-repos aninhados.

## Código tocado
- `marvin.mjs` — `writeStatusHtml` (a linha do `.status`, ~787), o passo 8 (`.gitignore` novo, ~3443), bloco 8b do `--graphify` (a linha do `graphify-out/`), registro em `ferramentas.md`, tabela `ATUALIZACOES`
- `teste.mjs` — as travas
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
- **08/10/2026** — **implementada, não commitada.** `dev-back` fez as flags (`--track`/`--untrack`, registro `versiona:` no frontmatter do `ferramentas.md`, os três lugares do `.gitignore`); `qa` conferiu dry-run, validação e idempotência; `tl` bloqueou na 1ª leitura (dry-run de projeto novo dizia "not recorded"; `--status --track` não avisava que vale só na execução) e aprovou na 2ª. `desde: '2.2.0'` na `ATUALIZACOES` com marca no parágrafo "Versionar o derivado" (não em `versiona:`, que só existe com flag); o `ferramentas.md` deste repo ganhou o parágrafo. Aceito: o laço de ferramentas do passo 0 acrescenta linhas a `ferramentas.md` sem frontmatter (anterior à US, cosmético). Sugestão aberta do `tl`: o teste "sem frontmatter" comparar byte a byte após um run sem flag. **Falta:** commit, subir `package.json` para 2.2.0 e registrar em `Releases/`. Próxima da fila: US-20 (itens 1 e 3, documentação).
- **07/10/2026** — aberta e refinada (pedido do Josué). **Não implementar.**
- **07/10/2026** — revisada por `po` e `tl`. Ordem: **2ª**, depois da US-23. Escopo reduzido às flags (ver "Cortado"). O `tl` achou o terceiro lugar que escreve a linha (passo 8) e a entrada em `ATUALIZACOES`. Não contradiz "derivado nunca é versionado": o Marvin continua não versionando por padrão, só para de impor isso no repositório dos outros.

## Evidência
- **08/10/2026** — `node teste.mjs`: 300 passaram, 0 falharam (eram 286); 6 checks novos travam (a) compat, (b) `.gitignore` byte a byte com `sim`, (c) aviso sem remover, dry-run e `--status`. Com as duas correções removidas, 2 ficam vermelhos. `tl` aprovou. Sem commit ainda.
