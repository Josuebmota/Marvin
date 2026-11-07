---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-108 — FreeLLMAPI: subir o gateway e ler os termos de cada provedor

**Por quê:** o dono (06/11/2026) quer usar o [FreeLLMAPI](https://github.com/tashfeenahmed/freellmapi) para baratear o Marvin e ter fallback quando a cota do Claude acaba, e já tem chaves de planos gratuitos. Antes de qualquer par (US-110) ou fallback (US-109), falta saber duas coisas que hoje não estão conferidas: o gateway sobe e responde na máquina do dono, e **o que cada provedor faz com o prompt** (treino, retenção), porque o código do OvenorGroup passaria por vários terceiros. A [US-19](../../time/roteamento/US-19-papel-modelo-esforco/Sobre.md) já listou isso como "a conferir antes de qualquer uso" em 07/10/2026 e nunca foi conferido. Esta é a primeira de três (108 → 109 e 110).

**Pronto quando** (esta US não escreve código):
1. **Fonte lida e datada:** `docs/en/architecture/00-high-level-index.md` (revisão de termos por provedor, maio de 2026, citada no README) e `docs/en/install/01-install.md`, ambos do repositório. Para cada provedor de que o dono tem chave: o plano gratuito usa prompts para treino? retém? Cada fato com "conferido em <data>" no *Rumo*; o que a fonte não diz fica "não conferido". Os números do README (34 provedores, 7,4 bi de tokens) são do próprio projeto e não valem como premissa.
2. **Gateway no ar na máquina do dono:** responde a lista de modelos e uma chamada curta de `/v1/messages` com a chave unificada. As chaves dos provedores ficam só no gateway (criptografadas, segundo o README) e a chave unificada só em variável de ambiente: nenhuma no repositório, no `Sobre.md` ou no chat.
3. **Veredito por provedor e regra de uso**, escritos no *Rumo*: cada provedor que o dono tem fica `pode receber código do OvenorGroup` / `só texto sem código` / `não` / `não conferido`. Regra fixa desde já: só projeto do OvenorGroup passa; **nunca** código de cliente ou empregador, `.env`, connection string, segredo ou dado real.
4. **Parada:** se nenhum provedor com chave do dono sai como `pode receber código` ou `só texto`, a linha `freellmapi` entra no `.marvin/ferramentas.md` com `usa: não` e o motivo (molde das linhas `serena` e `graft`), a US-110 é cancelada e a US-109 só segue se o dono mantiver o fallback para texto.

**Não entra:** código no `marvin.mjs` (`OPTIONAL_TOOLS`, detecção, `UPDATES`); o fallback (US-109); o par medido (US-110); criar conta ou chave em nome do dono; guardar chave em arquivo do repositório; `setup-claude` ou qualquer escrita em `~/.claude`; projeto de cliente; tratar o README como prova de que os planos gratuitos não treinam com o prompt.

## Perguntas
- ❓ 1. Quais provedores têm chave? Só os **nomes** (Groq, Gemini, OpenRouter…), nunca a chave. Define quais termos o item 1 lê.
- ~~❓ 2. Como instalar o gateway: instalador desktop do Windows, Docker ou código-fonte?~~ → **instalador desktop do Windows** (dono, 06/11/2026). A instalação é do dono (download e execução de código de terceiro), a partir da página de Releases do repositório.

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md)
- [indisponibilidade](../../../../../Contexto/Fluxos/delegacao/indisponibilidade.md)

## Código tocado
Nenhum código (leitura, instalação do dono e registro). Editado só se a parada do item 4 cair: `.marvin/ferramentas.md` (a linha `freellmapi`).
- `.marvin/ferramentas.md` — a linha `freellmapi`

## Time
Triagem 06/11/2026 (sessão principal; o `tl` e o `po` revisam o veredito). A ilha é só o `ferramentas.md`. Capacidade necessária: leitura de documentação com rede, medição por comando, julgamento sobre dado de terceiros. Modelo/esforço **solicitados** pela partida do `CLAUDE.md` (julgamento Opus, implementação Sonnet, recuperação Haiku); **aplicado: não confirmado** até a execução.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| ler os termos e o guia de instalação | scout | Haiku · baixo | recuperação delimitada em fonte pública; exige rede, então pode precisar ser a sessão principal | pendente |
| instalar o gateway e cadastrar as chaves | dono | — | download e execução de código de terceiro e chaves dele; o Marvin não toca chave | pendente |
| validar a lista de modelos e `/v1/messages` | dev-back | Sonnet · baixo | chamada por comando, sem julgamento; chave só em variável de ambiente | pendente |
| veredito por provedor e regra de uso | tl + po | Opus · médio | julgamento sobre dado de terceiros; o dono dá a palavra final | pendente |
| conferir o registro | qa | Sonnet · baixo | linha dentro do teto, fatos com data, nenhuma chave escrita | pendente |

Grafo (fresco: `graph.json` 18:50:36 de 04/11, 9 s depois do último commit): **sem símbolo de código**, então `graphify affected` e `explain` não se aplicam. Grep (só para localizar) achou "freellmapi" apenas na US-19, na US-20, na US-91, em `delegacao/handoff.md` e em `delegacao/indisponibilidade.md`; nada no `marvin.mjs` nem no `ferramentas.md`.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 1 nó(s) de código em 0 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-84 — quebrar o `delegacao.md` e ligar os órfãos](../../../../Manutencao/publicacao/contexto-fixo/US-84-quebrar-delegacao-e-ligar-orfaos/Sobre.md) — 1 nó(s) em comum
- [US-104 — Impeccable como ferramenta opcional](../US-104-impeccable-opcional/Sobre.md) — 1 nó(s) em comum
- [US-105 — Motion para sites](../US-105-motion-para-sites/Sobre.md) — 1 nó(s) em comum
- [US-106 — O Marvin oferece o Impeccable (entrada no `OPTIONAL_TOOLS`)](../US-106-impeccable-oferta-no-optional-tools/Sobre.md) — 1 nó(s) em comum
- [US-107a — ler a fonte e medir o custo fixo da Serena](../US-107a-ler-fonte-e-custo-fixo-da-serena/Sobre.md) — 1 nó(s) em comum
- [US-107b — o par com e sem a Serena](../US-107b-par-com-e-sem-serena/Sobre.md) — 1 nó(s) em comum
- [US-110 — FreeLLMAPI via MCP: o par com e sem](../US-110-freellmapi-mcp-par-medido/Sobre.md) — 1 nó(s) em comum
- [US-25 — avaliar Superpowers e Claude Octopus contra o fluxo do Marvin](../US-25-avaliar-superpowers-e-octopus/Sobre.md) — 1 nó(s) em comum
- [US-48 — Superpowers e ECC como ferramentas de execução da equipe](../US-48-superpowers-e-ecc/Sobre.md) — 1 nó(s) em comum
- [US-68 — ponytail ligado e medido](../US-68-ponytail-medido/Sobre.md) — 1 nó(s) em comum
- [US-93 — ponytail: segundo par medido](../US-93-ponytail-segundo-par/Sobre.md) — 1 nó(s) em comum
- [US-50 — o Marvin instala as ferramentas por projeto](../../curadoria/US-50-marvin-plugin-e-curador/Sobre.md) — 1 nó(s) em comum

## Rumo
- **06/11/2026** — aberta a partir do link do dono (github.com/tashfeenahmed/freellmapi), "baratear e ter o fallback; tenho as chaves". **Não é novidade para o Marvin:** a ferramenta foi vista em 07/10/2026 (reel do @99hud) e descartada como gateway no onboarding ([US-20](../../time/roteamento/US-20-handoff-de-executor-por-cota/Sobre.md) item 4). Esta US não reabre essa decisão; quem a reabre é a [US-109](../US-109-freellmapi-fallback-por-cota/Sobre.md), com o dono. Leitura de 06/11 (resumo de página, **não** leitura integral nem uso): roteador local, MIT, `/v1/messages` no formato da Anthropic, comando `launch` que injeta credenciais só no processo filho, MCP `ask_freellmapi` desligado por padrão, disclaimer "personal experimentation, not production", responsabilidade pelos termos do provedor é de quem usa.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
