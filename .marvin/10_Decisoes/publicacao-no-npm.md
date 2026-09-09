# Publicação no npm

> O pacote, o nome ocupado, e a armadilha do 2FA por security key no publish.
> Movido de `onde_paramos.md` em 09/09/2026, quando a nota passou do teto e o próprio
> marvin a acusou. O regime aqui é outro: **acrescenta, nunca sobrescreve.**

`marvin-kb@1.0.0` está no ar desde 03/08, MIT, 7 arquivos, 104 kB descompactado. Verificado
do lado de fora: `npx marvin-kb@1.0.0 --help` num diretório limpo roda e não escreve nada.

O comando instalado é **`marvin`**. **`npx marvin` roda o pacote de outra pessoa** — o nome
estava ocupado. A documentação precisa dizer `npx marvin-kb` sempre.

O pacote leva o script e as docs. O `.marvin/` e o `.claude/` daqui ficam de fora por
desenho — quem instala roda a ferramenta e gera os seus.

**A conta npm (`josubatsta`) tem 2FA por security key, não por app autenticador.**
Consequência prática para o próximo publish: **não passe `--otp`** — não existe código de
6 dígitos a fornecer. Com `auth-type=web` (o padrão no npm 11), o `npm publish` abre o
navegador e resolve pela passkey. Foi meia hora perdida na primeira vez.

Próxima versão precisa de `npm version patch` antes do publish: **1.0.0 não se republica**.
