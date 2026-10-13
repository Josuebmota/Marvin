---
tipo: us
estado: refinada
pai: ../Sobre.md
---
# US-33 — avaliar o Agent Skills (Addy Osmani) contra o fluxo do Marvin

**Por quê:** um reel (13/10/2026, stack de 5 ferramentas para Claude Code) apresenta o **Agent Skills**, repositório open source do Addy Osmani que divide o trabalho do agente em skills por etapa — especificação → planejamento → construção → teste → review/debug → segurança — para a IA não "se perder" em contexto longo. É o mesmo problema que o Marvin resolve com `/us` + `po` + `tl` + `qa` + Rumo. Pedido do Josué: comparar e, **se for melhor, a gente usa**. Hoje só há a descrição do reel; nenhum repositório foi lido.
**Pronto quando:** o repositório do Agent Skills foi lido (README + estrutura + 2 skills por dentro, não só o reel) e esta US registra **o que ele faz que o Marvin não faz**, **o que se sobrepõe**, **onde ele é melhor** e **uma decisão** (adotar como ferramenta registrada / portar skills específicas para `.claude/skills/` / só citar no README / descartar), com o motivo. Se a decisão for adotar ou portar, vira US própria pela skill `adaptador-de-ferramenta` — esta só avalia.

**Perguntas a responder:**
1. As etapas dele (spec, plano, build, teste, review, segurança) cobrem algo que os papéis do Marvin não cobrem — em especial **segurança** (o Marvin só chama `sec` quando a atividade pede)?
2. Guarda estado no repo (o nosso guarda: `Sobre.md` + Rumo + `onde_paramos`) ou só na sessão? Sem estado versionado, não substitui — no máximo complementa.
3. Funciona fora do Claude Code (Codex, Cursor)? O Marvin é "um `AGENTS.md`, N adaptadores": skill que só roda numa ferramenta entra como opcional.
4. Custo de contexto: quantas linhas carrega por sessão? Comparar com a medição da [US-29](../../../time/roteamento/US-29-medir-economia-do-roteamento/Sobre.md).
5. **Confiança:** qualquer adaptador sai com confiança **baixa** e aviso até medir (invariante 3).

**Precedente:** [US-25](../US-25-avaliar-superpowers-e-octopus/Sobre.md) — mesma forma de avaliação.

**Não entra:** implementar adaptador, mexer em `marvin.mjs`, instalar na máquina de alguém.

## Código tocado
Nenhum (avaliação).

## Time
- `po`: perguntas e decisão.
- `tl`: lê o repositório e compara com o `AGENTS.md`.

## Skills
Nenhuma.
