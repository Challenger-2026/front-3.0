import type { ComplementoUsuario } from '../types/types';

// Bio e interesses não existem na API Java; ficam fixos aqui, pelo id do usuário
export const complementosUsuario: Record<number, ComplementoUsuario> = {
  1: { bio: 'Composteira em casa e bike no dia a dia.', interesses: ['Resíduos e reciclagem', 'Mobilidade urbana'] },
  2: { bio: 'Criador do Pedala Sampa. Bike todo dia.', interesses: ['Mobilidade urbana', 'Consumo consciente'] },
  3: { bio: 'Modero mutirões e cuido de nascentes.', interesses: ['Natureza e reflorestamento', 'Água'] },
  4: { bio: 'Mutirões de limpeza nos fins de semana.', interesses: ['Natureza e reflorestamento'] },
  5: { bio: 'Feira orgânica e zero desperdício.', interesses: ['Alimentação sustentável'] },
  6: { bio: 'Educação ambiental em escolas públicas.', interesses: ['Energia', 'Água', 'Educação ambiental'] },
};