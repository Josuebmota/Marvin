# Marvin — Claude Code

@AGENTS.md

> A fonte de verdade deste projeto é **[AGENTS.md](AGENTS.md)** — estrutura, invariantes,
> armadilhas e convenções estão lá. **Leia AGENTS.md antes de qualquer coisa.**
> Este arquivo não duplica nada: só acrescenta o que é específico desta ferramenta.
> 
> Estado corrente e próximo passo: `.docs/08_Memoria/onde_paramos.md`.

## Onde parou

`/retomar` num chat novo — lê `.docs/08_Memoria/onde_paramos.md` e confere contra o `git log`
antes de acreditar no que está escrito.

## Modelo por papel

Os papéis estão no `AGENTS.md`. Aqui só o mapeamento, que vai no frontmatter de cada
`.claude/agents/*.md`:

| Precisa de | Modelo |
|---|---|
| julgamento | **opus** |
| implementação | **sonnet** |
| recuperação delimitada | **haiku** |

**Haiku só para recuperação** — erra onde a tarefa exige segurar um invariante e notar
o que está *faltando*.

## Memória

`~/.claude/projects/<raiz-com-hifens>/memory` é uma **junction** para
`.docs/08_Memoria/`. O Claude escreve no caminho padrão e os arquivos nascem no repositório.

⚠️ Abra sempre da **raiz do repositório** — a memória é derivada do `cwd` (`:`, `\` e `/`
viram `-`). De um subdiretório, cai numa memória diferente e vazia, sem aviso.

⚠️ **Mover ou renomear a pasta quebra essa junction em silêncio.** Ela fica apontando para o
caminho antigo e o Claude Code cria um diretório vazio no novo — o agente escreve memória e
nada chega ao repositório. As notas antigas continuam em `.docs/08_Memoria/`; quebrou só o
link. Aconteceu aqui em 03/08, ao mover a pasta.

```bash
node marvin.mjs --check   # diagnostica e sai != 0; não escreve nada
node marvin.mjs           # conserta: remove o diretório vazio e recria a junction
```

> Num projeto normal o Marvin escreve aqui o caminho absoluto de verdade, que é mais útil.
> **Este repo é público**, então o caminho foi trocado por um marcador — mesma exceção da
> memória em `.gitignore`, explicada no [AGENTS.md](AGENTS.md).
