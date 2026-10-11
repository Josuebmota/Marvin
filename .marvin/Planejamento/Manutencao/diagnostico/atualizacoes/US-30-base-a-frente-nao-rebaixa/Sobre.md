---
tipo: us
estado: refinada
pai: ../Sobre.md
---
# US-30 — base mais nova não é rebaixada por um `marvin` mais velho

**Por quê:** um `marvin` mais antigo regrava o carimbo de uma base mais nova sem avisar. Medido em 11/10/2026 no parci-development: o `marvin` global ainda era o 2.2.0 (`npm -g marvin-kb@2.2.0`); a base tinha sido carimbada 2.3.0 e empurrada, uma sessão rodou `marvin` e o `.marvin/ferramentas.md` voltou para `marvin: 2.2.0`. A saída ainda imprime `marvin 2.3.0 → 2.2.0` como se fosse avanço. Isso fere o invariante 2 (rodar de novo deixa o arquivo pior) e corrompe o dado que a US-17 criou: depois do rebaixamento, a próxima passada com binário novo relata uma migração `2.2.0 → 2.3.0` que não existiu. O próprio hook induz o erro: `--status --curto` manda "rode `marvin` para ver o que entrou" mesmo quando quem roda é a versão velha.

**Causa (`tl`, lida no código):**
- `marvin.mjs:1878` testa `last.trim() !== SELF_VERSION` (diferente), quando deveria testar "menor". Não existe função de comparação de versão no arquivo.
- `marvin.mjs:1311` (aviso do `--status --curto`) usa a mesma comparação `!==`.
- `marvin.mjs:4125` (linha do passo 10) não diz quando a base está à frente.
- O resto já está protegido: templates por `existsSync`, `marvin_montado` só quando falta, `disponibilidade.json` e o hook do `settings.json` não são sobrescritos, e o passo 10 só lê. **O único conteúdo versionado que a versão velha regrava é a linha `marvin:`.**

**Pronto quando:**
1. Base com `marvin: 2.3.0` e script 2.2.0: o `marvin` **não reescreve** a linha `marvin:` e imprime algo como "base 2.3.0, este marvin é 2.2.0 (mais velho) — atualize: `npm i -g marvin-kb@latest`".
2. `--status --curto` nessa situação diz "atualize o marvin", não "rode `marvin`".
3. A linha do passo 10 marca "(base à frente)" quando for o caso.
4. Base mais velha que o script: o comportamento atual continua (sobe o carimbo e mostra o que entrou). Versão igual não escreve nada.
5. **Trava em `teste.mjs`**, espelho do caso existente de base atrás (`0.0.1`, perto de `teste.mjs:1243`): grava `marvin: 99.0.0`, roda o script, confere que a linha continua `99.0.0`, que a saída traz o aviso de atualizar e que o `--status --curto` não diz "rode `marvin`". Hoje fica vermelho. `node teste.mjs` verde.
6. README (os dois): uma frase dizendo que a guarda só vale da versão nova em diante. O 2.2.0 já instalado continua rebaixando, até ser atualizado.

**Não entra:** abortar a passada inteira (ver ❓1); mexer em `marvin_montado`; comparar pre-release ou tag; versionar os derivados.

❓1 (Josué): basta **proteger o carimbo e avisar**, ou o binário velho deve **recusar a execução inteira** (sair != 0)? O `tl` e o `po` recomendam avisar e não rebaixar: as outras escritas já são idempotentes, o único dano medido é o carimbo, e recusar travaria quem tem binários diferentes em máquinas diferentes.

**Funde com:** é defeito da [US-17](../US-17-carimbo-de-versao/Sobre.md), que está fechada. O "Não entra" dela não previa binário mais velho que a base. Não reabre a US-17.

## Código tocado
- `marvin.mjs` — bloco do carimbo (US-17, ~1866-1883: o `!==` da linha 1878), aviso do `--status --curto` (~1311), linha do passo 10 (~4125); helper novo de comparação de versão
- `teste.mjs` — bloco do carimbo (~1238-1247), o caso da base à frente
- `README.md` e `README.pt-BR.md` — o limite da guarda

## Time
Triagem 11/10/2026 (`/refinar`, `tl` + `po` em paralelo; os dois concordam no escopo).
- `dev-back`: implementa (~10 linhas + 1 teste).
- `qa`: roda a suíte e confere o caso igual e o caso atrás.
- `tl`: lê o diff (invariante 2, determinismo).

Cabe num chat, junto com a [US-31](../../../../Novos/ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md): mesma ilha (`marvin.mjs`), as duas pequenas.

## Skills
Nenhuma.

## Impacto

<!-- gerado por `marvin --us` a partir do grafo; regerado a cada run — não edite à mão -->

Toca 2 nó(s) de código em 2 comunidade(s).

Nada depende do que ela toca — folha do grafo.

**Outras US no mesmo código** — combine antes, não no merge:
- [US-14-codigo-em-ingles](../../../codigo/ingles/US-14-codigo-em-ingles/Sobre.md) — 2 nó(s) em comum
- [US-17 — o `marvin` crava a versão com que montou a base](../US-17-carimbo-de-versao/Sobre.md) — 2 nó(s) em comum
- [US-04 — O passo 3 confunde backup com lixo de shell](../../passo-3/US-04-backup-nao-e-lixo/Sobre.md) — 2 nó(s) em comum
- [US-13 — Sessão numa git worktree escreve memória num diretório vazio, sem aviso](../../../memoria/junction/US-13-worktree/Sobre.md) — 2 nó(s) em comum
- [US-11 — ferramentas opcionais: detectar, perguntar, registrar (graphify e ponytail)](../../../../Novos/ferramentas-opcionais/adaptadores/US-11-ferramentas-opcionais/Sobre.md) — 2 nó(s) em comum
- [US-11a — o registro `ferramentas.md`, com o graphify como primeiro adaptador](../../../../Novos/ferramentas-opcionais/adaptadores/US-11a-registro-e-graphify/Sobre.md) — 2 nó(s) em comum
- [US-11b — ponytail como adaptador, e em que papel ele entra](../../../../Novos/ferramentas-opcionais/adaptadores/US-11b-ponytail-e-papeis/Sobre.md) — 2 nó(s) em comum
- [US-21 — o usuário escolhe se versiona o derivado](../../../../Novos/ferramentas-opcionais/adaptadores/US-21-usuario-escolhe-versionar-o-derivado/Sobre.md) — 1 nó(s) em comum
- [US-22 — o grafo dentro do `.marvin/`](../../../../Novos/ferramentas-opcionais/adaptadores/US-22-grafo-dentro-do-marvin/Sobre.md) — 2 nó(s) em comum
- [US-23 — repos aninhados (`repos/<x>`) no grafo](../../../../Novos/ferramentas-opcionais/adaptadores/US-23-repos-aninhados-no-grafo/Sobre.md) — 2 nó(s) em comum
- [US-24 — `--fechar` por sub-repo](../../../../Novos/ferramentas-opcionais/adaptadores/US-24-fechar-por-sub-repo/Sobre.md) — 2 nó(s) em comum
- [US-31 — `--use` em duas ferramentas perde uma das escritas](../../../../Novos/ferramentas-opcionais/adaptadores/US-31-use-duplo-perde-escrita/Sobre.md) — 2 nó(s) em comum
- [US-32 — graphify e ponytail juntos](../../../../Novos/ferramentas-opcionais/adaptadores/US-32-graphify-e-ponytail-juntos/Sobre.md) — 2 nó(s) em comum
- [US-01 — Layout por grafo no script](../../../../Novos/organizacao-por-grafo/script/US-01-layout-por-grafo/Sobre.md) — 2 nó(s) em comum
- [US-02 — `marvin --status`, o dashboard derivado](../../../../Novos/organizacao-por-grafo/script/US-02-status/Sobre.md) — 1 nó(s) em comum
- [US-05 — `marvin --release <versao>`](../../../../Novos/organizacao-por-grafo/script/US-05-release/Sobre.md) — 2 nó(s) em comum
- [US-06 — `--status --curto` como hook de abertura de sessão](../../../../Novos/organizacao-por-grafo/script/US-06-hook-sessao/Sobre.md) — 2 nó(s) em comum
- [US-07 — `--status --html`: a série histórica](../../../../Novos/organizacao-por-grafo/script/US-07-status-html/Sobre.md) — 2 nó(s) em comum
- [US-08 — Tokens gastos por modelo, medidos das transcrições](../../../../Novos/organizacao-por-grafo/script/US-08-tokens-gastos/Sobre.md) — 1 nó(s) em comum
- [US-10 — O grafo a nosso favor: Impacto, colisão, deriva](../../../../Novos/organizacao-por-grafo/script/US-10-grafo-a-nosso-favor/Sobre.md) — 2 nó(s) em comum
- [US-15 — `--status --html` legível: hierarquia, tema e "o que fazer" primeiro](../../../../Novos/organizacao-por-grafo/script/US-15-status-html-legivel/Sobre.md) — 2 nó(s) em comum
- [US-16 — `/refinar`, US `refinada` e ilhas derivadas do `Código tocado`](../../../../Novos/organizacao-por-grafo/script/US-16-refinar-e-ilhas/Sobre.md) — 1 nó(s) em comum
- [US-18 — símbolo que não resolve não pode derrubar o arquivo](../../../../Novos/organizacao-por-grafo/script/US-18-simbolo-nao-derruba-o-arquivo/Sobre.md) — 1 nó(s) em comum
- [US-19 — a atividade escolhe papéis, skills, modelos e esforço conforme capacidades disponíveis](../../../../Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md) — 2 nó(s) em comum
- [US-26 — o Marvin mostra, na instalação, quais personas o projeto pede](../../../../Novos/time/roteamento/US-26-marvin-mostra-e-oferece-as-personas/Sobre.md) — 2 nó(s) em comum

## Rumo
- **11/10/2026** — refinada no `/refinar` (anotação do Josué durante a migração dos 6 projetos para a 2.3.0). Prioridade alta: bug medido, cabe num chat. Contorno já aplicado nas máquinas dele: `npm i -g marvin-kb@2.3.0`.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
