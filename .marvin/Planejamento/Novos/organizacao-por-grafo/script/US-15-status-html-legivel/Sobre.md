---
tipo: us
estado: planejada
pai: ../Sobre.md
---
# US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro

**Por quê:** o HTML da [US-07](../US-07-status-html/Sobre.md) provou a série histórica, mas
ficou rústico — visto em 15/09/2026 num projeto real com 172 nós e 30 US: a rede ilegível é
o primeiro bloco; os 6 cards têm o mesmo peso; "6 coisas a corrigir" (o único número que
pede ação) está em 11px no subtítulo e a lista está no rodapé, em texto vermelho cru; quatro
gráficos de linha idênticos empilhados, um deles reta desde o segundo ponto; só dark, frio,
monoespaçada em tudo; `$2273 · 8509 turnos` sem "e daí".

**Pronto quando:** abrindo o `index.html` de um projeto real, a primeira dobra responde *o
que está errado e o que fazer* sem rolar; tema claro e escuro por `prefers-color-scheme`;
zero dependência e zero rede (continua abrindo em `file://`); **o que é medido não muda** —
`historico.jsonl` e o `--status` texto ficam byte a byte iguais; `node teste.mjs` verde.

## Escopo

Ordem das seções, de cima para baixo:

1. **Corrigir** — lista acionável, cada item com link para o arquivo. É o motivo de abrir.
2. **Resumo** — 4 cards no padrão *stat card*: rótulo pequeno / valor grande / delta desde o
   último commit (o `historico.jsonl` já tem o ponto anterior) / `>` que leva à seção.
3. **US em andamento** — tabela com badge de estado e último Rumo.
4. **Tendência** — **um** gráfico com seletor de métrica, não quatro empilhados.
5. **Tokens** — barras por dia + tabela por modelo, com custo por turno e por dia ao lado
   do total.
6. **Rede** — colapsada por padrão (`<details>`), última.

Tokens visuais: copiar **valores** das escalas do Open Props (espaço, tipo, sombra, easing)
para dentro do `<style>` — nunca linkar; identidade própria do Marvin (`#0d1117` + verde
`#3fb950` do logo no escuro; equivalente claro), **não** a paleta do projeto alvo.
Anatomia de componente por shadcn/ui (stat card, badge, tabela) — anatomia, não código.
Padrão dos 4 cards de resumo clicáveis vem de dashboard financeiro de mercado.

**Não entra:** mudança em qualquer cálculo de `calcularStatus`; JS de layout de rede
(a força já existe); qualquer fonte ou asset externo.

## Fluxos ligados
- [`status-html`](../../../../Contexto/Fluxos/status-html.md) _(nota do fluxo nasce no início desta US)_

## Código tocado
- `marvin.mjs` — `escreverStatusHtml`: o template inteiro (CSS, ordem das seções, cards,
  seletor de tendência, `<details>` da rede); a função de SVG de linha ganha o seletor
- `teste.mjs` — o teste do `--html` confere ordem das seções e presença dos dois temas

## Time
- `design` — hierarquia, tokens, tema. É a camada que esta US pede e as outras não.
- `dev-back` — o template dentro do `marvin.mjs`.
- `tl` — garante que nada medido muda: diff do `historico.jsonl` e do `--status` texto vazio.
- `qa` — abre em `file://` nos dois temas, no projeto real que motivou.
- `po` (Josué) — decide o que vai na primeira dobra.

## Skills
_(nenhuma — layout roda uma vez; se a segunda tela de status aparecer, aí sim)_

## Ordem

**Antes da [US-14](../../../../Planejamento/Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md)**,
por decisão do `po` em 15/09/2026: a 14 reescreve o `marvin.mjs` inteiro; mexer no template
depois é reconverter. A 14 fica *ativa* mas parada até esta fechar.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum

## Rumo
- **15/09/2026** — aberta como planejada, a partir da inspeção do HTML num projeto real.
  Fontes de referência do front lidas naquele projeto; o que serve está em *Escopo*, o que
  é identidade do produto dele foi descartado de propósito.

## Evidência
<!-- preenchido ao concluir: print da primeira dobra nos dois temas; diff vazio do historico.jsonl e do --status texto -->
