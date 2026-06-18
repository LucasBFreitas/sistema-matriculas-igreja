# Sistema de Matrículas - Versão 12.0.8

## V12.0.8 – Zona automática no cadastro de alunos

Alterações implementadas:

- Adicionado campo `Zona` no cadastro de alunos.
- A Zona é definida automaticamente conforme o bairro informado.
- Ao buscar o CEP, o sistema preenche bairro, cidade, logradouro e também a Zona.
- Se o bairro não estiver na lista de Natal/RN, a Zona recebe a mesma informação da Cidade.
- A Zona aparece na listagem dos alunos.

## Banco de dados

Antes de subir esta versão, rode no Supabase:

`supabase/atualizacao_v12_0_8.sql`
