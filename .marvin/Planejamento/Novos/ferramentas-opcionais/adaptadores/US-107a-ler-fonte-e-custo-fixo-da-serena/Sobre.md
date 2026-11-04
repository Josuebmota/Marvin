---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-107a-ler-fonte-e-custo-fixo-da-serena
description: "Refinada: ler a fonte da Serena (MCP) e medir o custo fixo por sessão; para sem par se ela não carregar como MCP ou se o custo fixo comer o ganho plausível. Primeira metade da US-107."
---
# US-107a — ler a fonte e medir o custo fixo da Serena

**Por quê:** o dono (03/11/2026) viu um reel que afirma 90% de economia de tokens sem linha de base, e a Serena é o único nome concreto nele. Hoje nada sobre ela está conferido: o que está na [US-107](../US-107-avaliar-serena/Sobre.md) é de memória. Esta US custa pouco, serve também ao graft e decide se o par (US-107b) vale. Origem: dono, 04/11/2026, "refinar em 107a/b" (o `tl` quis refinar; o `po` quis só o passo 0, e a leitura da fonte é esse passo).

**Pronto quando** (esta US não escreve código):
1. **Fonte lida e datada:** repositório, licença, como instala e como carrega (MCP stdio?), as ferramentas que o MCP expõe, se usa servidor de linguagem, se guarda memória e se é o "tradutor" do reel ou só uma peça ao lado. Cada fato com "conferido em <data>" no Rumo; o que a fonte não diz fica "não conferido".
2. **Custo fixo medido:** tokens por sessão com e sem a Serena, lidos no `/context`, instalada **só em escopo de projeto ou worktree** e removida depois. Número no Rumo.
3. **Parada:** se a Serena não carrega como MCP, ou se o custo fixo já come o ganho plausível, a linha `serena` entra no `.marvin/ferramentas.md` com `usa: não` e o número, e a US-107b é cancelada sem par. Caso contrário a 107b segue.
4. **Registro:** a linha `serena` no `ferramentas.md` (abaixo de 600 caracteres, molde das linhas `graft` e `impeccable`), `usa: não`, "confiança baixa: não medido o ganho", critério de reabertura numérico.
5. **Se for MCP sempre carregado:** o `tl` diz no Rumo se isso cai na decisão fechada "graphify como consulta, nunca o hook que exige consulta a cada Read".

**Não entra:** código no `marvin.mjs` (`OPTIONAL_TOOLS`, detecção, oferta no `AGENTS.md`, marca em `UPDATES`); o par com e sem (US-107b); instalar fora do escopo de projeto; projeto de cliente; copiar o método do reel; tomar os 90% como premissa; substituir o graphify; comparar com a memória do `.marvin/Memoria` (a ❓1 da US-107 separa as duas avaliações).

## Perguntas
- ~~❓ 1. (da US-107) A dor é custo de tokens em leitura de código ou contexto de documentos e memória?~~ → **os dois** (dono, 04/11/2026). Esta US confere na fonte se a Serena guarda memória; a 107b mede só a leitura de código, e a parte de memória vira US separada se a fonte confirmar.
- ~~❓ 2. Em qual projeto instalar o MCP para medir o custo fixo?~~ → **Parci**, escopo de projeto (dono, 04/11/2026). Falta conferir se ele tem servidor de linguagem; é o primeiro passo da medição.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
Nenhum código (leitura, medição e registro). Editado: `.marvin/ferramentas.md` (a linha `serena`). Lido, só para a US filha eventual: `marvin.mjs` — `OPTIONAL_TOOLS` (L2709, grau 3 no grafo; `affected` sem dependentes) e `pluginScope` (L2647, chamada por `detectPonytail` e `detectImpeccable`).
- `.marvin/ferramentas.md` — a linha `serena`

## Time
Triagem 04/11/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo; grafo fresco). A ilha é só o `ferramentas.md`.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| ler a fonte | scout | Haiku · baixo | recuperação delimitada; exige rede, então pode precisar ser a sessão principal | pendente |
| medir o custo fixo | dev-back | Sonnet · baixo | medir pelo `/context`, sem julgamento; o dono instala | pendente |
| conferir o registro | qa | Sonnet · baixo | linha dentro do teto, número bate com o `/context` | pendente |
| decidir o `usa` e a parada | tl + po | Opus · médio | julgamento; o dono dá a palavra final | pendente |

Grafo (fresco, 04/11): `OPTIONAL_TOOLS` L2709 — grau 3 (contains; US-71 e US-48), `affected` sem nó; `pluginScope` L2647 — chamada por `detectPonytail` (L2663) e `detectImpeccable` (L2703). Não há nó da Serena; Grep (só para localizar) não acha "serena" no `marvin.mjs` nem no `ferramentas.md`.

## Skills
Nenhuma.

## Rumo
- **04/11/2026** — refinada (`/refinar`, `tl` e `po` no Opus · médio). Nasce da US-107, dividida como a US-11 em 11a/11b. Nada da Serena foi conferido ainda.
- Parada de gasto: leitura mais custo fixo, sem par. O teto do par (~2 × 125k tokens, no máximo 300k) é da 107b.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
