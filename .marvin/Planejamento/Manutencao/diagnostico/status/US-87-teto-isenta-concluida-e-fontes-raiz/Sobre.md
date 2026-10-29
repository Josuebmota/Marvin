---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-87-teto-isenta-concluida-e-fontes-raiz
description: "O --status não aplica o teto por documento (US-78) a US concluída, e Fontes/ vira raiz por regra como Releases/ (sem aviso de órfão). Respostas do dono às ❓ da US-84."
---
# US-87 — o teto isenta US concluída e `Fontes/` vira raiz

**Por quê:** respostas do dono (29/10/2026) às ❓ da [US-84](../../../publicacao/contexto-fixo/US-84-quebrar-delegacao-e-ligar-orfaos/Sobre.md). O teto da [US-78](../US-78-teto-por-documento/Sobre.md) (`marvin.mjs:1630`) vale para todo nó do `docsGraph` sem olhar o `estado:`: hoje o `--status` lista 6 documentos grandes, 5 deles US concluídas (19, 29, 36, 44, 69) que ninguém vai quebrar. Aviso que nunca some ensina a ignorar o bloco — inclusive o `equipe-barata.md`, que é real. `Fontes/` é histórico como `Releases/` (raízes por regra na L1632); hoje não há órfão lá (a US-84 ligou à mão), então a regra é preventiva.

**Pronto quando:**
1. Em `computeStatus`, um nó com `estado: concluida` no frontmatter (já lido na L1631 para o `hasPai`) sai de `st.documentos.grandes` — conforme a ❓2, só quando citado num `Releases/*.md`.
2. A regra de raiz da L1632 inclui `relDocs + 'Fontes/'` (`.marvin/Fontes/`); o comentário das L1619-1623 diz as duas regras.
3. `teste.mjs`, no bloco 9w2: US concluída grande não avisa; US ativa grande avisa; arquivo sem link e sem `pai:` em `Fontes/` não é órfão, e o mesmo fora de `Fontes/` é. A contagem nos dois READMEs acompanha.
4. Nesta base, o `--status` lista só o `equipe-barata.md` em "Documentos grandes"; "Fragmentos órfãos" segue vazio; `--curto` e `--html` não mudam.

**Não entra:** quebrar as concluídas; mudar os números do teto; desfazer os links do `Fontes/README.md`; `UPDATES` (nenhum template muda); layout antigo (`00_Fontes_Externas.md` na raiz já é linkado — segue igual).

## Perguntas
- ❓ 1. `cancelada` também fica isenta? `tl` e `po` recomendam sim (histórico, ninguém lê); cancelada não entra em release, então seria "cancelada → isenta sempre".
- ❓ 2. Isentar qualquer `estado: concluida` (a letra da resposta do dono) ou só a concluída que está num `Releases/*.md`? O `po` aponta a brecha: marcar `concluida` uma US ativa grande faria o aviso sumir; o critério de release já existe no `--release` (L2328) e as 5 de hoje passam. O `tl` propôs só o estado. Recomendação: só a que está em release.
- ❓ 3. Vale só para `tipo: us` ou também para epic/feature fechada? O `tl` recomenda qualquer nó com estado fechado.

## Fluxos ligados
- [status-html.md](../../../../../Contexto/Fluxos/status-html.md)

## Código tocado
- `marvin.mjs` — `computeStatus`
- `teste.mjs`
- `README.md`
- `README.pt-BR.md`

## Time
Triagem 29/10/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo).

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · baixo | duas condições numa função só de leitura | pendente |
| verificar | qa | Sonnet · baixo | `node teste.mjs` + `--status` real: sobra só o `equipe-barata.md` | pendente |

Sem `tl` no diff: só leitura, aviso sem mudar o código de saída, sem `UPDATES` nem disco de ninguém.

Grafo (fresco, 29/10 09:01 = último commit):
- `computeStatus` — L1504, grau 24; affected: nada
- `printStatus` — L1685, grau 14; affected: nada

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 4 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../US-56-contexto-vigiado-na-abertura/Sobre.md) — 2 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../US-74-grafo-velho-vira-alerta/Sobre.md) — 2 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../US-78-teto-por-documento/Sobre.md) — 2 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 2 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 2 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 3 nó(s) em comum
- [US-82 — o hook do grafo com `core.hooksPath` (husky) não mente](../../../ferramentas-opcionais/adaptadores/US-82-hook-do-grafo-com-hookspath/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-49 — identidade pública: equipe barata](../../../publicacao/identidade/US-49-identidade-equipe-barata/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- … e mais 38

## Rumo
- **29/10/2026** — anotada a partir das respostas do dono às ❓1 e ❓2 da US-84.
- **29/10/2026** — refinada (`/refinar`, `tl` e `po` no Opus · médio, em paralelo).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
