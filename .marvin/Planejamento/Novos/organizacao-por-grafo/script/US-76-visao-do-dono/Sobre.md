---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-76-visao-do-dono
description: "Aba 'Visão do dono' no --status --html, em palavras e sem código de US: resumo, em andamento, fila e o que depende do dono, tudo a partir do que o Marvin já lê. Issue #3, parte 1."
---
# US-76 — aba "Visão do dono" (resumo, em andamento, fila, depende de você)

**Por quê:** issue #3: o painel do `--status --html` é visão de engenharia; o dono não decora código de US e não vê "o que depende de mim" nem a fila em ordem. Medido: no Parci um painel paralelo de ~200 linhas é mantido à mão. A US-36 já pôs perguntas e roadmap no painel; falta a leitura do dono. `writeStatusHtml` (`marvin.mjs:1043-1356`) escreve com `fsw` um `index.html` git-ignorado, regerado a cada run — risco zero para dado.

**Pronto quando:**
1. O `index.html` tem a aba "Visão do dono" ao lado da atual, que fica como está.
2. Nenhum código de US aparece na aba — só no `title` (dica).
3. Resumo: em andamento · fila · concluídas · perguntas · total, com barra por estado.
4. Fila = `st.roadmap.refinada` na ordem das ilhas do `--status` (L1429).
5. "Depende de você" = `st.perguntas` das US abertas (L1418; `readNode` já descarta ❓ riscado, L609).
6. Abre em `file://`; a única coisa externa é a fonte do Google Fonts, com a fonte do sistema como reserva (sem rede, a página continua legível). O `--status` em texto fica idêntico.
7. Funciona publicado como Artifact do Claude: nenhum recurso externo além do Google Fonts, `localStorage` só dentro de try/catch.
8. `teste.mjs` com fixture de ativa, refinada e concluída confere 2 a 5.

**Não entra:** parse de `escopo.md` e `depende-do-josue.md` (convenção do Parci, não do Marvin; 0 ocorrências no script) — o dono decidiu: a fila e o que depende dele vêm do próprio Marvin, granular, das ❓ de cada US, sem arquivo agregador que lota; épicos com filtro, busca e repos (US-77).

## Perguntas
- ~~❓ 1. A fila e o "depende de você" vêm do próprio Marvin?~~ → sim, granular, de acordo com o contexto de cada US, para não lotar um arquivo (dono, 26/10).
- ~~❓ 2. Abre a exceção do Google Fonts (US-15 fechou "nenhuma fonte externa")?~~ → sim (dono, 26/10). Registrar a exceção em `decisoes-fechadas.md` ao implementar.

## Fluxos ligados
- [organizacao-por-grafo.md](../../../../../Contexto/Arquitetura/organizacao-por-grafo.md)

## Código tocado
- `marvin.mjs` — `writeStatusHtml`
- `marvin.mjs` — `computeStatus`
- `teste.mjs`

## Time
Triagem 26/10/2026 (`/refinar`, `tl` e `po`). O `po` queria uma US só; o `tl` dividiu em duas (esta e a US-77) pelo tamanho do HTML. Os dois põem depois da US-73, por causa do chip `pausada`.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | HTML extenso, sem invariante | feito |
| verificar | qa | Sonnet · baixo | `node teste.mjs` + abrir o `index.html` em `file://` | feito |

Sem `tl` no diff: arquivo git-ignorado e regerado, sem `UPDATES`.

Grafo (fresco): `writeStatusHtml` (L1043) grau 13, affected vazio, ligada à US-36; `computeStatus` (L1361) grau 13.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 3 nó(s) de código em 3 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../../Manutencao/diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../../../Manutencao/diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../../Manutencao/diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../../Manutencao/diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 2 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../../../../Manutencao/diagnostico/status/US-74-grafo-velho-vira-alerta/Sobre.md) — 2 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../../../../Manutencao/diagnostico/status/US-78-teto-por-documento/Sobre.md) — 2 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 2 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 1 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 1 nó(s) em comum
- [US-82 — o hook do grafo com `core.hooksPath` (husky) não mente](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-82-hook-do-grafo-com-hookspath/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 2 nó(s) em comum
- … e mais 34

## Rumo
- **26/10/2026** — refinada da issue #3 (parte 1). Espera os ❓ 1 e 2.
- **27/10/2026** — feita. Abas por radio + CSS (sem JS para trocar; a padrão continua o painel); a aba atual embrulhada em `.painel.p0` com conteúdo byte a byte igual ao HEAD (o `qa` comparou). Aba nova `#dono` com blocos `<section class="bloco" id="dono-…">` (resumo com barra por estado, em andamento, fila na ordem das ilhas, depende de você) — a US-77 acrescenta blocos em `donoBlocks`. Código de US só em `title`; `plain()` tira o prefixo do título e `US-NN` no meio do texto vira "outra US". "Depende de você" = ❓ abertas de ativa, refinada, pausada e anotada. Google Fonts só aplicado em `.p1`, com reserva do sistema; exceção registrada em `decisoes-fechadas.md`. O check antigo "sem asset externo" passou a aceitar só `fonts.googleapis/gstatic`. Sem `tl`, como o Time previa (arquivo git-ignorado, sem `UPDATES`).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- `node teste.mjs`: 640 passaram (+8 do bloco US-76).
- qa: aba 0 idêntica à do HEAD; nenhum `US-\d+` visível na aba nova; única origem externa Google Fonts; `localStorage` sempre em `try`; nesta base: 1 em andamento, 2 na fila, 75 concluídas, 6 perguntas, 85 no total.
- Olhada no navegador (servido em localhost): a aba renderiza resumo, fila e as 6 ❓ da US-72 em "Depende de você".
