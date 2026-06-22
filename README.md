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


## V12.3.3 – Seleção visual de presença

Implementado:

- Melhor destaque visual ao marcar **Presente**.
- Melhor destaque visual ao marcar **Faltou**.
- O card do aluno muda de aparência conforme a escolha.
- O botão selecionado ganha ícone:
  - ✓ Presente
  - ✕ Faltou
- Adicionado aviso visual no card:
  - Aluno marcado como PRESENTE
  - Aluno marcado como FALTOU

Banco de dados:

- Não precisa rodar SQL novo.


## V12.3.4 – Mensagens em Toast

Implementado:

- Mensagens de sucesso e erro agora aparecem em formato **toast flutuante**.
- O toast aparece no canto superior direito.
- Some automaticamente após alguns segundos.
- As mensagens não ocupam mais espaço no layout da página.

Banco de dados:

- Não precisa rodar SQL novo.


## V12.3.5 – Limpeza definitiva das mensagens

Correção implementada:

- Removida a faixa antiga de mensagem no topo da página.
- Mensagens de sucesso e erro agora aparecem somente como **toast**.
- O toast continua sumindo automaticamente.
- O layout não é mais empurrado para baixo por mensagens fixas.

Banco de dados:

- Não precisa rodar SQL novo.


## V12.3.6 – Toast definitivo

Correção implementada:

- Remoção mais agressiva das mensagens antigas.
- Qualquer faixa antiga de mensagem fica oculta via CSS.
- Apenas o toast flutuante permanece visível.
- O toast continua sumindo automaticamente.

Banco de dados:

- Não precisa rodar SQL novo.


## V12.3.7 – Somente Toast

Correção implementada:

- Removida diretamente do `main.jsx` qualquer renderização antiga de `msg` e `erro`.
- Mantido apenas o toast flutuante.
- Adicionada proteção visual para ocultar qualquer mensagem antiga que esteja no fluxo da página.

Banco de dados:

- Não precisa rodar SQL novo.


## V12.3.8 – Rolagem interna das listas

Implementado:

- As listas do lado direito agora possuem rolagem própria.
- A página inteira não fica mais extremamente longa por causa das listas.
- Aplicado para módulos em duas colunas, como:
  - Estudantes
  - Professores
  - Cursos
  - Turmas
  - Inscrições
  - Presenças
  - Relatórios
- A barra de rolagem da lista tem visual personalizado.
- Título e campo de busca permanecem visíveis durante a rolagem da lista.

Banco de dados:

- Não precisa rodar SQL novo.


## V12.3.9 – Correção visual da rolagem

Correção implementada:

- Corrigida a sobreposição do título e do campo de busca nas listas.
- Mantida a rolagem interna no lado direito.
- Removido o comportamento fixo/sticky do título e da busca.
- A lista volta a aparecer organizada visualmente.

Banco de dados:

- Não precisa rodar SQL novo.


## V12.4.0 – Data destacada nas listas de presença

Implementado:

- A data da chamada agora aparece destacada no canto superior direito do card.
- A data aparece em formato brasileiro: DD/MM/AAAA.
- Removida a data da linha secundária para deixar a leitura mais limpa.
- As listas continuam ordenadas da mais recente para a mais antiga.

Banco de dados:

- Não precisa rodar SQL novo.


## V12.4.1 – Menu de módulos fixo

Implementado:

- A barra de módulos permanece fixa ao rolar a tela.
- O menu passa a se comportar como parte do navbar.
- Mantido o visual com fundo suave e sombra.
- Em telas menores, o menu pode rolar horizontalmente.

Banco de dados:

- Não precisa rodar SQL novo.


## V12.4.2 – Modal moderno para impressão de relatório

Implementado:

- Removido o prompt padrão do navegador ao imprimir relatório.
- Criado pop-up moderno no estilo do sistema.
- Opções:
  - Relatório Simplificado
  - Relatório Institucional
- Visual alinhado com as cores e identidade do sistema.
- Botão cancelar dentro do modal.

Banco de dados:

- Não precisa rodar SQL novo.


## V12.4.4 – Bloqueio real de matrícula por status

Correção implementada:

- Alunos inativos não aparecem mais no seletor da tela de Inscrições.
- Alunos excluídos não aparecem mais no seletor da tela de Inscrições.
- Mesmo que o aluno seja forçado no formulário, o salvamento da matrícula é bloqueado.
- Renovação/Reativação também bloqueia aluno com cadastro inativo ou excluído.
- Mensagem toast informa que o cadastro precisa ser ativado antes da matrícula.

Banco de dados:

- Não precisa rodar SQL novo.


## V12.4.5 – Padronização Alunos

Correções implementadas:

- Menu alterado de **Estudantes** para **Alunos**.
- Título da listagem alterado de **Estudantes** para **Alunos**.
- Card do Dashboard alterado de **Alunos ativos** para **Alunos cadastrados**.
- Contador do card **Alunos cadastrados** agora considera todos os alunos cadastrados:
  - Ativos
  - Matriculados
  - Sem matrícula
  - Inativos
  - Excluídos

Banco de dados:

- Não precisa rodar SQL novo.

## V12.5.1 – Controle de Acesso Estável

Correções:
- Refeito o controle de acesso de forma mais segura.
- Corrige tela branca ao clicar em abas como Professores.
- Nova aba **Acessos** para administradores.
- Perfis: Administrador, Coordenador e Professor.
- Badge superior mostra o perfil.
- Se a tabela de perfis ainda não existir, o sistema não quebra.

SQL obrigatório:
Rode `supabase/atualizacao_v12_5_1.sql`.

Depois cadastre seu e-mail como administrador na tabela `usuarios_perfis`.
