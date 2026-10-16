# Planejamento

O que está sendo **feito**, em três níveis: `<Epic>/<Feature>/<US>/`, cada um com o seu
`Sobre.md`. `Manutencao/` para o que já existe; `Novos/` para o que ainda não.

## Antes de qualquer US — mapear, montar o time, propor skills

**Nenhuma US começa sem esta passada, e ela se repete a cada atividade nova.** É o que
faz o time crescer em camadas em vez de nascer genérico.

1. **Mapear o que a atividade toca:** o fluxo, a arquitetura, o código. Fluxo que ainda
   não tem nota em `../Contexto/Fluxos/` ganha uma agora — é assim que ela cresce.
2. **Propor o time desta atividade** e registrar na seção *Time* do `Sobre.md` da US.
   Consulte `../Contexto/IA.md` e o inventário local antes de escolher modelo/esforço:
   atividade, domínio, papéis, skills e capacidades vêm antes da marca. Registre por
   etapa modelo/integração, motivo e solicitado/aplicado; declaração não prova acesso.
   O que a atividade não usa **não é criado**. Os papéis, o que cada um faz e quando entra
   estão no [glossário da equipe](../Contexto/Equipe.md) — lido aqui, na triagem.

   **Quem faz a triagem:** o `tl` junto com o `po`, com o contexto inteiro da US. Eles
   definem quem toca, quais agentes e skills (só os que a atividade usa), esforço e modelo,
   e registram em *Time*/*Skills* da US. Agente ou skill novos nascem aqui: o agente só vira
   arquivo com uma armadilha concreta; a skill, na segunda execução.
   **Na primeira rodada depois de instalar**, a LLM só **propõe** o time e as skills, a partir
   do [glossário da equipe](../Contexto/Equipe.md) e do código: só papel ligado a fronteira detectada no código (stack, schema,
   CI), nunca o catálogo inteiro. A proposta fica em *Time*/*Skills* e o arquivo nasce pela
   regra acima.
   **O grafo é opcional nos projetos montados pelo Marvin; neste repositório, Graphify é
   obrigatório na triagem.** Ausente, velho ou indisponível: registre a limitação e use
   Grep/Glob só para localizar arquivos. Fluxo completo de escolha por tarefa e `tl` por risco:
   [delegação](../Contexto/Fluxos/delegacao.md).
3. **Atualizar os agentes em camadas:** `.claude/agents/<papel>.md` recebe as armadilhas
   descobertas **nesta** atividade — acrescenta, não reescreve o que já valia. Um papel só
   existe como arquivo depois de ter uma armadilha concreta para carregar.
4. **Propor skills:** procedimento que esta atividade vai repetir (rodar migração, gerar
   release, subir ambiente) entra na seção *Skills* da US como proposta — e vira
   `.claude/skills/<nome>/SKILL.md` na **segunda** vez que rodar, não na primeira.

Regras:

- **Decisão mora no nó que a tomou.** Da US, na US; da feature, na feature. Estrutural,
  em `Contexto/Arquitetura/`.
- **Mudar de rumo é normal e fica explícito.** Registra no *Rumo* e segue. Se preciso,
  cancela os filhos e abre novos — a entrada fica no Rumo do pai.
- **Nada muda de pasta.** US concluída fica onde está, com `estado: concluida` e a
  evidência preenchida. Reabrir é outra release.
- **Refinada não é ativa.** US que passou pelo crivo e ainda não começou é `estado: refinada`:
  fica na fila, fora da nota; vira `ativa` quando alguém a pega (`marvin --us` de novo põe o
  ponteiro). O `--status` agrupa as refinadas em **ilhas** pelo arquivo do *Código tocado* —
  a ilha é o que uma sessão ataca em sequência, uma por vez.
- **Aresta é link.** Fluxo ligado, código tocado e pai são links/caminhos — é o que o
  grafo lê.

## O formato — um só para Epic, Feature e US

```markdown
---
tipo: us            # epic | feature | us
estado: ativa       # anotada | refinada | ativa | concluida | cancelada
pai: ../Sobre.md
---
# US-12 — <título em uma frase>

**Por quê:** <uma linha>
**Pronto quando:** <critério verificável>

## Filhos
<!-- Epic e Feature: links para os Sobre.md abaixo. US: não tem. -->

## Fluxos ligados
- [checkout](../../../../Contexto/Fluxos/checkout.md)

## Código tocado
- `src/checkout/pagamento.ts` — `calcularEstorno`

## Time
<!-- proposto ANTES de começar, pela regra do AGENTS.md. Uma linha por ETAPA, com o modelo.
     Partida no Equipe.md: o degrau mais barato que serve; subir exige motivo. Quem decide
     (tl/po) não é quem executa. Etapa sem modelo trava a execução e volta ao /refinar. -->
| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| mapear o código | scout | Haiku · baixo | recuperação | pendente |
| implementar | dev-back | Sonnet · médio | partida | pendente |
| migrar o schema de pagamentos | dba | Sonnet · médio | partida | pendente |
| verificar | qa | Sonnet · baixo | partida | pendente |
| ler o diff | tl | Opus · médio | toca invariante | pendente |

## Skills
<!-- procedimento que esta atividade vai repetir; vira SKILL.md na segunda vez -->
- rodar-migracao — proposta

## Rumo
- **<data>** — aberta.
- **<data>** — vimos que <x>; decidido <y>, descartado <z> porque <w>.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
```

*Código tocado* usa crase com o caminho a partir da raiz do repositório, e o nome da
função depois de um traço — é assim que o grafo liga a US ao nó de código.
