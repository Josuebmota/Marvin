---
name: ferramentas
description: Ferramentas opcionais que ESTE projeto usa — e o que cada uma alcança
tags: [referencia]
marvin_montado: "< 2.2.0"
marvin: 3.4.1
---
# Ferramentas opcionais

Registro de "este projeto usa X". O `marvin` detecta e escreve aqui (graphify no PATH
entra como `sim`, sem perguntar; as demais perguntam uma vez); para
mudar, edite a coluna **usa** ou rode `marvin --use=<ferramenta>`. **Alcance** diz
quem consegue ler o que a ferramenta produz — nem tudo é de todo agente.

**Versionar o derivado:** por padrão o grafo (`graphify-out/`) e a página de status
(`.marvin/.status/`) vão para o `.gitignore`. Para versioná-los, rode
`marvin --track=grafo,status` (ou `--untrack=` para voltar): a escolha fica na linha
`versiona:` do cabeçalho deste arquivo e o `marvin` passa a ler dela. Linha que já está no
`.gitignore` o `marvin` avisa, nunca remove.

**Obrigatórias (custo):** graphify, ponytail e ecc entram como `sim` e o `marvin` instala o
que faltar na máquina, sem flag. Um `não` escrito aqui é respeitado, mas o `marvin` avisa que o
padrão é obrigatório.

| ferramenta | usa | alcance | data |
|---|---|---|---|
| graphify | sim | saída JSON/markdown em graphify-out/ — qualquer agente lê; só o hook é do Claude, e não é usado. **Neste repo, obrigatório na triagem desde 2026-10-08.** Instalação à parte (`uv tool install graphifyy`), não é npm. Ausente na sessão em nuvem: aí a triagem registra "grafo ausente" | 2026-09-15 |
| ponytail | não | escada de simplicidade para quem IMPLEMENTA — plugin com hooks no Claude Code/Codex/Copilot CLI (install próprio em cada um; aqui só o do Claude é detectado). **Medido na [US-68](Planejamento/Novos/ferramentas-opcionais/adaptadores/US-68-ponytail-medido/Sobre.md) (n=1, Sonnet · médio, mesma tarefa, ponytail 5.2.0 ativo no `dev-back`):** $1,090 com × $0,896 sem (+22%), 2 turnos nos dois, testes verdes nos dois, aceite escondido 5/5 sem × 5/5 com ressalva (o `--check` ainda avisa skill excluída por `ecc fora:`). Mesmo resultado, gastando mais; diff menor (+35/−3 × +49/−11) não compensou. Reabre com um par que mostre ganho | 2026-10-23 |
| ecc | sim | **Fonte do time (US-60/69):** o marvin copia por stack só os agentes e skills que casam com uma etapa (67 agentes no marketplace, MIT), com `model`/`effort` pela matriz; `ecc fora:` abaixo da tabela exclui id. Fora do que ele copia: skills/comandos/agentes de execução (avaliado na US-48, só escopo de projeto). Custo fixo medido sem UI: ECC inteiro +2,0k tk/sessão; mínimo (`tdd-workflow`, `build-fix`, `security-scan`) +23 tk. Ganho medido: nenhum — mesma tarefa (slugify + testes) no Sonnet custou $0,214 sem e $0,213 com, 4 turnos nos dois, testes verdes nos dois. Tem `/model-route`, mas avulso e sem esforço. Reabre com um par que mostre ganho | 2026-10-15 |
| superpowers | não | **Catálogo de referência, não instalação:** 3 das 15 skills (MIT) servem de base: `verification-before-completion` (evidência antes de afirmar — o `qa`), `systematic-debugging` (defeito), `writing-skills` (skill na 2ª execução). As outras repetem `/refinar`/`/us` ou encarecem (`subagent-driven-development`: 1 implementador + 2 revisores por tarefa). plugin de skills de processo (avaliado na US-48, reabrindo a US-25; versão 6.4.1 do marketplace oficial, só escopo de projeto, desinstalado depois). Custo fixo medido sem UI: +2,05k tk/sessão. Mesma tarefa no Sonnet: **$0,280 e 8 turnos** com ele × $0,214 e 4 turnos sem (+31%), testes verdes nos dois (8 × 7 casos). Mesmo resultado, gastando mais. Reabre com um par que mostre ganho | 2026-10-15 |
| graft | não | **Relato do fornecedor, não medição:** mapa do código consultado em toda busca do agente (visto num reel em 21/10: −42% tokens, −46% chamadas, −60% tempo, números do próprio projeto, sem tarefa nem modelo de comparação). Repositório e forma de carregar (MCP, hook ou CLI) não confirmados. É a pergunta da [US-43](Planejamento/Manutencao/ferramentas-opcionais/adaptadores/US-43-grafo-rota-de-busca/Sobre.md) (cancelada 15/10) e bate na decisão "consulta, nunca hook". Reabre a US-43 com um caso real em que o Grep errou o "onde está X", ou com um par medido no molde da US-48 | 2026-10-21 |

ecc fora: build-error-resolver, code-reviewer, typescript-reviewer

## Movido do `AGENTS.md` (US-51, 15/10/2026)

> O `AGENTS.md` carrega em toda sessão; este trecho só é lido quando o assunto aparece.

**Ponytail** (confiança **baixa** — plugin instalado e README lido, não medido): escada de simplicidade que faz o agente parar no primeiro degrau que resolve (não existir → reutilizar → stdlib → …). Vale para quem **implementa**. Ele **não substitui**: os invariantes do `AGENTS.md`, o `tl` lendo diff, o `po` questionando requisito, nem o `teste.mjs` — o "um check" dele é o piso, não o teto. Quais papéis o carregam: `.claude/agents/README.md`. Ativo nesta máquina = `~/.claude/.ponytail-active`; instalado sem ativo não faz nada.

**Graphify** instala-se à parte (`uv tool install graphifyy`); **não** é dependência npm, o `package.json` continua sem `dependencies`. Neste repo é obrigatório na triagem — regra completa em `Contexto/Fluxos/delegacao.md`.
