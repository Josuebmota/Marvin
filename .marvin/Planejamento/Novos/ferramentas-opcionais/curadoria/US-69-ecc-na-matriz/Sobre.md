---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-69-ecc-na-matriz
description: "A triagem chama agente do ECC quando a etapa casa com o verbo dele; o ECC_PLAN para de instalar o que a stack não pede (typescript-reviewer e build-resolver em Node puro) e respeita o agente que o projeto removeu."
---
# US-69 — a matriz chama os agentes do ECC; o que não casa sai

**Por quê:** auditoria de 22/10: 4 agentes copiados do ECC (`build-error-resolver`, `code-reviewer`, `tdd-guide`, `typescript-reviewer`), **0 chamadas** desde 16/10, e nenhum *Time* os cita. **Decisão do dono, 22/10/2026:** a triagem chama agente do ECC quando a etapa casa; o que não casa com nenhuma etapa sai do projeto. Hoje a regra só diz "procure no ECC quando faltar" (Equipe.md gerado, `marvin.mjs:2774-2784`; refinar gerado, `:3589` e `:3682`; `delegacao.md:233`). Apagar não basta: o laço do ECC (`marvin.mjs:3829`) só pula o que existe, então reinstala; e o `ECC_PLAN` (`:1535`) casa `'Node/JS'` com `typescript-reviewer` e `build-error-resolver`, e instala `code-reviewer` e `tdd-guide` sempre (`:1533-1534`). Funde com a [US-60](../US-60-ecc-fonte-da-equipe/Sobre.md), que copiou e nunca chamou.

**Pronto quando:** (fechado por `tl` + `po` em 22/10; linhas atualizadas: laço do ECC ~L3904-3932, regra no Equipe.md ~L2863-2873, `/refinar` ~L3678, `/us` ~L3771, checagem "faltando" ~L1675-1679, `UPDATES` ~L4925-4933)
1. **Regra genérica** no template do `Equipe.md` e dos comandos `/refinar` e `/us` (invariante 4: sem stack nem caminho): "Agente do ECC entra quando a etapa casa com o verbo dele: teste-primeiro → `tdd-guide`; erro de build → `*-build-resolver`; segurança (`sec`) → `security-reviewer`; banco (`dba`) → `database-reviewer`. O casamento vai na linha do *Time*. Agente copiado que não casa com nenhuma etapa sai: apague o arquivo e anote o id em `ecc fora:` no `ferramentas.md`, senão o `marvin` copia de novo. O `tl` lê o diff mesmo depois de um revisor do ECC." A frase antiga "Procure primeiro no ECC" fica (é marca da `UPDATES`); marca nova `/etapa\s+casa\s+com\s+o\s+verbo/` nos três arquivos, `desde: '3.4.2'`.
2. **`ECC_PLAN`:**
   - sai o `code-reviewer` (era `true`) e saem os `<lang>-reviewer` de todas as stacks — não há etapa "revisão de linguagem" até um par medido (decisão do dono, 22/10, partida do `po`);
   - `build-error-resolver`/`react-build-resolver` só com `scripts.build` num `package.json` (ler com `JSON.parse`, não regex); TypeScript passa a ser `has('TypeScript')` ou dependência `typescript` (só `Node/JS` não basta); compiladas (Go, Rust, Java, Dart, C#) mantêm o resolver; sai o `django-build-resolver` (Python não tem build);
   - entram `security-reviewer` só com sinal de auth/segredo e `database-reviewer` só com SQL/migração (critério de stack definido pelo `tl` na implementação, sem chute; Postgres/Supabase — o agente é focado neles).
3. **Registro de exclusão:** linha solta no `.marvin/ferramentas.md`, fora da tabela, escrita pelo humano: `ecc fora: <id>, <id>`. Leitura `/^ecc fora:[ 	]*(.*)$/m`, ids separados por `[,\s]+`, vale para agente e skill. Filtra em dois pontos: `wantAgents`/`wantSkills` no laço do ECC **e** a conta do "faltando" do `--status`/`--check`. O `marvin` nunca escreve a linha (invariante 2).
4. **Neste repo:** saem `build-error-resolver`, `code-reviewer` e `typescript-reviewer` de `.claude/agents` (e de `.codex/agents`, depois de conferir de onde vieram os `.toml` não rastreados), com a linha `ecc fora:` listando os três; o `tdd-guide` fica.
5. **`teste.mjs`:** Node puro sem TS e sem `scripts.build` não recebe reviewer nem build-resolver; com `scripts.build` recebe `build-error-resolver`; `code-reviewer` não é mais copiado; id em `ecc fora:` não é recopiado nem aparece no "faltando"; 2ª rodada e `--dry-run` sem escrita; a regra nova sai nos três templates.
6. O alcance do `ecc` gerado para o `ferramentas.md` deixa de dizer "Catálogo de referência, não instalação" (falso desde a US-60).

**Não entra:** escrever corpo de agente (só cópia literal do ECC); a etapa "revisão de linguagem" (volta com par medido, US própria); `e2e-runner` (choca com a US-34), `doc-updater` (derivado versionado), `refactor-cleaner`, `planner`/`architect` (duplicam `po`/`tl`); skills (é a US-63); hooks, regras e comandos do ECC; apagar arquivo já copiado em projeto alheio (invariantes 1 e 2: quem decide é o humano, pelo `ecc fora:`).

## Perguntas
- ✅ Revisores: saem os dois deste repo (`tl` e `po`). Nos projetos gerados, o dono (22/10, "pode fazer todas" — partida do `po`, a recomendada): sem etapa de revisão de linguagem até medir.
- ✅ `sec`/`dba`: entram agora (dono, 22/10), com critério de stack.
- ✅ O `tl` lê o diff mesmo depois de revisor do ECC (`tl` e `po`).
- ✅ Ordem: US-69 antes da US-63, em série. A 63 herda um critério: a skill citada também respeita o `ecc fora:`.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md): o "procure primeiro no ECC" vira "a etapa casa com o ECC?".

## Código tocado
- `marvin.mjs` — `ECC_PLAN`
- `marvin.mjs` — bloco instalador do ECC (`if (ECC)`, ~L3818-3840)
- `marvin.mjs` — template do `Equipe.md`
- `marvin.mjs` — template do `/refinar`
- `marvin.mjs` — `UPDATES`
- `teste.mjs`

## Time
Triagem 22/10/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo).

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| fechar a regra e os ❓ | po + tl | Opus · médio | decisão de escopo; quem decide não executa | feito (2 ❓ levados ao dono) |
| teste que falha | tdd-guide | Sonnet · baixo | agente do ECC que casa com a etapa | feito: 8 falharam pelo motivo certo |
| implementar | dev-back | Sonnet · médio | partida | feito, com 1 retrabalho (2 itens do tl) |
| verificar | qa | Sonnet · baixo | cenários: Node puro, exclusão, 2 rodadas, `--dry-run` | aprovado com o catálogo real |
| ler o diff | tl | Opus · médio | mexe em `UPDATES` e escreve `.claude/agents/` de terceiros | pediu 2 mudanças, aprovou |

Grafo (fresco, 22/10 07:01): `ECC_PLAN` → affected nenhum; explain só o contains, L1522. Laço do ECC **sem nó** (bloco de topo) — localizado por Grep. Templates: sem nó próprio — Grep.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 3 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 2 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../../Manutencao/diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../../../Manutencao/diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../../Manutencao/diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../../Manutencao/diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 1 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 2 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 2 nó(s) em comum
- [US-43 — o grafo como rota de busca, só depois da medição](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-43-grafo-rota-de-busca/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 2 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 2 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 2 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 2 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../adaptadores/US-34-playwright-front-mobile/Sobre.md) — 2 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
- [US-63 — skill citada nas instruções vem do ECC](../US-63-skill-citada-vem-do-ecc/Sobre.md) — 3 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../../organizacao-por-grafo/hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../organizacao-por-grafo/script/US-05-release/Sobre.md) — 2 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 2 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../../../organizacao-por-grafo/script/US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 2 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 2 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 2 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../../../organizacao-por-grafo/script/US-52-anotada-no-status/Sobre.md) — 1 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../time/glossario/US-44-glossario-da-equipe/Sobre.md) — 2 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../../time/orquestracao/US-45-porta-unica/Sobre.md) — 2 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../../../time/roteamento/US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 2 nó(s) em comum
- [US-39 — time proposto na primeira rodada](../../../time/roteamento/US-39-time-na-primeira-rodada/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../../../time/roteamento/US-42-execucao-nao-herda-opus/Sobre.md) — 2 nó(s) em comum

## Rumo
- **22/10/2026** — aberta e refinada (auditoria; decisão do dono sobre o ECC).
- **23/10/2026** — concluída. `ECC_PLAN` sem `code-reviewer` e sem `<lang>-reviewer`; build-resolver só com `scripts.build`; `security-reviewer`/`database-reviewer` por manifesto e pasta; `ecc fora:` lido (aceita crase e item de lista) e filtrado no laço e no "faltando"; regra nos 3 templates e na `UPDATES` (`desde: '3.4.2'`). O `tl` pegou dois buracos: um teste antigo que, ao trocar os revisores, virou cópia de outro e parou de provar o strip das frases de gatilho; e a linha `ecc fora:` escrita como o próprio template mostra (com crase) falhando em silêncio. Desvio aceito: o build-resolver de JS entra por `scripts.build` (o TypeScript sozinho não basta). Ressalva do `tl`, não bloqueia: `hasBuildScript` é global entre pastas — monorepo com build só no back leva o `react-build-resolver` ao front. Neste repo: saíram `build-error-resolver`, `code-reviewer`, `typescript-reviewer` (e os `.toml` do Codex), com `ecc fora:`; a regra foi trazida à mão para os 3 arquivos.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- `node teste.mjs`: 521 passaram (bloco US-69, casos 1-7 e 4b; testes antigos da US-60/62 e android ajustados).
- `qa`, catálogo ECC real: Node puro → só `tdd-guide`; `scripts.build` → `build-error-resolver`; `ecc fora: tdd-guide` → não volta e o `--status` não acusa falta; `"pg"` → `database-reviewer`; `"jsonwebtoken"` → `security-reviewer`.
- Este repo: `marvin --dry-run` não recopia nada do ECC e não tem mais nenhuma `UPDATES` pendente.
