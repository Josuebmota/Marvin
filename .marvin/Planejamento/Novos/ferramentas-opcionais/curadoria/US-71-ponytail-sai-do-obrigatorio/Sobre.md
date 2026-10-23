---
tipo: us
estado: concluida
pai: ../Sobre.md
name: US-71-ponytail-sai-do-obrigatorio
description: "O ponytail volta a ser opcional no script (medido na US-68, não pagou): projeto novo grava `não` e não instala; `--use=ponytail` liga; o `sim` de quem já tinha não é tocado; graphify e ECC seguem obrigatórios."
---
# US-71 — o ponytail sai do obrigatório

**Por quê:** decisão do dono, 23/10/2026 ([decisoes-fechadas.md](../../../../../Contexto/Arquitetura/decisoes-fechadas.md), última entrada): ferramenta é obrigatória quando ajuda; medida e não pagou, sai do obrigatório. O par da [US-68](../../adaptadores/US-68-ponytail-medido/Sobre.md) mediu o ponytail no `dev-back`: +22% de custo, n=1, sem ganho no aceite. Hoje `marvin.mjs:2371` tem `obrigatorio: true` (regra da [US-59](../US-59-graphify-ponytail-obrigatorios/Sobre.md)): todo projeto novo instala o plugin, grava `sim` sem perguntar, e um `não` gera o aviso "default is MANDATORY". Volta a ser obrigatório só com um par que mostre ganho em **decisão** (`tl`/`po`), o uso que o dono mapeou e que nunca foi medido.

**Pronto quando:**
1. `marvin.mjs:2371`: sai o `obrigatorio: true`, sem `padrao` — o ponytail volta aos ramos de antes da US-59 (`ea386d4`, ~L2415-2429): ausente grava `não` com a dica de instalar; detectado com terminal pergunta uma vez `[y/N]`; com `--no-questions` ou sem terminal grava `não` e avisa `--use=ponytail`. Caem sozinhos o aviso MANDATORY (L2408), a instalação automática (L2435) e o `sim` sem perguntar (L2411).
2. Texto: `marvin.mjs` L118 e L2366 (comentários), L177-179 (`--help` do `--install`), L2478 (template do `ferramentas.md`: "graphify, ponytail e ecc" → "graphify e ecc"), o `o_que` da `UPDATES` L5016; `README.md` L43, 108, 263, 434-435 e `README.pt-BR.md` L43, 109, 259-261, 430-431, os dois juntos.
3. `UPDATES`: entrada nova (`desde: '3.4.2'`, regex `\s+`, ex. `graphify\s+e\s+ecc`) que avisa quem tem o cabeçalho "Obrigatórias (custo)" antigo no `ferramentas.md`; a marca antiga (L5015) não vira aviso falso.
4. `teste.mjs` (troca de valor, sem enfraquecer — lista do `tl`): L494 ausente grava `| ponytail | não |` sem `DietrichGebert` no log; L498 sem `--use` não sai a seção Ponytail no AGENTS.md nem a tabela no README (o positivo segue em L520/522); L672 instalado sem terminal grava `não` e avisa `--use=ponytail`; L2169 dry-run não lista o ponytail; L2189 `c1.length===2`; L2192 `calls().length===4`; L2543 grava `não`. Novos: registro `sim` antigo + plugin ausente sem `--install` → zero `claude plugin install ponytail` e a dica; com `--install`, os dois passos; registro `não` não imprime `MANDATORY`. graphify e ECC seguem obrigatórios (regressão).
5. Neste repo: `marvin --dry-run` sem o aviso MANDATORY para o ponytail.

**Não entra:** a tabela "Ponytail: em que papel entra" e o selo da seção do AGENTS.md (só saem com `sim`; mudar o conteúdo com n=1 é outra decisão); remover o ponytail do `OPTIONAL_TOOLS`; mexer em graphify/ECC; reescrever o registro de ninguém (invariante 2); medir o ponytail em decisão (US própria quando houver par).

## Perguntas
- ✅ Projeto novo sem terminal: grava `não` (`po` e `tl`: a decisão fica visível no registro).
- ✅ `--install`: instala o ponytail só onde o registro diz `sim` (`tl`; o `po` sugeria "só quem pede" — é o mesmo).

## Fluxos ligados
- [ferramentas.md](../../../../../ferramentas.md): o registro que esta mudança alimenta.

## Código tocado
- `marvin.mjs` — `OPTIONAL_TOOLS`
- `marvin.mjs` — `UPDATES`
- `teste.mjs`
- `README.md` / `README.pt-BR.md`

## Time
Triagem 23/10/2026 (`/refinar`, `tl` Opus · médio e `po` Sonnet · baixo, em paralelo).

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| teste que falha | tdd-guide | Sonnet · baixo | asserções especificadas pelo `tl` | feito |
| implementar | dev-back | Sonnet · médio | script, `--help`, template, READMEs e `UPDATES` | feito |
| verificar | qa | Sonnet · baixo | conferência mecânica: teste e os dois READMEs | aprovado (+ 2ª revisão no GPT, ver Rumo) |
| ler o diff | tl | Opus · médio | mexe em `UPDATES` e no disco de terceiros | aprovado |

Grafo (código fresco, 22/10 19:10; docs velhos pelo `decisoes-fechadas.md` não commitado): `OPTIONAL_TOOLS` → affected nenhum; explain L2365, liga à US-48. `detectPonytail` → affected `marvin.mjs` (indirect_call L2371); explain chama `samePath()`, US-55 e US-67. `ponytailReach` → affected nenhum; explain L2357, US-67. O grafo não vê `f.obrigatorio`/`f.nome` nem os testes — localizados por Grep.

## Skills
Nenhuma.

## Rumo
- **23/10/2026** — aberta e refinada; entra na 3.4.2 (pedido do dono). Risco baixo: o caminho de código já existia e foi testado antes da 3.3.0; o risco real é texto desincronizado entre `--help`, os dois READMEs e o template.
- **23/10/2026** — concluída. O ponytail volta aos ramos de antes da US-59: ausente ou sem terminal grava `não`; `--use=ponytail` liga; `--install` só instala onde o registro diz `sim`; `não` não imprime mais MANDATORY. Marca nova na `UPDATES` (`desde: '3.4.2'`, com `soCom` no cabeçalho antigo para não acusar registro anterior à 3.3.0). **Primeira etapa no GPT:** além do `qa` (Claude Sonnet), o diff passou por um revisor `gpt-6-luna` via `codex exec` em modo só leitura (~56k tokens). O GPT pegou dois pontos que o `qa` não pegou (texto do template sobre quando o opcional pergunta; check do `--install` só pela contagem) e um alarme falso (a dica `--use=ponytail --install`, que o `tl` rodou e funciona). Nenhum bloqueou; os dois reais entraram. Achado da ponte: o `codex exec` sem stdin fechado trava esperando entrada.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- `node teste.mjs`: 532 passaram (7 checks da US-59/55/38 trocados para o opcional, 3 novos US-71; o `--install` conferido pelo nome das chamadas).
- `qa`: projeto novo grava `não` e não instala; graphify e ECC seguem `sim (mandatory)`; READMEs EN/PT sincronizados.
- Este repo: `marvin --dry-run` sem MANDATORY para o ponytail e sem `UPDATES` pendente.
