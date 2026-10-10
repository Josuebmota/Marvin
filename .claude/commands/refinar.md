---
description: Sessão de refino — eu + tl + po transformam anotações (print, frase, bug) em US refinada, com Pronto quando e Código tocado, na fila; nada de código
---

Sessão de **refino**. Aqui não se implementa: a saída é US com `estado: refinada`, na fila.
Entrada: **$ARGUMENTS** (uma anotação, um print, uma linha ⚪ de
`.marvin/Memoria/onde_paramos.md`, ou "tudo que está ⚪").

1. Leia a nota (as linhas ⚪ e as anotações sem US) e `marvin --status` (a fila e as ilhas que
   já existem). Se um chat de desenvolvimento estiver aberto, ele escreve só a linha da US
   dele na nota — você escreve só as suas. **Releia antes de salvar.**

2. Para cada anotação, o **crivo `tl` + `po` em paralelo**:
   - `tl`: causa com arquivo:linha (ler o código, não chutar) · risco (dado, invariante) ou zero ·
     manutenção ou nova · escopo mínimo e o que NÃO entra · tamanho (1 chat / dividir).
   - `po`: o que eu quero, nas minhas palavras · critério de aceite verificável · em que Epic e
     Feature entra (existente ou nova, e por quê) · o que funde com o quê · ordem.
   Onde os dois discordarem, me traga a divergência — não escolha em silêncio.

3. Com os dois pareceres: `marvin --us <caminho> --refinada` (a US nasce na fila, fora da nota)
   e preencha o `Sobre.md`: **Por quê** · **Pronto quando** · **Não entra** · **Código tocado**
   (o arquivo:linha do `tl` é isto — é o que define a ilha) · **Time**. Depois
   `marvin --us <caminho>` de novo: o *Impacto* sai do grafo, se houver.

4. Pergunta que só eu respondo fica na US como `❓` — não invente a resposta.

5. Me mostre, em uma tabela: US · ilha (o `marvin --status` diz) · o que bloqueia. **Não comece
   a implementar** — desenvolver é outro chat: `/retomar` e a porta 1.
