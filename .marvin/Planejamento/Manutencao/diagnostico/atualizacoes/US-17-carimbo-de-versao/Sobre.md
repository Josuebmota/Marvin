---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-17 — o `marvin` crava a versão com que montou a base

**Por quê:** o script não sabe a própria versão, e a base montada não sabe com qual foi
montada. A tabela `ATUALIZACOES` (passo 10) acha bloco faltando por marcador, um a um — funciona,
mas quem abre um projeto de meses atrás não tem como responder "de que versão para que versão
estou migrando", e nada no início da sessão avisa que a base ficou para trás. Ideia do Josué,
17/09/2026, ao rever o Parci: *"cravar qual tag do marvin ele está, assim fica mais fácil a
migração"*.

**Pronto quando:** `.marvin/ferramentas.md` ganha `marvin_montado:` (escrito uma vez, nunca
reescrito) e `marvin:` (a última passada) no frontmatter; o script lê a própria versão do
`package.json` ao lado dele; `marvin` reescreve `marvin:` só quando muda (idempotente, via
`fsw`); o passo 10 abre com *"montado com X · última passada Y · esta é Z"* e cada entrada nova
da tabela diz `desde:`; `--status --curto` avisa em uma linha quando `marvin:` ≠ versão do
script; `node teste.mjs` verde.

**Não entra:** reescrever `marvin_montado` em base antiga (fica `< 1.8.0`, que é a verdade);
`desde:` nas entradas antigas da tabela (data desconhecida; só as novas ganham).

## Fluxos ligados
- [../../../../Contexto/Fluxos/README.md](../../../../Contexto/Fluxos/README.md)

## Código tocado
- `marvin.mjs`
- `teste.mjs`
- `package.json`

## Time
`po` · `dev-back` · `tl` (o registro é do usuário: escrever nele só o mínimo, e nunca apagar linha).

## Skills
nenhuma.

## Rumo
- **17/09/2026** — aberta.

- **17/09/2026** — implementada: `SELF_VERSION` lida do `package.json` ao lado do script (`import.meta.url`); carimbo no frontmatter de `ferramentas.md` no fim do bloco 0b (`marvin_montado` uma vez — `"< X"` em base que já existia sem carimbo —, `marvin` só quando muda); `STAMP_BEFORE` guarda o que o registro dizia antes da passada para o passo 10 dizer *montado com X · última passada Y · este é Z*; `desde:` por entrada nova; uma linha no `--status --curto` quando a base está atrás. Caso 14 no `teste.mjs` (6 checks). Próximo: junto com a US-16, `--release 1.8.0` — o carimbo do Parci vai dizer `1.7.1 → 1.8.0` na primeira passada depois de publicar.

## Evidência
**17/09/2026** — commit `a205546`, CI verde nos três SO (run 35262684329: ubuntu, windows, macos — 236 checks). No Parci: 29 US `refinada`, 12 ilhas no hook, carimbo `"< 1.7.1"` → `1.7.1`.
