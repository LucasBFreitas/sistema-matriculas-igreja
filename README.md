# Sistema de Matrículas - V12.2.1

## Limpeza da tela de Turmas

Alterações implementadas:

- Removido o campo **Dias e horários** da tela Nova Turma.
- Removido o campo **Período** da tela Nova Turma.
- Removido o campo **Início do semestre** da tela Nova Turma.
- Removido o campo **Término do semestre** da tela Nova Turma.
- A definição de período agora deve ser feita apenas na aba **Períodos**.
- A tela de Turmas fica focada apenas em:
  - Curso
  - Professor
  - Nome da turma
  - Número de vagas

## Banco de dados

Não precisa rodar SQL novo.


## V12.2.3 – Correção de index.html e limpeza definitiva de Turmas

Correções:

- Restaurado `index.html` correto do React/Vite.
- Removida mensagem SQL/texto solto que aparecia no topo do sistema.
- Removidos definitivamente da tela Nova Turma:
  - Período
  - Início do semestre
  - Término do semestre
  - Dias e horários, caso ainda existisse.
- Removida a linha Semestre da listagem de turmas.
- `package.json` restaurado para o padrão correto do projeto.

Banco de dados:

- Não precisa rodar SQL novo.


## V12.2.4 – Renovação e Reativação com Período

Implementado:

- Ao clicar em **Renovar**, abre um pop-up.
- Ao clicar em **Reativar**, abre o mesmo pop-up.
- O usuário escolhe para qual **Período letivo** a inscrição será enviada.
- O usuário pode manter o mesmo curso/turma.
- Se não quiser manter, pode escolher outra turma.
- O sistema valida vagas da turma no período escolhido.
- O botão Reativar continua aparecendo para inscrições canceladas.
- O botão Cancelar inscrição não aparece quando a inscrição já está cancelada.

Banco de dados:

- Não precisa rodar SQL novo se a V12.2.0 já foi aplicada.


## V12.2.5 – Correção da rotina Reativar

Correção implementada:

- A rotina **Reativar** não tenta mais salvar o status `reativada`.
- O banco não aceitava esse valor por causa da regra `matriculas_status_check`.
- Agora, ao reativar, o sistema salva o status como `renovada`, que já é aceito pela estrutura atual.
- A rotina **Renovar** não foi alterada.

Banco de dados:

- Não precisa rodar SQL novo.


## V12.2.6 – Busca em Inscrições

Implementado:

- Campo de pesquisa na aba **Inscrições**.
- A busca filtra por:
  - Nome do aluno
  - Curso
  - Turma
  - Professor
  - Período letivo
  - Status da inscrição
- Exibe mensagem quando nenhuma inscrição for encontrada.

Banco de dados:

- Não precisa rodar SQL novo.


## V12.2.7 – Ações por status do aluno

Implementado:

- Quando o aluno estiver **Inativo**, aparece apenas o botão **Ativar**.
- Quando o aluno estiver **Excluído**, aparece apenas o botão **Ativar**.
- Para alunos ativos, continuam disponíveis:
  - Editar
  - Inativar
  - Excluir

Banco de dados:

- Não precisa rodar SQL novo.


## V12.2.8 – Restauração do Dashboard Inteligente

Correção implementada:

- Restaurado o layout do **Dashboard Inteligente**.
- Restaurado card de visão gerencial com ocupação geral.
- Restaurados cards modernos:
  - Alunos ativos
  - Matrículas ativas
  - Turmas cadastradas
  - Vagas disponíveis
- Restaurada seção **Ocupação das turmas**.
- Restaurada seção **Indicadores de vagas**.

Banco de dados:

- Não precisa rodar SQL novo.


## V12.3.0 – Controle de Presença

Implementado:

- Nova aba **Presenças**.
- Seleção de:
  - Período letivo
  - Turma
  - Data da chamada
- Lista os alunos matriculados na turma/período.
- Botões:
  - Presente
  - Faltou
- Salva a lista de presença.
- Relatórios agora têm coluna **Presenças** com o total de presenças do aluno.

SQL obrigatório:

Rode `supabase/atualizacao_v12_3_0.sql` no Supabase antes de subir a versão.


## V12.3.1 – Histórico de Listas de Presença

Implementado:

- As listas de presença salvas agora ficam visíveis na aba **Presenças**.
- Cada lista mostra:
  - Turma
  - Período
  - Data
  - Total de alunos
  - Presentes
  - Faltas
- Botão **Abrir / Editar** para carregar uma lista salva.
- Botão **Excluir lista** para remover uma lista de presença.
- Ao abrir uma lista, a chamada volta para edição.
- Ao salvar uma lista aberta, ela é atualizada.

Banco de dados:

- Não precisa rodar SQL novo.


## V12.3.2 – Correção da lista de chamada

Correção implementada:

- A aba **Presenças** agora lista corretamente todas as matrículas válidas da turma e período selecionados.
- A chamada não oculta mais alunos indevidamente por causa de filtros de status do cadastro do aluno.
- A lista da chamada agora é ordenada por nome do aluno.
- Mantida a regra de não listar matrículas canceladas.

Banco de dados:

- Não precisa rodar SQL novo.
