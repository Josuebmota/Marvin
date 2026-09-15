---
name: ferramentas
description: Ferramentas opcionais que ESTE projeto usa — e o que cada uma alcança
tags: [referencia]
---
# Ferramentas opcionais

Registro de "este projeto usa X". O `marvin` pergunta uma vez e escreve aqui; para
mudar, edite a coluna **usa** ou rode `marvin --use=<ferramenta>`. **Alcance** diz
quem consegue ler o que a ferramenta produz — nem tudo é de todo agente.

| ferramenta | usa | alcance | data |
|---|---|---|---|
| graphify | sim | saída JSON/markdown em graphify-out/ — qualquer agente lê; só o hook é do Claude, e não é usado | 2026-09-15 |
| ponytail | sim | escada de simplicidade para quem IMPLEMENTA — plugin com hooks no Claude Code/Codex/Copilot CLI (install próprio em cada um; aqui só o do Claude é detectado). Confiança baixa: não medido | 2026-09-15 |
