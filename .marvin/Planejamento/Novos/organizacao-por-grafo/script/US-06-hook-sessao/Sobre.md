---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-06 — `--status --curto` como hook de abertura de sessão

**Por quê:** o sinal já existe (`--status` sai != 0), mas depende do `/retomar` mandar rodar. Hook
de `SessionStart` é o único jeito de o agente não poder ignorar.
**Pronto quando:** abrir um chat novo sem `/retomar` e o agente citar o que o status acusa sem ser
perguntado; `--status --curto` ≤ 200 tk medidos pelo 4b e **sempre sai 0** (exit != 0 em hook vira
erro visível); `settings.json` que já existe é intocado byte a byte, com o bloco impresso para colar.

## Fluxos ligados
_(nenhum)_

## Código tocado
- `marvin.mjs`
- `teste.mjs`

## Time
- po, tl, dev-back, qa

## Skills
- nenhuma

## Rumo
- **11/09/2026** — aberta. **PO:** confiança média, com aviso (invariante 3); fora: bloquear a sessão,
  outras ferramentas, rodar o status completo (custa 400+ tk em toda sessão). **TL:** se `settings.json`
  não existe, escreve o objeto mínimo; se existe, NÃO faz merge — imprime e manda colar, como o
  `post-commit`; o comando é `node <caminho>/marvin.mjs` no clone e `npx marvin-kb` nos outros, sempre
  com `|| true`; marca nova no passo 10. Depende de separar cálculo de impressão no `--status`.

- **11/09/2026** — feita: `--status --curto` (sem cabeçalho, sem cor, sempre 0, ~130 tk); o 7b escreve `.claude/settings.json` com o hook `SessionStart` se não existe, e imprime o bloco sem tocar se existe; marca no passo 10.

## Evidência
- teste 9w: hook gerado e JSON válido; `--curto` acusa e sai 0; settings alheio intocado byte a byte; passo 10 cobra. 176 verdes.
