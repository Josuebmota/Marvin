---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-52-anotada-no-status
description: "US com estado: anotada aparece no --status, no roadmap e no painel; no --status --curto, só o número."
---
# US-52 — `anotada` aparece no `--status`

**Por quê:** Defeito medido em 15/10: 5 US `anotada` não apareciam em listagem nenhuma, e o `/refinar logo tudo` precisou de Grep para achá-las — contraria "listar sem custo" do [plano](../../../../../Contexto/Arquitetura/equipe-barata.md). A palavra `anotada` não aparece no `marvin.mjs` (`tl`). Saiu do item 5 da [US-47](../../hierarquia/US-47-defect-e-task/Sobre.md) no refino (`tl` + `po`).

**Pronto quando:**
1. `stateMark` (:1318) tem marca para `anotada`; `computeStatus` (:1223) conta `anotada` por epic; roadmap e painel (`writeStatusHtml` :905/:1017) ganham o grupo "Anotadas".
2. O `--status --curto` (carrega em toda sessão) mostra **só o número** ("N anotada(s)"), nunca a lista.
3. O comentário de estados do template (`marvin.mjs:2635`) inclui `anotada`, com marca em `UPDATES` (`desde:`, `\s+`).
4. `teste.mjs`: fixture com uma US `anotada` aparece no `--status` e só como contagem no `--curto`.
5. O `--curto` cresce no máximo uma linha (4b antes e depois na Evidência).

**Não entra:** Defect e Task (US-47); listar as anotadas no `--curto`.

## Código tocado
- `marvin.mjs` — `writeStatusHtml` :905/:1017, `computeStatus` :1223, `stateMark` :1318, `printStatus` :1337, template de estados :2635, `UPDATES` :4217
- `teste.mjs`

## Time
- **Grafo (15/10, fresco: graph.json 4 s depois do `b0fe0a3`):**
  - `stateMark` :1318 — affected: `printStatus` (:1337)
  - `computeStatus` :1223 — sem affected, grau 11; ligada à US-16
  - `writeStatusHtml` :905 — sem affected, grau 12; ligada à US-36, US-21
  - template :2635 — literal, sem nó; fallback Grep.
- `dev-back` Sonnet médio — implementa
- `qa` Sonnet baixo — fixture e contagem do `--curto`
- `tl` Opus médio — diff (invariante 2 no template)
- **Amostra US-29:** pode contar como 3ª amostra (`po`).

## Skills
_(nenhuma)_

## ❓
1. **Divergência de quando:** o `po` põe esta US logo depois da US-44 (antes do portão da Fase 2, prioridade alta: é o "listar sem custo" quebrado); o `tl` a põe na Fase 4, adiantável se você quiser. Quando entra?

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 2 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 1 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 1 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 1 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 1 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 1 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../../ferramentas-opcionais/curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../US-15-status-html-legivel/Sobre.md) — 1 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 2 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../time/glossario/US-44-glossario-da-equipe/Sobre.md) — 1 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../time/orquestracao/US-45-porta-unica/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 1 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 1 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 1 nó(s) em comum

## Rumo
- **15/10/2026** — aberta no `/refinar` (logo tudo), a partir do item 5 da US-47.
- **15/10/2026** — ativa (ordem do dono). ❓1 resolvido pela execução: entra agora. **Configuração declarada (amostra US-29):** política — `dev-back` Sonnet médio, `qa` Sonnet baixo, `tl` Opus médio.
- **15/10/2026** — concluída. `dev-back` (Sonnet médio) implementou; `qa` dispensado com motivo: diff de 18 linhas no script, comportamento coberto por 5 checks novos que o `tl` conferiu não serem triviais; `tl` (Opus) aprovou com um ajuste fora do diff — o `Planejamento/README.md` deste repo ganhou o comentário de estados novo (e o link do glossário da US-44), e o `marvin` rodado aqui criou o `Contexto/Equipe.md` deste repo. Nota do `tl`, não bloqueia: epic com `estado: anotada` apareceria como ✗ (`marvin.mjs:1350`); nenhum epic usa.

## Evidência
- `node teste.mjs` → 378 passaram (5 checks novos da US-52).
- `--status --curto` neste repo: 18 linhas antes e depois (nenhuma anotada aqui).
- `node marvin.mjs --dry-run` neste repo: 0 "missing" no passo 10.
- `tl`: ilhas, fila e `--release` intocados (só pegam `refinada|ativa` e `concluida`); `UPDATES` 2.10.0 correta; marca `/refinada/` antiga segue casando.
