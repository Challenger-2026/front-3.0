import type { CategoriaId, ProcessoAutomatico, ReferenciaCo2 } from '../types/types';
import { diasParaFimDaSemana, TOP_DISTINTIVO, ZONA_TAMANHO } from './liga';
import { DIAS_INATIVIDADE_MODERADOR } from './moderacao';

// ===== Parâmetros de pontuação (demonstração: a API não tem tabela de parâmetros) =====

// De onde vem o fator de CO₂ de cada categoria (os valores ficam no co2Kg do categorias.ts)
export const REFERENCIAS_CO2: Record<CategoriaId, ReferenciaCo2> = {
  critico: {
    acao: 'Plantio de 1 árvore nativa da Mata Atlântica',
    premissa:
      'Sequestra cerca de 140 kg de CO₂e em 20 anos (valor conservador); conta 1/20 (um ano) por ação aprovada.',
    fonte: 'Estudo ESALQ/USP publicado na revista Metrvm.',
  },
  estrutural: {
    acao: 'Compostagem de 5 kg de resíduo orgânico em vez de enviá-lo ao aterro',
    premissa: 'Cerca de 0,6 kg de CO₂e evitado por kg compostado.',
    fonte:
      'Inácio, Bettio e Miller, “Potencial de mitigação de emissões de metano via projetos de compostagem de pequena escala”, Embrapa.',
  },
  rotina: {
    acao: 'Trocar 5 km de carro por bicicleta ou caminhada',
    premissa: 'O automóvel emite cerca de 0,127 kg de CO₂ por passageiro-km.',
    fonte:
      'Carvalho, “Emissões relativas de poluentes do transporte urbano”, Ipea, Boletim Regional, Urbano e Ambiental nº 5, 2011.',
  },
};

// ===== Temporizador (demonstração: a API não tem agendador) =====

// Processos periódicos e a data da próxima execução
export const processosAutomaticos = (hoje = new Date()): ProcessoAutomatico[] => {
  const fimSemana = new Date(hoje);
  fimSemana.setDate(hoje.getDate() + diasParaFimDaSemana(hoje));
  fimSemana.setHours(23, 59, 0, 0);
  const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59);
  const amanha = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1, 3, 0);

  return [
    {
      id: 'liga',
      nome: 'Fechamento da liga semanal',
      frequencia: 'Semanal · domingo 23h59',
      descricao: `Top ${ZONA_TAMANHO} sobem, últimos ${ZONA_TAMANHO} descem de divisão.`,
      proximaExecucao: fimSemana,
    },
    {
      id: 'distintivo',
      nome: 'Entrega do distintivo mensal',
      frequencia: 'Mensal · último dia 23h59',
      descricao: `Top ${TOP_DISTINTIVO} do mês recebem o distintivo.`,
      proximaExecucao: fimMes,
    },
    {
      id: 'inatividade',
      nome: 'Verificação de inatividade de moderação',
      frequencia: 'Diária · 03h00',
      descricao: `Quem modera e fica ${DIAS_INATIVIDADE_MODERADOR} dias sem moderar volta ao perfil Comum.`,
      proximaExecucao: amanha,
    },
  ];
};