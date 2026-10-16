# Marvin

Script Node sem dependências que monta a carapaça da LLM: memória, equipe com papéis,
cerimônias e roteamento de custo — uma equipe barata. Uso: [README.md](README.md).

> **Fonte de verdade deste projeto, independente de ferramenta.** O `CLAUDE.md` é ponteiro.
> Estado corrente: `.marvin/Memoria/onde_paramos.md` — versionado e **público**
> ([por quê](.marvin/Contexto/Arquitetura/higiene-repo-publico.md)).
> Este arquivo carrega em toda sessão: regra de um assunto mora onde o assunto é lido.

## Estrutura real

| Arquivo | O que é |
|---|---|
| `marvin.mjs` | o script inteiro, zero dependência |
| `teste.mjs` | smoke test dos invariantes, hermético ([CI e portabilidade](.marvin/Contexto/Arquitetura/ci-em-tres-sistemas.md)) |
| `PROMPT.md` | o prompt que guia a escrita dos agentes (o script não escreve) |
| `README.md` / `README.pt-BR.md` | documentação pública, inglês e português |
| `.marvin/ferramentas.md` | ferramentas opcionais que ESTE repo usa e o alcance de cada uma |

## Comandos canônicos

Use **exatamente** estes — não adivinhe. Não há build.

| O quê | Comando | De onde saiu |
|---|---|---|
| Instalar | `npm install` | `no lockfile — npm is the default` |
| Testar | `npm run test` | `package.json > scripts.test` |

A coluna da direita impede a tabela de envelhecer em silêncio: mudou o `package.json`, é aqui
que se confere. O pacote é `marvin-kb`, o comando é `marvin` (`npx marvin` é de outra pessoa); do clone,
`node marvin.mjs`. O `package.json` existe só para dar `bin` e **nunca** terá
`dependencies` ([por quê](.marvin/Contexto/Arquitetura/publicacao-no-npm.md)).

## Invariantes

**1. Nunca destruir dado sem conferir antes.** A migração de memória copia, **confere a
contagem** e só então apaga. Se copiou menos do que a origem, aborta e não apaga nada.

**2. Idempotente sempre.** Rodar duas vezes não pode duplicar nem sobrescrever. Todo
bloco de escrita é guardado por `if (!fs.existsSync(...))`.

**3. Não inventar convenção de ferramenta.** Adaptador de confiança média/baixa sai com
aviso mandando conferir. **Adaptador que não carrega falha em silêncio** — pior que
adaptador ausente.

**4. O script não escreve conteúdo que exige conhecer o projeto.** Sobre a equipe, ele
escreve só o glossário genérico (`.marvin/Contexto/Equipe.md`): papel, especialidade,
atribuições, quando entra e o que não faz, igual em todo projeto, sem stack, caminho nem armadilha. É
referência lida na triagem; nunca vai para `.claude/agents/`, nunca é importado com `@`, e
não é lista do que criar: um papel só vira arquivo de agente com uma armadilha concreta do
código, escrito pelo `tl` e pelo `po` na primeira rodada com a LLM depois de instalar (que só
**propõe**, só para fronteira detectada) ou na US que o pede; skill, na segunda execução. O
corpo de agentes, de skills e do `AGENTS.md` nunca sai do `marvin.mjs` — exceto a cópia literal do catálogo ECC (adendo abaixo). O script pode **mostrar** o que o diagnóstico sugere; quem decide e escreve é quem conhece o
projeto. (08/10/2026: o sujeito passou a ser a atividade; 15/10/2026: a instalação traz o glossário;
16/10/2026, decisão do dono: graphify, ponytail e ECC são obrigatórios para baratear o custo, e o script
passa a **instalar** agentes e skills do ECC — copiados do catálogo, só os que o projeto usa, com
`model`/`effort` pela matriz do glossário; o `AGENTS.md` e o corpo escrito à mão continuam fora do script.)

## Armadilhas

- **Junction:** `rm -rf` num junction pode apagar o destino; renomear a pasta quebra a
  junction em silêncio (`marvin --check` diagnostica, `marvin` conserta); o caminho da
  memória vem do `cwd`, e git worktree é outro `cwd`. Detalhes e receita manual:
  [junction-quebrada.md](.marvin/Contexto/Arquitetura/junction-quebrada.md).
- **O `--dry-run` só é honesto porque toda escrita passa por `fsw`/`exec`.** Escrita nova
  que chame `fs.writeFileSync` direto faz o dry-run mentir em silêncio.
- **A tabela `UPDATES` (passo 10) é mantida à mão.** Seção nova em template gerado precisa
  de uma marca lá (`desde: '<versão>'`, regex com `\s+`), senão quem montou na versão anterior
  nunca fica sabendo. Texto removido do template que era marca vira aviso falso. Já falhou
  uma vez: não cobria o `.gitignore`, e este repo ficou meses sem o bloco de segredos.
- **Convenção de ferramenta muda rápido.** Cursor/Aider/Zed estão em confiança média/baixa
  **de propósito**. Se confirmar alguma, atualize os **dois** READMEs e o selo no `marvin.mjs` juntos.
- **Não usar `Date.now()` nem `Math.random()`** — determinístico para ser idempotente. Única
  exceção: `days()`, idade só exibida no `--status` e no `index.html` git-ignorado.

## Como se trabalha aqui

- **A nota aponta; o nó guarda.** `onde_paramos.md` é só lista de links; estado, decisões e
  Rumo moram no `Sobre.md` da US ([por quê](.marvin/Contexto/Arquitetura/organizacao-por-grafo.md)).
  Uma seção de relato dentro da nota é o mesmo erro que arquivo novo.
- **Antes de qualquer US**, a triagem do `tl` com o `po` (partindo do grafo — obrigatório
  neste repo): time, skills, modelo e esforço por etapa no *Time* da US; a Disponibilidade de IA
  declarada não prova acesso. A sessão principal coordena e
  delega; passa pelo `tl` antes de fechar a mudança que toca invariante, escreve no disco de
  alguém ou mexe em `UPDATES`/`--release` (dono, 15/10: por risco, não sempre). Regras completas:
  [delegacao.md](.marvin/Contexto/Fluxos/delegacao.md). Glossário: `.marvin/Contexto/Equipe.md`.
- **Higiene de sessão:** contexto acumulado custa em toda requisição. Quando sugerir chat
  novo está no rodapé de `/retomar`. Registrar antes de sugerir.

## Convenções

- Inglês no código e no comentário; português na base `.marvin/`, nos agentes e no commit
- Zero dependência. Se precisar de pacote, provavelmente é sinal de estar fazendo demais
- Nunca commitar caminho pessoal nem nome de projeto de cliente — use `<caminho>`, também no
  **texto do commit**
- **Rode `node teste.mjs` antes de qualquer commit**
- **Antes de qualquer push:** `pwd && git remote -v && git log --oneline -1` — em 03/08 um
  push rodou dentro de **outro repositório**
- **Commit daqui não leva `Co-Authored-By`** (`"includeCoAuthoredBy": false` no
  `~/.claude/settings.json`; se reaparecer, é outra máquina ou perfil)
- Antes de fechar: `git status --short` e uma justificativa por arquivo novo

## Ferramentas

**Ponytail** (confiança baixa) e **graphify**: o que cada uma faz e o que não substitui
(invariantes, `tl` no diff, `teste.mjs`) em [ferramentas.md](.marvin/ferramentas.md).
