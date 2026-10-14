---
tipo: us
estado: concluida
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

## Avaliação — 14/10/2026
Lidos o [repositório](https://github.com/addyosmani/agent-skills) (README, estrutura) e duas skills por dentro: `security-and-hardening` (~200 linhas) e `spec-driven-development` (~230 linhas). A de plano só pelo nome. MIT, ~106 mil stars, push em 13/10/2026: muito ativo. São 25 skills (24 de ciclo de vida + a meta-skill `using-agent-skills`), 9 comandos (`/spec`, `/plan`, `/build`, `/test`, `/review`, `/ship`…) e 4 personas.

1. **Cobertura além do Marvin:** segurança é a diferença real (STRIDE, limites Always/Ask First/Never, SSRF, segredos, dependências, checklist). Também performance, observabilidade, CI/CD e deprecação. No Marvin, o `sec` só entra quando a atividade pede; a lacuna é de **gatilho**, não de papel.
2. **Estado:** parcialmente versionado (spec em `SPEC-*.md`, `tasks/plan.md`, `tasks/todo.md`, commit por tarefa no `/build auto`), mas em arquivos próprios e sem caminho fixo. Não há equivalente ao Rumo, ao `onde_paramos` nem ao grafo. Os hooks não foram lidos.
3. **Fora do Claude Code:** sim. `SKILL.md` padrão mais manifestos para Claude, Codex e `.agents`; o README lista Cursor, Gemini CLI, Windsurf, OpenCode, Copilot e Kiro.
4. **Custo de contexto:** ~2,5–3,5 mil tokens por skill lida. As skills carregam sob demanda pela meta-skill. Não foi confirmado se algum hook injeta contexto fixo. Sem comparação com a US-29.
5. **Sobreposição:** spec, plano e tarefas contra `/us` + `po` + `Sobre.md`; review contra `tl` + `qa`. O risco é o da US-25: dois lugares para a mesma decisão.
6. **Onde é melhor:** segurança e checklists de verificação (tabelas de racionalização e "red flags"), amplitude e portabilidade.

**Decisão: só citar no README**, ao lado do Superpowers, com a regra "decisões ficam na US" e a indicação de ler a skill de segurança quando uma US pedir `sec`. **Não adotar** como ferramenta registrada: duplicaria `Sobre.md`/`po`/`tl`, a detecção seria frágil (25 skills, três caminhos de instalação) e a confiança seria baixa (invariante 3). **Portar `security-and-hardening` para `.claude/skills/`** fica como candidata e não abre US agora: primeiro precisa haver um Rumo em que a falta do `sec` tenha custado algo (lacuna medida, não especulada). Então vira US pela skill `adaptador-de-ferramenta`.

## Código tocado
Nenhum (avaliação).

## Time
- `po`: perguntas e decisão.
- `tl`: lê o repositório e compara com o `AGENTS.md`.

## Skills
Nenhuma.

## Rumo
- **13/10/2026** — aberta e refinada (reel de 13/10).
- **14/10/2026** — ativa (Josué pediu para desenvolver todas as pendentes). Pesquisa do repositório delegada.

- **14/10/2026** — avaliada e concluída: só citar no README; portar a skill de segurança fica condicionado a uma lacuna medida.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- Leitura do repositório em 14/10/2026 (README, estrutura, `skills/security-and-hardening/SKILL.md`, `skills/spec-driven-development/SKILL.md`); citação nos dois READMEs, ao lado do Superpowers.
