---
tipo: us
estado: cancelada
pai: ../Sobre.md
name: US-107b-par-com-e-sem-serena
description: "Refinada: o par com e sem a Serena na mesma US de leitura de código, mesmo modelo e esforço, para decidir o usa no ferramentas.md. Só roda se a US-107a não parar. Segunda metade da US-107."
---
# US-107b — o par com e sem a Serena

**Por quê:** o reel afirma 90% de economia sem medição; só um par no mesmo modelo e esforço diz se a Serena ajuda aqui, no molde da [US-68](../US-68-ponytail-medido/Sobre.md) e da [US-104](../US-104-impeccable-opcional/Sobre.md). **Depende da [US-107a](../US-107a-ler-fonte-e-custo-fixo-da-serena/Sobre.md):** se ela parar a avaliação (não carrega como MCP, ou o custo fixo come o ganho), esta US é cancelada sem par.

**Pronto quando** (esta US não escreve código do `marvin.mjs`):
1. **O par:** a mesma US de leitura de código, num projeto do OvenorGroup com servidor de linguagem, uma vez sem e outra com a Serena (escopo de projeto ou worktree), no mesmo modelo e esforço. Aceite escondido igual nos dois braços; medir $, turnos e tokens, e quantos arquivos inteiros cada braço leu.
2. **Teto de gasto:** ~2 × 125k tokens (escala da US-104), no máximo 300k ao todo. Estourou, para e registra.
3. **Decisão no Rumo:** o `usa` vira `sim` só com custo ≤ +10% e aceite igual ou melhor. Um par (n=1) decide só o `não`; o `sim` exige um segundo par, como o ponytail exigiu.
4. **Registro:** os números na linha `serena` do `.marvin/ferramentas.md` (abaixo de 600 caracteres) e o critério de reabertura.
5. **Portão da US-43:** se o par der `sim`, vale também o caso real em que o Grep ou o graphify errou o "onde está X"; sem ele, `sim` só como opcional, nunca obrigatório.

**Não entra:** código no `marvin.mjs` (`OPTIONAL_TOOLS`, detecção, oferta no `AGENTS.md`, `UPDATES`): isso é outra US, só se o par der `sim`, como a US-106 foi para a US-104; tornar obrigatório; substituir o graphify; instalar fora de escopo de projeto; projeto de cliente; comparar memória com o `.marvin/Memoria`; o método do reel.

## Perguntas
- ~~❓ 1. (da US-107) A dor é custo de tokens em leitura de código ou contexto de documentos e memória?~~ → **os dois** (dono, 04/11/2026). Este par mede só a leitura de código. A parte de documentos e memória vira US separada, e só se a 107a confirmar que a Serena guarda memória.
- ~~❓ 2. Em qual projeto do OvenorGroup rodar o par?~~ → **Parci** (dono, 04/11/2026). Falta conferir linguagem com servidor de linguagem e código grande o bastante para a leitura pesar; se não servir, volta ao dono.

## Fluxos ligados
- [delegacao.md](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
Nenhum código. Editado: `.marvin/ferramentas.md` (a linha `serena`).
- `.marvin/ferramentas.md` — a linha `serena`

## Time
Triagem 04/11/2026 (`/refinar`, `tl` e `po` no Opus · médio, em paralelo). A entrada no `OPTIONAL_TOOLS` **não está aqui**: é US filha, só se o par der `sim`.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| rodar o par | dev-back | Sonnet · médio | mesmo degrau das US-68 e US-104 | pendente |
| conferir o aceite | qa | Sonnet · baixo | aceite escondido igual nos dois braços | pendente |
| decidir o `usa` | tl + po | Opus · médio | julgamento; o dono dá a palavra final | pendente |

## Skills
Nenhuma.

## Rumo
- **04/11/2026** — refinada (`/refinar`, `tl` e `po` no Opus · médio). Nasce da US-107. Fica atrás da 107a e da ❓1.

- **04/11/2026** — cancelada: o par inline coube na 107a (1 par, tarefa de achar usos; Serena pior em completude) e o dono fechou `usa: não`.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
