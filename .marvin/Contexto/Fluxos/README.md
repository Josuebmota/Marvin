# Fluxos

Um arquivo por fluxo do produto (`checkout.md`, `login.md`…). **Incremental:** o fluxo
entra quando uma atividade exige analisá-lo, e o que se descobriu fica aqui em vez de
ser redescoberto na próxima. Link para cá a partir do [Sobre.md](../Sobre.md) e da US.

Formato mínimo:

```markdown
# Fluxo <nome>

<o que ele faz, em três linhas>

## Passos
1. <passo> — `src/<arquivo>` — `<função>`

## Regras que não podem quebrar
- <invariante do fluxo>

## US que passaram por aqui
- [US-12](../../Planejamento/Novos/<Epic>/<Feature>/US-12/Sobre.md)
```
