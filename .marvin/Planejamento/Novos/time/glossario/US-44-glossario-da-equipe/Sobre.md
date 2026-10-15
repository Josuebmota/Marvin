---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-44-glossario-da-equipe
description: "A instalação escreve o glossário da equipe (Contexto/Equipe.md): cada papel com especialidade, quando entra e o que não faz. Lido na triagem, não em toda sessão."
---
# US-44 — o glossário da equipe vem na instalação

**Por quê:** O dono quer "contratar uma equipe que já sabe quem faz o quê". **Corrigido no refino de 15/10:** a tabela de papéis **não** está no `AGENTS.md` gerado — está no template do `Planejamento/README.md` (`marvin.mjs:2587-2598`), que só carrega sob demanda; o `AGENTS.md` gerado tem só o placeholder `_(preencher)_` (:3541-3557), que é do projeto e fica. Logo esta US **não economiza contexto fixo** nos projetos gerados; o valor é o que é novo ("quando entra", "o que não faz") e um lugar único para a 1ª rodada (US-39) ler. A economia de contexto deste repo saiu para a [US-51](../../../../Manutencao/publicacao/contexto-fixo/US-51-agents-md-enxuto/Sobre.md). Pela régua do plano isso pode rebaixar a US — ver ❓1. Arquitetura: [equipe-barata](../../../../../Contexto/Arquitetura/equipe-barata.md).

**Pronto quando:**
1. `node teste.mjs` passa, com checks novos:
   - o glossário nasce em `Contexto/Equipe.md` (layout novo) e na raiz de `DOCS` no layout antigo (mesmo ternário `OLD_LAYOUT` do `IA.md`, `marvin.mjs:1767`), via `writeIfMissing`/`fsw`, uma linha por papel dos 10, com colunas "quando entra" e "o que não faz";
   - o `Planejamento/README.md` gerado **não** contém `` | `scout` | `` (a tabela virou link para o glossário);
   - nenhum arquivo gerado importa o glossário com `@`, e ele não fica em `.claude/agents/`;
   - a segunda rodada numa base nova não imprime "10. Updates" (nenhuma marca órfã).
2. Entrada nova em `UPDATES` (`marvin.mjs:4217`) com `desde: '2.10.0'` e marca com `\s+`. Base 2.9.0 recebe só o aviso e o `Planejamento/README` fica byte-idêntico depois da rodada (invariante 2). Toda marca cujo texto saiu do template (:4341 `AGENTS.md`, a do `Planejamento/README` logo abaixo) é ajustada.
3. "Glossário" desambiguado: os textos da 2.9.0 que dizem "a partir do glossário" (:2604, :3552) apontam para o arquivo certo, e o "glossário" de modelos do `IA.md` (:2358, :2396) não se confunde com o da equipe (❓2).
4. Invariante 4 reescrito com o texto do `tl` (Rumo de 15/10) no `AGENTS.md` deste repo **e** no template.
5. Os dois READMEs ganham a linha do glossário e a contagem de verificações bate (o último teste confere). Esta US vem **depois** da US-49 (mesma ilha).

**Não entra:** armadilha de projeto escrita pelo script; criar arquivo de agente na instalação; mexer em `TEAM_ROLES` (`marvin.mjs:553` é o parser da seção *Time* do `--status`, não a tabela); o `AGENTS.md` deste repo além do invariante 4 (é a US-51).

## Código tocado
- `marvin.mjs` — :2569-2602 template `Planejamento/README.md` (tabela de papéis), :2604 e :3552 ("a partir do glossário"), :3541-3557 template `AGENTS.md` (seção O time + invariante 4), :1767 (ternário de layout), :2349 `writeIfMissing`, :4217-4346 `UPDATES`
- `teste.mjs` — checks novos
- `AGENTS.md` — invariante 4
- `README.md`, `README.pt-BR.md` — linha do glossário e contagem

## Time
- **Grafo (15/10, fresco: graph.json 6 s depois do último commit):**
  - `TEAM_ROLES` (:553) — `affected`: nenhum; `explain`: grau 1 (só o :547). Não é a tabela; fica fora.
  - `UPDATES` (:4217) — `affected`: nenhum; `explain`: grau 2, ligada à US-42.
  - `writeIfMissing` (:2349) — `affected`: nenhum; `explain`: grau 3 (chama `info`, `ok`).
  - templates literais (:2569, :3500) — sem nó; fallback Grep.
- **Riscos (`tl`):** invariante 2 (marca órfã → aviso falso em base nova) e layout antigo (pasta `Contexto/` indevida). Nenhum dado destruído.
- `po` Opus médio — o Por quê e o ❓1
- `tl` Opus médio — triagem e diff (invariantes 2 e 4)
- `dev-back` Sonnet médio — template e `UPDATES`; o risco é de invariante, não de ambiguidade
- `qa` Sonnet baixo — checks e layout antigo
- `scout` Haiku — localizar
- **Tamanho:** 1 chat (`tl`). US de núcleo: só ela ativa entre as que tocam `marvin.mjs`.
- **Amostra US-29:** fora do par da Fase 2 se o dono aceitar US-49 + US-51 (classes diferentes, `po`); fica amostra sem par.

## Skills
_(nenhuma)_

## ❓
1. ~~Ainda paga?~~ Respondido em 15/10: o dono mandou implementar. **Ainda paga?** (`po`) Sem ganho de contexto fixo, que número mostra a equipe "não sabendo quem faz o quê" num projeto real? Sem ele, pela régua do plano a US desce na fila. O `tl` a trata como 1 chat, sem objeção de valor.
2. ~~Nome~~ Respondido em 15/10: `Equipe.md`. O nome fica `Equipe.md` e "glossário" passa a ser só da equipe (tirando o termo do `IA.md`), ou os dois convivem com nomes distintos?
3. ~~Coluna de modelos~~ Respondido em 15/10: **traz** — "o glossário de tudo tá no ECC, mas o arranjo para baratear por modelo é o Marvin que faz". O `Equipe.md` traz a coluna Opus/Sonnet/Haiku (critério 2 do rascunho), ou isso fica só no `CLAUDE.md` para não prender o arquivo gerado a um fornecedor? (`tl`; o rascunho trazia a coluna)

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 4 nó(s) de código em 3 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 3 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-27 — atualizar a base do Marvin com o que o próprio Marvin gera](../../../../Manutencao/diagnostico/atualizacoes/US-27-atualizar-a-base-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 3 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 3 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 3 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-43-grafo-rota-de-busca/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-51 — AGENTS.md deste repo enxuto](../../../../Manutencao/publicacao/contexto-fixo/US-51-agents-md-enxuto/Sobre.md) — 1 nó(s) em comum
- [US-49 — identidade pública: equipe barata](../../../../Manutencao/publicacao/identidade/US-49-identidade-equipe-barata/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 3 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 3 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 3 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 2 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 3 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 3 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 3 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 2 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 3 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 2 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../../ferramentas-opcionais/curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../../organizacao-por-grafo/hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../organizacao-por-grafo/script/US-05-release/Sobre.md) — 2 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 2 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../../../organizacao-por-grafo/script/US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 2 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 3 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 2 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 2 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 2 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../../../organizacao-por-grafo/script/US-52-anotada-no-status/Sobre.md) — 1 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../orquestracao/US-45-porta-unica/Sobre.md) — 2 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../roteamento/US-19-papel-modelo-esforco/Sobre.md) — 4 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 3 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 2 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../../roteamento/US-39-time-na-primeira-rodada/Sobre.md) — 2 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 2 nó(s) em comum

## Rumo
- **15/10/2026** — anotada a partir da definição "equipe barata" do dono. Está fora da fila até o `/refinar`.
- **15/10/2026** — revisão da arquitetura (`tl` + `po`, Opus medium): o `po` achou que a tabela de papéis já existe no `AGENTS.md` gerado, que carrega em toda sessão. Por isso a US passa a **mover** a tabela, não criar, e economiza contexto fixo. Texto do invariante 4 proposto pelo `tl`:
  > **4. O script não escreve conteúdo que exige conhecer o projeto.** Sobre a equipe, ele escreve só o glossário genérico (`.marvin/Contexto/Equipe.md`): papel, especialidade, atribuições, quando entra e o que não faz, igual em todo projeto, sem stack, caminho nem armadilha. O glossário é referência lida na triagem; nunca vai para `.claude/agents/`, nunca é importado com `@`, e não é lista do que criar: um papel só vira arquivo de agente com uma armadilha concreta do código, escrito pelo `tl` e pelo `po` na 1ª rodada ou na US que o pede; skill, na segunda execução. O corpo de agentes, de skills e do `AGENTS.md` nunca sai do `marvin.mjs`. (Mudado em 15/10/2026 por decisão do dono: a instalação passa a trazer o glossário.)
  O invariante 4 fica nesta US, não na US-49, para que o texto público não prometa o glossário antes de ele existir (`tl`). O `po` preferia na US-49.

- **15/10/2026** — `/refinar` (Fase 1): refinada. Premissa corrigida (tabela no `Planejamento/README`, não no `AGENTS.md`); critério 6 virou a US-51; `tl` achou marca órfã, layout antigo e "glossário" ambíguo.
- **15/10/2026** — ativa (ordem do dono: as 6 da fila neste chat, portão da Fase 2 passado por decisão dele). **Configuração declarada (amostra US-29):** política — `dev-back` Sonnet médio implementa, `qa` Sonnet baixo verifica, `tl` Opus médio lê o diff. Achado: o `AGENTS.md` gerado não tem seção de invariantes; o critério 4 vale só para o `AGENTS.md` deste repo. O "glossário" de modelos do `IA.md` fica com o nome (renomear deixaria marca órfã em `UPDATES` :4219); a desambiguação é chamar o novo de "glossário da equipe" com link.
- **15/10/2026** — concluída. `dev-back` (Sonnet) implementou; `qa` (Sonnet) rodou o script de verdade num temp; `tl` (Opus) aprovou o diff com um ajuste opcional (teste byte-idêntico), aplicado na sessão principal.
- **15/10/2026** — ajuste pós-fechamento (antes do release): o dono observou que o ECC já tem os especialistas, mas com modelo fixo por agente, sem esforço nem regra de subir (conferido no backup: `planner`/`architect` em `opus`, `code-reviewer`/`tdd-guide` em `sonnet`, "MUST BE USED"/"PROACTIVELY"). A dinâmica de custo é do Marvin, então o glossário ganhou a coluna "modelo · esforço" e a regra "quem decide não é quem executa; sobe só se falhar, esforço antes de modelo". `tl` aprovou com ajuste de texto (aplicado). 379 checks.

## Evidência
- `node teste.mjs` → 373 passaram (eram 366; 7 checks novos da US-44).
- `qa`: `--dry-run` não escreve e anuncia `create file .marvin/Contexto/Equipe.md`; 2ª rodada sem passo 10 e md5 idênticos; `Equipe.md` com 10 papéis, sem stack/caminho; links para `IA.md` e do `Planejamento/README` resolvem.
- `tl`: invariante 2 ok (`writeIfMissing` :2350-2354), nenhuma marca existente órfã, `UPDATES` 2.10.0 com `soCom: !OLD_LAYOUT`, invariante 4 fiel ao Rumo, sem `@`, determinístico.
- Arquivos: `marvin.mjs`, `teste.mjs`, `AGENTS.md`, `README.md`, `README.pt-BR.md`.
