---
name: onde-paramos
aliases: ["onde-paramos", "ONDE PARAMOS"]
description: "ÚNICA porta de entrada do Marvin. Só ponteiros para as US em andamento — sempre sobrescrita."
tags: [moc, entrada]
metadata:
  type: project
  atualizado: 2026-10-10
---

# ▶ ONDE PARAMOS

> Esta nota é versionada e **pública**, porque este repositório é público. Ela é uma
> lista de ponteiros: o estado, as decisões e o rumo de cada US moram no `Sobre.md` dela —
> **não aqui**. Esta nota carrega em TODA sessão; o que ela aponta só carrega quando é seguido.
>
> - Concluiu e foi validada → entra em `Releases/<versao>.md` com a evidência, e **sai daqui**.
> - Duas sessões em paralelo editam **linhas diferentes**; nenhuma reescreve a outra.
> - Criar `onde_paramos_<data>.md` **ou uma seção de relato aqui dentro** é o mesmo erro:
>   o histórico já está no `git log`, e o porquê já está no Rumo da US.

**Atualizado:** 10/10/2026

## Em andamento

- [US-29-medir-economia-do-roteamento](../Planejamento/Novos/time/roteamento/US-29-medir-economia-do-roteamento/Sobre.md) — medir custo por tarefa aprovada em 3–4 US reais; na próxima US, fixar contexto, checks e corte de turnos antes de começar

- ⚪ **Para refinar (Josué, 14/10/2026), sem US ainda:**
  1. graphify como **dependência obrigatória** e rota de toda busca (achar arquivo X passa pelo grafo; é onde está a economia de tokens). Muda a US-11a e o "opcional nos projetos gerados" do `AGENTS.md`;
  2. agentes e skills do repo definidos **na 1ª rodada com a LLM após instalar**, pelo glossário e pelo contexto do código. Muda o invariante 4 (hoje: só com armadilha concreta);
  3. em cada atividade, `po` + `tl` **designam e mostram** quem será chamado, atrelado à US;
  4. agente ou skill que falta no glossário é **criado para aquele contexto**;
  5. matriz **persona/modelo/esforço** por etapa ([`mapa-capacidades.md`](../Contexto/mapa-capacidades.md)), começando pelo menor esforço adequado, com esforço passado explícito na delegação; cada projeto nasce com a sua matriz;
  6. **painel** (`--status --html`) com cards, roadmap, decisões, perguntas ❓, economia por US (depende da US-29) e o **cérebro do graphify** (o grafo visual). Ler antes o painel do parci em `.marvin/painel/`.
  Contexto: reel de 13/10 assistido com `/watch` (teaser de "2 Opus com 90% de economia"; mostra papéis fixos, "condutor" e "correio", sem explicar o método).
