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
