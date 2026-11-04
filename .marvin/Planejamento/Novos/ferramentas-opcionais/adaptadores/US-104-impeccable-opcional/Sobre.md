---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-104-impeccable-opcional
description: "Refinada: o Impeccable (design e front para agentes) como ferramenta opcional do Marvin, registrada no ferramentas.md pelo ciclo do adaptador-de-ferramenta; dono (03/11/2026): opcional, ele precisa dela na maior parte do tempo."
---
# US-104 — Impeccable como ferramenta opcional

**Por quê:** o dono (03/11/2026) precisa de apoio de design e front na maior parte do trabalho e quer o [Impeccable](https://github.com/pbakaus/impeccable) à mão no Marvin, **opcional** (não obrigatório, como o ponytail depois da medição). Hoje o Marvin não instala nenhuma skill de front nem de motion (o `ECC_PLAN`, `marvin.mjs:1842`, não escolhe nenhuma); elas existem no catálogo do ECC (`frontend-design-direction`, `design-system`, `frontend-a11y`, `frontend-patterns`, `motion-ui`, `motion-foundations`, `motion-patterns`), e o papel `dev-front` está no glossário. Correção de 03/11 (`tl`, US-105): antes este texto dizia que o Marvin "tem" essas skills.

**O que a fonte diz** (README em 03/11/2026, lido por `WebFetch`; não há instalação local para conferir): instala por `npx impeccable install` (pergunta projeto ou global) ou pelo marketplace (`/plugin marketplace add pbakaus/impeccable`); no Claude Code o projeto lê `.claude/` e o global `~/.claude/skills/`; 24 comandos (`polish`, `audit`, `critique`, `animate`, `init`, `document`…); `init` escreve `PRODUCT.md` e `document` escreve `DESIGN.md`; detector por CLI (`npx impeccable detect`, 62 regras sem LLM), motor que baixa em `~/.impeccable/bin/`; Apache 2.0; **sem comando próprio para checar se está instalado** (`/impeccable` mostra a lista, `/impeccable doctor` diagnostica). Cuidados que o README admite: o modo *live* grava variantes aceitas no código-fonte e o *Apply* pode chamar o `codex` ou o `claude` com aprovações e sandbox desligados; hooks instalados no Claude Code rodam mesmo quando o modelo teve o comando negado.

**Pronto quando (esta US não escreve código — escolha do dono em 03/11/2026: registro primeiro, `po`):**
1. **Registro:** a linha `impeccable` no `.marvin/ferramentas.md` com `usa: não`, "confiança baixa: não medido", alcance só do Claude Code, o critério de reabertura numérico e *live*/*Apply* fora. **Feito em 03/11** (550 caracteres, abaixo do teto de 600 da linha de tabela).
2. **Custo fixo medido:** o número de tokens por sessão com e sem o Impeccable instalado, num projeto seu com front (escopo de projeto, nunca global), lido no `/context`; o número entra na linha do `ferramentas.md`. Quem instala é o dono. **Feito em 04/11: ~0,3k tk por sessão** (ver o Rumo).
3. **O par:** a mesma US de front, no mesmo modelo e esforço, uma vez com as skills de front do ECC (`frontend-design-direction`, `design-system`, `frontend-a11y`) e outra com o Impeccable; aceite escondido, evidência do Playwright, custo em $, turnos e tokens fixos. O `detect` do próprio Impeccable não serve de juiz. **A tarefa do par inclui um trecho de motion de site** (animação de UI e de página, não vídeo): braço ECC com `motion-ui`, `motion-foundations` e `motion-patterns`; braço Impeccable com `animate`. Aceite escondido e Playwright (gravação ou captura por estado) cobrem o motion também. Veio da US-105, fundida aqui por decisão do dono (03/11/2026).
4. **Decisão no Rumo:** o `usa` vira `sim` só com custo ≤ +10% e aceite igual ou melhor; senão fica `não` com os números (como o ponytail). Só então, se `sim`, abre a **US filha** da entrada no `OPTIONAL_TOOLS` (`marvin.mjs:2689`) com o *Código tocado* do `tl` desta triagem (ver o Rumo de 03/11), `UPDATES` e o `tl` no diff.

**Não entra:** instalar o Impeccable por conta própria; copiar a skill ou os comandos; tornar obrigatório; ligar o modo *live* ou o *Apply*; a entrada no `OPTIONAL_TOOLS` antes do número; mexer nas skills de front do ECC; nenhuma linha em agente mandando usá-lo; o Marvin chamar, instalar ou citar por nome o produto de vídeo do dono (gera vídeo, não motion de site; repo público); mexer no `ECC_PLAN` para instalar `motion-*` (outra US, só depois de o par medir).

## Perguntas
- ~~❓ 1. Fatia 0 primeiro (`po`) ou código já (`tl`)?~~ → registro primeiro, `po` (dono, 03/11/2026).
- ~~❓ 2. Quais dos seus projetos têm front e servem para o par ECC × Impeccable?~~ → **Parci** (dono, 03/11/2026). Conferido em 03/11: o Parci (`repos/parci-front`) tem front e animação (landing com `LandingHero`, `LandingScrollProgress`, `landing.sections.css`, `BottomSheet`).
- ~~❓ 3. Instalar no escopo do projeto ou global?~~ → **projeto**: já está instalado no Parci em `.claude/skills/impeccable` e `.agents/skills/impeccable` (commit `f5ecb4e`), com `PRODUCT.md` na raiz.
- ❓ 4. O apoio que você precisa é direção visual (`init`, `critique`) ou acabamento (`audit`, `polish`)? Define a tarefa do par.
- ❓ 5. Até quantos tokens de custo fixo por sessão você aceita? (24 comandos têm cara dos ~2,05k tk do superpowers; não medido.)
- ~~❓ 7. A entrada no `OPTIONAL_TOOLS` vem já ou depois do par?~~ → **já, como oferta** (dono, 03/11/2026); feita na [US-106](../US-106-impeccable-oferta-no-optional-tools/Sobre.md). O Impeccable instalado neste repo entrar ou não no git ficou na ❓ 1 da US-106. O par do Parci continua valendo para o `usa` virar `sim`.
- ❓ 6. (da US-105) O motion que você quer é de **site** (UI e página) ou de **vídeo**? Se for vídeo, não é desta US. E as skills `motion-*` do ECC já falharam num projeto seu? Qual e como? Escolha o projeto do par (❓ 2) já com um trecho que precise de animação.

## Fluxos ligados
_(link para ../../../../../Contexto/Fluxos/<fluxo>.md — fluxo sem nota ganha uma agora)_

## Código tocado
Nenhum código nesta US (registro, medição e decisão). Editado: `.marvin/ferramentas.md` (a linha `impeccable`). Lido, para a US filha se o par der `sim`: `marvin.mjs` — `OPTIONAL_TOOLS` (L2689), `pendingUpdates` (L5209), a tabela `UPDATES` (L5313), o laço de ferramentas (L2771). O *Código tocado* definitivo da entrada fica na US filha.
- `.marvin/ferramentas.md` — a linha `impeccable`

## Time
Triagem 03/11/2026 (`/refinar`, `tl` Opus · alto e `po` Opus · médio, em paralelo). A entrada no `OPTIONAL_TOOLS` (Sonnet · alto para o `dev-back`, `qa` Sonnet · médio, `tl` Opus · alto no diff, segundo o `tl`) **não está aqui**: é a US filha, só se o par der `sim`.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| 1 registrar a linha no `ferramentas.md` | po | Opus · médio | partida do glossário; revisão do texto já feita no crivo | feito 03/11 (escrito na sessão principal, `git diff --check` limpo) |
| 2 instalar o Impeccable no projeto de teste (escopo de projeto) | dono | humano | credencial e instalação são do dono; o instalador pergunta projeto ou global | pendente |
| 2 medir o custo fixo com e sem (`/context`) | scout | Haiku · baixo | só leitura e contagem, conferível | feito 04/11 (na sessão principal, sem delegar ao `scout`: dois comandos e a leitura da saída) |
| 3 a mesma US de front com o ECC e com o Impeccable | dev-front | Sonnet · médio | partida do glossário; mesmo modelo e esforço nos dois braços | pendente |
| 3 aceite escondido e evidência do Playwright | qa | Sonnet · médio | verificação não pode descer | pendente |
| 4 julgar o par e decidir `sim` ou `não` | po | Opus · médio | decisão de escopo, critério numérico já escrito | pendente |

Grafo (fresco, `graph.json` 18:38:48, depois do `20daf85` às 18:38:00): `FERR_OPCIONAIS` sem nó (no código é `OPTIONAL_TOOLS`); `pendingUpdates` (L5209) grau 3, ligado às US-91 e US-86, `affected` sem dependentes (as arestas de chamada não foram extraídas; Grep achou dois pontos de chamada, `:2002` e `:5459`).

Grafo (`/retomar` 03/11/2026, fresco: `graph.json` 16:34, depois do `fba703b` às 16:33): `OPTIONAL_TOOLS` agora em L2709, grau 3, `affected` sem dependentes; `pendingUpdates` agora em L5245, grau 3, `affected` sem dependentes. As linhas de `marvin.mjs` citadas acima são anteriores à US-106.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 1 nó(s) de código em 0 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-84 — quebrar o `delegacao.md` e ligar os órfãos](../../../../Manutencao/publicacao/contexto-fixo/US-84-quebrar-delegacao-e-ligar-orfaos/Sobre.md) — 1 nó(s) em comum
- [US-105 — Motion para sites](../US-105-motion-para-sites/Sobre.md) — 1 nó(s) em comum
- [US-106 — O Marvin oferece o Impeccable (entrada no `OPTIONAL_TOOLS`)](../US-106-impeccable-oferta-no-optional-tools/Sobre.md) — 1 nó(s) em comum
- [US-25 — avaliar Superpowers e Claude Octopus contra o fluxo do Marvin](../US-25-avaliar-superpowers-e-octopus/Sobre.md) — 1 nó(s) em comum
- [US-48 — Superpowers e ECC como ferramentas de execução da equipe](../US-48-superpowers-e-ecc/Sobre.md) — 1 nó(s) em comum
- [US-68 — ponytail ligado e medido](../US-68-ponytail-medido/Sobre.md) — 1 nó(s) em comum
- [US-93 — ponytail: segundo par medido](../US-93-ponytail-segundo-par/Sobre.md) — 1 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum

## Rumo
- **03/11/2026** — aberta e anotada a pedido do dono ("vamos colocar como opcional; na maioria das vezes eu to precisando dela"), depois da conversa sobre atribuir o Impeccable como skill do Marvin para design e front.
- **03/11/2026** — crivo `tl` (Opus · alto) + `po` (Opus · médio). Os dois: a entrada tem o nome `OPTIONAL_TOOLS` no código (`marvin.mjs:2689`), não `FERR_OPCIONAIS`; só o Claude Code é declarado; sem `instalarProjeto` (o install pergunta projeto ou global, é do dono); nada copiado, nada instalado pelo Marvin; *live* e *Apply* ficam de fora (chamam `codex`/`claude` com sandbox desligado, contra a sua regra de `--sandbox`); o `PRODUCT.md` e o `DESIGN.md` são do humano. Grafo: `graph.json` 18:38:48, mais novo que o `20daf85` (18:38:00); `FERR_OPCIONAIS` sem nó, `pendingUpdates` (L5209) grau 3 sem dependentes no grafo, dois pontos de chamada por Grep (`:2002` e `:5459`).
  - **`tl` — fazer em 1 chat.** Entrada em `:2689-2710` com `aplica: TOOLS.includes('claude')`, `let` em `:88-93`, laço `:2771-2774`; detecção por 3 sinais **todos a conferir** (o README não dá o nome do diretório nem a chave do plugin): `ROOT/.claude/skills/impeccable*`, `~/.claude/skills/impeccable*`, chave `impeccable@` em `~/.claude/plugins/installed_plugins.json`; confiança baixa com selo; seção no `AGENTS.md` (`:4592`, cabeçalho ganha `|| IMPECCABLE`, senão a marca nunca casa), **não** no `Equipe.md` (invariante 4); marca `/## Ferramentas[\s\S]*?\*\*Impeccable\*\*/` com `soCom: IMPECCABLE` e `desde`, mais `usa('impeccable')` em `:2002` e `:5459`; teste hermético com `HOME` redirecionado (`teste.mjs:123, :539`), `--dry-run` antes do run real; READMEs (tabela e contagem). Time: `dev-back` Sonnet · alto, `qa` Sonnet · médio, `tl` no diff Opus · alto. Validar em projeto temporário, não neste repo (sem front, e o `AGENTS.md` carrega em toda sessão).
  - **`po` — registro sem código primeiro, código só depois do número.** Linha no `.marvin/ferramentas.md` ("confiança baixa: não medido", alcance, custo fixo medido, critério numérico: depois de 1 par, `sim` só com custo ≤ +10% e aceite igual ou melhor); nenhum agente ganha texto mandando usar. Razão: o ponytail entrou sem medição e custou semanas; entrada em `OPTIONAL_TOOLS` vira texto gerado no projeto de todo usuário, com marca em `UPDATES` para manter. O `aplica` seria `HAS_WEB_FRONT` (gatilho da US-34), não `TOOLS.includes('claude')`. Lugar: `Novos/ferramentas-opcionais/adaptadores` confere.
- **03/11/2026** — **dono escolheu o registro primeiro (`po`).** US `refinada`: a linha `impeccable` entrou no `.marvin/ferramentas.md` (`não`, 550 caracteres, abaixo do teto de 600 da linha de tabela); custo fixo e par ficam para depois da instalação pelo dono; a entrada no `OPTIONAL_TOOLS` vira US filha só se o par der `sim`. ❓2 a 5 seguem abertas.
- **03/11/2026** — **US-105 (motion para sites) fundida aqui, decisão do dono** (o `po` recomendava fundir; o `tl` preferia US própria só de registro, ficou vencido). O par passa a ter um trecho de motion (item 3 do Pronto quando). O produto de vídeo do dono não cobre motion de site e o Marvin não o chama (os dois concordaram). Correção do *Por quê*: as skills de front do ECC estão no catálogo, não instaladas. ❓6 nova. Origem: reel visto pelo Chrome do dono em 03/11/2026.
- **03/11/2026** — **o dono instalou o Impeccable no próprio repo do Marvin por engano (queria o Parci) e decidiu manter** ("pode até ajudar nos layouts dele"), e disse o que quer do Marvin: **ao instalar o Marvin num projeto, ele identifica se o projeto precisa de algo em relação ao Impeccable.** Isto é a entrada no `OPTIONAL_TOOLS` (detectar, perguntar uma vez, registrar) que o item 4 deixava para depois do par; **conflito a decidir** (❓ 7). Fatos conferidos na instalação local, que o README não dava (a detecção do `tl` ficou "a conferir"): o instalador escreveu, no escopo do projeto, `.claude/skills/impeccable/`, `.agents/skills/impeccable/` e `.github/skills/impeccable/` (22 MB cada), os agentes `.claude/agents/impeccable-*.md` (4) e `.github/agents/`, o `.impeccable/config.local.json`, e **hooks** em `.codex/hooks.json` (`PostToolUse` e `Stop`, com `statusMessage`) e `.github/hooks/impeccable.json`, todos guardados por "se o `scripts/impeccable` existe". O `.claude/settings.json` não foi tocado. Cuidados: nada disso foi commitado, e um `git add -A` do `/fechar` levaria ~66 MB de código de terceiros e hooks para o repo público.
- **03/11/2026** — **par no Parci, passo de conferência.** Leitura só em `OvenorLabs/parci-development`. (1) Tem front e animação, ❓2 fechada. (2) O Impeccable **já está instalado** lá, escopo de projeto, só a skill (sem os 4 agentes `impeccable-*`, ao contrário deste repo), 143 arquivos · 3,2 MB; `PRODUCT.md` (102 linhas, schema do Impeccable) já commitado. (3) **Custo fixo, estimativa por tamanho, não `/context`:** entra no contexto só a linha da skill (nome + descrição, ~0,7 mil caracteres ≈ 0,2 mil tokens); o `SKILL.md` (10,7 KB ≈ 2,7 mil tokens) só carrega quando a skill é chamada. Bem abaixo dos ~2,05k do superpowers que a ❓5 temia. Falta o número lido no `/context` com e sem (o dono roda). (4) **Falta escolher a tarefa do par:** uma US de front pequena com animação (sugestão: entrada animada do `LandingHero`), implementada duas vezes, ECC `motion-*` × Impeccable `animate`, aceite escondido, evidência com Playwright, custo ≤ +10%. Não rodei o par: gasta tokens nos dois braços e escreve no Parci.
- **04/11/2026** — volta a ativa
- **03/11/2026** — **PAR MEDIDO no Parci (n=1).** Tarefa: entrada animada do `LandingHero` ao carregar, ordem texto → CTA → card, reduced-motion estático, ≤ 1,2 s, só transform/opacity. Dois braços Sonnet · médio, worktrees isoladas, mesma tarefa, só muda a skill (ECC `motion-ui`/`motion-foundations` × Impeccable `SKILL.md` + `animate`, sem *live*/*Apply*/perguntas). Aceite escondido (Playwright, 7 checagens; base 4/7): **ECC 7/7 · Impeccable 7/7.** Custo (tokens do subagente): **ECC 122,9k · Impeccable 120,5k (−2%)**, dentro do ≤ +10%. Diff: ECC 1 arquivo +24/−10; Impeccable 2 arquivos +27/−19. Card pronto em 509 ms (ECC) × 770 ms (Impeccable); CLS 0,000005 × 0,002–0,004 (os dois passam). `tsc` e `vitest` verdes nos dois na 1ª tentativa. Branches no `parci-front`: `par/hero-ecc` (35b0000) e `par/hero-imp` (8bce6e1), worktrees em `OvenorLabs/_par-motion`, nada em `main`.
  - **Leitura:** pelo critério numérico (custo ≤ +10%, aceite igual) o `sim` seria permitido, mas é **empate técnico**, igual ao ponytail: o Impeccable não mostrou ganho nem perda nesta tarefa. O motion deste caso foi decidido igual pelas duas skills (framer-motion, mesmo `REVEAL_TRANSITION`); o Impeccable tem diff um pouco maior. A tarefa não testou o que ele vende (direção visual, `critique`, `audit`) — é a ❓4. **Recomendação do Marvin: manter `usa: não`** (a oferta da US-106 já existe e basta) e reabrir só com um par de acabamento/direção visual. Decisão é do dono/`po`. O custo fixo em `/context` segue por medir (só a estimativa ~0,2k tk).
  - Ressalva de método: n=1, tarefa pequena, dev server do Parci aponta para produção (só landing deslogada, sem escrita).
- **04/11/2026** — **custo fixo medido no `/context` (item 2).** Dois clones descartáveis do Parci no mesmo commit (`42c066e`), o braço "sem" só sem `.claude/skills/impeccable` e `.agents/skills/impeccable`; `claude -p "/context"` no Sonnet, com `--setting-sources project --strict-mcp-config`. **A linha `impeccable` mostra ~300 tk; a categoria Skills vai de 3,8k para 4,1k.** Total do contexto nos dois: ~45k, então ~0,7%. A categoria System tools variou 0,4k no sentido contrário (23,9k com × 24,3k sem), o que indica ruído da estimativa nessa faixa; por isso o número é a linha da skill, não a diferença do total. Só a skill: os 4 agentes `impeccable-*` que o instalador pôs neste repo não existem no Parci e não entram na conta. Rodada única por braço. Os clones foram apagados e o Parci real não foi tocado. A ❓5 não tem teto respondido; a decisão de manter `não` não depende dela.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- **04/11/2026** — decisão do dono: **manter `usa: não`.** Números do par no Rumo de 03/11 e na linha `impeccable` do `.marvin/ferramentas.md`. Branches `par/hero-ecc` e `par/hero-imp` no `parci-front` (35b0000, 8bce6e1), fora da `main`.
