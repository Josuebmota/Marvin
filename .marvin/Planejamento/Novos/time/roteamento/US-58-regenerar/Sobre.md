---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-58-regenerar
description: "marvin --regenerar: backup conferido e reescrita só dos arquivos que o Marvin gera, para levar bases antigas ao template atual sem perder US, nota nem contexto."
---
# US-58 — `marvin --regenerar`

**Por quê:** dono, 16/10: "papoca os marvins e refaz, sem perder as stories". Os comandos e templates são gerados uma vez (`writeIfMissing`, invariante 2), então base antiga nunca recebe a regra nova de execução da US-57 — só o aviso do passo 10.

**Pronto quando:**
1. Só com a flag: copia para `<DOCS>/99_Backup/regenerar-<versão>/` (caminho achatado), confere byte a byte, só então remove; os blocos normais recriam com o template atual.
2. Lista fechada: comandos (retomar, us, fechar, refinar, continuar), `Planejamento/README`, glossário, `agents/README`. Nunca `AGENTS.md`, `CLAUDE.md`, nota, US, contexto, agentes, `ferramentas.md`, `IA.md`.
3. Relata as linhas do backup que não estão no novo (customização a recolocar).
4. Dry-run honesto; segunda rodada não duplica; poda só pasta que a rodada criou.

## Time
| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| implementar | dev-back | Sonnet · médio | partida | feita |
| verificar | qa | Sonnet · baixo | partida | feita |
| ler o diff | tl | Opus · alto | remove arquivo no disco alheio | feita |

## Rumo
- **16/10/2026** — aberta e concluída junto com a US-57 (mesmos arquivos, um escritor).

## Evidência
- `qa` num temp: dry-run sem escrita; backups byte-idênticos; `AGENTS.md`, `CLAUDE.md`, nota, US e `ferramentas.md` com md5 idêntico; 2ª rodada sem `-2`. `tl`: nenhum caminho remove pasta de fora da rodada.
