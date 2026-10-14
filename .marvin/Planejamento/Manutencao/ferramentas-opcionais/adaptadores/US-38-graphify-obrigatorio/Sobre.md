---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-38-graphify-obrigatorio
description: "Graphify deixa de ser opcional nos projetos gerados. O que 'obrigatório' significa e se ele vira rota de toda busca dependem de decisão do dono e de medição Grep vs grafo."
---
# US-38 — graphify obrigatório nos projetos gerados

**Por quê:** item 1 dos requisitos de 14/10: o dono quer o grafo como rota de toda busca, porque é ali que vê a economia de tokens. Hoje o script trata graphify como opcional (pergunta; sem TTY assume `não`) e o `CLAUDE.md` gerado diz que Grep/Glob é mais barato para localizar.

**Contra-evidência registrada (não decidida aqui):** o ganho medido do graphify (9,3×) é em pergunta **estrutural**; o grafo já devolveu função apagada marcada `[EXTRACTED]` (`decisoes-fechadas.md`), e o hook `MANDATORY` foi recusado porque o grafo não avisa quando está velho. "Rota de toda busca" contradiz essas duas decisões; reabrir pede fato novo.

**Pronto quando:**
1. Medição: o mesmo tipo de pergunta "onde está X" respondido pelo grafo e por Grep, com tokens e acerto, em US reais (amostra da US-29). Sem ela, a regra "rota de toda busca" não entra.
2. Se o dono escolher (b) abaixo: com graphify no PATH o registro grava `sim` por padrão; sem ele, aviso forte no fim da instalação, e o marvin **continua funcionando**.
3. Texto do `AGENTS.md`/`CLAUDE.md` gerado ("O grafo é opcional", "Grep/Glob é mais barato") atualizado conforme 1, com marca na `ATUALIZACOES` e `desde:`.
4. `teste.mjs` cobre o caminho **sem** graphify (o CI roda sem ele nos 3 SO).

**Não entra:** abortar a instalação sem graphify (o `tl` bloqueia: quebra quem não tem Python e o CI); graphify como dependência npm; graphify como hook.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md) — Triagem
- [decisoes-fechadas.md](../../../../../Contexto/Arquitetura/decisoes-fechadas.md)

## Código tocado
- `marvin.mjs` — flag e default (`:82-85`)
- `marvin.mjs` — registro de ferramentas, detecção e `não` sem TTY (`:1801-1900`, `:1840`, `:1875`)
- `marvin.mjs` — template "O grafo é opcional" (`:2515-2516`)
- `marvin.mjs` — seção Grafo de código do `CLAUDE.md` gerado (`:3508-3535`)
- `marvin.mjs` — `ATUALIZACOES` (`:4075`), aviso final (`:4182-4193`)
- `AGENTS.md`, `README.md`, `README.pt-BR.md` — juntos
- `teste.mjs`

## Time
Triagem 14/10/2026 (refino: `tl` + `po`). Ordem do dono: depois da US-29/US-37 — precisa do número.
- `dev-back`, `qa`, `tl` (diff + `ATUALIZACOES`; um dev por vez nela — cruza com US-37 e US-39).

## Skills
`adaptador-de-ferramenta` (já existe) cobre o registro.

## ❓
- ❓ "Obrigatório" quer dizer (a) o marvin recusa rodar sem graphify, ou (b) `sim` por padrão quando está no PATH + aviso forte quando falta? O `tl` bloqueia (a).
- ❓ Qual o fato novo que reabre "consulta, nunca hook" e "Grep é mais barato para localizar"?

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../../Novos/ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../../Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../../Novos/ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../../Novos/ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 2 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../../Novos/ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 2 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../../Novos/ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 2 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../../Novos/ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 2 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../../Novos/organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../../Novos/organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../../Novos/organizacao-por-grafo/script/US-05-release/Sobre.md) — 2 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../../Novos/organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../../Novos/organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 2 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../../../../Novos/organizacao-por-grafo/script/US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../../Novos/organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 2 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../../Novos/organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 2 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../../Novos/organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../../Novos/organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../../Novos/organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 2 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../../Novos/time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../../Novos/time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 2 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../../../../Novos/time/roteamento/US-39-time-na-primeira-rodada/Sobre.md) — 1 nó(s) em comum

## Rumo
- **14/10/2026** — refinada do item 1. Vai para `Manutencao/` (muda default de adaptador existente; a US-11a está concluída e não reabre). Divergência de ordem (`tl`: primeiro; `po`: só com medição) — o dono escolheu a ordem do `po`.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
