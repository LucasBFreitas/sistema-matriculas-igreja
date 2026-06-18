# Sistema de Matrículas - Versão 12.0.9

## V12.0.9 – Novos campos no cadastro de alunos

Alterações implementadas:

- Campo Sexo:
  - Masculino
  - Feminino

- Campo Possui deficiência:
  - Sim
  - Não

- Campo Qual deficiência:
  - Aparece quando o aluno possui deficiência.

## Banco de dados

Antes de subir esta versão, rode no Supabase:

```sql
alter table alunos add column if not exists sexo text;
alter table alunos add column if not exists possui_deficiencia text default 'Não';
alter table alunos add column if not exists qual_deficiencia text;
```
