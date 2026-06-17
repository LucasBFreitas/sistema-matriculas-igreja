-- ATUALIZAÇÃO V12
-- Rode no Supabase SQL Editor uma única vez.

create extension if not exists "pgcrypto";

create table if not exists periodos_turma (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  periodo_aulas text,
  periodo_ferias text,
  periodo_recomeco text,
  periodo_encerramento text,
  created_at timestamptz default now()
);

alter table periodos_turma enable row level security;

drop policy if exists "periodos_turma_auth_all" on periodos_turma;

create policy "periodos_turma_auth_all"
on periodos_turma
for all to authenticated
using (true)
with check (true);

alter table turmas add column if not exists periodo_id uuid references periodos_turma(id) on delete set null;
