---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-25 — avaliar Superpowers e Claude Octopus contra o fluxo do Marvin

**Por quê:** um reel (08/10/2026) recomenda 4 plugins para Claude Code; dois tocam o que o Marvin já faz — o Superpowers (spec aprovada → TDD com subagentes → plano) concorre com `/us` + `po` + `tl` + `qa`, e o Claude Octopus (consenso multi-modelo) pode alimentar a US-19. **Hoje só há a descrição do reel, nenhum repositório foi lido** — qualquer "é melhor" seria opinião.
**Pronto quando:** `obra/superpowers` e `nyldn/claude-octopus` foram lidos (README + estrutura, não só o reel) e esta US registra, para cada um, **o que faz que o Marvin não faz**, **o que se sobrepõe** e **uma decisão** (adaptar / só citar no README / descartar) com o motivo. Se a decisão for adaptar, vira uma US própria pela skill `adaptador-de-ferramenta` — esta só avalia.

**Já decidido (08/10/2026):**
- *Karpathy Skills* — coberto pelo Ponytail (`.marvin/ferramentas.md`); não instala de novo.
- *I-Have-ADHD* — preferência de estilo de resposta de uma pessoa; fora do repo.

**Perguntas a responder:**
1. **Superpowers:** o TDD com subagentes isolados e a spec aprovada *antes* de codar são melhores que o nosso fluxo? Guarda estado no repo (o nosso guarda: `Sobre.md` + Rumo) ou só na sessão? Cabe como ferramenta *opcional* sem competir com `/us`?
2. **Octopus:** depende de quantos provedores externos? Isso é compatível com "zero dependência" se ficar só como ferramenta registrada (nunca dentro do `marvin.mjs`)? Que parte da US-19 ele responderia (escolha por capacidade, consenso, revisão cruzada)?
3. **Confiança:** qualquer adaptador sai com confiança **baixa** e aviso até medir (invariante 3).

**Não entra:** implementar adaptador, mexer em `marvin.mjs`, instalar plugin na máquina de alguém.

## Fluxos ligados
- [delegação](../../../../Contexto/Fluxos/delegacao.md) — o Octopus é candidato a "escolha por etapa" da US-19

## Código tocado
- `.marvin/ferramentas.md` — só se a decisão for registrar uma ferramenta nova (e aí é outra US)

> Nenhum arquivo de código por enquanto: a avaliação não escreve no script. Sem nó de código, o grafo não calcula *Impacto* — esperado.

## Time
Decomposição (conforme [delegação](../../../../Contexto/Fluxos/delegacao.md)): **pesquisa** (ler 2 repositórios) → **julgamento** (sobreposição e decisão) → **registro** (esta nota). Sem código, o risco é baixo: o check é `git diff --check` + revisão de conteúdo. Modelo/ferramenta/esforço **concretos** ficam a escolher na hora, entre os acessos que a sessão tiver; nada aqui presume fornecedor.
- scout · capacidade: leitura de repositório público e resumo estruturado · modelo/ferramenta/esforço: a definir na execução
  — ler `obra/superpowers` e `nyldn/claude-octopus` (README, estrutura, o que escrevem em disco); estado: pendente; aplicado: não confirmado; check: cada afirmação da US cita o arquivo do repo de onde veio
- po · capacidade: julgamento de escopo · modelo/ferramenta/esforço: a definir na execução
  — dizer se cada candidato resolve algo **medido** ou é especulação; estado: pendente; aplicado: não confirmado
- tl · capacidade: julgamento sobre invariantes · modelo/ferramenta/esforço: a definir na execução
  — conferir a decisão contra os invariantes 3 e 4 e contra "zero dependência"; estado: pendente; aplicado: não confirmado

## Skills
- `adaptador-de-ferramenta` — já existe; só entra se a decisão for adaptar (outra US)

## Rumo
- **08/10/2026** — aberta a partir de um reel; o reel foi analisado por vídeo (vidIQ), sem ler repositório. Descartados de saída: Karpathy Skills (Ponytail cobre) e I-Have-ADHD (preferência pessoal). Feature escolhida: `adaptadores`, por ser onde mora o registro de ferramentas opcionais; se o foco acabar sendo roteamento por modelo, a US pode mudar para `time/roteamento`.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
