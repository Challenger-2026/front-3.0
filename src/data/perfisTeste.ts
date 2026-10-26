import type { PerfilTeste } from '../types/types';

// Senha de todos os usuários do db.json (a API Java usa a mesma carga de teste)
export const SENHA_TESTE = 'soulup123';

export const perfisTeste: PerfilTeste[] = [
  { username: 'anacarol', demonstra: 'Contestação de rejeição e o 409 do Criador na candidatura' },
  { username: 'brunot', demonstra: 'Criador de comunidades' },
  { username: 'carlam', demonstra: 'Moderadora (reputação 88): fila sem as comunidades dela' },
  { username: 'helenap', demonstra: 'Moderadora (reputação 96): revisa contestações' },
  { username: 'diegoa', demonstra: 'Comum elegível: passa na candidatura a moderador' },
  { username: 'dudalopes', demonstra: 'Comum não elegível (taxa de rejeição de 50%)' },
];