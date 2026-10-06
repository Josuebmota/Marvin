# Disponibilidade de IA e glossário

Foco definido pelo usuário: **Claude, Codex/OpenAI, MiniMax, DeepSeek, Gemini, Grok e
Jev**. Novas inclusões dependem de confirmação humana. A política completa está no
[fluxo de delegação](Fluxos/delegacao.md); não carregar todo o glossário em cada sessão.

## Inventário local

`../.local/disponibilidade.json` guarda somente declarações de ferramenta executora,
opções disponíveis, modalidade de acesso e configuração informada. Ignore específico;
nenhuma credencial ou prova de execução. Ausente significa **não informado**.
Onboarding pergunta uma vez; sem TTY/`--no-questions`, usar flags ou deixar pendente.
Edite o JSON local para alterar escolhas e reconfirme antes de usar. Assinatura no
cliente oficial, API e execução local não são intercambiáveis. `--tools` escolhe
adaptadores; `--executor` declara a sessão; nenhum conecta fornecedores.

## Pesquisa e escolha por atividade

Atividade/domínio → papéis → skills → capacidades → modelo/ferramenta/esforço elegíveis.
Uma opção capaz pode assumir vários papéis. Ter todas não exige usar todas; skill e
plugin instalados não provam acesso, modelo concreto ou delegação nativa.
Registre escolha e configuração solicitada/aplicada na US; verifique pelo risco.
Sem capacidade ou integração, informe a lacuna e execute só as etapas possíveis.
Não há migração automática de sessão por quota nem economia medida.

## Entradas do glossário

Reutilizar [Pesquisa de capacidades da US-19](../Planejamento/Novos/time/roteamento/US-19-papel-modelo-esforco/Sobre.md#pesquisa-de-capacidades--05102026),
com fontes datadas, controles e limitações. Fonte documentada, acesso declarado e
execução testada são estados diferentes. Uso real acrescenta evidência, preservando
resultados anteriores; fontes da API não comprovam suporte no executor.

Jev é estudado para decisões estruturadas, sem geração de texto. MiniMax exige
conferência de modelo e acesso próprios para vídeo; conexão ao chat não os comprova.
