---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-32 — graphify e ponytail juntos

**Por quê:** nas palavras do Josué (11/10/2026), "sempre os dois, isso deveria ser regra, pq os dois se ajudam". Na migração dos 6 projetos para a 2.3.0, foi preciso `--use=graphify --use=ponytail` em cada um, porque o `marvin` rodado por um agente (sem TTY) grava `não` mesmo com as duas ferramentas instaladas (`marvin.mjs:1825-1827`, de propósito desde a US-11a: detectada não é escolhida).

**O que é medido e o que é hipótese (`po`):** o atrito é medido (6 vezes), mas já foi pago. Daqui em diante custa um flag por projeto novo. "Os dois se ajudam" não tem número: o ponytail tem confiança **baixa** e nunca foi medido.

**As três leituras de "regra", da mais barata à mais cara:**
- **(A) Documentar.** O `--use=graphify,ponytail` já funciona com uma flag só (`marvin.mjs:108`). Uma linha nos dois READMEs e na dica de `marvin.mjs:4154`. Sem TTY, com as duas detectadas, o aviso sugere esse comando único.
- **(B) Uma pergunta pelas duas**, no TTY, quando as duas são detectadas. Não resolve o caso medido, que era sem TTY. Sem trava automática possível (o teste não tem TTY): lacuna declarada.
- **(C) Ligar as duas por padrão quando detectadas, mesmo sem TTY.** É a única que teria evitado os 6 flags. **O `tl` bloqueia:**
  - um `marvin` sem TTY (hook, CI, agente) num repo com o graphify no PATH passaria a rodar a extração (~1 min em monorepo) e a escrever `graphify-out/` e a seção no `CLAUDE.md` sem ninguém ter escolhido;
  - o ponytail "instalado mas não ativo" viraria `sim` e geraria seção de ferramenta que não faz nada, o adaptador que não carrega do invariante 3;
  - relitiga a decisão da US-11a e transforma a preferência de um dono em convenção de todo projeto que o Marvin monta.

**Recomendação do `tl` e do `po`:** (A). Quem tem só uma das duas instalada segue o fluxo atual; a ausente **nunca** vira `sim` por tabela.

**Pronto quando (se for A):**
1. README (os dois) e a dica final do script mostram `marvin --use=graphify,ponytail` como o jeito de ligar as duas.
2. Sem TTY, com as duas detectadas e ativas, a saída traz uma linha única com esse comando, em vez de dois avisos separados.
3. Trava em `teste.mjs`: sem TTY, as duas continuam `não` (sem mudança de comportamento) e a linha sugerida aparece.

❓2 (Josué): qual leitura? **(A)** documentar e juntar o aviso, **(B)** uma pergunta pelas duas no TTY, ou **(C)** ligar por padrão quando instaladas e ativas, mesmo sem TTY, revertendo a US-11a. O `tl` bloqueia a (C) pelos cenários acima.
❓3 (Josué): se for (C), vale para todo usuário do Marvin ou só como recomendação nos **seus** projetos? Nos seus, as duas já estão `sim` em todos desde 11/10/2026.

**Não entra:** `--use=graphify` implicar o ponytail; mudar o significado de "detectada"; o bug da escrita perdida (é a [US-31](../US-31-use-duplo-perde-escrita/Sobre.md)).

**Funde com:** refinamento da [US-11a](../US-11a-registro-e-graphify/Sobre.md) (ramo sem TTY) e da [US-11b](../US-11b-ponytail-e-papeis/Sobre.md) (detecção do ponytail instalado ou ativo). As duas estão fechadas.

## Código tocado
- `README.md` e `README.pt-BR.md` — seção do `--use`
- `marvin.mjs` — aviso sem TTY do bloco 0b (~1825-1827) e a dica final (~4154)
- `teste.mjs` — seção do `--use`

## Time
Triagem 11/10/2026 (`/refinar`). Os dois concordam: (A), prioridade baixa, depende do ❓2.
- `dev-back` · `qa` · `tl`.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../../Manutencao/codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../../../../Manutencao/diagnostico/atualizacoes/US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-30 — base mais nova não é rebaixada por um `marvin` mais velho](../../../../Manutencao/diagnostico/atualizacoes/US-30-base-a-frente-nao-rebaixa/Sobre.md) — 2 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../../../Manutencao/diagnostico/passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../../Manutencao/memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../US-24-fechar-por-sub-repo/Sobre.md) — 2 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../US-31-use-duplo-perde-escrita/Sobre.md) — 2 nó(s) em comum
- [US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile](../US-34-playwright-front-mobile/Sobre.md) — 2 nó(s) em comum
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
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum

## Rumo
- **11/10/2026** — refinada. Espera a resposta do Josué ao ❓2. Depois da US-30 e da US-31.
- **14/10/2026** — ativa (Josué pediu para desenvolver todas as pendentes). ❓2 por padrão: **(A)**, a recomendação de `tl` + `po`; o dono pode trocar antes de publicar.
- **14/10/2026** — implementada a opção (A): sem TTY, as ferramentas detectadas e não escolhidas saem num aviso único com `marvin --use=graphify,ponytail` (lista de vírgula); a dica final sugere a mesma linha a quem não usa nenhuma das duas. Comportamento inalterado: continuam `não`. READMEs documentam a lista com vírgula. `tl` aprovou.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- `node teste.mjs`: **332 passaram**, com graphify falso no PATH e ponytail ativo plantado (hermético).
- Mutações (`dev-back`): voltar o `warn` inline → check 12 vermelho.
