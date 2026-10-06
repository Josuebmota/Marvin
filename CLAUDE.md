# Marvin — Claude Code

@AGENTS.md

> A fonte de verdade deste projeto é **[AGENTS.md](AGENTS.md)** — estrutura, invariantes,
> armadilhas e convenções estão lá. **Leia AGENTS.md antes de qualquer coisa.**
> Este arquivo não duplica nada: só acrescenta o que é específico desta ferramenta.
> 
> Estado corrente e próximo passo: `.marvin/Memoria/onde_paramos.md`.

## Onde parou

`/retomar` num chat novo — lê `.marvin/Memoria/onde_paramos.md` e confere contra o `git log`
antes de acreditar no que está escrito.

## Referência de modelos — Claude Code

Os papéis estão no `AGENTS.md`. A tabela abaixo é uma referência de partida para
Claude Code, não uma escolha permanente por papel nem equivalência com outras LLMs.
No piloto da US-19, siga [o fluxo de delegação](.marvin/Contexto/Fluxos/delegacao.md)
para escolher por tarefa e conferir a configuração aplicada. O `model` do frontmatter
de `.claude/agents/*.md` é a configuração de partida; Opus no `tl` é a referência
inicial Claude, não escolha obrigatória por papel. A seleção começa na atividade,
domínio e skills e usa as capacidades efetivamente disponíveis; plugin instalado
não fixa fornecedor para delegação ou revisão.

| Precisa de | Modelo |
|---|---|
| julgamento | **opus** |
| implementação | **sonnet** |
| recuperação delimitada | **haiku** |

**Haiku só para recuperação** — erra onde a tarefa exige segurar um invariante e notar
o que está *faltando*.

## Memória

`~/.claude/projects/<raiz-com-hifens>/memory` é uma **junction** para
`.marvin/Memoria/`. O Claude escreve no caminho padrão e os arquivos nascem no repositório.

⚠️ Abra sempre da **raiz do repositório** — a memória é derivada do `cwd` (`:`, `\` e `/`
viram `-`). De um subdiretório, cai numa memória diferente e vazia, sem aviso.

⚠️ **Mover ou renomear a pasta quebra essa junction em silêncio.** Ela fica apontando para o
caminho antigo e o Claude Code cria um diretório vazio no novo — o agente escreve memória e
nada chega ao repositório. As notas antigas continuam em `.marvin/Memoria/`; quebrou só o
link. Aconteceu aqui em 03/08, ao mover a pasta.

```bash
node marvin.mjs --check   # diagnostica e sai != 0; não escreve nada
node marvin.mjs           # conserta: remove o diretório vazio e recria a junction
```

> Num projeto normal o Marvin escreve aqui o caminho absoluto de verdade, que é mais útil.
> **Este repo é público**, então o caminho foi trocado por um marcador — mesma exceção da
> memória em `.gitignore`, explicada no [AGENTS.md](AGENTS.md).
