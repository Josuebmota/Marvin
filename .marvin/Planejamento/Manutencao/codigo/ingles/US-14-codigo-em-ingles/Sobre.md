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

$1- **16/09/2026** — bloco 1 (comentários) feito: 493 linhas em `marvin.mjs`, 147 em `teste.mjs`, mais os
  `/* */` e os de fim de linha. Método: pares antes/depois num JSON aplicados por script que exige
  ocorrência única e troca por função (a armadilha do `$'` do tl.md). Prova de que só comentário mudou:
  os dois arquivos com comentários removidos são idênticos ao `d27b1c0`; `--dry-run` byte a byte igual;
  219 verdes. Strings de saída em português que apareceram no caminho (`info('README.md já existe')`,
  `memória DESLIGADA` do hook, cabeçalhos do `--status` texto) ficam para o bloco 3 — são visíveis ao usuário.
  $1- **16/09/2026** — bloco 2 (identificadores) feito num passe só, não por região: renomear um binding global
  atravessa o arquivo inteiro, então "um commit por ~500 linhas" não fatiava nada de útil. O que fatiou o
  risco foi a ferramenta: [`renomear/`](renomear/) — lexer mínimo que classifica cada caractere como código /
  comentário / string / texto de template / regex, e o renomeador só toca **binding em região de código**:
  nunca `.prop`, nunca chave de objeto, e `{ nome }` abreviado vira `{ nome: name }` — o formato dos dados
  (`st.*`, `historico.jsonl`, o JSON da rede no HTML) não muda. 1.647 trocas, 300 nomes (`mapa.json`).
  Três bugs do lexer pegos pelo `teste.mjs`, não por leitura: `${x}` visto como shorthand; `...nomes` visto
  como `.prop`; comentário terminando em "." antes do identificador visto como `.prop`.
  **Prova:** 41 arquivos gerados pelo script antigo e pelo novo, byte a byte iguais — scaffold com os 7
  adaptadores, `--us`, `--status` (texto, `--curto`, `--html`: `index.html` + `historico.jsonl`), `--check`,
  `--fechar`, `--dry-run`, `--help`, neste repo e num projeto limpo. 219 verdes.
  **Ficou em português, de propósito, para o bloco 3:** chaves de objeto (`st.ativas`, `ponto.us_ativas`,
  `no.rotulo`…) — são formato de dado; as da rede e do `historico.jsonl` são saída, e mudar exige o teste
  junto. `us`, `rumo`, `sobre` são vocabulário do domínio (nome de seção e de arquivo) e ficam.
- **16/09/2026** — bloco 3 encurtado por decisão do `po` ("caminho mais rápido"): `teste.mjs` renomeado com a mesma
  ferramenta (760 trocas), convenção do `AGENTS.md` trocada. **Chaves de objeto ficam em português** — são formato
  de dado, e as do `historico.jsonl` já estão gravadas em três projetos. Escopo fechado aqui.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
