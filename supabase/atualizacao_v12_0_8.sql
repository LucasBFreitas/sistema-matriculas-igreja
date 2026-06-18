-- ATUALIZAÇÃO V12.0.8
-- Rode no Supabase SQL Editor uma única vez antes de subir esta versão.

alter table alunos add column if not exists zona text;
