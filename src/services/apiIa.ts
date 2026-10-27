import type { AtributosComportamento, PrevisaoRisco, UsuarioTeste } from '../types/types';
import { requisitar } from './http';

// Chamadas à API Python (Flask) com o modelo de risco de abandono.
// Passam pelo requisitar com api: 'ia', então também aparecem no painel de requisições ao vivo.
export const apiIa = {
  // GET /sortear — um dos 50 usuários de teste, com o rótulo real
  sortearUsuario: (): Promise<UsuarioTeste> =>
    requisitar<UsuarioTeste>('GET', '/sortear', { api: 'ia', mensagemErro: 'Erro ao sortear um usuário de teste' }),

  // POST /prever — classe, probabilidade de risco, perfil do K-Means e orientações de retenção
  preverRisco: (dados: AtributosComportamento): Promise<PrevisaoRisco> =>
    requisitar<PrevisaoRisco>('POST', '/prever', { api: 'ia', corpo: dados, mensagemErro: 'Erro ao prever o risco' }),
};