# Referência para escolher o time — US-28a

Consulta sob demanda na triagem. Primeiro defina a atividade, a capacidade e a
verificação; depois filtre pelo acesso em [IA](IA.md) e confira a ferramenta concreta.
Papel não fixa modelo. **Documentado** abaixo não significa disponível, configurado ou
testado nesta instalação. Consulta das fontes: **09/10/2026**.

## Personas deste projeto

| Papel | Capacidade exigida | Estado e fonte local |
|---|---|---|
| `po` | julgar problema, escopo e prioridade | [agente escrito](../../.claude/agents/po.md) |
| `tl` | ler diff e proteger invariantes | [agente escrito](../../.claude/agents/tl.md) |
| `dev-back` | implementar no script e nos testes | [agente escrito](../../.claude/agents/dev-back.md) |
| `qa` | verificar mudança e lacunas dos testes | [agente escrito](../../.claude/agents/qa.md) |
| `scout` | recuperar fontes e trechos delimitados | [agente escrito](../../.claude/agents/scout.md) |
| `dev-front`, `design`, `dba`, `sec`, `infra` | implementar interface, desenhar, modelar dados, auditar segurança, operar infraestrutura, respectivamente | descritos na [US-28](../Planejamento/Novos/time/roteamento/US-28-modelos-por-papel-claude-e-chatgpt/Sobre.md); sem agente escrito |

## Procedimentos disponíveis

| Procedimento | Quando entra | Fonte local |
|---|---|---|
| Graphify | triagem `po` + `tl` neste repo; grafo ausente ou velho exige fallback registrado | [fluxo](Fluxos/delegacao.md#triagem--quem-decide-o-time-da-atividade-us-26-08102026) |
| Ponytail | implementação pelo `dev-back` ou `dev-front`, sem substituir revisão e testes | [time](../../.claude/agents/README.md#ponytail-em-que-papel-entra) |
| `adaptador-de-ferramenta` | somente ao acrescentar adaptador | [skill](../../.agents/skills/adaptador-de-ferramenta/SKILL.md) |
| `publicar-no-npm` | somente na publicação | [skill](../../.agents/skills/publicar-no-npm/SKILL.md) |

As duas últimas skills não se aplicam à redação desta US. Skills instaladas fora do
projeto são consultadas quando a etapa as pede; instalação não prova acesso a modelo.

## Modelos e controles documentados

Descrições de capacidade são as dos fornecedores, não avaliação deste projeto. Cada
linha abaixo tem fonte oficial consultada em **09/10/2026**. Os níveis listados valem
para a ferramenta indicada; mesmo nome não equivale a mesmo esforço entre modelos.

| Ferramenta | Modelo concreto | Capacidade descrita oficialmente | Esforço documentado | Fonte |
|---|---|---|---|---|
| Claude Code | `claude-fable-5-1` | raciocínio exigente e trabalho de agente prolongado | `low`, `medium`, `high`, `xhigh`, `max` | [modelos](https://platform.claude.com/docs/en/models/overview), [controle](https://code.claude.com/docs/en/model-config) |
| Claude Code | `claude-opus-5-5` | código e trabalho de conhecimento prolongados | mesmos cinco níveis | [modelos](https://platform.claude.com/docs/en/models/overview), [controle](https://code.claude.com/docs/en/model-config) |
| Claude Code | `claude-sonnet-5-5` | combinação de velocidade e capacidade | mesmos cinco níveis | [modelos](https://platform.claude.com/docs/en/models/overview), [controle](https://code.claude.com/docs/en/model-config) |
| Claude Code | `claude-haiku-5-5` | alto volume, classificação, extração e roteamento | mesmos cinco níveis | [modelos](https://platform.claude.com/docs/en/models/overview), [controle](https://code.claude.com/docs/en/model-config) |
| Codex/Work | `gpt-6-astra` | trabalho complexo em código, apps e pesquisa | níveis oferecidos pelo cliente; API: `low` a `max` | [Work/Codex](https://learn.chatgpt.com/docs/models), [API](https://developers.openai.com/api/docs/models) |
| Codex/Work | `gpt-6.1-sol` | código complexo e trabalho prolongado | níveis oferecidos pelo cliente; API: `low` a `max` | [Work/Codex](https://learn.chatgpt.com/docs/models), [API](https://developers.openai.com/api/docs/models) |
| Codex/Work | `gpt-6-luna` | tarefas delimitadas e repetíveis | até `max` no cliente; API: `none` a `max` | [Work/Codex](https://learn.chatgpt.com/docs/models), [API](https://developers.openai.com/api/docs/models) |

**Limites da escolha.** Em Claude Code, `/effort`, `--effort` e frontmatter configuram
níveis; `effort` por invocação de subagente requer **v2.1.292+**. Variável de ambiente
e limites da organização podem prevalecer ([subagentes](https://code.claude.com/docs/en/sub-agents),
[configuração](https://code.claude.com/docs/en/model-config), 09/10/2026). Em Codex,
o seletor e o `model_reasoning_effort` dependem do cliente, plano e workspace; subagente
sem configuração herda modelo e esforço, enquanto escolher só o modelo usa o esforço
padrão dele ([modelos](https://learn.chatgpt.com/docs/models),
[subagentes](https://learn.chatgpt.com/docs/agent-configuration/subagents), 09/10/2026).
`Ultra` em Codex orquestra subagentes, não é nível de raciocínio da API; Luna não o
oferece. Suporte na API não prova suporte no cliente.

**Estado local em 09/10/2026:** suporte acima documentado; acesso, cota, nível
efetivamente aplicado e desempenho por etapa **não confirmados**. Antes de registrar
uma escolha na US, confirme disponibilidade e controle no executor. Falta de entrada
ou informação vencida volta à pesquisa oficial sob demanda pelo
[fluxo de delegação](Fluxos/delegacao.md).

**Observado em 10/10/2026 (Claude Code, Windows):** CLI `2.1.292`, portanto com `effort`
por invocação de subagente; sessão principal rodando `claude-opus-5-5` em esforço
`medium` (metadados da sessão no app desktop). Isso confirma **acesso** a esse modelo
nesse nível, não cota, nem desempenho por etapa. Sonnet, Haiku e Fable seguem só
documentados: o `model` do frontmatter dos agentes é configuração de partida, não prova
de acesso. Codex continua sem confirmação de modelo e esforço aplicados.
