---
tipo: us
estado: ativa
pai: ../Sobre.md
name: US-42-execucao-nao-herda-opus
description: "O texto gerado faz a execução herdar o modelo da sessão (Opus): o README de agentes manda omitir model:, e o PROMPT.md contradiz o IA.md. Critério de economia nos templates e aviso no --status para agente sem model:."
---
# US-42 — a execução não herda Opus por omissão

**Por quê:** [issue #4](https://github.com/Josuebmota/Marvin/issues/4). A política da US-19 já diz para escolher por atividade, começando pela opção elegível de menor custo, mas o texto gerado empurra para o lado contrário:
- O exemplo de frontmatter do `.claude/agents/README.md` gerado diz `# Omita model para herdar` (`marvin.mjs:2918`).
- O `IA.md` não diz qual é o objetivo da escolha (`:2335-2346`).
- O `PROMPT.md` (`:52-59`) fixa haiku/sonnet/opus por papel como "base fixa", o que contradiz o `AGENTS.md` gerado ("não fixar um degrau por papel", `:3492-3494`).

Na prática, quem escreve o agente omite `model:`, e a execução roda no modelo da sessão.

**Pronto quando:**
1. **Critério escrito:** o `IA.md` gerado e o `CLAUDE.md` gerado (`:3602-3607`) dizem que a escolha visa o mesmo resultado com o menor gasto, e que o degrau sobe só com motivo registrado no *Time*. Entra também a regra "se o `tl` já decidiu, quem executa não precisa do modelo do `tl`".
2. **Fim do "omita para herdar":** o exemplo do README de agentes (`:2918`) diz que, sem `model:`, o agente herda o modelo da sessão, e manda declarar o modelo ou registrar na US por que ele herda. O exemplo não fixa um nome de modelo por papel (invariantes 3 e 4).
3. **`PROMPT.md` alinhado:** "ponto de partida, a triagem ajusta e registra o motivo" no lugar de "base fixa/modelo fixo", dizendo o mesmo que o `IA.md`.
4. **Aviso no `--status`:** agente em `.claude/agents/*.md` (sem contar o README) sem `model:` ou com `model: inherit` aparece como aviso perto do custo. O aviso não conta em `problemas` e não muda o código de saída, porque herdar é permitido. `teste.mjs` confere: agente sem `model:` avisa, com `model:` não avisa, e o código de saída fica igual. O `--status --curto` não muda (orçamento do hook).
5. **Quem montou antes fica sabendo:** cada texto novo de template ganha marca na `UPDATES` com `desde:`. A marca do `IA.md` hoje casa só os títulos, então a nova casa o texto do critério, com `\s+`. Os dois READMEs mudam juntos se citarem isso, inclusive a contagem de verificações.

**Não entra:**
- **Padrão de modelo por papel no template** (scout haiku; dev, qa e design sonnet; tl e po opus). Contraria a US-28 ("não há modelo padrão por papel") e o *Não entra* da US-29 ("mudar a política da US-19 antes de haver número"). Decisão do dono em 15/10: volta depois do número, que a US-41 destrava.
- Aviso de modelo em outros adaptadores (Codex etc.): a régua é só o que foi visto.
- Policiar `model: opus` em `qa`: a triagem pode justificar.
- A matriz por fornecedor (US-28b).

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md): a política cujo texto gerado esta US alinha.

## Código tocado
- `marvin.mjs` — `IA.md` gerado, seção "Pesquisa e escolha por atividade" (`:2313-2346`)
- `marvin.mjs` — README de agentes gerado, exemplo de frontmatter e "Modelo por atividade" (`:2918-2926`)
- `marvin.mjs` — `AGENTS.md` gerado (`:3492-3494`) e `CLAUDE.md` gerado (`:3602-3607`)
- `marvin.mjs` — `UPDATES` (`:4155-4162`)
- `marvin.mjs` — `printStatus` / `writeStatusHtml` (o aviso perto do custo)
- `PROMPT.md` — `:52-59`
- `teste.mjs` — o aviso e as marcas novas

## Time
Triagem 15/10/2026 (refino: `tl` + `po` em paralelo). O dono decidiu pelo `tl` nas três divergências: o padrão por papel só depois do número, duas US com o custo primeiro, e o aviso no `--status`.
- `dev-back`: implementa. Sonnet, esforço medium.
- `qa`: roda o teste; confere que o `--status --curto` não muda e que o código de saída é o mesmo (Sonnet, low).
- `tl`: lê o diff, em especial os invariantes 3 e 4 no texto gerado (Opus, medium).
Graphify: o `tl` localizou por Read/Grep, sem consultar o grafo; fica registrado como limitação.

## Skills
Nenhuma.

## ❓
- ❓ O projeto real da issue pode ser o piloto da US-29, com as sessões de 15/10 declaradas a partir de agora como "configuração anterior"? Linha de base histórica não vale, então só conta o par seguinte. (Pergunta do `po`.)

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 5 nó(s) de código em 4 comunidade(s) — **escopo largo**: vale fatiar?.

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 2 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 2 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 2 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 2 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../organizacao-por-grafo/script/US-05-release/Sobre.md) — 2 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 2 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../../../organizacao-por-grafo/script/US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 2 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 2 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 2 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 2 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 2 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../US-39-time-na-primeira-rodada/Sobre.md) — 1 nó(s) em comum

## Rumo
- **15/10/2026** — refinada a partir da issue #4. Divergência `tl` × `po`:
  - **Padrão por papel:** `po` queria já, porque a política já pede o menor custo; `tl` queria só depois do número (US-28 e US-29). O dono escolheu depois do número.
  - **Fatias:** `po` queria uma US; `tl` queria duas, com o custo primeiro. O dono escolheu duas.
  - **Onde fica o aviso:** `po` queria no `--check`; `tl` queria no `--status`, perto do custo. O dono escolheu o `--status`.
  - Caiu da issue o critério "agentes gerados saem com `model:`", porque o script não gera agente (invariante 4).
  - Ordem: depois da [US-41](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md).
- **15/10/2026** — implementada, sem commit. `dev-back` (Sonnet, medium) implementou; `qa` (Sonnet, low) e `tl` (Opus, medium) aprovaram. `node teste.mjs`: 361 passaram, 7 checks novos. O `qa` rodou num projeto temporário: `--curto` saiu idêntico byte a byte, o código de saída ficou igual, e o `--dry-run` e o 2º run não mudaram nenhum hash.
  - **Correção opcional do `tl`, aplicada na principal:** o `model:` tolera BOM e aspas, para não dar falso positivo nem falso negativo.
  - **Exemplo do README de agentes:** ficou como comentário `# model: …`, porque um teste antigo exige que o README não tenha linha `model:`.
  - **PROMPT.md:** mantém haiku/sonnet/opus como *ponto de partida*. O `tl` leu como dentro do item 3: o veto do Não entra é sobre template gerado.
  - **Marcas `UPDATES`:** `desde: '2.8.0'`, então a release desta US tem que ser 2.8.0.
  - **Lacunas:**
    - Não há teste para o aviso no HTML, para `model:` vazio, nem para as marcas do IA.md e do CLAUDE.md (só para a do README de agentes).
    - Este repo não regenera os templates existentes; o passo 10 vai acusar as 3 marcas aqui.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
