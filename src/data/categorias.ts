import type { Categoria, CategoriaId } from '../types/types';

export const categorias: Categoria[] = [
  { id: 'critico', nome: 'Impacto Crítico', pontosAcao: 10.6, co2Kg: 7 },
  { id: 'estrutural', nome: 'Impacto Estrutural', pontosAcao: 6.6, co2Kg: 3 },
  { id: 'rotina', nome: 'Impacto de Rotina', pontosAcao: 1.6, co2Kg: 0.6 },
];

export const buscarCategoria = (id: CategoriaId) => categorias.find((c) => c.id === id);

// A API só devolve ptGerado; a categoria é deduzida pelos pontos (10.6 / 6.6 / 1.6)
export const buscarCategoriaPorPontos = (ptGerado: number) => categorias.find((c) => c.pontosAcao === ptGerado);