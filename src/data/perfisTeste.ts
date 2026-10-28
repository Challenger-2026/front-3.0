import type { PerfilTeste } from '../types/types';

// Senha de todos os usuários do db.json (a API Java usa a mesma carga de teste)
export const SENHA_TESTE = 'soulup123';

export const perfisTeste: PerfilTeste[] = [
  { username: 'anacarol', demonstra: 'Contestação de rejeição e o 409 do Criador' },
  { username: 'brunot', demonstra: 'Criador de comunidades' },
  { username: 'carlam', demonstra: 'Reputação 88: fila sem as comunidades dela' },
  { username: 'helenap', demonstra: 'Reputação 96: revisa contestações' },
  { username: 'diegoa', demonstra: 'Elegível: passa na candidatura a moderador' },
  { username: 'dudalopes', demonstra: 'Não elegível (taxa de rejeição de 50%)' },
];