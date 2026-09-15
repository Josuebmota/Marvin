---
name: publicar-no-npm
description: Publicar uma versão do marvin-kb — quando a tag existe localmente e a pergunta é "já está no npm?". Cobre o login expirado e o publish que parece ter saído mas não saiu.
---

# Publicar no npm

O pacote é `marvin-kb`; o comando é `marvin`. `npx marvin` roda o pacote de outra pessoa.

## Antes de tudo — o que já está lá

```bash
npm view marvin-kb versions time --json --prefer-online
```

**Sempre com `--prefer-online`:** sem ele o `npm view` responde do cache e a versão que
acabou de subir não aparece (aconteceu em 15/09/2026 — confirmação falsa de "não publicou").
Confira `time` também: em 10/09 a nota dizia "1.1.1 não publicado" e o registry dizia
que sim, publicado horas depois da nota.

## Conferir o que vai subir

```bash
node teste.mjs
npm pack --dry-run
```

O tarball tem que ter só script + documentação (7 arquivos, ~95 kB). `.marvin/` e `.Codex/`
não vão — é o `files` do `package.json` que manda.

## Push antes do publish

```bash
pwd && git remote -v && git log --oneline -1
git push --follow-tags
```

O `pwd` é obrigatório: em 03/08 um push saiu de dentro de outro repositório.

## Login e publish — quem roda é o humano

`npm whoami` com 401 = token expirado. **O `publish` responde 404, não 401** — o npm usa
404 para não revelar se o pacote existe. Não é "pacote sumiu".

```bash
npm login
```

Abre o navegador; entra com a security key, sem `--otp`. Agente não faz login: é credencial.

```bash
npm whoami && npm publish
```

Sucesso é a linha `+ marvin-kb@<versao>`. **Se ela não apareceu, não publicou** — em 15/09
o primeiro `publish` foi dado como feito e o registry não tinha a versão — e na 1.6.0, no mesmo dia, de novo: o humano rodou duas vezes, só a segunda subiu. Depois:

```bash
npm view marvin-kb version --prefer-online
```

Só com a versão nova aqui a US fecha.
