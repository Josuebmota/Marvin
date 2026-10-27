---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-81-anotacao-vira-us-anotada
description: "Anotação é uma US `anotada` (um arquivo por anotação); o índice é o --status; quando vira US, feature ou demanda, sai do índice. `--us --anotada` e o texto do /refinar. Issue #8."
---
# US-81 — anotação é US `anotada`, e sai do índice quando vira trabalho

**Por quê:** issue #8 (no Parci, um `anotacoes.md` de ~7,6 KB relido inteiro a cada `/refinar` e que só cresce). Decisão do dono (26/10/2026): anotação = US `anotada`; há um índice das anotações abertas, e quando uma anotação vira US, feature ou demanda, ela sai dele. No Marvin isso já está meio pronto: a US `anotada` (US-52) é um arquivo por anotação e o `--status` já lista as anotadas (`roadmap.anotada`, L1429) — esse é o índice. Faltam o comando e o texto: o `--us` só cria `refinada` ou `ativa` (L1758), e o `/refinar` (L3794-3830) ainda fala de "anotação" sem dizer onde ela mora.

**Pronto quando:**
1. `marvin --us <caminho> --anotada` cria a US com `estado: anotada`, fora da nota e fora da fila.
2. O texto do `/refinar` diz: anotação nova vira `--us … --anotada` (nunca um arquivo agregador que cresce); ao refinar, o estado troca no **mesmo** arquivo; a linha ⚪ da nota que a originou sai da nota; a origem fica no Rumo da US.
3. O índice das abertas: a lista nominal é o bloco *Anotadas* do `--status --html`; o `--status` no terminal mostra a contagem por Epic. A anotação que virou `refinada`/`ativa` sai dele sem nada ser movido nem apagado — o histórico é o Rumo e o `git log`. (Ajustado ao entregue no fechamento, a pedido do `tl`; a lista no terminal ficou para a US-85.)
4. Marca nova em `UPDATES` para o texto do `refinar.md` (guardado por `existsSync`, L3795), com `desde` e `\s+`.
5. `teste.mjs`: `--anotada` cria no estado certo e não entra na fila; a marca do `refinar.md` é detectada.

**Não entra:** pasta `anotacoes/` nem `historico/` (mover ou apagar no disco do usuário fere o invariante 1, e o histórico já está no Rumo); migrar o `anotacoes.md` do Parci (trabalho de lá); teto de tamanho (US-78).

## Fluxos ligados
- [organizacao-por-grafo.md](../../../../../Contexto/Arquitetura/organizacao-por-grafo.md)

## Código tocado
- `marvin.mjs` — bloco do `--us` (~L1741-1760)
- `marvin.mjs` — template do `/refinar` (~L3794-3830)
- `marvin.mjs` — `UPDATES`
- `teste.mjs`

## Time
Triagem 26/10/2026 (`/refinar`): proposta do `tl`, aceita pelo dono.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | flag nova e texto de template | feito |
| verificar | qa | Sonnet · baixo | `node teste.mjs` | feito |
| ler o diff | tl | Opus · médio | marca em `UPDATES` (o texto que mais desincroniza) | feito |

Grafo: bloco do `--us` e template do `/refinar` são código de topo, sem nó — localizados por Grep; `UPDATES` sem nó próprio (`pendingUpdates` L4822, grau 1).

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../../Manutencao/diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../../../Manutencao/diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../../Manutencao/diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../../Manutencao/diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 1 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../../../../Manutencao/diagnostico/status/US-74-grafo-velho-vira-alerta/Sobre.md) — 1 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../../../../Manutencao/diagnostico/status/US-78-teto-por-documento/Sobre.md) — 2 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 2 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 2 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- … e mais 36

## Rumo
- **26/10/2026** — refinada da issue #8 com a resposta do dono (anotação = US `anotada`; sai do índice quando vira trabalho).
- **27/10/2026** — feita. `--anotada` paralelo ao `--refinada` (`ANNOTATED`); recusa com `--refinada`/`--ativa`/`--pausar` antes de qualquer escrita (código 2). Texto novo no `--help`, nos READMEs e nos passos 1 e 3 do template do `/refinar`; marca `/marvin\s+--us\s+<caminho>\s+--anotada/` desde 3.4.3. O `refinar.md` deste repo recebeu os dois trechos à mão (o `--no-questions` não reescreve arquivo existente). O `qa` achou o `--dry-run` anunciando "pointer added" para US `anotada`/`refinada` (o Sobre.md não existe na simulação): corrigido na sessão com o estado que a rodada daria. `tl` aprovou com ajuste: o Pronto quando 3 passou a dizer o entregue (lista nominal só no `--html`); a lista no terminal virou a US-85 (`anotada`).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- `node teste.mjs`: 607 passaram (+8 do bloco US-81).
- qa: repo temporário — `--anotada` cria `estado: anotada`, nota intacta, segunda rodada byte-idêntica, combinações recusam com código 2, `--status` conta 1 anotada e fila 0; trocada para `refinada`, entra na fila.
- tl: aprovado com ajuste (Pronto quando 3 e a US-85).
