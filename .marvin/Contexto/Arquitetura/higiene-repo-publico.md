# Higiene de repositório público

> O checkup de 03/08/2026 e a lição de varrer as três camadas do git, não só os arquivos.
> Movido de `onde_paramos.md` em 09/09/2026, quando a nota passou do teto e o próprio
> marvin a acusou. O regime aqui é outro: **acrescenta, nunca sobrescreve.**

Um checkup em 03/08 varreu os 32 commits atrás de nome de empregador e de cliente. Os nomes
**não estavam em lugar nenhum**. O que estava:

1. **Um nome de campo de um repositório de cliente**, citado como exemplo num comentário do
   `marvin.mjs`. Estava no arquivo atual **e no pacote npm publicado**.
2. **Uma mensagem de commit nomeava o projeto do cliente** ao explicar onde o bug apareceu.
3. O caminho pessoal da pasta de trabalho, literal, em 12 commits — já corrigido nos
   arquivos, mas vivo no histórico.

**A lição que não era óbvia: `git grep` no working tree não vê mensagem de commit.** A
auditoria pré-publicação passou justamente por olhar só os arquivos. Quem revisa repositório
público precisa varrer as três camadas — conteúdo dos blobs, **mensagens de commit** e nomes
de arquivo que já existiram.

O histórico foi **esmagado num commit único** em vez de reescrito padrão a padrão: reescrever
depende de eu acertar todos os padrões, esmagar não depende de acertar nada. O custo foi
perder o registro da evolução — que é exatamente o tipo de memória que este projeto defende,
e por isso a decisão está anotada aqui, onde ela sobrevive ao `git log` que deixou de existir.

**Antes de qualquer commit aqui, o exemplo tem que ser sintético.** "Visto num repo real" é
uma boa história; o campo real do cliente não pode vir junto.
