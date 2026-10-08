---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-27 — atualizar a base do Marvin com o que o próprio Marvin gera

**Por quê:** o produto andou (2.0.0 → 2.1.0) e a base **deste repo** ficou para trás. Medido em 08/10/2026 com `node marvin.mjs --dry-run --no-questions` (não escreve nada): o passo 10 acusa **10 itens** na base do próprio Marvin. O script não reescreve arquivo que já existe; só avisa. Atualizar é trabalho à mão, e parte do aviso é só frase escrita com outras palavras (a marca procura o texto exato do template), parte é lacuna real.

**Pronto quando:** `node marvin.mjs --dry-run --no-questions` sobre este repo **não acusa nenhum item** no passo 10 (a única linha que pode sobrar é o aviso de memória/junction, que é do container, não da base); `node teste.mjs` segue verde (286 passaram, 0 falharam); nenhum arquivo do repo perdeu conteúdo próprio (o corpo do `AGENTS.md`, o invariante 4 reescrito e as personas escritas à mão ficam). Cada item aplicado vira uma frase **no vocabulário do repo**, não colagem do template.

**Os 10 itens acusados (dry-run de 08/10/2026, versão do pacote 2.1.0):**
1. `AGENTS.md` — falta o ponteiro "disponibilidade de IA: declaração não prova acesso" (desde 2.0.0).
2. `.claude/agents/README.md` — falta "modelo/esforço por atividade sem fornecedor fixo" (2.0.0).
3. `CLAUDE.md` — falta a mesma seção, versão Claude Code (2.0.0).
4. `.claude/commands/us.md` — falta o passo de disponibilidade/glossário (`Escolher capacidades`, 2.0.0).
5. `.marvin/Planejamento/README.md` — falta a seleção por disponibilidade ao propor o time (2.0.0).
6. `.marvin/Planejamento/README.md` — falta a triagem pelo `tl` + `po` e a regra do grafo opcional (2.1.0).
7. `AGENTS.md` — falta o ponteiro da triagem em "Antes de qualquer US" (2.1.0).
8. `CLAUDE.md` — falta a seção "Grafo de código" (aparece com `--graphify`).
9. `.claude/commands/retomar.md` — falta o passo "duas portas" (desenvolver a ilha do momento, ou `/refinar`) (1.8.0).
10. `.marvin/Planejamento/README.md` — falta o `estado: refinada` (a US refinada espera na fila, não na nota; `--status` agrupa em ilhas) (1.8.0).

**Como fazer (regras para quem executar):**
- Cada marca é uma regex em `UPDATES` no `marvin.mjs` (~3895-4015): **leia a marca** antes de escrever a frase, para a frase casar. Rodar o dry-run depois de cada arquivo é o teste.
- **Conteúdo do repo manda sobre o template:** o `AGENTS.md` já tem triagem e delegação (seção *A sessão principal coordena e delega*, invariante 4 por atividade, graphify obrigatório **neste repo**). O template diz "grafo opcional" — aqui o texto fica como o repo decidiu; a frase nova precisa casar a marca **sem** desfazer a decisão (ex.: citar "o grafo é opcional nos projetos gerados; neste repo é obrigatório").
- Nada de `marvin` real aqui: sem `--dry-run` ele monta a junction de memória no container. Só `--dry-run`.
- Não mexer no `marvin.mjs` nesta US. Se uma marca estiver errada (casa só um texto impossível), é bug do produto: abrir outra US.

## Fluxos ligados
- [montagem](../../../../Contexto/Fluxos/montagem.md) — o passo 10 e a tabela `UPDATES`
- [delegação](../../../../Contexto/Fluxos/delegacao.md) — onde a triagem já está escrita

## Código tocado
- `AGENTS.md`, `CLAUDE.md` — textos à mão (sem função)
- `.claude/agents/README.md`, `.claude/commands/us.md`, `.claude/commands/retomar.md`
- `.marvin/Planejamento/README.md`

> Nenhum arquivo de código (`marvin.mjs` fica de fora). Sem nó de código, o grafo não calcula *Impacto*.

## Time
Decomposição ([delegação](../../../../Contexto/Fluxos/delegacao.md)): **escrita de texto** nos 6 arquivos → **conferência** pelo dry-run → **revisão** do que muda de sentido (o `tl` lê o diff do `AGENTS.md`/`CLAUDE.md`, que têm invariantes). Risco baixo-médio: texto, mas `AGENTS.md` é fonte de verdade. Check: `git diff --check`, `node marvin.mjs --dry-run --no-questions` e `node teste.mjs`. Modelo, ferramenta e esforço concretos: a definir na execução; menor esforço não reduz a verificação.
- `dev-back` · capacidade: edição de texto guiada por regex · modelo/ferramenta/esforço: a definir na execução
  — itens 1–10, um arquivo por vez, dry-run a cada um; estado: pendente; aplicado: não confirmado
- `qa` · capacidade: verificação sem editar · modelo/ferramenta/esforço: a definir na execução
  — dry-run limpo, testes verdes, nenhum conteúdo próprio perdido; estado: pendente; aplicado: não confirmado
- `tl` · capacidade: julgamento sobre invariantes · modelo/ferramenta/esforço: a definir na execução
  — ler o diff de `AGENTS.md` e `CLAUDE.md`; estado: pendente; aplicado: não confirmado

## Skills
- Nenhuma nova. (Se o passo "ler a marca, escrever a frase, rodar o dry-run" se repetir numa 2ª atualização, vira skill.)

## Rumo
- **08/10/2026** — aberta como consequência da US-26 ("primeiro o produto, depois a base dele": `po` e dono). Lista dos 10 itens vem do dry-run, sem escrever nada. Nada aplicado ainda. **Próximo passo:** `dev-back` aplica os itens 1–10 e o `qa` roda o dry-run; o `tl` lê o diff.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
