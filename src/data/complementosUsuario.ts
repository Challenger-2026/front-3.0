import type { ComplementoUsuario } from '../types/types';

// Bio, interesses e respostas do onboarding não existem na API Java; ficam fixos aqui, pelo id do usuário
// (a anacarol fica sem momento/objetivo para mostrar o convite do "Para você")
export const complementosUsuario: Record<number, ComplementoUsuario> = {
  1: { bio: 'Composteira em casa e bike no dia a dia.', interesses: ['Resíduos e reciclagem', 'Mobilidade urbana'] },
  2: {
    bio: 'Criador do Pedala Sampa. Bike todo dia.',
    interesses: ['Mobilidade urbana', 'Consumo consciente'],
    momento: 'mobilizador',
    objetivo: 'comunidade',
  },
  3: {
    bio: 'Modero mutirões e cuido de nascentes.',
    interesses: ['Natureza e reflorestamento', 'Água'],
    momento: 'mobilizador',
    objetivo: 'impacto',
  },
  4: {
    bio: 'Mutirões de limpeza nos fins de semana.',
    interesses: ['Natureza e reflorestamento', 'Resíduos e reciclagem'],
    momento: 'praticante',
    objetivo: 'pontos',
  },
  5: {
    bio: 'Feira orgânica e zero desperdício.',
    interesses: ['Alimentação sustentável', 'Consumo consciente', 'Resíduos e reciclagem'],
    momento: 'iniciante',
    objetivo: 'habitos',
  },
  6: {
    bio: 'Educação ambiental em escolas públicas.',
    interesses: ['Energia', 'Água', 'Educação ambiental'],
    momento: 'estudante',
    objetivo: 'impacto',
  },
};