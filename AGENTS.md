# Marvin

Script Node sem dependências que monta a base de conhecimento de um projeto para
trabalhar com agentes de IA. Documentação de uso: [README.md](README.md).

> **Fonte de verdade deste projeto, independente de ferramenta.**
> O `CLAUDE.md` é ponteiro, não cópia.
>
> Estado corrente: `.marvin/Memoria/onde_paramos.md` — versionado e público, ver abaixo.

## Estrutura real

| Arquivo | O que é |
|---|---|
| `marvin.mjs` | o script inteiro — ~1810 linhas, zero dependência |
| `teste.mjs` | smoke test dos invariantes — zero dependência |
| `PROMPT.md` | o prompt que guia a escrita dos agentes (o script não escreve) |
| `README.md` / `README.pt-BR.md` | documentação pública, inglês e português |
| `.github/workflows/teste.yml` | CI: `node teste.mjs` em Linux, Windows e macOS |
| `.marvin/ferramentas.md` | registro das ferramentas opcionais que ESTE repo usa (graphify: sim) e o alcance de cada uma |

## Comandos canônicos

Use **exatamente** estes — não adivinhe. Não há build.

| O quê | Comando | De onde saiu |
|---|---|---|
| Instalar | `npm install` | `no lockfile — npm is the default` |
| Testar | `npm run test` | `package.json > scripts.test` |

O comando publicado é `marvin` (o pacote é `marvin-kb`); de dentro do clone,
`node marvin.mjs`. A coluna da direita é o que impede a tabela de envelhecer em
silêncio: mudou o `package.json`, é aqui que se confere.

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
  **Junction que aponta para pasta que não existe mais é REPONTADA** desde o 1.1.1 —
  é o caso de quem renomeia o vault. Quando o outro alvo EXISTE, ela continua intocada:
  aí é montagem de outra pessoa, e desfazer não é decisão do script.
  Receita manual, para quando o problema é na junction de OUTRO projeto:
  [`Contexto/Arquitetura/junction-quebrada.md`](.marvin/Contexto/Arquitetura/junction-quebrada.md).
- **O caminho da memória é derivado do `cwd`** (`:`, `\` e `/` viram `-`). Rodar de um
  subdiretório monta a junction no lugar errado.
- **O `--dry-run` só é honesto porque toda escrita passa por `fsw`/`exec`.** Escrita nova
  que chame `fs.writeFileSync` direto faz o dry-run mentir em silêncio.
- **A tabela `ATUALIZACOES` (passo 10) é mantida à mão.** Seção nova em template gerado
  precisa de uma marca lá, senão quem montou o projeto na versão anterior nunca fica
  sabendo. É o ponto do código mais propenso a desincronizar — já falhou uma vez: não
  cobria o `.gitignore`, e por isso este repo ficou meses sem o bloco de segredos.
- **Convenção de ferramenta muda rápido.** Cursor/Aider/Zed estão marcados como confiança
  média/baixa **de propósito**. Se confirmar alguma, atualize a tabela dos **dois**
  READMEs e o selo no `marvin.mjs` juntos.
- **Não usar `Date.now()` nem `Math.random()`** — o script precisa ser determinístico
  para ser idempotente.

## A memória deste repo é versionada — e pública

O Marvin prega **memória versionada dentro do repositório**, e aqui isso vale sem
exceção: `.marvin/Memoria/onde_paramos.md` está no git. Consequências:

- **Escreva a memória como se fosse lida**, porque é. O que for de outro projeto vai na
  memória daquele projeto, não aqui.
- Ela é o **exemplo** de um `onde_paramos.md` preenchido — provavelmente a coisa mais
  útil do repositório para quem está tentando entender o formato.
- E o `/retomar` funciona num clone. Enquanto a memória esteve no `.gitignore`, o
  primeiro comando de quem clonasse apontava para um arquivo inexistente.

**A nota aponta; o nó guarda.** A base é organizada como **grafo** desde 10/09/2026 —
o porquê e o que foi descartado: [`organizacao-por-grafo.md`](.marvin/Contexto/Arquitetura/organizacao-por-grafo.md).
O `onde_paramos.md` é uma lista de links para as US em andamento; o estado, as decisões e o
Rumo de cada uma moram no `Sobre.md` dela em `.marvin/Planejamento/`, e só carregam quando
são seguidos. Decisão estrutural mora em `.marvin/Contexto/Arquitetura/`, que acrescenta e
nunca sobrescreve. A separação não é estética: a nota carrega em toda sessão, e em 09/09
ela chegou a 19 KB (~4.900 tk) porque seis sessões de histórico foram empilhadas dentro —
com o próprio passo 4b acusando. Hoje ela tem quatro linhas de ponteiro — e **seção de relato dentro dela é o mesmo erro que arquivo novo**.

**Antes de qualquer US, a passada do `AGENTS.md` gerado vale aqui também:** mapear o que a
atividade toca, propor o time dela (num projeto de uma pessoa, `tl` + `dev-back` + `qa` +
`scout` bastam; `po` é o dono), propor as skills que ela vai repetir, registrar na seção
*Time* e *Skills* da US.

Num projeto privado — o caso de uso normal — a memória guarda decisão de produto e id de
cliente, e é por isso que o script avisa **"repo PRIVADO, sempre"**. Aqui o conteúdo é
sobre uma ferramenta pública, então não há o que proteger.

O **pacote npm** não leva `.marvin/` nem `.claude/`: o `files` do `package.json` manda só o
script e a documentação. Quem instala roda a ferramenta e gera os seus.

## Convenções

- Português no código, no comentário e no commit
- Zero dependência. Se precisar de pacote, provavelmente é sinal de estar fazendo demais
- Nunca commitar caminho pessoal nem nome de projeto de cliente — use `<caminho>` nos
  exemplos. Vale para o **texto do commit** também, não só para o arquivo
- **Rode `node teste.mjs` antes de qualquer commit** — ele já pegou uma quebra real
  durante a tradução da saída
- **Antes de qualquer push, confira onde você está:** `pwd && git remote -v && git log
  --oneline -1`. Em 03/08 um push foi rodado dentro de **outro repositório** por engano;
  só não vazou porque a autenticação falhou
- **Commit daqui não leva `Co-Authored-By`** — o trailer vira um segundo contribuidor na
  página do GitHub. Desligado em `~/.claude/settings.json` (`"includeCoAuthoredBy": false`);
  se reaparecer, é outra máquina ou outro perfil commitando sem o ajuste
- Antes de fechar: `git status --short` e uma justificativa por arquivo novo

## Higiene de sessão

Contexto acumulado custa em **toda** requisição. Quando sugerir um chat novo, e o que dizer ao
sugerir, está no rodapé de `/retomar` — o comando que abre a sessão é onde a regra de fechar mora.
**A regra que fecha:** registrar antes de sugerir.

## Portabilidade

| Item | Migra? |
|---|---|
| Este arquivo, o README, o script | ✅ markdown + Node puro |
| A arquitetura que ele gera | ✅ `AGENTS.md` é padrão multi-ferramenta |
| Junction | ✅ Windows (*junction*), Linux e macOS (symlink) — os três verdes no CI |
