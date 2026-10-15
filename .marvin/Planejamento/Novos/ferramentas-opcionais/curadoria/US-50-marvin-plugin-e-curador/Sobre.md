---
tipo: us
estado: anotada
pai: ../Sobre.md
name: US-50-marvin-plugin-e-curador
description: "O Marvin vira o único plugin do Claude e, ao ser chamado num projeto, instala no escopo daquele projeto só as ferramentas que a equipe usa: ECC, graphify, ponytail e Superpowers."
---
# US-50 — o Marvin é o único plugin e instala as ferramentas por projeto

**Por quê:** decisão do dono de 15/10/2026. O perfil global tinha o ECC, quatro plugins, hooks do Orca e MCPs, pagos em toda sessão de todo projeto. Foi limpo no mesmo dia, com backup reversível em `~/.claude/_backup-2026-10-15/`. Daqui em diante, ferramenta só entra pelo Marvin e no escopo do projeto. Arquitetura: [equipe-barata](../../../../../Contexto/Arquitetura/equipe-barata.md).

**Pronto quando (rascunho — o refino fecha):**
1. **Medida a limpeza:** o contexto fixo de uma sessão antes e depois (passo 4b, mais o `/context` do Claude Code). É a primeira amostra da US-29.
2. **Curadoria por projeto:** `marvin` num projeto instala, **no escopo do projeto**, as ferramentas que o registro `ferramentas.md` diz `sim`. São o ECC (escopo de projeto do instalador dele, só as skills que a equipe chama), o graphify, o ponytail e o Superpowers. Tudo via `exec` e `fsw`, idempotente e com `--dry-run` honesto. Ferramenta ausente vira aviso e não aborta.
3. **Nada global:** o Marvin nunca instala no perfil do usuário. Um projeto não vê a ferramenta de outro.
4. **Marvin como plugin do Claude Code:** avaliar o empacotamento (`.claude-plugin/`) ao lado do npm. Ele não pode ganhar `dependencies` e sai com confiança declarada (invariante 3). Se o plugin não paga, fica o npm, com o motivo registrado.
5. **O que veio do backup volta por projeto:** as skills de .NET (`dotnet-patterns`, `csharp-testing`, `bump-dependencia`) voltam nos projetos .NET pela curadoria, não no global.

**Não entra:** reinstalar no global; conectores do claude.ai (é a conta do dono); apagar o backup.

## Código tocado
- `marvin.mjs` — `OPTIONAL_TOOLS`, detecção e instalação por ferramenta, `ATUALIZACOES`
- `.marvin/ferramentas.md`
- `package.json` (só se o plugin pedir; sem `dependencies`)
- `teste.mjs`

## Time
_(a triar no refino: `po` + `tl`, com o passo de estrutura do grafo)_

## Skills
`adaptador-de-ferramenta` (já existe).

## ❓
- ❓ Os conectores do claude.ai (Vercel, Notion, Gmail, Supabase, Cloudflare, Calendly, vidIQ, Gamma…) seguem ligados na conta e pesam em toda sessão. O dono desliga os que não usa nas configurações do claude.ai.

## Rumo
- **15/10/2026** — anotada com a decisão do dono. A limpeza do perfil global já foi feita e é reversível: tudo foi movido para `~/.claude/_backup-2026-10-15/`, sem apagar. As contagens conferiram: 16 agentes, 26 comandos e 22 skills. O link `skills/watch` foi movido como link.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
