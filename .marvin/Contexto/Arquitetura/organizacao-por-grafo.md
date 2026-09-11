# A base de conhecimento passa a ser organizada por grafo, não por tipo de arquivo

**Quando:** 10/09/2026   ·   **Estado:** aceita — ainda não implementada no script

## O problema

O layout atual (`08_Memoria/`, `10_Decisoes/`, `11_Sessoes/`, `90_Anexos/`) organiza
por **tipo de arquivo**. O que se quer saber numa sessão é outro eixo: *o que este
projeto é* e *o que está sendo feito nele agora*. Consequências medidas:

- Decisão fica longe do trabalho que a gerou. Vira arquivo solto em `10_Decisoes/` e
  ninguém a encontra a partir da atividade.
- Pasta muda (`11_Sessoes/`, `90_Anexos/`) não ensina o que entra nela — e o resultado
  foi relato empilhado no `onde_paramos.md` (18 seções no `parci-front`, 19 KB aqui).
- O `onde_paramos.md` carrega em toda sessão, e é o único arquivo em que tudo era
  escrito. Duas sessões paralelas colidem nele.
- O graphify só vira útil se houver **arestas**. Menção em prosa não é aresta.

## O que foi decidido

```
.marvin/
├─ Contexto/
│   ├─ Sobre.md            nó raiz: o que o projeto é + links para os fluxos
│   ├─ Fluxos/<fluxo>.md   incremental — nasce quando um fluxo é analisado numa atividade
│   ├─ Arquitetura/        como foi projetado e com o quê; decisão estrutural mora aqui
│   └─ Design/             só se há front
├─ Planejamento/
│   ├─ Manutencao/         <Epic>/Sobre.md → <Feature>/Sobre.md → <US>/Sobre.md
│   └─ Novos/              mesma hierarquia
├─ Fontes/                 apoio e suporte
├─ Releases/<versao>.md    índice do que subiu para main: links para as US, com evidência
└─ Memoria/onde_paramos.md junction; só a lista das US em andamento
```

Regras:

1. **Todo nó tem `Sobre.md`** com o mesmo formato: `estado` no frontmatter
   (`ativa · concluida · cancelada`), link para o pai, links para os filhos, e a seção
   **Rumo** — um registro por mudança de direção. Vale para Epic, Feature e US.
2. **Decisão mora no nó que a tomou.** Da US, na US; da feature, na feature; estrutural,
   em `Contexto/Arquitetura/`. Nenhuma US mora em Arquitetura.
3. **Mudar de rumo é normal e fica explícito.** Registra no Rumo e segue. Se preciso,
   cancela os filhos e abre novos — a entrada fica no Rumo do pai.
4. **`onde_paramos.md` é só ponteiro:** uma linha por US ativa. Sessões paralelas editam
   linhas diferentes. US que foi para release sai da lista.
5. **Nada muda de pasta.** US concluída fica onde está, com `estado: concluida` e a
   evidência preenchida; `Releases/<versao>.md` a lista. Reabrir é outra release.
6. **Aresta é link markdown.** Sem link, o grafo não vê.
7. **Mudar esta organização** é uma entrada no Rumo do `Contexto/Sobre.md`.
8. **Histórico do que foi feito** se lê em `Releases/`, não no Planejamento — o índice
   fica curto porque só aponta.

## O que foi descartado, e por quê

- **Pastas numeradas por tipo** (`08_`, `10_`, `11_`, `90_`, `99_`): o número ordena a
  listagem, mas não diz o que entra em cada uma nem liga uma à outra.
- **`11_Sessoes/`**: contradiz "relato é `git log`". Se sessão tem pasta, alguém escreve
  relato nela.
- **Decisões dentro do `onde_paramos.md`**: infla o único arquivo que carrega sempre.
  Foi o que aconteceu em 09/09.
- **US soltas em `Releases/` ou movidas ao concluir**: mover quebra link e some do grafo.
- **`onde_paramos.md` na raiz de `.marvin/`**: a junction do Claude Code aponta para um
  diretório; solto na raiz, qualquer memória gravada pela ferramenta cairia no meio da
  base. Por isso `Memoria/` continua existindo, só para ele.

## Consequências previstas

- **O grafo passa a ter `.marvin/` junto com o código** — um grafo só, o lado dos docs
  gerado pelo próprio Marvin (ver Ordem de execução, 1). É o que dá as arestas US → fluxo → arquivo → função, nos
  dois sentidos. Continua consulta, nunca hook (decisão fechada).
- **`marvin --status`, um dashboard derivado:** US ativas com pai e último Rumo, progresso
  por Epic, travadas há N dias, última release, orçamento de contexto (os três arquivos que
  carregam sempre) e frescor do grafo. Tudo lido do frontmatter e de `Releases/`. Primeiro
  em texto no terminal; HTML estático depois, sem lib, em pasta ignorada pelo git. Nunca
  versionado — seria mais um artefato envelhecendo em silêncio.

## Ordem de execução

1. ~~Medir se o graphify faz aresta de link markdown relativo~~ **Medido em 10/09.** Ele
   só indexa `.md` por LLM: 93 K tokens para 3 arquivos de amostra, não determinístico, e
   a aresta doc→código foi **descartada** pelo próprio graphify ("out-of-scope"). E o
   `merge-graphs` prefixa os ids por repositório, quebrando qualquer aresta cruzada.
   **Decidido:** o Marvin gera o lado `.marvin/` do grafo por regex (link relativo →
   `references`, `pai:` → `child_of`, crase em *Código tocado* → `touches` no id previsível
   do graphify) e **anexa direto no `graph.json`** entre o `extract --code-only` e o
   `cluster-only`. Testado: `path`, `affected` e `query` respondem nos dois sentidos.
   Aresta para nó de código inexistente é descartada com aviso.
2. Templates no `marvin.mjs` (passos 5, 7b, 4b, 10 e `ATUALIZACOES`).
3. Migrar este repositório com a própria ferramenta.
4. `--status`.

## Migração

Projeto montado no layout antigo continua detectado (invariante 2). O script avisa que o
layout é antigo e **não move** — mover é decisão do humano, com o invariante 1 valendo.
Este repositório migra primeiro, com a própria ferramenta.
