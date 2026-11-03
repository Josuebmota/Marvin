---
tipo: us
estado: cancelada
pai: ../Sobre.md
name: US-105-motion-para-sites
description: "Fundida na US-104 (decisão do dono, 03/11/2026): motion para sites vira um trecho do par ECC × Impeccable. O produto de vídeo do dono não cobre motion de site e o Marvin não o chama."
---
# US-105 — Motion para sites

**Por quê:** o dono (03/11/2026), a partir de um reel que vende skills de animação ("você responde, a skill anima"; legenda "Durma enquanto eles trabalham..."), quer que o Marvin consiga fazer motion **para sites** e acha que pode usar o produto de vídeo dele (aqui `<produto de vídeo do dono>`; o nome fica fora do texto público até o dono liberar, ❓ 2). Não há dor, custo nem uso de motion registrado em `.marvin/` (`po`): é especulação até aparecer um caso real.

**O que os dois leram** (03/11/2026):
- **O produto de vídeo do dono gera vídeo, não motion de site** (`tl` leu `hyperframes/SKILL.md` inteiro e o início do `montagem-por-codigo`; `po` leu as descrições): compõe HTML/CSS/GSAP numa timeline pausada e renderiza MP4. Scroll, hover e transição de página não são cobertos. No máximo sai um vídeo para pôr na landing.
- **O Marvin hoje não faz nada de motion:** o único `motion` em `marvin.mjs` é o `prefers-reduced-motion` do CSS do status (`:1399`, `:1427`). O `ECC_PLAN` (`:1842-1887`) não escolhe skill de front nem de motion: `framework:react` (`:1877`) leva só `react-patterns` e `react-testing`.
- **As skills `motion-ui`, `motion-foundations`, `motion-patterns`, `motion-advanced` e `remotion-video-creation` estão no catálogo do ECC, mas o Marvin não copia nenhuma.** Isto corrige a US-104, que diz que o Marvin "tem" skills de front do ECC: elas estão no catálogo, não instaladas.
- Restrições: repo **público**; o produto de vídeo tem licença "todos os direitos reservados", sem adaptador nem detecção pública (inv. 3); o Marvin escrever procedimento que exige conhecê-lo quebra o inv. 4.

**Pronto quando (saída A, a do `tl`; só registro, sem código):**
1. Uma linha no `.marvin/ferramentas.md` com `usa: não`, dizendo que o produto de vídeo gera vídeo e não motion de UI, e que para motion de site o caminho são as skills `motion-*` do ECC, ainda não instaladas pelo Marvin; com o critério de reabertura: **um caso real de motion num projeto seu com front, ou um par medido** (ECC `motion-*` × alternativa, mesmo modelo e esforço, aceite escondido, Playwright, custo em $ e tokens).
2. Linha de tabela com até 600 caracteres (hoje o `ferramentas.md` já tem uma com 820: não piorar).
3. Corrigir na US-104 a frase que diz que o Marvin "tem" as skills de front do ECC.

**Não entra:** entrada no `OPTIONAL_TOOLS`; copiar ou citar skill do produto de vídeo; o Marvin chamar ou instalar esse produto; mexer no `ECC_PLAN` (pôr `motion-*` lá é outra US, com par medido, porque `HAS_WEB_FRONT` não prova que o projeto quer motion); skill nova de motion antes da segunda vez; dependência nova (GSAP é do projeto do usuário); vídeo e reel; nenhuma linha em agente.

**Divergência `tl` × `po` — decide o dono (❓ 3):**
- `tl`: US própria, só registro, 1 chat (saída A), vizinha da US-104 e no mesmo padrão da linha `graft`.
- `po`: **não ter US própria**: fundir como uma tarefa de motion dentro do par da US-104 (o Impeccable tem `animate`, o ECC tem `motion-ui`), porque um par mede as duas coisas e não há dor medida. Se ficar separada, prioridade baixa e atrás da US-104.
- Concordam em: o produto de vídeo não cobre motion de site, o Marvin não o chama, nada de código agora.

## Perguntas
- ❓ 1. É motion de **site** (UI e página) ou **peça animada em vídeo**? Se for vídeo, é do produto de vídeo e esta US sai do Marvin. (`po` recomenda perguntar antes de tudo.)
- ❓ 2. "Usar o produto de vídeo" é só a técnica dele (HTML/GSAP) como referência humana, ou o Marvin chamá-lo? E posso citar o nome dele em texto público do repo? (`tl` e `po`: só a técnica, sem citar o nome sem o seu OK.)
- ❓ 3. Fundir na US-104 (recomendação do `po`) ou manter US própria só de registro (recomendação do `tl`)?
- ❓ 4. As skills `motion-*` do ECC já falharam num projeto seu? Qual e como? Sem caso real, o `po` recomenda cancelar ou fundir.

## Fluxos ligados
Nenhum fluxo novo: a US é registro em `.marvin/ferramentas.md`, pelo ciclo do `adaptador-de-ferramenta`.

## Código tocado
Nenhum código. Editado: `.marvin/ferramentas.md` (a linha nova) e `US-104-impeccable-opcional/Sobre.md` (a frase sobre as skills do ECC). Lidos como referência: `marvin.mjs` — `OPTIONAL_TOOLS` (`:2689`), `ECC_PLAN` (`:1842`), `HAS_WEB_FRONT` (`:1834`).
- `.marvin/ferramentas.md` — a linha de motion

## Time
Triagem 03/11/2026 (`/refinar`: `tl` Opus · alto e `po` Opus · médio, em paralelo). Grafo fresco (`graph.json` 13:16, depois do `876bfec`). `graphify explain "OPTIONAL_TOOLS"`: nó `marvin_optional_tools`, `:2689`, grau 3, ligado a US-71 e US-48; `graphify affected`: "No affected nodes found". `ECC_PLAN` e `HAS_WEB_FRONT` não consultados no grafo (localizados por Grep). Etapa 1 só roda depois das respostas ❓ 1 a 3.

| etapa | papel | modelo · esforço | motivo | estado |
|---|---|---|---|---|
| 1. escrever a linha no `ferramentas.md` e corrigir a US-104 | `po` · `adaptador-de-ferramenta` | Opus · médio | é decisão de escopo e texto público, sem código; mesmo papel da etapa 1 da US-104 | pendente |
| 2. (só se o dono quiser o motion de verdade) US filha: `ECC_PLAN` × `motion-*`, com par medido | `dev-front` · Sonnet · médio e `qa` · Sonnet · médio | fora desta US | triagem própria na US filha | fora |

## Skills
Nenhuma nova. Usa `adaptador-de-ferramenta`.

## Rumo
- **03/11/2026** — aberta como anotação (origem: reel de venda de um curso de motion, visto pelo Chrome do dono).
- **03/11/2026** — triada por `tl` e `po`; ficou `anotada` (não vai para a fila) até o dono responder ❓ 1 a 3, porque ❓ 3 muda se a US existe. A pasta foi renomeada de `...-via-heim` para `...-para-sites` para o nome do produto privado não ir ao histórico público.

- **03/11/2026** — **fundida na US-104 por decisão do dono** (recomendação do `po`; o `tl` preferia US própria). `estado: cancelada` porque nada mais corre aqui: o trecho de motion está no item 3 do *Pronto quando* da [US-104](../US-104-impeccable-opcional/Sobre.md) e a ❓ 6 de lá herdou as perguntas 1 e 4 desta. A correção sobre as skills do ECC já foi feita na US-104. A linha de motion no `ferramentas.md` não será escrita: o registro do Impeccable cobre.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
