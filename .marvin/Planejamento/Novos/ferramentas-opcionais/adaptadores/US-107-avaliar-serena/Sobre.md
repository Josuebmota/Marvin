---
tipo: us
estado: cancelada
pai: ../Sobre.md
name: US-107-avaliar-serena
description: "Anotação: avaliar a Serena (MCP) como ferramenta opcional, frente ao graphify; a origem é um reel que afirma 90% de economia sem medição. Nada conferido na fonte ainda."
---
# US-107 — avaliar a Serena como ferramenta opcional

**Por quê:** o dono (03/11/2026) viu um reel que afirma 90% de economia de tokens e 97% de reutilização de cache com um "tradutor" entre a informação e o agente. O vídeo não mostra linha de base nem medição, e o método do autor não é público. O único nome concreto é o da **Serena**, na tela ("Usou Serena Stdio integração", "Ativar MCP Serena"); não dá para saber se ela é o "tradutor" ou só uma peça ao lado dele. De memória, **sem conferir na fonte**: MCP aberto que usa servidores de linguagem para entregar símbolos em vez de arquivos inteiros, e guarda memórias. Se for isso, ocupa um espaço próximo ao do graphify.
**Pronto quando:** _(a refinar)_ — esboço: a fonte lida e o alcance conferido, o custo fixo medido e um par com e sem a Serena, no mesmo modelo e esforço, decidindo o `usa` no `.marvin/ferramentas.md` pelo mesmo critério do ponytail e do Impeccable.

**Não entra:** copiar o método do reel; tomar os 90% como premissa; instalar por conta própria; substituir o graphify antes de um número.

## Perguntas
- ❓ 1. A dor é custo de tokens em leitura de código (o que a Serena atacaria) ou contexto de documentos e memória (o que o "tradutor" do reel promete)? São avaliações diferentes.
- ❓ 2. Em qual projeto seu rodar o par? Precisa ter linguagem com servidor de linguagem e código grande o bastante para a leitura pesar.

## Fluxos ligados
_(link para ../../../../../Contexto/Fluxos/<fluxo>.md — fluxo sem nota ganha uma agora)_

## Código tocado
_(crase com o caminho a partir da raiz, e a função depois de um traço — é o que liga a US ao grafo)_

## Time
_(uma linha por etapa. Papéis: base tl · po · dev-front · dev-back · qa · scout; mais design/dba/sec/infra se a atividade pede, e o que ela não usa não entra. Modelo: a partida está no Equipe.md, o degrau mais barato que serve; subir exige motivo. Quem decide, tl/po, não é quem executa. Papel = agente do `.claude/agents`, com a skill da etapa depois do `·` quando houver. Etapa sem modelo trava a execução.)_

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|

## Skills
_(procedimento que vai repetir — proposta aqui, SKILL.md na segunda vez)_

## Rumo
- **03/11/2026** — anotada a pedido do dono, depois de assistir ao reel (áudio transcrito e quadros lidos). Sem crivo `tl` + `po` ainda: fica `anotada` até o `/refinar`.

- **04/11/2026** — `/refinar` ("refina tudo"), crivo `tl` e `po` no Opus · médio, em paralelo; grafo fresco. **Segue `anotada`: os dois divergem e a ❓1 bloqueia.** Nada da Serena foi conferido na fonte.
  - **`tl`:** refina já, como avaliação pura (Código tocado vazio, ilha em `.marvin/ferramentas.md`, risco zero para o script). Dividir em **107a** ler a fonte e medir o custo fixo (para sem par se não carregar como MCP ou se o custo fixo comer o ganho) e **107b** o par com e sem, num projeto do OvenorGroup com servidor de linguagem. Time: scout Haiku · baixo (fonte, exige rede) · dev-back Sonnet · baixo (custo fixo) · dev-back Sonnet · médio (par) · qa Sonnet · baixo · tl+po Opus · médio (decidir o `usa`). Instalar o MCP só em escopo de projeto ou worktree, e remover depois.
  - **`po`:** fica estacionada. Não há dor medida nem caso em que o Grep ou o graphify errou; é o gêmeo do graft (reel sem linha de base, `usa: não`) e passa pelo mesmo portão da US-43. Só vale o passo 0: ler a fonte e procurar nos Rumo e *Time* do Parci e deste repo casos de "onde está X" errado; com 3 ou mais, refina; com menos, segue `anotada` (régua da US-88 e da US-89). Teto do par, se vier: ~2 × 125k tokens, no máximo 300k; um par decide só o `não`, o `sim` exige um segundo.
  - Fora do parecer, a apontar: a Feature `adaptadores` está `concluida` e já recebeu US-68, 93 e 104 sem reabrir; e se a Serena for MCP sempre carregado, o `tl` deve dizer se cai na decisão fechada "graphify como consulta, nunca o hook".

- **04/11/2026** — dono: "refinar em 107a/b". Cancelada, substituída pela [US-107a](../US-107a-ler-fonte-e-custo-fixo-da-serena/Sobre.md) (ler a fonte e medir o custo fixo) e pela [US-107b](../US-107b-par-com-e-sem-serena/Sobre.md) (o par), como a US-11 virou 11a e 11b. As ❓ 1 e 2 foram para as duas.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
