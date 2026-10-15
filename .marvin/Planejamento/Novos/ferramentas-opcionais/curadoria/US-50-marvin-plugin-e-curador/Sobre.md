---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-50-marvin-plugin-e-curador
description: "Com flag explícita, o marvin instala no escopo do projeto só as ferramentas que o ferramentas.md diz sim; sem flag, só mostra o comando. Nada global."
---
# US-50 — o Marvin instala as ferramentas por projeto

**Por quê:** decisão do dono de 15/10/2026: ferramenta só entra pelo Marvin e no escopo do projeto. O custo global já foi medido e eliminado à mão na Fase 0 (74,8k, ver Rumo); o que sobra é **reprodutibilidade**, não token (`po`). Rodar instalador de terceiros no disco alheio toca o invariante 1 e a decisão "nada que instale sem flag" — por isso opt-in (`tl` + `po`). **Refino de 15/10:** o empacotamento como plugin saiu para a [US-53](../../../../Manutencao/publicacao/empacotamento/US-53-marvin-como-plugin/Sobre.md); as skills .NET do backup saíram (conteúdo que exige conhecer o projeto, invariante 4 — ação do dono no projeto .NET); a medição da limpeza (antigo item 1) já está feita. Arquitetura: [equipe-barata](../../../../../Contexto/Arquitetura/equipe-barata.md). Fase 3, depois da US-48.

**Pronto quando:**
1. Sem flag, o `marvin` só **mostra** o comando de instalação, no escopo do projeto, de cada ferramenta `sim` no `ferramentas.md`. Com a flag (❓2), roda via `exec` (:308).
2. `--dry-run` com a flag lista os `run …` e não escreve nada.
3. Guarda por `f.detecta()` antes do `exec`: a segunda execução não roda nenhum `exec` (invariante 2).
4. Falha do `exec` ou ferramenta ausente vira aviso e sai 0.
5. Só entra `exec` com escopo de projeto **verificado** (invariante 3): ponytail e playwright primeiro; ECC e Superpowers só depois de a US-48 dizer `sim` e o escopo de projeto do instalador ser conferido.
6. `package.json` sem `dependencies`. `node teste.mjs` cobre o dry-run e a idempotência (`detecta` simulado com PATH vazio).
7. Um projeto real com o curador tem o `/context` comparado aos 74,8k.

**Não entra:** reinstalar no global; conectores do claude.ai (conta do dono); apagar o backup; plugin `.claude-plugin/` (US-53); skills .NET do backup.

## Código tocado
- `marvin.mjs` — `exec` :308, `OPTIONAL_TOOLS` :1911, laço de detecção :1921-1960, `UPDATES` :4217 (se a nota do `ferramentas.md` mudar)
- `.marvin/ferramentas.md`
- `teste.mjs`

## Time
- **Grafo (15/10, fresco: graph.json 4 s depois do `b0fe0a3`):** `OPTIONAL_TOOLS` :1911 — sem affected, grau 1; `UPDATES` :4217 — sem affected, grau 2.
- **Grafo na implementação (`tl`, 15/10):** `affected "OPTIONAL_TOOLS"` e `affected "exec"` — nenhum nó; `explain "OPTIONAL_TOOLS"` grau 2 (contém + toca a US-48).
- **Risco (`tl`):** escreve no disco alheio; o graphify instala no perfil por natureza (`uv tool install`, :1912) e conflita com "nada global" (❓1).
- `tl` Opus **alto** — motivo: `exec` de rede no projeto de outra pessoa
- `dev-back` Sonnet médio — implementa
- `qa` Sonnet médio — dry-run e idempotência
- **Bloqueio:** portão da Fase 2 (US-29); ECC/Superpowers dependem da US-48.

## Skills
`adaptador-de-ferramenta` (já existe).

## ❓
1. ~~graphify~~ Respondido em 15/10: **entra no `--install`** (exceção ao "nada global", decisão do dono). O graphify instala no perfil do usuário por natureza (`uv tool install graphifyy`). Ele fica fora da instalação (só detecta e avisa, como hoje), ou o "nada global" cede para ele? (`tl`)
2. ~~opt-in~~ Respondido em 15/10: **sim, só com flag**. A instalação é opt-in por flag (`--install` ou junto do `--use=`)? `tl` e `po` recomendam que sim.
3. Os conectores do claude.ai (Vercel, Notion, Gmail, Supabase, Cloudflare, Calendly, vidIQ, Gamma…) seguem ligados na conta e pesam em toda sessão (~16k dos 74,8k, segundo o `po`). Desligar os que você não usa é a economia mais barata do plano inteiro e vale antes de qualquer código — só você pode fazer.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 3 nó(s) de código em 3 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 1 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 1 nó(s) em comum
- [US-25 — avaliar Superpowers e Claude Octopus contra o fluxo do Marvin](../../adaptadores/US-25-avaliar-superpowers-e-octopus/Sobre.md) — 1 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 1 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 1 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../adaptadores/US-34-playwright-front-mobile/Sobre.md) — 1 nó(s) em comum
- [US-48 — Superpowers e ECC como ferramentas de execução da equipe](../../adaptadores/US-48-superpowers-e-ecc/Sobre.md) — 1 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../../organizacao-por-grafo/hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../organizacao-por-grafo/script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 1 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 1 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../../../organizacao-por-grafo/script/US-52-anotada-no-status/Sobre.md) — 1 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../time/glossario/US-44-glossario-da-equipe/Sobre.md) — 1 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../time/orquestracao/US-45-porta-unica/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 1 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 1 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 1 nó(s) em comum

## Rumo
- **15/10/2026** — anotada com a decisão do dono. A limpeza do perfil global já foi feita e é reversível: tudo foi movido para `~/.claude/_backup-2026-10-15/`, sem apagar. As contagens conferiram: 16 agentes, 26 comandos e 22 skills. O link `skills/watch` foi movido como link.
- **15/10/2026** — **primeira medição, depois da limpeza** (`/context` num chat novo, Claude Code desktop, janela de 1M). Total fixo: **74,8k**, assim dividido:
  - System tools 20,4k e MCP tools carregadas 19,9k: o app e o Claude Code, que são o piso.
  - Skills 10k: plugins sincronizados da conta (brand-voice, figma, design, engineering, productivity, anthropic-skills).
  - System prompt 8,3k.
  - Memory files 7,6k, dos quais **5,7k são o `AGENTS.md` deste repo**.
  - Instruções de servidor MCP 6,1k: conectores da conta.
  - Agentes 2,3k: brand-voice 1,9k e a equipe do Marvin 0,4k.
  - Os 638,8k de ferramentas MCP adiadas não são pagos.
  - Não há "antes": a limpeza foi feita antes de medir, e isso fica declarado.
  - **Alvo:** ~50k, desligando na conta os plugins sincronizados e conectores sem uso (~16k) e enxugando o `AGENTS.md` (US-44).
- **15/10/2026** — `/refinar` (logo tudo): refinada como instalação opt-in. Antigo item 1 (medir a limpeza) já feito: 74,8k na Fase 0, sem "antes" medido. Plugin virou a US-53; skills .NET saíram (invariante 4).
- **15/10/2026** — ativa (ordem do dono). Escopo de projeto do ponytail **verificado** na CLI instalada: `claude plugin marketplace add <src> --scope project` e `claude plugin install <p> --scope project` (opções `user|project|local`). ECC e Superpowers ficam fora até a US-48 decidir. **Configuração declarada (amostra US-29):** política — `dev-back` Sonnet médio, `qa` Sonnet médio, `tl` Opus alto (`exec` de rede no projeto alheio).
- **15/10/2026** — concluída. `dev-back` (Sonnet) implementou `--install`; `tl` (Opus, esforço alto) achou um **bloqueio real**: o `claude plugin … --scope project` cria `.claude/settings.json` e, rodando antes do passo do hook, fazia o Marvin tratar o arquivo como do humano e nunca escrever o SessionStart. Corrigido: o laço só acumula em `PENDING_INSTALL`; os `exec` rodam depois do bloco do `settings.json`. Também: `marketplace add` virou best-effort; o caso "sem --install" roda com `claude` falso no PATH (regressão nunca chama o real). `tl` reaprovou; `qa` (Sonnet) rodou dry-run e o caminho sem flag num temp. **Limitações registradas:** `detectPonytail` casa qualquer escopo do `installed_plugins.json` — quem tem o ponytail no escopo de usuário não recebe a instalação de projeto (erro para o lado seguro); o caminho `uv tool install graphifyy` com `--install` não foi testado (graphify já presente aqui); nenhum `claude plugin` real foi rodado. ECC e Superpowers ficam fora até a US-48 decidir.

## Evidência
- `node teste.mjs` → 387 passaram (8 checks novos da US-50, incluindo a ordem hook × instalação).
- `qa`: `--install --dry-run` lista `run claude plugin marketplace add DietrichGebert/ponytail --scope project` e `run claude plugin install ponytail --scope project`, md5 de todos os arquivos idêntico; sem `--install`, só a instrução.
- Item 7 (`/context` de um projeto real com o curador × 74,8k): **não provado** — é do dono.
