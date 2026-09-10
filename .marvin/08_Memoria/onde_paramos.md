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
`marvin-kb@1.1.1` no npm. Zero dependência de runtime, um arquivo só,
**92 verificações** verdes em Linux, Windows e macOS pelo CI.

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

**1.1.1 (10/09)** — dois consertos nascidos de rodar a ferramenta em projeto de verdade:

- **Junction órfã agora é REPONTADA.** Aponta para pasta que não existe mais? É órfã, não
  montagem alheia — o script reponta e avisa. Quando o outro alvo existe, continua intocado.
  Duas ocorrências reais no mesmo dia trouxeram o ramo.
- **Os ponteiros ensinavam o caminho de quem clonou.** `--help` mostra `marvin`, `npx
  marvin-kb` e o clone nessa ordem; o rodapé aponta o `PROMPT.md` pela URL do GitHub.
- E o número de verificações do README **virou teste**: já desincronizou três vezes
  (26/28 · 48/73 · 73/87). Lembrar não funcionou.

## Próximo passo

Nada em fila. As duas ideias levantadas e não feitas:

- **Painel de fechamento** — um resumo no fim do run dizendo o que ESTE run fez.
  Impresso, nunca em arquivo: `PAINEL.md` seria artefato derivado envelhecendo em silêncio.
- **Skills mortas no passo 4** — cruzar as skills globais com a stack detectada e apontar
  as que não têm relação. É a única heurística do lote; entra como dica, nunca como "apague".

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
