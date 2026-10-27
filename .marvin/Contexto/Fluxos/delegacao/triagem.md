---
pai: ../delegacao.md
---
## Triagem — quem decide o time da atividade (US-26, 08/10/2026)

↩ [Fluxo delegação](../delegacao.md)


O dono (PM) passa a demanda; o **`tl` e o `po` fazem a triagem juntos**, com o contexto
inteiro da US: quem deve tocar, quais agentes e skills a atividade pede (só os que ela usa,
mais `design`/`dba`/`sec`/`infra` quando for o caso), com que **esforço** e **modelo**. É o
passo 2 do `/us`, agora com dono explícito; não é uma etapa nova.

- **Registro:** o resultado vai no *Time*/*Skills* da US. Agente ou skill novos nascem aí; só
  viram arquivo em `.claude/agents/` ou `.claude/skills/` com uma armadilha concreta (agente)
  ou na segunda execução (skill). Quem escreve o corpo é o `tl`+`po`, não o script.
- **O `tl` e o `po` também são escolhidos por atividade.** O `model:` do frontmatter é só o
  padrão; a chamada Agent aceita `model` por chamada. Em Claude Code v2.1.292+,
  [a chamada Agent também aceita `effort`](https://code.claude.com/docs/en/sub-agents#choose-an-effort-level),
  que prevalece sobre o frontmatter; `CLAUDE_CODE_EFFORT_LEVEL` prevalece sobre ambos.
  Em versão anterior, usar frontmatter ou herança da sessão e registrar a origem.
  Conferir versão e configuração aplicada. Esforço menor nunca reduz a revisão dos invariantes.
  **Ao delegar, o esforço vai explícito:** `model` e `effort` da linha do *Time* na chamada, e
  a etapa sem esforço declarado não roda. A ferramenta só aceita `effort` com autorização escrita
  do dono no `CLAUDE.md` (US-29, critério 4).
- **Grafo na triagem — obrigatório neste repo (dono, 08/10/2026; nos projetos que o Marvin
  monta continua opcional):** o `tl` e o `po` **sempre** partem do
  grafo: a seção *Impacto* e as ilhas da US dizem quem depende do que ela toca e qual o
  tamanho. O graphify é uma ferramenta **obrigatória da triagem**, instalada à parte
  (`uv tool install graphifyy` ou `pipx install graphifyy` — não é pacote npm, e o
  `package.json` continua sem dependências). Se o grafo faltar ou estiver velho
  (`marvin --graphify`), a triagem **não segue em silêncio**: registra "grafo ausente ou
  velho" no *Time*, diz o que ficou sem *Impacto* e só então usa Grep/Glob como fallback
  declarado. Para **localizar** arquivo ou símbolo, Grep/Glob continua mais barato (medido:
  ~1.650 tk pelo grafo contra ~18 com glob). Que o grafo economize tokens na triagem é
  **hipótese**, medida na US-19, nunca promessa.
  **Desde 15/10/2026 (dono):** o grafo é passo obrigatório de **estrutura** no `tl`, no `po`
  e em `/us`, `/refinar` e `/retomar`. Antes de decidir, `graphify affected` e `graphify
  explain` rodam sobre cada símbolo do *Código tocado*, e o *Time* registra o que eles
  responderam. O grafo é mantido fresco pelo hook `post-commit` (`marvin --graphify
  --graphify-git-hook`). Grep/Glob seguem só para localizar.
