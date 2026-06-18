# Sistema de Matrículas - V12.2.0

## Períodos letivos nas matrículas

Implementações:

- Nova aba **Períodos**.
- Cadastro de período letivo, exemplo:
  - 2026.1
  - 2026.2
- Campo **Período letivo** na inscrição.
- Matrícula passa a ser vinculada a:
  - Aluno
  - Turma
  - Período letivo
- Controle de vagas passa a considerar turma + período.
- A mesma turma pode ter vagas independentes em 2026.1 e 2026.2.
- Listagem de inscrições mostra o período.
- Relatórios passam a mostrar o período.

## SQL obrigatório

Antes de subir esta versão, rode:

`supabase/atualizacao_v12_2_0.sql`
