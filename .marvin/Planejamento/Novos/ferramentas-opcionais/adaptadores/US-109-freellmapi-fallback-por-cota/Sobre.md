---
tipo: us
estado: refinada
pai: ../Sobre.md
---
# US-109 — FreeLLMAPI como fallback por cota (`launch`)

**Por quê:** quando a cota do Claude acaba no meio de uma US, o [handoff](../../../../../Contexto/Fluxos/delegacao/handoff.md) hoje só prevê outro executor entre os acessos já autorizados. O FreeLLMAPI poderia ser esse executor: um Claude Code aberto em processo separado (`launch`) que usa modelo gratuito. Mas a decisão de 07/10/2026 ([US-20](../../time/roteamento/US-20-handoff-de-executor-por-cota/Sobre.md) item 4) descartou o gateway porque a documentação do Claude Code **não suporta** rotear para modelo não-Claude, e só reabre "com fato novo (suporte oficial)". Esta US confere se há fato novo e, se não houver, **pede ao dono a decisão**, em vez de passar por cima. Origem: dono, 06/11/2026, "baratear e ter o fallback".

**Depende da [US-108](../US-108-freellmapi-gateway-e-termos/Sobre.md)** (gateway no ar e termos conferidos).

**Pronto quando** (a US só escreve texto, e só no passo 4):
1. **Fato novo conferido:** a página oficial [code.claude.com/docs/en/llm-gateway](https://code.claude.com/docs/en/llm-gateway) relida e datada no *Rumo*: o que diz hoje sobre gateway de terceiros, modelo não-Claude e tool use. Fato novo do **lado da ferramenta** já conhecido (06/11): `/v1/messages` no formato da Anthropic e `launch`; isso confirma a lacuna que a US-19 deixou ("como o setup resolve o formato de API"), mas **não é suporte oficial** do Claude Code. Cada fato "conferido em <data>" ou "não conferido".
2. **Decisão do dono registrada** (❓ 1): se a documentação continua sem suportar, o dono diz se segue assim mesmo, como uso **não suportado e por conta dele**, só para etapas de risco baixo. Sem essa palavra por escrito no *Rumo*, os passos 3 e 4 não rodam.
3. **Ensaio de ponta a ponta**, numa tarefa pequena e descartável num projeto do OvenorGroup (cópia ou worktree): `npx freellmapi launch` (processo separado, nada em disco) pede para ler um arquivo, trocar uma linha e rodar um comando de verificação. Registrar: leu? editou? rodou o comando? terminou? qual modelo respondeu de fato (a resposta traz o modelo servido e a trilha de fallback)? quantos turnos? Resultado em uma de três: `funciona`, `só leitura e resumo`, `não funciona`.
4. **Só se o ensaio der `funciona` ou `só leitura`:** o `tl` e o `po` decidem o texto novo em `delegacao/handoff.md` (hoje o "Fora do escopo" diz que gateway para modelo não-Claude não é suportado), com os limites: só etapa de esforço baixo ou médio, **nunca** invariante, escrita no disco de alguém ou US de cliente; o substituto confere o `git diff` do que o anterior fez (passo 1 do handoff já exige). Se `não funciona`, registrar e parar.
5. **Arquivos pessoais intactos:** `~/.claude/settings.json` (e outros arquivos de configuração do Claude Code) com o mesmo hash antes e depois do ensaio, o que prova que só o `launch` foi usado, nunca o `setup-claude`.

**Não entra:** `setup-claude` ou qualquer configuração em disco; apontar a sessão principal para o gateway; detectar a cota restante (a US-20 já descartou: as ferramentas não expõem); troca automática sem humano; mexer no onboarding, no `marvin.mjs` ou no `OPTIONAL_TOOLS`; projeto de cliente; tratar a economia como medida (isso é a US-110).

## Perguntas
- ❓ 1. Se a documentação oficial continuar dizendo que não suporta, você segue mesmo assim, como uso por sua conta? Contexto: a página também diz que a Anthropic não endossa gateways de terceiros e que, com credencial de gateway, a assinatura não se aplica (aqui não importa: o modelo seria gratuito). O risco real é comportamento imprevisível com tool use, não bloqueio da conta; isso o ensaio do passo 3 mede.
- ❓ 2. Qual projeto do OvenorGroup serve de ensaio descartável? Proposta: uma cópia do próprio Marvin ou do Parci, fora do checkout principal.

## Fluxos ligados
- [handoff](../../../../../Contexto/Fluxos/delegacao/handoff.md)
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md)
- [indisponibilidade](../../../../../Contexto/Fluxos/delegacao/indisponibilidade.md)

## Código tocado
Nenhum código. Editado só no passo 4: `.marvin/Contexto/Fluxos/delegacao/handoff.md` (o parágrafo "Fora do escopo"). Lido, sem editar: `~/.claude/settings.json` (só o hash).
- `.marvin/Contexto/Fluxos/delegacao/handoff.md` — "Fora do escopo"

## Time
Triagem 06/11/2026. Modelo/esforço **solicitados** pela partida do `CLAUDE.md`; **aplicado: não confirmado** até a execução. O ensaio roda em processo separado do Claude Code, então o modelo que responde é o do gateway, e isso é o que se mede.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| reler a documentação oficial do gateway | scout | Haiku · baixo | recuperação delimitada em fonte pública; exige rede, então pode ser a sessão principal | pendente |
| decidir se segue sem suporte oficial | po | Opus · médio | decide rumo (reabre uma decisão do `po` de 07/10); o dono dá a palavra final | pendente |
| ensaio com `launch` na tarefa descartável | dono + dev-back | Sonnet · baixo | o dono abre o processo separado; o dev-back prepara a tarefa e confere o resultado por comando | pendente |
| texto novo em `handoff.md` | tl + po | Opus · médio | muda regra de handoff entre executores; documentação simples (`git diff --check` e revisão) | pendente |
| conferir hash e registro | qa | Sonnet · baixo | hash de `~/.claude/settings.json` igual; nenhuma chave escrita | pendente |

Grafo (fresco, 04/11): **sem símbolo de código**, `affected` não se aplica; fallback: Grep só para localizar (o `handoff.md` e a US-20 foram achados por ele).

## Skills
Nenhuma.

## Rumo
- **06/11/2026** — refinada, esperando a [US-108](../US-108-freellmapi-gateway-e-termos/Sobre.md). Nasce da conversa "baratear e ter o fallback". **Contradição a resolver, não a esconder:** a decisão `po` de 07/10/2026 (US-20 item 4) e o *Fora do escopo* do `handoff.md` dizem que gateway para modelo não-Claude não é suportado; esta US só roda depois da palavra do dono (❓ 1) e do ensaio. Fonte da decisão antiga: página oficial lida em 07/10/2026 (resumo de página, citada na US-19).

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
