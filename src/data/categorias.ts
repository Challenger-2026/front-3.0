import type { Categoria, CategoriaId, Impacto } from '../types/types';

// Pontos iguais às constantes PONTOS_CRITICO / ESTRUTURAL / ROTINA do PostagemService
export const categorias: Categoria[] = [
  {
    id: 'critico',
    impacto: 'CRITICO',
    nome: 'Impacto Crítico',
    descricao: 'Ações de alto efeito imediato: mutirões, recuperação de nascentes, descarte de resíduos perigosos.',
    pontosAcao: 10.6,
    co2Kg: 7,
  },
  {
    id: 'estrutural',
    impacto: 'ESTRUTURAL',
    nome: 'Impacto Estrutural',
    descricao: 'Mudanças duradouras: compostagem, energia limpa, substituição de itens descartáveis.',
    pontosAcao: 6.6,
    co2Kg: 3,
  },
  {
    id: 'rotina',
    impacto: 'ROTINA',
    nome: 'Impacto de Rotina',
    descricao: 'Hábitos diários: transporte ativo, economia de água, consumo consciente.',
    pontosAcao: 1.6,
    co2Kg: 0.6,
  },
];

export const buscarCategoria = (id: CategoriaId) => categorias.find((c) => c.id === id);

// A API só devolve ptGerado; a categoria é deduzida pelos pontos (10.6 / 6.6 / 1.6)
export const buscarCategoriaPorPontos = (ptGerado: number) => categorias.find((c) => c.pontosAcao === ptGerado);


// Usado no json-server para imitar o calcularPontos do Java
export const buscarCategoriaPorImpacto = (impacto: Impacto) => categorias.find((c) => c.impacto === impacto);


// ===== Teto diário (só demonstração: o Java grava o ptGerado cheio) =====

export const TETO_DIARIO_PONTOS = 15;
export const REDUCAO_PROGRESSIVA = 0.5; // acima do teto, paga 50% do valor normal no 1º bloco
export const REDUCAO_MINIMA = 0.1; // por menor que fique, a ação sempre gera algum ponto

// Pontos de uma ação considerando quanto o usuário já ganhou no dia
export const aplicarTetoDiario = (pontosBase: number, ganhosHoje: number) => {
  const restante = Math.max(0, TETO_DIARIO_PONTOS - ganhosHoje);
  const parcelaCheia = Math.min(pontosBase, restante);
  const excedente = pontosBase - parcelaCheia;
  const blocosAcima = Math.floor(Math.max(0, ganhosHoje - TETO_DIARIO_PONTOS) / TETO_DIARIO_PONTOS) + 1;
  const fator = Math.max(REDUCAO_MINIMA, REDUCAO_PROGRESSIVA ** blocosAcima);
  return {
    pontos: Number((parcelaCheia + excedente * fator).toFixed(2)),
    fator: excedente > 0 ? fator : 1,
  };
};