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
