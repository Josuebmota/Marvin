---
tipo: us
estado: refinada
pai: ../Sobre.md
---
# US-110 — FreeLLMAPI via MCP: o par com e sem

**Por quê:** o dono (06/11/2026) quer baratear o Marvin com o FreeLLMAPI. O caminho que não troca o modelo da sessão é o MCP `ask_freellmapi` (o Claude chama o gateway como uma tool e recebe a resposta de um modelo gratuito). Nenhuma ferramenta entra no `ferramentas.md` sem ganho medido: ponytail, ECC, superpowers, impeccable e serena estão `não`, ou sem ganho demonstrado, pelo mesmo motivo. Esta US faz o par.

**Depende da [US-108](../US-108-freellmapi-gateway-e-termos/Sobre.md)** (gateway no ar, termos conferidos, provedores aprovados). Não depende da [US-109](../US-109-freellmapi-fallback-por-cota/Sobre.md).

**Hipótese a testar, escrita antes de medir:** o ganho está em tarefas em que o Claude **cola o contexto e pede texto** (resumir, classificar, redigir, rascunhar). Em "onde está X no repositório" provavelmente **não** há ganho: o custo da recuperação é ler o repositório com as tools, e o modelo gratuito não lê o disco; o contexto teria de ser colado, e colar custa o que se queria evitar. Se o par confirmar isso, o resultado é um `não` útil.

**Pronto quando** (esta US não escreve código):
1. **Tarefa e critérios de aceite escritos antes do par**, no *Rumo*: uma tarefa de resumo ou redação de um projeto do OvenorGroup, com 5 a 7 critérios verificáveis. Sem texto de cliente, sem segredo.
2. **Custo fixo medido:** tokens por sessão com e sem o MCP, lidos no `/context`, instalado **só em escopo local de projeto** e removido depois. Número no *Rumo*. Lembrete: o MCP vem desligado por padrão no gateway e é o dono que o liga no painel.
3. **O par:** a mesma tarefa, Sonnet · médio, com e sem `ask_freellmapi`. Registrar tokens, custo, turnos, aceite (critério a critério) e **qual modelo o gateway realmente serviu** (a resposta traz o modelo servido e a trilha de fallback). Uma tarefa não prova nada; é um par, como a US-107a, e o *Rumo* diz isso.
4. **Veredito com limiar proposto pelo refino (o dono confirma, ❓ 1):** `usa: sim` (opt-in) só se o custo total, **incluindo o custo fixo do MCP**, cair em **20% ou mais** com aceite igual ao do braço sem. Aceite pior em qualquer critério ou custo dentro de ±10%: `usa: não`, com o número. Entre os dois: `usa: não`, com reabertura por um segundo par.
5. **Registro:** a linha `freellmapi` no `.marvin/ferramentas.md` (menos de 600 caracteres, molde das linhas `serena`, `graft` e `impeccable`): `usa`, alcance (só texto colado, sem leitura de disco), risco de privacidade (a regra da US-108), custo fixo, critério de reabertura numérico.
6. **Se for `sim`:** nasce uma US filha para a oferta no `OPTIONAL_TOOLS` do `marvin.mjs` (opt-in, **sem** o Marvin instalar nem subir servidor). O `tl` diz no *Rumo* se isso cai na decisão fechada "nada que gaste dinheiro ou tempo do usuário roda sem flag" e em "o Marvin não roda nada em background".

**Teto de gasto do par (proposta):** 2 × 100k tokens, no máximo 250k; passou, para e registra o parcial.

**Não entra:** código no `marvin.mjs`; tornar obrigatório (como o graphify); o Marvin instalar ou subir o servidor; `setup-claude`; trocar o modelo da sessão principal; recuperação de arquivo ("onde está X") como alvo do ganho (é a hipótese fraca acima, entra só como controle se sobrar teto); projeto de cliente; comparar com o Gemini via `agy` (o `agy` já cobre pesquisa e revisão, e a comparação é outra US se o dono quiser).

## Perguntas
- ❓ 1. O limiar do item 4 (−20% com aceite igual; ±10% é empate) vale, ou você prefere outro? É a única régua que decide o `usa`.
- ❓ 2. Em qual projeto medir? Proposta: Parci (OvenorGroup), escopo local, como na US-107a, com a tarefa de resumir um fluxo ou uma US.

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
Nenhum código (medição e registro). Editado: `.marvin/ferramentas.md` (a linha `freellmapi`). Lido, só para a US filha eventual: `marvin.mjs` — `OPTIONAL_TOOLS` (a localizar com `graphify` na hora, se o item 6 abrir).
- `.marvin/ferramentas.md` — a linha `freellmapi`

## Time
Triagem 06/11/2026. Modelo/esforço **solicitados** pela partida do `CLAUDE.md`; **aplicado: não confirmado**. O par roda em Sonnet · médio nos dois braços, para que a única diferença seja o MCP.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| escrever tarefa, critérios e limiar | po | Opus · médio | decide o que conta como ganho antes de medir | pendente |
| medir o custo fixo do MCP | dono | — | liga o MCP no gateway e lê o `/context` na própria sessão (a sessão do agente não vê o `/context` de outra) | pendente |
| rodar o par com e sem | dev-back | Sonnet · médio | a tarefa do par é implementação-leve com spec fechada; mesmo modelo nos dois braços | pendente |
| conferir aceite e números | qa | Sonnet · baixo | critério a critério, números batem com o `/context` | pendente |
| decidir o `usa` e a US filha | tl + po | Opus · médio | julgamento; o dono dá a palavra final | pendente |

Grafo (fresco, 04/11): **sem símbolo de código** nesta US; o `OPTIONAL_TOOLS` só é localizado se o item 6 abrir a US filha. Fallback: Grep só para localizar.

## Skills
Nenhuma.

## Rumo
- **06/11/2026** — refinada, esperando a [US-108](../US-108-freellmapi-gateway-e-termos/Sobre.md). Nasce da conversa "baratear e ter o fallback". Leitura de 06/11 do guia de clientes do repositório (resumo de página, **não** uso): o MCP expõe `ask_freellmapi`, chama o mesmo `/v1/chat/completions` do gateway (roteamento, fallback, cache e compressão de prompt incluídos, segundo o guia) e vem desligado em instalação nova. Compressão de prompt e cache do gateway podem mexer no custo: se existirem, o par anota se estavam ligados.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
