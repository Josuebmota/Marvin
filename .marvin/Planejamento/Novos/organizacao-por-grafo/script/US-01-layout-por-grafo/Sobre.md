---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-01 — Layout por grafo no script

**Por quê:** ver o [Epic](../../Sobre.md).
**Pronto quando:** `node teste.mjs` verde nos três SOs, este repositório migrado com a própria ferramenta, e o `1.2.0` publicado.

## Fluxos ligados
_(nenhum ainda — o fluxo de montagem do script ganha nota quando alguém precisar analisá-lo)_

## Código tocado
- `marvin.mjs` — `contextoFixo`
- `marvin.mjs` — `imprimirContextoFixo`
- `marvin.mjs` — `escreverSeFaltar`
- `teste.mjs`

## Time
- tl, dev-back, qa, scout — projeto de uma pessoa; `po` é o próprio dono

## Skills
- nenhuma — o teste e o CI já são o procedimento

## Rumo
- **10/09/2026** — aberta. Medido antes de escrever: o graphify não faz aresta doc→código
  sem LLM, e com LLM descarta. O lado dos docs é gerado pelo script por regex.
- **10/09/2026** — detecção de layout (`Memoria/` novo, `08_Memoria/` antigo intocado),
  passo 5 com os templates, nota só de ponteiros, 4b medindo os três arquivos, `--check` com
  a mesma conta, 8b anexando os docs, passo 10 com as marcas novas. 118 verificações.
- **10/09/2026** — regra "antes de qualquer US" (time em camadas + skills) entrou no
  `AGENTS.md` gerado, no formato da US e no `PROMPT.md`, a pedido.

- **10/09/2026** — commit `eed72ec`. Migrado também o primeiro projeto real (33 features viraram
  pastas com `Sobre.md`; grafo com 113 nós de doc). A migração ensinou duas coisas que
  entraram no script: `[[wikilink]]` vira aresta (base vinda de vault de notas é cheia deles),
  e o 6b não cria `Externas.md` em branco quando o `00_Fontes_Externas.md` antigo ainda existe.

## Evidência
- commits `eed72ec`…`b3b8a30`; 161 verificações verdes; quatro projetos migrados e com `--status` verde. Publicação no npm é a US-03.
