---
pai: ../delegacao.md
---
## Controles e limites — conferidos em 05/10/2026

↩ [Fluxo delegação](../delegacao.md)


- [Claude Code](https://code.claude.com/docs/en/sub-agents): `model` por chamada;
  `effort` no frontmatter, com herança da sessão quando omitido. `effort` por invocação
  exige Claude Code v2.1.292+ (fonte revista em 09/10/2026). Conferir versão e
  configuração aplicada; herança é fallback local, não regra universal.
- [Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents): spawn aceita
  modelo/esforço; sem configuração, herda do pai. Modelo escolhido pelo spawn ou
  default sem esforço configurado usa o default do modelo. O TOML customizado
  prevalece nos campos que define; se só define modelo, preserva o esforço resolvido
  antes. Conferir a precedência e a compatibilidade efetivas.
  Nesta sessão, o esquema `collaboration.spawn_agent` com `fork_turns: all` herda
  modelo/esforço e não aceita overrides nessa forma; é limite desta chamada.
- Outros fornecedores: conferir sob demanda a combinação efetivamente escolhida.
  Uma fonte oficial prova suporte documentado; aplicação exige evidência da execução.
