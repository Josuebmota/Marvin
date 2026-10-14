---
tipo: us
estado: ativa
pai: ../Sobre.md
name: US-37-condutor-autonomo-sessoes-curtas
description: "Modo autônomo por horas: rodar o /continuar aqui, uma US por sessão curta, até ter rodadas registradas; só então gerá-lo nos projetos e pensar no condutor que encadeia sessões."
---
# US-37 — condutor autônomo em sessões curtas

**Por quê:** item 7 dos requisitos de 14/10, e a candidata registrada no Rumo da Feature roteamento em 09/10. É o único item com número a favor: o `--status` mostra que cada turno relê ~256k tk e o contexto fixo é ~2% disso — o custo está no **comprimento da sessão**, e sessão curta ataca isso. Mas o `/continuar` existe desde 08/10 e **nenhum Rumo registra uma rodada dele**; gerar para os outros algo não rodado em casa é especulação.

**Pronto quando:**
1. **(7a, aqui)** 2 rodadas do `/continuar` neste repo, uma US por sessão, registradas no Rumo da US que rodou: o que fechou, onde travou, custo pelo `--status`, e travas respeitadas (diff sem apagar nada, não abre US). Essas rodadas são amostras da US-29.
2. **(7b, gerado)** só depois de 1: o `/continuar` vira comando gerado (`writeIfMissing` + `fsw` + entrada na `ATUALIZACOES` com `desde:`), com teste de idempotência.
3. **(7c, condutor)** decisão registrada sobre quem encadeia as sessões (ver ❓); se for arquivo gerado, sem `Date.now()` — a data vem do git.

**Não entra:** condutor como daemon/processo do Marvin (é motor, não suporte); painel de "o que rodou sozinho" antes de existir rodada (vai para depois da US-36); push sem revisão humana.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
- `.claude/commands/continuar.md` — o experimento de hoje
- `marvin.mjs` — geração de comandos (`:3034-3203`), `ATUALIZACOES` (`:4051-4095`) — só no critério 2
- `teste.mjs` — idempotência do comando gerado — só no critério 2

## Time
Triagem 14/10/2026 (refino: `tl` + `po`; dono escolheu a ordem do `po` — esta US é o veículo da US-29).
- `po`: escolhe as 2 US reais que rodam sozinhas e barra amostra fabricada.
- `tl`: lê o diff de cada rodada antes de qualquer push.
- `dev-back` + `qa`: só no critério 2.
- **Amostras escolhidas (dono, 14/10):** a [US-36](../../../organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) em 2 fatias — rodada 1 na configuração anterior, rodada 2 pela política. Configuração e corte no *Time* da US-36.

## Skills
Rodar o `/continuar` duas vezes é o gatilho para uma skill de rodada autônoma, se o procedimento se repetir.

## ❓
- ❓ Quem dispara o condutor (7c)? **Para o critério 1: o dono, à mão** — chat novo + `/continuar`, duas vezes (14/10). A escolha do condutor (`/loop`, `claude -p`, marvin) fica para depois das rodadas, com o custo delas na mão.
- ❓ Qual o teto de custo por noite / por rodada? Aberto — decide com o custo das 2 rodadas.
- ~~❓ Commit sim, push nunca?~~ **Sem commit, sem push** (dono, 14/10): o `/continuar` fica como está; o diff na árvore é a evidência.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

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
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 2 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../US-39-time-na-primeira-rodada/Sobre.md) — 1 nó(s) em comum

## Rumo
- **14/10/2026** — refinada do item 7. `tl` e `po` concordam: rodar aqui antes de gerar. Dividida em 7a/7b/7c dentro da mesma US; 7b e 7c só depois de 7a.
- **14/10/2026** — preparada a 7a: amostra = US-36 em 2 fatias, disparo manual, sem commit. A US-36 entra na nota **acima** da US-29, para o `/continuar` pegá-la primeiro. Próximo: o dono abre um chat novo com `/continuar` (rodada 1).

- **14/10/2026** — as 2 rodadas da US-36 rodaram e estão no Rumo dela.
  - **Rodada 1:** `/continuar` autônomo, configuração anterior. Travou na contagem dos READMEs, que fica fora do *Código tocado*, e o dono destravou. Custo ≈ $1,17.
  - **Rodada 2:** pela política. **Não foi um `/continuar` autônomo:** rodou no chat do dono, depois do commit e do push da rodada 1, a pedido dele. Custo ≈ $1,04.
  - **Travada em duas perguntas do dono:**
    - (a) A rodada 2 conta para o critério 1, que pede "2 rodadas do `/continuar`, uma US por sessão"? Se sim, o critério 1 fecha e o 2 pode começar. Se não, falta uma rodada autônoma de verdade.
    - (b) Os dois ❓ abertos: quem dispara o condutor e o teto de custo. Os custos das rodadas estão acima, mas a rodada 2 não é amostra limpa.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
