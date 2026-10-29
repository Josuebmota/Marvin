---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-88-travas-por-hook
description: "Rituais do Marvin que hoje são só conselho (teste antes do commit, tl depois da última edição) viram trava por hook do Claude Code (PreToolUse/Stop), escritos pelo script no .claude/settings.json. Separada da US-86: não precisa de plugin."
---
# US-88 — travas por hook

**Por quê:** pergunta do dono (27/10/2026): "como eu sei que a LLM está seguindo o Marvin a todo momento?". O hook que o script escreve só tem `SessionStart` (`marvin.mjs:4250`): avisa, não impede. Caso de 29/10: um commit da nota saiu sem `node teste.mjs` antes. Separada da [US-86](../../../../Manutencao/publicacao/empacotamento/US-86-plugin-fino-sobre-o-npm/Sobre.md) por decisão do dono (29/10). **Um caso só** — pela régua da US-53 é especulação até medir; `tl` e `po` concordam: medir primeiro.

**Pronto quando** (esta US é o passo 0 e o passo 1; o passo 2 abre outra US):
1. **Medir (passo 0, só leitura):** contar nas transcrições deste repo os `git commit` feitos pela LLM sem o comando canônico de teste depois do último Edit/Write, com o período. Número no Rumo. Se der 1, a US volta a `anotada` (❓3).
2. Com ≥2: conferir na documentação atual do Claude Code o formato de `PreToolUse`/`PostToolUse`, o que o stdin traz e como bloquear (`exit 2` ou `permissionDecision: deny`), com link no Rumo — invariante 3.
3. **Trava à mão neste repo (passo 1):** `PreToolUse` com matcher `Bash` no `.claude/settings.json` daqui; quando o comando contém `git commit` e há edição depois da marca "teste passou", bloqueia e diz o que rodar. Libera em qualquer erro próprio (JSON inválido, git ausente, marca ilegível) — trava com bug não pode travar todo commit.
4. Neste repo: editar `marvin.mjs` e commitar pela LLM é bloqueado com mensagem que cita `node teste.mjs`; rodar o teste e commitar passa.
5. Duas semanas depois, a contagem do item 1 dá zero (Rumo).

**Não entra:** o script escrever a trava nos projetos (passo 2: hookBlock, `UPDATES`, merge sem duplicar — US própria, com `tl`); a trava do "`tl` depois da última edição" e o `Stop` (beiram o invariante 4); plugin (US-86); travar o humano (hook só dispara em tool call da LLM); `sh x.sh` com commit dentro e `--no-verify` (brecha aceita e registrada).

## Perguntas
- ~~❓ 1. Como o hook sabe que o teste passou depois da última edição? `tl`: marca com hash do estado de trabalho (`git diff HEAD` + não rastreados) escrita pelo `teste.mjs` ao passar — determinística, pega edição fora da sessão. `po`: marca escrita por um `PostToolUse` quando o comando canônico sai com 0, comparada com o mtime do stage — não toca o teste, mas depende de o `tool_response` trazer o código de saída (não verificado). Transcrição: descartada pelos dois (formato não é contrato).~~ → a do `tl`: marca com hash do estado de trabalho escrita pelo `teste.mjs` ao passar (dono, 29/10/2026).
- ❓ 2. Onde fica a marca? Arquivo novo no `.gitignore` gerado vira marca em `UPDATES` no passo 2.
- ~~❓ 3. Se a medição der 1 caso: espera a segunda vez, como manda a régua, ou a trava entra mesmo assim (é pergunta de confiança, não de token)?~~ → espera a segunda vez, como manda a régua (dono, 29/10/2026).
- ❓ 4. Aceita subir o node em todo Bash da LLM, se o matcher não filtrar por comando?

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
- `.claude/settings.json` — `PreToolUse` (passo 1, à mão)
- `teste.mjs` — marca "teste passou", se a ❓1 for a do `tl`

## Time
Triagem 29/10/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo). Divergência na ❓1 (quem escreve a marca); fatias: o `tl` propôs 88a medir · 88b trava à mão · 88c script escreve · 88d `Stop`; ficaram a e b aqui.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| medir | scout | Haiku · baixo | recuperação delimitada nas transcrições; não decide | feito |
| ler o número | sessão principal | Opus · médio | conferiu à mão os 3 casos de código; a decisão já estava na ❓3 do dono | feito |
| conferir formato e implementar | dev-back | Sonnet · médio | hook com stdin e liberação em erro; documentação antes (invariante 3) | pendente |
| verificar | qa | Sonnet · baixo | bloquear e liberar de verdade numa sessão | pendente |
| ler o diff | tl | Opus · médio | trava com bug bloqueia todo commit | pendente |

Grafo: o passo do `.claude/settings.json` (`hookBlock`, L4250) — sem nó (top-level); Grep L4250. O passo 1 não toca o `marvin.mjs`.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 1 nó(s) de código em 1 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../../Manutencao/diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../../../Manutencao/diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../../Manutencao/diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../../Manutencao/diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 1 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../../../../Manutencao/diagnostico/status/US-74-grafo-velho-vira-alerta/Sobre.md) — 1 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../../../../Manutencao/diagnostico/status/US-78-teto-por-documento/Sobre.md) — 1 nó(s) em comum
- [US-87 — o teto isenta US concluída e `Fontes/` vira raiz](../../../../Manutencao/diagnostico/status/US-87-teto-isenta-concluida-e-fontes-raiz/Sobre.md) — 1 nó(s) em comum
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
- … e mais 37

## Rumo
- **29/10/2026** — anotada: separada da US-86 por resposta do dono à ❓1 dela.
- **29/10/2026** — refinada (`/refinar`, `tl` e `po` no Opus · médio, em paralelo).
- **29/10/2026** — volta a ativa
- **29/10/2026** — passo 0 (medir). 43 transcripts, 03/08 a 29/10/2026, 178 commits: 41 com teste depois da última edição, 90 sem edição desde o commit anterior, 47 marcados "sem teste". Dos 47, só 3 tocavam `marvin.mjs`/`teste.mjs`, e conferidos à mão os 3 são falso positivo: o `node teste.mjs` rodou no mesmo comando do commit (09-11 11:37 e 20:35, 10-15 19:12). **Commit de código sem teste: 0.** Os outros 44 são commits só de base (`.md`, `onde_paramos.md`, `Sobre.md`) ou com edição só no scratchpad; vários também têm o teste no mesmo comando (o contador não separa). O caso de 29/10 (nota sem teste) é desse tipo — o `teste.mjs` quase não cobre o texto da base. Pela ❓3 (dono: com 1 caso, espera a segunda vez), a US volta a `anotada`.
- **Achado da medição, outro problema:** nos casos de setembro o commit vinha encadeado com `;` depois do teste (`node teste.mjs | tail -1; git add -A; git commit`) — teria commitado com o teste falhando. Se a trava voltar, ela exige teste **que passou**, não teste que rodou. Script da contagem: `analise_commits.mjs` (scratchpad da sessão, não versionado).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
