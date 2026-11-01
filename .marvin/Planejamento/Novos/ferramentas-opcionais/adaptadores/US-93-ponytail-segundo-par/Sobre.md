---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-93 — ponytail: segundo par medido

**Por quê:** a [US-68](../US-68-ponytail-medido/Sobre.md) deu +22% ($1,090 com × $0,896 sem) com n=1, e o dono (31/10/2026) manteve o ponytail obrigatório até haver um segundo par, porque uma amostra só não derruba nem sustenta a regra do `AGENTS.md`.
**Pronto quando:**
1. Protocolo no Rumo antes de rodar: tarefa **diferente** da US-68 e de tamanho diferente, do `dev-back`, duas cópias limpas, Sonnet · médio nos dois braços, aceite escondido, ligando o ponytail só em `.claude/settings.local.json`.
2. Conferido na transcrição que o nível do ponytail **chega ao subagente** (a US-68 já exigiu isso); se não chegar, registra e para.
3. Tabela no Rumo: $, turnos, testes verdes, tamanho do diff, aceite, com × sem; somada ao par da US-68 (n=2).
4. O dono decide com os dois números: a linha do ponytail em `ferramentas.md` e a menção no `AGENTS.md` são ajustadas à decisão, e a ressalva de 31/10 sai.

**Não entra:** ligar em `~/.claude` ou no `.claude/settings.json` versionado; outros papéis; Codex/Copilot; código no `marvin.mjs`.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md): o `dev-back` é quem carrega a escada.

## Código tocado
- `.claude/settings.local.json` — `enabledPlugins` (só durante a medição)
- `.marvin/ferramentas.md` — linha do ponytail
- `AGENTS.md` — invariante 4, menção ao ponytail

## Time
| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| protocolo | po | Sonnet · baixo | molde da US-68 já existe | pendente |
| rodar o par | dev-back | Sonnet · médio | mesmo modelo nos dois braços | pendente |
| ler o resultado | po + tl | Opus · médio | decide-se regra obrigatória do dono com base no número | pendente |

Grafo: sem símbolo de código tocado — só documentação e configuração local; nada a perguntar ao `affected`/`explain`.

## Skills
Nenhuma.

## Rumo
- **31/10/2026** — aberta. Origem: dono escolheu medir um 2º par em vez de aceitar o `não` (caminho 3). Nota: a US-68 tinha como critério 4 "se não pagar, vira `não`", então o `não` de 23/10 seguiu o protocolo dela; a decisão obrigatória de 16/10 e esse protocolo estavam em conflito, e esta US o resolve com número.
- **31/10/2026 — protocolo (escrito antes de rodar), no molde da [US-68](../US-68-ponytail-medido/Sobre.md).**
  - **Tarefa (diferente da US-63, menor):** [US-79](../../../organizacao-por-grafo/script/US-79-pausar/Sobre.md) **reduzida** a `marvin --us <caminho> --pausar "<espera>"` (Pronto quando 1, 2, 4 e 5, **sem** o `--ativa` do item 3). Natureza distinta da US-63 (cópia de catálogo, ~+49/+47 linhas): aqui é um comando que reescreve o frontmatter de um `Sobre.md` de alguém, idempotente, sob `--dry-run`. Implementação real de referência (já no histórico, `e2c213d`): `marvin.mjs` +56, `teste.mjs` +74, com `--ativa`.
  - **Base:** commit `1d3506a` (pai da US-79; já tem o estado `pausada` da US-73). Duas cópias limpas fora do repo: `git clone` local em `<scratchpad>/par93/A` e `B`, mesmo HEAD. Nada é commitado nelas.
  - **Braços:** A sem, B com ponytail. Única diferença: `.claude/settings.local.json` **da cópia** (git-ignorado) = `{"enabledPlugins":{"ponytail@ponytail":false}}` (A) × `true` (B). Nunca em `~/.claude` nem no `.claude/settings.json` versionado, nem no `settings.local.json` do repo real.
  - **Comando (idêntico):** `claude -p "<prompt>" --model sonnet --effort medium --output-format json --allowedTools "Read,Edit,Write,Grep,Glob,Agent,Bash(node *),Bash(git diff*),Bash(git status*)"`, rodado dentro de cada cópia.
  - **Prompt (idêntico):** "Implemente a US-79 em `.marvin/Planejamento/Novos/organizacao-por-grafo/script/US-79-pausar/Sobre.md`, **só os itens 1, 2, 4 e 5 do Pronto quando; não implemente o `--ativa` (item 3)**. Leia o Sobre.md e o AGENTS.md. Faça o trabalho chamando o subagente `dev-back` (Sonnet · médio) e não escreva código você mesmo. Escreva os testes no `teste.mjs`, rode `node teste.mjs` até zerar falhas. Não faça commit. Termine com um parágrafo: o que mudou e o resultado do `node teste.mjs`."
  - **Aceite escondido** (o braço não vê; rodo eu, no clone, depois, com `node marvin.mjs` num projeto falso copiado do clone): (1) `node teste.mjs` com 0 falhas; (2) `--us <caminho> --pausar "esperando o dono"` numa US `ativa`: frontmatter vira `estado: pausada`, `espera: esperando o dono`, `desde: <hoje>` e o Rumo ganha `- **dd/mm/aaaa** — pausada: esperando o dono`; (3) rodar de novo com a mesma espera: arquivo byte a byte igual; com espera diferente: só `espera:` muda e entra uma linha nova no Rumo; (4) corpo, *Impacto* e Evidência byte a byte iguais (exceto a linha do Rumo) e `--dry-run` não escreve nada; (5) espera com ` #` (ex.: `aguardando o PR #12`) é idempotente na segunda rodada (armadilha que a implementação real pegou só na 2ª rodada). Passa = 5 de 5.
  - **Métricas:** `total_cost_usd` (inclui o subagente), `num_turns`, `duration_api_ms`; `git diff --numstat marvin.mjs teste.mjs`; `node teste.mjs` (checks/falhas); aceite escondido (n de 5). Custo fixo da sessão fica fora (US-65).
  - **Ponytail realmente ativo em B (antes de ler qualquer número):** a transcrição da sessão e a do `dev-back` (`~/.claude/projects/<clone-B>/…/subagents/*.jsonl`) contêm `PONYTAIL MODE ACTIVE`; em A, zero nas duas. B sem a frase no `dev-back` = o par mede nada: registro e paro (Pronto quando 2). A com a frase = vazou: refaço A.
  - **Limite de gasto:** estimativa de um braço > US$ 3 = paro e registro. Sem veredito aqui: só os números e a leitura do que n=2 sustenta; quem decide é o dono (item 4).
- **31/10/2026 — resultado do par 2 (n=1 neste par; n=2 somado à US-68), Sonnet · médio nos dois braços, base `1d3506a`, tarefa = US-79 reduzida.** Conferência: `PONYTAIL MODE ACTIVE — level: full` em B na sessão (2×) e no `dev-back` (3×); em A, zero nas duas. O nível chega ao subagente; medição válida.

| métrica | A (sem) | B (com) |
|---|---|---|
| `total_cost_usd` | $0,697 | $0,634 (−9%) |
| turnos | 2 | 4 |
| `duration_api_ms` | 135.724 | 120.458 |
| diff `marvin.mjs` | +52 −1 | +28 −0 |
| diff `teste.mjs` | +30 | +20 |
| `node teste.mjs` | 553/0 | 551/0 |
| aceite escondido | 5/5 | 4/5 |

  Falha de B (item 5): espera com ` #` (`aguardando o PR #12`) não é idempotente — a 2ª rodada acrescenta outra linha `pausada:` no Rumo (2 linhas em vez de 1) e o resto fica igual. É a armadilha que a implementação real só pegou na 2ª rodada; A passou. Os dois mexeram nos dois READMEs (contagem de checks).

  **Soma dos dois pares (n=2):** custo A $0,896 + $0,697 = $1,593; B $1,090 + $0,634 = $1,724 (**+8%**, dentro do ±10% que a US-68 chamou de empate técnico). Por par: +22% e −9%, sinais opostos. Diff: B menor nos dois (US-68: +35/+32 contra +49/+47; aqui +28/+20 contra +52/+30). Aceite: B pior ou com ressalva nos dois (5/5 com ressalva no item 4; 4/5), A 5/5 e 5/5.

  **O que n=2 sustenta:** (1) custo não tem direção — +22% e −9% cabem em ruído de uma amostra por braço, e a média de +8% é empate técnico; o ponytail não barateou nem encareceu de forma demonstrável. (2) Diff menor se repetiu (2 de 2), o que bate com o objetivo declarado da escada. (3) O aceite foi igual ou pior em B nos dois pares, e as duas falhas são do mesmo tipo (caso de borda que o aceite escondido cobre e o braço não pensou: `ecc fora:` no `--check`; ` #` na idempotência) — indício de que a escada, ao enxugar, corta tratamento de borda; mas são 2 casos com tarefas e pontos de falha diferentes, não prova.
  **O que n=2 não sustenta:** variância não medida (n=1 por braço em cada par; um terceiro rodado do mesmo braço diria se a falha de B é do ponytail ou do sorteio); a mudança de modelo/versão do plugin entre os pares (5.2.0 em 23/10; aqui a versão ativa vem do cache — não conferi qual); tarefas só do `dev-back`. Nenhuma conclusão sobre custo; sobre aceite, tendência contra o ponytail com amostra pequena. Decisão (item 4) é do dono; não editei `AGENTS.md` nem `ferramentas.md`.
  **Custo da medição:** $1,331 ($0,697 + $0,634). Limpeza: removidos as duas cópias (`par93/A`, `B`, `base`) e a entrada `local` do `ponytail@ponytail` que o braço B criou em `~/.claude/plugins/installed_plugins.json`; o `.claude/settings.local.json` do repo real nunca foi tocado.

- **31/10/2026** — **decisão do dono (item 4): aceita o `não` para o plugin e mantém a atitude como regra escrita.** O dono observou que "não fazer o que não é necessário" é boa mesmo sem ganho de custo. Feito: `ferramentas.md` volta a `não` com os 2 pares; `AGENTS.md` (invariante 4) sem o ponytail obrigatório; glossário `Equipe.md` ganha "Escopo mínimo" (hipótese até 3–4 US) e os 6 agentes (`dev-back`, `tdd-guide`, `qa`, `tl`, `po`, `scout`) ganham o bloco "Escopo mínimo" na forma do papel, com a ressalva que faltou ao plugin: nunca cortar borda que o *Pronto quando* cobra. **Não** foi para o template do `marvin.mjs` (mexeria em `UPDATES`); medir antes.

## Evidência
Par 2 e soma dos dois pares no *Rumo* acima ($1,331 gastos na medição). Regra escrita: `Equipe.md` e `.claude/agents/*.md`. Commit: `git log --grep "US-93 concluída"`.
