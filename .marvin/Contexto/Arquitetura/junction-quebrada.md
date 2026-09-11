# Junction quebrada — o diagnóstico e a receita manual

> A armadilha mais citada deste projeto: mover ou renomear a pasta quebra a memória
> **em silêncio**, e parece perda de dado. Movido de `onde_paramos.md` em 09/09/2026 —
> é procedimento, não estado corrente.

**O caminho normal virou o próprio script:** `marvin --check` diagnostica e sai != 0;
`marvin` conserta. A receita abaixo é o fallback para quando o problema é na junction
**de outro projeto**, ou quando o marvin não está à mão.

**Mover a pasta do projeto quebra a memória de um jeito que parece perda de dado.** A
  junction antiga continua apontando para o caminho velho, e no caminho novo o Claude Code
  cria um `memory/` **vazio de verdade** — abre a sessão, a memória parece ter sumido, e
  nada avisa. O conteúdo está intacto em `.marvin/Memoria` (`08_Memoria` no layout antigo); o que falta é só a junction.

  **O script agora resolve isso sozinho:** `marvin --check` diagnostica e sai com código
  != 0; `marvin` normal conserta, removendo o diretório vazio e recriando o link. O
  comando manual abaixo continua valendo para quando o problema for na junction **de outro
  projeto**, ou quando o `marvin` não estiver à mão:

  ```powershell
  $novo = "<caminho-do-projeto>"; $chave = ($novo -replace '[:\\/]','-'); $link = "$env:USERPROFILE\.claude\projects\$chave\memory"; if (Test-Path $link) { $i = Get-Item $link -Force; if ($i.Attributes -band [IO.FileAttributes]::ReparsePoint) { [System.IO.Directory]::Delete($link, $false) } else { Remove-Item $link -Force } }; New-Item -ItemType Junction -Path $link -Target "$novo\.marvin\08_Memoria" | Out-Null; Get-ChildItem $link -Filter *.md
  ```

  Remove **só o link** se for junction, apaga o diretório vazio se for diretório, recria e
  lista as notas. Vale limpar a junction órfã do caminho antigo também — ela sobrevive
  apontando para o vazio. Se a última linha não listar `onde_paramos.md`, pare e confira
  `.marvin/Memoria` (ou `08_Memoria`, no layout antigo) antes de mexer em mais nada.
