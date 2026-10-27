---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-77-visao-do-dono-epicos
description: "Na aba 'Visão do dono': épicos com barra de progresso, só as US abertas por feature, concluídas resumidas, filtro e busca; repos e branches se o dono confirmar. Issue #3, parte 2."
---
# US-77 — "Visão do dono": épicos, filtro e repositórios

**Por quê:** issue #3, itens 5 e 6: o dono quer ver o planejamento por épico sem a lista inteira de concluídas e sem o Rumo cru. Depende da aba criada na US-76.

**Pronto quando:**
1. Um bloco por épico com barra de progresso; em cada feature, só as US abertas (chip de estado, inclusive `pausada` da US-73); as concluídas em "✓ N concluídas".
2. ❓ só em US não concluída; "Pronto quando" como dica (`title`).
3. Filtro por estado e busca, sem lib e sem rede; `localStorage` só dentro de try/catch.
4. Repositórios: a `main` de cada repo de `repoDirs` (L579) e as branches fora dela, ignorando worktree (`.git` arquivo); projeto sem `repos/` não mostra o bloco.
5. `teste.mjs` confere 1 e 2 na mesma fixture da US-76.

**Não entra:** Rumo cru na aba; parse de arquivos do Parci.

## Perguntas
- ~~❓ 1. O bloco de repositórios e branches entra agora?~~ → sim (dono, 26/10).

## Fluxos ligados
- [organizacao-por-grafo.md](../../../../../Contexto/Arquitetura/organizacao-por-grafo.md)

## Código tocado
- `marvin.mjs` — `writeStatusHtml`
- `marvin.mjs` — `repoDirs`
- `teste.mjs`

## Time
Triagem 26/10/2026 (`/refinar`, `tl` e `po`). Depois da US-76.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | HTML e JS inline, sem invariante | feito |
| verificar | qa | Sonnet · baixo | `node teste.mjs` + abrir em `file://` | feito |

Grafo (fresco): `writeStatusHtml` (L1043) grau 13, affected vazio; `repoDirs` (L579) localizado por Grep.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 3 nó(s) de código em 3 comunidade(s).

**Quem depende do que ela toca** (2, até 2 níveis) — é o que o QA precisa cobrir:
- `canonFile()  marvin.mjs:L613`
-   `readNode()  marvin.mjs:L622`

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../../Manutencao/diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 2 nó(s) em comum
- [US-65 — custo por US](../../../../Manutencao/diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../../Manutencao/diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../../Manutencao/diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 1 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../../../../Manutencao/diagnostico/status/US-74-grafo-velho-vira-alerta/Sobre.md) — 1 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../../../../Manutencao/diagnostico/status/US-78-teto-por-documento/Sobre.md) — 1 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 1 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 1 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 1 nó(s) em comum
- [US-82 — o hook do grafo com `core.hooksPath` (husky) não mente](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-82-hook-do-grafo-com-hookspath/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 2 nó(s) em comum
- … e mais 34

## Rumo
- **26/10/2026** — refinada da issue #3 (parte 2). Espera a US-76 e o ❓ 1.
- **27/10/2026** — feita. `readNode` ganhou `pronto` (o "Pronto quando" em uma linha; placeholder vira vazio) e o `st.roadmap` o carrega. Na aba: um `<section class="bloco epico">` por épico (X de Y concluídas, %, barra por estado; canceladas fora do denominador); em cada feature só as abertas com chip, concluídas em "✓ N", canceladas em "N canceladas"; ❓ só em aberta; "Pronto quando" no `title`. Filtro por estado e busca em JS inline (sem `localStorage`). Repositórios: cada `repoDirs()` com `.git` diretório (worktree ignorada) mostra a base `main`/`master`/atual e as branches fora dela, por `git branch` só leitura; sem repo, sem bloco. Custo a vigiar: o hook de abertura roda `--status --curto --html`, então num monorepo com `repos/` são 2 `execSync` de git por repo a cada sessão (tempo, não token) — não medido aqui (sem `repos/`). O `title` leva o código da US, como o Pronto quando 2 da US-76 permite.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- `node teste.mjs`: 648 passaram (+8 do bloco US-77).
- qa: `--status` em texto igual ao HEAD (fora tokens gastos); aba 0 igual ao HEAD exceto uma regra CSS `[hidden]` sem efeito nela; nenhum `US-\d+` visível; nenhuma origem nova; 8 épicos nesta base.
- Navegador (localhost): filtro "na fila" deixa só o épico `time`; busca "Visão" deixa só `Organização por grafo`; limpar volta os 8.
