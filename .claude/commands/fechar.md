---
description: Fecha a sessão — registra o Rumo da US, atualiza a nota, confere a árvore, e diz se é hora de um chat novo
---

Feche a sessão. O par do `/retomar`: nada do que foi descoberto hoje pode ficar só na conversa.

1. `git status --short` e `git log --oneline -3`. Arquivo novo sem justificativa → me pergunte.

2. Para cada US que mexemos hoje (as da seção *Em andamento* de
   `.marvin/Memoria/onde_paramos.md`): uma entrada no **Rumo** do `Sobre.md`
   dela, datada, com o que se viu e o que se decidiu — e o que foi descartado, se houve. Concluiu
   e foi validada? *Evidência* preenchida, `estado: concluida`, linha em `.marvin/Releases/<versao>.md`,
   e **sai da nota**.

3. Reescreva a linha de cada US na nota: **o próximo passo numa frase**. A nota é lista de
   ponteiros — **não** escreva relato nela; o relato acabou de ir para o Rumo.

4. Armadilha nova que um papel sofreu hoje → o `.md` daquele agente em `.claude/agents/`,
   acrescentando. Procedimento que rodou pela **segunda** vez → skill.

5. Rode `marvin --status` e me mostre. Se acusar algo, conserte antes de fechar.

6. Diga se é hora de um chat novo — a regra está no rodapé do `/retomar` — e, se for, **qual
   seria a primeira frase** dele.

$ARGUMENTS
