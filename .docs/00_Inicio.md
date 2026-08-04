---
name: inicio
aliases: ["Início", "Home", "MOC"]
tags: [moc]
---

# Marvin — Base de Conhecimento

> **Esta pasta é o vault.** No Obsidian: *Open folder as vault* apontando para `.docs`.
> Tudo aqui é arquivo real e versionado em git.

## Montagem

Existe **uma junction só**, e ela é invertida:

```
~/.claude/projects/<raiz-com-hifens>/memory  ──►  .docs/08_Memoria/
```

O Claude escreve no caminho padrão dele; os arquivos nascem dentro do repositório.

⚠️ Abrir o Claude Code sempre da **raiz do repositório** — a memória é derivada do `cwd`.
⚠️ A memória guarda decisão de produto e id de cliente. **Repo privado, sempre** — este
aqui é a exceção declarada no [AGENTS.md](../AGENTS.md), e por isso o caminho absoluto
foi trocado por um marcador.
⚠️ Mover ou renomear a pasta do projeto quebra a junction **em silêncio**: ela fica no
caminho antigo e um diretório vazio nasce no novo. As notas não se perdem — moram aqui.
Depois de mover: `node marvin.mjs --check` diagnostica, `node marvin.mjs` conserta.

## Retomar

Num chat novo: **`/retomar`**. Ele lê [[onde-paramos]], confere contra o código e
te diz onde parou. Essa nota é a **única** porta — sempre sobrescrita, nunca duplicada.

## Onde mora o que não está aqui

US, backlog, tickets e design: [[fontes-externas]].

## Higiene

Nada de arquivo que ninguém pediu. Antes de fechar qualquer trabalho:
`git status --short` e uma justificativa por arquivo novo — sem justificativa, apaga.
Arquivo de nome estranho na raiz (`,` `{` `i` `-x`) é comando de shell mal-formado,
não conteúdo.

## A preencher

- [ ] Os invariantes deste produto (o que nunca pode quebrar)
- [ ] As armadilhas do codebase (o que já mordeu)
- [ ] Decisões que não se reabrem
