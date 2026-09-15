---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-14-codigo-em-ingles

**Por quê:** o código-fonte é a única superfície do projeto que ainda está em português; a saída,
o README e o pacote já são em inglês. Padrão único facilita contribuição externa, e o modelo
trabalha melhor com identificador e comentário em inglês. A conversa com o humano continua em
português ou inglês — a decisão é só sobre o que está no arquivo.

**Pronto quando:** `marvin.mjs` e `teste.mjs` sem identificador nem comentário em português;
`node teste.mjs` verde nos três SO do CI; `node marvin.mjs --dry-run` neste repo produz **a mesma
lista de operações** de antes da conversão (diff vazio); convenção no `AGENTS.md` trocada de
"Português no código" para "Inglês no código e no comentário; português na base `.marvin/`, nos
agentes e no commit".

## Escopo

- **Entra:** `marvin.mjs` (3.529 linhas, 491 de comentário), `teste.mjs` (1.049 linhas, 144 de
  comentário), a linha de convenção no `AGENTS.md`.
- **Não entra:** `.marvin/`, `.claude/agents`, `.claude/commands`, `.claude/skills`, `PROMPT.md`,
  mensagens de commit — continuam em português. Templates que o script **escreve** no projeto
  alvo já estão em inglês; não mudam.

## Fluxos ligados
_(nenhum fluxo de produto — é conversão de fonte; comportamento não muda)_

## Código tocado
- `marvin.mjs` — todo o arquivo: identificadores (`emTokens`, `desenhar`, `laco`, `fsw`, `exec`,
  `ATUALIZACOES`, `PRECOS_DATA`…), comentários, nomes de parâmetro
- `teste.mjs` — todo o arquivo: nomes de teste, helpers, comentários
- `AGENTS.md` — seção *Convenções*, primeira linha

## Time
- `tl` — dono do diff: conversão de identificador é onde regressão entra sem teste acusar.
  Lê cada bloco antes de fechar.
- `dev-back` — faz a conversão.
- `qa` — `teste.mjs` + `--dry-run` antes/depois, nos três SO.
- `po` (Josué) — decidiu; valida no fim.

## Plano — em blocos, nunca de uma vez

1. **Comentários** primeiro (zero risco de comportamento). Um commit.
2. **Identificadores locais** (variável, parâmetro, função privada). Um commit por região
   (~500 linhas). `teste.mjs` roda a cada commit.
3. **Nomes que o `teste.mjs` importa ou que aparecem na saída/HTML** — por último, com o teste
   ajustado no mesmo commit.
4. `AGENTS.md` — a convenção, junto com o último bloco.

Regra: **nenhum bloco muda string visível ao usuário nem nome de flag** — se um nome escapa
para a saída, isso é bug do bloco, não escopo.

## Skills
_(nenhuma — conversão roda uma vez)_

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../../Novos/organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../../Novos/organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../../Novos/organizacao-por-grafo/script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../../Novos/organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../../Novos/organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../../Novos/organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum

## Rumo
- **15/09/2026** — aberta. Contra a convenção anterior do `AGENTS.md`, por decisão do `po`
  reafirmada depois da objeção: custo é um diff de arquivo inteiro sem ganho para quem usa,
  e risco de regressão em script que escreve no disco alheio. Mitigação: blocos, `tl` no diff,
  `--dry-run` idêntico como critério. Descartado: manter português com nota no README para
  contribuidor — o `po` quer padrão único.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
