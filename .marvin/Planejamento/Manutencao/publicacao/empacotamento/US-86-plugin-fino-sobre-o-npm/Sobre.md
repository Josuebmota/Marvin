---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-86-plugin-fino-sobre-o-npm
description: "Anotação: plugin fino do Claude Code por cima do npm (comandos genéricos, hooks de trava, aviso na abertura), com o marvin.mjs seguindo como motor sem dependencies. Reabre a pergunta da US-53 com dois problemas: templates que não se atualizam e conselho que não vira trava."
---
# US-86 — plugin fino sobre o npm

**Por quê:** a [US-53](../US-53-marvin-como-plugin/Sobre.md) foi cancelada em 15/10/2026 pela régua "reabre com problema medido". Em 27/10 apareceram dois — um caso cada, ainda **não medidos** (a régua só fica cumprida depois do esboço do Pronto quando):
1. **Templates que não se atualizam.** O `.claude/commands/refinar.md` deste repositório não recebeu o texto da US-81: o script não reescreve arquivo existente (`existsSync`) e só avisa pela tabela `UPDATES`, mantida à mão — armadilha já listada no AGENTS.md ("já falhou uma vez"). O texto foi colado à mão. Não reescrever é o invariante 2 funcionando (o arquivo pode ter edição do usuário); o argumento do plugin é que o comando genérico passa a ser arquivo **do plugin**, que se atualiza com ele, e não do projeto.
2. **Conselho não vira trava.** A pergunta do dono (27/10): "como eu sei que a LLM está seguindo o Marvin a todo momento?". O `--status` mede papel, modelo e custo pelas transcrições (US-41, 64, 65), mas não mede os rituais (teste antes do commit, `tl` depois da última edição, consulta ao grafo); na mesma sessão, um `graphify update .` solto apagou os nós da base no grafo e só foi notado na conferência seguinte. O hook que o script já escreve (`SessionStart`, `marvin.mjs:4250`) avisa; trava seria `PreToolUse`/`Stop`.

**Desenho em discussão (não decidido):** o plugin leva o genérico — `/retomar`, `/refinar`, `/fechar`, hooks de trava, aviso na abertura; o `marvin.mjs` no npm continua o motor e escreve a base do projeto (memória, grafo das US, agentes com armadilha do código — invariante 4). Dependências obrigatórias viram **checagem que falha alto**, não pacote puxado: ECC como dependência traria de volta a carga global medida (74,8k, Fase 0 da US-50) e contraria "o que é global é pago em toda sessão"; graphify é Python e instalá-lo sem flag fere a US-50 e o invariante 1.

**Pronto quando:** _(a refinar)_ — esboço: antes de decidir, medir quantas marcas de `UPDATES` ficam pendentes em projetos reais (Parci e outros); se for frequente, o plugin se paga. Conferir no formato de plugin atual se há dependência declarada e escopo por projeto (`enabledPlugins`) — invariante 3, convenção muda rápido.

**Não entra (provisório):** trocar o npm pelo plugin; dependência do ECC inteiro; instalar graphify sem flag.

## Perguntas
- ~~❓ 1. Antes de medir as marcas pendentes nos projetos reais, vale abrir a parte das travas por hook (que não precisa de plugin — o script já escreve hooks no `.claude/settings.json`) como US própria?~~ → sim (dono, 29/10/2026): [US-88](../../../../Novos/time/orquestracao/US-88-travas-por-hook/Sobre.md). Esta fica só com o empacotamento.

## Fluxos ligados
- [decisoes-fechadas.md](../../../../../Contexto/Arquitetura/decisoes-fechadas.md) — "O Marvin é o único plugin do Claude e o curador das ferramentas, por projeto" (15/10/2026)
- [publicacao-no-npm.md](../../../../../Contexto/Arquitetura/publicacao-no-npm.md)

## Código tocado
_(a refinar)_

## Time
_(a refinar — `/refinar` com `tl` e `po`)_

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|

## Skills
_(a refinar)_

## Rumo
- **27/10/2026** — anotada a pedido do dono, depois da conversa "e se o Marvin fosse plugin, com dependências obrigatórias?". Reabre a pergunta da [US-53](../US-53-marvin-como-plugin/Sobre.md) (cancelada à espera de problema medido) com os dois problemas acima.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
