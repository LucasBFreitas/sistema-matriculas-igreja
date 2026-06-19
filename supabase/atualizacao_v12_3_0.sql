-- ATUALIZAÇÃO V12.3.0 - CONTROLE DE PRESENÇA
-- Rode uma única vez no Supabase SQL Editor antes de subir esta versão.

create extension if not exists "pgcrypto";

create table if not exists presencas (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid references alunos(id) on delete cascade,
  matricula_id uuid references matriculas(id) on delete cascade,
  turma_id uuid references turmas(id) on delete cascade,
  periodo_letivo_id uuid references periodos_letivos(id) on delete set null,
  data_chamada date not null,
  status text not null default 'faltou' check (status in ('presente','faltou')),
  created_at timestamptz default now(),
  unique(matricula_id, data_chamada)
);

alter table presencas enable row level security;

drop policy if exists "presencas_auth_all" on presencas;

create policy "presencas_auth_all"
on presencas
for all to authenticated
using (true)
with check (true);

create index if not exists idx_presencas_aluno_id on presencas(aluno_id);
create index if not exists idx_presencas_turma_periodo on presencas(turma_id, periodo_letivo_id);
