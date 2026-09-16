<div align="center">

<img src="docs/logo.svg" width="96" alt="Marvin">

# Marvin

**Um `AGENTS.md`, N adaptadores finos, memória versionada dentro do repositório.**<br>
Monta a base de conhecimento de um projeto para trabalhar com agentes de IA — e sobrevive à troca de ferramenta.

[![npm](https://img.shields.io/npm/v/marvin-kb?color=cb3837&logo=npm)](https://www.npmjs.com/package/marvin-kb)
[![testes](https://github.com/Josuebmota/Marvin/actions/workflows/teste.yml/badge.svg)](https://github.com/Josuebmota/Marvin/actions/workflows/teste.yml)
![node](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=node.js&logoColor=white)
![deps](https://img.shields.io/badge/depend%C3%AAncias-0-success)
[![licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue)](LICENSE)

**Português** · [English](README.md)

```bash
npx marvin-kb --tools=claude,codex
```

<img src="docs/demo.svg" alt="marvin rodando num projeto Node novo" width="820">

</div>

Não é um framework, não roda nada em background, não tem dependência. É um script Node
de ~1810 linhas que cria uma estrutura e sai da frente.

> **Por que existe.** Não para inventar nada — ferramenta que faz isso já existe, e em
> versões mais maduras. O Marvin é um projeto de aprendizado: em tese não faz sentido
> construir o que o mercado já entrega; na prática, é construindo que se entende por que as
> coisas são do jeito que são. Use se servir; roube as ideias se não servir.

| | |
|---|---|
| 🧭 **Uma fonte de verdade** | todo conteúdo durável no `AGENTS.md`; cada ferramenta ganha um ponteiro de 15 linhas |
| 🧠 **Memória no git** | uma junction invertida faz a memória do agente nascer dentro de `.marvin/` |
| 🔁 **Idempotente** | rodar duas vezes não duplica nem sobrescreve nada |
| 🔍 **Diagnóstico** | custo do contexto fixo por sessão, "serviços" vazios, lixo na raiz, comandos canônicos lidos do manifesto |
| 🔌 **Ferramentas opcionais** | grafo de código com `graphify` e `ponytail`, registrados em `.marvin/ferramentas.md` — nunca obrigatórios |

> **O pacote é `marvin-kb`, o comando é `marvin`.** O nome `marvin` já estava ocupado no
> npm, então `npx marvin` baixaria o pacote de outra pessoa — use `npx marvin-kb`. Depois
> de `npm i -g marvin-kb`, o comando no seu PATH é só `marvin`.

Ou clone e rode o arquivo direto — é um script único, sem dependência:

```bash
node /caminho/para/marvin/marvin.mjs --tools=claude,codex
```

<details>
<summary><b>Sumário</b></summary>

- [O problema que ele resolve](#o-problema-que-ele-resolve)
- [Como resolve](#como-resolve)
- [O que ele cria](#o-que-ele-cria)
- [Onde a base vai parar](#onde-a-base-vai-parar--e-por-que-nem-sempre-é-marvin)
- [O que ele NÃO faz, de propósito](#o-que-ele-não-faz-de-propósito)
- [Agente, skill ou command?](#agente-skill-ou-command)
- [Ferramentas](#ferramentas)
- [Diagnóstico](#diagnóstico)
- [Flags](#flags)
- [Upgrade de um projeto já montado](#upgrade-de-um-projeto-já-montado)
- [`--graphify`](#--graphify--consulta-sem-hook)
- [Relacionado: o `claude-code-setup` da Anthropic](#relacionado-o-claude-code-setup-da-anthropic)
- [Requisitos](#requisitos) · [Testes](#testes) · [Contribuindo](#contribuindo) · [Licença](#licença)

</details>

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
~/.claude/projects/<caminho>/memory  ──junction──►  .marvin/Memoria/
```

A ferramenta escreve no caminho padrão dela; os arquivos nascem no repositório. Memória em
markdown puro dentro do projeto, uma fonte só. Se trocar de ferramenta, **os arquivos
ficam** — só o carregamento automático some.

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
└── .marvin/                    ← base de conhecimento, organizada como GRAFO
    ├── Contexto/               o que o projeto É
    │   ├── Sobre.md            nó raiz — liga aos fluxos
    │   ├── Fluxos/             um .md por fluxo; nasce quando um fluxo é analisado
    │   ├── Arquitetura/        como foi projetado; decisão estrutural mora aqui
    │   └── Design/             só quando há front
    ├── Planejamento/           o que está sendo FEITO: <Epic>/<Feature>/<US>/Sobre.md
    │   ├── Manutencao/         todo nó tem o mesmo Sobre.md: estado, pai, Rumo
    │   └── Novos/
    ├── Fontes/                 apoio; Externas.md diz o que vive fora do repositório
    ├── Releases/               <versao>.md — índice do que subiu, com evidência
    └── Memoria/
        └── onde_paramos.md     única porta; só ponteiros para as US ativas
```

Dois eixos: o que o projeto **é** (`Contexto/`) e o que está sendo **feito** nele
(`Planejamento/`). Todo nó é um `Sobre.md` com `estado` no frontmatter, link para o pai e
uma seção **Rumo** — uma entrada por mudança de direção. Decisão mora no nó que a tomou:
a da US na US, a estrutural em `Arquitetura/`. Nada muda de pasta ao concluir: a US ganha
`estado: concluida`, a evidência, e uma linha em `Releases/`. **Link é aresta**: com
`--graphify` a base entra no grafo do código, e `graphify affected "<função>"` responde
que US e que código dependem dela.

O `Planejamento/README.md` gerado carrega a regra que se repete **antes de qualquer US** (o `AGENTS.md` só lembra que ela existe — regra mora onde dispara): mapear o que
a atividade toca, propor o time dela em camadas (`tl`, `po` · `dev-front`, `dev-back`,
`qa` · `scout`, mais `design`/`dba`/`sec`/`infra` quando a atividade pede), propor as
skills que ela vai repetir, e atualizar os agentes com o que esta atividade ensinou —
acrescenta, nunca reescreve.

## Onde a base vai parar — e por que nem sempre é `.marvin`

O script **procura uma base existente pelos marcadores** (`Memoria/`, `08_Memoria/` ou `.obsidian/`),
não pelo nome da pasta. A regra:

| Situação | Resultado |
|---|---|
| Projeto novo | cria **`.marvin/`** |
| Já existe base em `.docs/`, `Docs/` ou `docs/` | **reaproveita**, não duplica |
| Existe `Docs/` que **não** é base (documentação do produto) | cria `.marvin/` ao lado e avisa: *"convivendo com Docs/ do produto — intocado"* |

**O nome diz de quem é a pasta.** Na maioria dos repositórios em que a ferramenta roda —
código de cliente, de empregador, de time — esta base é *seu material de trabalho*, não
entregável do projeto. `.docs` genérico sugeria o contrário e convidava a ser commitada
junto com o produto. `.marvin` deixa explícito de onde ela veio e a quem serve.

`.docs` continua na lista de candidatos, então **projeto montado por versão anterior segue
funcionando sem migração** — a detecção é por marcador, não por nome. Se o `Docs/` do
projeto já é onde o conhecimento vive, fundir continua sendo melhor que separar: duas bases
que não se enxergam é o pior dos mundos.

**Consequência prática:** projetos migrados costumam ficar em `Docs/` e projetos novos em
`.marvin/`. Isso é o desenho, não inconsistência. Só renomeie se a pasta for **100%
ferramenta** — e, se renomear, **refaça a junction**, porque ela aponta para o caminho
antigo e fica órfã em silêncio:

```powershell
# PowerShell — remove SÓ o link, nunca o conteúdo
[System.IO.Directory]::Delete("$env:USERPROFILE\.claude\projects\<caminho>\memory", $false)
git mv Docs .marvin
New-Item -ItemType Junction -Path "$env:USERPROFILE\.claude\projects\<caminho>\memory" `
         -Target "$PWD\.marvin\Memoria"
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

### Ferramentas opcionais — o registro `.marvin/ferramentas.md`

Algumas ferramentas não são adaptador: são coisas que o projeto *escolhe* usar. O marvin
detecta no PATH, pergunta **uma vez** (só com terminal — sem ele registra `não` e avisa) e
escreve a resposta em `.marvin/ferramentas.md`. As próximas execuções leem o registro em
vez de perguntar. `--use=<ferramenta>` flipa para `sim`; `--no-questions` registra `não`
mesmo com terminal.

| Ferramenta | O que produz | Alcance |
|---|---|---|
| `graphify` | `graphify-out/graph.json` — o grafo de código, ver [abaixo](#--graphify--consulta-sem-hook) | **qualquer agente** lê o JSON/markdown; só o hook é do Claude, e ele não é instalado |
| `ponytail` | escada de simplicidade para quem *implementa* — seção `## Ferramentas` no `AGENTS.md` (confiança **baixa**: instalado e lido, não medido) e tabela de papéis no `.claude/agents/README.md` (dev sim; `tl`/`po`/`scout` não) | plugin com hooks no **Claude Code, Codex e Copilot CLI** (cada um com o seu install; o marvin detecta só o do Claude, distinguindo *instalado* — `~/.claude/plugins/installed_plugins.json` — de *ativo* — `~/.claude/.ponytail-active`); no Cursor, os hooks (`~/.cursor/hooks.json`) ou o arquivo de regra, nenhum gerado; o resto copia o arquivo de regra do repositório do ponytail |

*Alcance* é a coluna que importa: diz quem consegue consumir o que a ferramenta produz.
Ferramenta cuja saída só um agente lê é decisão, não padrão.

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
- **Comandos canônicos** — lê instalar/testar/build do manifesto (`package.json`,
  `pyproject`, `go.mod`, `Cargo.toml`, `*.csproj`, `pubspec.yaml`, `Makefile`) e tira o
  **gerenciador do lockfile**. Agente que adivinha roda `npm install` num projeto pnpm
- **O que carrega em toda sessão** — `AGENTS.md`, o adaptador (`CLAUDE.md`) e a nota de
  memória, cada um medido e somados. Medido em três projetos reais, o `AGENTS.md` pesava
  mais que a nota em todos — a versão anterior media só a nota. Acima de ~6 KB na nota, ou
  ~6000 tokens nos três, o aviso vem **com destino**: como um fluxo funciona vai para
  `Contexto/Fluxos/`, o estado de uma US vai para o `Sobre.md` dela, o relato do que foi
  feito já está no `git log`. O `--check` imprime a mesma conta
- **Artefatos de orquestrador antigo** — só aparece se detectar

### O painel — `marvin --status --html`

`--status` é a régua em texto. `--html` escreve a mesma medida como página,
`.marvin/.status/index.html` — arquivo único, sem lib, sem rede, abre em `file://` (o hook
de SessionStart regenera a cada sessão aberta). De cima para baixo, na ordem em que você
precisa:

1. **Corrigir** — toda inconsistência que o status achou, cada uma com link para o arquivo.
   Se não há nada, uma linha verde. É o motivo de abrir a página.
2. **Quatro cards** — contexto fixo, US ativas, US concluídas, equivalente na API — cada
   um com o delta desde o commit anterior. São links para a seção abaixo.
3. **Em andamento** — as US da nota com badge de estado e o último Rumo.
4. **Tendência** — um ponto por commit, do `historico.jsonl`.
5. **Tokens** — por dia e por modelo, lidos das transcrições do Claude Code do projeto.
6. **A rede** — a base como grafo (Epic → Feature → US → fluxos → o código que tocam),
   colapsada por padrão; duplo clique abre o arquivo em outra aba.

Claro e escuro seguem o sistema; o botão `tema` fixa um (fica no `localStorage`).

**Sobre o card de custo.** Os tokens são *medidos*: todo bloco `usage` de toda mensagem do
assistente em `~/.claude/projects/<slug>/*.jsonl`. O valor em dólar é o que esses tokens
**custariam na tabela da API** (tabela datada dentro do script; cache read ≈ 0,1×, cache
write ≈ 1,25×). Num plano fixo (Max) o gasto real é a mensalidade — o card diz quanto de API
essa mensalidade está rendendo, não o que você pagou. Cache read costuma ser ~⅔ disso: cada
turno relê o contexto inteiro.

## Flags

<details>
<summary><b>Todas as flags, e o que cada uma faz</b></summary>

```
--tools=<lista>   adaptadores a gerar. default: claude
                  válidos: claude, codex, copilot, cursor, aider, zed, opencode
                  rodar de novo com outra lista ACRESCENTA o que falta
--check           diagnostica a montagem da memória e sai com código != 0 se ela
                  estiver quebrada. Não escreve nada. Rode depois de mover a pasta
--dry-run         mostra tudo o que faria, sem escrever
--status          dashboard, só leitura: US ativas com o último Rumo, progresso por Epic,
                  última release, a conta do contexto fixo, idade do grafo. Sai != 0 quando
                  a nota e os nós discordam. Rode ao abrir a sessão
   --curto        só US ativas e avisos, sem cabeçalho, sempre sai 0 — é o que o hook
                  SessionStart que o scaffold escreve em .claude/settings.json roda
   --html         escreve também .marvin/.status/index.html — a base desenhada como rede
                  (Epic → Feature → US → fluxos → o código que tocam, colorida por estado;
                  layout de força inline, sem lib) — e grava um ponto por commit
                  em historico.jsonl: a tendência do contexto fixo, das US, da idade do grafo.
                  Os dois leem as transcrições do Claude Code do projeto e mostram os tokens
                  de fato GASTOS, por modelo — medido — mais o custo estimado (tabela de
                  preços datada) e quanto de cada turno é o contexto fixo
--us <caminho>    abre uma US: Novos|Manutencao/<Epic>/<Feature>/<US>. Cria a cadeia de
                  Sobre.md que falta e põe o ponteiro na nota
--fechar          só leitura: o que mudou no git (não commitado + commits de hoje) e NÃO
                  está no "Código tocado" de nenhuma US ativa — o mapa está incompleto ou o
                  trabalho vazou. O /fechar roda
--release <v>     fecha o ciclo: toda US com estado: concluida que não está em nenhum
                  Releases/*.md entra em Releases/<v>.md (Evidência obrigatória) e sai
                  da nota. Sem tag, sem commit — imprime o git tag para você rodar
--migrar          layout antigo (08_Memoria/, 10_Decisoes/) → layout por grafo. Faz backup,
                  move, reescreve caminhos; o que exige julgamento é listado no fim
--clean-legacy    remove artefatos de orquestrador antigo
--no-git          não roda git init nem gera .gitignore
--graphify        gera o grafo de código para consulta estrutural (requer o graphify no PATH)
                  indexa sub-repos ignorados separadamente, para um monorepo não
                  acabar com um grafo sem nenhum código do produto dentro
--graphify-label  nomeia as comunidades com a CLI `claude` do PATH. Fora do padrão:
                  uma chamada por vez, então custa minutos e cota
--graphify-rebuild  refaz um grafo que já existe (o padrão nunca sobrescreve)
--graphify-git-hook  escreve .git/hooks/post-commit para o grafo se atualizar sozinho.
                  Nunca sobrescreve um post-commit que já existe
--use=<ferramenta>  registra `sim` para uma ferramenta opcional sem perguntar (alias: --usar=)
--no-questions    registra `não` para toda ferramenta opcional, mesmo com terminal
--help, -h        uso; sai sem escrever nada
```

### Os três gatilhos

Regra que mora num arquivo depende de alguém lembrar. Três comandos a disparam:

| Quando | Comando | O que faz |
|---|---|---|
| abrir a sessão | hook SessionStart → `marvin --status --curto --html` (regera o dashboard também), depois `/retomar` | lê a nota, segue os ponteiros, confere contra o `git log` |
| começar trabalho | `/us <caminho>` → `marvin --us` | cria a cadeia de `Sobre.md` e o ponteiro; o agente mapeia, propõe o time e as skills |
| lançar | `marvin --release <v>` | escreve `Releases/<v>.md` a partir das US concluídas e as tira da nota |
| fechar | `/fechar` | entrada no Rumo por US tocada, nota reescrita como ponteiros, agentes atualizados em camadas, `--status`, e se é hora de chat novo |

`/retomar` e `/fechar` são o par; o `--status` é a régua entre os dois.

### O grafo trabalhando a favor

Medido em quatro projetos reais: em 23.745 turnos de agente o grafo foi consultado **duas**
vezes — as duas em teste. "Consulta, nunca hook" tinha virado "nunca": pergunta estrutural não
aparece como pergunta na hora de trabalhar. Então o script pergunta, nos momentos que ele já controla:

| Quando | O que o grafo responde |
|---|---|
| `marvin --us` (segunda rodada, com *Código tocado* preenchido) | **Impacto** — quem depende do que a US toca (2 níveis) e que outras US passam pelo mesmo código. Escrito na US como seção derivada |
| `marvin --status` | **Colisão** — duas US ativas na mesma função, ou uma tocando código que depende do que a outra toca. **Dispersão** — US em 4+ comunidades |
| `marvin --fechar` | **Deriva** — código que mudou hoje e não está no *Código tocado* de nenhuma US ativa |

Tudo determinístico, zero LLM. O graphify fez a extração; o marvin liga a resposta ao nó.

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

</details>

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

<details>
<summary><b>Como o grafo é montado, o que ele responde, e por que não tem hook</b></summary>

**A base de conhecimento entra no mesmo grafo.** O graphify só indexa `.md` por LLM
(medido: 93 K tokens para três arquivos minúsculos, não determinístico, e ele mesmo
descartou a aresta doc→código como "out-of-scope"). Então o marvin escreve o lado dos docs
por regex — link relativo vira `references`, `pai:` vira `child_of`, o caminho em crase
sob *Código tocado* vira `touches` no nó de código — e anexa direto no `graph.json`, antes
do relatório. Zero LLM, zero custo, o mesmo resultado a cada run; função que não existe
mais vira aviso, nunca nó fantasma. O ganho é a pergunta que ninguém respondia antes:
`graphify affected "calcularEstorno"` → a US que a toca e o código que a chama.

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

### O que ele gera

Uma flag roda o ciclo inteiro, e tudo é AST local — sem chave de API, sem custo:

```
graphify-out/
├── graph.json        o grafo — é o que o `graphify query` lê
├── graph.html        abre em qualquer browser, sem servidor
├── GRAPH_REPORT.md   comunidades, hubs, frescor
└── repos/            uma extração por sub-repo (só em monorepo)
```

**Monorepo é o motivo de isso ser mais de um comando.** Sub-repositórios costumam estar no
`.gitignore` da raiz, porque cada um é versionado por conta própria. O graphify respeita o
`.gitignore`, então extrair só da raiz indexa tudo *menos* o seu código. Medido num monorepo
de quatro sub-repos: 2.783 dos 2.854 nós vinham de `.claude/` e **nenhum** do produto — e
nada no caminho avisava. O Marvin acha os sub-repos que a raiz ignora, indexa cada um e
mescla tudo num grafo só.

Nomear as comunidades é a única parte que exige LLM, então por padrão elas ficam
`Community 0`, `Community 1`. Duas flags cobrem o resto:

| flag | o que faz |
|---|---|
| `--graphify-label` | nomeia as comunidades com a CLI `claude` do seu PATH — sem chave de API, mas o graphify limita a uma chamada por vez, então custa minutos e cota |
| `--graphify-rebuild` | refaz um grafo que já existe. O padrão nunca sobrescreve |

Num monorepo, **`graphify update .` é o comando errado de atualização** — ele re-extrai só a
raiz e joga fora os sub-repos. O Marvin escreve esse aviso no `CLAUDE.md` gerado, nomeando os
sub-repos, para o agente não destruir o grafo seguindo a instrução do próprio graphify. O
comando certo é `marvin --graphify --graphify-rebuild`.

### Atualizando sozinho

O grafo envelhece a cada commit e nunca avisa. O `--graphify-git-hook` fecha essa lacuna
escrevendo um `post-commit` que atualiza em segundo plano, então o `git commit` volta na hora.

**Não** é o `graphify hook install`. Aquele reconstrói a *raiz* do repositório onde foi
instalado — que num monorepo é exatamente o caminho que apaga os sub-repos do grafo. Ele
automatizaria o bug. O hook do Marvin roda o refresh que serve ao projeto: `graphify update .`
em repositório único, o ciclo inteiro em monorepo.

Três coisas antes de ligar:

- **Nunca é instalado por padrão**, e **nunca sobrescreve um `post-commit` que já existe** —
  esse arquivo costuma guardar o lint, o changelog ou o CI de alguém. Se já houver um, o
  Marvin imprime a linha para você acrescentar à mão e não toca em nada.
- **Não é versionado.** Hook mora em `.git/`, então é por clone e não chega ao time. Quem
  quiser, roda a flag.
- `MARVIN_SKIP_GRAPH_HOOK=1 git commit …` pula uma vez. Apagar o arquivo desinstala.

Esse mesmo momento é o gatilho certo para a outra coisa derivada que envelhece — a memória. O
`CLAUDE.md` gerado manda atualizar o `onde_paramos.md` **no commit**, e só quando o commit
muda o estado do projeto. Commit de typo não pede nada. A nota é sobrescrita, nunca
acrescentada: o histórico é o `git log`.

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

</details>

## Relacionado: o `claude-code-setup` da Anthropic

A Anthropic publica um plugin oficial,
[`claude-code-setup`](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup),
que varre o código e **recomenda** automações do Claude Code — servidores MCP, skills, hooks,
subagentes, slash commands. Ele é read-only: aconselha, não escreve nada.

Os dois respondem perguntas diferentes. Aquele responde *"o que eu deveria adotar?"*. O Marvin
responde *"cadê o esqueleto?"* — escreve o `AGENTS.md`, os adaptadores e o vault, monta a
memória do agente **dentro** do repositório, e sai da frente. E não é só Claude: o `AGENTS.md`
é a fonte e cada ferramenta ganha um adaptador fino.

Use os dois. Pergunte ao plugin o que adotar; rode o Marvin para ter a estrutura que segura.

O Marvin fala de papéis, mas só o que ele consegue derivar: o `.claude/agents/README.md`
gerado nomeia as stacks encontradas e diz quantos papéis aquilo implica — um por fronteira
num repo poliglota ou num monorepo, dois num de stack única. Ele nunca escreve os agentes.
Agente sem as cicatrizes **deste** código é contexto fixo em toda sessão que não devolve nada.

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

219 verificações, zero dependência, ~2 segundos. Cobre os invariantes que protegem o disco
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
