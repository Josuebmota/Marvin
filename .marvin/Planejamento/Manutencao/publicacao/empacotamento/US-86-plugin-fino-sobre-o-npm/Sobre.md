---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-86-plugin-fino-sobre-o-npm
description: "Refinada em fatias (02/11): 0 medir marcas pendentes de comando em projetos reais, 1 pesquisar o formato de plugin, 2 o dono decide entre plugin, regenerar seletivo por hash ou nada. A implementação (fatia 3) abre US filha depois da decisão."
---
# US-86 — plugin fino sobre o npm

**Por quê:** a [US-53](../US-53-marvin-como-plugin/Sobre.md) foi cancelada em 15/10/2026 pela régua "reabre com problema medido". Em 27/10 apareceram dois — um caso cada, ainda **não medidos** (a régua só fica cumprida depois do esboço do Pronto quando):
1. **Templates que não se atualizam.** O `.claude/commands/refinar.md` deste repositório não recebeu o texto da US-81: o script não reescreve arquivo existente (`existsSync`) e só avisa pela tabela `UPDATES`, mantida à mão — armadilha já listada no AGENTS.md ("já falhou uma vez"). O texto foi colado à mão. Não reescrever é o invariante 2 funcionando (o arquivo pode ter edição do usuário); o argumento do plugin é que o comando genérico passa a ser arquivo **do plugin**, que se atualiza com ele, e não do projeto.
2. **Conselho não vira trava.** A pergunta do dono (27/10): "como eu sei que a LLM está seguindo o Marvin a todo momento?". O `--status` mede papel, modelo e custo pelas transcrições (US-41, 64, 65), mas não mede os rituais (teste antes do commit, `tl` depois da última edição, consulta ao grafo); na mesma sessão, um `graphify update .` solto apagou os nós da base no grafo e só foi notado na conferência seguinte. O hook que o script já escreve (`SessionStart`, `marvin.mjs:4250`) avisa; trava seria `PreToolUse`/`Stop`.

**Desenho em discussão (não decidido):** o plugin leva o genérico — `/retomar`, `/refinar`, `/fechar`, hooks de trava, aviso na abertura; o `marvin.mjs` no npm continua o motor e escreve a base do projeto (memória, grafo das US, agentes com armadilha do código — invariante 4). Dependências obrigatórias viram **checagem que falha alto**, não pacote puxado: ECC como dependência traria de volta a carga global medida (74,8k, Fase 0 da US-50) e contraria "o que é global é pago em toda sessão"; graphify é Python e instalá-lo sem flag fere a US-50 e o invariante 1.

**Pronto quando (fatias 0 a 2 — esta US não implementa):**
1. **Fatia 0, medir:** o número de marcas de `.claude/commands/` pendentes em cada projeto real do dono (Parci e outros do OvenorGroup), contado com a flag de diagnóstico do `marvin` que NÃO escreve (conferida no código antes; `git status` limpo depois em cada projeto). Resultado no Rumo: marcas por projeto e o total, contra o limiar do `po` (≥5 marcas em ≥2 projetos).
2. **Fatia 1, pesquisar o formato de plugin** com fonte oficial citada e data: escopo por projeto (`enabledPlugins`), prefixo de nome dos comandos, quem vence quando plugin e `.claude/commands/` têm o mesmo nome, peso das descrições no contexto, dependência declarada, e se um comando de plugin consegue variar por projeto (caminhos `relDocs`/`DEST`, layout antigo). Cada resposta marcada como confirmada na fonte ou **não confirmada**.
3. **Fatia 2, decidir:** o `tl` e o `po` (Opus · alto) apresentam as três saídas — plugin, regenerar seletivo por hash (US-58, hash gravado no carimbo da US-17), nada — com custo, risco nos invariantes 1 e 2 e o que cada uma resolve do que foi medido; **o dono escolhe**. Se medir abaixo do limiar, a recomendação é "nada" e a US fecha como `cancelada` com os números.
4. A escolha vira o Rumo desta US; a **fatia 3 (implementar)** abre como US filha com *Código tocado*, `UPDATES` e o `tl` no diff. Fica fora desta.

**Não entra:** implementar qualquer das três saídas nesta US; trocar o npm pelo plugin; dependência do ECC inteiro; instalar graphify sem flag; as travas por hook (US-88); escrever em projeto de terceiro (a medição é só leitura, e só em projeto do OvenorGroup).

## Perguntas
- ~~❓ 1. Antes de medir as marcas pendentes nos projetos reais, vale abrir a parte das travas por hook (que não precisa de plugin — o script já escreve hooks no `.claude/settings.json`) como US própria?~~ → sim (dono, 29/10/2026): [US-88](../../../../Novos/time/orquestracao/US-88-travas-por-hook/Sobre.md). Esta fica só com o empacotamento.

- ~~❓ 2. Estaciona ou refina em fatias?~~ → refina em fatias (dono, 02/11/2026).
- ❓ 3. O incômodo é token, tempo seu ou o risco de esquecer? Se for esquecer, o `--status` já avisa as marcas pendentes.
- ❓ 4. **Invariante 2:** reescrever um comando cujo conteúdo é byte a byte igual ao que o próprio Marvin gerou (hash gravado no carimbo, US-17) fere a letra de "não sobrescrever", não o espírito. Você aceita essa leitura? Sem ela, só o plugin ou a colagem à mão resolvem.
- ❓ 5. A pesquisa do formato de plugin é a fatia 1 (sem web, o `tl` e o `po` não puderam responder; invariante 3).

## Fluxos ligados
- [decisoes-fechadas.md](../../../../../Contexto/Arquitetura/decisoes-fechadas.md) — "O Marvin é o único plugin do Claude e o curador das ferramentas, por projeto" (15/10/2026)
- [publicacao-no-npm.md](../../../../../Contexto/Arquitetura/publicacao-no-npm.md)

## Código tocado
Nas fatias 0 a 2 nada é editado (medir, pesquisar, decidir); o que segue é **lido** e é onde a fatia 3 vai mexer, então já define a ilha:
- `marvin.mjs` — `pendingUpdates` (L5209) e a tabela `UPDATES` (L5220-5418)
- `marvin.mjs` — `--regenerar` (L3083)
- `marvin.mjs` — gerador de comandos (L3991-4229)
A fatia 3 declara o seu *Código tocado* definitivo na US filha.

## Time
Triagem 02/11/2026 (`/refinar`, `tl` e `po` em Opus · alto, em paralelo; régua: decide rumo = alto). A fatia 3 não está aqui.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| 0 medir marcas pendentes de comando nos projetos do dono | scout | Haiku · baixo | só contagem por comando, conferível | pendente |
| 1 pesquisar o formato de plugin (fonte oficial) | claude-code-guide | Sonnet · baixo | precisa de web; recuperação delimitada, mas com ressalva da convenção que muda rápido (invariante 3) | pendente |
| 2 comparar as três saídas e recomendar | tl + po | Opus · alto | decide rumo; relê o invariante 2 | pendente |
| 2 escolher | dono | humano | decisão que só o dono toma | pendente |

Grafo (fresco, 02/11 16:41, depois do `1f0de33`): `pendingUpdates` (L5209) grau 2, `affected` sem dependentes (a aresta de L2002 falta; Grep como fallback); gerador de comandos e `--regenerar` sem nó (código de topo); `writeIfMissing` (L3138) grau 4.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../../../diagnostico/status/US-78-teto-por-documento/Sobre.md) — 1 nó(s) em comum
- [US-90 — o estado da US não envelhece](../../../diagnostico/status/US-90-estado-que-nao-envelhece/Sobre.md) — 1 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 1 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../../../ferramentas-opcionais/adaptadores/US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 1 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 1 nó(s) em comum
- [US-82 — o hook do grafo com `core.hooksPath` (husky) não mente](../../../ferramentas-opcionais/adaptadores/US-82-hook-do-grafo-com-hookspath/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../../Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../../Novos/ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 1 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../../Novos/ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 1 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../../Novos/ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 1 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../../Novos/ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 1 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../../Novos/ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 1 nó(s) em comum
- [US-63 — skill citada nas instruções vem do ECC](../../../../Novos/ferramentas-opcionais/curadoria/US-63-skill-citada-vem-do-ecc/Sobre.md) — 1 nó(s) em comum
- … e mais 27

## Rumo
- **27/10/2026** — anotada a pedido do dono, depois da conversa "e se o Marvin fosse plugin, com dependências obrigatórias?". Reabre a pergunta da [US-53](../US-53-marvin-como-plugin/Sobre.md) (cancelada à espera de problema medido) com os dois problemas acima.
- **02/11/2026** — crivo `tl` (Opus · alto) + `po` (Opus · alto), **não refinada** (segue `anotada`). Os dois: ainda é especulação; a tabela `UPDATES` tem 73 marcas e só 22 são de `.claude/commands/` (`marvin.mjs:5220-5418`), então o plugin cobre no máximo um terço; o problema 2 já foi para a US-88. `tl` mediu: 20 commits mexeram em comandos, 13 acrescentaram marca de comando no `UPDATES` (11/09 a 27/10); ajuste à mão só em `9b33605` (regenerar e recolocar) e `c2b1ff1` (US-81 no `refinar.md`); hoje 1 marca pendente, não de comando. Os comandos interpolam caminhos do projeto (`relDocs`, `DEST`, `marvin.mjs:4079-4229`) e 4 deles não existem no layout antigo (L3088), então um arquivo fixo de plugin não serve como está. A decisão de 15/10 só se cumpre com o plugin ligado por projeto. O `--regenerar` (US-58, `marvin.mjs:3083-3123`) já existe e só falta um modo seletivo por hash.
- **Divergência.** `po`: **estacionar** — reabre só se `marvin --check` em ≥3 projetos reais achar ≥5 marcas pendentes em `.claude/commands/` somando ≥2 projetos; sem spike antes; a medição vive em `Manutencao/diagnostico/atualizacoes` (scout, Haiku · baixo). `tl`: não cabe em 1 chat; fatias 0 medir (scout), 1 spike do formato (`claude-code-guide`), 2 o dono escolhe entre plugin, regenerar seletivo por hash ou nada (`tl` + `po`, Opus · alto), 3 implementar (dev-back Sonnet · alto, qa Sonnet · médio, `tl` Opus · alto no diff: escreve no disco de alguém e toca os invariantes 1 e 2). Devolução do `tl`: a alternativa por hash pede reler o invariante 2, decisão do dono (❓4). Grafo fresco (16:41, depois do `1f0de33`): `pendingUpdates` (L5209) sem dependentes no grafo (a aresta de L2002 falta; Grep como fallback); gerador de comandos e `--regenerar` sem nó (código de topo).

- **02/11/2026** — dono: **refinar em fatias**. Estado `refinada`: fatias 0 (medir), 1 (pesquisar o formato) e 2 (decidir) ficam nesta US; a 3 (implementar) abre US filha depois da escolha. ❓3 e ❓4 ficam para a fatia 2.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
