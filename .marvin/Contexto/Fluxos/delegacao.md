# Fluxo delegação

Como uma tarefa sai da sessão principal e chega a um papel. Hoje o modelo é fixo por papel
(`model:` no frontmatter do `.claude/agents/<papel>.md`) e ninguém decide esforço: a escolha
acontece uma vez, na hora de escrever o agente, e não por tarefa.

## Passos
1. A sessão principal lê o pedido e escolhe o papel — critério: o `description` do agente
2. O subagente roda no `model:` do frontmatter (a chamada pode sobrescrever o modelo, não o esforço)
3. Verificação — `teste.mjs`, e o `tl` lendo o diff quando a mudança escreve no disco
4. O resultado volta para a sessão principal; nada registra se o modelo era o certo

## Regras que não podem quebrar
- Subagente não tem memória: o `.md` dele é a memória dele (`.claude/agents/README.md`)
- `haiku` só para recuperação delimitada — erra onde precisa segurar invariante
- O `tl` que lê diff fica em opus

## Onde o template nasce
- `marvin.mjs` — passo 7 (`.claude/agents/README.md`, seção *Modelo por papel*)
- `marvin.mjs` — passo 7c (`CLAUDE.md` gerado, tabela *Modelo por papel*)

## US que passaram por aqui
- [US-19](../../Planejamento/Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md)
