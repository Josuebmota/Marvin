# As duas sessões de 03/08/2026

> O dia da publicação: a junction quebrada, o --check, o CI, e os bugs que apareceram rodando.
> Movido de `onde_paramos.md` em 09/09/2026, quando a nota passou do teto e o próprio
> marvin a acusou. O regime aqui é outro: **acrescenta, nunca sobrescreve.**

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
