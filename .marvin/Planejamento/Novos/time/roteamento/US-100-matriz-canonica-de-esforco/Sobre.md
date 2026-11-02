---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-100-matriz-canonica-de-esforco
description: "Definir em uma frase o 'degrau acima' da régua (esforço antes de modelo) e apontar a tabela do CLAUDE.md para ela; a fonte única e a escada completa ficam para depois."
---
# US-100 — o degrau acima da régua, definido em um lugar

**Por quê:** a régua da US-92 diz "sinal alto = um degrau acima da partida", mas não define o degrau, e a matriz vive em três lugares que não se validam: o template do `Equipe.md` (`marvin.mjs:3215-3226`, `qa` e `infra` em Sonnet · baixo), a tabela do `CLAUDE.md` (só modelo, sem esforço) e o `eccCost()` (`marvin.mjs:2578`: opus·medium, haiku·low, sonnet·medium). Não há caso medido de escolha errada causada por isso (`po`): é ambiguidade de texto, não incidente.
**Pronto quando:**
1. O `delegacao.md` (seção "Régua de esforço por etapa") define o degrau acima com a fonte do valor (a documentação do Claude Code já citada em `triagem.md`), e a tabela do `CLAUDE.md` aponta para lá.
2. Nada além disso: **sem fonte única nova e sem escada completa por modelo.** O alinhamento do `eccCost()` com o glossário e a marca em `UPDATES` ficam para uma US filha, só depois de 3 a 4 US com a régua aplicada e custo registrado (a medição não é entrega desta US).

**Não entra:** juiz LLM; ranking de fornecedores; equivalência de esforço entre modelos; mexer no `eccCost()` e no template do `Equipe.md` (isso exige `UPDATES` e escreve no disco de outros projetos).

## Perguntas
- ~~❓ O degrau acima de Sonnet · médio é **Sonnet · alto** (esforço antes de modelo, como a US-96 e a US-97 fizeram) ou **Opus · médio**? Só o dono decide, e é o único pedaço que paga já.~~ → **Sonnet · alto** (dono, 01/11/2026): esforço antes de modelo.
- ~~❓ Esta US vira uma linha dentro da **US-89** (subir degrau por check) ou fica separada? O `po` sugeriu fundir.~~ → **fica separada** (dono, 01/11/2026).
- ~~❓ Autoriza editar a tabela do `CLAUDE.md` (arquivo seu)?~~ → **autorizado** (dono, 01/11/2026): só um ponteiro de uma linha na tabela.

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md) · [Equipe](../../../../../Contexto/Equipe.md)

## Código tocado
- `.marvin/Contexto/Fluxos/delegacao.md` — "Régua de esforço por etapa"
- `CLAUDE.md` — tabela de modelo por atividade

## Time
Triagem 01/11/2026 (`tl` e `po` em Opus · médio; régua: só texto de documentação → médio).

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| responder as ❓ | dono | n/a | decisão de rumo, só do dono | feito 01/11 |
| escrever a frase e o ponteiro | sessão principal | Sonnet · médio | texto; sem código | feito 02/11 |
| conferir | qa | Sonnet · baixo | links e `git diff --check` | feito 02/11: links existem, `git diff --check` limpo (conferido na sessão principal) |

Grafo (01/11): `eccCost()` só é chamado por `eccAgent()`; esta versão não toca código, então não há mais nada a consultar.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 1 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-84 — quebrar o `delegacao.md` e ligar os órfãos](../../../../Manutencao/publicacao/contexto-fixo/US-84-quebrar-delegacao-e-ligar-orfaos/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-28 — mapa de personas, skills e modelos (Claude e ChatGPT/Codex) e arranjos por disponibilidade](../US-28-modelos-por-papel-claude-e-chatgpt/Sobre.md) — 1 nó(s) em comum
- [US-92 — Régua escrita de modelo e esforço por atividade, aplicada pelo tl e pelo po (e pelo subagente ao devolver)](../US-92-regua-de-esforco-por-atividade/Sobre.md) — 1 nó(s) em comum
- [US-97 — três pendências da régua e do ECC](../US-97-tres-pendencias-da-regua-e-do-ecc/Sobre.md) — 1 nó(s) em comum

## Rumo
- **01/11/2026** — anotada na conversa de 01/11 com escopo grande (matriz canônica); o crivo cortou. **Divergência `po` × `tl`, trazida ao dono:** o `po` quer só a frase (a US é majoritariamente especulação, sem incidente); o `tl` quer também o arquivo de escada, o alinhamento do `eccCost()` e o template (US "nova", dividir, `tl` no diff, `UPDATES`). Gravei a versão do `po` porque a do `tl` depende de n=3–4 da US-92; a parte do `tl` fica como US filha.
- **01/11/2026** — ❓ respondidas pelo dono: o degrau acima de Sonnet · médio é **Sonnet · alto** (esforço antes de modelo); fica separada da US-89; edição do `CLAUDE.md` autorizada, só um ponteiro de uma linha. Pronta para executar; a parte do `tl` (alinhar `eccCost()` e template) segue como US filha, depois de 3 a 4 US com a régua.
- **02/11/2026** — **feito.** `delegacao.md` (seção "Régua de esforço por etapa") define o degrau acima: o esforço acima no mesmo modelo (Sonnet · médio → Sonnet · alto) e só depois a troca de modelo, com a fonte dos valores na documentação de subagentes já citada em `triagem.md`; o `CLAUDE.md` ganhou um ponteiro de duas linhas para a régua (autorizado pelo dono). Sem código, sem subagente: sessão principal em Sonnet · médio, como a régua previu (texto de documentação). A parte do `tl` (alinhar `eccCost()` e o template do `Equipe.md`, com `UPDATES`) segue como US filha, depois de 3 a 4 US com a régua.

## Evidência
Régua em `delegacao.md`; ponteiro em `CLAUDE.md`. Commit: `git log --grep "US-100 concluída"`.
