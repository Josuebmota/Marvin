---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-19 — cada tarefa escolhe o trio papel × modelo × esforço, e a escolha é verificada e registrada

**Por quê:** hoje o modelo é fixo por papel e o esforço não é decidido por ninguém, então
tarefa fácil paga o preço de tarefa difícil. Papel diz **o que** fazer; modelo e esforço dizem
**quanto de cavalo** gastar, e isso varia por tarefa, não por papel. Exemplo do Josué: "a atividade
X precisa de um `po` em sonnet, esforço baixo".

Referência: reel do @donimas (*AI Levels*, ep. 01), visto em 05/10/2026, só pelos frames, sem
áudio. Quatro níveis sobre as mesmas 6 tarefas: *Junior* (tudo no modelo topo, esforço máximo),
*Middle* (modelo à mão, esforço sempre alto), *Senior* (mais barato primeiro, verifica, sobe se
falhar), *GOAT* (router escolhe modelo **e** esforço, verifica pelo risco, feedback). Custo por
tarefa resolvida: $5,10 → $0,32. ⚠️ É **simulação** (*"simulated workload · real Claude prices"*),
não medição. O Marvin hoje está no nível *Middle*.

**Pronto quando:** _(proposta — o Josué confirma no chat novo antes de começar)_
1. Cada US carrega o trio na seção *Time*, decidido no `/refinar`:
   `` `po` · sonnet · baixo `` — papel, modelo, esforço.
2. Uma regra escrita de **verificação pelo risco**: mudança que escreve no disco ou toca invariante
   → `teste.mjs` + `tl`; mudança trivial → só `teste.mjs`.
3. Uma regra escrita de **subir quando falha**: a verificação reprovou → refaz um degrau acima
   (modelo ou esforço), e o **Rumo** registra *subiu de X para Y, por quê*. Esse é o feedback.
4. Uma **linha de base medida** antes e depois, em 3 ou 4 US deste repo (skill `cost-report`).
   Sem a medição, não se sabe se chegou ao GOAT ou só ficou mais complicado.
5. Só depois disso, e com número na mão, vira template do `marvin` para os outros projetos.

**Não entra:** router automático como peça de software. Aqui o "router" é a sessão principal
seguindo uma regra escrita. Peça nova para manter, sem ganho medido, é exatamente o que o `po`
barra.

## Perguntas abertas — responder antes de implementar
- **Esforço por chamada existe?** O frontmatter do agente aceita esforço; na chamada do Agent, só
  o `model` pode ser sobrescrito. Se o esforço não puder variar por chamada, as saídas são:
  (a) esforço fixo por papel e só o modelo varia por tarefa; (b) variantes do papel
  (`tl` / `tl-leve`), que custam contexto fixo a mais. **Conferir na documentação do Claude Code
  antes de escolher. Não inventar convenção (invariante 3).**
- **O router é caro.** Quem decide é a sessão principal, no modelo que o Josué escolheu (hoje Opus).
  O ganho real pode exigir que a sessão principal rode em sonnet e só suba quando precisa: inverte o
  jeito de trabalhar atual. Decisão do `po`.
- **Fable entra na escada?** A escada hoje é haiku → sonnet → opus; o trio proposto inclui fable.

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
- `marvin.mjs`
- `AGENTS.md`
- `CLAUDE.md`
- `.claude/agents/README.md`
- `.claude/agents/po.md`
- `.claude/agents/tl.md`

## Time
- `po` · opus · alto — decide se o trio por tarefa resolve custo medido, e responde às perguntas abertas
- `tl` · opus · alto — a regra de verificação pelo risco é invariante; e o template muda o que o `marvin` gera
- `dev-back` · sonnet · médio — escreve as regras e o template
- `scout` · haiku · baixo — confere na documentação do Claude Code se esforço por chamada existe

(O próprio time já está no formato que a US propõe. É o primeiro uso, e serve de teste.)

## Skills
- `rotear-tarefa` — proposta: classificar a tarefa e escolher o trio. Vira `SKILL.md` se repetir.
- `cost-report` — já existe; é a linha de base do item 4.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 1 nó(s) de código em 1 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum

## Rumo
- **05/10/2026** — aberta a partir do reel do @donimas. Ideia do Josué: o esforço tem que ser
  ajustável por tarefa, não fixo por papel. Proposta: decidir o trio no `/refinar` e gravar na
  seção *Time*, porque assim a escolha fica registrada e a subida de degrau vira dado no Rumo.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
