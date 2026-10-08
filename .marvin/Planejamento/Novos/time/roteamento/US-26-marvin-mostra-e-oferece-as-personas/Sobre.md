---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-26 — o Marvin mostra, na instalação, quais personas o projeto pede

**Por quê:** o dono do projeto achava que o Marvin já fazia isso e **não faz** (medido por subagente em 08/10/2026): o script **não escreve nenhuma persona** — só o `.claude/agents/README.md`, e só se não existir (`marvin.mjs:2733-2742`). A sugestão de quantos papéis o projeto pede existe, mas só **dentro** desse README gerado (`marvin.mjs:2761-2783`); o terminal imprime apenas as stacks por pasta e a linha final "Left for you to write by hand: .claude/agents/*.md" (`marvin.mjs:4034-4036`), sem número nem lista. Quem instala não descobre que pode criar `design`, `dba`, `sec`, `infra`. E o README principal promete "dois papéis em stack única", que o código não faz: o ramo de stack única diz só que `dev-front` e `dev-back` podem virar um `dev` (`marvin.mjs:2777`; promessa em `README.md:653-657` e `README.pt-BR.md:646-648`).

**Pedido do dono (08/10/2026), por item:**
1. Mostrar na instalação **quantas e quais** personas o projeto sugere (catálogo: `tl`, `po`, `dev-front`, `dev-back`, `qa`, `scout` + `design`, `dba`, `sec`, `infra`).
2. A atividade chama o papel certo (dev, design, qa, dba…) **conforme o caso** — nem sempre todos. Hoje isso é só texto (`marvin.mjs:2174-2183`, `2371-2387`); quem decide é o agente que lê.
3. O `po` atua **junto** com o `tl`, com o contexto todo. Hoje não existe em texto gerado nenhum; só as personas deste repo, separadas.
4. Mitigar esforço e modelo, **possivelmente com o graphify**, para economizar tokens. Hoje o script **mede** tokens (`--status`) mas não economiza, e o graphify só localiza código, gera *Impacto* e agrupa ilhas — não escolhe modelo nem esforço; o próprio texto gerado diz "não declarar economia sem comparação" (`marvin.mjs:2183`).
5. **"Deixar as personas criadas."**

**Pergunta aberta (bloqueia o item 5):** criar personas **colide com o invariante 4** do `AGENTS.md` ("agentes, skills e o corpo do `AGENTS.md` são do humano; genérico é pior que ausente") e com o "deliberadamente não faz" do README. O `po` e o dono decidem antes de qualquer código. Caminhos a pesar, sem escolher aqui: (a) **só mostrar** o catálogo e a contagem no terminal (não escreve nada, não fere o invariante); (b) oferecer, **por pergunta explícita e uma vez**, gravar um *esqueleto* com o papel, as ferramentas e a régua de escopo, deixando o corpo "com as cicatrizes deste código" para o humano, e aviso de que é ponto de partida; (c) manter como está e só corrigir a promessa do README. O invariante 2 (idempotência) e o 1 (nunca sobrescrever agente existente) valem para (b).

**Pronto quando** (proposto; o `po` corta):
1. **Item 1, só leitura:** a saída do `marvin` na montagem imprime a sugestão que já é calculada (número de fronteiras, papéis da base e a camada opcional `design`/`dba`/`sec`/`infra`), em inglês no código e com as chaves de tradução já usadas; **sem escrever arquivo novo**. Um teste em `teste.mjs` trava o texto no caso de stack única e no de várias fronteiras.
2. **Promessa corrigida:** `README.md` e `README.pt-BR.md` (no mesmo commit) deixam de dizer "dois papéis em stack única" e descrevem o que o código faz.
3. **Itens 2–4:** o `po` diz, com base no que já existe em `delegacao.md` e no `/us`, **o que é lacuna real e o que só falta o dono ler**; só vira trabalho o que ele marcar como medido. Nenhuma promessa de "economia de tokens" sem a medição de 3–4 US da US-19.
4. **Item 5:** decisão registrada no *Rumo* (a, b ou c). Se (b), a US se divide.

## Fluxos ligados
- [delegação](../../../../Contexto/Fluxos/delegacao.md) — onde o papel certo por atividade já é descrito (itens 2 e 4)
- [montagem](../../../../Contexto/Fluxos/montagem.md) — o passo que escreve o `.claude/agents/README.md` e o que a saída imprime

## Código tocado
- `marvin.mjs` — o bloco que escreve `.claude/agents/README.md` e calcula as fronteiras (~2731-2783), e o fechamento da saída "Left for you to write by hand" (~4034-4036)
- `teste.mjs` — o teste do texto impresso (item 1)
- `README.md` e `README.pt-BR.md` — a promessa a corrigir (item 2)

> O grafo não existe nesta máquina; rode `marvin --graphify` e depois `marvin --us` de novo para gerar a seção *Impacto*. O `marvin.mjs`, o `teste.mjs` e os READMEs são o **núcleo** (≥3 US, 2+ features), então o `tl` lê o diff, sempre.

## Time
Decomposição ([delegação](../../../../Contexto/Fluxos/delegacao.md)): **julgamento de escopo** (o que entra e a pergunta do item 5) → **implementação** do texto da saída e do teste → **revisão do diff** pelo `tl` (escreve no terminal, não no disco de alguém, mas toca o núcleo) → **documentação** dos dois READMEs. Risco médio: muda `marvin.mjs`; o check é `npm run test` e o `tl` lendo o diff. Modelo, ferramenta e esforço **concretos** ficam a escolher na hora entre os acessos da sessão; nada aqui presume fornecedor, e menor esforço não reduz a verificação.
- `po` · capacidade: julgamento de escopo e produto · modelo/ferramenta/esforço: a definir na execução
  — responder o item 5 com o dono e cortar os itens 2–4; estado: pendente; aplicado: não confirmado
- `dev-back` · capacidade: edição de código Node e texto de saída · modelo/ferramenta/esforço: a definir na execução
  — itens 1 e 2; estado: pendente; aplicado: não confirmado; check: `npm run test`
- `tl` · capacidade: julgamento sobre invariantes · modelo/ferramenta/esforço: a definir na execução
  — ler o diff do `marvin.mjs` (invariantes 2 e 4, `fsw`/`exec`, `ATUALIZACOES` se o template mudar); estado: pendente; aplicado: não confirmado
- `qa` · capacidade: teste de texto impresso · modelo/ferramenta/esforço: a definir na execução
  — conferir o teste dos dois casos (stack única e várias fronteiras); estado: pendente; aplicado: não confirmado

## Skills
- `adaptador-de-ferramenta` — **não** se aplica (não é ferramenta externa).
- _proposta, só na segunda vez:_ um passo "mostrar o catálogo de papéis" reutilizável, caso outra US precise imprimir o mesmo.

## Rumo
- **08/10/2026** — aberta a partir da conversa: o dono pensava que o Marvin já criava as personas e as chamava por atividade. Medido: não cria, e o terminal não mostra a contagem. Pergunta aberta registrada acima (item 5 × invariante 4). Nada implementado.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
