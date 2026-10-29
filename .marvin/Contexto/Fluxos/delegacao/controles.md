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
- **Revisão pelo GPT, opcional** (dono, 29/10/2026, depois dos 2 pares da
  [US-72](../../../Planejamento/Novos/time/roteamento/US-72-gpt-na-equipe/Sobre.md)): segunda leitura
  de um diff, quando o Codex estiver disponível e a cota sobrar. Não substitui o `qa` nem o `tl`:
  nos 2 pares, trouxe 1 achado único, não bloqueante, e nenhum dos dois revisores pegou o erro de escopo.
  `codex exec -C <repo> -s read-only "<pedido>" < /dev/null > <arquivo>` — só leitura, stdin
  fechado (sem ele o comando espera), em segundo plano, com 40 a 70 mil tokens da cota por diff.
  O pedido é o mesmo do `qa`: diff, *Pronto quando*, *Não entra* e AGENTS.md. Diga para ignorar
  Rumo e Evidência; mesmo assim, no par 2 ele leu o Rumo. O achado vai para o `tl` junto com os do `qa`.
- Outros fornecedores: conferir sob demanda a combinação efetivamente escolhida.
  Uma fonte oficial prova suporte documentado; aplicação exige evidência da execução.
