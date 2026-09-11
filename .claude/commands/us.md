---
description: Abre uma US — cria o Sobre.md, aponta na nota, e faz a passada de mapear, time e skills
---

Abra a US **$ARGUMENTS** neste projeto. O caminho é `Novos|Manutencao/<Epic>/<Feature>/<US-nome>`;
se eu passei só o nome, pergunte em qual Epic e Feature ela entra (liste os que existem em
`.marvin/Planejamento/`) antes de criar qualquer coisa.

1. Rode `marvin --us <caminho>`. Ele cria a cadeia de `Sobre.md` que faltar e põe a linha em
   `.marvin/Memoria/onde_paramos.md`. Se `marvin` não estiver no PATH:
   `npx marvin-kb --us <caminho>`.

2. A passada que a regra pede — está em `.marvin/Planejamento/README.md`, leia antes:
   - **Mapear** o que a US toca: fluxo, arquitetura, código. Fluxo que ainda não tem nota em
     `.marvin/Contexto/Fluxos/` ganha uma agora. Preencha *Fluxos ligados* e *Código tocado*
     (crase com o caminho, e a função depois de um traço — é o que liga a US ao grafo).
   - **Propor o time** desta US, a partir da base do `AGENTS.md`: só os papéis que ela usa,
     mais a camada da atividade (design, dba, sec, infra) se ela pede. Escreva em *Time*.
   - **Propor skills**: procedimento que a US vai repetir vai em *Skills* como proposta.
   - **Por quê** e **Pronto quando** — se eu não disse, pergunte; não invente.

3. Me mostre o `Sobre.md` preenchido e a linha da nota. **Não comece a implementar.**
