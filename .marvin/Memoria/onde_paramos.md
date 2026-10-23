---
name: onde-paramos
aliases: ["onde-paramos", "ONDE PARAMOS"]
description: "ÚNICA porta de entrada do Marvin. Só ponteiros para as US em andamento — sempre sobrescrita."
tags: [moc, entrada]
metadata:
  type: project
  atualizado: 2026-10-19
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

**Atualizado:** 19/10/2026

## Em andamento


- ⚪ [IA.md](../Contexto/IA.md) — 23/10, pedido do dono: o `marvin` **detectar** as LLMs que o usuário tem (hoje o `.marvin/.local/disponibilidade.json` só guarda o que foi declarado por flag: claude e codex `configured: yes`, `tested: not-confirmed`; o `codex` CLI está no PATH e logado via ChatGPT; o plugin `openai-codex` está instalado e desligado) e a triagem **rotear etapas para o GPT** quando casar — hoje nenhum *Time* usa o Codex e não existe ponte de execução (subagente do Claude não roda GPT; caminhos: `codex exec` headless ou o plugin `codex@openai-codex`)

- ⚪ [equipe-barata](../Contexto/Arquitetura/equipe-barata.md) — 16/10: **3.4.1 no npm** (tag `v3.4.1`); fila: US-63 refinada. Falta: desligar conectores da conta (~9,7k/sessão) · US-29 concluída 19/10 (−58% com coordenador Sonnet)

