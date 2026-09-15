---
name: adaptador-de-ferramenta
description: Acrescentar uma ferramenta opcional ao registro `.marvin/ferramentas.md` do marvin — detectar, perguntar uma vez, registrar, e ligar o que ela muda no que o script gera. Rodou duas vezes (graphify na US-11a, ponytail na US-11b).
---

# Adaptador de ferramenta opcional

Ferramenta opcional é o que um projeto *escolhe* usar (graphify, ponytail) — não um
adaptador de `--tools=`. Tudo mora no **bloco 0b** do `marvin.mjs` (`FERR_OPCIONAIS`).

## O ciclo

1. **Ler a fonte antes de escrever o alcance.** Leia o README/docs do que está instalado
   (`~/.claude/plugins/cache/<nome>/...`) — não a memória. Na 11b o alcance do Cursor saiu
   inventado (`.cursor/rules/`) e o `tl` bloqueou: o plugin usa `~/.cursor/hooks.json`.
   Invariante 3.
2. **Uma entrada em `FERR_OPCIONAIS`:** `nome`, `detecta()` (devolve `false` ou o estado
   como string — vai na pergunta e no aviso), `instalar` (o comando exato), `alcance`
   (quem lê o que ela produz; se depende de `--tools=`, um getter). Detecção de plugin do
   Claude lê `~/.claude/...` via `os.homedir()` — é o que o teste redireciona.
3. **Um `let` no topo** (`GRAPHIFY`, `PONYTAIL`) ligado no laço do 0b. Só ele decide o
   que o script gera depois.
4. **O que ela muda no gerado** entra em template já guardado por `existsSync`, como
   bloco `${FLAG ? ... : ''}`. Selo de confiança na seção. Escrita **sempre** por `fsw`.
5. **Marca em `ATUALIZACOES`** com `soCom: FLAG` — regex que exija a seção, não uma
   menção (`/## Ferramentas[\s\S]*?\*\*Ponytail\*\*/`, não `/ponytail/i`).
6. **Teste hermético** (`teste.mjs`, série 9e): ausente registra `não` e ensina a instalar;
   presente sem TTY avisa e registra `não`; `--use=<nome>` gera as seções; **`--dry-run`
   conferido antes do run real** — depois do `--use` ele não prova nada.
7. **Os dois READMEs**: linha na tabela *Optional tools* e a contagem de verificações.
8. **Validar aqui:** `marvin --use=<nome>` neste repo → o passo 10 tem que acusar as
   seções faltando no `AGENTS.md`/`agents/README.md`; acrescente-as à mão e o aviso some.
9. `tl` lê o diff antes do commit.

## O que não fazer

- Alcance por plataforma que a detecção não cobre: **declare** ("só o do Claude é
  detectado") em vez de fingir.
- Marca frouxa em `ATUALIZACOES` — o `--status` cala com uma menção qualquer.
