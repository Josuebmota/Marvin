---
pai: ../delegacao.md
---
## Movido do `AGENTS.md` (US-51, 15/10/2026)

↩ [Fluxo delegação](../delegacao.md)


> O `AGENTS.md` carrega em toda sessão; este trecho só é lido quando o assunto aparece.

**Antes de qualquer US, a passada do `AGENTS.md` gerado vale neste repo também:** mapear o que a atividade toca, propor o time dela (num projeto de uma pessoa, `tl` + `dev-back` + `qa` + `scout` bastam; `po` é o dono), propor as skills que ela vai repetir, registrar na seção *Time* e *Skills* da US. O glossário da equipe é `.marvin/Contexto/Equipe.md` (US-44).

Na triagem do `tl` com o `po`, declare a Disponibilidade de IA para a etapa: fornecedor, modelo, ferramenta e esforço são escolhas por atividade entre acessos elegíveis. Declaração não prova acesso; registre como não confirmado quando não houver evidência observável.

No piloto local da US-19, decomponha atividade/domínio, escolha papéis e skills e consulte capacidades sob demanda. Escolha e registre fornecedor/modelo, ferramenta, esforço e motivo por etapa entre acessos elegíveis, sem marca fixa. Esforço menor nunca reduz a verificação dos invariantes.

**A sessão principal coordena e delega:** etapa de implementação, revisão ou pesquisa vai para o papel adequado; passa pelo `tl` antes de fechar a mudança que toca invariante, escreve no disco de alguém ou mexe em `UPDATES`/`--release`; mudança pequena, só de exibição e com aceite independente fecha com `qa`/aceite (dono, 15/10/2026, medido na US-54: o `tl` dobrou o custo sem achar nada; na US-50 achou um bloqueio real — o risco decide). Não delegue leitura ou correção trivial cujo contexto custaria mais que a tarefa (passo 1). Subagente só delega se o papel listar `Agent` em `tools` no frontmatter (a plataforma permite até 3 camadas); hoje `po` e `tl` listam (desde 08/10/2026) e podem chamar um papel de apoio para uma leitura delimitada; dev, qa e demais papéis só ganham `Agent` se a etapa pedir.

**Graphify neste repo é obrigatório na triagem** (dono, 08/10/2026; nos projetos que o Marvin monta continua opcional): o `tl` e o `po` partem do grafo (*Impacto* e ilhas da US) para decidir quem toca. Grafo ausente ou velho vira registro explícito no *Time*, nunca omissão. Para localizar arquivo ou símbolo, Grep/Glob é mais barato.

**Agente ou skill novo parte de um catálogo, não de folha em branco** (dono, 15/10/2026; medido na US-48). Quando um papel ganha arquivo, o `tl` e o `po` olham o agente correspondente do ECC (`~/.claude/plugins/marketplaces/ecc/agents/` ou o repositório público; ex. `csharp-reviewer` para um `dev-back` C#, `database-reviewer` para o `dba`); quando um procedimento vira skill, as skills do Superpowers (`verification-before-completion`, `systematic-debugging`, `writing-skills`). Adaptam modelo e esforço ao glossário, acrescentam a armadilha concreta que justifica o arquivo e citam a origem (MIT). Nunca instalam o pacote inteiro: medido, custa ~2k tk por sessão e, no Superpowers, +31% na mesma tarefa.
