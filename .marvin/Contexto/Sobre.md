---
tipo: projeto
---
# Marvin

Script Node sem dependências que monta a base de conhecimento de um projeto para trabalhar
com agentes de IA: uma fonte de verdade (`AGENTS.md`), adaptadores finos por ferramenta,
memória versionada dentro do repositório por junction, e esta pasta — organizada como grafo.
**Não é** gerador de agentes: o conteúdo que exige conhecer o projeto é do humano.

## Fluxos

_(um fluxo entra aqui quando é analisado numa atividade — não antes)_

## Arquitetura

As restrições de desenho e o porquê de cada uma. Regime: acrescenta, nunca sobrescreve.

- [decisoes-fechadas](Arquitetura/decisoes-fechadas.md) — zero dependência, um arquivo, sem config, sem versão gravada, graphify como consulta
- [organizacao-por-grafo](Arquitetura/organizacao-por-grafo.md) — por que esta pasta é assim, e o que foi medido antes
- [ci-em-tres-sistemas](Arquitetura/ci-em-tres-sistemas.md) — o CI é o dono do "funciona no macOS?"
- [graphify-em-monorepo](Arquitetura/graphify-em-monorepo.md) — por que o grafo nascia inútil, e o passo 8b
- [higiene-repo-publico](Arquitetura/higiene-repo-publico.md) — as três camadas do git que a auditoria varre
- [publicacao-no-npm](Arquitetura/publicacao-no-npm.md) — o pacote, o nome ocupado e o 2FA por security key
- [junction-quebrada](Arquitetura/junction-quebrada.md) — a receita manual para a junction de OUTRO projeto

## Em andamento

Ver [onde_paramos](../Memoria/onde_paramos.md) — só ponteiros para as US ativas.

## Como esta base está organizada

| Pasta | Responde | Regime |
|---|---|---|
| `Contexto/` | o que o projeto **é** | cresce quando um fluxo é analisado |
| `Planejamento/` | o que está sendo **feito**: Epic → Feature → US | todo nó tem um `Sobre.md` |
| `Releases/` | o que **subiu** para main | índice, um arquivo por versão |
| `Fontes/` | apoio e o que vive fora deste repositório | |
| `Memoria/onde_paramos.md` | as US **em andamento** | só ponteiros; sobrescrito |

Ligação é **link markdown** — é o que vira aresta no grafo. Menção em prosa não conta.
Nada muda de pasta ao concluir: a US ganha `estado: concluida` e entra numa release.
Mudar esta organização é uma entrada no Rumo abaixo.

## Portabilidade

| Item | Migra? |
|---|---|
| `AGENTS.md`, esta pasta inteira, a memória | ✅ é só markdown |
| Persona dos agentes (o corpo do `.md`) | ✅ copiar e colar |
| Definição de modelo/tools no frontmatter | ❌ formato de cada ferramenta |
| Slash commands | ❌ vira prompt manual |
| Auto-load da memória | ❌ **só o carregamento; os arquivos ficam** |

## Rumo

- **10/09/2026** — base reorganizada por grafo. Antes era por tipo de arquivo
  (`08_Memoria/`, `10_Decisoes/`, `11_Sessoes/`); o porquê e o que foi descartado estão em
  [organizacao-por-grafo](Arquitetura/organizacao-por-grafo.md). As decisões vieram para
  `Arquitetura/`, o relato de 03/08 foi para `Fontes/`, `11_Sessoes/` e `90_Anexos/` morreram vazias.
