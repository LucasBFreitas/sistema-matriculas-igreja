-- ATUALIZAÇÃO V11
-- Rode no Supabase SQL Editor uma única vez.

alter table turmas add column if not exists periodo_aulas text;
alter table turmas add column if not exists periodo_ferias text;
alter table turmas add column if not exists periodo_recomeco text;
alter table turmas add column if not exists periodo_encerramento text;
