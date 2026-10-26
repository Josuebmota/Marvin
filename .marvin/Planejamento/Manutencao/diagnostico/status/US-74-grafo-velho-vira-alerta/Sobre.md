---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-74-grafo-velho-vira-alerta
description: "Grafo mais velho que o último commit vira `!` com o comando de conserto; projeto com graphify e sem o hook de post-commit também. Parte medida da issue #9."
---
# US-74 — grafo velho e hook ausente viram alerta

**Por quê:** issue #9, medido no Parci em 26/10/2026: `graph.json` de 15/10 (11 dias), sem hook em `.git/hooks`. O graphify é obrigatório desde 16/10, mas o aviso de grafo velho é `info` e só depois de 7 dias pelo mtime (`marvin.mjs:1458`, `:1516`); o hook de post-commit é opt-in (`GRAPHIFY_GIT_HOOK`, L107; instalação em L4675).

**Pronto quando:**
1. `--status`: grafo mais velho que o último commit vira `!` com o comando de conserto no texto.
2. `--status`: projeto com graphify e sem o hook do Marvin em `.git/hooks/post-commit` vira `!` com `marvin --graphify-git-hook`.
3. O `--curto` do hook de abertura mostra uma linha só quando um dos dois dispara.
4. `teste.mjs` cobre os dois, inclusive o mtime restaurado pelo anexo de docs (`utimesSync`) — a comparação não pode cair nele.

**Não entra:** instalar o hook por padrão (US-80); configuração do limite; mudar o que o hook faz (US-70).

## Perguntas
- ~~❓ 1. O hook de post-commit passa a ser instalado por padrão?~~ → sim, com opção de desligar (dono, 26/10): US-80. O aviso do item 2 continua valendo para quem desligou ou montou antes.

## Fluxos ligados
- [ferramentas.md](../../../../../ferramentas.md)

## Código tocado
- `marvin.mjs` — `computeStatus`
- `marvin.mjs` — `printStatus`
- `marvin.mjs` — `GRAPHIFY_GIT_HOOK`
- `teste.mjs`

## Time
Triagem 26/10/2026 (`/refinar`, `tl` e `po` no Opus · médio). Os dois concordam: pequena e medida.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | só leitura do `.git` e do mtime; cuidado com o `utimesSync` | feito |
| verificar | qa | Sonnet · baixo | `node teste.mjs` com grafo velho e sem hook | feito — aprovou, com prático numa base temporária |

Sem `tl` no diff: não escreve no disco de ninguém nem toca `UPDATES`.

Grafo (fresco): `computeStatus` (L1361) grau 13, affected vazio; `printStatus` (L1479) grau 10; `GRAPHIFY_GIT_HOOK` (L107) grau 1, só `contains` — uso real em L4675 por Grep.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 4 nó(s) de código em 4 comunidade(s) — **escopo largo**: vale fatiar?.

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../US-56-contexto-vigiado-na-abertura/Sobre.md) — 2 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../US-78-teto-por-documento/Sobre.md) — 3 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 2 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 1 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../../Novos/ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../../Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../../Novos/ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 1 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../../Novos/ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 1 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../../Novos/ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 1 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../../Novos/ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 1 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../../Novos/ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 1 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../../../Novos/ferramentas-opcionais/curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
- [US-63 — skill citada nas instruções vem do ECC](../../../../Novos/ferramentas-opcionais/curadoria/US-63-skill-citada-vem-do-ecc/Sobre.md) — 1 nó(s) em comum
- [US-69 — a matriz chama os agentes do ECC; o que não casa sai](../../../../Novos/ferramentas-opcionais/curadoria/US-69-ecc-na-matriz/Sobre.md) — 1 nó(s) em comum
- [US-71 — o ponytail sai do obrigatório](../../../../Novos/ferramentas-opcionais/curadoria/US-71-ponytail-sai-do-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../../../Novos/organizacao-por-grafo/hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../../Novos/organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../../Novos/organizacao-por-grafo/script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../../Novos/organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../../Novos/organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../../Novos/organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../../Novos/organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 1 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../../Novos/organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 3 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../../Novos/organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../../Novos/organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 1 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../../../../Novos/organizacao-por-grafo/script/US-52-anotada-no-status/Sobre.md) — 1 nó(s) em comum
- [US-73 — estado `pausada` e estado inválido apontado](../../../../Novos/organizacao-por-grafo/script/US-73-estado-pausada/Sobre.md) — 3 nó(s) em comum
- [US-75 — o *Impacto* do `Sobre.md` com teto](../../../../Novos/organizacao-por-grafo/script/US-75-impacto-com-teto/Sobre.md) — 1 nó(s) em comum
- [US-76 — aba "Visão do dono" (resumo, em andamento, fila, depende de você)](../../../../Novos/organizacao-por-grafo/script/US-76-visao-do-dono/Sobre.md) — 2 nó(s) em comum
- [US-77 — "Visão do dono": épicos, filtro e repositórios](../../../../Novos/organizacao-por-grafo/script/US-77-visao-do-dono-epicos/Sobre.md) — 1 nó(s) em comum
- [US-79 — `--pausar`: pausar uma US sem editar o frontmatter à mão](../../../../Novos/organizacao-por-grafo/script/US-79-pausar/Sobre.md) — 1 nó(s) em comum
- [US-81 — anotação é US `anotada`, e sai do índice quando vira trabalho](../../../../Novos/organizacao-por-grafo/script/US-81-anotacao-vira-us-anotada/Sobre.md) — 1 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../../Novos/time/glossario/US-44-glossario-da-equipe/Sobre.md) — 1 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../../Novos/time/orquestracao/US-45-porta-unica/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 1 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../../Novos/time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 1 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../../Novos/time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../../Novos/time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 2 nó(s) em comum
- [US-72 — o GPT na equipe: detectar, matriz e ponte](../../../../Novos/time/roteamento/US-72-gpt-na-equipe/Sobre.md) — 1 nó(s) em comum

## Rumo
- **26/10/2026** — refinada da issue #9 (parte medida: grafo velho e hook ausente). Pode correr ao lado da US-75 (blocos diferentes).
- **26/10/2026** — feita. Decisões do dev-back: idade = mtime do `graph.json` (o anexo de docs restaura o mtime da extração; se a restauração falhar, o mtime fica mais novo e só esconde alerta, nunca cria falso); "tem graphify" = existe `graphify-out/graph.json`; só a falta do hook conta em `problemas` (exit 1 do `--status` completo) — com hook, grafo velho é a janela do refresh em segundo plano e só avisa; worktree e repo sem `.git` não avisam; `core.hooksPath` não tratado (o script não trata em lugar nenhum). `HOOK_SIGNATURE` subiu para antes do `computeStatus` (TDZ: o `--status` sai antes). Fica: sem hook, quem constrói o grafo e commita vê "mais velho" sem mudança de código — o conserto de fundo é a US-80.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- `node teste.mjs`: 576 passaram (+10 do bloco US-74).
- qa: prático numa base temporária — sem hook (2 avisos, `--curto` uma linha, exit 1), com hook (só grafo velho, exit 0), hook alheio, worktree sem aviso; este repo sem aviso novo.
