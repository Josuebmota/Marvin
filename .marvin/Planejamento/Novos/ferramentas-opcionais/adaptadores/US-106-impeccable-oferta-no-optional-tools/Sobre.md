---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-106-impeccable-oferta-no-optional-tools
description: "Refinada: o Marvin detecta front e oferece o Impeccable como ferramenta opcional (OPTIONAL_TOOLS), sem instalar nem copiar nada; filha da US-104, antecipada por decisão do dono em 03/11/2026."
---
# US-106 — O Marvin oferece o Impeccable (entrada no `OPTIONAL_TOOLS`)

**Por quê:** o dono (03/11/2026) quer que, ao instalar o Marvin num projeto, ele identifique se o projeto precisa do Impeccable. A [US-104](../US-104-impeccable-opcional/Sobre.md) deixava a entrada para depois do par medido; o dono escolheu **já, como oferta** (❓ 7 da US-104). Continua opcional, confiança **baixa**, não medido.

**Pronto quando:**
1. Projeto **sem front** (sem `package.json` de front): nada de `impeccable` no registro, no `AGENTS.md` nem na saída.
2. Projeto **com front** e Impeccable não instalado: o registro ganha `| impeccable | não |` e a saída diz `npx impeccable install` (a oferta). O Marvin **nunca instala nem copia**.
3. Impeccable **instalado**: detecta por `ROOT/{.claude,.agents,.github}/skills/impeccable/SKILL.md` (escopo de projeto) e, no escopo global, por `CLAUDE_HOME/skills/impeccable/SKILL.md` ou por chave `impeccable@…` em `installed_plugins.json` com `scope:"user"`. Com TTY pergunta `[y/N]` uma vez; sem TTY ou com `--no-questions` adia com `--use=impeccable`. `~/.impeccable/` (cache do motor) **não conta** como sinal.
4. `--use=impeccable` grava `sim` e, **só no `AGENTS.md` gerado**, a seção curta (selo de confiança baixa, `*live*`/*Apply* fora, `PRODUCT.md` e `DESIGN.md` do humano, sem mandar usar). `AGENTS.md` existente (do humano) só ganha aviso no passo 10 (`UPDATES`).
5. Idempotente (rodar duas vezes não duplica a linha nem muda os bytes) e `--dry-run` honesto (tudo por `fsw`/`exec`).
6. `node teste.mjs` verde com os casos novos, e os testes do ponytail seguem verdes depois de extrair `pluginScope`.

**Não entra:** instalar, copiar ou mexer em arquivos do Impeccable; `.gitignore` ou `.git/info/exclude` de terceiro; hooks; `ECC_PLAN`; `Equipe.md`; texto em agente mandando usar; modo *live* e *Apply*; Flutter (o README diz); validar neste repo (só em arena temporária: aqui o Impeccable já está instalado e sem front).

**Fatos conferidos no disco pelo `tl` (03/11/2026):** a instalação em escopo de projeto escreve `SKILL.md` (`name: impeccable`, versão 4.8.0) em `.claude/skills/`, `.agents/skills/` e `.github/skills/`, mais `scripts/impeccable` e `.cmd`, os agentes `impeccable-*`, e hooks em `.codex/hooks.json` e `.github/hooks/impeccable.json`. `~/.claude/skills/impeccable*` não existe; `~/.impeccable/` existe desde antes (falso positivo). O `installed_plugins.json` tem `{"version":2,"plugins":{"<nome>@<marketplace>":[{scope,projectPath?}]}}` e **não há chave `impeccable`**: o nome da chave não está confirmado. O `marvin.mjs` não escreve `.codex/hooks.json` em lugar nenhum.

## Perguntas
- ✅ 1. O Impeccable instalado neste repo (~66 MB, hooks) entra no git ou fica fora? **Fica instalado e fora do git** (dono, 04/11/2026): excluído em `.git/info/exclude`, só nesta máquina. O `.codex/hooks.json` é versionado e segue modificado: não commitar com `git add -A`.

## Fluxos ligados
Nenhum fluxo novo: segue o ciclo do `adaptador-de-ferramenta` (detectar, perguntar uma vez, registrar). Padrão de comparação: a entrada do `playwright` e a detecção do `ponytail`.

## Código tocado
- `marvin.mjs` — `let IMPECCABLE` (L93); extrair `pluginScope(re)` do laço de `detectPonytail` (L2643-2656), com o mesmo resultado para o ponytail; `detectImpeccable` novo logo depois de `ponytailReach`; entrada nova em `OPTIONAL_TOOLS` depois de L2709; mensagem do ramo `not found` (L2742) para quem não tem `instalarProjeto`; ramo "registro `sim` mas não instalado" depois de L2770; `if (f.nome === 'impeccable' && uses) IMPECCABLE = true` (L2774); `AGENTS.md` gerado (L4592: `PONYTAIL || PLAYWRIGHT || IMPECCABLE`, bloco antes de `## Higiene de sessão`); `pendingUpdates` (L5209, 5º parâmetro) e chamadas (`:2002` com `usa('impeccable')`, `:5459` com `IMPECCABLE`); marca nova em `UPDATES` depois de L5314; texto do `--help` (L200).
- `teste.mjs` — casos a a j depois da 9e3 (~L690), com `HOME` redirecionado e `--no-git`.
- `README.md` e `README.pt-BR.md` — lista de opcionais, "oferecido só com front", linha na tabela, `(playwright, impeccable)`, contagem de verificações.
- `.marvin/ferramentas.md` — a linha `impeccable` (hoje diz "não está instalado aqui", o que é falso); manter até 600 caracteres.

Entrada proposta pelo `tl`: `{ nome:'impeccable', semInstalador:true, aplica:()=>HAS_FRONT||HAS_WEB_FRONT, detecta:detectImpeccable, instalar:'npx impeccable install (pergunta projeto ou global)', alcance:'<kit de design e front instalado pelo dono; o marvin só detecta e registra, não instala nem copia; live/Apply fora; confiança baixa, não medido>' }`, **sem `instalarProjeto`**. Marca em `UPDATES`: `{ arquivo:'AGENTS.md', marca:/##\s+Ferramentas[\s\S]*?\*\*Impeccable\*\*[\s\S]*?\*live\*/, soCom:IMPECCABLE, desde:'3.4.5', … }` (o `desde` só é exibido; o pacote está em 3.4.4).

Testes pedidos: (a) sem front, nada; (b) com `react` e `react-dom`, sem instalar: linha `não` e `npx impeccable install` na saída; (c) `SKILL.md` plantada em `proj/.claude/skills/impeccable`: detecta, bytes intactos, nenhum arquivo novo em `.claude/skills/impeccable`, `.codex` ou `.github`; (d) global por `lar/.claude/skills/impeccable/SKILL.md` e por `installed_plugins.json` com `impeccable@impeccable` e `scope:"user"` (com `scope:"project"` e `projectPath` de outro projeto, não detecta); (e) só `lar/.impeccable/bin/` não detecta; (f) `--use=impeccable --dry-run` não cria nem altera o registro, depois `--use=impeccable` grava `sim` e a seção; (g) duas execuções com `--use` e uma sem: uma linha só, `AGENTS.md` com os mesmos bytes; (h) base antiga com `não` e depois `--use=impeccable`: aviso do `UPDATES`, `AGENTS.md` intocado; (i) registro `sim` sem instalação: info `record says sim but it is not installed`; (j) ponytail verde. Lacuna conhecida, igual à do playwright: o ramo TTY `y` não é testado.

## Time
Triagem 03/11/2026 (`tl` Opus · alto, grafo fresco: `graph.json` 14:41:51, depois do `d213ff1` às 14:41:30; `explain OPTIONAL_TOOLS` nó L2689 grau 3, `explain HAS_WEB_FRONT` L1834 grau 1, `affected pendingUpdates` "No affected nodes found" porque as arestas de chamada não foram extraídas, Grep achou `:2002` e `:5459`). Mexe no laço partilhado com as ferramentas obrigatórias, no `detectPonytail` e em `UPDATES`: o `tl` lê o diff.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| 1 implementar `marvin.mjs` e `teste.mjs` | dev-back | Sonnet · alto | laço partilhado, `pluginScope` e `UPDATES`; é o degrau que o crivo do `tl` fixou | feito 03/11 |
| 2 READMEs e `ferramentas.md` | dev-back | Sonnet · médio | texto, mesmo agente da etapa 1 | feito 03/11 |
| 3 rodar `teste.mjs` e conferir o que ele não cobre (arena temporária) | qa | Sonnet · médio | verificação não pode descer | feito 03/11 |
| 4 ler o diff | tl | Opus · alto | toca `UPDATES`, o laço de ferramentas e `detectPonytail` | feito 03/11 |

## Skills
`adaptador-de-ferramenta` (já existe).

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 4 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 3 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../../Manutencao/diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../../../Manutencao/diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../../Manutencao/diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../../Manutencao/diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 1 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../../../../Manutencao/diagnostico/status/US-74-grafo-velho-vira-alerta/Sobre.md) — 1 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../../../../Manutencao/diagnostico/status/US-78-teto-por-documento/Sobre.md) — 2 nó(s) em comum
- [US-87 — o teto isenta US concluída e `Fontes/` vira raiz](../../../../Manutencao/diagnostico/status/US-87-teto-isenta-concluida-e-fontes-raiz/Sobre.md) — 2 nó(s) em comum
- [US-90 — o estado da US não envelhece](../../../../Manutencao/diagnostico/status/US-90-estado-que-nao-envelhece/Sobre.md) — 3 nó(s) em comum
- [US-99 — nota velha no `--status`](../../../../Manutencao/diagnostico/status/US-99-nota-velha-no-status/Sobre.md) — 2 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 3 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 2 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 3 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 3 nó(s) em comum
- [US-82 — o hook do grafo com `core.hooksPath` (husky) não mente](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-82-hook-do-grafo-com-hookspath/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- … e mais 59

## Rumo
- **03/11/2026** — implementada, verificada pelo `qa` e lida pelo `tl` no mesmo dia (ver Evidência). Aberta por decisão do dono (❓ 7 da US-104: "já, como oferta"); `tl` Opus · alto definiu a especificação acima a partir da instalação real neste repo. Em conflito com o item 4 da US-104 (código só depois do par), vence a escolha do dono; o par continua valendo para virar `sim`.
- **04/11/2026** — ❓ 1 respondida: o dono mantém o Impeccable instalado neste repo, sem versionar. A exclusão é local (`.git/info/exclude`), não no `.gitignore` público, porque é escolha desta máquina e o `usa` segue `não`. Os hooks em `.codex/hooks.json` ficam ativos e o arquivo continua aparecendo como modificado no `git status`. O aviso de agentes sem `model:` pode continuar, porque os 4 `impeccable-*` seguem no disco.

## Evidência
- `node teste.mjs`: **712 passaram**, exit 0 (693 antes, 19 novas), conferido de novo pelo `qa` (Sonnet · médio) em execução própria; os dois READMEs dizem 712.
- `qa` em arena temporária (HOME redirecionado, nada rodado neste repo): React sem Impeccable → oferta `npx impeccable install` e registro `não`; sem front → nenhuma menção; idempotência (bytes iguais) e `--dry-run` honestos; `--use=impeccable` grava `sim` e a seção no `AGENTS.md`; `--status` consistente.
- `tl` (Opus · alto) no diff: **fechar**, sem achado; invariantes 1-4, `pluginScope` igual para o ponytail, `UPDATES` sem aviso falso, `~/.impeccable` não conta, o Marvin não instala nem copia. Ressalva única (linha do `ferramentas.md` com 609 caracteres): corrigida, 594.
- Sem cobrir: ramo TTY `y` (igual ao playwright); plugin `impeccable@…` em arena pelo `qa` (coberto pelo teste d do `dev-back`); a chave real do plugin não está confirmada (confiança baixa).
- Falta: commit sem o Impeccable instalado (❓ 1) e a release (3.4.5).
