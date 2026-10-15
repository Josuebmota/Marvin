---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-49-identidade-equipe-barata
description: "README e README.pt-BR dizem o que o Marvin é desde 15/10: a carapaça da LLM, uma equipe barata de desenvolvimento."
---
# US-49 — identidade pública: equipe barata

**Por quê:** Os textos públicos descrevem o produto antigo ("~1810 linhas", "sai da frente" — o script tem 4.419 linhas e passou a orquestrar a equipe). É mentira pública e barata de tirar. **Não** mexe na métrica de contexto fixo da Fase 1: o README não carrega por sessão (`po`). Arquitetura: [equipe-barata](../../../../../Contexto/Arquitetura/equipe-barata.md).

**Pronto quando:**
1. `grep -nE "1810|sai da frente|gets out of the way" README*.md` sai vazio.
2. Topo e "Por que existe" reescritos **juntos** nos dois idiomas, com a frase de identidade do dono (❓1).
3. Nenhuma linha nova cita `Equipe.md` nem "glossário da equipe" — o glossário entra nos READMEs pela US-44, quando existir (`tl` + `po`).
4. Número de linhas do script sai do texto (já envelheceu uma vez) — ou, se o dono quiser manter, "~4400".
5. `node teste.mjs` passa (o último teste confere a contagem de verificações nos READMEs).

**Não entra:** `marvin.mjs`; o invariante 4 (é da US-44); o glossário; o `AGENTS.md`.

## Código tocado
- `README.md` — :27-28 (topo), :665 ("Por que existe")
- `README.pt-BR.md` — :28 (topo), :658 ("Por que existe")

## Time
- **Grafo (15/10, fresco: graph.json 6 s depois do último commit):** `README.md` — nó de documento, grau 19 (só arestas `touches` de US antigas), sem `affected`; texto não tem dependente de código. Fallback: Grep para as linhas.
- **Ilha:** os READMEs também são tocados pela US-44 (contagem e glossário) → mesma ilha, em sequência, nunca em paralelo. Esta vai **antes** (`tl` e `po` concordam).
- `po` Opus médio — a identidade é texto do dono
- `dev-back` Sonnet baixo — escreve os dois idiomas juntos
- `tl` Opus baixo — diff e contagem
- **Amostra US-29:** papel/modelo/esforço acima declarados antes de rodar; corte de turnos ou sessão própria; check idêntico = critérios 1 e 5; "aprovada" = ❓3. Par na Fase 2: ver ❓2.

## Skills
_(nenhuma)_

## ❓
1. Qual é a frase de identidade? "Equipe barata" é o termo final no README público (em inglês, como fica)?
2. O `po` aponta que US-49 (doc) + US-44 (código + template + migração) **não formam par** da mesma classe na US-29; propõe US-49 + [US-51](../../contexto-fixo/US-51-agents-md-enxuto/Sobre.md). Aceita? Qual delas roda na configuração anterior (tudo na sessão Opus)?
3. "Aprovada" é o seu aceite sem retrabalho ou o check verde?

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../../Novos/ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../../Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../../Novos/ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 1 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../../Novos/ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 1 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../../Novos/ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../../Novos/organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 1 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../../Novos/organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 2 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../../Novos/organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 2 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../../Novos/time/glossario/US-44-glossario-da-equipe/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../../Novos/time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 1 nó(s) em comum

## Rumo
- **15/10/2026** — anotada a partir da definição "equipe barata" do dono. Está fora da fila até o `/refinar`.
- **15/10/2026** — revisão da arquitetura (`tl` + `po`, Opus medium): o invariante 4 saiu desta US e foi para a US-44, para ter um escritor só e não prometer o glossário antes de ele existir.
- **15/10/2026** — `/refinar` (Fase 1): refinada. Critérios fechados por `tl` + `po`; o `AGENTS.md` saiu do escopo (era citado na descrição).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
