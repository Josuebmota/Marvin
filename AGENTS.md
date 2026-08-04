# Marvin

Script Node sem dependências que monta a base de conhecimento de um projeto para
trabalhar com agentes de IA. Documentação de uso: [README.md](README.md).

> **Fonte de verdade deste projeto, independente de ferramenta.**
> O `CLAUDE.md` é ponteiro, não cópia.
>
> Estado corrente: `.docs/08_Memoria/onde_paramos.md` — versionado e público, ver abaixo.

## Estrutura real

| Arquivo | O que é |
|---|---|
| `marvin.mjs` | o script inteiro — ~1390 linhas, zero dependência |
| `teste.mjs` | smoke test dos invariantes — zero dependência |
| `PROMPT.md` | o prompt que guia a escrita dos agentes (o script não escreve) |
| `README.md` / `README.pt-BR.md` | documentação pública, inglês e português |
| `.github/workflows/teste.yml` | CI: `node teste.mjs` em Linux, Windows e macOS |

Não tem build. Rodar é `node marvin.mjs` ou `marvin`; testar é `node teste.mjs`.

**O `package.json` é exceção declarada.** A convenção abaixo diz "zero dependência — se
precisar de pacote, provavelmente é sinal de estar fazendo demais". Ele continua valendo
para *dependência*: o `package.json` **não tem `dependencies` nem `devDependencies`, e não
vai ter**. Ele existe só para dar `bin`, e o motivo é adoção: `npx marvin-kb` é como
ferramenta assim é experimentada hoje, e "clone e aponte o caminho" perde a maioria das
pessoas antes do primeiro run. Se algum dia aparecer uma dependência ali, a regra foi
quebrada — não o `package.json`.

O pacote chama `marvin-kb` porque `marvin` já está ocupado no npm. O **comando** é `marvin`.
`npx marvin` roda o pacote de outra pessoa — cuidado ao escrever documentação.

O teste é **hermético**: redireciona `HOME`/`USERPROFILE` para um diretório temporário, senão
criaria junction no perfil real de quem rodasse. Ele cobre os dois invariantes que protegem
o disco alheio, não a formatação da saída. O ramo de **aborto** da migração (copiou menos que
a origem) segue sem teste, e está declarado no cabeçalho do arquivo — forçar cópia parcial
exigiria mock ou permissão de diretório. Teste que finge cobrir é pior que lacuna declarada.

O CI roda o mesmo `teste.mjs` em `ubuntu-latest`, `windows-latest` e `macos-latest` a cada
push. Ele existe porque macOS era lacuna declarada na documentação: runner é gratuito em
repositório público, então a lacuna fecha a cada push em vez de esperar relato de alguém.

## Invariantes

**1. Nunca destruir dado sem conferir antes.** A migração de memória copia, **confere a
contagem** e só então apaga. Se copiou menos do que a origem, aborta e não apaga nada.

**2. Idempotente sempre.** Rodar duas vezes não pode duplicar nem sobrescrever. Todo
bloco de escrita é guardado por `if (!fs.existsSync(...))`.

**3. Não inventar convenção de ferramenta.** Adaptador de confiança média/baixa sai com
aviso mandando conferir. **Adaptador que não carrega falha em silêncio** — pior que
adaptador ausente.

**4. Não escrever conteúdo que exige conhecer o projeto.** Agentes, skills e o corpo do
`AGENTS.md` são do humano. Genérico é pior que ausente.

## Armadilhas

- **Junction no Windows:** `fs.symlinkSync(alvo, caminho, 'junction')` não precisa de
  admin. Mas `rm -rf` num junction **pode seguir o link e apagar o destino** — para
  remover só o link, use `[System.IO.Directory]::Delete(p, $false)` no PowerShell.
- **Renomear a pasta do vault quebra a junction em silêncio.** Ela continua apontando
  para o caminho antigo; nada avisa, e no caminho novo o Claude Code cria um diretório
  vazio de verdade. `marvin --check` diagnostica (sai != 0) e o `marvin` normal conserta:
  diretório vazio no lugar do link é removido e a junction recriada. Com notas dentro,
  elas são copiadas e conferidas antes — o invariante 1 vale igual.
- **O caminho da memória é derivado do `cwd`** (`:`, `\` e `/` viram `-`). Rodar de um
  subdiretório monta a junction no lugar errado.
- **Não usar `Date.now()` nem `Math.random()`** — o script precisa ser determinístico
  para ser idempotente.

## A memória deste repo é versionada — e pública

O Marvin prega **memória versionada dentro do repositório**, e aqui isso vale sem
exceção: `.docs/08_Memoria/onde_paramos.md` está no git. Consequências:

- **Escreva a memória como se fosse lida**, porque é. O que for de outro projeto vai na
  memória daquele projeto, não aqui.
- Ela é o **exemplo** de um `onde_paramos.md` preenchido — provavelmente a coisa mais
  útil do repositório para quem está tentando entender o formato.
- E o `/retomar` funciona num clone. Enquanto a memória esteve no `.gitignore`, o
  primeiro comando de quem clonasse apontava para um arquivo inexistente.

Num projeto privado — o caso de uso normal — a memória guarda decisão de produto e id de
cliente, e é por isso que o script avisa **"repo PRIVADO, sempre"**. Aqui o conteúdo é
sobre uma ferramenta pública, então não há o que proteger.

O **pacote npm** não leva `.docs/` nem `.claude/`: o `files` do `package.json` manda só o
script e a documentação. Quem instala roda a ferramenta e gera os seus.

## Convenções

- Português no código, no comentário e no commit
- Zero dependência. Se precisar de pacote, provavelmente é sinal de estar fazendo demais
- Nunca commitar caminho pessoal nem nome de projeto de cliente — use `<caminho>` nos
  exemplos. Vale para o **texto do commit** também, não só para o arquivo
- Antes de fechar: `git status --short` e uma justificativa por arquivo novo

## Higiene de sessão — quando sugerir um chat novo

Contexto acumulado custa em **toda** requisição, não uma vez só. Conversa longa que já
mudou de assunto carrega peso morto pelo resto da sessão.

**Sugira chat novo quando as três forem verdade:** o assunto mudou; a sessão já está longa;
e o estado **está registrado** em `onde_paramos.md` — sem isso o chat novo começa cego.

**Não sugira** quando o trabalho novo depende de algo descoberto agora e ainda não escrito,
quando está no meio de algo (correção feita, falta validar), ou quando a sessão é curta —
recomeçar custa mais do que continuar, porque o contexto fixo recarrega inteiro.

**A regra que fecha:** registrar **antes** de sugerir. Sugerir chat novo com estado não
salvo transfere para a próxima sessão o trabalho de redescobrir, que é o custo que se
queria evitar. Ao sugerir, diga o que já está salvo e qual seria a primeira frase do
chat novo.

> Esta seção existia no template gerado e faltava aqui — o passo 10 acusou em todo run
> por meses. Ficar sem ela era o repositório da ferramenta desobedecendo a própria régua.

## Portabilidade

| Item | Migra? |
|---|---|
| Este arquivo, o README, o script | ✅ markdown + Node puro |
| A arquitetura que ele gera | ✅ `AGENTS.md` é padrão multi-ferramenta |
| Junction | ✅ Windows (*junction*), Linux e macOS (symlink) — os três verdes no CI |
