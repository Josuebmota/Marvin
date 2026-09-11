---
description: Retoma o trabalho a partir do estado corrente registrado — a porta de entrada do projeto
---

Retome o trabalho neste projeto.

1. Leia `.marvin/Memoria/onde_paramos.md` — é a **única**
   porta de entrada, sempre atualizada. Se não existir, leia o `MEMORY.md` e diga que a
   nota canônica está faltando.
   Ela é uma lista de ponteiros: **siga o link** de cada US ativa e leia o `Sobre.md` dela —
   o estado e o Rumo moram lá, não na nota. Não abra o resto da base sem necessidade.

2. Confira o estado real antes de confiar no registro: `git log --oneline -3` e
   `git status --short` nos repositórios que importam. Se o registro disser que algo foi
   corrigido, confirme no código.

3. Me diga, em no máximo 10 linhas:
   - **onde paramos** (uma frase)
   - **o próximo passo** e qual papel do time faz
   - **o que está travado** e por quê
   - se o registro divergir do código, **diga a divergência** — não escolha em silêncio

Não comece a trabalhar. Espere eu confirmar por onde ir.

$ARGUMENTS

---

## Ao fechar — quando sugerir um chat novo

Contexto acumulado custa em **toda** requisição, não uma vez só. Conversa longa que já
mudou de assunto carrega peso morto pelo resto da sessão.

**Sugira chat novo quando as três forem verdade:** o assunto mudou; a sessão já está longa;
e o estado **está registrado** em `onde_paramos.md` — sem isso o chat novo começa cego.

**Não sugira** quando o trabalho novo depende de algo descoberto agora e ainda não escrito,
quando está no meio de algo (correção feita, falta validar), ou quando a sessão é curta —
recomeçar custa mais do que continuar, porque o contexto fixo recarrega inteiro.

**A regra que fecha:** registrar **antes** de sugerir. Sugerir chat novo com estado não
salvo transfere para a próxima sessão o trabalho de redescobrir, que é o custo que se
queria evitar. Ao sugerir, diga o que já está salvo e qual seria a primeira frase do
chat novo.
