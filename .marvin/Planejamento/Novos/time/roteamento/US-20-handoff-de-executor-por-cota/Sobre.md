---
tipo: us
estado: ativa
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
   ao fechar cada etapa, não no fim.
2. [delegacao](../../../../../Contexto/Fluxos/delegacao.md) ganha o passo de **handoff**, escrito
   sem depender de ferramenta (o `/retomar` é do Claude Code), com o de-para, a lacuna
   explícita e a verificação do que o anterior fez.
3. Ensaio **documental**, sem chamada paga: a partir só do *Time* e do *Rumo* de uma US
   existente, um segundo leitor (`po` ou `tl`) diz qual é a próxima etapa, qual capacidade
   falta e o que conferir, sem perguntar nada. Se não consegue, o formato está incompleto.
4. O `po` decide e registra no *Rumo* se o onboarding ganha a opção "gateway". Tende a
   "não": a documentação do Claude Code não suporta rotear para modelo não-Claude.
5. A divisão "bom para" declarada (US-19, 07/10) está registrada como declaração, não medida.
6. **Só se** o formato do *Time* for levado ao template gerado pelo script: entrada
   nova na tabela `ATUALIZACOES`, `npm run test` e `tl` lendo o diff.

**Não entra:** instalar ou configurar gateway, importar credenciais de assinatura,
troca de sessão sem humano (quem abre a nova sessão é a pessoa), detectar cota restante
(as ferramentas não expõem de forma confiável), medir economia e ranking permanente.

## Fluxos ligados
- [delegacao](../../../../../Contexto/Fluxos/delegacao.md)

## Código tocado
Nenhum por ora: os itens 1–5 são documentação. O item 6, se decidido, toca `marvin.mjs`;
nesse caso entra aqui com a função e o *Impacto* é gerado depois.

## Time
Proposto; a reescrita de 07/10 foi feita pela sessão principal. Claude Code, Claude
Sonnet 5.5, esforço herdado da sessão (valor não conferido). Revisão do `po` e do `tl`
ainda **pendente**.

- `po` · Anthropic/Claude Sonnet 5.5 · Claude Code · esforço solicitado: herdado (sessão)
  — dono do item 4 e de barrar o que for especulação; estado: pendente; aplicado: não confirmado.
- `dev-back` · Anthropic/Claude Sonnet 5.5 · Claude Code · esforço solicitado: herdado
  (sessão) — itens 1, 2 e 5 (texto); estado: em andamento (itens 1, 2 e 5 escritos,
  falta revisão); aplicado: não confirmado; check: `git diff --check` e links.
- `qa` · mesma configuração · item 3, o ensaio documental; estado: pendente.
- `tl` · Anthropic/Claude Sonnet 5.5 · Claude Code · esforço solicitado: herdado (sessão)
  — ler o diff; estado: pendente. Vira `npm run test` se o item 6 entrar.

## Skills
Nenhuma nova. Se o gateway entrar no registro de ferramentas, reutilizar
`adaptador-de-ferramenta`.

## Rumo
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
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
