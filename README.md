# Sistema de Matrículas - Versão 4

Correções:
- Após editar/salvar, os dados recarregam imediatamente.
- Menus: Painel, Estudantes, Professores, Cursos, Turmas, Inscrições e Relatórios.
- Correção de “voltas” e “nova virada” para Turmas.
- Status padronizados: Matriculado, Não matriculado, Inativo e Excluído.
- Cores: Matriculado verde, Não matriculado laranja, Inativo amarelo, Excluído vermelho.
- Exclusão de aluno agora é lógica: o aluno fica com status Excluído.

## Como atualizar
1. No Supabase, rode `supabase/atualizacao_v4.sql`.
2. Substitua os arquivos no GitHub.
3. Aguarde a Vercel publicar automaticamente ou faça Redeploy.


## Versão 5

Correção visual dos badges de status dos alunos:

- Matriculado: fundo verde claro (#DCFCE7) e texto verde escuro (#166534)
- Sem matrícula: fundo amarelo claro (#FEF3C7) e texto amarelo escuro (#92400E)
- Inativo: fundo vermelho claro (#FEE2E2) e texto vermelho escuro (#991B1B)
- Excluído: fundo vermelho forte (#DC2626) e texto branco (#FFFFFF)

Também ajusta o texto do status de "Não matriculado" para "Sem matrícula".


## Versão 6

Atualização visual:
- Logo Viva Esperança adicionada.
- Cabeçalho moderno com capa/hero nas cores do projeto.
- Botões arredondados e com gradiente.
- Cards, formulários e listas mais modernos.
- Tela de login personalizada com a logo.
- Mantém as cores dos status de alunos.


## Versão 7

Layout ajustado conforme referência enviada:
- Tela de login com logo centralizada no topo.
- Texto abaixo da logo: Projeto Viva Esperança.
- Cabeçalho interno mais limpo, com logo pequena à esquerda.
- Menu horizontal branco com indicador azul.
- Cards e formulários com visual mais leve e profissional.
- Campos com fundo verde bem claro.
- Lista de estudantes com visual mais organizado.


## Versão 8

Correções solicitadas:
- Tela de login com logo preenchendo o círculo, sem borda/parte escura.
- Texto abaixo da logo: Projeto Viva Esperança.
- Removido "Projeto Social da Igreja" da tela de login.
- Título da tela de login: Bem-vindo de volta.
- Frase abaixo: Acesse sua conta para gerenciar as inscrições.
- Ajuste de espaçamento entre e-mail e senha.
- Após login, botão Sair posicionado no canto superior direito.
- Cabeçalho superior trocado para Viva esperança.
- Removido "Projeto Social da Igreja" do cabeçalho após login.


## Versão 9

Correção do cabeçalho após login:
- Botão Sair voltou a ficar visível no canto superior direito.
- Nome Viva Esperança visível no canto superior esquerdo.
- Logo pequena visível ao lado do nome.
- Removido Projeto Social da Igreja do cabeçalho.
- Mantidas as melhorias da tela de login.


## Versão 10

Alterações:
- Substituída a logo pela nova versão limpa enviada.
- A logo aparece na tela de login e no cabeçalho após login.
- O texto "Viva Esperança" do cabeçalho agora usa imagem recortada da própria marca, preservando fonte e cores.
- Mantido o botão Sair visível no canto superior direito.
- Texto abaixo da logo no login: Projeto Viva Esperança.


## Versão 11

Alterações:
- Tela de login: "Inscrições" alterado para "Bem-vindo de volta".
- Frase abaixo do título: "Acesse para gerenciar suas matrículas".
- Espaçamento entre e-mail e senha.
- Turmas: campos para período das aulas, férias, recomeço e encerramento.
- Turmas: exibição de vagas totais, ocupadas e disponíveis.
- Renovar matrícula: pergunta para qual período o aluno está sendo matriculado/renovado.
- Inscrições: botão "Cancelar inscrição" some quando a matrícula já está cancelada.

IMPORTANTE:
Antes de subir esta versão, rode no Supabase:
supabase/atualizacao_v11.sql

## Versão 11.1

Alteração controlada a partir da versão 11.

### Controle de Vagas

- Reformulado o campo de número de vagas em Turmas.
- Agora o sistema mostra:
  - Vagas totais
  - Vagas ocupadas
  - Vagas disponíveis
- Quando a turma atinge o limite de vagas, novas inscrições são bloqueadas.
- No cadastro de inscrições, turmas lotadas aparecem desabilitadas.

### Duração do Semestre

- Adicionados campos com calendário dentro de Turmas:
  - Data de início do semestre
  - Data de término do semestre

### Banco de Dados

Antes de subir essa versão, rode no Supabase:

supabase/atualizacao_v11_1.sql


## Versão 12 UI Premium
- Modernização visual inicial.
- Cards e formulários renovados.
- Paleta Viva Esperança.


## Versão 12.2 UI Premium

Melhorias visuais aplicadas sem alterar banco de dados ou regras de negócio:

- Tela de login premium em duas colunas.
- Área visual com logo Viva Esperança e mensagem institucional.
- Card de login moderno.
- Cabeçalho fixo com logo, marca, usuário administrador e botão Sair.
- Navegação horizontal moderna com ícones.
- Cards do painel com visual premium.
- Formulários, botões, listas e tabelas modernizados.
- Responsividade melhorada para celular.
