---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-111-fundamentar-cache-e-haiku-na-regua
description: "Corrigir a hipótese do cache no delegacao.md (só o modelo derruba o cache nos modelos 5.x, o esforço não) e registrar com fonte oficial o que se sabe do Haiku 5.5; o par medido Haiku vs Sonnet fica como US filha."
---
# US-111 — fundamentar a hipótese do cache e o papel do Haiku 5.5 na régua de esforço

**Por quê:** a régua da [US-92](../US-92-regua-de-esforco-por-atividade/Sobre.md) diz em `delegacao.md` que trocar "modelo ou esforço" só na fronteira entre etapas vale "por causa do cache"; a pesquisa de 07/11/2026 nas docs oficiais da Anthropic mostra que isso vale para o modelo e **não** para o esforço nos modelos 5.x, e o papel do Haiku 5.5 (a dúvida do dono) ainda não tem fonte oficial registrada.
**Pronto quando:**
1. A linha da hipótese do cache em `delegacao.md` (L83) está corrigida (modelo derruba o cache; esforço não, nos modelos 5.x com chave de API ou assinatura) e aponta para a fonte oficial.
2. O *Rumo* desta US registra os achados com as fontes e os limites da leitura (abaixo).
3. A pergunta "o Haiku 5.5 serve para implementação com spec fechada?" está anotada como **US filha** (par medido Haiku vs Sonnet numa US real que toque invariante). Ela **não** é executada aqui.
4. `git diff --check` limpo e os links conferidos pelo `qa`.

**Não entra:** código, `UPDATES`, `--release`; router automático ou juiz LLM (a US-92 já os descartou); alterar a tabela de modelo por papel do `Equipe.md` ou do `CLAUDE.md` (isso espera o par medido); mexer na régua além da linha da hipótese.

## Perguntas
- ~~❓ O par Haiku vs Sonnet vira US filha **anotada agora** ou espera as 3–4 US com a régua aplicada que a US-92 pede? Só o dono decide, porque é o que paga já.~~ → **anotada agora** (dono, 07/11/2026): [US-112](../US-112-par-medido-haiku-vs-sonnet/Sobre.md).
- ~~❓ Os fatos de cache (subagente começa frio, TTL de 5 min fora da conversa principal, leitura a 0,05×) entram também em [controles](../../../../../Contexto/Fluxos/delegacao/controles.md) ou ficam só no *Rumo* desta US?~~ → **ficam só no *Rumo* desta US** (dono, 07/11/2026): `controles.md` não muda.

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md) · [Equipe](../../../../../Contexto/Equipe.md)
- Relacionadas: [US-19](../US-19-papel-modelo-esforco/Sobre.md) (política), [US-29](../US-29-medir-economia-do-roteamento/Sobre.md) (medir economia), [US-92](../US-92-regua-de-esforco-por-atividade/Sobre.md) (régua), [US-100](../US-100-matriz-canonica-de-esforco/Sobre.md) (degrau acima), [US-89](../US-89-subir-degrau-por-check/Sobre.md) (subir por check)

## Código tocado
- `.marvin/Contexto/Fluxos/delegacao.md` — seção "Régua de esforço por etapa", linha da hipótese do cache (L83)

## Time
Triagem 07/11/2026. Régua: só texto de documentação, sem invariante, sem escrita no disco de outro projeto → médio, partida do glossário. `tl` e `po` não entram (sem sinal alto; o escopo já foi decidido pelo dono).

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| conferir na fonte os números do Haiku e a leitura de cache | sessão principal | Sonnet · médio (herdado da sessão) | os números do Haiku vieram de resumo automático da página; reler a tabela oficial antes de citar | feito 07/11: páginas do Haiku 5.5 e de preços relidas, números batem |
| corrigir a L83 e escrever os achados no *Rumo* | sessão principal | Sonnet · médio (herdado da sessão) | texto de documentação, sem código | feito 07/11: L83 do `delegacao.md` reescrita |
| conferir links e `git diff --check` | qa | Sonnet · baixo | como na US-100: links e diff, sem editar | feito 07/11: `git diff --check` limpo, sem caminho pessoal, `## Impacto` gerado; achou 1 link quebrado (4 níveis em vez de 5 no ❓ riscado), corrigido pela sessão principal e conferido |

Grafo (07/11): `graphify-out/graph.json` é de 04/11 18:50:36, do mesmo minuto do último commit (18:50:27), então está atual. `delegacao.md` é nó de documento sem símbolo: `graphify explain "delegacao.md"` caiu na US-84 e `graphify affected "delegacao.md"` respondeu "No unique node match" → **sem nó**; fallback: Grep por "cache" em `.marvin/Contexto` e por "fronteira entre etapas|troca de modelo|trocar modelo" no repositório acha a hipótese **só na L83** do `delegacao.md`, sem cópia em outro `.md` ou no `marvin.mjs`.

## Skills
Nenhuma. É uma correção de texto e um registro, sem procedimento que se repita.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 1 nó(s) de código em 0 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-84 — quebrar o `delegacao.md` e ligar os órfãos](../../../../Manutencao/publicacao/contexto-fixo/US-84-quebrar-delegacao-e-ligar-orfaos/Sobre.md) — 1 nó(s) em comum
- [US-100 — o degrau acima da régua, definido em um lugar](../US-100-matriz-canonica-de-esforco/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../US-19-papel-modelo-esforco/Sobre.md) — 1 nó(s) em comum
- [US-28 — mapa de personas, skills e modelos (Claude e ChatGPT/Codex) e arranjos por disponibilidade](../US-28-modelos-por-papel-claude-e-chatgpt/Sobre.md) — 1 nó(s) em comum
- [US-92 — Régua escrita de modelo e esforço por atividade, aplicada pelo tl e pelo po (e pelo subagente ao devolver)](../US-92-regua-de-esforco-por-atividade/Sobre.md) — 1 nó(s) em comum
- [US-97 — três pendências da régua e do ECC](../US-97-tres-pendencias-da-regua-e-do-ecc/Sobre.md) — 1 nó(s) em comum

## Rumo
- **07/11/2026** — aberta a partir do reel de @donimas (AI Levels, EP 02, matriz Junior/Middle/Senior/GOAT, "12× longer limit"), que o dono trouxe depois de perguntar se o Haiku 5.5 também é bom dev. Visto pelo engine local da skill `watch` (frames, **sem áudio**: o Gemini deu 503 três vezes). O vídeo mostra a mesma escada que a US-92 já tem (Senior = subagentes com modelo fixo) mais um router automático (GOAT), que a US-92 descartou. Os números de economia dele vêm de uma tela marcada "SIMULATED WORKLOAD", sem medição de qualidade.
- **07/11/2026** — pesquisa nas docs oficiais da Anthropic (fontes abaixo). **Achados:** (1) cada modelo tem cache próprio; trocar `/model` no meio faz a requisição seguinte reler o histórico sem nenhum acerto (vale também para o `opusplan` a cada plan mode e para skill com `model` no frontmatter). (2) Trocar o **esforço** mantém o cache no Opus 5.5, Sonnet 5.5, Haiku 5.5 e Fable 5.1 com chave de API ou assinatura; nos demais modelos derruba. Isso corrige a L83 e reforça a US-100 (esforço antes de modelo preserva o cache). (3) Subagente abre com cache próprio e frio e não lê o cache do pai; o do pai fica intacto; fora da conversa principal o TTL padrão é 5 min mesmo em assinatura. (4) Preços por milhão de tokens, entrada/saída: Haiku 5.5 $0,10/$0,50 (acima de 100k de prompt, $0,50/$2,50), Sonnet 5.5 $2/$10, Opus 5.5 $4/$20, Fable 5.1 $10/$50 → proporções ×0,05, ×1, ×2, ×5 como no vídeo; leitura de cache a 0,05× no Sonnet e no Opus 5.5 e 0,025× no Fable 5.1. (5) Haiku 5.5, página oficial: Terminal-Bench 4.0 39,2% contra 70,6% do Sonnet 5.5; FrontierCode 46,4% contra 52,1% (Sonnet em xhigh, comparação não equivalente); a Anthropic indica Sonnet e Opus para coding agêntico complexo e o Haiku para trabalho delimitado e como subagente ao lado deles. Nada disso decide se o Haiku serve para implementação com spec fechada: é o que o par medido responde.
- **07/11/2026** — **limites da leitura (não conferidos a fundo):** a doc de cache da API foi lida só até 100 mil de 164 mil caracteres; a doc de cache do Claude Code foi lida inteira; os números do Haiku vieram de resumo automático da página, **conferir antes de citar** (é a primeira etapa do *Time*); a "routing config" do vídeo é isca de comentário e não foi lida.
- **07/11/2026** — **conferência na fonte feita.** A página oficial do Haiku 5.5 e a de preços foram relidas: Haiku 5.5 $0,10/$0,50 por milhão (acima de 100k de prompt, $0,50/$2,50), Sonnet 5.5 $2/$10, Opus 5.5 $4/$20, Fable 5.1 $10/$50; leitura de cache a 0,05× no Sonnet e no Opus 5.5 e 0,025× no Fable 5.1; Terminal-Bench 4.0 39,2% (Haiku) contra 70,6% (Sonnet); FrontierCode 1.1 46,4% contra 52,1% (Sonnet em xhigh); sem resultado de SWE-bench na página. Frases oficiais: Sonnet 5.5 e Opus 5.5 "remain better choices for complex agentic coding tasks like those measured by Terminal-Bench 4.0"; o Haiku "pairs well with Opus 5.5 and Sonnet 5.5 as a subagent on coding work". Os números do Haiku **deixam de ser pendência**. Seguem não lidos: os últimos 64 mil caracteres da doc de cache da API e as barras de esforço da página do Haiku (só em gráfico, sem valor impresso). Item 1 do *Pronto quando* cumprido: a L83 do `delegacao.md` agora separa modelo (derruba o cache) de esforço (não derruba nos modelos 5.x) e mantém a economia como hipótese não medida.
- **Fontes:** <https://code.claude.com/docs/en/prompt-caching> · <https://platform.claude.com/docs/en/build-with-claude/prompt-caching> · <https://code.claude.com/docs/en/sub-agents> · <https://platform.claude.com/docs/en/about-claude/pricing> · <https://anthropic.com/claude-haiku-5-5>

## Evidência
L83 de `delegacao.md` corrigida (modelo derruba o cache, esforço não nos modelos 5.x; economia segue hipótese não medida); achados e limites no *Rumo* acima; par Haiku vs Sonnet anotado na [US-112](../US-112-par-medido-haiku-vs-sonnet/Sobre.md). `node teste.mjs`: 727 passaram; `git diff --check` limpo; `qa` (Sonnet · baixo) achou 1 link quebrado, corrigido. Sem código, sem `UPDATES`. Commit: `git log --grep "US-111 concluída"` (ainda não feito).
