---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-20 — failover de executor por cota: o que o Marvin orienta e o que é do executor

**Por quê:** a US-19 deixou **fora do piloto** a troca de modelo quando a sessão principal
perde a cota, porque exige executor externo — mas não decidiu o que o Marvin diz sobre
isso. Um reel de 07/10/2026 mostra um gateway que faz essa troca por conta própria; sem
regra escrita, quem usar algo assim apaga o "modelo aplicado" que a US-19 manda registrar.

**Pronto quando:** _(proposta — o Josué confirma; não foi dito)_
1. O glossário tem a entrada do gateway com fonte oficial e data, separando documentado,
   acesso e testado. Hoje só há o vídeo de terceiros.
2. Existe uma regra escrita para a sessão: o que registrar e o que avisar quando o
   executor trocar de modelo por quota (modelo aplicado, motivo, resumo de contexto
   levado), sem troca silenciosa.
3. Decidido, com o `po`, se o onboarding ganha uma opção "gateway" como acesso declarado
   ou se fica só como orientação. Decisão registrada no *Rumo*, mesmo que seja "não".

**Não entra:** instalar ou configurar gateway, importar credenciais de assinatura para
ele, medir economia ou qualidade dos modelos gratuitos, qualquer chamada paga. O failover
roda no executor (Claude Code ou o gateway), nunca no Marvin: o script não executa
chamadas nem troca provedores.

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
Nenhum por enquanto — a US é de orientação e registro. Se o item 3 decidir por uma
opção no onboarding, entra `marvin.mjs` aqui e o *Impacto* é gerado depois.

## Time
Proposto, ainda não executado. Sessão atual: Claude Code, Claude Sonnet 5.5; esforço
herdado da sessão, valor não conferido (limite registrado na US-19: o Agent do Claude
Code não tem override de esforço).

- `scout` · Anthropic/Claude Sonnet 5.5 · Claude Code · esforço solicitado: herdado
  (sessão) — achar a fonte **oficial** do gateway (repositório e documentação) e
  conferir como ele se liga ao executor; aplicado: não confirmado; check: `git diff --check`
  e links conferidos.
- `po` · Anthropic/Claude Sonnet 5.5 · Claude Code · esforço solicitado: herdado
  (sessão) — decidir o item 3 e barrar o que for especulação; aplicado: não confirmado.
- `tl` · Anthropic/Claude Sonnet 5.5 · Claude Code · esforço solicitado: herdado
  (sessão) — ler o diff; só vira `npm run test` se o item 3 tocar o script;
  aplicado: não confirmado.

## Skills
Nenhuma nova. Se o gateway entrar no registro de ferramentas, reutilizar
`adaptador-de-ferramenta`.

## Rumo
- **07/10/2026** — aberta a partir de um reel do @99hud (Hudson Brendon) sobre o
  **FreeLLMAPI**, **não** o do @donimas citado na US-19. Conteúdo obtido pela análise
  automática do vídeo no vidIQ (10 créditos); o `watch` com Gemini falhou com 503 nas
  duas tentativas. Tudo o que o reel afirma está **não verificado**; não houve consulta
  ao repositório. Decidido colocar na mesma feature da US-19 (escolha do Josué);
  descartada uma feature nova porque o roteamento já tem esse limite registrado.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
