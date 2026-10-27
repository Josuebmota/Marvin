---
pai: ../delegacao.md
---
## Indisponibilidade e execução

↩ [Fluxo delegação](../delegacao.md)


Quota esgotada ou integração indisponível exige refazer a seleção para a etapa
restante, preservando objetivo, restrições, resultado parcial e verificações.
Substituição precisa suportar a mesma capacidade; não substituir vídeo por texto
nem reiniciar uma geração pendente sem conferir seu estado. Registrar motivo e
nova escolha, respeitando o orçamento autorizado. Sem opção elegível, manter a
etapa pendente e informar a limitação.

Plugin/gateway transporta a chamada escolhida; não define persona ou skill. Hook que
fixa revisão no Codex não é a política neutra e não é ativado por ela. A sessão
principal pode aplicar a seleção com as integrações disponíveis; assumir depois
que a própria sessão perde quota requer um executor externo, ainda fora deste
piloto. Nenhuma troca automática de sessão foi implementada.
