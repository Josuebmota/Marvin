# O CI é o dono do "funciona no macOS?"

> Por que o CI roda nos três sistemas, e o defeito de teste que ele achou no primeiro run.
> Movido de `onde_paramos.md` em 09/09/2026, quando a nota passou do teto e o próprio
> marvin a acusou. O regime aqui é outro: **acrescenta, nunca sobrescreve.**

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

## Movido do `AGENTS.md` (US-51, 15/10/2026)

> O `AGENTS.md` carrega em toda sessão; este trecho só é lido quando o assunto aparece.

O teste é **hermético**: redireciona `HOME`/`USERPROFILE` para um diretório temporário, senão criaria junction no perfil real de quem rodasse. Ele cobre os dois invariantes que protegem o disco alheio, não a formatação da saída. O ramo de **aborto** da migração (copiou menos que a origem) segue sem teste, e está declarado no cabeçalho do arquivo — forçar cópia parcial exigiria mock ou permissão de diretório. Teste que finge cobrir é pior que lacuna declarada.

O CI roda o mesmo `teste.mjs` em `ubuntu-latest`, `windows-latest` e `macos-latest` a cada push. Ele existe porque macOS era lacuna declarada na documentação: runner é gratuito em repositório público, então a lacuna fecha a cada push em vez de esperar relato de alguém.

**Portabilidade**

| Item | Migra? |
|---|---|
| `AGENTS.md`, o README, o script | ✅ markdown + Node puro |
| A arquitetura que ele gera | ✅ `AGENTS.md` é padrão multi-ferramenta |
| Junction | ✅ Windows (*junction*), Linux e macOS (symlink) — os três verdes no CI |
