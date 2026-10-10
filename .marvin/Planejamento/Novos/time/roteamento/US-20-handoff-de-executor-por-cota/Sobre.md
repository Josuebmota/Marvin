---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-20 — handoff de executor por cota: o novo modelo refaz o de-para e segue

**Por quê:** a US-19 escolhe papel, capacidade e modelo **antes** de começar. Nada escrito
diz o que acontece quando o executor para no meio (cota) e outro modelo ou ferramenta
assume. Sem o estado de cada etapa gravado **durante** o trabalho, o substituto recomeça
do zero ou confia no relato de quem parou.

**Ideia do Josué, 07/10/2026:** ao parar o executor, o novo lê o que foi feito e refaz o
**de-para**. Papel e capacidade necessária são o invariante; o que se reavalia é
modelo, ferramenta e esforço, entre o que está disponível. A memória mora no repositório,
não num chat nem numa ferramenta.

**Pronto quando:**
1. O formato do *Time* ganha **estado por etapa** (`pendente`, `em andamento`, `feita`
   com evidência), documentado em `Planejamento/README.md`, com a regra de atualizar
   ao fechar cada etapa, não no fim. **Vale também para o `/continuar`** (sessão autônoma): ele
   grava o estado no *Time* ao fechar cada etapa, não só no *Rumo* do passo 3 — feito em
   08/10/2026 em `.claude/commands/continuar.md`.
2. [delegacao](../../../../../Contexto/Fluxos/delegacao.md) ganha o passo de **handoff**, escrito
   sem depender de ferramenta (o `/retomar` é do Claude Code), com o de-para, a lacuna
   explícita e a verificação do que o anterior fez.
3. Ensaio **documental**, sem chamada paga: a partir só do *Time* e do *Rumo* de uma US
   existente, um segundo leitor (`po` ou `tl`) diz qual é a próxima etapa, qual capacidade
   falta e o que conferir, sem perguntar nada. Se não consegue, o formato está incompleto.
4. **Decidido (`po`, 07/10/2026): o onboarding NÃO ganha a opção "gateway".** A documentação do Claude Code não suporta rotear para modelo não-Claude; mexe com credencial de terceiro; e oferecer isso seria inventar convenção de ferramenta (invariante 3). Reabre só com fato novo (suporte oficial). Registrado no *Rumo*.

**Cortado pelo `po` (07/10/2026):** o item 5 (a divisão "bom para" como declaração) vira **uma linha no *Rumo* da US-19**, não item de pronto daqui; e o item 6 (levar o formato ao template gerado, `ATUALIZACOES`, `tl` no diff do script) espera a **segunda vez** que o handoff for usado de verdade. Hoje não houve nenhuma parada por cota registrada: a US é especulação até o ensaio (item 3) provar o formato. Item 1: a regra tem de dizer "ao fechar **cada** etapa" — estado atualizado só no fim cumpre a letra e esvazia o handoff.

**Não entra:** instalar ou configurar gateway, importar credenciais de assinatura,
troca de sessão sem humano (quem abre a nova sessão é a pessoa), detectar cota restante
(as ferramentas não expõem de forma confiável), medir economia e ranking permanente.

**Ajuste de 08/10/2026 (dono do projeto, vindo da US-25):** o trabalho longo por horas já é o
`/continuar`; o que faltava era ele gravar o estado por etapa **durante** o trabalho, porque quem
perde a cota não chega ao passo 3. Reabrir a troca *sem humano* foi **proposto e não escolhido**:
fica fora, como acima. Paradas obrigatórias mantidas no `/continuar` (acrescentado `git stash`,
`push`, merge, publish e tag). Um commit local por etapa como ponto de retomada, sugerido pelo
`tl`, **não entrou**: contradiz o "sem commit" do `/continuar`, em que o diff é a evidência do humano.

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
Nenhum por ora: os itens 1–5 são documentação. O item 6, se decidido, toca `marvin.mjs`;
nesse caso entra aqui com a função e o *Impacto* é gerado depois.

## Time
Triagem e escolha do ensaio atual pelo `po`; a configuração dos agentes delegados nesta
sessão é herdada e não confirmada.

- `po` · OpenAI/Codex · agente via `collaboration.spawn_agent` · modelo/esforço: não confirmados
  — escolher a US-19 como base e fazer a segunda leitura independente; estado: feita.
- `dev-back` · OpenAI/Codex · agente via `collaboration.spawn_agent` · modelo/esforço: não confirmados
  — aplicar o formato de estado por etapa ao plano existente da US-19; estado: feita
  (quatro etapas ordenadas registradas em `US-19/Sobre.md`); configuração: não confirmada.
- `tl` · OpenAI/Codex · agente via `collaboration.spawn_agent` · modelo/esforço: não confirmados
  — a primeira leitura independente não identificou a etapa; a revisão da segunda
  identificou falta de capacidade explícita; a terceira leitura independente identificou
  a etapa, os papéis/capacidades, as lacunas e a evidência; revisão final aprovada;
  estado: feita.

## Skills
Nenhuma nova. Se o gateway entrar no registro de ferramentas, reutilizar
`adaptador-de-ferramenta`.

## Rumo
- **10/10/2026** — conferido no Claude Code: concluída em 09/10 (`cb4e428`), antes do publish da 2.2.0, mas o `Releases/2.2.0.md` não a listava. Registrada na 2.2.0 e retirada da nota (`2caeefd`). Tags `v2.1.0` e `v2.2.0`, que faltavam, criadas e enviadas. A lacuna virou passo na skill `publicar-no-npm`.
- **09/10/2026** — retomada após a US-21: o `po` escolheu aplicar o formato por etapa à US-19 e repetir o ensaio. Não há registro verificável de uma US interrompida pelo `/continuar`; por isso, não inventar um caso. Graphify está velho (14/09/2026) e não dá impacto atual; busca textual é o fallback. O ensaio anterior foi parcial e o item 3 segue pendente até um segundo leitor identificar, sem perguntas, a próxima etapa, a capacidade necessária/ausente e o que verificar.
- **09/10/2026** — ensaio inicial do Codex/ChatGPT usou a nota da US inteira e foi parcial; não contou como teste independente. Primeira leitura independente (TL, apenas *Time*/*Rumo* da US-19) não identificou a próxima etapa nem o check. Segunda leitura independente (PO, mesmas seções) identificou a etapa 1, papéis, lacunas de configuração e evidência, mas não nomeou a capacidade necessária. A revisão do TL manteve o item 3 bloqueado por essa lacuna e pediu que as tentativas fossem distinguidas com clareza no Rumo. Capacidade explicitada na US-19; item 3 ainda pendente até novo ensaio.
- **09/10/2026** — terceira leitura independente (TL, sem histórico da conversa, apenas *Time*/*Rumo* da US-19) passou: identificou etapa 1, `po` para seleção de escopo/produto e `tl` para checks/protocolo; apontou modelo/ferramenta/esforço/acesso ainda não confirmados e a dependência futura de fonte/acesso a métricas; nomeou a lista das US, contexto, checks e unidade como evidência. Item 3 satisfeito; revisão final do diff pendente.
- **09/10/2026** — revisão final do `tl` aprovada após corrigir a capacidade explícita, distinguir as tentativas e alinhar o ponteiro de memória. Critérios 1–4 atendidos; US-20 concluída.
- **09/10/2026** — **ensaio documental preliminar do item 3 pelo Codex/ChatGPT**, só leitura, sem perguntar nada. Itens 1 e 2 conferidos escritos: estado por etapa em `Planejamento/README.md:50`, regra por etapa em `continuar.md:26`, passo de handoff em `delegacao.md:138-165` (as linhas citadas em 07/10 mudaram). **Resultado naquele ensaio: parcial.** A US-27 não serviu (Time todo `pendente`, nada aplicado). Na US-19 o leitor achou a próxima etapa (revisar a atualização de 07/10, pendente de `po`/`tl`) e o de-para, mas **não** o destino do modelo, e apontou lacunas do formato: sem estado padronizado por etapa na US-19, sem evidência ligada a cada conclusão, sem referência ao diff a revisar e sem ordem das pendências. Naquele momento, a US ainda estava `refinada`; as tentativas independentes e a conclusão vieram depois, registradas acima.
- **08/10/2026** — o `/continuar` passa a gravar o estado por etapa no *Time* (ver *Ajuste de 08/10/2026*). Origem: pareceres de `po` e `tl` na [US-25](../../../ferramentas-opcionais/adaptadores/US-25-avaliar-superpowers-e-octopus/Sobre.md). Falta o item 3 (ensaio documental), de preferência sobre uma US que o `/continuar` deixou pela metade.
- **07/10/2026** — revisada por `po` e `tl`. **3ª da fila** (itens 1 e 3, só documentação; pode correr em paralelo às outras). `tl` aprovou o `b88b291` e o passo de handoff em `delegacao.md:112-139`. Gateway: **descartado** (item 4). Ressalva do `tl`, não bloqueia: `delegacao.md:137-139` cita a documentação do Claude Code dentro de um passo que se diz neutro de ferramenta. Itens 5 e 6 cortados (ver "Cortado").
- **07/10/2026** — reescrita de *failover* para **handoff assistido**. O Josué descreveu
  o desenho: o novo modelo lê o que foi feito e refaz o de-para de papel, capacidade e
  modelo. Percebido que o ponto frágil é o registro: quando a cota acaba, o executor já
  não escreve, então o estado da etapa tem de existir antes. Decidido: formato do *Time*
  com estado por etapa e passo de handoff neutro. Descartado: gateway como solução
  principal, porque o Claude Code não suporta rotear para modelo não-Claude; fica como
  alternativa por conta e risco do usuário. Descartada a troca automática de sessão.
- **07/10/2026** — aberta a partir de um reel do @99hud sobre o **FreeLLMAPI**, não o do
  @donimas citado na US-19. Reel lido pelo vidIQ (10 créditos); o `watch` com Gemini
  deu 503. Fonte oficial consultada depois e anotada no glossário da US-19: o repositório
  confirma o reel; a documentação do Claude Code não suporta gateway com modelo
  não-Claude. Posta na mesma feature da US-19 por escolha do Josué.

## Evidência
- Ensaio documental independente pelo `po` em 09/10/2026, lendo apenas *Time* e *Rumo* da US-19; identificou etapa, papéis, configurações não confirmadas e evidência, mas omitiu a capacidade necessária. Reprovado pelo `tl` por essa lacuna; não conta como conclusão do item 3.
- Reensaio independente pelo `tl` em 09/10/2026, lendo apenas *Time* e *Rumo*: identificou próxima etapa, capacidades, lacunas de configuração e evidência sem perguntas.
- Revisão final do diff aprovada pelo `tl`; `git diff --check` sem erros.
