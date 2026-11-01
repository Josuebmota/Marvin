---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-100-matriz-canonica-de-esforco
description: "Anotação: uma matriz canônica de modelo e esforço (papel, atividade e sinal), com a escada de valores por modelo, subida, descida e registro."
---
# US-100-matriz-canonica-de-esforco

**Por quê:** hoje a matriz vive em três lugares que não se validam (glossário `Equipe.md`, tabela do `CLAUDE.md` sem esforço, `eccCost()` no `marvin.mjs`). A régua da US-92 diz 'um degrau acima' sem definir a escada: baixo, médio e alto são rótulos, não os valores low, medium, high, xhigh e max, e nada diz se o degrau acima de Sonnet · médio é Sonnet · alto ou Opus · médio. As decisões de régua têm n=1 ou n=2 (US-92, 96 e 97, sem braço de controle).
**Pronto quando:** _(a refinar)_ — esboço: um arquivo com a escada por modelo, a regra de subida e descida por sinal e por papel, e a fonte única que o glossário, o `CLAUDE.md` e o `eccCost()` apontam; aplicar a régua em 3 a 4 US com registro de custo antes de tratá-la como validada.

**Não entra:** ranking de fornecedores; equivalência de esforço entre modelos; juiz LLM por prompt (Jev descartado em 01/11).

## Rumo
- **01/11/2026** — anotada na conversa de 01/11 sobre o desenho do fluxo do Marvin. A evidência vem de 31/10 e 01/11; falta o refino (`/refinar`) com `tl` e `po`.
