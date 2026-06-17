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
