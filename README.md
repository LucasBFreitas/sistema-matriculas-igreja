# Sistema de Matrículas - V12.0.8 Fix

## Zona automática no cadastro de alunos

- Adiciona campo Zona no cadastro de alunos.
- Define automaticamente a Zona conforme o bairro.
- Se o bairro não estiver na lista, usa a Cidade como Zona.
- Inclui correção de build do main.jsx.

## SQL necessário

Rode uma única vez no Supabase:

```sql
alter table alunos add column if not exists zona text;
```
