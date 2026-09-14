---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-09 — A rede no dashboard, e o dashboard que se atualiza sozinho

**Por quê:** o HTML era tabelas e séries; a base é um grafo e merecia ser vista como um. E ele só se atualizava quando alguém rodava `--html`.
**Pronto quando:** o `index.html` desenha Epic → Feature → US → fluxos → código tocado, colorido por estado, sem lib; e o hook de sessão o regera em silêncio.

## Fluxos ligados
_(link para ../../../../../Contexto/Fluxos/<fluxo>.md — fluxo sem nota ganha uma agora)_

## Código tocado
_(crase com o caminho a partir da raiz, e a função depois de um traço — é o que liga a US ao grafo)_

## Time
_(base: tl · po · dev-front · dev-back · qa · scout; mais design/dba/sec/infra se a atividade pede. O que ela não usa não entra.)_

## Skills
_(procedimento que vai repetir — proposta aqui, SKILL.md na segunda vez)_

## Rumo
- **14/09/2026** — feita. O lado dos docs do grafo virou função (`grafoDosDocs`), usada pelo 8b e pelo HTML; o graphify entra como fornecedor dos nós de código que as US tocam (o grafo inteiro seria ruído). Layout de força em JS inline com posições iniciais em espiral (sem `Math.random`). O hook passou a `--status --curto --html`: regera a página a cada abertura de sessão, sem imprimir nada; custa 0,3 s aqui.

## Evidência
- teste 9y ampliado: nós de doc com `cat` e `estado` no JSON inline, sem `<script src>`; `--curto --html` sai 0 e em silêncio; o hook gerado tem `--html`. Visto no navegador nos quatro projetos.
