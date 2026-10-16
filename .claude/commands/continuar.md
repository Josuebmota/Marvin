---
description: Sessão autônoma — escolhe a próxima US, executa até o "Pronto quando" ou até travar, registra e sai. Uma rodada por chat novo, disparada pelo dono.
---

Continue o roadmap **sem esperar confirmação**. Este é o `/retomar` sem o "espere eu confirmar" —
o humano não está olhando e vai validar depois pelo diff e pelo Rumo. Tudo o que você decidir
tem de estar escrito de um jeito que ele entenda **sem abrir a conversa**.

## 1. Escolher

Leia `.marvin/Memoria/onde_paramos.md` e `git log --oneline -5`. Anote o custo total que o
`marvin --status` mostra agora: é o começo da rodada. Voltando do passo 2 para pegar outra US, confira o custo
de novo: passou do teto do passo 4 → vá direto ao passo 4. Das US em *Em andamento*,
pegue a **primeira que não está em *Travado*** e que tem *Pronto quando* preenchido e
verificável. Sem nenhuma que sirva → escreva na nota "nada elegível para sessão autônoma:
<motivo>" e **pare aqui**. Não abra US nova: abrir US é decisão do humano.

Leia o `Sobre.md` dela inteiro — *Por quê*, *Pronto quando*, *Código tocado*, *Time*, *Rumo*.
Se o Rumo tem entrada de sessão autônoma anterior, continue dela.

## 2. Executar — com as travas

Trabalhe **só** dentro do *Código tocado* da US. Arquivo fora dele que precisa mudar → é
dependência (trava abaixo), não licença. **Nunca apague, mova ou renomeie** nada; nunca rode
`git reset`, `git checkout --`, `git stash`, `rm -rf`; nunca `push`, merge, publish nem tag.
Invariante 1 (nunca destruir dado sem conferir) vale dobrado sem ninguém olhando.

**Cada etapa roda no modelo da sua linha do *Time*:** delegue ao subagente do papel passando `model` e
`effort` da linha na chamada — isso vale mais que o arquivo do papel e que o modelo da sessão.
Etapa sem linha com modelo é trava: não executa; registre "refinar: falta o modelo por etapa" e
siga para outra US.
Delegue ao agente da linha com a skill da linha, passando `model` e `effort` na chamada.

**Estado por etapa, ao fechar cada uma — não só no passo 3.** A cota pode acabar no meio e
quem assume (outro executor, a pedido do humano — ver o handoff em
[delegacao](../../.marvin/Contexto/Fluxos/delegacao.md)) só tem o *Time* e o *Rumo*. Ao terminar
cada etapa, atualize a coluna `estado` da linha dela no *Time* (`feita` com a evidência) e, ao começar, marque
`em andamento`; o passo 3 é o fechamento, não o único registro.

**Trava = qualquer coisa que o *Pronto quando* não decide.** Escolha de produto, nome de coisa
que aparece para o usuário, dúvida sobre requisito, mudança fora do *Código tocado*, teste que
falha por motivo que você não entende em 2 tentativas. Ao travar:

- **não invente a resposta para não parar** — é a brecha óbvia desta sessão, e é o que o humano
  vai procurar depois;
- registre (passo 3) e volte ao passo 1 para pegar **outra** US, se o teto do passo 4 permitir. Só quando nenhuma sobrar, saia.

`node teste.mjs` (comando de teste do `AGENTS.md`) antes de dar qualquer coisa por pronta.
**Sem commit.** O humano commita depois de validar; o diff é a evidência dele.

## 3. Registrar — o que o humano lê depois

No **Rumo** do `Sobre.md`, uma entrada datada, marcada `(sessão autônoma)`, com quatro partes
— didática, porque quem lê não estava aqui:

1. **O que era a atividade**, em duas frases, para quem esqueceu.
2. **O que foi feito** e onde (arquivos, funções).
3. **Decisões tomadas sozinho** e o porquê de cada uma — e o que foi descartado.
4. **Onde parou e por quê**: concluiu (com a evidência do *Pronto quando*), ou travou (a pergunta
   exata que precisa do humano, e o que você faria com cada resposta possível).

Na nota: a linha da US vira o próximo passo numa frase. Travou → linha em *Travado* com a
pergunta. Concluiu → `estado: concluida`, mas **não** tira da nota nem escreve Release — isso
é validação, e validação é do humano.

## 4. Sair

Rode `marvin --status` e registre no Rumo o custo da rodada (o total agora menos o do passo 1).
**Teto: $3 por rodada** (dono, 14/10). Passou do
teto → não pegue outra US; saia. Se acusar algo, registre no Rumo e não tente "arrumar" — arrumar fora
da US é trava. Termine com uma linha: `US <nome>: concluída|travada|nada elegível — <motivo>`.
É o que o dono lê para decidir se dispara outra rodada.

$ARGUMENTS
