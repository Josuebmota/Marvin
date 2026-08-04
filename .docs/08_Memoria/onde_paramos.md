---
name: onde-paramos
aliases: ["onde-paramos", "ONDE PARAMOS"]
description: "ÚNICA porta de entrada do Marvin. Estado corrente — sempre sobrescrita."
tags: [moc, entrada]
metadata:
  type: project
  atualizado: 2026-08-03
---

# ▶ ONDE PARAMOS

**Atualizado:** 03/08/2026

> Esta nota é versionada e **pública**, porque este repositório é público. Escreva aqui
> como se fosse lido — o que for de outro projeto vai na memória daquele projeto.
> Ela também serve de exemplo: é assim que um `onde_paramos.md` preenchido se parece.

## Estado corrente

**No ar nos dois lugares.** Código em https://github.com/Josuebmota/Marvin e pacote em
`marvin-kb@1.0.0` no npm. `marvin.mjs` com ~1.380 linhas, `teste.mjs` com ~350, **45
verificações** verdes em Linux, Windows e macOS pelo CI. Zero dependência de runtime.

O remote é **HTTPS**, não SSH: `https://github.com/Josuebmota/Marvin.git`. Esta máquina não
tem chave SSH (só `known_hosts` em `~/.ssh`), e o Git Credential Manager já autentica sem
pedir nada. Se algum dia voltar para SSH, gere a chave antes.

Faz: diagnóstico (stack, pasta vazia, lixo na raiz, contexto fixo, níveis de `.claude`
empilhados, artefato de orquestrador antigo), vault com **junction invertida**,
`AGENTS.md` como fonte única + adaptadores finos por ferramenta, `/retomar`,
`onde_paramos.md`, scaffold de `agents/` e `skills/`, `git init` + `.gitignore`, e o
aviso de atualizações para projeto montado por versão antiga.

Opcionais: `--check`, `--dry-run`, `--graphify`.

Não faz, de propósito: **não escreve agente, skill nem o corpo do `AGENTS.md`**.

## O CI é o novo dono do "funciona no macOS?"

`.github/workflows/teste.yml` roda `node teste.mjs` em `ubuntu-latest`, `windows-latest` e
`macos-latest` a cada push, no Node 18 (o piso do `engines`). `fail-fast` desligado de
propósito — saber que quebrou **só** no macOS é a informação inteira.

**Ele pagou o próprio custo no primeiro run.** Linux e Windows passaram, macOS falhou: no
macOS o `os.tmpdir()` devolve `/var/folders/…`, que é **symlink** para `/private/var/…`, e o
`process.cwd()` do processo filho já vem resolvido. O marvin derivava a chave da memória de
um caminho e o teste procurava o link no outro. Defeito **do teste** — o marvin usa `cwd`
dos dois lados, então no macOS ele monta certo. `realpathSync` na arena resolveu.

Lacuna declarada há meses, nenhum relato tinha chegado, e o CI achou em minutos.

⚠️ **O log do Actions exige autenticação.** `api.github.com/…/jobs/<id>/logs` devolve 403
sem token, e não há `gh` instalado nesta máquina. Dá para ver por fora — qual job falhou,
em qual passo — via `/actions/runs` e `/actions/runs/<id>/jobs`, que são públicos. Para ler
a saída do teste é pelo navegador ou instalando o `gh`.

## Publicado no npm

`marvin-kb@1.0.0` está no ar desde 03/08, MIT, 7 arquivos, 104 kB descompactado. Verificado
do lado de fora: `npx marvin-kb@1.0.0 --help` num diretório limpo roda e não escreve nada.

O comando instalado é **`marvin`**. **`npx marvin` roda o pacote de outra pessoa** — o nome
estava ocupado. A documentação precisa dizer `npx marvin-kb` sempre.

O pacote leva o script e as docs. O `.docs/` e o `.claude/` daqui ficam de fora por
desenho — quem instala roda a ferramenta e gera os seus.

**A conta npm (`josubatsta`) tem 2FA por security key, não por app autenticador.**
Consequência prática para o próximo publish: **não passe `--otp`** — não existe código de
6 dígitos a fornecer. Com `auth-type=web` (o padrão no npm 11), o `npm publish` abre o
navegador e resolve pela passkey. Foi meia hora perdida na primeira vez.

Próxima versão precisa de `npm version patch` antes do publish: **1.0.0 não se republica**.

## Higiene de repositório público — a lição que custou um squash

Um checkup em 03/08 varreu os 32 commits atrás de nome de empregador e de cliente. Os nomes
**não estavam em lugar nenhum**. O que estava:

1. **Um nome de campo de um repositório de cliente**, citado como exemplo num comentário do
   `marvin.mjs`. Estava no arquivo atual **e no pacote npm publicado**.
2. **Uma mensagem de commit nomeava o projeto do cliente** ao explicar onde o bug apareceu.
3. O caminho pessoal da pasta de trabalho, literal, em 12 commits — já corrigido nos
   arquivos, mas vivo no histórico.

**A lição que não era óbvia: `git grep` no working tree não vê mensagem de commit.** A
auditoria pré-publicação passou justamente por olhar só os arquivos. Quem revisa repositório
público precisa varrer as três camadas — conteúdo dos blobs, **mensagens de commit** e nomes
de arquivo que já existiram.

O histórico foi **esmagado num commit único** em vez de reescrito padrão a padrão: reescrever
depende de eu acertar todos os padrões, esmagar não depende de acertar nada. O custo foi
perder o registro da evolução — que é exatamente o tipo de memória que este projeto defende,
e por isso a decisão está anotada aqui, onde ela sobrevive ao `git log` que deixou de existir.

**Antes de qualquer commit aqui, o exemplo tem que ser sintético.** "Visto num repo real" é
uma boa história; o campo real do cliente não pode vir junto.

## Decisões que não se reabrem

- **Nenhuma dependência de runtime.** O `package.json` existe só para dar `bin`. Se
  aparecer uma `dependency` ali, a regra foi quebrada.
- **Um arquivo só.** Não quebrar `marvin.mjs` em módulos — poder ler de cima a baixo é
  feature numa ferramenta que escreve no repositório dos outros.
- **Sem arquivo de config.** Flags são a interface inteira.
- **Sem número de versão gravado.** O passo 10 confere o conteúdo real dos arquivos; um
  `.marvin-versao` seria mais um artefato derivado capaz de envelhecer em silêncio.
- **Graphify entra como consulta, nunca como hook.** Medido: o grafo dele responde com
  função apagada, arquivo e linha, marcada `[EXTRACTED]`, sem avisar. O hook oficial diz
  `MANDATORY` sobre isso. Ganho real medido: **9,3×**, não os 71× divulgados — e contra
  "ler o repo inteiro". Só compensa em pergunta estrutural.

## Travado

Nada.

## Contexto que economiza tempo

- **Antes de qualquer push, confira onde você está.** Em 03/08 um push foi rodado dentro de
  **outro repositório** por engano — só o `git remote add` pegou, porque a autenticação
  falhou. Se a chave estivesse funcionando, um repositório privado teria ido parar num
  público. O hábito que evita: `pwd && git remote -v && git log --oneline -1`.
- **Rode `node teste.mjs` antes de qualquer commit.** Ele já pegou uma quebra real
  durante a tradução da saída.
- **Commit daqui não leva `Co-Authored-By`.** O trailer que o Claude Code põe por padrão
  vira um **segundo contribuidor na página do GitHub** — o repo aparecia com dois. Foi
  removido de 17 commits com `filter-branch` e desligado em `~/.claude/settings.json`
  (`"includeCoAuthoredBy": false`). Se reaparecer, é porque outra máquina ou outro perfil
  está commitando sem esse ajuste.
- **Nunca `rm -rf` numa junction** — pode seguir o link e apagar o destino. Use
  `[System.IO.Directory]::Delete(p, $false)` no PowerShell. O próprio `teste.mjs` respeita
  isso na limpeza.
- **Mover a pasta do projeto quebra a memória de um jeito que parece perda de dado.** A
  junction antiga continua apontando para o caminho velho, e no caminho novo o Claude Code
  cria um `memory/` **vazio de verdade** — abre a sessão, a memória parece ter sumido, e
  nada avisa. O conteúdo está intacto em `.docs/08_Memoria`; o que falta é só a junction.

  **O script agora resolve isso sozinho:** `marvin --check` diagnostica e sai com código
  != 0; `marvin` normal conserta, removendo o diretório vazio e recriando o link. O
  comando manual abaixo continua valendo para quando o problema for na junction **de outro
  projeto**, ou quando o `marvin` não estiver à mão:

  ```powershell
  $novo = "<caminho-do-projeto>"; $chave = ($novo -replace '[:\\/]','-'); $link = "$env:USERPROFILE\.claude\projects\$chave\memory"; if (Test-Path $link) { $i = Get-Item $link -Force; if ($i.Attributes -band [IO.FileAttributes]::ReparsePoint) { [System.IO.Directory]::Delete($link, $false) } else { Remove-Item $link -Force } }; New-Item -ItemType Junction -Path $link -Target "$novo\.docs\08_Memoria" | Out-Null; Get-ChildItem $link -Filter *.md
  ```

  Remove **só o link** se for junction, apaga o diretório vazio se for diretório, recria e
  lista as notas. Vale limpar a junction órfã do caminho antigo também — ela sobrevive
  apontando para o vazio. Se a última linha não listar `onde_paramos.md`, pare e confira
  `.docs/08_Memoria` antes de mexer em mais nada.
- **`--dry-run` só é honesto porque toda escrita passa por `fsw`/`exec`.** Escrita nova
  que chame `fs.writeFileSync` direto faz o dry-run mentir em silêncio.
- **A tabela `ATUALIZACOES` (passo 10) é mantida à mão.** Seção nova em template gerado
  precisa de uma marca lá. É o ponto do código mais propenso a desincronizar — já falhou
  uma vez: não cobria o `.gitignore`, e por isso este repo ficou meses sem o bloco de
  segredos.
- **Convenção de ferramenta muda rápido.** Cursor/Aider/Zed estão marcados como confiança
  média/baixa **de propósito**. Se confirmar alguma, atualize a tabela dos **dois**
  READMEs e o selo no `marvin.mjs` juntos.
- **macOS deixou de ser lacuna** — CI verde nos três sistemas desde 03/08. O que nenhum CI
  cobre é repositório de verdade: monorepo, vault `Docs/` preexistente, projeto já montado
  por outra ferramenta. É ali que mora o próximo relato útil.
- O ramo de **aborto** da migração de memória não tem teste. Lacuna declarada no cabeçalho
  do `teste.mjs`; forçar cópia parcial exigiria mock ou permissão de diretório.

## Pendências pequenas

- ~~O `AGENTS.md` daqui está sem a seção "Higiene de sessão"~~ — resolvido em 03/08. A
  seção entrou, e **o passo 10 agora sai limpo neste repositório**. Vale manter assim: o
  repo da ferramenta acusado pela própria ferramenta é o pior cartão de visita possível.
- **O `--help` ensina o caminho errado agora que o pacote existe.** Ele diz
  `node <path>/marvin/marvin.mjs [flags]`, que é a forma de quem clonou — mas a via
  principal virou `npx marvin-kb` / `marvin`. O rodapé aponta `<path>/marvin/PROMPT.md`
  pelo mesmo motivo, e quem instalou pelo npm não tem esse caminho na cabeça: melhor
  apontar para o arquivo no GitHub. Vale um `1.0.1`.
- ~~O `--check` não é sugerido de dentro do produto~~ — resolvido em 03/08. O `CLAUDE.md` e
  o `00_Inicio.md` gerados ensinam a flag e a armadilha, e há marca na `ATUALIZACOES`, então
  projeto montado por versão antiga também é avisado.
- ~~Publicar no npm~~ — feito em 03/08. `marvin-kb@1.0.0`.

## O que esta sessão (03/08, tarde) produziu

**A publicação.** A pasta foi movida de `<antigo>/marvin` para `<caminho>/Marvin` — o rename
para maiúscula que estava pendente saiu junto com a mudança de lugar. Isso quebrou a
memória em silêncio (ver acima), e a junction foi refeita antes de qualquer outra coisa.
O remote passou de SSH para HTTPS e `git push -u origin main` publicou 23 commits.

A auditoria antes do push não achou vazamento **nos arquivos**. Um checkup mais fundo, feito
depois, achou três no histórico — ver a seção de higiene abaixo.

**Depois, cinco mudanças no produto**, todas nascidas de ler o script inteiro com o
problema da manhã fresco na cabeça:

1. **O conserto da junction.** Reproduzido em sandbox antes de mexer: o caminho da memória
   existindo como diretório vazio derrubava o symlink com `EEXIST` **e saía com código 0**.
   O script fazia exatamente o que este projeto acusa nos outros — falhar em silêncio com
   cara de sucesso. Agora conserta, e a conferência da migração passou a olhar entrada por
   entrada, não só a contagem de `.md` (o invariante 1 não cobria subpasta nem anexo).
2. **`--check`** — diagnóstico read-only cujo código de saída é a mensagem.
3. **Adaptador do Copilot** em `.github/copilot-instructions.md`, caminho conferido na
   documentação oficial no dia.
4. **CI em três sistemas** (ver acima).
5. **O rodapé** mandava escrever estrutura e invariantes no `CLAUDE.md` e imprimia
   `Docs/08_Memoria` fixo — ensinava o oposto da arquitetura e imprimia caminho que não
   existe quando o vault é `.docs`.

E a documentação tinha **duas afirmações que já eram falsas**: "26 verificações" (eram 28)
e "a saída do script é em português" (foi traduzida; o que é português são os templates).
Vale como lembrete: a doença que este projeto combate não poupa a documentação dele.

**Depois, três acertos vindos de rodar a própria ferramenta neste repositório:**

6. O `--check` passou a ser **anunciado** no `CLAUDE.md` e no `00_Inicio.md` gerados, com
   marca na `ATUALIZACOES`. Flag que só existe no `--help` é flag que ninguém usa — e quem
   mais precisa dela é justamente quem montou o projeto na versão anterior.
7. A seção **"Higiene de sessão"** entrou no `AGENTS.md` daqui, e o passo 10 saiu limpo
   pela primeira vez.
8. **O `--dry-run` estava exagerando.** Em projeto já montado ele anunciava 9 operações —
   todas `mkdir` de pasta que já existe, que uma execução real não criaria. A mensagem
   "nothing to do: this project is already set up" existia no código e era inalcançável.
   O shim passou a só registrar `mkdir` de diretório inexistente. Plano que exagera é a
   mesma doença do plano que esconde: os dois fazem a pessoa parar de ler.

9. **O `--graphify` tinha o mesmo problema do `--check`**: quem rodava o marvin nunca ficava
   sabendo que existia. Agora a saída normal traz quatro linhas — o que ele é, o que ele
   **não** ganha do grep, como instalar, e um "leia as ressalvas antes". Some quando a flag
   já está em uso. Os dois READMEs ganharam passo a passo de instalação e uso.

Testes: 28 → **48**.

## O que a sessão anterior (03/08, manhã) produziu

Do commit `b5bc7d2` ao `d205172`, 16 commits. Em ordem: README em inglês e português,
`--help` e `--dry-run`, verificação em Linux, smoke test, saída traduzida, `package.json`
com `bin`, `CONTRIBUTING.md`, e a memória saindo do `.gitignore`.

Quatro bugs apareceram **rodando**, não por teste — vale saber que essa é a forma como
eles aparecem neste projeto:

1. `--help` montava o projeto inteiro e criava a junction no perfil.
2. Junction com destino apagado derrubava o script com ENOENT.
3. Detector de lixo ancorava no primeiro caractere e pegava 5 de 7 num repo real.
4. Contagem dupla do nível global quando o projeto fica dentro da home (~18k onde o
   certo era ~9k). Tem teste de regressão.

E a auditoria pré-publicação achou dois vazamentos: caminho pessoal versionado em
`CLAUDE.md` e `00_Inicio.md`, e o `.gitignore` daqui **sem o bloco de segredos** que o
próprio script gera — porque o passo 10 não conferia o `.gitignore`. Os dois corrigidos.
