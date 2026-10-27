import type { AtributoComportamento, ClasseRisco, Explicacao, PerfilEngajamento } from '../types/types';

// Nome de cada comportamento no formulário (os campos seguem os nomes da API Python)
export const atributosIa: { campo: AtributoComportamento; nome: string; ajuda: string; opcional?: boolean }[] = [
  { campo: 'total_acoes', nome: 'Ações em 30 dias', ajuda: 'Ações sustentáveis registradas' },
  { campo: 'streak_maximo', nome: 'Maior sequência (dias)', ajuda: 'Dias seguidos com ação' },
  { campo: 'diversidade_categorias', nome: 'Categorias diferentes', ajuda: 'De 0 a 5' },
  { campo: 'pontos_totais', nome: 'Pontos no período', ajuda: 'Soma dos pontos das ações' },
  { campo: 'interacoes_sociais_media', nome: 'Interações por postagem', ajuda: 'Média de curtidas e comentários' },
  {
    campo: 'posicao_ranking_media',
    nome: 'Posição média no ranking',
    ajuda: 'Vazio: fora do ranking (a API usa 213)',
    opcional: true,
  },
  {
    campo: 'tempo_medio_entre_acoes_dias',
    nome: 'Dias entre ações (média)',
    ajuda: 'Vazio: 0 ou 1 ação (a API usa 30)',
    opcional: true,
  },
];

export const nomesAtributosIa = Object.fromEntries(atributosIa.map((a) => [a.campo, a.nome])) as Record<
  AtributoComportamento,
  string
>;

export const textosClasse: Record<ClasseRisco, string> = {
  engajado: 'Engajado',
  risco_abandono: 'Risco de abandono',
};

export const coresClasse: Record<ClasseRisco, string> = {
  engajado: 'bg-emerald-100 text-emerald-800',
  risco_abandono: 'bg-red-100 text-red-800',
};

export const coresPerfil: Record<PerfilEngajamento, string> = {
  Inativos: 'bg-stone-200 text-stone-800',
  Intermediários: 'bg-amber-100 text-amber-800',
  Engajados: 'bg-emerald-100 text-emerald-800',
};

// Endpoints da API Python usados nesta aba
export const endpointsIa = [
  { metodo: 'GET', rota: '/sortear', descricao: 'Sorteia um dos 50 usuários de teste, com o rótulo real' },
  {
    metodo: 'POST',
    rota: '/prever',
    descricao: 'Recebe os 7 comportamentos e devolve a classe, a probabilidade, o perfil e as orientações',
  },
];

export const explicacaoAdmin: Explicacao = {
  titulo: 'Admin: risco de abandono',
  descricao:
    'Visão da equipe da Lobo-guará Tech. A partir do comportamento dos primeiros 30 dias, a IA estima quem pode abandonar o Soul Up e sugere a ação de retenção mais adequada para cada pessoa.',
  destaques: [
    'Regressão Logística: classifica em engajado ou risco de abandono (86% de acurácia no teste, 87% na validação cruzada)',
    'K-Means: agrupa em Inativos, Intermediários e Engajados, sem usar o rótulo. O perfil define o tom da ação',
    'Orientações: os 2 comportamentos que mais aumentam o risco daquela pessoa, ligados a recursos do app',
    'Validado com dados reais (OULAD, Open University): a direção se confirma, mas a acurácia cai para 57%. Por isso o uso é de triagem, não de decisão',
  ],
};