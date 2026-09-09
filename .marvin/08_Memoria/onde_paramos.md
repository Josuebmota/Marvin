---
name: onde-paramos
aliases: ["onde-paramos", "ONDE PARAMOS"]
description: "ÚNICA porta de entrada do Marvin. Estado corrente — sempre sobrescrita."
tags: [moc, entrada]
metadata:
  type: project
  atualizado: 2026-09-09
---

# ▶ ONDE PARAMOS

**Atualizado:** 09/09/2026

> Esta nota é versionada e **pública**, porque este repositório é público. Escreva aqui
> como se fosse lido — o que for de outro projeto vai na memória daquele projeto.
> Ela também serve de exemplo: é assim que um `onde_paramos.md` preenchido se parece.

## Estado corrente

**No ar nos dois lugares.** Código em https://github.com/Josuebmota/Marvin e pacote em
`marvin-kb` no npm. Zero dependência de runtime, um arquivo só, **73 verificações** verdes
em Linux, Windows e macOS pelo CI.

A base de conhecimento chama `.marvin/` desde 09/09/2026 (era `.docs/`). `.docs` continua
na lista de candidatos e a detecção é por marcador, então **projeto montado antes não
precisa migrar**. O suporte a Obsidian saiu junto: a pasta é markdown puro e nada mais.

Duas features novas em 09/09, as duas nascidas de ler o toolkit alheio e de medir este
repositório com a própria régua:

- **Passo 1b — comandos canônicos.** O script lia QUAL manifesto existia e nunca o abria.
  Agora tira instalar/testar/build do `package.json`, `pyproject`, `go.mod`, `Cargo.toml`,
  `*.csproj`, `pubspec.yaml` e `Makefile`, com o gerenciador vindo do **lockfile** — e
  escreve a tabela no `AGENTS.md` com a coluna "de onde saiu", que é o que impede o bloco
  de envelhecer em silêncio. Sem manifesto legível, não inventa: a lacuna manual fica.
- **Passo 4b — a nota é contexto fixo.** O passo 4 media agente, skill e command e
  ignorava justamente o arquivo que mais cresce. Agora mede, e acima de ~6 KB avisa **com
  destino**: o porquê vai para `10_Decisoes/`, o relato já está no `git log`.

## Próximo passo

- **Consertar o ponteiro do `PROMPT.md` e do `--help`.** Eles ensinam
  `node <path>/marvin/marvin.mjs` e `<path>/marvin/PROMPT.md`, mas a via principal virou
  `npx marvin-kb` / `marvin` — quem instalou pelo npm não tem esse caminho. O ponteiro do
  `PROMPT.md` devia ser a URL do GitHub, que serve aos dois. Vale um patch.

## Travado

Nada.

## Decisões — o porquê mora em `10_Decisoes/`

Esta nota responde *onde estamos*. O *porquê de cada escolha* saiu daqui em 09/09/2026,
quando ela chegou a 19 KB e o próprio marvin a acusou no passo 4b. Nada foi perdido:

| Arquivo | Responde |
|---|---|
| [`decisoes-fechadas.md`](../10_Decisoes/decisoes-fechadas.md) | as restrições de desenho que não se reabrem |
| [`graphify-em-monorepo.md`](../10_Decisoes/graphify-em-monorepo.md) | por que o grafo nascia inútil, e o passo 8b |
| [`higiene-repo-publico.md`](../10_Decisoes/higiene-repo-publico.md) | as três camadas do git que a auditoria precisa varrer |
| [`ci-em-tres-sistemas.md`](../10_Decisoes/ci-em-tres-sistemas.md) | por que o CI roda em Linux, Windows e macOS |
| [`publicacao-no-npm.md`](../10_Decisoes/publicacao-no-npm.md) | o pacote, o nome ocupado e o 2FA por security key |
| [`sessoes-de-03-08.md`](../10_Decisoes/sessoes-de-03-08.md) | o dia da publicação, e os bugs que apareceram rodando |
