---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-31 — `--use` em duas ferramentas perde uma das escritas

**Por quê:** com graphify e ponytail registrados como `não`, `marvin --use=graphify --use=ponytail` imprime "graphify → sim" e "ponytail → sim", mas o arquivo termina com `graphify | não`. A saída diz uma coisa e o registro diz outra, em silêncio: é a classe de falha que o invariante 3 condena. Medido em 11/10/2026 no heimnor e no fole-agent-service, os dois com as duas ferramentas em `não`. Rodar de novo "consertou", o que fazia parecer fantasma.

**Causa (`tl`, lida no código e conferida):** `marvin.mjs:1802` lê o registro uma vez em `rec`. Em `marvin.mjs:1815`, dentro do laço `OPTIONAL_TOOLS`, o arquivo inteiro é gravado com `rec.replace(...)`, e `rec` nunca é atualizado. A volta do graphify grava `graphify sim, ponytail não`; a volta do ponytail grava a partir do `rec` antigo, `graphify não, ponytail sim`. Como `GRAPHIFY` em memória fica `true`, a extração roda, o que mascara o problema. Na segunda tentativa só o graphify estava `não`, houve uma escrita só, e ficou certo.

**Pronto quando:**
1. Depois de cada escrita do laço, `rec` passa a ter o conteúdo novo. Vale para qualquer par de flips, não só esse.
2. **Trava em `teste.mjs`**, na seção do `--use` (~400-456, onde hoje cada teste flipa uma ferramenta só): registro com as duas linhas em `não`, `--use=graphify --use=ponytail`; confere `^\| graphify \| sim \|` **e** `^\| ponytail \| sim \|`. Hoje fica vermelho no graphify. `node teste.mjs` verde.
3. A mesma trava com `--use=graphify,ponytail` (vírgula, `marvin.mjs:108`) também passa.

**Não entra:** a regra "sempre juntos" (é a [US-32](../US-32-graphify-e-ponytail-juntos/Sobre.md)); qualquer mudança no ramo sem TTY ou `--no-questions`.

**Funde com:** é defeito da [US-11a](../US-11a-registro-e-graphify/Sobre.md) e da [US-11b](../US-11b-ponytail-e-papeis/Sobre.md), as duas fechadas. Não reabre nenhuma.

## Código tocado
- `marvin.mjs` — bloco 0b, laço `OPTIONAL_TOOLS` (~1801-1838: a escrita da linha 1815 sem atualizar `rec`)
- `teste.mjs` — seção do `--use` (~400-456)

## Time
Triagem 11/10/2026 (`/refinar`). O `tl` achou a causa; o `po` tinha dado o caso como não reproduzível pelo código. Conferido na sessão principal: a leitura do `tl` vale.
- `dev-back`: 1 linha + 1 teste.
- `qa`: suíte.
- `tl`: diff.

Mesmo chat da [US-30](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md).

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../US-24-fechar-por-sub-repo/Sobre.md) — 2 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../US-32-graphify-e-ponytail-juntos/Sobre.md) — 2 nó(s) em comum
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
- **11/10/2026** — refinada. Saiu da observação "não reproduzida" do Josué na migração para a 2.3.0. Prioridade alta: bug medido, uma linha.
- **11/10/2026** — ativa, junto com a US-30.
- **12/10/2026** — implementada e validada (`dev-back` → `tl`): `rec` atualizado a cada escrita do laço. O `tl` conferiu que as leituras de `rec` depois do laço só testam se ele tem conteúdo e que o dry-run continua honesto (md5 do registro igual antes e depois).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- `node teste.mjs`: **316 passaram**, com 2 checks novos (`--use=graphify --use=ponytail` e a forma com vírgula).
- Mutação rodada pelo `tl`: voltar o `rec` velho → 2 vermelhos.
