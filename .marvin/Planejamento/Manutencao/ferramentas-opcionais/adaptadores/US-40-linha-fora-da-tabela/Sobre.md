---
tipo: us
estado: ativa
pai: ../Sobre.md
---
# US-40-linha-fora-da-tabela

**Por quê:** linha nova do `ferramentas.md` ia para o fim do arquivo, fora da tabela, depois das seções do projeto — visto em 14/10/2026 num projeto real (2.3.0 → 2.6.0, linha `playwright`).
**Pronto quando:** a linha nova entra logo depois da última linha da tabela
(`| ferramenta | usa | alcance | data |`), sem tocar nas outras linhas; segundo run não muda
nada (invariante 2); a escrita passa por `fsw` (dry-run honesto); um check no `teste.mjs` com
seção `## …` depois da tabela cobre isso, e a contagem dos dois READMEs acompanha.

## Fluxos ligados
- [montagem.md](../../../../../Contexto/Fluxos/montagem.md) — o run padrão escreve o registro (bloco 0b)

## Código tocado
- `marvin.mjs` — bloco 0b, registro de ferramentas opcionais: inserção das `newOnes` na tabela (`:1926-1935`)
- `teste.mjs` — check `pw-secao` no bloco US-34 (`:531-542`)
- `README.md`, `README.pt-BR.md` — contagem de verificações (349 → 350)

## Time
Triagem 14/10/2026 (`tl` + `po`; `po` é o dono). Atividade: correção pontual de escrita em disco
alheio, risco médio (reescreve um arquivo do usuário) — por isso o `tl` lê o diff.
- `dev-back` — implementação. Aplicado: a sessão principal (Claude Code, `claude-opus-5-5`),
  sem delegar: o contexto da correção custava mais que ela (passo 1 de `delegacao.md`); esforço: padrão da sessão, não conferido.
- `qa` — não delegado: `node teste.mjs` rodado pela sessão principal, 350 passaram; o `tl`
  confirmou que o check novo falha com o `marvin.mjs` de `HEAD`.
- `tl` — leitura do diff. Aplicado: subagente `tl` (modelo e esforço do frontmatter, não conferidos);
  veredito **fecha**, sem bloqueio.
- `po` — dono do escopo; abre a US.
- **Limitação:** grafo ausente neste worktree (`marvin --us` disse "no graph"); triagem por
  Grep. *Impacto* não gerado.

## Skills
Nenhuma nova. `adaptador-de-ferramenta` (já existe) cobre o registro; não muda por esta correção.

## Rumo
- **14/10/2026** — aberta. Correção já implementada antes da US, a pedido do dono; o `tl` leu o
  diff (fecha) e sugeriu dois ajustes não bloqueantes, aplicados: manter CRLF do arquivo e
  `[ \t]*` no lugar de `\s*` no cabeçalho. Fica de fora: cabeçalho `| ferramenta |` repetido
  antes da tabela real (o template gerado não tem). Sem entrada em `ATUALIZACOES`: não é seção
  nova de template. Sem tabela no arquivo, a linha continua indo para o fim, como antes. O
  caminho CRLF não tem check: o arquivo do teste nasce com `\n` e forçar CRLF não muda o que o
  check protege. Fica declarado como lacuna, não como coberto. Revisão do `po`: abre.

## Evidência
<!-- preenchido ao concluir: PR, teste, print, link. Vazio = não concluiu. -->
