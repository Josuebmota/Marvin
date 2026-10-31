---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-91 — o Gemini na equipe: documentar, medir o par e só então mexer na matriz

**Por quê:** pedido do dono, 30/10/2026: o Marvin é um plugin para quem trabalha com mais de uma LLM (Claude, GPT, Gemini), e hoje o Gemini só aparece como link de documentação da API em `IA.md` e no template. O dono quer extrair o melhor de cada um, sem que a pessoa precise ter os três: só Claude, só Gemini, só GPT, ou dois deles, conforme as assinaturas. Isso já é coberto pelo inventário de disponibilidade e pela regra "opção elegível mais barata"; o que falta ao Gemini é a **ponte** e o **registro do que foi observado**, como o GPT ganhou na [US-72](../US-72-gpt-na-equipe/Sobre.md).

Fatos observados em 30/10/2026 (Windows, sessão do dono):
- A Gemini CLI antiga deixou de servir contas pessoais (Google sign-in encerrado em 18/06/2026, [aviso do Google](https://developers.google.com/gemini-code-assist/docs/deprecations/code-assist-individuals)); o caminho com a assinatura é o **Antigravity CLI** (`agy` 1.4.11), instalado pelo dono.
- `agy models` lista: `gemini-4-argon-{low,medium,high}`, `gemini-3.8-flash-{low,medium,high}`, `claude-opus-5-5-*`, `claude-sonnet-5-5-*` e `gpt-oss-120b-medium`.
- `agy -p "<pedido>"` roda sem interface com o login já salvo e respondeu; `--effort low|medium|high|xhigh|max` e `--print-timeout` existem ([headless](https://antigravity.google/docs/cli/headless)).
- **`--sandbox` não impediu edição:** num diretório temporário o `agy -p` com `--sandbox` alterou um arquivo quando o pedido mandava. Não achei modo só leitura garantido; para revisão a trava é o texto do pedido e conferir `git status` depois.
- O instalador não pôs o `agy` no PATH do shell já aberto (fica em `%LOCALAPPDATA%\agy\bin`).
- Ollama do dono tem só `qwen2.5:3b` (1,9 GB); opencode está instalado.

**Pronto quando** (ordem: a documentação mínima para rodar o par, depois o par; a matriz só se o par pagar. A US-72 fez o par primeiro; aqui o procedimento precisa existir antes, porque sem ele o `agy` nem roda):
1. **Documentação** — `mapa-capacidades.md` ganha as linhas do Gemini (modelo concreto, níveis de esforço, fonte e data) com estado **"listado; não medido"** por modelo e o `-p` **observado em 30/10** num parágrafo à parte (ajustado no par 1: as linhas são de modelo, e nenhuma chamada confirmou qual respondeu), sem cota nem desempenho; `controles.md` ganha "Revisão pelo Gemini, opcional" com o procedimento do `agy` (caminho completo do binário, pedido por stdin com diff e critérios colados, `--print-timeout`, pedido que manda não editar, as três conferências iguais antes e depois — `git status --porcelain -uall`, hash do `git diff --binary` e hash dos não rastreados —, sem `git restore`) e o limite do `--sandbox` acima; `IA.md` marca o Gemini como **não medido** e não cria par de posição com Claude ou GPT. `git diff --check` e links relativos conferidos; `po` e `tl` aprovam.
2. **Par medido** — ≥ 2 pares: `qa` Claude sozinho × `qa` + `agy` (pedido por stdin, sem `-p`) no mesmo diff, aceite independente, resultado no *Rumo* com achados únicos de cada lado e custo de cota. Pela régua do `po` na US-72: se pagar, a revisão pelo Gemini deixa de ser só opcional; se não, fica opcional como a do GPT.
3. **Só se o par pagar**, e em US filha: coluna "Partida no Gemini" no template do `Equipe.md` com **"não medido"** nos papéis sem par (decisão 6 da US-72), `UPDATES` com `\s+` e `soCom: !OLD_LAYOUT`, contagem de checks.

**Não entra:**
- valor de esforço do Gemini por papel antes do par; equivalência Argon ↔ Opus ou Flash ↔ Sonnet (nome ou posição iguais não provam capacidade, regra da US-28);
- matriz fixa de arranjos por assinatura (a 28b foi absorvida pela US-19; a escolha segue por tarefa e disponibilidade);
- implementação pelo Gemini: a decisão de 29/10 da US-72 (❓5) foi **só revisão cruzada** para o GPT; para o Gemini vale por analogia da sessão, não confirmada pelo dono; implementar pede outro par e outra US;
- detectar o `agy` ou ler o keyring/credenciais do login (invariante 3 e decisão da US-72); `disponibilidade.json` continua só declarado;
- Ollama e opencode como ponte (fora por padrão conservador da sessão, ❓4 pendente do dono): com `qwen2.5:3b` não há papel que sirva além de localizar arquivo, e o `opencode run` não foi testado; abrir US própria se o dono instalar um modelo local maior;
- rotear o próprio Claude Code para modelo não-Claude (gateway), descartado na [US-20](../US-20-handoff-de-executor-por-cota/Sobre.md) item 4; reabre só com fato novo.

## Perguntas
1. ~~**Qual modelo e esforço no par?** `po` e `tl` propõem `gemini-3.8-flash` · médio como partida (degrau mais barato, paralelo ao `gpt-6-luna` · médio da US-72) e `gemini-4-argon` · high só se o par mostrar que o Flash não alcança.~~ → confirmado (dono, 31/10/2026).
2. ~~**Aceita a trava por texto no `--sandbox`?** O pedido manda não editar e a sessão confere `git status` depois de cada chamada. Se preferir, o par roda numa cópia descartável do repositório.~~ → aceita: trava por texto e `git status` antes e depois (dono, 31/10/2026).
3. ~~**A assinatura do Gemini conta como $0 marginal**, como a do GPT? Se sim, a régua do par é achados e cota, não dólar.~~ → sim, $0 marginal: a régua do par é achados e cota (dono, 31/10/2026).
4. **Ollama e opencode** ficam fora desta US, com US própria depois de haver modelo local que sirva? Sem objeção do dono às respostas 1-3; segue fora até ele dizer o contrário.

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md) · [controles](../../../../../Contexto/Fluxos/delegacao/controles.md) · [capacidades](../../../../../Contexto/Fluxos/delegacao/capacidades.md)
- [IA](../../../../../Contexto/IA.md) · [mapa-capacidades](../../../../../Contexto/mapa-capacidades.md) · [Equipe](../../../../../Contexto/Equipe.md)
- [US-72 — o GPT na equipe](../US-72-gpt-na-equipe/Sobre.md) · [US-28 — mapa de modelos](../US-28-modelos-por-papel-claude-e-chatgpt/Sobre.md) · [US-20 — handoff](../US-20-handoff-de-executor-por-cota/Sobre.md)

## Código tocado
Etapas 1 e 2: nenhum código, só documentação em `.marvin/Contexto/`. Etapa 3, condicional ao par:
- `marvin.mjs` — `writeIfMissing` (template do `Equipe.md`, ~L3197)
- `marvin.mjs` — `pendingUpdates` (`UPDATES`, ~L5182)
- `teste.mjs`

## Time
Proposto em 31/10/2026; configuração aplicada: não confirmada até a execução. O item 3 do *Pronto quando* fica fora até o par terminar.

- **Grafo (31/10, fresco: `graph.json` 6 s depois do último commit):** `writeIfMissing` (L3123) — `affected`: nenhum; `explain`: grau 3, comunidade `printStatus`. `UPDATES` → `pendingUpdates` (L5182) — `affected`: nenhum; `explain`: grau 1. `AI_IDS` (L287, já aceita `gemini`) — `affected`: nenhum; grau 1. O template literal do `Equipe.md` não tem nó; fallback Grep. Etapas 1 e 2 não têm nó de código.
- **Riscos (`tl`):** declarar "testado" o que só foi observado (invariante 3); equivalência de esforço entre fornecedores escapar por analogia; o `--sandbox` dar falsa segurança de só leitura.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| fechar as ❓ e o escopo | po + tl | Opus · médio | decisão de escopo; segue a US-72 | feito 31/10 (❓1-3 respondidas; ❓4 fora por padrão conservador, pendente do dono) |
| documentar: mapa, controles, IA | dev-back | Sonnet · médio | spec fechada, só texto; o risco é de rótulo (observado × testado), não de ambiguidade | feito 31/10 na sessão principal; aplicado: não confirmado |
| verificar links e diff | qa | Sonnet · baixo | `git diff --check`, links relativos | feito 31/10 (sem erros; refeito depois das correções do par 1) |
| par ≥ 2: revisão cruzada | qa + Gemini via `agy` (stdin) | Sonnet · baixo + `gemini-3.8-flash` · médio (proposto; aplicado: não confirmado) | aceite independente | par 1 e par 2 feitos 31/10 (Rumo); não pagou |
| ler o diff da documentação | tl | Opus · médio | muda o que a triagem lê; invariante 3 | feito 31/10 (3 leituras; aprovado na 3ª) |
| coluna "Partida no Gemini" no template | dev-back | Sonnet · médio | template e `UPDATES` | condicional ao par |
| ler o diff do script | tl | Opus · médio | invariantes 2 e 4, `UPDATES` | condicional ao par |

## Skills
_(nenhuma)_ Se "chamar outro CLI em modo só leitura e trazer o achado" se repetir para um terceiro executor, vira skill na segunda vez (`codex exec` e o `agy` por stdin já são duas ocorrências do padrão; avaliar ao fechar o par).

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
- [US-64 — desvio de papel no `--status`](../../../../Manutencao/diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../../../Manutencao/diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../../Manutencao/diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../../Manutencao/diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 1 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../../../../Manutencao/diagnostico/status/US-74-grafo-velho-vira-alerta/Sobre.md) — 1 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../../../../Manutencao/diagnostico/status/US-78-teto-por-documento/Sobre.md) — 1 nó(s) em comum
- [US-87 — o teto isenta US concluída e `Fontes/` vira raiz](../../../../Manutencao/diagnostico/status/US-87-teto-isenta-concluida-e-fontes-raiz/Sobre.md) — 1 nó(s) em comum
- [US-90 — o estado da US não envelhece](../../../../Manutencao/diagnostico/status/US-90-estado-que-nao-envelhece/Sobre.md) — 1 nó(s) em comum
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
- … e mais 40

## Rumo
- **31/10/2026** — aberta por pedido do dono, depois de o `agy` ser instalado e testado (30/10). A análise do glossário mostrou que a US-28 e a US-72 já fixam o caminho: sem modelo padrão por papel, sem equivalência de esforço, matriz só com papel medido e "não medido" nos demais. Por isso a US começa pela documentação e pelo par, não pela coluna no `Equipe.md`. Numeração: as pastas de US do Marvin vão até a 90; US-144 e US-147 que aparecem nos textos são do Heim e do Parci. Aguarda as ❓ do dono.
- **31/10/2026** — o dono respondeu ❓1-3 pela recomendação: Flash · médio no par, trava por texto no `--sandbox` com `git status` antes e depois, Gemini $0 marginal. A ❓4 (Ollama e opencode) **não foi respondida**: a sessão a deixou fora por padrão conservador; o dono pode reabrir. Etapa 1 escrita: linhas do Gemini no `mapa-capacidades.md` (observado, não medido), procedimento opcional `agy -p` no `controles.md`, ponteiro "não medido" no `IA.md`. Nenhuma linha diz "testado" para modelo ou esforço: a chamada de 30/10 usou o modelo padrão do cliente, não conferido qual.

- **31/10/2026** — **par 1 medido** (`qa` Sonnet × `agy` (a 4ª chamada, a que valeu, por stdin e sem `-p`, com `--model gemini-3.8-flash-medium`), mesmo diff dos 3 arquivos de `.marvin/Contexto/`, nenhum vê o outro; `git status` igual antes e depois nas chamadas do Gemini, **mas isso não prova que ele não editou**: os 3 arquivos já estavam ` M` e o hash do diff não foi guardado neste par; a triagem dos achados foi da sessão autora do diff).
  - **Falha de método, achada pelo par:** as 2 primeiras chamadas do Gemini não produziram revisão. O modo sem interface negou sozinho `git diff` (ferramenta de comando) e a leitura de arquivo (`read_file`). A 3ª falhou por aspas no `-p` do PowerShell 5.1. A 4ª funcionou com o pedido por **stdin**, diff e critérios colados no texto. Procedimento do `controles.md` corrigido; sem isso a revisão pelo Gemini nem rodaria.
  - **Os dois acharam:** o texto "Partida: Flash · médio, Argon · high só se o Flash não alcançar" lê-se como modelo padrão e encosta no "Não entra" e na US-28. O `qa` deu **menor**, o Gemini deu **bloqueia**. Aceito pela sessão principal como correção de redação, a confirmar na leitura do `tl`: virou "proposto, sem padrão até medir; escada de custo, não de capacidade".
  - **Só o `qa` achou, aceitos:** a seção do Gemini estava no meio do bloco do GPT e o parágrafo "Estado local de 09/10" parecia valer para ela (seção movida para o fim, com aviso de que não herda o estado); o pedido não mandava ignorar Rumo e Evidência nem exigia `git status` limpo (corrigido); "o `-p` exige `agy` interativo" estava escrito como fato (agora em **Documentado, sem teste próprio**, com a fonte).
  - **Só o `qa` achou, recusado em parte:** `--print-timeout 300s`, `--dangerously-skip-permissions` e o caminho do `agy.exe` "não verificados". O formato `--print-timeout 60s` e `90s` e o caminho completo foram executados em 30/10; a flag perigosa só aparece como proibição, na documentação [headless](https://antigravity.google/docs/cli/headless).
  - **Só o Gemini achou, recusado:** pediu trocar o estado das linhas da tabela para "observado/`-p` testado". As linhas são de **modelo**, e nenhuma chamada confirmou qual modelo respondeu; "testado" ali seria o rótulo errado. O `-p` observado está no parágrafo abaixo da tabela.
  - **Saldo:** achados únicos: `qa` 3 aceitos, Gemini 0 aceitos (1 recusado); 1 achado em comum. O Gemini não viu a seção fora de lugar nem a inferência escrita como fato, **mas recebeu só o diff colado**, sem o arquivo em volta, e o `qa` leu os arquivos inteiros: parte da diferença é de entrada, não de revisor. É a condição real de uso do `agy` em modo sem interface, então o par vale, com essa ressalva. No par 2, registrar o tamanho do pedido (caracteres) e o tempo de cada chamada, já que a cota não aparece. Nenhum dos dois apontou que o procedimento original do `controles.md` não rodaria em modo sem interface: isso saiu da própria execução. Gasto de cota do Gemini não medido (a CLI não mostra). Amostra de 1 par; falta o par 2 para o item 2.

- **31/10/2026** — **`tl` (Opus · médio) leu o diff: NÃO APROVADO**, 2 bloqueios e 5 menores, todos aceitos e corrigidos. Bloqueios: (1) `git status` igual não detecta edição num arquivo que já estava ` M`, e "desfaça" podia levar a `git restore` sobre trabalho não commitado do dono; agora o procedimento guarda `git status --porcelain` e o hash do `git diff`, compara os dois e proíbe `restore`/`checkout`; (2) o comando do `controles.md` não era o da chamada que funcionou; agora é o literal (stdin, sem `-p`, `--model`, saída para arquivo). Menores: "par ainda não medido" virou "1 de 2"; `--effort` passou a "segundo a documentação, não testado"; "escada de custo" ficou "presumida"; o critério 1 da US e o `IA.md` foram alinhados ao que foi decidido; o ponteiro da memória foi atualizado. O `tl` confirmou que as duas recusas do par 1 estavam certas e que a decisão do `agy` sem `permissions.allow` ficou com o dono. Falta: aprovação do `po`, nova leitura do `tl`, e o par 2.

- **31/10/2026** — **2ª leitura do `tl`: NÃO APROVADO, 1 bloqueio e 3 menores; 6 dos 7 achados anteriores resolvidos.** Bloqueio: o hash do `git diff` não cobre arquivo não rastreado (a própria `Sobre.md` desta US está `??`), e `git status --porcelain` sem `-uall` mostra a pasta como uma linha só. Corrigido: o procedimento guarda três coisas (`status --porcelain -uall`, hash de `git diff --binary` por arquivo e hash de cada não rastreado via `git ls-files -o --exclude-standard | git hash-object --stdin-paths`); comandos conferidos no repo, com hash estável entre duas execuções. Menores: o hash passa por arquivo (o pipeline do PowerShell 5.1 converte por `$OutputEncoding` e perde troca só de acento); arquivo que já tinha mudança do dono pede aviso, não reversão; `agy -p` na US virou "stdin, sem `-p`" nos critérios, na tabela e em Skills (as menções de 30/10 e as respostas do dono ficam como registro). Falta: parecer do `po` (em andamento), 3ª leitura do `tl` e o par 2.

- **31/10/2026** — **`po` (Opus · médio): APROVADO o escopo da etapa 1**, nenhum bloqueio, 6 menores aceitos e corrigidos: a ordem "par primeiro" era da US-72 e aqui a documentação mínima vem antes; "só revisão cruzada" é do GPT e vale ao Gemini por analogia, não confirmada; a ❓4 é suposição conservadora da sessão, não resposta do dono (texto ajustado em 3 lugares); o `$OutputEncoding` e a "escada de custo" passaram a dizer o que não foi conferido e a valer só no par; o critério 1 agora cita as três conferências. Ressalvas do par 1 gravadas acima: `git status` igual não prova ausência de edição, e o Gemini recebeu só o diff colado. O `po` também notou que o aceite do par 1 depende da 3ª leitura do `tl`. Falta: 3ª leitura do `tl` e o par 2 (registrar tamanho do pedido e tempo por chamada).

- **31/10/2026** — **`tl` (Opus · médio), 3ª leitura: APROVADO a etapa 1.** B1, M1, M2 e M3 resolvidos; procedimento executável, sem risco para trabalho do dono e sem mexer em permissão do `agy`; nenhuma frase passa da evidência. Com o `po` (aprovado antes), o **item 1 de "Pronto quando" está cumprido**. Cinco menores do `tl` aplicados: `core.quotePath=false` no `ls-files` (caminho com acento abortava em silêncio), arquivo novo do Gemini pode ser apagado, diff de depois em `depois.diff`, risco de arquivo ignorado ou fora do repo declarado, e o par 1 passa a dizer que a chamada que valeu foi a 4ª, por stdin. `git diff --check` limpo, e o arquivo novo conferido com `git diff --no-index --check`. **Falta o item 2:** par 2 em outro diff real, com aceite de quem **não** autorou o diff (no par 1 a triagem foi da sessão autora), tamanho do pedido e tempo por chamada. O item 3 só abre se o par pagar.

- **31/10/2026** — **par 2 medido e item 2 cumprido.** Diff real: o commit `96ef126` (US-92: `marvin.mjs`, `teste.mjs`, `delegacao.md`, `Equipe.md`, `triagem.md`), revisto por `qa` Sonnet · baixo (leu o repo, ~24 s) × `agy` `gemini-3.8-flash-medium` por stdin, na **cópia descartável do repo** (`git clone` + checkout do commit), pedido de 11.946 bytes, **117 s**, cota não medida. Aceite por quem **não** autorou o diff: `tl` (Opus · médio), que conferiu cada recusa no repo.
  - **qa:** 0 bloqueios, 2 menores aceitos (frase para o `tl` não ser circular; regex do teste gulosa). Nada achado pelo Gemini que o `qa` não tenha achado ou que fosse real.
  - **Gemini:** 1 "bloqueia" **falso por entrada** (os 5 `.md` de papel não estavam no pedido; a sessão principal os deixou fora do recorte) e 3 menores recusados (link que existe, `desde: '3.4.4'` na convenção da US-90, teste do template). Achados únicos aceitos: **0**.
  - **O `tl` achou o que nenhum dos dois achou:** `tdd-guide.md` (ECC, executa com Write/Edit) ficou sem o bloco de Devolução. Corrigido; os agentes do ECC copiados pelo script saem sem o bloco (decisão pendente do `tl`/`po` na US-92).
  - **Falha de método:** `git ls-files -o … | git hash-object --stdin-paths` aborta com código 128 quando não há arquivo não rastreado; a conferência de não rastreados ficou sem prova real neste par. O recorte do diff foi desigual (Gemini viu o diff cortado; o `qa` leu o repo). Procedimento do `controles.md` corrigido: guarda para lista vazia e "cole o diff completo".
  - **Saldo dos 2 pares (n=2, mesma família de diff: texto e `UPDATES` do Marvin):** achados únicos aceitos `qa` 3 + 2 = 5 × Gemini 0; recusados do Gemini 1 + 4; 1 achado em comum (par 1). **Pela régua do `po` na US-72, não paga como obrigatória: a revisão pelo Gemini fica opcional**, como a do GPT. Limites: amostra pequena, recorte desigual, cota não medida, só o Flash · médio testado (o `gemini-4-argon` não entrou). Item 3 (coluna "Partida no Gemini" no `Equipe.md`) **não abre**.

## Evidência
Pares 1 e 2 e leituras de `po` e `tl` no *Rumo*. Documentação: `mapa-capacidades.md`, `controles.md` ("Revisão pelo Gemini, opcional"), `IA.md`. Commits: `63fbdd9` (etapa 1) e o que fecha esta US (`git log --grep "US-91 concluída"`).
