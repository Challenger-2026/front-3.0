import type { ErroComStatus } from '../types/types';

const MENSAGEM_SEM_CONEXAO = 'Não foi possível conectar ao Soul Up. Verifique se a API está rodando.';

// Falha de conexão (TypeError do fetch) vira a mensagem padrão; erro da API mantém a mensagem dela
export const mensagemDoErro = (err: unknown) =>
  err instanceof Error && !(err instanceof TypeError) ? err.message : MENSAGEM_SEM_CONEXAO;

// 403 da API (ex.: fila de moderação para quem não é moderador)
export const ehAcessoNegado = (err: unknown) => err instanceof Error && (err as ErroComStatus).status === 403;