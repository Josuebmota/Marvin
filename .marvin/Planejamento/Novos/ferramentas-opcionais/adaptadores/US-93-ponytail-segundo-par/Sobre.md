---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-93 — ponytail: segundo par medido

**Por quê:** a [US-68](../US-68-ponytail-medido/Sobre.md) deu +22% ($1,090 com × $0,896 sem) com n=1, e o dono (31/10/2026) manteve o ponytail obrigatório até haver um segundo par, porque uma amostra só não derruba nem sustenta a regra do `AGENTS.md`.
**Pronto quando:**
1. Protocolo no Rumo antes de rodar: tarefa **diferente** da US-68 e de tamanho diferente, do `dev-back`, duas cópias limpas, Sonnet · médio nos dois braços, aceite escondido, ligando o ponytail só em `.claude/settings.local.json`.
2. Conferido na transcrição que o nível do ponytail **chega ao subagente** (a US-68 já exigiu isso); se não chegar, registra e para.
3. Tabela no Rumo: $, turnos, testes verdes, tamanho do diff, aceite, com × sem; somada ao par da US-68 (n=2).
4. O dono decide com os dois números: a linha do ponytail em `ferramentas.md` e a menção no `AGENTS.md` são ajustadas à decisão, e a ressalva de 31/10 sai.

**Não entra:** ligar em `~/.claude` ou no `.claude/settings.json` versionado; outros papéis; Codex/Copilot; código no `marvin.mjs`.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md): o `dev-back` é quem carrega a escada.

## Código tocado
- `.claude/settings.local.json` — `enabledPlugins` (só durante a medição)
- `.marvin/ferramentas.md` — linha do ponytail
- `AGENTS.md` — invariante 4, menção ao ponytail

## Time
| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| protocolo | po | Sonnet · baixo | molde da US-68 já existe | pendente |
| rodar o par | dev-back | Sonnet · médio | mesmo modelo nos dois braços | pendente |
| ler o resultado | po + tl | Opus · médio | decide-se regra obrigatória do dono com base no número | pendente |

Grafo: sem símbolo de código tocado — só documentação e configuração local; nada a perguntar ao `affected`/`explain`.

## Skills
Nenhuma.

## Rumo
- **31/10/2026** — aberta. Origem: dono escolheu medir um 2º par em vez de aceitar o `não` (caminho 3). Nota: a US-68 tinha como critério 4 "se não pagar, vira `não`", então o `não` de 23/10 seguiu o protocolo dela; a decisão obrigatória de 16/10 e esse protocolo estavam em conflito, e esta US o resolve com número.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
