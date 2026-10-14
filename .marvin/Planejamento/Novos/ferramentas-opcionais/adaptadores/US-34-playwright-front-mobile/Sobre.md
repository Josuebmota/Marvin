---
tipo: us
estado: concluida
pai: ../Sobre.md
---
# US-34 — Playwright CLI obrigatório como evidência do `qa` em projeto com front ou mobile

**Por quê:** decisão do Josué (13/10/2026): em aplicação **front ou mobile**, o `qa` precisa provar o fluxo rodando, não narrar. O reel de 13/10 resume a regra: *"narração não é prova"*. O **Playwright CLI** (Microsoft) abre um navegador real, clica, preenche, percorre o fluxo (login, checkout) e devolve screenshot + snapshot estruturado (`playwright-cli snapshot`), gastando pouco contexto. Hoje o `qa` do Marvin pede evidência, mas não diz qual — em tela, "o teste passou" sem navegador não prova que o botão funciona.
**Pronto quando:**
1. O `marvin` **detecta** projeto com front/mobile (ex.: `react`, `next`, `vite`, `react-native`, `expo`, `@angular/core`, `vue`, `svelte`, `flutter` no manifesto) e, nesse caso, **registra o Playwright** em `.marvin/ferramentas.md` (`usa: sim`, alcance declarado) — pelo mesmo caminho dos adaptadores: detectar → perguntar → registrar → seção no `AGENTS.md`.
2. Nesses projetos, o `AGENTS.md` gerado ganha na seção do `qa` a regra: **US que toca tela só fecha com evidência do Playwright** (roteiro do fluxo + screenshot/snapshot anexados ou referenciados no *Pronto quando* da US). Projeto sem front não recebe a regra.
3. Mobile nativo: registrar o limite — o Playwright cobre web/PWA; app nativo (React Native/Expo/Flutter) precisa de outra ferramenta (ex.: Maestro/Detox), a decidir no refino; até lá, a regra vale para a versão web/PWA.
4. Trava em `teste.mjs`: manifesto com `react` → `ferramentas.md` tem linha `playwright` e o `AGENTS.md` tem a regra; manifesto sem front → nenhum dos dois. `node teste.mjs` verde.
5. Confiança do adaptador declarada (invariante 3).

**Projetos do Josué que entram já:** Parci, Andare (Perainda), Your Journey, Ciranda, Rodagem e as páginas `*.ovenor.com.br`.

**Não entra:** instalar Playwright na máquina de ninguém; escolher a ferramenta de mobile nativo (vai para o refino).

## Código tocado
- `marvin.mjs` — laço `OPTIONAL_TOOLS` e geração do `AGENTS.md` (seção do `qa`)
- `teste.mjs` — nova seção de detecção de front

## Time
- `po`: lista de sinais de front/mobile e texto da regra.
- `dev-back`: detecção + registro + seção.
- `qa`: travas.
- `tl`: diff (toca invariante 3).

## Skills
`adaptador-de-ferramenta`.

## Rumo
- **13/10/2026** — aberta e refinada (decisão do Josué, reel de 13/10).
- **14/10/2026** — ativa (Josué pediu para desenvolver todas as pendentes). Mobile nativo: a regra vale para web/PWA; Maestro/Detox fica como lacuna. Triagem técnica com o `tl`.
- **14/10/2026** — implementada e validada (`tl` especificou → `dev-back` → `tl` aprovou). Playwright é o 3º item de `OPTIONAL_TOOLS`, com `aplica()`: só oferecido com front web num `package.json` (raiz ou sub-repo, profundidade ≤ 3); RN/Expo sem `react-dom` e Flutter ficam fora. A regra "US que toca tela só fecha com evidência do Playwright" entra em `## Ferramentas` do `AGENTS.md` gerado, com confiança baixa. Entrada em `UPDATES` `desde: '2.4.0'`. A detecção de stack foi movida para antes do bloco 0b (TDZ). Mobile nativo continua sem ferramenta (lacuna declarada). ❓ do `tl` respondido por padrão: `.claude/agents/README.md` não muda. Lacuna de teste: o ramo TTY `y → sim`.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
- `node teste.mjs`: **332 passaram**.
- Mutações (`dev-back`): `aplica: () => true` → checks 8 e 9; sem o ramo nativo → 9; `stacks` só na raiz → 10; sem o bloco do template → 7; `soCom: false` → 4.
- O `tl` comparou byte a byte o script novo com o anterior: o `AGENTS.md` com só ponytail, sem ferramentas e com react sem `--use` sai **idêntico**.
