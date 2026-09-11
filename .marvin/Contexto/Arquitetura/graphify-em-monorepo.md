# Graphify em monorepo — por que o grafo nascia inútil em silêncio

> Sessão de 09/08/2026. O passo 8b e as três flags de graphify nasceram daqui.
> Movido de `onde_paramos.md` em 09/09/2026, quando a nota passou do teto e o próprio
> marvin a acusou. O regime aqui é outro: **acrescenta, nunca sobrescreve.**

Tudo no `--graphify`, e a origem foi um projeto real: **num monorepo o grafo nascia inútil
em silêncio.** Sub-repositório costuma estar no `.gitignore` da raiz, porque é versionado
por conta própria; o graphify respeita `.gitignore`; então extrair da raiz indexava tudo
**menos** o código do produto. Medido num monorepo de quatro sub-repos: **2.783 dos 2.854
nós vinham de `.claude/` e nenhum do produto**, e nada no caminho avisava. Pior: o hook
oficial do graphify estava instalado lá, mandando `MANDATORY` a cada Read sobre esse grafo.

O passo 8b agora faz o ciclo inteiro, tudo AST local, sem chave e sem custo:

1. detecta sub-repo com `git check-ignore` — **só o que a raiz ignora**, senão entraria
   duas vezes no grafo;
2. `graphify extract` de cada um para `graphify-out/repos/<nome>/`, que já está ignorado —
   escrever dentro do sub-repo sujaria repositório alheio;
3. `merge-graphs` para `graph.json`, com o anterior virando `graph.bak.json`;
4. `cluster-only --no-label`, que gera `graph.html` e `GRAPH_REPORT.md`.

**O passo 4 fechou uma confusão que não era nossa.** O README do graphify abre mostrando
`graph.html` e `GRAPH_REPORT.md`, mas `extract` para no `graph.json` de propósito — o
relatório é passo separado e exige LLM. Quem instalava achava que tinha quebrado. O
`--no-label` gera os dois de graça, com as comunidades como `Community N`.

Duas flags novas: `--graphify-label` (nomeia com a CLI `claude`, sem chave de API — fora do
padrão porque o backend é forçado a **uma chamada por vez**, então custa minutos e cota) e
`--graphify-rebuild` (o padrão continua não sobrescrevendo).

⚠️ **Num monorepo `graphify update .` DESTRÓI o grafo** — re-extrai só a raiz e joga fora os
sub-repos. E a documentação do próprio graphify manda rodar esse comando. O Marvin escreve o
aviso no `CLAUDE.md` gerado, nomeando os sub-repos, para o agente não se autossabotar.

**Bug pego rodando de verdade, não no teste:** `graphify extract` sai com código != 0 quando
o alvo não produz nó, e sub-repo placeholder (só `LICENSE` e `README`) é caso comum. O `try`
estava em volta do laço, então um sub-repo vazio derrubava merge e backup junto. Agora o
`try` é por sub-repo. **Dry-run passou limpo e a execução real falhou** — vale lembrar disso.

Três verificações novas (48 → 51) e nenhuma exige o graphify instalado: a detecção mora no
topo do script e quem escreve o aviso é o passo 7, então o CI segue verde sem o binário.

**Duas premissas viraram um gatilho só: o commit.** É o momento em que uma unidade de
trabalho fecha, e as duas coisas derivadas que envelhecem em silêncio pertencem ali.

- **Grafo:** `--graphify-git-hook` escreve um `post-commit` que atualiza em segundo plano.
  Não é o `graphify hook install` — aquele reconstrói a **raiz**, que num monorepo é o
  caminho que apaga os sub-repos: automatizaria o bug a cada commit. O nosso roda o refresh
  que serve ao projeto. Não sobrescreve `post-commit` alheio (invariante 1 fora da memória),
  não é versionado porque mora em `.git/`, e `MARVIN_SKIP_GRAPH_HOOK=1` pula uma vez.
- **Memória:** não virou hook, porque escrever estado exige julgamento e hook não tem. Virou
  regra no `CLAUDE.md` gerado, com o mesmo gatilho: atualizar `onde_paramos.md` **no commit**,
  e só quando o commit muda o estado. Commit de typo não pede nada.

⚠️ **"Sempre atualizar a memória" foi rejeitado como texto.** Sem gatilho não dispara; com
obediência literal a nota vira changelog — e ela é **estado sobrescrito**, o histórico é o
`git log`. A regra só funciona amarrada a um momento.

Também levantado e **descartado**: `rtk`, `headroom` e `caveman`. Anunciam 33–99%, 54% e 50%;
medidos em sessão real economizam **0,5%, 2,8% e 0,4%** do gasto. O `rtk` filtra saída de
shell, mas 78% dos tokens de tool-output vêm do `Read` nativo e não passam por lá. O
`codegraph` é concorrente do graphify, não complemento — se um dia entrar, é substituindo.
