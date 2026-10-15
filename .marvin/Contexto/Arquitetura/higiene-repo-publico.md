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

## Movido do `AGENTS.md` (US-51, 15/10/2026)

> O `AGENTS.md` carrega em toda sessão; este trecho só é lido quando o assunto aparece.

A memória deste repo é versionada e pública: `.marvin/Memoria/onde_paramos.md` está no git.
- **Escreva a memória como se fosse lida**, porque é. O que for de outro projeto vai na memória daquele projeto, não aqui.
- Ela é o **exemplo** de um `onde_paramos.md` preenchido — provavelmente a coisa mais útil do repositório para quem está tentando entender o formato.
- E o `/retomar` funciona num clone. Enquanto a memória esteve no `.gitignore`, o primeiro comando de quem clonasse apontava para um arquivo inexistente.
- Num projeto privado — o caso de uso normal — a memória guarda decisão de produto e id de cliente, e é por isso que o script avisa **"repo PRIVADO, sempre"**. Aqui o conteúdo é sobre uma ferramenta pública, então não há o que proteger.
