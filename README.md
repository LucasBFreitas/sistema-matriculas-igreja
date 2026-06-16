# Sistema Web de Matrículas - Projeto Social da Igreja

Sistema gratuito e simples para cadastro e renovação de matrículas em cursos de um projeto social.

## Funcionalidades

- Login de administrador pelo Supabase Auth
- Cadastro de alunos
- Cadastro de responsáveis
- Cadastro de cursos
- Cadastro de turmas
- Matrícula em curso/turma
- Renovação de matrícula
- Cancelamento de matrícula
- Histórico de matrículas
- Relatórios simples por status, curso e turma

## Tecnologias

- React
- Vite
- Supabase
- PostgreSQL

## Como criar o banco no Supabase

1. Acesse o Supabase e crie um projeto gratuito.
2. Vá em **SQL Editor**.
3. Abra o arquivo `supabase/schema.sql`.
4. Cole todo o conteúdo e clique em **Run**.
5. Vá em **Authentication > Users**.
6. Crie um usuário administrador com e-mail e senha.
7. Vá em **Project Settings > API**.
8. Copie:
   - Project URL
   - anon public key

## Como rodar localmente

Instale o Node.js.

Depois, no terminal:

```bash
npm install
```

Crie o arquivo `.env` copiando o `.env.example`:

```bash
cp .env.example .env
```

No Windows, se o comando acima não funcionar, copie manualmente o arquivo `.env.example` e renomeie para `.env`.

Preencha:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA
```

Rode:

```bash
npm run dev
```

Abra o endereço que aparecer no terminal.

## Como publicar gratuitamente

Opção simples: Vercel ou Netlify.

### Vercel

1. Suba este projeto para o GitHub.
2. Acesse a Vercel.
3. Importe o repositório.
4. Configure as variáveis de ambiente:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
5. Clique em Deploy.

### Netlify

1. Suba o projeto para o GitHub.
2. Acesse a Netlify.
3. Importe o repositório.
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Configure as variáveis de ambiente.
7. Clique em Deploy.

## Observação importante sobre segurança

Este MVP libera acesso total às tabelas para qualquer usuário autenticado. Para uso real, crie apenas usuários administrativos confiáveis no Supabase Auth.

Não coloque documentos pessoais sensíveis sem revisar a política de segurança e a LGPD.
