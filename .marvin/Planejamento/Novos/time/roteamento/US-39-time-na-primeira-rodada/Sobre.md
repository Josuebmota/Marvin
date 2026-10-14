---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-39-time-na-primeira-rodada
description: "Agentes e skills definidos na 1ª rodada com a LLM depois de instalar, pelo glossário e pelo código, e criados quando faltam. Contradiz o espírito do invariante 4 — espera decisão do dono."
---
# US-39 — time proposto na primeira rodada

**Por quê:** itens 2 e 4 dos requisitos de 14/10 (fundidos): na 1ª rodada com a LLM após instalar, agentes e skills saem do glossário e do código; o que faltar no glossário é criado para aquele contexto. Hoje o template diz que agente só vira arquivo com armadilha concreta e skill na segunda execução (invariante 4, reescrito em 08/10).

**O conflito:** a letra do invariante 4 fica (quem escreve é a LLM com o dono, não o script); o espírito não — "genérico é pior que ausente" é exatamente o agente escrito pelo glossário antes de existir armadilha. A US-26 (concluída) já mostra e oferece as personas.

**Pronto quando:**
1. Decisão do dono registrada em `Contexto/Arquitetura/` e o invariante 4 reescrito no `AGENTS.md` deste repo e no template gerado.
2. Na 1ª rodada a LLM **propõe** o time a partir do glossário e do código — piso proposto pelo `tl`: só papel ligado a fronteira detectada no código (stack, schema, CI), nunca o catálogo inteiro — registrado como proposta; o arquivo nasce conforme a regra decidida em 1.
3. Medido num projeto real recém-montado (autorizado pelo dono): proposta da 1ª rodada × agentes de fato usados nas 3 primeiras US — quantos sobraram sem uso.
4. Comando gerado novo (se houver) com `writeIfMissing`, `fsw` e entrada na `ATUALIZACOES`.

**Não entra:** o script escrever corpo de agente ou skill; catálogo genérico gerado.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
- `marvin.mjs` — template do `AGENTS.md` gerado, Time/Skills e "só vira arquivo" (`:2495-2524`)
- `marvin.mjs` — README de agentes, "O que ESTE projeto sugere" (`:2865-2893`)
- `marvin.mjs` — comandos gerados (`:3034-3203`), saída final (`:4213-4214`), `ATUALIZACOES` (`:4040-4145`)
- `AGENTS.md` — invariante 4

## Time
Triagem 14/10/2026 (refino: `tl` + `po`). Ordem do dono: por último.
- `po`: decide com o dono o texto do invariante.
- `tl`: guarda a letra do invariante 4 e lê o diff.
- `dev-back` + `qa`.

## Skills
Nenhuma.

## ❓
- ❓ Revogar "só vira arquivo com armadilha concreta / skill na segunda execução"? Se sim, o que mordeu — em que projeto faltou um agente na hora em que ele era necessário, e quantas vezes?
- ❓ O piso do `tl` (só papel ligado a fronteira detectada no código) serve, ou a 1ª rodada cria o time inteiro?

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 1 nó(s) de código em 1 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 1 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 1 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 1 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 1 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../organizacao-por-grafo/script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../../../organizacao-por-grafo/script/US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../US-19-papel-modelo-esforco/Sobre.md) — 1 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 1 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 1 nó(s) em comum

## Rumo
- **14/10/2026** — refinada dos itens 2 e 4 (fundidos pelos dois). Bloqueada pela decisão do invariante 4.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
