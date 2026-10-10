---
name: ferramentas
description: Ferramentas opcionais que ESTE projeto usa — e o que cada uma alcança
tags: [referencia]
marvin_montado: "< 2.2.0"
marvin: 2.2.0
---
# Ferramentas opcionais

Registro de "este projeto usa X". O `marvin` pergunta uma vez e escreve aqui; para
mudar, edite a coluna **usa** ou rode `marvin --use=<ferramenta>`. **Alcance** diz
quem consegue ler o que a ferramenta produz — nem tudo é de todo agente.

**Versionar o derivado:** por padrão o grafo (`graphify-out/`) e a página de status
(`.marvin/.status/`) vão para o `.gitignore`. Para versioná-los, rode
`marvin --track=grafo,status` (ou `--untrack=` para voltar): a escolha fica na linha
`versiona:` do cabeçalho deste arquivo e o `marvin` passa a ler dela. Linha que já está no
`.gitignore` o `marvin` avisa, nunca remove.

| ferramenta | usa | alcance | data |
|---|---|---|---|
| graphify | sim | saída JSON/markdown em graphify-out/ — qualquer agente lê; só o hook é do Claude, e não é usado. **Neste repo, obrigatório na triagem desde 2026-10-08.** Instalação à parte (`uv tool install graphifyy`), não é npm. Ausente na sessão em nuvem: aí a triagem registra "grafo ausente" | 2026-09-15 |
| ponytail | sim | escada de simplicidade para quem IMPLEMENTA — plugin com hooks no Claude Code/Codex/Copilot CLI (install próprio em cada um; aqui só o do Claude é detectado). Confiança baixa: não medido | 2026-09-15 |
