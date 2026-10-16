---
description: Retoma o trabalho a partir do estado corrente registrado — a porta de entrada do projeto
---

Retome o trabalho neste projeto.

Se o resumo de abertura disser `base desatualizada`, rode o `marvin` neste projeto
(`npx marvin-kb --no-questions`; de dentro do clone do Marvin, `node marvin.mjs --no-questions`)
ANTES de oferecer as portas, e diga em até 3 linhas o que entrou (agentes/skills do ECC, seções,
carimbo). Não commite por isso à parte: entra no commit da sessão. Nunca push.

1. Leia `.marvin/Memoria/onde_paramos.md` — é a **única**
   porta de entrada, sempre atualizada. Se não existir, leia o `MEMORY.md` e diga que a
   nota canônica está faltando.
   Ela é uma lista de ponteiros: **siga o link** de cada US ativa e leia o `Sobre.md` dela —
   o estado e o Rumo moram lá, não na nota. Não abra o resto da base sem necessidade.

2. Confira o estado real antes de confiar no registro: `git log --oneline -3` e
   `git status --short` nos repositórios que importam. Se o registro disser que algo foi
   corrigido, confirme no código.
   Para a US da vez, faça o **passo de estrutura — grafo obrigatório neste repo** (dono, 15/10/2026):
   para cada símbolo do *Código tocado*, se `graphify-out/graph.json` for mais velho que o último
   commit, rode `graphify update .`; depois `graphify affected "<símbolo>"` e
   `graphify explain "<símbolo>"`. Registre no *Time* uma linha por símbolo com o que o grafo
   respondeu, ou "sem nó" / "grafo velho" e o fallback usado (Grep/Glob só para **localizar**).
   Diga em uma linha se o grafo estava fresco.

3. Me diga, em no máximo 10 linhas:
   - **onde paramos** (uma frase)
   - **o próximo passo** e qual papel do time faz
   - **o que está travado** e por quê
   - se o registro divergir do código, **diga a divergência** — não escolha em silêncio

4. As **duas portas** — em palavras, não em número de US. O hook já imprimiu as ilhas
   (`marvin --status` mostra todas): grupos de US refinadas que tocam o mesmo arquivo.
   - **Desenvolver** — a ilha da vez (a que tem US ativa; senão a primeira) e as US dela, em
     ordem. Uma ilha por vez, uma sessão de desenvolvimento por vez: sem branch nem worktree
     por ilha. Ao pegar uma US `refinada`: `estado: ativa` no Sobre.md e `marvin --us <caminho>`
     para o ponteiro na nota. Cada etapa roda no modelo da sua linha do *Time*: delegue ao subagente
     do papel passando `model` e `effort` da linha na chamada — isso vale mais que o arquivo do papel
     e que o modelo da sessão. Etapa sem linha com modelo é trava: não executa; registre "refinar: falta
     o modelo por etapa" e proponha o `/refinar` dela.
     Delegue ao agente da linha com a skill da linha, passando `model` e `effort` na chamada.
   - **Refinar** — anotações sem US (as linhas ⚪ da nota): `/refinar`. Pode correr ao lado de
     um chat de desenvolvimento — escreve em arquivos diferentes.
   Pergunte: **"qual? (1 ou 2)"**.

Não comece a trabalhar. Espere eu confirmar por onde ir.

$ARGUMENTS

---

## Ao fechar — quando sugerir um chat novo

Contexto acumulado custa em **toda** requisição, não só uma vez. Conversa longa que já
mudou de assunto carrega peso morto no resto da sessão inteira.

**Sugira um chat novo quando as três forem verdade:**

1. O assunto mudou — outra tarefa, outro subsistema, outro projeto
2. A sessão já está longa
3. **O estado está registrado** em `onde_paramos.md` — sem isso, o chat novo começa cego

**NÃO sugira quando:** o trabalho novo depende de algo descoberto agora e **ainda não
escrito**; está no meio de algo (correção feita, falta validar); a sessão é curta — recomeçar
custa mais do que continuar, porque o contexto fixo recarrega inteiro.

**A regra que fecha:** registrar **antes** de sugerir. Ao sugerir, diga **o que já está salvo**
e **qual seria a primeira frase** do chat novo.
