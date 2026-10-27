---
pai: ../delegacao.md
---
## Disponibilidade na instalação — implementação autorizada em 06/10/2026

↩ [Fluxo delegação](../delegacao.md)


O script pergunta a ferramenta da sessão, quais IAs o usuário tem e se estão configuradas
nela. Distingue assinatura no cliente oficial, API e execução local; declarado,
configurado e testado não são equivalentes. Credenciais ficam no mecanismo local
da ferramenta, fora da base pública. Registrar a escolha uma vez, sem repetir
perguntas ou sobrescrever configuração existente. O inventário fica em
`<vault>/.local/disponibilidade.json`, com ignore específico para esse arquivo.
Sem TTY ou com `--no-questions`, não cria inventário sem declaração; ausência é não
informado. `--executor` e `--ai=id:acesso:configurado` permitem declaração por flags;
`--ai=none` registra nenhum acesso. Dry-run não pergunta; flags entram só no plano.

Claude Code é uma opção de executor. Codex e OpenCode já usam `AGENTS.md`; seus
adaptadores mantêm a mesma política e base. `--tools` escolhe adaptadores, não conecta
fornecedores. Verificar o meio efetivo de delegação antes de prometer execução em
outro provedor; skill instalada não prova acesso nem subagente nativo. Sem integração,
orientar a configuração e usar as capacidades prontas. Os cenários uma/todas,
outro executor, sem perguntas, dry-run e idempotência são cobertos na suíte hermética.
