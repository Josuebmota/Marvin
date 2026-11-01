---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-97 — três pendências da régua e do ECC

**Por quê:** a [US-92](../US-92-regua-de-esforco-por-atividade/Sobre.md) e a [US-96](../../../ferramentas-opcionais/adaptadores/US-96-ecc-agentes-com-devolucao-e-escopo/Sobre.md) fecharam deixando três pendências pequenas que o dono pediu para fazer (01/11/2026), e esta é a segunda US em que a régua é aplicada na triagem antes de executar.
**Pronto quando:**
1. O "Escopo mínimo" que o `eccAgent()` acrescenta diz "…lista ou que a idempotência exige" (genérico), com o teste ajustado.
2. O passo 10 avisa (só avisa, não reescreve) o agente do ECC que o projeto já copiou e que não traz a Devolução; agente sem `# origem: ECC` (do humano) e agente que já traz o bloco não geram aviso; 3 testes novos; `desde: '3.4.4'`.
3. A régua em `delegacao.md` diz que "decide rumo" não vale para a triagem de rotina de uma US com spec fechada.
4. `npm run test` verde, contagem nos dois READMEs, `tl` leu o diff do `marvin.mjs`, `git diff --check` limpo; a tabela *Time* tem as duas escolhas (régua × julgamento solto) escritas antes de executar.

**Não entra:** reescrever agente do ECC que o projeto já tem; mudar o texto dos agentes locais.

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md): régua de esforço.

## Código tocado
- `marvin.mjs` — `eccAgent` (L2581) e `pendingUpdates` (passo 10, L5183)
- `teste.mjs`
- `.marvin/Contexto/Fluxos/delegacao.md` — seção "Régua de esforço por etapa"

## Time
Triagem 01/11/2026, régua da US-92 aplicada antes de executar; "julgamento solto" é o que a tabela do `Equipe.md` daria sem ela.

| etapa | papel | régua (sinal → escolha) | julgamento solto | estado |
|---|---|---|---|---|
| texto da régua ("decide rumo") | sessão principal | texto de documentação, reversível → médio → Sonnet · médio | Sonnet · médio | igual; feito 01/11 |
| cláusula + aviso no passo 10 + testes | dev-back | `UPDATES` é invariante e o aviso lê o disco de outro projeto → alto → Sonnet · alto | Sonnet · médio | **diferente (igual à US-96):** a régua sobe um degrau; feito 01/11: 677 testes, ~48,1k tokens, 20 chamadas, ~6,8 min |
| ler o diff do `marvin.mjs` | tl | `UPDATES` → obrigatório → Opus · médio | Opus · médio | igual; feito 01/11: pode fechar |
| conferir | qa | testes e `git diff --check` → baixo → Sonnet · baixo | Sonnet · baixo | igual; feito 01/11: 676 passaram, itens 1 a 3 conferem |

Grafo (01/11): `eccAgent()` sem dependente (US-96); `pendingUpdates()` — lida pelo passo 10 e pelo `--status` (US-62), conferir o formato dos avisos.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 3 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 1 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 1 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)](../../../../Manutencao/diagnostico/comandos/US-35-makefile-regex/Sobre.md) — 1 nó(s) em comum
- [US-41 — o `--status` conta o custo dos subagentes, por papel](../../../../Manutencao/diagnostico/custo/US-41-custo-dos-subagentes/Sobre.md) — 1 nó(s) em comum
- [US-64 — desvio de papel no `--status`](../../../../Manutencao/diagnostico/custo/US-64-desvio-de-papel-no-status/Sobre.md) — 1 nó(s) em comum
- [US-65 — custo por US](../../../../Manutencao/diagnostico/custo/US-65-custo-por-us/Sobre.md) — 1 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 1 nó(s) em comum
- [US-54 — ilha sem nome quando o arquivo começa com ponto](../../../../Manutencao/diagnostico/status/US-54-ilha-sem-nome/Sobre.md) — 1 nó(s) em comum
- [US-56 — o contexto fixo é vigiado na abertura de cada sessão](../../../../Manutencao/diagnostico/status/US-56-contexto-vigiado-na-abertura/Sobre.md) — 1 nó(s) em comum
- [US-74 — grafo velho e hook ausente viram alerta](../../../../Manutencao/diagnostico/status/US-74-grafo-velho-vira-alerta/Sobre.md) — 1 nó(s) em comum
- [US-78 — teto por documento e fragmento órfão](../../../../Manutencao/diagnostico/status/US-78-teto-por-documento/Sobre.md) — 1 nó(s) em comum
- [US-87 — o teto isenta US concluída e `Fontes/` vira raiz](../../../../Manutencao/diagnostico/status/US-87-teto-isenta-concluida-e-fontes-raiz/Sobre.md) — 1 nó(s) em comum
- [US-90 — o estado da US não envelhece](../../../../Manutencao/diagnostico/status/US-90-estado-que-nao-envelhece/Sobre.md) — 1 nó(s) em comum
- [US-38 — graphify obrigatório nos projetos gerados](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-38-graphify-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 1 nó(s) em comum
- [US-55 — o ponytail instalado em outro projeto não conta como instalado aqui](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-55-ponytail-escopo/Sobre.md) — 1 nó(s) em comum
- [US-66 — o refresh do graphify não apaga nem duplica os nós da base](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-66-graphify-preserva-origem-doc/Sobre.md) — 1 nó(s) em comum
- [US-67 — ponytail desligado aparece como desligado](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-67-ponytail-enabledplugins/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 1 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 1 nó(s) em comum
- [US-82 — o hook do grafo com `core.hooksPath` (husky) não mente](../../../../Manutencao/ferramentas-opcionais/adaptadores/US-82-hook-do-grafo-com-hookspath/Sobre.md) — 1 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 1 nó(s) em comum
- [US-84 — quebrar o `delegacao.md` e ligar os órfãos](../../../../Manutencao/publicacao/contexto-fixo/US-84-quebrar-delegacao-e-ligar-orfaos/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 1 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 1 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 1 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 1 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 1 nó(s) em comum
- [US-96 — o agente do ECC que o marvin copia sai com Devolução e Escopo mínimo](../../../ferramentas-opcionais/adaptadores/US-96-ecc-agentes-com-devolucao-e-escopo/Sobre.md) — 2 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../../ferramentas-opcionais/curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum
- [US-63 — skill citada nas instruções vem do ECC](../../../ferramentas-opcionais/curadoria/US-63-skill-citada-vem-do-ecc/Sobre.md) — 1 nó(s) em comum
- [US-69 — a matriz chama os agentes do ECC; o que não casa sai](../../../ferramentas-opcionais/curadoria/US-69-ecc-na-matriz/Sobre.md) — 1 nó(s) em comum
- [US-71 — o ponytail sai do obrigatório](../../../ferramentas-opcionais/curadoria/US-71-ponytail-sai-do-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-47 — Defect e Task na hierarquia](../../../organizacao-por-grafo/hierarquia/US-47-defect-e-task/Sobre.md) — 1 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../organizacao-por-grafo/script/US-05-release/Sobre.md) — 1 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 1 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 1 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-36 — painel com perguntas, decisões, roadmap e Time](../../../organizacao-por-grafo/script/US-36-painel-perguntas-decisoes-roadmap/Sobre.md) — 1 nó(s) em comum
- [US-52 — `anotada` aparece no `--status`](../../../organizacao-por-grafo/script/US-52-anotada-no-status/Sobre.md) — 1 nó(s) em comum
- [US-73 — estado `pausada` e estado inválido apontado](../../../organizacao-por-grafo/script/US-73-estado-pausada/Sobre.md) — 1 nó(s) em comum
- [US-75 — o *Impacto* do `Sobre.md` com teto](../../../organizacao-por-grafo/script/US-75-impacto-com-teto/Sobre.md) — 1 nó(s) em comum
- [US-76 — aba "Visão do dono" (resumo, em andamento, fila, depende de você)](../../../organizacao-por-grafo/script/US-76-visao-do-dono/Sobre.md) — 1 nó(s) em comum
- [US-77 — "Visão do dono": épicos, filtro e repositórios](../../../organizacao-por-grafo/script/US-77-visao-do-dono-epicos/Sobre.md) — 1 nó(s) em comum
- [US-79 — `--pausar`: pausar uma US sem editar o frontmatter à mão](../../../organizacao-por-grafo/script/US-79-pausar/Sobre.md) — 1 nó(s) em comum
- [US-81 — anotação é US `anotada`, e sai do índice quando vira trabalho](../../../organizacao-por-grafo/script/US-81-anotacao-vira-us-anotada/Sobre.md) — 1 nó(s) em comum
- [US-83 — `--us` aceita o caminho do `Sobre.md`](../../../organizacao-por-grafo/script/US-83-us-aceita-caminho-do-sobre/Sobre.md) — 1 nó(s) em comum
- [US-85 — as anotadas por nome no `--status` do terminal](../../../organizacao-por-grafo/script/US-85-anotadas-no-status-do-terminal/Sobre.md) — 1 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../glossario/US-44-glossario-da-equipe/Sobre.md) — 1 nó(s) em comum
- [US-45 — porta única: entrego as atividades e o Marvin orquestra](../../orquestracao/US-45-porta-unica/Sobre.md) — 1 nó(s) em comum
- [US-88 — travas por hook](../../orquestracao/US-88-travas-por-hook/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 1 nó(s) em comum
- [US-28 — mapa de personas, skills e modelos (Claude e ChatGPT/Codex) e arranjos por disponibilidade](../US-28-modelos-por-papel-claude-e-chatgpt/Sobre.md) — 1 nó(s) em comum
- [US-37 — condutor autônomo em sessões curtas](../US-37-condutor-autonomo-sessoes-curtas/Sobre.md) — 1 nó(s) em comum
- [US-42 — a execução não herda Opus por omissão](../US-42-execucao-nao-herda-opus/Sobre.md) — 1 nó(s) em comum
- [US-72 — o GPT na equipe: detectar, matriz e ponte](../US-72-gpt-na-equipe/Sobre.md) — 1 nó(s) em comum
- [US-89 — subir o degrau por check reprovado](../US-89-subir-degrau-por-check/Sobre.md) — 1 nó(s) em comum
- [US-91 — o Gemini na equipe: documentar, medir o par e só então mexer na matriz](../US-91-gemini-na-equipe/Sobre.md) — 1 nó(s) em comum
- [US-92 — Régua escrita de modelo e esforço por atividade, aplicada pelo tl e pelo po (e pelo subagente ao devolver)](../US-92-regua-de-esforco-por-atividade/Sobre.md) — 2 nó(s) em comum

## Rumo
- **01/11/2026** — aberta por pedido do dono ("podemos fazer isso"), junto com o desenho do fluxo do Marvin. Segunda aplicação da régua; de novo um braço só, sem controle em médio, então não prova que alto pagou.

- **01/11/2026** — **resultado.** Os 3 itens feitos: cláusula "ou que a idempotência exige" no Escopo mínimo do ECC; aviso do passo 10 (só leitura) para agente do ECC copiado sem a Devolução, 3 testes + 1 do caminho real (agente recém-instalado não é avisado); "decide rumo" esclarecido na régua. `tl` (Opus · médio): pode fechar, sem bloqueio; duas sugestões aplicadas (um `try` por arquivo, para um arquivo ilegível não calar os seguintes; o teste do caminho real). `qa`: 676 passaram, critérios 1 a 3 conferem; depois do ajuste, 677. **Custo do `dev-back` (Sonnet · alto): ~48,1k tokens, 20 chamadas, ~6,8 min** (US-96: ~48,6k, ~8,6 min); de novo um braço só, sem controle em médio: **n=2 de aplicação da régua, ainda não prova que alto pagou.** Dúvida do `dev-back`: o aviso diz só "missing the Devolução block", sem apontar onde está o texto; ficou assim por seguir o formato do laço.
- **01/11/2026** — pendência de release: as entradas de `UPDATES` das US-90, 92 e 97 usam `desde: '3.4.4'`; conferir que a 3.4.4 ainda não saiu antes de publicar (o `package.json` está em 3.4.3).

## Evidência
Teste: 677 passaram. Commit: `git log --grep "US-97 concluída"`.
