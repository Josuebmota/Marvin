---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-03 — Publicar o 1.1.1 (ou já o 1.2.0)

**Por quê:** o `1.1.1` está commitado e tagueado localmente, sem push e sem publish.
**Pronto quando:** `npm view marvin-kb version` devolve a versão e `git push --follow-tags` foi feito.

## Fluxos ligados
_(nenhum)_

## Código tocado
- `package.json`

## Time
- tl

## Skills
- publicar-no-npm — proposta: `npm login` (navegador + security key, sem `--otp`) → `npm whoami` → `npm publish` → `git push --follow-tags`. Vira skill na segunda vez.

## Rumo
- **10/09/2026** — **travada:** o token do npm expirou. `npm whoami` devolve 401 e o `publish`
  responde 404 — o npm usa 404 no lugar de 401 para não revelar se o pacote existe. Conserto é
  o procedimento em Skills. Com a US-01 fechando, talvez o 1.1.1 nem saia sozinho: vai direto o 1.2.0.
- **14/09/2026** — o `1.1.1` **já estava no npm** (publicado 10/09 17:04, depois da nota acima —
  `npm view marvin-kb time` confirma). Alvo agora é o **1.5.0**: `git push --follow-tags` feito
  (`main` + `v1.1.1` + `v1.5.0`), testes verdes, `npm pack --dry-run` com 7 arquivos. Falta só
  `npm login` → `npm publish`, que é do Josué (credencial). Pronto quando `npm view` devolver 1.5.0.

## Evidência
_(vazio)_
