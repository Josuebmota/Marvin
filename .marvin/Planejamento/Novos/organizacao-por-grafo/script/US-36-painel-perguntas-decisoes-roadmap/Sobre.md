---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-36-painel-perguntas-decisoes-roadmap
description: "O painel (--status --html) passa a mostrar as ❓ abertas, as decisões de Contexto/Arquitetura, um roadmap derivado de epics/estados e o Time de cada US. Economia por US fica fora até a US-29."
---
# US-36 — painel com perguntas, decisões, roadmap e Time

**Por quê:** item 6 dos requisitos de 14/10. O painel já tem cards, o "cérebro" do grafo e os tokens gastos (US-07, US-15). O que falta, para o dono ver o projeto sem abrir `Sobre.md` um por um: o que está esperando resposta dele (❓), o que já foi decidido, a ordem do que vem, e quem cada US vai chamar (item 3, "mostrar quem será chamado").

**Pronto quando:**
1. O HTML lista as ❓ das US ativas e refinadas, cada uma com link para o `Sobre.md` de onde saiu.
2. O HTML lista as notas de `Contexto/Arquitetura/` (título + link).
3. Roadmap derivado do que já existe (epic → feature → US por `estado`: ativa, refinada, concluída), na ordem das ilhas do `--status`. Nada escrito à mão.
4. A tabela de US (`usRow`) ganha a coluna *Time* (papéis da seção Time).
5. `teste.mjs` confere 1 e 4 e que nada é escrito fora da pasta derivada e git-ignorada; `--status` texto e `historico.jsonl` ficam byte a byte iguais (invariante da US-15).

**Não entra:** economia por US (depende da US-29: `computeSpend` mede por sessão/dia, sem atribuição a US); reimplementar o grafo (o cérebro já existe); "o que rodou sozinho / onde travou" (US-37, depois de existir rodada); ler ou copiar o painel do parci — outro projeto, e este repo é público.

## Fluxos ligados
_(nenhum fluxo novo)_

## Código tocado
- `marvin.mjs` — `writeStatusHtml` (`:866-1170`), `usRow` (`:1064`), seção Planejamento (`:1161`)
- `marvin.mjs` — leitura do Planejamento/ilhas (`:1180-1213`)
- `teste.mjs` — caso novo do HTML

## Time
Triagem 14/10/2026 (refino: `tl` + `po` em paralelo, dono decidiu o escopo com roadmap).
- `dev-back`: implementa no `writeStatusHtml`.
- `qa`: roda o teste e confere o byte a byte do `--status` texto.
- `tl`: lê o diff (invariante 1 da US-15, `days()` como única exceção de data).
Graphify: grafo extraído em 14/10 (277 nós); o `tl` localizou por Grep/Read, sem consultar o grafo — registrado como limitação.

## Skills
Nenhuma.

## ❓
- ❓ O roadmap ordena por ilha (o que o `--status` já calcula) ou por ordem que o dono declara em algum lugar?

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 3 nó(s) de código em 3 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 2 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 2 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 2 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 2 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 2 nó(s) em comum
- [US-01 — Layout por grafo no script](../US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../US-05-release/Sobre.md) — 2 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../US-07-status-html/Sobre.md) — 2 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../US-10-grafo-a-nosso-favor/Sobre.md) — 2 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../US-15-status-html-legivel/Sobre.md) — 2 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 2 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../../../time/roteamento/US-39-time-na-primeira-rodada/Sobre.md) — 1 nó(s) em comum

## Rumo
- **14/10/2026** — refinada a partir do item 6 dos requisitos de 14/10. Divergência `tl`×`po` sobre o roadmap (po: fora; tl: dentro, derivado) — o dono escolheu dentro. Economia por US cortada por ambos.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
