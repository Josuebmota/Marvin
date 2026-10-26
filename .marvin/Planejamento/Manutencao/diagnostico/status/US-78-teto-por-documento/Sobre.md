---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-78-teto-por-documento
description: "Teto de tamanho por documento (constante, aviso no --status) e aviso de fragmento órfão, sem pai no grafo. Issue #9; a parte das anotações (#8) foi para a US-81."
---
# US-78 — teto por documento e fragmento órfão

**Por quê:** issue #9, princípio do dono (26/10/2026): todo documento precisa de tamanho-limite para não prejudicar a leitura da LLM, e fragmentar ajuda desde que o grafo ache cada fragmento. Medido no Parci: linhas de tabela do `escopo.md` com milhares de caracteres e `Sobre.md` com 200+ linhas. O Marvin só tem teto para o que carrega sozinho: `NOTE_CEILING` e `FIXED_TK_CEILING` (`marvin.mjs:394-395`).

**Pronto quando:**
1. Constante de teto por documento ao lado de `NOTE_CEILING`/`FIXED_TK_CEILING` (sugestão da issue: ~12–15 KB ou ~300 linhas; linha de tabela acima de ~600 caracteres), sem arquivo de configuração.
2. `--status` varre os arquivos de `planningNodes` (L663) e da base e lista os que passam do teto com `!` e o caminho, dizendo **como** quebrar: índice curto + um arquivo por assunto, cada pedaço com link para o pai.
3. Fragmento órfão: documento da base sem aresta de pai em `docsGraph` (L838) — ninguém aponta para ele — gera aviso com o caminho.
4. O `--curto` do hook só fala do teto para o que carrega sozinho (como hoje); o resto fica no `--status` completo.
5. `teste.mjs`: documento acima do teto dispara o aviso; fragmento sem pai dispara o órfão; documento ligado não dispara.

**Não entra:** mover para `historico/` (escrita destrutiva no disco do usuário, invariante 1); `marvin.json` (decisão fechada "sem arquivo de config"); anotações (US-81); o *Impacto* (US-75).

## Decisão do dono (26/10/2026)
O `tl` e o `po` divergiram: o `tl` propôs fazer já, com constante e aviso de órfão; o `po`, medir antes os tk que um documento grande custa, porque o lido sob demanda já se mostrou de custo zero (lição do `10_Decisoes/`). **O dono ficou com o `tl`**, e o fragmento órfão entra.

## Perguntas
- ~~❓ 1. Teto para documento lido sob demanda: já ou depois de medir?~~ → já, com constante (dono, 26/10).
- ~~❓ 2. A #8 vira "anotação = US `anotada`"?~~ → sim (US-81).
- ~~❓ 3. Fragmento órfão entra?~~ → sim.

## Código tocado
- `marvin.mjs` — `NOTE_CEILING`
- `marvin.mjs` — `computeStatus`
- `marvin.mjs` — `printStatus`
- `marvin.mjs` — `docsGraph`
- `teste.mjs`

## Time
Triagem 26/10/2026 (`/refinar`, `tl` e `po` no Opus · médio); forma fechada com a resposta do dono.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | varredura nova e regra do órfão sobre o `docsGraph` | feito |
| verificar | qa | Sonnet · baixo | `node teste.mjs` + `--status` nesta base (deve achar os grandes daqui) | feito |

Sem `tl` no diff: só leitura, sem `UPDATES`.

Grafo (fresco): `NOTE_CEILING` sem nó (Grep L394); `docsGraph` (L838) → affected `mergeDocs` L1912, `touchedByUS` L1006, `writeStatusHtml` L1149, `computeStatus` L1397; `computeStatus` (L1361) grau 13.
Grafo de novo em 26/10 (`/retomar`, fresco — 18 s depois do 9820243), linhas andaram com US-74/75/80:
- `NOTE_CEILING` — sem nó; Grep L413 (`FIXED_TK_CEILING` L414)
- `computeStatus` — L1389, grau 18; affected: nada
- `printStatus` — L1546, grau 13; affected: nada
- `docsGraph` — L863, grau 7; affected `mergeDocs` L2035, `touchedByUS` L1031, `writeStatusHtml` L1174, `computeStatus` L1427

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 5 nó(s) de código em 4 comunidade(s) — **escopo largo**: vale fatiar?.

**Quem depende do que ela toca** (3, até 2 níveis) — é o que o QA precisa cobrir:
- `mergeDocs()  marvin.mjs:L2020`
- `touchedByUS()  marvin.mjs:L1029`
- `writeStatusHtml()  marvin.mjs:L1068`

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../US-56-contexto-vigiado-na-abertura/Sobre.md) — 2 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../US-74-grafo-velho-vira-alerta/Sobre.md) — 3 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../../../ferramentas-opcionais/adaptadores/US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 4 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 2 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../../Novos/ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 2 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../../Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- … e mais 36

## Rumo
- **26/10/2026** — anotada das issues #8 e #9 com a divergência `tl` × `po`; no mesmo dia o dono decidiu (com o `tl`, órfão entra) e ela virou `refinada`. As anotações foram para a US-81; as partes medidas da #9 viraram US-74 e US-75.
- **26/10/2026** — feita. Tetos `DOC_BYTES_CEILING` 15 KB, `DOC_LINES_CEILING` 300, `TABLE_LINE_CEILING` 600, arquivo inteiro (`## Impacto` incluído). Órfão = sem aresta de entrada no `docsGraph` **e** sem `pai:` próprio (sem isso, todo filho que o pai não linka seria órfão); raízes por regra: `README.md`, `onde_paramos.md`, `Memoria/`, `Releases/`. Aviso, nunca problema: exit code não muda. Sem `tl` (só leitura, sem `UPDATES`), como o Time previa. Lacunas do teste (conferidas à mão pelo qa): teto só por bytes, raízes isentas. Os 8 grandes e 3 órfãos daqui ficam para quebrar/ligar em outra US.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- `node teste.mjs`: 599 passaram (+5 do bloco 9w2).
- qa: `--status` nesta base acha 8 documentos grandes (pior: US-19, 44 KB · 578 linhas; `ferramentas.md` por linha de tabela de 773 caracteres) e 3 órfãos (`Contexto/Fluxos/status-html.md`, `Fontes/Externas.md`, `Fontes/sessoes-de-03-08.md`); `--curto` não mostra; `git status` igual antes e depois; à mão: linha de tabela isolada, `[[wikilink]]` como aresta, `99_Backup/` fora, exit code 0.
