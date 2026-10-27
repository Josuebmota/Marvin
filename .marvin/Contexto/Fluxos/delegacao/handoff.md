---
pai: ../delegacao.md
---
## Handoff entre executores — proposta da US-20, 07/10/2026

↩ [Fluxo delegação](../delegacao.md)


Quando o executor para no meio da atividade (cota), outro modelo ou ferramenta assume
**a pedido da pessoa**: ela abre a nova sessão, nada troca sozinho. O que vale em
qualquer ferramenta, sem depender de comando de uma delas (o `/retomar` é do Claude Code):

**Pré-condição.** O *Time* da US traz o estado de cada etapa (`pendente`, `em andamento`,
`feita` com evidência), atualizado ao fechar a etapa. O executor que parou já não escreve.

**Primeira instrução da nova sessão:** ler `AGENTS.md`, `.marvin/Memoria/onde_paramos.md`
e o `Sobre.md` da US ativa, e seguir este handoff.

1. **Ler o estado, não o relato.** Conferir o que consta como `feita` pelo `git diff`
   e pelo check do risco da etapa; o que o anterior disse ter feito não é prova.
2. **Manter papel e capacidade** de cada etapa restante. São o requisito da atividade.
3. **Refazer só modelo, ferramenta e esforço**, entre os acessos disponíveis, pelo
   glossário. Nome de esforço igual não prova equivalência; controle ausente é
   limitação explícita.
4. **Capacidade sem substituto é lacuna**, não troca por outra: não trocar vídeo por
   texto, nem reiniciar uma geração pendente sem conferir seu estado.
5. **Sem opção elegível**, a etapa fica `pendente` e a pessoa é informada.
6. **Registrar no *Rumo***: origem, destino, motivo (cota), o de-para por etapa e o
   resultado da verificação; atualizar o *Time* com o novo modelo e o estado.
7. **Voltar ao executor original** repete os mesmos passos.

Fora do escopo: detectar a cota restante (as ferramentas não expõem de forma
confiável), qualquer troca sem humano e gateway para modelo não-Claude, que a
documentação do Claude Code não suporta.
