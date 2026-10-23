import type { Beneficio, ComplementoComunidade, Comunidade, Resgate } from '../types/types';
import { complementoDe } from './comunidades';

// ===== Benefícios e resgates (demonstração: a API não tem as tabelas de benefício, parceiro e resgate) =====

// Catálogo do protótipo: empresas parceiras e ONGs com parceria proposta
export const beneficios: Beneficio[] = [
  { id: 1, tipo: 'Cupom', nome: '20% off na loja a granel', custo: 60, parceiro: 'Granel Bom', area: 'Alimentação sustentável', ong: false },
  { id: 2, tipo: 'Doação', nome: 'Plantio de 1 muda em seu nome', custo: 40, parceiro: 'ONG Refloresta', area: 'Reflorestamento', ong: false },
  { id: 3, tipo: 'Assinatura', nome: '1 mês de bike compartilhada', custo: 120, parceiro: 'MoveBike', area: 'Mobilidade urbana', ong: false },
  { id: 4, tipo: 'Produto', nome: 'Kit copo + canudo de inox', custo: 180, parceiro: 'Ecolar', area: 'Utensílios reutilizáveis', ong: false },
  { id: 5, tipo: 'Experiência', nome: 'Trilha guiada na Mata Atlântica', custo: 260, parceiro: 'ONG Trilha Viva', area: 'Educação ambiental', ong: false },
  { id: 6, tipo: 'Doação', nome: 'Plantio de uma muda nativa em seu nome', custo: 45, parceiro: 'SOS Mata Atlântica', area: 'Reflorestamento', ong: true },
  { id: 7, tipo: 'Experiência', nome: 'Visita guiada a uma reserva', custo: 300, parceiro: 'SOS Mata Atlântica', area: 'Educação ambiental', ong: true },
  { id: 8, tipo: 'Doação', nome: 'Doação para proteção dos oceanos', custo: 80, parceiro: 'Greenpeace Brasil', area: 'Oceanos', ong: true },
  { id: 9, tipo: 'Experiência', nome: 'Oficina online de ativismo climático', custo: 150, parceiro: 'Greenpeace Brasil', area: 'Clima', ong: true },
  { id: 10, tipo: 'Doação', nome: 'Adoção simbólica de uma onça-pintada', custo: 200, parceiro: 'WWF-Brasil', area: 'Fauna', ong: true },
];

export const buscarBeneficio = (id: number) => beneficios.find((b) => b.id === id);

// Parceiros na ordem da tela de benefícios: ONGs primeiro
const nomesParceiros = [...new Set(beneficios.map((b) => b.parceiro))];
const ehOng = (parceiro: string) => beneficios.some((b) => b.parceiro === parceiro && b.ong);
export const parceiros = [...nomesParceiros.filter(ehOng), ...nomesParceiros.filter((p) => !ehOng(p))];

// Resgates que já existem ao abrir o simulador, por id de usuário
export const resgatesIniciais: Record<number, Resgate[]> = {
  1: [{ id: 1, codigo: 'SU-4KJ9-2Q7A', status: 'Concluído', idBeneficio: 2, custo: 40, data: '2025-07-19' }],
};

// Soma dos pontos já usados em resgates
export const totalResgatado = (resgates: Resgate[]) => resgates.reduce((total, r) => total + r.custo, 0);

// Código de acompanhamento: SU- e dois blocos de 4 letras ou números
export const gerarCodigoResgate = () => {
  const bloco = () => Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, '0');
  return `SU-${bloco()}-${bloco()}`;
};

// Benefícios das ONGs cujas comunidades têm temas em comum com o usuário (Para você, objetivo 'pontos')
export const beneficiosOngPorTemas = (
  interesses: string[],
  comunidades: Comunidade[],
  complementos: Record<number, ComplementoComunidade>,
) => {
  const organizacoes = comunidades
    .map((c) => complementoDe(c.id, complementos))
    .filter((c) => c.organizacao && c.temas.some((t) => interesses.includes(t)))
    .map((c) => c.organizacao);
  return beneficios.filter((b) => b.ong && organizacoes.includes(b.parceiro)).sort((a, b) => a.custo - b.custo);
};

// Carteira: pontos que o usuário "já ganhou hoje" (a postagem não tem data na API)
export const GANHOS_HOJE_DEMO = 6.6;