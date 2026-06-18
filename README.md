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
