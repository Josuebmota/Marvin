---
description: Sessão de refino — eu + tl + po transformam anotações (print, frase, bug) em US refinada, com Pronto quando e Código tocado, na fila; nada de código
---

Sessão de **refino**. Aqui não se implementa: a saída é US com `estado: refinada`, na fila.
Entrada: **$ARGUMENTS** (uma anotação, um print, uma linha ⚪ de
`.marvin/Memoria/onde_paramos.md`, ou "tudo que está ⚪").

**Entrada = US que já existe (um id, um caminho, ou "sem modelo") → só a triagem de custo.**
Não refaça *Por quê*, *Pronto quando* nem *Código tocado*: preencha só a tabela do *Time*
(`| etapa | papel | modelo · esforço | motivo | estado |`) pelo glossário da equipe, partindo do
degrau mais barato que serve; subir exige motivo. "sem modelo" = as US que o `marvin --status`
lista sem modelo por etapa — **em lote, só as da próxima ilha** (refinar a fila inteira de uma
vez gasta mais do que economiza). É trabalho de tabela: faça na sessão, sem `tl`+`po`, e
confira com `marvin --status` que elas saíram da contagem.
Para cada etapa, o refino escolhe o agente, a skill (se houver), o modelo e o esforço — o menor custo que entrega o mesmo resultado (`agente · skill` na coluna papel).

1. Leia a nota (as linhas ⚪ e as anotações sem US) e `marvin --status` (a fila e as ilhas que
   já existem). Se um chat de desenvolvimento estiver aberto, ele escreve só a linha da US
   dele na nota — você escreve só as suas. **Releia antes de salvar.**

2. Para cada anotação, o **crivo `tl` + `po` em paralelo**:
   - `tl`: causa com arquivo:linha (ler o código, não chutar) · risco (dado, invariante) ou zero ·
     manutenção ou nova · escopo mínimo e o que NÃO entra · tamanho (1 chat / dividir).
   - `po`: o que eu quero, nas minhas palavras · critério de aceite verificável · em que Epic e
     Feature entra (existente ou nova, e por quê) · o que funde com o quê · ordem.
   Os dois partem do grafo. **Passo de estrutura — grafo obrigatório (dono, 15/10/2026).** Antes de
   decidir, para cada símbolo do *Código tocado*: se `graphify-out/graph.json` for mais velho que o
   último commit, rode `graphify update .`; depois `graphify affected "<símbolo>"` e
   `graphify explain "<símbolo>"`. Registre no *Time* uma linha por símbolo com o que o grafo
   respondeu, ou "sem nó" / "grafo velho" e o fallback usado. Grep/Glob só para **localizar**.
   O `tl` entra por risco (15/10): mudança que toca invariante, escreve no disco de alguém ou mexe em
   `UPDATES`/`--release`; fluxo em [delegação](../../.marvin/Contexto/Fluxos/delegacao.md).
   Onde os dois discordarem, me traga a divergência — não escolha em silêncio.

3. Com os dois pareceres: `marvin --us <caminho> --refinada` (a US nasce na fila, fora da nota)
   e preencha o `Sobre.md`: **Por quê** · **Pronto quando** · **Não entra** · **Código tocado**
   (o arquivo:linha do `tl` é isto — é o que define a ilha) · **Time**. Depois
   `marvin --us <caminho>` de novo: o *Impacto* sai do grafo, se houver.
   O *Time* é a tabela `| etapa | papel | modelo · esforço | motivo | estado |`, uma linha por etapa,
   preenchida pelo `tl` e pelo `po` a partir do glossário (`.marvin/Contexto/Equipe.md`): partida no
   degrau mais barato que serve; subir exige motivo; quem decide não é quem executa. É a economia
   decidida aqui — a execução obedece (`/continuar`, `/retomar`); etapa sem modelo trava.

4. Pergunta que só eu respondo fica na US como `❓` — não invente a resposta.

5. Me mostre, em uma tabela: US · ilha (o `marvin --status` diz) · o que bloqueia. **Não comece
   a implementar** — desenvolver é outro chat: `/retomar` e a porta 1.

**Precisa de agente ou skill que o projeto não tem? Procure primeiro no ECC** (`<ecc>/agents`,
`<ecc>/skills`; `<ecc>` = `~/.claude/plugins/marketplaces/ecc`) e instale só aquele, copiando o
arquivo (receita no glossário `.marvin/Contexto/Equipe.md`); depois ajuste `model`/`effort` pela
tabela. Só escreva do zero se o ECC não tiver.
