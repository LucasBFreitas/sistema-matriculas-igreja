-- ATUALIZAÇÃO V12.2.0 - PERÍODOS LETIVOS
-- Rode uma única vez no Supabase SQL Editor antes de subir a versão.

create extension if not exists "pgcrypto";

create table if not exists periodos_letivos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  data_inicio date,
  data_fim date,
  observacoes text,
  ativo boolean default true,
  created_at timestamptz default now()
);

alter table periodos_letivos enable row level security;

drop policy if exists "periodos_letivos_auth_all" on periodos_letivos;

create policy "periodos_letivos_auth_all"
on periodos_letivos
for all to authenticated
using (true)
with check (true);

alter table matriculas
add column if not exists periodo_letivo_id uuid references periodos_letivos(id) on delete set null;

create index if not exists idx_matriculas_periodo_letivo_id on matriculas(periodo_letivo_id);

-- Sugestão: cadastre depois pelo sistema:
-- 2026.1: março a junho
-- 2026.2: agosto a novembro
