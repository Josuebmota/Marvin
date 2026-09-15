---
tipo: us
estado: concluida
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
- [publicar-no-npm](../../../../../../.claude/skills/publicar-no-npm/SKILL.md) — virou skill em 15/09/2026, na segunda rodada.

## Rumo
- **10/09/2026** — **travada:** o token do npm expirou. `npm whoami` devolve 401 e o `publish`
  responde 404 — o npm usa 404 no lugar de 401 para não revelar se o pacote existe. Conserto é
  o procedimento em Skills. Com a US-01 fechando, talvez o 1.1.1 nem saia sozinho: vai direto o 1.2.0.
- **14/09/2026** — o `1.1.1` **já estava no npm** (publicado 10/09 17:04, depois da nota acima —
  `npm view marvin-kb time` confirma). Alvo agora é o **1.5.0**: `git push --follow-tags` feito
  (`main` + `v1.1.1` + `v1.5.0`), testes verdes, `npm pack --dry-run` com 7 arquivos. Falta só
  `npm login` → `npm publish`, que é do Josué (credencial). Pronto quando `npm view` devolver 1.5.0.
- **15/09/2026** — **concluída.** Login feito pelo Josué; o primeiro `publish` foi dado como feito mas o
  registry não tinha a versão (sem a linha `+ marvin-kb@1.5.0`, não publicou); o segundo saiu. Duas
  armadilhas foram para a skill: `npm view` sem `--prefer-online` responde do cache, e o `publish` com
  token expirado devolve 404, não 401. Descartado fechar pelo relato — só `npm view` fecha.

## Evidência
- `npm view marvin-kb version --prefer-online` → `1.5.0` (15/09/2026); `git push --follow-tags` → `main` + `v1.1.1` + `v1.5.0` em `origin` (14/09).
