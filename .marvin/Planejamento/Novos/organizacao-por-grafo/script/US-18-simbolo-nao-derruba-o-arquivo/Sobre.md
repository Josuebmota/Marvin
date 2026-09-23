---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-18 — símbolo que não resolve não pode derrubar o arquivo

**Por quê:** no *Código tocado*, o bullet é `` `caminho` — `símbolo` ``, e o símbolo **estreita**
o arquivo; nunca o substitui. Mas até a 1.8.0, quando o símbolo não existia como nó, o
`docsGraph` só empurrava um warning e **abandonava o bullet inteiro** — sem cair de volta na
aresta do arquivo. A US ficava com menos nós do que declarou, e o bloco *Impacto* passava a
afirmar, com confiança, duas coisas falsas: *"Nada depende do que ela toca — folha do grafo"* e
*"Nenhuma outra US passa por este código"*.

**A segunda frase é a razão de a US-10 existir.** Colisão entre duas US no mesmo arquivo é o que
o Impacto foi feito para achar; quando ele cala, cala exatamente no que se confiou nele.

O grafo indexa **símbolo de topo**. Então o defeito pegava toda menção a `const` local, função
dentro de componente, campo de interface e chave de config — que é como a maioria das notas
descreve o que vai mexer.

**Medido no Parci em 22/09/2026, antes de consertar:**

| US | dizia | era |
|---|---|---|
| US-PL-9 (já entregue) | "folha do grafo · nenhuma outra US" | **157 dependentes · 20 outras US** |
| US-PL-8 | parcial | **316 dependentes · 35 outras US** |
| US-ADM-5 | "nenhuma outra US" | 14 · 5 — inclusive a US-FB-2, que **edita o mesmo arquivo**, e que naquele momento estava sendo planejada para mexer nele |

A US-PL-9 é o caso que dói: entregue, declarando um arquivo de núcleo, e se anunciando isolada.

**Pronto quando:**
1. Símbolo que não resolve **não descarta o arquivo** — a aresta do arquivo é criada assim mesmo.
   Falha de símbolo custa **granularidade**, nunca o arquivo.
2. A mensagem para de chutar `renamed?` sozinha: diz que pode ser símbolo local (só topo é
   indexado) **ou** renomeação, e afirma que o arquivo continua contando.
3. Bullet com mais de um caminho **avisa**, em vez de perder o segundo em silêncio. Só a parte
   antes do travessão é examinada: caminho citado na prosa é referência, não segundo arquivo.
4. `does not exist` distingue arquivo **futuro** de **caminho errado** — quando existe nó com o
   mesmo basename em outro caminho, o aviso diz qual.
5. `node teste.mjs` verde.

**Não entra:** indexar símbolo local (é decisão do `graphify`, não do `marvin`, e encarece o
índice). Mudar o formato do *Código tocado* — ele estava certo; quem errava era o parser.

## Fluxos ligados
- [../../../../Contexto/Fluxos/README.md](../../../../Contexto/Fluxos/README.md)

## Código tocado
- `marvin.mjs` — `docsGraph`
- `teste.mjs`
- `README.md`
- `README.pt-BR.md`

## Time
`dev-back` · `tl` (o Impacto é dado de decisão: uma aresta a menos é uma colisão não vista) · `qa`
(a validação que valeu foi contra um vault real, não contra a arena do teste).

## Skills
nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-01 — Layout por grafo no script](../US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../US-15-status-html-legivel/Sobre.md) — 1 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../US-16-refinar-e-ilhas/Sobre.md) — 2 nó(s) em comum

## Rumo
- **22/09/2026** — aberta e implementada no mesmo dia. O defeito não apareceu lendo código:
  apareceu no vault do Parci, onde duas US editavam `AdminDashboard.tsx` e só **uma das duas**
  enxergava a outra. A assimetria foi o sintoma — Impacto deveria ser recíproco. O isolamento
  levou três tentativas: quebra de linha no bullet (não era), `()` no nome (não era — a linha 629
  já remove), e enfim a crase: tirar as crases de `` `aprovar()` `` mudou a mesma US de
  `0 other US` para `4 other US`. Só então o bloco do `docsGraph` explicou o porquê.
  ⚠️ **Durante o diagnóstico eu afirmei um quarto defeito que não existe:** que a lista de avisos
  truncava em 8 sem dizer. Ela **diz** — imprime o total (`N link(s) … did not land on a node`) e
  um `… and N more`. Quem escondeu as duas linhas foi o meu próprio `grep`. Fica registrado
  porque o erro é instrutivo: filtrar a saída de uma ferramenta e concluir sobre o que ela
  imprime são coisas diferentes.

## Evidência
**22/09/2026** — `marvin.mjs` (`docsGraph`, bloco do *Código tocado*), `teste.mjs`, e o contador
de verificações nos dois READMEs: 236 → **237**.

A trava antiga (*"função que não existe vira AVISO, não nó fantasma"*) afirmava só metade do
contrato — avisa, e não inventa nó. Ganhou a metade que faltava, *"função que não existe NÃO
derruba o arquivo da US"*, que **falha no código velho**.

Validado contra vault real (Parci, 190 nós de doc): as arestas de doc foram de **954 para 977** —
23 ligações que existiam nas notas e o grafo perdia. Com `` `aprovar()` `` restaurado entre
crases, exatamente a grafia que falhava, a US-ADM-5 passou a listar a US-FB-2.
`node teste.mjs`: 237 passaram, 0 falharam.

**Não publicado.** O `marvin` global é uma cópia instalada do npm (1.8.0), não um link para este
clone — o conserto só chega aos projetos com um release novo.
