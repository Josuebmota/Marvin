---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-05 — `marvin --release <versao>`

**Por quê:** é o único passo do ciclo US → Rumo → Evidência → Release que ainda é manual, e é onde
a nota volta a inflar — o `--status` acusa "concluída ainda na nota" para sempre se ninguém fechar.
**Pronto quando:** rodar aqui gera `Releases/1.2.0.md` com US-01, 02 e 04; o `--status` seguinte sai 0;
rodar de novo com a mesma versão recusa sem tocar nada; `--dry-run` mostra o conteúdo e não escreve;
US concluída sem Evidência bloqueia com o nome.

## Fluxos ligados
_(nenhum)_

## Código tocado
- `marvin.mjs` — `lerNo`
- `marvin.mjs` — `nosDoPlanejamento`
- `teste.mjs`

## Time
- po, tl, dev-back, qa — refinado por PO e TL em 11/09 (Rumo)

## Skills
- nenhuma

## Rumo
- **11/09/2026** — aberta. **PO:** escopo mínimo = ler `estado: concluida` fora de qualquer `Releases/*.md`,
  exigir Evidência, escrever o índice, tirar as linhas da nota; recusa se o arquivo existe; não faz tag,
  commit nem bump — sugere o `git tag`. **TL:** invariante 1 é o ponto crítico — remover só linhas que
  casem o href exato, conferir `antes − depois === n`, escrever o release ANTES da nota; data pelo
  `git log -1 --format=%cs`, nunca `new Date()`; sem escape para "sem evidência" — quem quer, escreve
  `_(sem evidência: hotfix)_` no nó, e a decisão fica registrada. Avisar `Sobre.md` sem frontmatter e
  arquivo em `Releases/` sem nenhum `- [`.

- **11/09/2026** — feita como o TL contratou: release antes da nota, href exato, contagem conferida, data pelo git, sem escape para evidência.

## Evidência
- teste 9v: aborta sem Evidência sem tocar o disco, dry-run honesto, remove só as linhas certas com contagem conferida, recusa segunda vez. Rodado aqui para fechar o 1.2.0.
