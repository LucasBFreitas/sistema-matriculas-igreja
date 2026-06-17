create extension if not exists "pgcrypto";
alter table alunos add column if not exists cep text;
alter table alunos add column if not exists logradouro text;
alter table alunos add column if not exists numero text;
alter table alunos add column if not exists complemento text;
alter table alunos add column if not exists bairro text;
alter table alunos add column if not exists cidade text;
alter table alunos add column if not exists ativo boolean default true;
update alunos set ativo = true where ativo is null;
create table if not exists professores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cpf text,
  telefone text,
  email text,
  ativo boolean default true,
  created_at timestamptz default now()
);
alter table turmas add column if not exists professor_id uuid references professores(id) on delete set null;
alter table professores enable row level security;
drop policy if exists "professores_auth_all" on professores;
create policy "professores_auth_all" on professores for all to authenticated using (true) with check (true);
