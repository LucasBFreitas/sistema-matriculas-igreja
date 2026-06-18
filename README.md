# Sistema de Matrículas - Versão 12.0.7

## V12.0.7 – Ajuste em Inscrições Canceladas

Alterações implementadas:

- Quando a inscrição está com status `cancelada`, o botão **Cancelar inscrição** não aparece mais.
- Quando a inscrição está cancelada, o botão **Renovar** passa a aparecer como **Reativar**.
- Não precisa rodar SQL novo.

## Como atualizar

1. Substitua os arquivos:
   - `src/main.jsx`
   - `src/styles.css`
2. Faça commit no GitHub.
3. Aguarde o deploy da Vercel.
