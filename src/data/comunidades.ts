import type {
  Comunidade,
  ComplementoComunidade,
  ComplementoUsuario,
  Missao,
  PeriodoMeta,
  PlanoComunidade,
  Postagem,
  Usuario,
} from '../types/types';
import { buscarCategoriaPorPontos } from './categorias';

// ===== Complementos das comunidades (demonstração: a API não tem esses campos) =====

// Temas com os mesmos labels do onboarding, para cruzar com os interesses do usuário
export const complementosComunidadeIniciais: Record<number, ComplementoComunidade> = {
  1: { temas: ['Resíduos e reciclagem', 'Consumo consciente'], plano: 'Premium', verificada: true },
  2: { temas: ['Mobilidade urbana'], plano: 'Free', verificada: false },
  3: { temas: ['Natureza e reflorestamento', 'Educação ambiental'], plano: 'Free', verificada: false },
  4: { temas: ['Água', 'Energia'], plano: 'Free', verificada: false },
  5: {
    temas: ['Natureza e reflorestamento', 'Água'],
    plano: 'Premium',
    verificada: true,
    parceriaProposta: true,
    organizacao: 'SOS Mata Atlântica',
  },
  6: {
    temas: ['Natureza e reflorestamento', 'Energia'],
    plano: 'Premium',
    verificada: true,
    parceriaProposta: true,
    organizacao: 'Greenpeace Brasil',
  },
  7: {
    temas: ['Natureza e reflorestamento', 'Consumo consciente'],
    plano: 'Free',
    verificada: true,
    parceriaProposta: true,
    organizacao: 'WWF-Brasil',
  },
};

// Comunidade sem complemento (ex.: criada direto na API) aparece como Free, sem temas
const COMPLEMENTO_PADRAO: ComplementoComunidade = { temas: [], plano: 'Free', verificada: false };

export const complementoDe = (id: number, complementos: Record<number, ComplementoComunidade>) =>
  complementos[id] ?? COMPLEMENTO_PADRAO;

export const PLANOS: { plano: PlanoComunidade; itens: string[] }[] = [
  { plano: 'Free', itens: ['Comunidade verificada', 'Ranking próprio', 'Até 1 benefício ativo no catálogo'] },
  {
    plano: 'Premium',
    itens: [
      'Tudo do Free',
      'Benefícios ilimitados',
      'Destaque na descoberta de comunidades',
      'Painel de impacto (membros ativos, ações aprovadas, CO₂ evitado)',
    ],
  },
];

// Premium primeiro (destaque na descoberta); dentro do mesmo plano, pelo id
export const ordenarPorPlano = (comunidades: Comunidade[], complementos: Record<number, ComplementoComunidade>) =>
  [...comunidades].sort((a, b) => {
    const premiumA = complementoDe(a.id, complementos).plano === 'Premium' ? 1 : 0;
    const premiumB = complementoDe(b.id, complementos).plano === 'Premium' ? 1 : 0;
    return premiumB - premiumA || a.id - b.id;
  });

// Mesma regra do validarDono do Java: só o usuário criador administra a comunidade
export const ehDono = (comunidade: Comunidade, usuario: Usuario | null) =>
  usuario !== null && comunidade.idUsuarioCriador === usuario.id;

// Painel de impacto do plano Premium (demonstração). A postagem da API não tem data,
// então os números são desde a criação da comunidade, e não "deste mês" como no protótipo
export const painelImpacto = (idComunidade: number, postagens: Postagem[]) => {
  const daComunidade = postagens.filter((p) => p.idComunidade === idComunidade);
  const aprovadas = daComunidade.filter((p) => p.stValidacao === 'APROVADO');
  return {
    membrosAtivos: new Set(daComunidade.map((p) => p.idUsuario)).size,
    acoesAprovadas: aprovadas.length,
    co2: aprovadas.reduce((total, p) => total + (buscarCategoriaPorPontos(p.ptGerado)?.co2Kg ?? 0), 0),
  };
};

// ===== Missões (demonstração: a API não tem essa tabela) =====

export const missoesIniciais: Missao[] = [
  {
    id: 1,
    idComunidade: 1,
    titulo: 'Semana da composteira',
    descricao:
      'Monte ou mantenha sua composteira por uma semana. Registre com uma foto da composteira e conte quanto resíduo desviou do aterro.',
    impacto: 'ESTRUTURAL',
    encerrada: false,
    criadaEm: '2026-10-12',
  },
  {
    id: 2,
    idComunidade: 1,
    titulo: 'Feira sem plástico',
    descricao: 'Vá à feira com sacolas e potes reutilizáveis. Registre com uma foto das compras sem embalagens plásticas.',
    impacto: 'ROTINA',
    encerrada: false,
    criadaEm: '2026-10-14',
  },
  {
    id: 3,
    idComunidade: 5,
    titulo: 'Mutirão de plantio de nativas',
    descricao:
      'Participe de um mutirão e plante ao menos uma muda nativa da Mata Atlântica. Registre com foto da muda plantada e o local.',
    impacto: 'CRITICO',
    prazo: '2026-11-15',
    encerrada: false,
    criadaEm: '2026-10-05',
  },
];

// ===== Para você (sugestões a partir do onboarding) =====

// Quantos temas da lista estão nos interesses do usuário
const afinidade = (temas: string[], interesses: string[]) => temas.filter((t) => interesses.includes(t)).length;

// Comunidades de que o usuário ainda não participa, com temas em comum (mais afinidade primeiro)
export const comunidadesSugeridas = (
  interesses: string[],
  comunidades: Comunidade[],
  idsMinhas: number[],
  complementos: Record<number, ComplementoComunidade>,
) =>
  comunidades
    .filter((c) => !idsMinhas.includes(c.id))
    .map((c) => ({ comunidade: c, afinidade: afinidade(complementoDe(c.id, complementos).temas, interesses) }))
    .filter((s) => s.afinidade > 0)
    .sort((a, b) => b.afinidade - a.afinidade || a.comunidade.id - b.comunidade.id)
    .map((s) => s.comunidade);

// Pessoas com interesses em comum (mais afinidade primeiro; empate: mais pontos)
export const pessoasSugeridas = (
  interesses: string[],
  usuarios: Usuario[],
  complementos: Record<number, ComplementoUsuario>,
  idUsuario: number,
) =>
  usuarios
    .filter((u) => u.id !== idUsuario)
    .map((u) => {
      const comum = (complementos[u.id]?.interesses ?? []).filter((t) => interesses.includes(t));
      return { usuario: u, temasEmComum: comum };
    })
    .filter((s) => s.temasEmComum.length > 0)
    .sort((a, b) => b.temasEmComum.length - a.temasEmComum.length || b.usuario.sdPonto - a.usuario.sdPonto);

// Missões ativas das comunidades ligadas aos temas do usuário
export const missoesPorTemas = (
  interesses: string[],
  comunidades: Comunidade[],
  complementos: Record<number, ComplementoComunidade>,
  missoes: Missao[],
) => {
  const ids = comunidades
    .filter((c) => afinidade(complementoDe(c.id, complementos).temas, interesses) > 0)
    .map((c) => c.id);
  return missoes.filter((m) => !m.encerrada && ids.includes(m.idComunidade));
};

// Duração de meta sugerida pelo momento escolhido no onboarding
export const duracaoMetaSugerida = (momento: string | undefined): PeriodoMeta => {
  if (momento === 'iniciante') return 7;
  if (momento === 'praticante') return 15;
  return 30;
};