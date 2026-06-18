# Sistema de Matrículas - Versão 12.0.9 FIX

## Correção

- Corrigido erro de build no `main.jsx`.
- Campo Sexo no cadastro de alunos.
- Campo Possui deficiência.
- Campo Qual deficiência.
- Campo Qual deficiência fica desabilitado quando "Possui deficiência" estiver como Não.

## SQL necessário

Rode uma única vez:

```sql
alter table alunos add column if not exists sexo text;
alter table alunos add column if not exists possui_deficiencia text default 'Não';
alter table alunos add column if not exists qual_deficiencia text;
```
