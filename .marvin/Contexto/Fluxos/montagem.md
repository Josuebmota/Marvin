# Fluxo montagem

O run padrão do `marvin` sem flag: lê o repositório, escreve a base em `.marvin/`, a
junction de memória, os adaptadores por ferramenta (`--tools=`) e o `AGENTS.md`. Toda
escrita passa por `fsw`/`exec` (dry-run honesto) e é guardada por `existsSync` (idempotente).

## Passos
1. stack — `marvin.mjs` — passo 1 (`poe`, `temNaRaiz`)
2. base de conhecimento — `marvin.mjs` — passo 5 (`escreverSeFaltar`)
3. memória — `marvin.mjs` — passo 6
4. `.claude/agents` e `.claude/skills` — `marvin.mjs` — passos 7 e 7a (só README; o corpo é do humano)
5. porta de entrada e hook SessionStart — `marvin.mjs` — passo 7b
6. fonte única + adaptadores — `marvin.mjs` — passo 7c (aqui nasce o `AGENTS.md`)
7. grafo de código — `marvin.mjs` — passo 8b (só com `--graphify`)
8. atualizações desde a montagem — `marvin.mjs` — passo 10 (`ATUALIZACOES`)

## Regras que não podem quebrar
- Sem stdin (CI, `npx` em pipe) o run não pode travar esperando resposta.
- Ferramenta externa ausente é aviso, nunca falha silenciosa (invariante 3).
- Seção nova no `AGENTS.md` gerado precisa de marca em `ATUALIZACOES`.

## US que passaram por aqui
- [US-11](../../Planejamento/Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md)
