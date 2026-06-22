-- ATUALIZAÇÃO V12.5.0 - CONTROLE DE ACESSO POR PERFIL

create extension if not exists "pgcrypto";

create table if not exists usuarios_perfis (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  perfil text not null default 'professor' check (perfil in ('administrador','coordenador','professor')),
  professor_id uuid references professores(id) on delete set null,
  ativo boolean default true,
  created_at timestamptz default now()
);

alter table usuarios_perfis enable row level security;

drop policy if exists "usuarios_perfis_auth_all" on usuarios_perfis;

create policy "usuarios_perfis_auth_all"
on usuarios_perfis
for all to authenticated
using (true)
with check (true);

-- Depois, cadastre seu e-mail como administrador:
-- insert into usuarios_perfis(email, perfil)
-- values ('SEU_EMAIL_DE_LOGIN_AQUI', 'administrador')
-- on conflict (email) do update set perfil='administrador';
