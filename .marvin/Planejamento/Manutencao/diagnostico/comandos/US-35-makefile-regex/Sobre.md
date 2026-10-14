---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-35 — o alvo do Makefile casa errado (`tests:` vira `make test`)

**Por quê:** achado pelo `tl` na triagem da US-34 (14/10/2026). Em `marvin.mjs:2060`, `new RegExp('^' + target + '\s*:', 'm')` está numa string comum, em que `'\s'` vira só `s`. Por isso a regex fica `^tests*:`. Dois erros saem daí:
- um Makefile só com o alvo `tests:` faz o `AGENTS.md` sair com `make test` em *Comandos canônicos*, e esse comando falha;
- `test :`, com espaço antes dos dois-pontos, não é detectado.

O mesmo vale para `build`, `lint` e `install`.

**Pronto quando:**
1. A regex vira `'^' + target + '[ \\t]*:'`, ou equivalente: só espaço ou tab entre o alvo e os dois-pontos, na mesma linha.
2. **Trava em `teste.mjs`**:
   - Makefile só com `tests:` → *Comandos canônicos* sem `make test`;
   - Makefile com `test :` → com `make test`.

   Com a regex antiga, o primeiro caso fica vermelho.
3. `node teste.mjs` verde.

**Não entra:** ler outros sistemas de build; alvo com variável (`$(TEST):`); `test::` (regra dupla).

## Código tocado
- `marvin.mjs` — detecção do Makefile em *Comandos canônicos* (~2055-2061)
- `teste.mjs` — o caso do Makefile

## Time
Triagem 14/10/2026: achado do `tl`, aberta pela sessão principal porque o dono pediu para desenvolver todas as pendentes. `dev-back` implementa junto com a US-32/34, `tl` lê o diff. Grafo não consultado nesta triagem.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../../Novos/ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../../Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../../Novos/ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../../Novos/ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 2 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../../Novos/ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 2 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../../Novos/ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 2 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../../../../Novos/ferramentas-opcionais/adaptadores/US-34-playwright-front-mobile/Sobre.md) — 2 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../../Novos/organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../../Novos/organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../../Novos/organizacao-por-grafo/script/US-05-release/Sobre.md) — 2 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../../Novos/organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../../Novos/organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 2 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../../../../Novos/organizacao-por-grafo/script/US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../../Novos/organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 2 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../../Novos/organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 2 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../../Novos/organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../../Novos/organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../../Novos/time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum

## Rumo
- **14/10/2026** — aberta e ativa. Bug real, uma linha e um teste.
- **14/10/2026** — implementada e validada: a regex vira `'[ \t]*:(?!=)'`. Ressalva do `tl` aplicada na sessão principal: `build := ./out` é variável de Makefile e não pode virar `make build`, por isso o `(?!=)`; `test::` continua casando.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- `node teste.mjs`: **332 passaram**, com 3 checks: `tests:` não vira `make test`, `test :` vira e `build :=` não vira.
- Mutação (`dev-back`): voltar a regex antiga → `tests:` e `test :` vermelhos. A regex sem `(?!=)` casa `build :=`, e o check novo fica vermelho.
