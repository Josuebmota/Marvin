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
     mais a camada da atividade (design, dba, sec, infra) se ela pede. Escreva em *Time* como
     a tabela `| etapa | papel | modelo · esforço | motivo | estado |`, uma linha por etapa: modelo e esforço
     partem do glossário (`.marvin/Contexto/Equipe.md`), no degrau mais barato que serve; subir exige
     motivo; quem decide (`tl`/`po`) não é quem executa. Etapa sem modelo trava a execução.
     Para cada etapa, o refino escolhe o agente, a skill (se houver), o modelo e o esforço — o menor custo que entrega o mesmo resultado (`agente · skill` na coluna papel).
     Fluxo e risco em `.marvin/Contexto/Fluxos/delegacao.md`; o `tl` entra por risco (15/10), não sempre.
   - **Propor skills**: procedimento que a US vai repetir vai em *Skills* como proposta.
   - **Escolher capacidades**: consulte `.marvin/Contexto/IA.md` e o inventário local;
     registre modelo/integração/esforço solicitado e aplicado, sem fornecedor fixo.
   - **Por quê** e **Pronto quando** — se eu não disse, pergunte; não invente.
   - Com o *Código tocado* preenchido, rode `marvin --us <caminho>` **de novo**: o grafo escreve a
     seção *Impacto* — quem depende do que a US toca, e que outras US passam por ali.
   - **Passo de estrutura — grafo obrigatório (dono, 15/10/2026).** Antes de decidir, para cada
     símbolo do *Código tocado*: se `graphify-out/graph.json` for mais velho que o último commit,
     rode `graphify update .`; depois `graphify affected "<símbolo>"` e `graphify explain "<símbolo>"`.
     Registre no *Time* uma linha por símbolo com o que o grafo respondeu, ou "sem nó" / "grafo velho"
     e o fallback usado. Grep/Glob só para **localizar** arquivo ou símbolo.

3. Me mostre o `Sobre.md` preenchido e a linha da nota. **Não comece a implementar.**

**Precisa de agente ou skill que o projeto não tem? Procure primeiro no ECC** (`<ecc>/agents`,
`<ecc>/skills`; `<ecc>` = `~/.claude/plugins/marketplaces/ecc`) e instale só aquele, copiando o
arquivo (receita no glossário `.marvin/Contexto/Equipe.md`); depois ajuste `model`/`effort` pela
tabela. Só escreva do zero se o ECC não tiver.
