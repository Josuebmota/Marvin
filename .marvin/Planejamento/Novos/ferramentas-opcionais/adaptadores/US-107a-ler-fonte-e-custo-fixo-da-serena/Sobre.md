---
tipo: us
estado: concluida
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

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 1 nó(s) de código em 0 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-84 — quebrar o `delegacao.md` e ligar os órfãos](../../../../Manutencao/publicacao/contexto-fixo/US-84-quebrar-delegacao-e-ligar-orfaos/Sobre.md) — 1 nó(s) em comum
- [US-104 — Impeccable como ferramenta opcional](../US-104-impeccable-opcional/Sobre.md) — 1 nó(s) em comum
- [US-105 — Motion para sites](../US-105-motion-para-sites/Sobre.md) — 1 nó(s) em comum
- [US-106 — O Marvin oferece o Impeccable (entrada no `OPTIONAL_TOOLS`)](../US-106-impeccable-oferta-no-optional-tools/Sobre.md) — 1 nó(s) em comum
- [US-107b — o par com e sem a Serena](../US-107b-par-com-e-sem-serena/Sobre.md) — 1 nó(s) em comum
- [US-25 — avaliar Superpowers e Claude Octopus contra o fluxo do Marvin](../US-25-avaliar-superpowers-e-octopus/Sobre.md) — 1 nó(s) em comum
- [US-48 — Superpowers e ECC como ferramentas de execução da equipe](../US-48-superpowers-e-ecc/Sobre.md) — 1 nó(s) em comum
- [US-68 — ponytail ligado e medido](../US-68-ponytail-medido/Sobre.md) — 1 nó(s) em comum
- [US-93 — ponytail: segundo par medido](../US-93-ponytail-segundo-par/Sobre.md) — 1 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum

## Rumo
- **04/11/2026** — refinada (`/refinar`, `tl` e `po` no Opus · médio). Nasce da US-107, dividida como a US-11 em 11a/11b. Nada da Serena foi conferido ainda.
- **04/11/2026 — ativa; item 1 (fonte lida), conferido em 04/11/2026 em github.com/oraios/serena (README, via WebFetch resumido: o texto literal não foi relido).**
  - Licença por componente: SolidLSP MIT; o restante GPL-3.0-or-later; combinação rege-se pela GPL. Contribuição exige CLA.
  - Instala com `uv tool install -p 3.13 serena-agent` e `serena init`; a página avisa para **não** instalar por marketplace de MCP ou plugin. `uvx` e `pip`: não consta.
  - Carrega como MCP de duas formas: comando de início do cliente, ou servidor em modo HTTP com a URL no cliente. **stdio: não consta.**
  - Ferramentas citadas: recuperação (find symbol, overview, referencing symbols, declaration, implementations, diagnósticos), edição simbólica (replace symbol body, insert before/after, safe delete), rename, básicas (search_for_pattern, replace_content, list_dir, find_file, read_file, execute_shell_command — **desligadas por padrão dentro de Claude Code**). Lista completa com parâmetros: não consta.
  - Backend padrão: servidores de linguagem (LSP), "mais de 40 linguagens", C# e TypeScript entre elas. Backend alternativo: plugin JetBrains, pago.
  - Memória: **existe** e pode ser desligada; onde guarda: não consta. Não é só navegação: é conjunto (leitura, edição, memória). ❓ 1 da US-107: a parte de memória é confirmada, vira US separada.
  - Parci (`<caminho do Parci>/repos`): `parci-api` (.sln, C#), `parci-front` e `parci-mobile` (TypeScript). Há LSP para as duas linguagens segundo a página; **não conferido** que funcione no Windows e na solução do Parci.
  - Item 5 (parcial): o servidor entra como MCP sempre carregado quando ligado, mas o **custo fixo só o `/context` diz**.
- **04/11/2026 — instalada com autorização do dono.** O `uv` **não** estava instalado (a entrada do PATH era de uma pasta inexistente; o registro acima errou); instalado por `winget install astral-sh.uv`. Depois `uv tool install -p 3.13 serena-agent` (Serena 2.1.0, backend LSP) e `serena init` (cria `~/.serena`). MCP registrado **só em escopo local do Parci** (`claude mcp add --scope local serena -- serena start-mcp-server --context claude-code --project-from-cwd`; nada no git do Parci). Transporte **stdio**: conectou (`claude mcp list`: ✔ Connected). A conexão criou `.serena/` não rastreado na raiz do Parci (a remover ao desinstalar). Falta o número: o dono abre o Claude Code no Parci e lê o `/context` com e sem o MCP.
- **Pendente do dono (original):** `uv` já está no PATH. A medição exige instalar a Serena (download e execução de código de terceiro, GPL) e ler o `/context` numa sessão do Claude Code aberta no Parci; esta sessão não enxerga o `/context` de outra.
- Parada de gasto: leitura mais custo fixo, sem par. O teto do par (~2 × 125k tokens, no máximo 300k) é da 107b.

## Evidência
Fechada pelo dono em 04/11/2026 com a parada do item 3 adaptada: o par rodou inline na tarefa "onde `finalidadeEfetiva` é usada" no Parci (1 par). Com Serena 8 de 9 usos; sem, 9 de 9. Totais de `/context` do par não foram entregues. Linha `serena` em `.marvin/ferramentas.md`, `usa: não`.
