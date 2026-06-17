-- Rode no Supabase SQL Editor uma única vez antes de atualizar o site.
alter table alunos add column if not exists cep text;
alter table alunos add column if not exists logradouro text;
alter table alunos add column if not exists numero text;
alter table alunos add column if not exists complemento text;
alter table alunos add column if not exists bairro text;
alter table alunos add column if not exists cidade text;
alter table alunos add column if not exists ativo boolean default true;
update alunos set ativo = true where ativo is null;
