---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-62-retomar-sincroniza
description: "O hook acusa base desatualizada e o /retomar roda o marvin antes das portas; skill atribuída por etapa no Time."
---
# US-62 — o `/retomar` sincroniza a base; skill por etapa

**Por quê:** dono, 16/10: "eu mesmo esqueço de rodar" — o fluxo dele é abrir o chat, `/retomar`, escolher 1 (desenvolver) ou 2 (refinar); nunca roda o `marvin`. A base ficava velha em silêncio (ex.: a `andare` ainda sem código: quando o Expo aparecer, os agentes de TS/React do ECC nunca chegariam). E a atribuição por etapa no refino tem de incluir a skill, não só agente, modelo e esforço.

**Pronto quando:**
1. `--status --curto` (só leitura) imprime uma linha `base desatualizada (…) — o /retomar sincroniza` quando o carimbo é mais velho, falta agente/skill do plano ECC ou falta seção nova (passo 10); nada quando está em dia.
2. O `/retomar` roda o `marvin` antes de oferecer as portas e diz em até 3 linhas o que entrou; sem commit à parte, sem push.
3. A coluna `papel` do *Time* aceita `agente · skill`; `/refinar`, `/us`, `/continuar` e `/retomar` atribuem e delegam com a skill da linha.
4. O `--status` continua só leitura (nada escreve, nenhum prompt, sai 0).

## Time
| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | partida | feita |
| ler o diff | tl | Opus · alto | hook de toda sessão; ordem do `--status` | feita |

## Rumo
- **16/10/2026** — `tl` reprovou a 1ª versão: para o `--curto` ver o plano do ECC, o bloco `--status` tinha descido para depois do 0a (disponibilidade de IA), que cria `.gitignore`, sai com exit 1 em JSON inválido e abre prompt num TTY; e `--status --us/--migrar` passavam a escrever. Corrigido: o `--status` voltou ao lugar e só as definições de leitura subiram para antes dele. `tl` reaprovou, reproduzindo os cenários com HOME isolado.

## Evidência
- `node teste.mjs` → 467 passaram (14 novos: linha de base desatualizada, ECC faltando, `--curto` sem escrita, JSON inválido sai 0, `--status --us` não cria Sobre.md, skill por etapa).
- `--status --curto` neste repo: ~0,9–1,1 s antes e depois (ruído de máquina).
