---
description: Sessão autônoma — escolhe a próxima US, executa até o "Pronto quando" ou até travar, registra e sai. Feito para rodar em loop sem humano.
---

Continue o roadmap **sem esperar confirmação**. Este é o `/retomar` sem o "espere eu confirmar" —
o humano está dormindo e vai validar de manhã pelo diff e pelo Rumo. Tudo o que você decidir
tem de estar escrito de um jeito que ele entenda **sem abrir a conversa**.

## 1. Escolher

Leia `.marvin/Memoria/onde_paramos.md` e `git log --oneline -5`. Das US em *Em andamento*,
pegue a **primeira que não está em *Travado*** e que tem *Pronto quando* preenchido e
verificável. Sem nenhuma que sirva → escreva na nota "nada elegível para sessão autônoma:
<motivo>" e **pare aqui**. Não abra US nova: abrir é decisão do `po`, e o `po` é o humano.

Leia o `Sobre.md` dela inteiro — *Por quê*, *Pronto quando*, *Código tocado*, *Time*, *Rumo*.
Se o Rumo tem entrada de sessão autônoma anterior, continue dela.

## 2. Executar — com as travas

Trabalhe **só** dentro do *Código tocado* da US. Arquivo fora dele que precisa mudar → é
dependência (trava abaixo), não licença. **Nunca apague, mova ou renomeie** nada; nunca rode
`git reset`, `git checkout --`, `rm -rf`. Invariante 1 vale dobrado sem ninguém olhando.

**Trava = qualquer coisa que o *Pronto quando* não decide.** Escolha de produto, nome de coisa
que aparece para o usuário, dúvida sobre requisito, mudança fora do *Código tocado*, teste que
falha por motivo que você não entende em 2 tentativas. Ao travar:

- **não invente a resposta para não parar** — é a brecha óbvia desta sessão, e é o que o humano
  vai procurar de manhã;
- registre (passo 3) e volte ao passo 1 para pegar **outra** US. Só quando nenhuma sobrar, saia.

`node teste.mjs` (ou o comando de teste do `AGENTS.md`) antes de dar qualquer coisa por pronta.
**Sem commit.** O humano commita depois de validar; o diff é a evidência dele.

## 3. Registrar — o que o humano lê de manhã

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

Rode `marvin --status`. Se acusar algo, registre no Rumo e não tente "arrumar" — arrumar fora
da US é trava. Termine com uma linha: `US <nome>: concluída|travada|nada elegível — <motivo>`.
É o que o loop vê para decidir se roda de novo.

$ARGUMENTS
