# Sistema de Matrículas - V12.0.9 Build Fix

Correção do erro de build em `src/main.jsx`.

Inclui:
- Sexo
- Possui deficiência
- Qual deficiência
- Zona automática

SQL necessário:

```sql
alter table alunos add column if not exists sexo text;
alter table alunos add column if not exists possui_deficiencia text default 'Não';
alter table alunos add column if not exists qual_deficiencia text;
alter table alunos add column if not exists zona text;
```
