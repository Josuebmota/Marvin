# Marvin

**Português** · [English](README.md)

[![teste](https://github.com/Josuebmota/Marvin/actions/workflows/teste.yml/badge.svg)](https://github.com/Josuebmota/Marvin/actions/workflows/teste.yml)

Monta a **base de conhecimento** de um projeto para trabalhar com agentes de IA — de um
jeito que sobrevive à troca de ferramenta e de LLM.

Não é um framework, não roda nada em background, não tem dependência. É um script Node
de ~1390 linhas que cria uma estrutura e sai da frente.

```bash
npx marvin-kb --tools=claude,codex
```

> **O pacote é `marvin-kb`, o comando é `marvin`.** O nome `marvin` já estava ocupado no
> npm, então `npx marvin` baixaria o pacote de outra pessoa — use `npx marvin-kb`. Depois
> de `npm i -g marvin-kb`, o comando no seu PATH é só `marvin`.

Ou clone e rode o arquivo direto — é um script único, sem dependência:

```bash
node /caminho/para/marvin/marvin.mjs --tools=claude,codex
```

## O problema que ele resolve

Cada ferramenta de IA quer o contexto do projeto no formato dela: `CLAUDE.md`,
`.cursor/rules/`, `CONVENTIONS.md`, `AGENT.md`, `AGENTS.md`. Quem usa mais de uma acaba
com o mesmo conteúdo em N lugares — e **N cópias divergem**. Na terceira semana uma delas
mente, e o agente confia nela.

Pior: a memória do agente costuma morar no perfil do usuário, fora do repositório. Não
está no git, não tem backup, e some se a máquina morrer.

## Como resolve

**Uma fonte, N adaptadores finos.** Todo o conteúdo durável vive no `AGENTS.md` — o padrão
que Codex, Cursor, Aider, Zed e opencode leem. Os arquivos de cada ferramenta são
**ponteiros de 15 linhas**, sem conteúdo próprio. Divergência fica estruturalmente
impossível.

**Memória dentro do repositório, por junction invertida:**

```
~/.claude/projects/<caminho>/memory  ──junction──►  .docs/08_Memoria/
```

A ferramenta escreve no caminho padrão dela; os arquivos nascem no repositório. Memória
versionada em git, visível como vault do Obsidian, uma fonte só. Se trocar de ferramenta,
**os arquivos ficam** — só o carregamento automático some.

## O que ele cria

```
<projeto>/
├── AGENTS.md                   fonte de verdade — todo o conteúdo durável
├── CLAUDE.md                   adaptador (só se escolher claude)
├── .cursor/rules/projeto.mdc   adaptador (só se escolher cursor)
├── .claude/
│   ├── agents/README.md        guia de como escrever o time
│   ├── skills/README.md        skill × agente × command: o discriminador
│   └── commands/retomar.md     /retomar: a porta de entrada
└── .docs/                      ← vault do Obsidian
    ├── 00_Inicio.md
    ├── 00_Fontes_Externas.md   onde vivem US, roadmap, design
    ├── 08_Memoria/
    │   └── onde_paramos.md     única porta; sempre sobrescrita
    └── 99_Backup/
```

## Onde o vault vai parar — e por que nem sempre é `.docs`

O script **procura um vault existente pelos marcadores** (`08_Memoria/` ou `.obsidian/`),
não pelo nome da pasta. A regra:

| Situação | Resultado |
|---|---|
| Projeto novo | cria **`.docs/`** |
| Já existe vault em `Docs/` (ou `docs/`) | **reaproveita**, não duplica |
| Existe `Docs/` que **não** é vault (documentação do produto) | cria `.docs/` ao lado e avisa: *"convivendo com Docs/ do produto — intocado"* |

O ponto no nome existe para **não colidir com a documentação do produto**. Se o `Docs/` do
projeto já é onde vive o conhecimento, fundir é melhor que separar: os wikilinks entre
memória e docs ficam no mesmo grafo do Obsidian. Separar criaria dois vaults que não se
enxergam, e `[[link]]` de um para o outro quebra.

**Consequência prática:** projetos migrados costumam ficar em `Docs/` e projetos novos em
`.docs/`. Isso é o desenho, não inconsistência. Só renomeie para `.docs` se a pasta for
**100% ferramenta** — e, se renomear, **refaça a junction**, porque ela aponta para o
caminho antigo e fica órfã em silêncio:

```powershell
# PowerShell — remove SÓ o link, nunca o conteúdo
[System.IO.Directory]::Delete("$env:USERPROFILE\.claude\projects\<caminho>\memory", $false)
git mv Docs .docs
New-Item -ItemType Junction -Path "$env:USERPROFILE\.claude\projects\<caminho>\memory" `
         -Target "$PWD\.docs\08_Memoria"
```

Depois atualize as referências a `Docs/` no `AGENTS.md`, no adaptador da ferramenta, no
`retomar.md` e nas notas de memória.

## O que ele NÃO faz, de propósito

**Não escreve os agentes nem o conteúdo do `AGENTS.md`.** Isso exige conhecer as armadilhas
do projeto, e agente genérico é pior que agente nenhum. O `PROMPT.md` tem o prompt que
guia essa parte.

A diferença entre um agente que ajuda e um que atrapalha não é a descrição do papel — é a
armadilha concreta escrita dentro dele. `"você é um dev sênior de React"` não vale nada;
`` "`conta.saldo` é a abertura, não o saldo exibido" `` evita bug.

O mesmo vale para skill: o script cria a pasta e o guia, **nenhuma skill**.

## Agente, skill ou command?

O scaffold traz o discriminador escrito, porque errar aqui é comum:

|  | Onde o texto carrega | Quem usa |
|---|---|---|
| **Agente** | contexto **próprio e limpo** | spawnado, isolado |
| **Skill** | contexto **atual** | quem invoca |
| **Command** | contexto atual | **você** dispara |

> **Fato que o subagente precisa saber** → no `.md` do agente.
> **Procedimento que 2+ papéis executam** → skill.
> **Coisa que você dispara** → command.

**A pegadinha:** subagente nasce com contexto limpo. Não lê `AGENTS.md`, não lê o adaptador,
e não lê skill — a menos que tenha a tool `Skill` na lista dele. Então **repetir um fato
crítico dentro de cada agente que precisa dele não é descuido, é a única forma.** O que não
deve ser repetido é *procedimento*.

**Regra de custo:** skill nova só depois do procedimento ter rodado **duas vezes**. A
descrição de toda skill carrega em toda sessão — trinta skills viram o problema que a skill
deveria resolver.

## Ferramentas

| Flag | Gera | Confiança |
|---|---|---|
| `codex`, `opencode` | nada — leem `AGENTS.md` nativamente | alta |
| `claude` | `CLAUDE.md` + `/retomar` | alta |
| `copilot` | `.github/copilot-instructions.md` | alta |
| `cursor` | `.cursor/rules/projeto.mdc` | **média** |
| `aider` | `CONVENTIONS.md` | **média** |
| `zed` | `AGENT.md` | **baixa** |

O agente do GitHub Copilot também lê `AGENTS.md` em qualquer lugar do repositório, mas o
chat e o completion não — por isso o ponteiro é gerado assim mesmo.

Os de confiança média/baixa saem com aviso no topo mandando conferir a convenção atual.
**Adaptador que não carrega falha em silêncio** — pior que adaptador ausente.

Rodar de novo com outra lista **acrescenta** o que falta; nada é removido.

## Diagnóstico

Além de criar, ele aponta problemas que passam despercebidos:

- **Stack real por diretório** — não confia em nome de pasta
- **Diretório que parece serviço mas está vazio** — evita criar agente para código inexistente
- **Lixo na raiz** — arquivo de nome estranho é comando de shell mal-formado, não conteúdo
- **Arquivo vazio rastreado no git** — quase sempre lixo que entrou num `git add -A`
- **Contexto fixo** — conta agentes, skills e commands por nível e estima quantos tokens
  a `description` de cada um custa em **toda** sessão. Nível global pesado é pago em todo
  projeto, usando ou não. Também avisa quando há mais de 2 níveis com agentes — o mais
  específico vence em silêncio
- **Artefatos de orquestrador antigo** — só aparece se detectar

## Flags

```
--tools=<lista>   adaptadores a gerar. default: claude
                  válidos: claude, codex, copilot, cursor, aider, zed, opencode
                  rodar de novo com outra lista ACRESCENTA o que falta
--check           diagnostica a montagem da memória e sai com código != 0 se ela
                  estiver quebrada. Não escreve nada. Rode depois de mover a pasta
--dry-run         mostra tudo o que faria, sem escrever
--clean-legacy    remove artefatos de orquestrador antigo
--no-git          não roda git init nem gera .gitignore
--graphify        gera o grafo de código para consulta estrutural (requer o graphify no PATH)
--help, -h        uso; sai sem escrever nada
```

### Depois de mover ou renomear a pasta do projeto

A junction sobrevive ao destino. Mova ou renomeie o projeto e ela continua apontando para
o caminho antigo, enquanto o agente cria um **diretório real e vazio** no caminho novo.
Nada avisa: o agente escreve memória, e nada daquilo chega ao repositório.

```bash
marvin --check
```

Só lê, e o código de saída é a mensagem — serve em hook, em CI ou em alias de shell. Ele
também lista junctions órfãs deixadas por projetos que mudaram de lugar. Para consertar,
rode o `marvin` normal: diretório vazio ocupando o lugar do link é removido e a junction
recriada. Se houver notas dentro, elas são copiadas e conferidas antes — nunca apagadas
sem a contagem bater.

**Experimente antes.** O script escreve no seu repositório *e* cria uma junction em
`~/.claude/projects/`, fora dele. O `--dry-run` lista cada operação — cada pasta, cada
arquivo, a junction e o `git init` — e não escreve nada:

```bash
node /caminho/para/marvin/marvin.mjs --dry-run
```

Toda chamada que muda o disco passa por um shim único, então escrita que escapasse do
`--dry-run` seria bug, não lacuna. Dry-run que mente é pior que dry-run nenhum.

Os nomes antigos em português (`--ferramentas=`, `--limpar-legado`, `--sem-git`) continuam
valendo como alias. Renomear flag sem alias quebraria quem já tem script montado — que é
exatamente o problema que o script passou a tratar.

## Upgrade de um projeto já montado

Todo bloco de escrita é guardado por `if (!fs.existsSync(...))` — é o que torna o script
idempotente. O efeito colateral: **arquivo que já existe fica congelado na versão que o
criou.** Quem montou o projeto em julho e roda a versão de agosto não recebe nada, porque
o script diz "já existe" e segue.

Rodar de novo agora confere, em cada arquivo que ele gera mas não sobrescreve, se os
blocos que versões novas acrescentaram estão lá — e **avisa os que faltam**. Ele não
reescreve nada: o arquivo é seu e pode ter sido editado de propósito.

Não existe arquivo de versão. A checagem lê o conteúdo real, porque um número de versão
gravado seria mais um artefato derivado — e artefato derivado envelhece em silêncio.

## `--graphify` — consulta, sem hook

Opcional e nunca dependência. Gera `graphify-out/graph.json` com
[graphify](https://github.com/Graphify-Labs/graphify) para responder pergunta
**estrutural**: o que chama o quê, hierarquia de tipo, dependência entre pacotes. É
onde o grafo ganha do `grep` — que te dá o nome, mas não a relação.

Sem ele no PATH o passo avisa e pula, sem alterar mais nada.

### Vale a pena para você?

Só se você faz pergunta **estrutural** com frequência — "quem chama isso", "o que quebra se
eu mudar esta interface", "quais pacotes dependem de quais". Se as suas perguntas são "onde
está X" ou "que arquivo tem Y", `grep` e `glob` são mais baratos e nunca estão velhos. Veja
os números medidos no fim desta seção antes de decidir.

### Como instalar e usar

É uma ferramenta Python, então instala por fora do npm. Qualquer um dos dois serve:

```bash
uv tool install graphifyy
```

```bash
pipx install graphifyy
```

Confirme que está no PATH — se isto falhar, o passo `--graphify` vai pular:

```bash
graphify --version
```

Depois gere o grafo, da raiz do projeto:

```bash
npx marvin-kb --graphify
```

Faça as perguntas estruturais:

```bash
graphify query "o que chama o serviço de pagamento"
```

Depois de mexer no código, atualize antes de confiar numa resposta — **ele não avisa quando
está velho**:

```bash
graphify update .
```

Rodar `marvin --graphify` de novo não reconstrói um grafo existente (rodar duas vezes não
pode sobrescrever), mas compara o timestamp dele com a árvore inteira e te diz se envelheceu.

**O que ele deliberadamente NÃO faz:**

- **Não roda `graphify claude install`.** Esse comando instala um `PreToolUse` que
  responde `MANDATORY: you MUST run graphify before reading` a cada `Read` e `Grep` — e
  o check de frescor dele olha só o mtime do *arquivo alvo*: relaxa no arquivo que você
  acabou de editar e endurece em todo o resto, inclusive no `grep`, que é como você
  descobriria a mudança. Grafo velho com autoridade de MANDATORY é pior que grafo nenhum.
- **Não versiona o grafo.** `graphify-out/` entra no `.gitignore`. Artefato derivado
  commitado é como ele fica velho em silêncio — e ainda gera conflito de merge.
- **Não indexa markdown.** Roda com `--code-only`: só AST local, sem chave de LLM e sem
  custo. Os `.md` do graphify exigem extração paga.

Em troca, o passo compara o mtime do grafo contra a **árvore inteira** e avisa quando
ele está velho — o check que falta no hook original. Aviso, nunca ordem.

> **Ganho medido** (repo de 195 arquivos Python, 2.640 nós): **9,3×** pelo benchmark do
> próprio graphify — não os 71× divulgados —, e esse 9,3× é contra *ler o repositório
> inteiro*. Contra `grep` dirigido, o grafo só compensa em pergunta estrutural: para
> localizar um arquivo ele custa ~1.650 tokens contra ~18 de um glob.

## Requisitos

Node 18+. Nenhuma dependência.

**Windows** — usa *junction*, que não precisa de admin. Plataforma principal.

**Linux** — testado em `node:20-alpine`. O Node ignora o tipo `'junction'` fora do Windows
e cria um symlink de diretório, que se comporta igual: escrever pelo caminho do perfil cai
dentro do repositório. Verificado de ponta a ponta, incluindo a migração de memória (5
notas copiadas, conferidas, perfil substituído pelo link) e a idempotência.

**macOS** — coberto por CI. Segue o mesmo caminho de código do Linux, e o workflow roda a
suíte no `macos-latest` a cada push.

## Testes

```bash
node teste.mjs
```

48 verificações, zero dependência, ~2 segundos. Cobre os invariantes que protegem o disco
alheio — `--help`, `--dry-run` e `--check` não escrevem nada, rodar duas vezes não duplica,
a memória existente é copiada e conferida antes de o perfil virar link, e junction quebrada
por pasta movida é **consertada**, não só reportada. O plano do dry-run também é conferido:
em projeto já montado ele não pode prometer trabalho nenhum.

O teste é **hermético**: redireciona `HOME`/`USERPROFILE` para um diretório temporário, então
rodá-lo nunca cria junction no seu perfil real. O CI roda em Linux, Windows e macOS.

Uma lacuna declarada: o ramo de **aborto** da migração (copiou menos que a origem) não é
testado — forçar cópia parcial exigiria mock ou permissão de diretório. Está anotado no
cabeçalho do teste em vez de simulado. Teste que finge cobrir é pior que lacuna declarada.

## Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md) (em inglês). Resumo: rode `node teste.mjs` e
leia os quatro invariantes do [AGENTS.md](AGENTS.md) antes de mudar comportamento.

## Licença

MIT.
