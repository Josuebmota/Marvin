---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-83-us-aceita-caminho-do-sobre
description: "`marvin --us` e `--gasto --us` aceitam o caminho que a nota e o --status mostram (`.marvin/Planejamento/.../Sobre.md`, absoluto, com barra invertida), não só `Novos|Manutencao/<Epic>/<Feature>/<US>`."
---
# US-83 — `--us` aceita o caminho do `Sobre.md`

**Por quê:** medido em 26/10 ao ativar a US-78: `marvin --us .marvin/Planejamento/Manutencao/diagnostico/status/US-78-teto-por-documento/Sobre.md` sai com "expected 4 parts". O `/retomar`, `/refinar`, `/us` e `/fechar` ensinam `marvin --us <caminho>`, e a nota mostra o caminho do `Sobre.md` — a documentação ensina a forma que falha. Mesma doença em `usKeyOf` (usado por `--gasto --us`): com o caminho completo a chave vira `Sobre.md` e devolve 0 turnos sem erro.

**Pronto quando:**
1. Uma função `normUsPath` corta tudo até `Planejamento/` (inclusive) e um `Sobre.md` ou `/` final, aceita `\`, caminho absoluto, `.marvin/…` e `../Planejamento/…`; é usada no bloco do `--us` e em `usKeyOf`.
2. Depois de normalizar, a checagem de 4 partes e de `Novos|Manutencao` fica como está; sobrar outra coisa continua saindo com código 2, e a mensagem mostra o formato aceito com um exemplo.
3. Vale com `--refinada`, `--anotada`, `--pausar` e `--ativa`.
4. `teste.mjs`: `Novos/E/F/US-x`, `.marvin/Planejamento/Novos/E/F/US-x/Sobre.md`, o absoluto e `../Planejamento/Novos/E/F/US-x/Sobre.md` resolvem para a mesma US, sem cadeia duplicada nem pasta no lugar errado; caminho fora de `Planejamento/` recusa; `--gasto --us` com o caminho completo acha a mesma chave.

**Não entra:** `--us US-78` (só o id; não medido); mudar o texto dos comandos (com a normalização eles passam a estar certos).

## Fluxos ligados
- [organizacao-por-grafo.md](../../../../../Contexto/Arquitetura/organizacao-por-grafo.md)

## Código tocado
- `marvin.mjs` — bloco top-level do `--us` (~L1863-1871)
- `marvin.mjs` — `usKeyOf`
- `marvin.mjs` — `printSpend`
- `teste.mjs`

## Time
Triagem 27/10/2026 (`/refinar` na sessão, `tl` e `po` no Opus · médio). Divergência: o `po` queria fundir na US-81 (mesmo bloco); o `tl` separou porque o `dev-back` da US-81 estava editando o bloco — ficou separada, logo depois da US-81.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · baixo | escopo pequeno e fechado | feito |
| verificar | qa | Sonnet · baixo | caminho absoluto Windows, `\`, prefixo `.marvin/` | feito |
| ler o diff | tl | Opus · baixo | o `--us` cria pastas no repo de alguém; normalização mal feita cria a cadeia no lugar errado | feito |

Grafo (fresco):
- `usKeyOf` — affected `computeSpend` L771, `printSpend` L849, `computeStatus` L1399, `printStatus` L1633; grau 3
- bloco do `--us` — sem nó (top-level); Grep L1863

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 4 nó(s) de código em 4 comunidade(s) — **escopo largo**: vale fatiar?.

**Quem depende do que ela toca** (3, até 2 níveis) — é o que o QA precisa cobrir:
- `computeSpend()  marvin.mjs:L727`
- `printStatus()  marvin.mjs:L1573`
-   `computeStatus()  marvin.mjs:L1394`

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 3 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../../Manutencao/diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 3 nó(s) em comum
- [US-65 — custo por US](../../../../Manutencao/diagnostico/custo/US-65-custo-por-us/Sobre.md) — 3 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../../Manutencao/diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../../Manutencao/diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 2 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../../../../Manutencao/diagnostico/status/US-74-grafo-velho-vira-alerta/Sobre.md) — 3 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../../../../Manutencao/diagnostico/status/US-78-teto-por-documento/Sobre.md) — 4 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 3 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 2 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 2 nó(s) em comum
- [US-82 — o hook do grafo com `core.hooksPath` (husky) não mente](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-82-hook-do-grafo-com-hookspath/Sobre.md) — 3 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- … e mais 38

## Rumo
- **27/10/2026** — refinada da anotação da nota (o tropeço de 26/10 ao ativar a US-78); o `tl` achou o mesmo defeito no `usKeyOf`.
- **27/10/2026** — feita. `normUsPath` (corta até o último `Planejamento/`, troca `\`, tira `/Sobre.md` e `/` final) usada no bloco do `--us` e no `usKeyOf`; a checagem de 4 partes ficou idêntica e a mensagem de erro ganhou exemplo. `--refinada` vale no nascimento: o teste cria pelo caminho (o Pronto quando 3 citava refinar uma existente). `tl` aprovou: Epic/Feature chamada `Planejamento` sobra com menos de 4 partes e recusa sem escrever. Lacuna: `--pausar`/`--ativa` pela forma de caminho não têm teste automático (o `qa` conferiu à mão).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- `node teste.mjs`: 615 passaram (+8: seis formas → mesma US, `--us=`, sem cadeia no lugar errado, `--anotada`/`--refinada` pelo caminho, três recusas, `--status --us` com o caminho completo).
- qa: repo temporário — absoluto Windows com `\`, `--dry-run` sem escrita, `--pausar` e `--ativa` pelo caminho completo; árvore só com as US certas.
- tl: aprovado.
