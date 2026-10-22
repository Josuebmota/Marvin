---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-69-ecc-na-matriz
description: "A triagem chama agente do ECC quando a etapa casa com o verbo dele; o ECC_PLAN para de instalar o que a stack não pede (typescript-reviewer e build-resolver em Node puro) e respeita o agente que o projeto removeu."
---
# US-69 — a matriz chama os agentes do ECC; o que não casa sai

**Por quê:** auditoria de 22/10: 4 agentes copiados do ECC (`build-error-resolver`, `code-reviewer`, `tdd-guide`, `typescript-reviewer`), **0 chamadas** desde 16/10, e nenhum *Time* os cita. **Decisão do dono, 22/10/2026:** a triagem chama agente do ECC quando a etapa casa; o que não casa com nenhuma etapa sai do projeto. Hoje a regra só diz "procure no ECC quando faltar" (Equipe.md gerado, `marvin.mjs:2774-2784`; refinar gerado, `:3589` e `:3682`; `delegacao.md:233`). Apagar não basta: o laço do ECC (`marvin.mjs:3829`) só pula o que existe, então reinstala; e o `ECC_PLAN` (`:1535`) casa `'Node/JS'` com `typescript-reviewer` e `build-error-resolver`, e instala `code-reviewer` e `tdd-guide` sempre (`:1533-1534`). Funde com a [US-60](../US-60-ecc-fonte-da-equipe/Sobre.md), que copiou e nunca chamou.

**Pronto quando:**
1. O template do `Equipe.md` (e o do `/refinar`) ganha a regra genérica etapa → agente do ECC, sem stack nem caminho (invariante 4): teste-primeiro → `tdd-guide`; revisão de linguagem → `<lang>-reviewer`; erro de build → `*-build-resolver` só com build. O casamento concreto vai na linha do *Time* de cada US. Marca nova em `UPDATES` (`desde: '<versão>'`, regex com `\s+`).
2. `ECC_PLAN`: `typescript-reviewer` só com TypeScript/`tsconfig`; `*-build-resolver` só com script de build.
3. Registro de exclusão (no `ferramentas.md`) respeitado pelo laço: agente que o projeto removeu não volta na rodada seguinte (invariante 2).
4. Neste repo: sai o `build-error-resolver` (não há build) de `.claude/agents` e `.codex/agents` juntos; o `tdd-guide` fica (já está no *Time* das US-66 e US-67).
5. `teste.mjs`: Node puro sem TS não recebe `typescript-reviewer` nem build-resolver; agente excluído não é recopiado; 2ª rodada e `--dry-run` sem escrita.
6. O alcance do `ecc` gerado para o `ferramentas.md` (texto no `marvin.mjs`) deixa de dizer "Catálogo de referência, não instalação" — falso desde a US-60, que instala por stack.

**Não entra:** escrever corpo de agente (só cópia literal do ECC); medir revisor ECC contra o `tl` (US própria, com par); hooks, regras e comandos do ECC.

## Perguntas
- ❓ **Divergência `po` × `tl` sobre os revisores:** o `po` mantém **um** entre `code-reviewer` e `typescript-reviewer` (os dois se sobrepõem); o `tl` tira **os dois** (o `code-reviewer` duplica o `tl` no diff; o `typescript-reviewer` só volta se alguém propuser a etapa "revisão Sonnet antes do `tl`" com par medido). O refino partiu do `tl`, porque nenhuma etapa deste repo casa com eles hoje — pela regra do dono, sai.
- ❓ O `tl` lendo o diff continua obrigatório quando um revisor do ECC também revisou? `po` e `tl`: sim, o ECC não segura invariante.
- ❓ Ordem: o `po` põe esta antes da [US-63](../US-63-skill-citada-vem-do-ecc/Sobre.md) (as duas mexem no `ECC_PLAN`; a 63 só fica certa depois do "casa ou sai"); o `tl` a deixa correr em paralelo à US-66. Combinar antes de abrir as duas juntas.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md): o "procure primeiro no ECC" vira "a etapa casa com o ECC?".

## Código tocado
- `marvin.mjs` — `ECC_PLAN`
- `marvin.mjs` — bloco instalador do ECC (`if (ECC)`, ~L3818-3840)
- `marvin.mjs` — template do `Equipe.md`
- `marvin.mjs` — template do `/refinar`
- `marvin.mjs` — `UPDATES`
- `teste.mjs`

## Time
Triagem 22/10/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo).

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| fechar a regra e os ❓ | po + tl | Opus · médio | decisão de escopo; quem decide não executa | pendente |
| teste que falha | tdd-guide | Sonnet · baixo | agente do ECC que casa com a etapa | pendente |
| implementar | dev-back | Sonnet · médio | partida | pendente |
| verificar | qa | Sonnet · baixo | cenários: Node puro, exclusão, 2 rodadas, `--dry-run` | pendente |
| ler o diff | tl | Opus · médio | mexe em `UPDATES` e escreve `.claude/agents/` de terceiros | pendente |

Grafo (fresco, 22/10 07:01): `ECC_PLAN` → affected nenhum; explain só o contains, L1522. Laço do ECC **sem nó** (bloco de topo) — localizado por Grep. Templates: sem nó próprio — Grep.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 3 nó(s) de código em 2 comunidade(s).

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
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 2 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 2 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 2 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 2 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../adaptadores/US-34-playwright-front-mobile/Sobre.md) — 2 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
- [US-63 — skill citada nas instruções vem do ECC](../US-63-skill-citada-vem-do-ecc/Sobre.md) — 3 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../../organizacao-por-grafo/hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../organizacao-por-grafo/script/US-05-release/Sobre.md) — 2 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 2 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../../../organizacao-por-grafo/script/US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 2 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 2 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 2 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../../../organizacao-por-grafo/script/US-52-anotada-no-status/Sobre.md) — 1 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../time/glossario/US-44-glossario-da-equipe/Sobre.md) — 2 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../time/orquestracao/US-45-porta-unica/Sobre.md) — 2 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 2 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../../../time/roteamento/US-39-time-na-primeira-rodada/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 2 nó(s) em comum

## Rumo
- **22/10/2026** — aberta e refinada (auditoria; decisão do dono sobre o ECC).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
