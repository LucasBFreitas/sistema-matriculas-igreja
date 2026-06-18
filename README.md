# Sistema de Matrículas - V12.0.9 SAFE

Campos novos em Alunos:

- Sexo
- Possui deficiência
- Qual deficiência
- Zona automática

Antes de subir, rode no Supabase:

```sql
alter table alunos add column if not exists sexo text;
alter table alunos add column if not exists possui_deficiencia text default 'Não';
alter table alunos add column if not exists qual_deficiencia text;
alter table alunos add column if not exists zona text;
```
