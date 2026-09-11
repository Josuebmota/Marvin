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
