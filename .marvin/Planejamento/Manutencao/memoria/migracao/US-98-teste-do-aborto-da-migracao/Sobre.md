---
tipo: us
estado: refinada
pai: ../Sobre.md
name: US-98-teste-do-aborto-da-migracao
description: "Cobrir com teste o ramo que aborta a migração de memória quando a cópia sai menor que a origem (invariante 1), sem mudar o marvin.mjs."
---
# US-98 — teste do aborto da migração

**Por quê:** o invariante 1 (nunca destruir dado sem conferir a contagem) é o mais caro do projeto, e o ramo que aborta quando a cópia sai menor que a origem não tem teste: `marvin.mjs:3617-3621` compara `copied < origin`, monta `notCopied` e sai com `process.exit(1)` **antes** do `rmSync(MEM)` da :3624; o teste da migração (`teste.mjs:277-300`) só cobre o caminho feliz, e a lacuna está declarada no cabeçalho (`teste.mjs:35-38`). O ramo mordeu 0 vezes até hoje (`po`), então é prova de um invariante, não conserto de falha medida.
**Pronto quando:**
1. Dois testes herméticos no `teste.mjs`: (a) a cópia sai com menos arquivos que a origem → saída 1, a memória de origem intacta e nenhuma junction criada; (b) a lista `notCopied` cita o item que não foi copiado (subpasta sem `.md`).
2. A cópia parcial é forçada por um preload `node --import` que troca `fs.cpSync` por uma versão que pula um arquivo: vale porque `fsw === fs` na execução real (`marvin.mjs:331`) e o script importa o `fs` padrão (:65). O `run()` do teste (`teste.mjs:110`) passa a aceitar argumentos do node. **O `marvin.mjs` não muda.**
3. O teste **falha de verdade** se o ramo sair: remova temporariamente o `process.exit(1)` e confira que o teste novo reprova (um teste que passa sem chegar ao ramo seria pior que a lacuna declarada).
4. O cabeçalho "KNOWN GAP" deixa de citar esse ramo; `npm run test` verde, a contagem nos dois READMEs (README.md:784, README.pt-BR.md:773) acompanha, `tl` leu o diff.

**Não entra:** mudar a migração; os abortos do `--migrar` (`marvin.mjs:2445`) e do regenerar (:3109), que também não têm teste (US própria, se o dono quiser); mock de dependência no código de produção.

## Perguntas
- ~~❓ Aceita um preload de teste que troca `fs.cpSync` em tempo de execução? É a única forma sem refatorar a migração. Se a resposta for não, a US é cancelada e a lacuna declarada é a decisão certa (`po`).~~ → **aceito** (dono, 01/11/2026).

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
- `teste.mjs` — `run` (L110) e o bloco da migração (§5, L277-300)
- `README.md` e `README.pt-BR.md` — contagem de verificações

## Time
Triagem 01/11/2026 (`tl` e `po` em Opus · médio, régua da US-92 aplicada: só teste, sem mexer no script, reversível → médio).

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| escrever os dois testes e o preload | dev-back | Sonnet · médio | só `teste.mjs`; o risco é o teste não chegar ao ramo, coberto pelo item 3 | pendente |
| ler o diff | tl | Opus · médio | o teste é a prova do invariante 1 | pendente |
| conferir | qa | Sonnet · baixo | teste verde, contagem nos READMEs, `git diff --check` | pendente |

Grafo (01/11): o bloco de migração fica no nível de cima do arquivo, **sem nó**; Grep para localizar. `countNotes` (:501) sem dependente. Sem nó é limite do grafo, não ausência de risco.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 1 nó(s) em comum
- [US-87 — o teto isenta US concluída e `Fontes/` vira raiz](../../../diagnostico/status/US-87-teto-isenta-concluida-e-fontes-raiz/Sobre.md) — 1 nó(s) em comum
- [US-90 — o estado da US não envelhece](../../../diagnostico/status/US-90-estado-que-nao-envelhece/Sobre.md) — 1 nó(s) em comum
- [US-99 — nota velha no `--status`](../../../diagnostico/status/US-99-nota-velha-no-status/Sobre.md) — 1 nó(s) em comum
- [US-40-linha-fora-da-tabela](../../../ferramentas-opcionais/adaptadores/US-40-linha-fora-da-tabela/Sobre.md) — 1 nó(s) em comum
- [US-70 — o hook pós-commit refaz o lado dos docs do grafo](../../../ferramentas-opcionais/adaptadores/US-70-hook-refaz-docs-do-grafo/Sobre.md) — 1 nó(s) em comum
- [US-80 — o hook que atualiza o grafo vem ligado por padrão](../../../ferramentas-opcionais/adaptadores/US-80-hook-do-grafo-por-padrao/Sobre.md) — 1 nó(s) em comum
- [US-49 — identidade pública: equipe barata](../../../publicacao/identidade/US-49-identidade-equipe-barata/Sobre.md) — 1 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 1 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 1 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 1 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../../Novos/ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../../Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 1 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../../Novos/ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 1 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../../Novos/ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 1 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../../Novos/ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 1 nó(s) em comum
- [US-71 — o ponytail sai do obrigatório](../../../../Novos/ferramentas-opcionais/curadoria/US-71-ponytail-sai-do-obrigatorio/Sobre.md) — 1 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../../Novos/organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 1 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../../Novos/organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../../Novos/organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-85 — as anotadas por nome no `--status` do terminal](../../../../Novos/organizacao-por-grafo/script/US-85-anotadas-no-status-do-terminal/Sobre.md) — 1 nó(s) em comum
- [US-44 — o glossário da equipe vem na instalação](../../../../Novos/time/glossario/US-44-glossario-da-equipe/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 1 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../../Novos/time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 1 nó(s) em comum
- [US-89 — subir o degrau por check reprovado](../../../../Novos/time/roteamento/US-89-subir-degrau-por-check/Sobre.md) — 1 nó(s) em comum

## Rumo
- **01/11/2026** — anotada na conversa de 01/11. Crivo `tl` + `po`: a US é testável sem tocar no script (preload do `tl`); o `po` achou lacuna e não falha medida, prioridade média, e tinha proposto uma função pura (que mudaria a migração); prevaleceu o preload porque respeita o "não mudar a migração". Divergência registrada: o `po` contou 3 ramos de aborto, o `tl` só cobre 1 (os outros 2 ficam fora).
- **01/11/2026** — ❓ respondida pelo dono: preload aceito. Pronta para executar (dev-back Sonnet · médio, `tl` no diff).
