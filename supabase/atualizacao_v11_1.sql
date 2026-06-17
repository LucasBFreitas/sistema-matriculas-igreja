-- ATUALIZAÇÃO V11.1
-- Rode no Supabase SQL Editor uma única vez antes de subir esta versão.

alter table turmas add column if not exists data_inicio_semestre date;
alter table turmas add column if not exists data_fim_semestre date;
