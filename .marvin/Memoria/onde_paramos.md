---
name: onde-paramos
aliases: ["onde-paramos", "ONDE PARAMOS"]
description: "ÚNICA porta de entrada do Marvin. Só ponteiros para as US em andamento — sempre sobrescrita."
tags: [moc, entrada]
metadata:
  type: project
  atualizado: 2026-09-16
---

# ▶ ONDE PARAMOS

> Esta nota é versionada e **pública**, porque este repositório é público. Ela é uma
> lista de ponteiros: o estado, as decisões e o rumo de cada US moram no `Sobre.md` dela —
> **não aqui**. Esta nota carrega em TODA sessão; o que ela aponta só carrega quando é seguido.
>
> - Concluiu e foi validada → entra em `Releases/<versao>.md` com a evidência, e **sai daqui**.
> - Duas sessões em paralelo editam **linhas diferentes**; nenhuma reescreve a outra.
> - Criar `onde_paramos_<data>.md` **ou uma seção de relato aqui dentro** é o mesmo erro:
>   o histórico já está no `git log`, e o porquê já está no Rumo da US.

**Atualizado:** 22/09/2026

## Em andamento

nada.

## Travado

- **A US-18 está implementada e verde (237), mas NÃO publicada.** O `marvin` que os projetos
  rodam é a cópia npm `1.8.0`; enquanto não sair release, o `Impacto` continua afirmando "folha do
  grafo" para US que dividem arquivo de núcleo. Decisão do Josué: rodar `--release`.
