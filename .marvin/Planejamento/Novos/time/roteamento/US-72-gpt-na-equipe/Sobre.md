---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-72-gpt-na-equipe
description: "O Marvin sabe que o usuário tem Claude e GPT: detecta o Codex, põe o GPT na matriz de papéis e permite mandar etapa para ele (codex exec). Refino de 23/10 com tl e po; a divisão em US e a ordem esperam o dono (divergência abaixo)."
---
# US-72 — o GPT na equipe: detectar, matriz e ponte

**Por quê:** pedido do dono, 23/10: "o Marvin é um plugin de apoio ao desenvolvimento por LLM; eu tenho Claude e GPT, e graças a um plugin consigo me conectar ao GPT — o Marvin precisa mapear e saber disso"; "pode dividir as atividades com o GPT"; "junta o GPT na matriz de papéis (com Terra, se existir)". Regra do dono (decisoes-fechadas, 23/10): o que ajuda vira obrigatório; medido sem ganho, sai. Hoje:
- **não detecta** — `marvin.mjs:2199` ("local declarations only, no credential discovery or calls", decisão da US-19/20); disponibilidade só por flag (L290-302) ou prompt (L2240-2256); `validAvailability` (L274-277) só aceita `tested: 'not-confirmed'`.
- **matriz só Claude** — template do `Equipe.md` (`marvin.mjs:2878-2904`, coluna "Partida no Claude"); `IA.md:39` sem par do Haiku; `mapa-capacidades.md:42-45` tem Astra, Sol, Luna.
- **sem ponte** — `delegacao.md:127-146` manda verificar o meio antes de prometer; subagente do Claude não roda GPT.
- **sem custo do GPT** — `computeSpend` (L697) só lê `~/.claude/projects`; `PRICES` (L686-692) sem GPT.

Fatos medidos em 23/10: `codex` CLI 0.160.1 no PATH, logado via ChatGPT, padrão `gpt-6-luna` · médio; catálogo local: `gpt-6-astra`, `gpt-6-sol`, `gpt-6.1-sol`, `gpt-6-luna` e **Terra só como `gpt-5.6-terra`** (geração anterior). O `codex exec -C <repo> -s read-only "<prompt>" < /dev/null` revisou a US-71 (~56k tokens) e pegou 2 pontos que o `qa` não pegou, sem mudar a decisão do `tl`; **sem `< /dev/null` trava em silêncio** esperando stdin.

**Pronto quando** (ordem do dono, 29/10: **o par primeiro** — `qa` Claude sozinho × `qa` + `codex exec` no mesmo diff, ≥ 2 pares, aceite independente; detecção e matriz só se o par pagar, cada uma em US própria):
1. **Detecção** — `--check`/`--status` mostram "detectado × declarado" para `claude` e `codex` (`codex` no PATH, `codex login status` com stdin fechado e timeout, chave `model` do `~/.codex/config.toml`); grava só quando o `disponibilidade.json` não existe, com `source: 'detected'` e `tested` continuando `not-confirmed` (invariante 3); esquema compatível com a 3.4.2 (hoje um Marvin antigo aborta com exit 1 diante de esquema desconhecido, L2216 — bloqueio do `tl` se entrar sem compatibilidade). Teste hermético com `codex` falso (`.cmd` e sh) e sem codex.
2. **Matriz** — coluna paralela "Partida no GPT" no template do `Equipe.md` (não substitui a do Claude), `IA.md` com o par do Haiku e `mapa-capacidades.md` com fonte; texto "ponto de partida, não equivalência; confira o catálogo do executor"; marca nova em `UPDATES` (`desde`, `\s+`, `soCom: !OLD_LAYOUT`).
3. **Ponte e custo** — o procedimento `codex exec` (stdin fechado, só leitura para revisão) no `delegacao.md`; custo do Codex no `--status` só com selo de confiança baixa (convenção de ferramenta não confirmada) ou fora.

**Não entra:** ler `~/.codex/auth.json` ou qualquer token; chamar `codex exec` na detecção (gasta cota); roteamento automático; sobrescrever o `disponibilidade.json` existente (invariante 2); religar o plugin `codex@openai-codex` (ver ❓); implementação no GPT (`dev-back`) antes de um par.

## Perguntas
- ~~❓ **1. Divergência `tl` × `po` — o GPT entra na matriz agora ou só depois de medir?**~~ → mede antes, como o `po`: primeiro o par na mesma etapa; a matriz recebe só o papel medido (dono, 29/10/2026).
  - `tl`: 3 US em ordem **detecção → matriz → ponte e custo**. A matriz entra já como "ponto de partida" paralelo (tl/po → Sol · médio; sessão/dev/qa → Luna · médio/baixo; scout → `gpt-5.6-terra` · baixo depois de conferir preço e fonte; Astra fora, como o Fable). A revisão independente pelo GPT já pode ir como etapa manual no *Time* (medida na US-71).
  - `po`: 4 US em ordem **par medido → detecção → matriz** (+ custo do Codex condicional). Primeiro um par na mesma etapa — `qa` Claude sozinho × `qa` + `codex exec` no mesmo diff, aceite independente, ≥ 2 pares; se pagar, a revisão pelo GPT vira obrigatória com Codex disponível. A matriz entra **só com o papel medido**, os outros "não medido" — a coluna do Claude só virou regra depois de 4 pares (US-29), e coluna sem medição é palpite gerado em todo projeto.
- ~~❓ 2. Terra (`gpt-5.6-terra`, geração anterior) entra como par do Haiku? `tl`: sim, se preço e fonte conferirem (recuperação não precisa da geração nova). `po`: não, a menos que você o use de fato; Luna em esforço baixo serve ao `scout`.~~ → não: a Luna em esforço baixo serve ao `scout` (dono, 29/10/2026).
- ~~❓ 3. A ponte é o `codex exec` (já testado) ou o plugin `openai-codex` religado? `tl` e `po`: o CLI.~~ → o CLI `codex exec` (dono, 29/10/2026).
- ~~❓ 4. O GPT é assinatura — conta como $0 marginal? Se sim, a régua do par é achados e cota, não dólar, e a US do custo do Codex não abre.~~ → sim, $0 marginal: a régua do par é achados e cota; a US do custo do Codex não abre (dono, 29/10/2026).
- ~~❓ 5. Dividir atividades = só revisão cruzada pelo GPT agora, ou também implementação no GPT? A segunda pede outro par.~~ → só revisão cruzada pelo GPT agora (dono, 29/10/2026).
- ~~❓ 6. Papéis do GPT ainda não medidos: a matriz mostra "não medido" ou omite a linha?~~ → mostra "não medido" (dono, 29/10/2026).

## Fluxos ligados
- [delegacao.md](../../../../Contexto/Fluxos/delegacao.md) · [IA.md](../../../../Contexto/IA.md) · [mapa-capacidades.md](../../../../Contexto/mapa-capacidades.md)

## Código tocado
- `marvin.mjs` — `validAvailability`
- `marvin.mjs` — `AI_EXECUTORS`
- `marvin.mjs` — `computeSpend`
- `marvin.mjs` — bloco 0a de disponibilidade (~L2199-2266)
- `marvin.mjs` — template do `Equipe.md` (~L2878-2904)
- `marvin.mjs` — `UPDATES`
- `teste.mjs`

## Time
Triagem 23/10/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo). Por frente, partida do `tl` (o `po` acrescenta a etapa do par antes):

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| dividir em US e fechar os ❓ | po + tl | Opus · médio | decisão de escopo depois do dono | ❓ fechados 29/10 pelo dono; dividir em US depois do par |
| par: revisão cruzada (primeiro, ≥ 2 pares) | qa + GPT via `codex exec` | Sonnet · baixo + gpt-6-luna · médio | aceite independente, ≥ 2 pares | feito 29/10 (2 pares, Rumo) |
| detecção: implementar | dev-back | Sonnet · médio | spec fechada | pendente |
| detecção: revisão independente | GPT via `codex exec -s read-only … < /dev/null` | gpt-6-luna · médio | medido na US-71 | pendente |
| detecção: verificar | qa | Sonnet · baixo | teste hermético com codex falso | pendente |
| matriz: texto e `UPDATES` | dev-back | Sonnet · médio | template | pendente |
| ler o diff (cada frente) | tl | Opus · médio | esquema v1/v2, invariante 3, `UPDATES` | pendente |

Grafo (fresco, 23/10 15:57): `validAvailability` (L274) e `AI_EXECUTORS` (L271) com grau 1 e `affected` vazio — a extração não segue o uso no mesmo arquivo; usos reais por Grep (L297, L2215, L2242). `computeSpend` (L697): comunidade própria, grau 7. Bloco 0a e template sem nó — Grep.

## Skills
Nenhuma.

## Rumo
- **23/10/2026** — refinada da linha ⚪ do IA.md (pedido do dono). Divergência `tl` × `po` sobre medir antes da matriz, e 5 ❓ do dono. O próximo chat divide em US conforme a resposta.
- **29/10/2026** — respostas do dono às ❓1-6, todas pela recomendação: mede antes (o par primeiro, a matriz só com papel medido e "não medido" nos outros); GPT conta como $0 marginal, então a US do custo do Codex não abre e o item 3 do *Pronto quando* fica só com a ponte; agora só revisão cruzada; Terra fora; ponte pelo `codex exec`. Ordem: **par → detecção → matriz**. Se o par pagar, detecção e matriz viram US próprias.
- **29/10/2026** — **os 2 pares medidos** (`qa` Sonnet · baixo × `codex exec -s read-only`, mesmo pedido, nenhum vê o outro).
  - **Par 1, diff da US-90 (ainda não revisado):**
    - `codex` (~67k tokens) achou 1 ponto que o `qa` não viu: o teto de 10 vale por lista, então até 20 nomes. O `tl` aceitou, porque é o padrão da US-85.
    - `qa` achou 4 pontos menores que o `codex` não viu.
    - **Nenhum dos dois** apontou o erro de escopo real (linhas novas no `--curto`, que o "Não entra" exclui). Quem pegou foi a sessão principal, e o `tl` confirmou.
  - **Par 2, diff da US-87 (`948f921`, já aprovado; o `tl` tinha deixado um ponto menor):**
    - Os dois reencontraram o ponto do `tl`: release ilegível apaga em silêncio o bloco de documentos. O `codex` (~40k tokens) conferiu o `catch`, mas disse que leu o Rumo, que o pedido mandava ignorar, então o achado dele está contaminado. O `qa` o levantou como hipótese, sem conferir.
    - O `qa` achou ainda uma lacuna que o `codex` não viu: o teste não cobre epic ou feature fechada (decisão 3 do dono na US-87).
  - **Saldo:**
    - Nos 2 pares, o `codex` trouxe 1 achado único, não bloqueante; o `qa` trouxe 5.
    - Nenhum dos dois substituiu o `tl` no erro de escopo.
    - Custo marginal $0, mas uns 40 a 70 mil tokens da cota por revisão.
  - **Pela régua do `po`** ("se pagar, a revisão pelo GPT vira obrigatória com Codex disponível"), **não pagou como obrigatória**. A detecção e a matriz não abrem com base nisso. Decisão final do dono.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
