# Prompt — montar o setup nativo num projeto

Rode o script primeiro, depois cole isto numa sessão **dentro do projeto**.

```
node "<caminho>/marvin/marvin.mjs"
```

Se o projeto ainda tem ruflo:

```
npx ruflo@latest daemon stop
node "<caminho>/marvin/marvin.mjs" --limpar-ruflo
```

---

## O prompt

```
Vou montar a base de conhecimento deste projeto. O script do marvin
já rodou e criou o esqueleto (base em .marvin/, memória com junction invertida,
.claude/agents vazio, git). Agora falta a parte que exige julgamento.

PASSO 1 — Lê o código de verdade antes de escrever qualquer coisa.
Quero que tu descubra, com arquivo:linha:

  a) A stack REAL de cada subdiretório. Não confia em nome de pasta.
     Se um diretório estiver vazio (só LICENSE/README), NÃO cria agente pra ele —
     agente sem código inventa arquitetura.

  b) Os invariantes deste produto: o que nunca pode quebrar?
     Se for software financeiro: onde o dinheiro pode sumir ou nascer sem
     deixar rastro? Se for integração: o que não pode ser processado duas vezes?

  c) As armadilhas do codebase. Procura especificamente por:
     - campo persistido que parece ser o valor final mas é só a abertura/base
     - valor exibido que é derivado, não lido
     - efeito colateral não óbvio (remount, cache, listener)
     - lugar onde a UI promete uma coisa e o código faz outra

  d) Como se roda teste, build e deploy aqui.

Pode usar subagentes em paralelo pra varrer, mas lê o resultado com ceticismo —
relatório verde de agente não é prova.

PASSO 2 — Escreve:

  • CLAUDE.md: estrutura real, invariantes, convenções, a tabela do time,
    e uma seção "notas de campo" com as armadilhas do passo 1c.

  • .claude/agents/*.md: um por papel. Modelo no frontmatter:
      haiku  → só recuperação delimitada (scout)
      sonnet → implementação, QA, documentação
      opus   → julgamento, arquitetura, revisão de diff
    SEMPRE um papel `tl` em opus que lê diff e é dono dos invariantes.
    Dentro de cada agente, escreve as armadilhas concretas que o afetam.

  • Docs/00_Inicio.md: o estado atual do projeto e as portas de entrada.

PASSO 3 — Commit.

REGRA: agente genérico não vale nada. O que faz valer é a armadilha concreta
escrita dentro dele. Se tu não achou armadilha nenhuma no passo 1c, tu não
procurou o suficiente — volta ao passo 1.
```

---

## Por que é dividido assim

O script acerta o mecânico: junction, esqueleto da base, detecção de stack,
`.gitignore` com os sub-repos, diagnóstico de colisão entre níveis de `.claude`.

Mas os agentes só prestam quando carregam coisas que **só se descobrem apanhando**.
Estes são de um app financeiro real — nenhum sairia de template:

- `conta.saldo` é a abertura, não o saldo exibido (escrever nele move patrimônio sem transação)
- `min-width: auto` não deixa flex item encolher (foi assim que um botão saiu da tela a 375px)
- o app remonta ao chegar snapshot do Firestore e mata o menu aberto
- `new Date("2027-07-28")` volta um dia em Manaus
- o radio de "criar transação de ajuste" é decorativo — o código sempre faz a outra coisa

## Referência da arquitetura

```
<projeto>/
├── CLAUDE.md
├── .claude/agents/         o time (6 a 9 papéis)
└── .marvin/                ← a base de conhecimento É esta pasta
    ├── 00_Inicio.md
    ├── 08_Memoria/         ← memória do Claude, arquivos reais e versionados
    ├── 09_Arquivo_*/       arquivo morto, se houver
    └── 99_Backup/
```

Uma junction só, invertida:

```
~/.claude/projects/<caminho-com-hifens>/memory  ──►  Docs/08_Memoria/
```

**Regra dos níveis:** GLOBAL (`~/.claude/`) = capacidade · PROJETO = time · meio-termo não existe.

**Pegadinha do caminho:** a memória é derivada do `cwd`. Abrir o Claude Code de
um subdiretório cai numa memória diferente e vazia, sem aviso nenhum.
