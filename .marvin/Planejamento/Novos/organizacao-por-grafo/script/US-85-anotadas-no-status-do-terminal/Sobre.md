---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-85-anotadas-no-status-do-terminal
description: "Lista nominal das US anotadas no --status do terminal, com teto, para o /refinar não pagar a leitura do --html."
---
# US-85 — as anotadas por nome no `--status` do terminal

**Por quê:** o `tl` ao fechar a US-81 (27/10): o `printStatus` (`marvin.mjs:1703`) só conta as anotadas — por Epic no completo (L1740) e o total no `--curto`. Um `/refinar` de "tudo que está ⚪" não tem o caminho de nenhuma e paga a leitura do `--html` ou um glob. Os dados já existem em `st.roadmap.anotada` (L1594-1597, com `titulo` e `arq`, ordenados por ilha e id). O `po` mede fraco (o glob é barato, poucas centenas de tk); o que paga é o princípio "listagem sem LLM é do script" e o custo baixo — vai de carona na US-87, mesmo passe do `dev-back`, sem fundir.

**Pronto quando:**
1. `--status` (sem `--curto`) imprime "Anotadas (N)" e uma linha por US com o caminho relativo do `Sobre.md`, até o teto, fechando com "… e mais N" (padrão da US-75, L2120).
2. O `--curto` continua só com o número (decisão da US-52; o hook não ganha lista).
3. `teste.mjs`: com teto+1 anotadas aparecem o teto e "… e mais 1"; o `--curto` não lista caminho. A contagem nos READMEs acompanha.

**Não entra:** `--html` (já tem, US-76); flag nova; listar refinadas por nome; mudar o texto do `/refinar` (template gerado exigiria marca em `UPDATES` — o `po` propôs o ponteiro, o `tl` deixou fora; ❓2).

## Perguntas
- ❓ 1. Qual o teto da lista? Sugestão do `tl`: 10.
- ❓ 2. O template do `/refinar` passa a apontar `marvin --status` como fonte da lista (o `po` quer; custa marca em `UPDATES` e passa pelo `tl`) ou fica para depois?

## Fluxos ligados
- [status-html.md](../../../../../Contexto/Fluxos/status-html.md)

## Código tocado
- `marvin.mjs` — `printStatus`
- `teste.mjs`
- `README.md`
- `README.pt-BR.md`

## Time
Triagem 29/10/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo). Divergência: o `tl` juntaria com a US-87 na mesma rodada; o `po`, mesmo passe mas US separadas (a 87 é medida, esta não) — ficou separada, logo depois da 87.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · baixo | só exibição, os dados já existem | pendente |
| verificar | qa | Sonnet · baixo | `node teste.mjs` + saída real do `--status` | pendente |

Sem `tl` no diff (com a ❓2 = não): só exibição, sem template nem `UPDATES`.

Grafo (fresco, 29/10 09:01 = último commit):
- `computeStatus` — L1504, grau 24; affected: nada
- `printStatus` — L1685, grau 14; affected: nada

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 4 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../../Manutencao/diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../../../Manutencao/diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../../Manutencao/diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../../Manutencao/diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 1 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../../../../Manutencao/diagnostico/status/US-74-grafo-velho-vira-alerta/Sobre.md) — 2 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../../../../Manutencao/diagnostico/status/US-78-teto-por-documento/Sobre.md) — 2 nó(s) em comum
- [US-87 — o teto isenta US concluída e `Fontes/` vira raiz](../../../../Manutencao/diagnostico/status/US-87-teto-isenta-concluida-e-fontes-raiz/Sobre.md) — 3 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 1 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 2 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 3 nó(s) em comum
- [US-82 — o hook do grafo com `core.hooksPath` (husky) não mente](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-82-hook-do-grafo-com-hookspath/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-49 — identidade pública: equipe barata](../../../../Manutencao/publicacao/identidade/US-49-identidade-equipe-barata/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- … e mais 38

## Rumo
- **27/10/2026** — aberta.
- **29/10/2026** — refinada (`/refinar`, `tl` e `po` no Opus · médio, em paralelo).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
