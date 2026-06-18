alter table alunos add column if not exists sexo text;
alter table alunos add column if not exists possui_deficiencia text default 'Não';
alter table alunos add column if not exists qual_deficiencia text;
alter table alunos add column if not exists zona text;
