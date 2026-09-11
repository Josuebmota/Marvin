---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-04 — O passo 3 confunde backup com lixo de shell

**Por quê:** ele diz "almost always a malformed shell command" para qualquer nome estranho,
mas `.bak`/`.orig`/`~` são backup declarado e pedem outra conversa. Visto num repositório real
com `firestore.rules.bak`.
**Pronto quando:** `.bak`, `.orig` e `~` recebem aviso próprio ("backup na raiz — é para versionar?"), e o teste cobre os dois casos.

## Fluxos ligados
_(nenhum)_

## Código tocado
- `marvin.mjs`
- `teste.mjs`

## Time
- dev-back, qa

## Skills
- nenhuma

## Rumo
- **10/09/2026** — aberta, ainda não começada.

## Evidência
_(vazio)_
