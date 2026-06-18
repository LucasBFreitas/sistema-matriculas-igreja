-- ATUALIZAÇÃO V12.0.9
-- Rode no Supabase SQL Editor uma única vez antes de subir esta versão.

alter table alunos add column if not exists sexo text;
alter table alunos add column if not exists possui_deficiencia text default 'Não';
alter table alunos add column if not exists qual_deficiencia text;
