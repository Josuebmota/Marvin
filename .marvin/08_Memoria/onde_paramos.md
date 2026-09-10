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

**Código no ar; o `1.1.1` ainda não.** https://github.com/Josuebmota/Marvin está em `1.1.0`,
e o npm também. O **`1.1.1` está commitado e tagueado localmente, sem push e sem publish** —
ver Travado. Zero dependência de runtime, um arquivo só, **92 verificações** verdes em
Linux, Windows e macOS pelo CI.

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

1. **Publicar o `1.1.1`** (ver Travado) e então `git push --follow-tags`.
2. **O passo 4b mede o arquivo errado — ou melhor, mede só um dos três.** O que carrega em
   TODA sessão é `AGENTS.md` + o adaptador (`CLAUDE.md`, que faz `@AGENTS.md`) + a nota. O
   4b mede a nota e ignora os outros dois. Medido em 10/09:

   | | `AGENTS.md` | `CLAUDE.md` | nota | carrega sempre |
   |---|---|---|---|---|
   | Marvin | **2.418 tk** | 512 | 1.234 | 4.163 tk |
   | zino-agent-service | **2.941 tk** | 539 | 1.624 | 5.103 tk |
   | parci-front | **6.124 tk** | 1.298 | 1.096 | 8.518 tk |

   O `AGENTS.md` é o dobro da nota aqui e **cinco vezes** no `parci-front`. Passamos o dia
   09/09 cortando o arquivo menor. O 4b deve mostrar os três e o total.
3. **O `--check` também precisa mostrar isso** — é o comando que se roda por hábito, e é
   onde a régua pega antes de virar problema.
4. **A regra ainda não nomeia a brecha.** Ela proíbe criar `onde_paramos_<data>.md`, e todo
   mundo obedeceu: ninguém criou arquivo — criaram **seção nova dentro do mesmo arquivo**,
   18 delas no `parci-front`. O texto gerado tem que dizer que seção de relato é o mesmo
   erro que arquivo novo.
5. **O passo 3 confunde backup com lixo de shell.** Ele diz "almost always a malformed
   shell command" para qualquer nome estranho, mas `.bak`/`.orig`/`~` são backup declarado
   e pedem outra conversa. Visto num repo real com `firestore.rules.bak`.

**O princípio que faltava escrever:** teto é para o que carrega sozinho; o arquivo pode
crescer à vontade. O `10_Decisoes/` do Zino tem 58.110 tk e custa **zero** por sessão — é
por isso que o registro isolado por atividade funciona.

As duas ideias antigas, ainda não feitas: **painel de fechamento** (resumo do que ESTE run
fez, impresso, nunca em arquivo) e **skills mortas no passo 4** (cruzar as globais com a
stack detectada — única heurística do lote, entra como dica e nunca como "apague").

## Travado

- **O token do npm expirou.** `npm whoami` devolve 401 e o `publish` responde **404** — o
  npm usa 404 no lugar de 401 para não revelar se o pacote existe. O `~/.npmrc` tem token,
  mas morto. Conserto: `npm login` (navegador + security key, **sem `--otp`**), conferir com
  `npm whoami`, e então `npm publish`. Com 2FA por security key o token do fluxo web tem
  vida curta — deve repetir.

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
