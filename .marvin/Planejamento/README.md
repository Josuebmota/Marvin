# Planejamento

O que está sendo **feito**, em três níveis: `<Epic>/<Feature>/<US>/`, cada um com o seu
`Sobre.md`. `Manutencao/` para o que já existe; `Novos/` para o que ainda não.

Regras:

- **Decisão mora no nó que a tomou.** Da US, na US; da feature, na feature. Estrutural,
  em `Contexto/Arquitetura/`.
- **Mudar de rumo é normal e fica explícito.** Registra no *Rumo* e segue. Se preciso,
  cancela os filhos e abre novos — a entrada fica no Rumo do pai.
- **Nada muda de pasta.** US concluída fica onde está, com `estado: concluida` e a
  evidência preenchida. Reabrir é outra release.
- **Aresta é link.** Fluxo ligado, código tocado e pai são links/caminhos — é o que o
  grafo lê.
- **Time decide por tarefa.** Ao abrir uma US ou antes de executar uma tarefa dela,
  seguir [delegação](../Contexto/Fluxos/delegacao.md): decompor atividade/domínio,
  escolher papéis e skills, consultar capacidades sob demanda e selecionar
  modelo/ferramenta/esforço entre acessos elegíveis, sem fornecedor fixo. Registrar solicitado versus
  aplicado. Herança inclui origem; limitações ficam explícitas. Verificação e subida
  de capacidade seguem esse fluxo; mudanças de escolha ficam no *Rumo*.

## O formato — um só para Epic, Feature e US

```markdown
---
tipo: us            # epic | feature | us
estado: ativa       # ativa | concluida | cancelada
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
<!-- proposto ANTES de começar, pela regra do AGENTS.md e do fluxo delegação.
     Só os papéis usados; a camada da atividade quando necessária. Preencher modelo
     domínio/etapa, capacidade, motivo da escolha, modelo concreto e esforço suportado;
     os placeholders abaixo não configuram execução. Skills ficam na seção própria. -->
- dev-back · fornecedor/<modelo> · <ferramenta> · esforço solicitado: <valor suportado>
  — implementar <tarefa>; aplicado: não confirmado; check: <verificação pelo risco>
- tl · fornecedor/<modelo> · <ferramenta> · esforço solicitado: <valor suportado>
  — revisar diff; aplicado: não confirmado

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
