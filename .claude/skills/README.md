# Skills deste projeto

Uma pasta por skill, com `SKILL.md` dentro:

```
.claude/skills/
└── medir-invariante/
    └── SKILL.md
```

```yaml
---
name: medir-invariante
description: quando invocar — é ISTO que decide se a skill entra em cena
---
```

## Skill, agente ou command? O discriminador

|  | Onde o texto carrega | Quem usa |
|---|---|---|
| **Agente** | contexto **próprio e limpo** | spawnado, isolado |
| **Skill** | contexto **atual** | quem invoca |
| **Command** | contexto atual | **tu** dispara |

> **Fato que o subagente precisa saber** → no `.md` do agente.
> **Procedimento que 2+ papéis executam, ou que o loop principal executa sem spawnar** → skill.
> **Coisa que tu dispara** → command.

## A pegadinha que muda o desenho

**Subagente nasce com contexto limpo.** Ele não lê `AGENTS.md`, não lê `CLAUDE.md`,
e não lê skill nenhuma — a menos que tenha a tool `Skill` na lista dele.

Consequência: **repetir um fato crítico dentro do `.md` de cada agente que precisa dele
não é descuido, é a única forma.** O que não deve ser repetido é *procedimento* — isso
vira skill.

Se quiser que um agente invoque skill, acrescente `Skill` ao `tools:` dele. Sem isso,
a skill só serve ao loop principal.

## Custo

A **descrição** de toda skill carrega em toda sessão. Três skills de projeto é barato;
trinta vira o problema que a skill deveria resolver.

**Regra:** skill nova só depois do procedimento ter sido executado **duas vezes**.
Antes disso é especulação, e especulação vira contexto morto.

## Portabilidade

O formato `SKILL.md` é do Claude Code. O **corpo** (o procedimento em si) é markdown
puro e migra por copiar e colar — igual à persona dos agentes.
