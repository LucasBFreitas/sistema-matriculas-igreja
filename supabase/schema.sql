
-- SISTEMA DE MATRÍCULAS - PROJETO SOCIAL IGREJA
-- Cole este SQL no Supabase: SQL Editor > New query > Run

create extension if not exists "pgcrypto";

create table if not exists responsaveis (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cpf text,
  telefone text,
  email text,
  endereco text,
  created_at timestamptz default now()
);

create table if not exists alunos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  data_nascimento date,
  cpf text,
  rg text,
  telefone text,
  endereco text,
  observacoes text,
  responsavel_id uuid references responsaveis(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists cursos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  ativo boolean default true,
  created_at timestamptz default now()
);

create table if not exists turmas (
  id uuid primary key default gen_random_uuid(),
  curso_id uuid not null references cursos(id) on delete cascade,
  nome text not null,
  dias_horarios text,
  vagas int not null default 0,
  periodo text,
  ativo boolean default true,
  created_at timestamptz default now()
);

create table if not exists matriculas (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references alunos(id) on delete cascade,
  turma_id uuid not null references turmas(id) on delete restrict,
  data_matricula date not null default current_date,
  data_renovacao date,
  status text not null default 'ativa' check (status in ('ativa', 'renovada', 'cancelada')),
  observacoes text,
  created_at timestamptz default now()
);

create index if not exists idx_alunos_nome on alunos using gin (to_tsvector('portuguese', nome));
create index if not exists idx_matriculas_status on matriculas(status);
create index if not exists idx_matriculas_aluno on matriculas(aluno_id);
create index if not exists idx_turmas_curso on turmas(curso_id);

alter table responsaveis enable row level security;
alter table alunos enable row level security;
alter table cursos enable row level security;
alter table turmas enable row level security;
alter table matriculas enable row level security;

drop policy if exists "responsaveis_auth_all" on responsaveis;
drop policy if exists "alunos_auth_all" on alunos;
drop policy if exists "cursos_auth_all" on cursos;
drop policy if exists "turmas_auth_all" on turmas;
drop policy if exists "matriculas_auth_all" on matriculas;

create policy "responsaveis_auth_all" on responsaveis for all to authenticated using (true) with check (true);
create policy "alunos_auth_all" on alunos for all to authenticated using (true) with check (true);
create policy "cursos_auth_all" on cursos for all to authenticated using (true) with check (true);
create policy "turmas_auth_all" on turmas for all to authenticated using (true) with check (true);
create policy "matriculas_auth_all" on matriculas for all to authenticated using (true) with check (true);

-- Dados de exemplo
insert into cursos (nome, descricao) values
('Informática Básica', 'Curso introdutório de informática'),
('Violão', 'Aulas de música para iniciantes')
on conflict do nothing;
