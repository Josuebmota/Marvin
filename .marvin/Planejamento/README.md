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
<!-- proposto ANTES de começar, pela regra do AGENTS.md. Base: tl · po · dev-front · dev-back · qa · scout.
     Mais a camada da atividade (design, dba, sec, infra) quando ela pede. -->
- tl, po, dev-back, qa, scout
- dba — a US muda o schema de pagamentos

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
