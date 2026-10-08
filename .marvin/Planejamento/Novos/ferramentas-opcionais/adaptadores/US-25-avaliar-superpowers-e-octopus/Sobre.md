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
  — ler `obra/superpowers` e `nyldn/claude-octopus` (README, estrutura, o que escrevem em disco); estado: feita (08/10/2026, clone raso de `obra/superpowers@8ca22db` e `nyldn/claude-octopus@4d152db`, só leitura; achados no *Rumo* com o arquivo de origem); aplicado: não confirmado; check: cada afirmação cita o arquivo do repo de onde veio
- po · capacidade: julgamento de escopo · modelo/ferramenta/esforço: a definir na execução
  — dizer se cada candidato resolve algo **medido** ou é especulação; estado: pendente; aplicado: não confirmado
- tl · capacidade: julgamento sobre invariantes · modelo/ferramenta/esforço: a definir na execução
  — conferir a decisão contra os invariantes 3 e 4 e contra "zero dependência"; estado: pendente; aplicado: não confirmado

## Skills
- `adaptador-de-ferramenta` — já existe; só entra se a decisão for adaptar (outra US)

## Rumo
- **08/10/2026** — aberta a partir de um reel; o reel foi analisado por vídeo (vidIQ), sem ler repositório. Descartados de saída: Karpathy Skills (Ponytail cobre) e I-Have-ADHD (preferência pessoal). Feature escolhida: `adaptadores`, por ser onde mora o registro de ferramentas opcionais; se o foco acabar sendo roteamento por modelo, a US pode mudar para `time/roteamento`.
- **08/10/2026 — leitura dos dois repositórios (scout).** Fonte: clone raso, só leitura; nada instalado nem executado. Ambos MIT.
  - **Superpowers 6.4.2** (`obra/superpowers`): 15 skills em `skills/` (~3.900 linhas) + hook `session-start`; sem dependência de provedor externo. **Guarda estado no repo:** `brainstorming` grava a spec em `docs/superpowers/specs/AAAA-MM-DD-<tema>-design.md` e commita; `writing-plans` grava o plano em `docs/superpowers/plans/`. `subagent-driven-development` despacha um subagente novo por tarefa com revisão de spec e de qualidade por tarefa, e **manda não parar para perguntar entre tarefas** — só para em operação irreversível/destrutiva, ação sensível de segurança, efeito fora do worktree (merge, push, publish) ou plano quebrado; decisões viram `Ruling:` num ledger. `test-driven-development` exige ver o teste falhar antes. Funciona em ~16 harnesses (Claude Code, Codex, Gemini CLI, Copilot CLI, Cursor…).
  - **Claude Octopus 11.12.0** (`nyldn/claude-octopus`): 61 skills, 54 comandos, 31 personas; `scripts/orchestrate.sh` com 3.368 linhas. **Dormente por padrão** — só roda com `/octo:*`. Zero provedor externo para começar; até 12 integrações opcionais (Codex, Copilot, Qwen, Ollama, Perplexity, Grok, Kimi…), cada uma detectada e só usada dentro de workflow explícito. Consenso com portão de 75% e `/octo:council` (3/5/7 personas, quorum, veto crítico, teto de custo). **Estado fora do repo:** `~/.claude-octopus/` (preferências, uso, logs) e `.octo/` no projeto (planos, triagem). Exige Claude Code 2.1.14+; Windows só via WSL.
  - **Resposta à pergunta 1 (o Superpowers é melhor que o nosso?):** não é "melhor", é **outro desenho**. Onde ele é mais forte: execução longa e autônoma por subagente isolado com revisão por tarefa, e TDD obrigatório. Onde o nosso é mais forte: grafo (Fluxos ligados, Código tocado, Impacto, ilhas), memória/Rumo versionados, time por tarefa registrado (solicitado × aplicado) e invariantes do projeto. **Sobreposição direta:** a spec aprovada do Superpowers (`docs/superpowers/specs/`) é o que o `Sobre.md` + `po` já fazem — dois lugares para a mesma decisão seria o erro que a nota de memória já proibiu ("arquivo novo"). **Lacuna real nossa:** o fluxo `delegacao.md` manda decompor e escolher, mas não define execução autônoma por subagente com revisão por tarefa nem TDD obrigatório.
  - **Resposta à pergunta 2 (Octopus):** cabe **só como ferramenta opcional registrada**, nunca dentro do `marvin.mjs` — a regra de zero dependência vale para o script, e o Octopus é plugin do usuário. Responde à parte da US-19 que hoje é só texto: *consenso/revisão cruzada entre provedores*. Mas ele traz o **próprio roteamento de modelo** (roster padrão, `/octo:model-config`) — dois roteadores no mesmo projeto disputariam a decisão que a US-19 quer registrar por tarefa. Detectar instalação é viável; o alcance (`ferramentas.md`) seria "só sessões Claude/Codex com o plugin; estado em `~/.claude-octopus/` e `.octo/`, que o Marvin não lê".
  - **Proposta, ainda sem decisão de `po`/`tl`:** (a) **Octopus → adaptar, confiança baixa**, como o Ponytail, e só depois da US-19 medir 3–4 US (sem medida, é especulação); (b) **Superpowers → só citar no README** como complemento de execução, **não** adaptar: o ganho que ele tem (subagente por tarefa, TDD) é uma regra a escrever em `delegacao.md`, não um plugin a registrar, e o que se sobrepõe duplicaria o `/us`; (c) **sem tocar `marvin.mjs`**. Falta: `po` confirmar (a) e (b); `tl` conferir contra os invariantes 3 e 4.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
