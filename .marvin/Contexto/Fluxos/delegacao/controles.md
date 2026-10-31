---
pai: ../delegacao.md
---
## Controles e limites — conferidos em 05/10/2026

↩ [Fluxo delegação](../delegacao.md)


- [Claude Code](https://code.claude.com/docs/en/sub-agents): `model` por chamada;
  `effort` no frontmatter, com herança da sessão quando omitido. `effort` por invocação
  exige Claude Code v2.1.292+ (fonte revista em 09/10/2026). Conferir versão e
  configuração aplicada; herança é fallback local, não regra universal.
- [Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents): spawn aceita
  modelo/esforço; sem configuração, herda do pai. Modelo escolhido pelo spawn ou
  default sem esforço configurado usa o default do modelo. O TOML customizado
  prevalece nos campos que define; se só define modelo, preserva o esforço resolvido
  antes. Conferir a precedência e a compatibilidade efetivas.
  Nesta sessão, o esquema `collaboration.spawn_agent` com `fork_turns: all` herda
  modelo/esforço e não aceita overrides nessa forma; é limite desta chamada.
- **Revisão pelo GPT, opcional** (dono, 29/10/2026, depois dos 2 pares da
  [US-72](../../../Planejamento/Novos/time/roteamento/US-72-gpt-na-equipe/Sobre.md)): segunda leitura
  de um diff, quando o Codex estiver disponível e a cota sobrar. Não substitui o `qa` nem o `tl`:
  nos 2 pares, trouxe 1 achado único, não bloqueante, e nenhum dos dois revisores pegou o erro de escopo.
  `codex exec -C <repo> -s read-only "<pedido>" < /dev/null > <arquivo>` — só leitura, stdin
  fechado (sem ele o comando espera), em segundo plano, com 40 a 70 mil tokens da cota por diff.
  O pedido é o mesmo do `qa`: diff, *Pronto quando*, *Não entra* e AGENTS.md. Diga para ignorar
  Rumo e Evidência; mesmo assim, no par 2 ele leu o Rumo. O achado vai para o `tl` junto com os do `qa`.
- **Revisão pelo Gemini, opcional** ([US-91](../../../Planejamento/Novos/time/roteamento/US-91-gemini-na-equipe/Sobre.md),
  dono, 31/10/2026; **2 pares medidos, não pagou como obrigatória; fica opcional**): segunda leitura de um diff, quando o `agy`
  estiver logado. Não substitui o `qa` nem o `tl`. Em segundo plano, a partir da raiz do repositório
  (comando da chamada de 31/10 que funcionou; **sem `-p`**, com o pedido canalizado, o `agy` rodou
  sem abrir interface; a saída vai para arquivo, como no `codex`):
  `$pedido | & "$env:LOCALAPPDATA\agy\bin\agy.exe" --model gemini-3.8-flash-medium --sandbox --print-timeout 300s 2>&1 | Out-File -Encoding utf8 <arquivo>`
  — o instalador não põe o `agy` no PATH do shell já aberto, então use o caminho completo.
  **O pedido vai por stdin e leva o diff e os critérios colados no texto**, sem depender de
  ferramenta: em modo sem interface o `agy` nega sozinho as ferramentas de comando
  (`git diff`) e de leitura de arquivo, e não há como aprová-las na hora. Passar o pedido
  com `-p "<texto>"` no PowerShell 5.1 quebra quando o texto tem aspas (o `agy` recebe
  argumentos soltos); no PowerShell 5.1 defina `$OutputEncoding = [Text.UTF8Encoding]::new($false)`
  antes (efeito sobre os acentos **não conferido**; a 4ª chamada de 31/10 rodou com esse ajuste). O pedido é o do `qa` (diff, *Pronto quando*,
  *Não entra*, AGENTS.md; sem Rumo nem Evidência), mais "não use ferramentas, não edite
  nada". **O `--sandbox` não garante só leitura**: em 30/10 o `agy -p` com ele alterou um
  arquivo num diretório temporário. Antes de cada chamada guarde três coisas e
  compare as três depois: `git status --porcelain -uall` (o `-uall` lista cada arquivo novo,
  não só a pasta); o hash do diff rastreado, `git diff --binary > $env:TEMP\antes.diff` e
  `git hash-object $env:TEMP\antes.diff` (por arquivo, não pelo pipeline, que no PowerShell 5.1
  converte a saída por `$OutputEncoding` e perde troca só de acento); e o hash de cada arquivo
  não rastreado, `git -c core.quotePath=false ls-files -o --exclude-standard | git hash-object --stdin-paths` (sem o `quotePath=false`, caminho com acento sai entre aspas e o `hash-object` aborta em silêncio; **sem nenhum arquivo não rastreado ele aborta com código 128** no PowerShell 5.1, que entra com uma linha de BOM: guarde a lista em variável e só rode o `hash-object` se ela não estiver vazia — par 2 de 31/10). **Cole o diff completo do commit no pedido**: arquivo que mudou e ficou fora do texto vira "bloqueia" falso (par 2). Só o
  status não basta: um arquivo ` M` continua ` M` depois de editado, e um `??` não aparece no
  `git diff`. Se algo mudou, **não use `git restore` nem `git checkout`** (apagariam
  trabalho não commitado do dono). Se o arquivo tocado já tinha mudança do dono, **avise o
  dono** em vez de reverter; só reverta, e só o trecho, o que o Gemini escreveu num arquivo
  que estava limpo; arquivo novo criado pelo Gemini pode ser apagado, porque não existia antes.
  Grave o diff de depois em `depois.diff`, sem sobrescrever o `antes.diff`. Nada disso cobre
  arquivo ignorado (`.gitignore`) nem o que ele escreva fora do repositório: esse risco fica. Nunca
  use `--dangerously-skip-permissions`; liberar `command(...)` ou `read_file(...)` em
  `permissions.allow` do `agy` é configuração do dono, não da sessão.
  **Modelo no par: proposto, sem padrão até medir** (dono, 31/10/2026): `--model
  gemini-3.8-flash-medium` (aceito pelo CLI; qual modelo respondeu não foi conferido).
  No par, subir para `gemini-4-argon` em `high` é uma escada de **custo presumida** (cota não
  medida, descrição do fornecedor não consultada), só se o Flash não alcançar; não é
  ordem de capacidade nem equivalência com Opus ou Sonnet.
  O conteúdo do diff vai ao Google: só repositório do próprio dono e sem segredo.
  Assinatura conta como $0 marginal (dono, 31/10/2026); o gasto de cota não foi medido.
- Outros fornecedores: conferir sob demanda a combinação efetivamente escolhida.
  Uma fonte oficial prova suporte documentado; aplicação exige evidência da execução.
