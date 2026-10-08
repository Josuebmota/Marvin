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

**Item 5 decidido (dono, 08/10/2026):** o invariante 4 pode mudar, e *skills e agentes são definidos por atividade*. Modelo: o dono é PM e TM e passa a demanda; o `tl` e o `po` fazem a triagem (quem toca, quais agentes e skills, esforço e modelo), sujeitos eles mesmos a esforço e modelo por atividade. **Aplicado em 08/10/2026:** nova redação do invariante 4 no `AGENTS.md` e a seção *Triagem* em `delegacao.md`. **O script continua sem escrever corpo de persona na instalação** — `po` e `tl` descartaram o esqueleto gerado (genérico é "papel vazio para preencher a pasta", `marvin.mjs:2780`), e o `tl` desaconselha; reabre só se o dono insistir, com as salvaguardas do parecer (`existsSync`, `fsw`, pergunta com TTY, `ATUALIZACOES` com `desde:`, teste de dois runs).

**"Sempre graphify" ficou condicional**, por parecer do `po` e do `tl`: o graphify não existe nesta máquina, e o texto gerado já mede que para localizar o Grep é bem mais barato. A regra escrita é: com grafo fresco, a triagem parte do *Impacto*; sem, usa Grep e registra. Economia de tokens continua hipótese da US-19.

**Pronto quando** (proposto; o `po` corta):
0. **Pré-condição (bug achado pelo `tl`):** `frontiers = list.length + SUBREPOS.length` (`marvin.mjs:2767-2768`) conta tipos de marcador, não fronteiras — um projeto TS comum (`package.json` + `tsconfig.json`) cai em "2 fronteiras". Consertar contando diretórios (`stacks.size`) mais sub-repos, antes de imprimir.
1. **Item 1, só leitura:** a saída do `marvin` na montagem imprime a sugestão (número de fronteiras, papéis da base e a camada opcional `design`/`dba`/`sec`/`infra`), em inglês fixo como o resto da saída (**não há camada de tradução**), **só quando `.claude/agents` não tem nenhum `*.md` além do README**; a conta vira função nomeada (hoje é anônima no template). **Sem escrever arquivo novo**, então não mexe em `ATUALIZACOES`. Testes em `teste.mjs` via `run()`: só `package.json` → 1 fronteira e `dev` único; `package.json` + `go.mod` em subpastas → 2; `package.json` + `tsconfig.json` → 1; dry-run imprime e não grava.
2. **Promessa corrigida:** `README.md` e `README.pt-BR.md` (no mesmo commit) deixam de dizer "dois papéis em stack única" e descrevem o que o código faz.
3. **Itens 2–4:** o `po` diz, com base no que já existe em `delegacao.md` e no `/us`, **o que é lacuna real e o que só falta o dono ler**; só vira trabalho o que ele marcar como medido. Nenhuma promessa de "economia de tokens" sem a medição de 3–4 US da US-19.
4. **Item 5:** feito (invariante 4 e *Triagem*, acima). Fica: levar a triagem ao template gerado (`/us` e `Planejamento/README.md`) é **outra US, só com medição** (2 US daqui com triagem explícita) e exige `ATUALIZACOES`.

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
- **08/10/2026** — aberta a partir da conversa: o dono pensava que o Marvin já criava as personas e as chamava por atividade. Medido: não cria, e o terminal não mostra a contagem. Nada implementado de código.
- **08/10/2026** — o dono liberou mudar o invariante 4 ("skills e agentes são definidos por atividade") e descreveu o modelo PM → `tl`+`po` (triagem) → time. `po` e `tl` (Opus) opinaram: o modelo já é o `/us` + `delegacao.md`, faltava dono para a triagem e o terminal mudo; persona só vira arquivo com armadilha concreta; "sempre graphify" → condicional. Aplicado só em texto (`AGENTS.md` invariante 4; `delegacao.md` *Triagem*). **Próximo:** consertar a contagem de fronteiras e imprimir a sugestão (itens 0–2).
- **08/10/2026 — implementado** (dono: "pode seguir", liberando levar a triagem ao produto). `dev-back` implementou, `qa` verificou, `tl` leu o diff. Entregue: `suggestTeam()` em `marvin.mjs` (contagem por diretório mais sub-repos sem marcador, corrigindo o "2 fronteiras" de um projeto TS comum e a dupla contagem de sub-repo com marcador); a sugestão sai no terminal só quando `.claude/agents` não tem `*.md` além do README, só leitura; texto de *Triagem* e grafo opcional nos templates gerados (`Planejamento/README.md` e `AGENTS.md`) com duas entradas em `UPDATES` (`desde: '2.1.0'`); READMEs corrigidos ("dois papéis em stack única" saiu) e o total em 286. O `qa` achou e o `dev-back` corrigiu um `3.**Atualizar` (espaço perdido) que o teste não pegava.
  - **Versão:** as entradas dizem `desde: '2.1.0'` e o `package.json` segue em `2.0.0`, então o passo 10 imprime "este é 2.0.0" e "(desde 2.1.0)" até o release. **O próximo release tem de ser minor (2.1.0)**; se sair 2.0.1, as duas entradas viram `desde: '2.0.1'`. Não bumpei a versão: é decisão de release.
  - **Não coberto:** Windows e macOS (só Linux aqui; o CI cobre os três), e a correção final de `suggestTeam()` foi conferida por teste e pelo trecho do diff, não relida de novo pelo `tl`.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
