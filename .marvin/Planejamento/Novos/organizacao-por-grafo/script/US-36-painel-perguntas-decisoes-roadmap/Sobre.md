---
tipo: us
estado: ativa
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

**Rodadas autônomas (US-37 critério 1 / amostras da US-29)** — declarado 14/10, antes de começar:
- **Rodada 1** — critérios **1, 2, 4** e o 5 que cabe a eles. **Configuração anterior** (linha de base de 05/10): sessão principal Opus 5.5; `dev-back` Sonnet, `qa` Sonnet, `tl` Opus, **esforço padrão** (sem `effort` no prompt). Para ao fechar a fatia — o critério 3 fica para a rodada 2. Estado: **feita** (14/10) — destravada pelo dono no mesmo dia (READMEs 332 → 341); `node teste.mjs`: 341 ok. Histórico da rodada: `dev-back` Sonnet: feito, 9 checks novos; `qa` Sonnet: feito, sem achado bloqueante; `tl` Opus: reprovado só pela contagem dos READMEs (fora do *Código tocado*), 2 ressalvas baixas aplicadas pela sessão principal. `node teste.mjs`: 339 ok, 2 falham (`README*.md` dizem 332, são 341). Custo: `--status` deu ≈ $488.63 na captura inicial (já depois dos primeiros turnos) e ≈ $489.80 ao fim; o total é do projeto inteiro.
- **Rodada 2** — critério **3** (roadmap por ilha) e o 5 que cabe a ele. **Pela política** (US-19): mesmos papéis e modelos, **menor esforço adequado, explícito no prompt** — `dev-back` medium, `qa` low, `tl` medium; sobe se a etapa falhar, e a subida vai para o Rumo. Esforço explícito autorizado pelo dono no refino de 14/10 (US-29 critério 4). Estado: pendente.
- **Corte de turnos:** cada rodada é um chat novo aberto pelo dono só com `/continuar`; a amostra vai do primeiro turno à linha final do passo 4. Nada mais na sessão.
- **Mesmos checks nas duas:** `node teste.mjs`, `qa` confere `--status` texto e `historico.jsonl` byte a byte, `tl` lê o diff. Custo pelo `marvin --status` ao fim de cada rodada.
- Sem commit, sem push (dono, 14/10). O dono valida e commita.

## Skills
Nenhuma.

## ❓
- ~~❓ O roadmap ordena por ilha ou por ordem declarada?~~ **Por ilha** (dono, 14/10) — é o que o critério 3 já diz.

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
- **14/10/2026** — vira `ativa` como veículo das 2 rodadas autônomas da [US-37](../../../time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) (dono: US-36 em 2 fatias). Fatias, configuração e corte declarados no *Time* antes de rodar.
- **14/10/2026 (sessão autônoma — rodada 1 de 2)**
  1. **A atividade:** o painel `--status --html` passa a mostrar as ❓ abertas das US ativas/refinadas, as notas de `Contexto/Arquitetura/` e a coluna *Time* na tabela de US (critérios 1, 2, 4 e o 5 deles). O roadmap (critério 3) é da rodada 2.
  2. **O que foi feito:** `marvin.mjs` — `readNode` ganhou `perguntas` e `time`; nova constante `TEAM_ROLES` logo abaixo; `computeStatus` monta `st.perguntas` e `st.decisoes` (só leitura); `writeStatusHtml` ganhou a coluna Time no `usRow`, a seção `id="perguntas"` (depois de Em andamento) e a seção `id="decisoes"` (depois do Planejamento). `teste.mjs` — 9 checks no bloco 9x: ❓ aberta com link, respondida e comentada fora, US refinada entra, placeholder do template não vira papel, `dev-back · qa` na linha, nota de Arquitetura linkada, snapshot de que nada é escrito fora de `.marvin/.status/`, `--status` texto igual com e sem `--html` no meio, e as chaves do ponto do jsonl inalteradas. O `qa` comparou o `--status` texto com a captura de antes da mudança: só mudou o custo das sessões, que vem das transcrições e não do código.
  3. **Decisões tomadas sozinho:**
     - ❓ aberta = bullet `- ❓ …`, em qualquer lugar do arquivo; respondida = `- ~~❓ …~~`, que é a convenção já usada nos `Sobre.md`. Ficou de fora a ❓ fora de bullet (ex.: "**❓1 respondido**" na US-30), porque o texto livre não distingue aberta de respondida.
     - Time = papéis de um vocabulário fixo (`TEAM_ROLES` = base + optional de `suggestTeam`), achados como palavra inteira na seção `## Time`, sem diferenciar maiúsculas e depois de tirar os placeholders `_(…)_`. A constante é duplicada porque `suggestTeam` lê `stacks`, que o `--status` não monta. Ficaram de fora a leitura de `.claude/agents/` para papéis custom (YAGNI) e a extração de "qualquer crase" (pegaria nomes de arquivo).
     - Decisões = `.md` do nível de cima de `Contexto/Arquitetura/`, sem README, ordenados pelo nome do arquivo. Não tratei o layout antigo (`10_Decisoes/`) como o `tl` sugeriu, porque o `--status` já sai em `marvin.mjs:1325` nesse layout.
     - Da revisão do `tl` apliquei duas ressalvas: a flag `i` nos papéis e `^#[ \t]+` no título, para um `#` sozinho não pegar a linha de baixo.
  4. **Onde parou e por quê:** **travada numa dependência fora do *Código tocado*.** `node teste.mjs` dá 339 ok e 2 falhas: o check que confere o número de verificações nos READMEs (`README.md:715` e `README.pt-BR.md:700` dizem 332, são 341). A sessão autônoma não edita arquivo fora do *Código tocado*. **Pergunta:** posso trocar 332 por 341 nos dois READMEs?
     - **Sim:** é uma linha em cada um, e com isso a suíte fica verde e os critérios 1, 2, 4 e 5 fecham.
     - **Não:** então os READMEs passam para o *Código tocado* de quem for dono deles, e o teste fica vermelho até lá.
     Ficaram ressalvas abertas, que não bloqueiam:
     - `design` dentro de prosa na seção Time conta como papel. Também acontece com `po` citado em "refino: `tl` + `po`", que aparece na coluna da própria US-36.
     - O texto da ❓ sai com o Markdown cru (`**`, crases).
     - Não há check amarrando `TEAM_ROLES` a `suggestTeam`.
     A rodada parou na fatia, como declarado; o critério 3 é da rodada 2.
  - **Destravada (14/10, dono):** "pode trocar 332 por 341 nos READMEs". Troquei em `README.md:715` e `README.pt-BR.md:700`; `node teste.mjs`: 341 passaram, 0 falharam. Os critérios 1, 2, 4 e 5 dessa fatia estão fechados; a US segue `ativa` para a rodada 2 (critério 3).
     O `marvin --status` ao sair acusa as mesmas coisas de antes da sessão, e não mexi em nenhuma (arrumar seria sair da US):
     - US-36 e US-37 tocam `marvin.mjs` e `teste.mjs`.
     - A US-29 não tem mapa.
     - A base foi montada com marvin < 2.2.0 → rode `marvin`.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
