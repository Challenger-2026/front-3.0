const MENSAGEM_SEM_CONEXAO = 'Não foi possível conectar ao Soul Up. Verifique se a API está rodando.';

// Falha de conexão (TypeError do fetch) vira a mensagem padrão; erro da API mantém a mensagem dela
export const mensagemDoErro = (err: unknown) =>
  err instanceof Error && !(err instanceof TypeError) ? err.message : MENSAGEM_SEM_CONEXAO;