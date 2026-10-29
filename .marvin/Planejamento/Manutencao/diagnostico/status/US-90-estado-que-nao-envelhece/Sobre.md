---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-90-estado-que-nao-envelhece
description: "Issue #10: o --status acusa toda ativa parada (não só as da nota) e a ativa com Evidência preenchida (parece concluída), e separa 'em trabalho' de 'falta verificar'. Sem historico/, sem estado novo, sem mudar o aceite."
---
# US-90 — o estado da US não envelhece

**Por quê:** a [issue #10](https://github.com/Josuebmota/Marvin/issues/10) (29/10/2026) trouxe números medidos no Parci: 230 `Sobre.md`, dos quais 86 `concluida` e 86 `ativa`, e a maior parte das ativas está codada e no ar, esperando `qa` ou o aceite do dono. Metade do mecanismo já existe:
- o aviso de ativa parada (`marvin.mjs:1538`, Rumo com mais de 14 dias) só cobre as US apontadas pela nota; as ativas fora dela recebem só "not in the note" (L1555);
- `comEvidencia` já é lido (`readNode` L644-645, L668), mas só serve para a `concluida` (L1539) e o `--release` (L2373);
- "falta verificar" não tem sinal nenhum. A coluna `estado` do *Time* existe no template (L3478-3482), e ninguém a lê.

**Pronto quando:**
1. Toda US `ativa` da árvore, não só as da nota, com o último Rumo há mais de 14 dias recebe o aviso de parada. O 14 vira constante. As fora da nota são listadas até 10, fechando com "… e mais N" (o padrão da US-85).
2. Uma `ativa` com *Evidência* preenchida recebe `!` "parece concluída".
3. "Falta verificar" é `pausada` com `espera: qa` (❓1 e ❓2). O texto do template sobre `pausada` (`marvin.mjs:3444`) ganha o exemplo "codada, falta conferir → `--pausar \"qa\"`", com marca em `UPDATES` (`desde:` a próxima versão), e uma base da versão anterior recebe o aviso. O `--status` não ganha leitura nova: a pausada já sai da contagem de ativas e aparece com o que espera.
4. Nenhum dos avisos muda o código de saída. A idade vem do `days()`, que é só exibida (a exceção do AGENTS.md), e a data é a do último Rumo, não o mtime nem o git.
5. `teste.mjs` tem uma trava para cada aviso, e o `--status` deste repositório não ganha aviso falso. A contagem nos dois READMEs acompanha.

**Não entra:**
- **`--arquivar` e `historico/`:** mover arquivo fere o invariante 1, e a [US-81](../../../../Novos/organizacao-por-grafo/script/US-81-anotacao-vira-us-anotada/Sobre.md) já recusou isso. Fazer o grafo ignorar a concluída quebra arestas, porque outras US e os Releases apontam para ela. Reabre com número de ruído medido na busca.
- **Estado novo `verificar`:** mexeria em `US_STATES`, `STATE_FIX`, `LABEL`, `STATE_MARK`, no CSS e em `UPDATES`. O `pausada` com `espera:` da [US-73](../../../../Novos/organizacao-por-grafo/script/US-73-estado-pausada/Sobre.md) já cobre "esperando `qa` em lote".
- **Aceite do dono:** os templates do Marvin não exigem o "é isso". O `/fechar` (L4087) só pergunta "Concluiu e foi validada?". A regra era local do Parci, e não há nada a mudar aqui.
- O `--curto` do hook.

## Perguntas
- ~~❓ 1. **Como separar "falta verificar"** (divergência entre o `tl` e o `po`):
  - **`tl`:** ler a coluna `estado` do *Time*. A US em que toda etapa fora do `qa` e do `tl` está `feito` e há uma de `qa` ou `tl` pendente conta como "falta verificar". Só leitura, sem template nem `UPDATES`. Mas não pega nada se o projeto não mantém a coluna atualizada.
  - **`po`:** "falta verificar" é `pausada` com `espera: qa`, que custa zero de código. O que entra é o exemplo "codada, falta conferir → `espera: qa`" no texto do template sobre `pausada` (L3444), com marca em `UPDATES`, e aí o `tl` lê o diff.
  - Dá para fazer os dois.~~ → o caminho do `po`: `pausada` com `espera: qa` (dono, 29/10/2026).
- ~~❓ 2. Para você, `pausada` quer dizer só "parou por bloqueio", ou "esperando `qa`" também cabe? Se for só bloqueio, o caminho do `po` na ❓1 não serve.~~ → cabe: `pausada` é qualquer espera fora do executor — dono, operação ou `qa` em lote (dono, 29/10/2026).
- ~~❓ 3. Os 14 dias servem para o Parci?~~ → 14 dias, como constante (dono, 29/10/2026).
- ~~❓ 4. Passo 0 (sugestão do `po`): rodar o `--status` no Parci e contar quantas das 86 ativas estão na nota, quantas já recebem o aviso de 14 dias e quantas têm *Evidência*. Isso mede o ganho antes de codar. Faço antes da implementação?~~ → mede antes (dono, 29/10/2026).

## Fluxos ligados
- [status-html.md](../../../../../Contexto/Fluxos/status-html.md)

## Código tocado
- `marvin.mjs` — `computeStatus` (L1538, L1577-1590)
- `marvin.mjs` — `printStatus` (L1705)
- `marvin.mjs` — texto do template sobre `pausada` (L3444)
- `marvin.mjs` — `UPDATES` (L5171)
- `teste.mjs`
- `README.md`
- `README.pt-BR.md`

## Time
Triagem 29/10/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo). Os dois concordam nos itens 1, 2, 4 e 5 e em tudo que ficou fora; divergem na ❓1.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| passo 0: `--status` no Parci (❓4) | scout | Haiku · baixo | só ler e contar | pendente |
| implementar | dev-back | Sonnet · médio | partida; três avisos em `computeStatus`/`printStatus` | pendente |
| verificar | qa | Sonnet · baixo | `node teste.mjs` e `--status` real sem aviso falso | pendente |
| ler o diff | tl | Opus · médio | template gerado e marca em `UPDATES` (❓1 = caminho do `po`) | pendente |

Grafo (fresco, 29/10 11:58:50, depois do último commit):
- `computeStatus` (L1518): affected devolve nada. É falha do grafo: `printStatus` e o HTML o leem (L1122, 1300 e 1448, achados por Grep).
- `printStatus` (L1705): affected devolve nada.
- `readNode` (L636): affected devolve `computeStatus` e `planningNodes`. US vizinhas: 73 e 64.
- `days` (L725): affected devolve `computeStatus`.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 6 nó(s) de código em 3 comunidade(s).

**Quem depende do que ela toca** (1, até 2 níveis) — é o que o QA precisa cobrir:
- `planningNodes()  marvin.mjs:L712`

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../custo/US-64-desvio-de-papel-no-status/Sobre.md) — 2 nó(s) em comum
- [US-65 — custo por US](../../custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../US-56-contexto-vigiado-na-abertura/Sobre.md) — 2 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../US-74-grafo-velho-vira-alerta/Sobre.md) — 3 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../US-78-teto-por-documento/Sobre.md) — 3 nó(s) em comum
- [US-87 — o teto isenta US concluída e `Fontes/` vira raiz](../US-87-teto-isenta-concluida-e-fontes-raiz/Sobre.md) — 4 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 2 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 2 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 3 nó(s) em comum
- [US-82 — o hook do grafo com `core.hooksPath` (husky) não mente](../../../ferramentas-opcionais/adaptadores/US-82-hook-do-grafo-com-hookspath/Sobre.md) — 3 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-49 — identidade pública: equipe barata](../../../publicacao/identidade/US-49-identidade-equipe-barata/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- … e mais 40

## Rumo
- **29/10/2026** — anotada a partir da [issue #10](https://github.com/Josuebmota/Marvin/issues/10). O teto dos documentos que carregam sozinhos, citado na issue, é da #9, já entregue (US-78 e US-87).
- **29/10/2026** — refinada (`/refinar`, `tl` e `po` no Opus · médio, em paralelo).
- **29/10/2026** — respostas do dono às ❓1-4: `pausada` com `espera: qa` para "falta verificar" (sem estado novo nem leitura do *Time*); 14 dias; passo 0 no Parci antes de codar.
- **29/10/2026** — **passo 0 medido no Parci** (só leitura, script no scratchpad com as regex do `readNode`; data de referência 29/10). 230 US: 88 `concluida`, **84 `ativa`**, 45 `refinada`, 4 `anotada` e **9 com estado fora da lista** (`superada` 5, `congelada` 3, `estacionada` 1); nenhuma `pausada`.
  - Das 84 ativas, 21 estão na nota e 63 fora.
  - **Idade do último Rumo:** 29 com até 7 dias, 48 com 8 a 14, 7 com 15 a 30, nenhuma acima de 30 nem sem Rumo. O aviso de 14 dias pega hoje **2** (as da nota) e pegaria **mais 5** com o item 1. As ativas do Parci não estão paradas: o Rumo anda.
  - **Evidência preenchida em ativa: 5** (item 2).
  - **"Falta verificar" pela coluna `estado` do *Time*** (toda etapa fora de `qa`/`tl` feita, `qa`/`tl` pendente): **16**, por heurística de palavra (`feit|ok|done|✓|conclu`).
  - **Leitura:** a massa das 84 é recente e espera conferência, não está abandonada. Os itens 1 e 2 juntos acusam 10. O que separa a massa é o item 3 (`pausada` com `espera: qa`), que depende de o projeto usar o `--pausar` — hoje o Parci não tem nenhuma pausada. Os 9 estados inventados são o problema da issue #7 aparecendo de novo; vale conferir se a versão instalada no Parci já os aponta (US-73).
- **29/10/2026** — o dono manteve os 3 itens depois do passo 0. A US segue `refinada`, na fila depois da US-72.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
