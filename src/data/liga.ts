import type {
  Distintivo,
  DistintivoConquistado,
  Divisao,
  IntervaloRanking,
  NotificacaoBase,
  ParticipanteRanking,
  Postagem,
  Usuario,
  Zona,
} from '../types/types';
import { formatarPontos } from '../utils/formatadores';

// ===== Ranking =====

export const INTERVALOS_RANKING: IntervaloRanking[] = ['Semanal', 'Mensal', 'Geral', 'Entre amigos'];

// Ordena do maior para o menor (empate: ordem alfabética do username)
const ordenar = (lista: ParticipanteRanking[]) =>
  [...lista].sort((a, b) => b.pontos - a.pontos || a.username.localeCompare(b.username));

// Geral (API): sem comunidade, o sdPonto de cada usuário.
// Com comunidade, a soma do ptGerado das postagens aprovadas nela (o logado aparece mesmo com 0).
export const rankingGeral = (
  usuarios: Usuario[],
  postagens: Postagem[],
  idUsuarioLogado: number,
  idComunidade: number | null,
): ParticipanteRanking[] => {
  if (idComunidade === null) {
    return ordenar(
      usuarios.map((u) => ({
        chave: String(u.id),
        username: u.username,
        pontos: u.sdPonto,
        eu: u.id === idUsuarioLogado,
      })),
    );
  }

  const aprovadas = postagens.filter((p) => p.idComunidade === idComunidade && p.stValidacao === 'APROVADO');
  const participantes = usuarios.filter(
    (u) => u.id === idUsuarioLogado || aprovadas.some((p) => p.idUsuario === u.id),
  );
  return ordenar(
    participantes.map((u) => ({
      chave: String(u.id),
      username: u.username,
      pontos: Math.round(
        aprovadas.filter((p) => p.idUsuario === u.id).reduce((total, p) => total + p.ptGerado, 0) * 100,
      ) / 100,
      eu: u.id === idUsuarioLogado,
    })),
  );
};

// Entre amigos (demonstração: a API não tem "seguir"): o logado e os 3 primeiros outros usuários, pelo sdPonto
export const QUANTIDADE_AMIGOS_DEMO = 3;

export const rankingEntreAmigos = (usuarios: Usuario[], idUsuarioLogado: number): ParticipanteRanking[] => {
  const amigos = usuarios.filter((u) => u.id !== idUsuarioLogado).slice(0, QUANTIDADE_AMIGOS_DEMO);
  const eu = usuarios.filter((u) => u.id === idUsuarioLogado);
  return ordenar(
    [...amigos, ...eu].map((u) => ({
      chave: String(u.id),
      username: u.username,
      pontos: u.sdPonto,
      eu: u.id === idUsuarioLogado,
    })),
  );
};

// ===== Liga semanal e disputa mensal (demonstração: a API não tem ranking nem data nas postagens) =====

export const DIVISOES: Divisao[] = ['Tatu', 'Tamanduá', 'Onça-pintada', 'Lobo-guará'];

export const EMOJI_DIVISAO: Record<Divisao, string> = {
  Tatu: '🛡️',
  Tamanduá: '🐜',
  'Onça-pintada': '🐆',
  'Lobo-guará': '🐺',
};

export const ZONA_TAMANHO = 3; // quantos sobem e quantos descem na liga
export const TOP_DISTINTIVO = 10; // quantos ganham o distintivo do mês

// Valores fixos da demonstração (os mesmos do protótipo)
export const DIVISAO_DEMO: Divisao = 'Tamanduá';
export const PONTOS_SEMANA_DEMO = 60.4; // zona de subida
export const PONTOS_MES_DEMO = 180; // dentro do top 10

// Zona de uma posição (começa em 0) numa liga de "total" participantes
export const zonaDaPosicao = (posicao: number, total: number, divisao: Divisao): Zona => {
  const nivel = DIVISOES.indexOf(divisao);
  if (posicao < ZONA_TAMANHO && nivel < DIVISOES.length - 1) return 'subida';
  if (posicao >= total - ZONA_TAMANHO && nivel > 0) return 'descida';
  return 'neutra';
};

// A liga fecha no domingo, 23h59
export const diasParaFimDaSemana = (hoje = new Date()) => {
  const diaDaSemana = hoje.getDay(); // 0 = domingo
  return diaDaSemana === 0 ? 0 : 7 - diaDaSemana;
};

// A disputa fecha no último dia do mês, 23h59
export const diasParaFimDoMes = (hoje = new Date()) => {
  const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
  return ultimoDia.getDate() - hoje.getDate();
};

// Nomes dos outros participantes (demonstração)
const USERNAMES_DEMO = [
  'biaverde', 'joaobike', 'lu_recicla', 'marcos.eco', 'tati_horta', 'pedrosolar', 'nina.agua',
  'rafa_mutirao', 'carol_zero', 'gui.composta', 'lia_semente', 'theo_trilha', 'manu_feira', 'davi.pedal',
  'sofi_nascente', 'enzo_luz', 'vivi.reuso', 'caio_mata', 'helo_jardim',
];

// Número "aleatório" entre 0 e 1 que é sempre o mesmo para o mesmo n (a lista não muda a cada tela)
const numeroFixo = (n: number) => {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

// Liga semanal: 14 participantes do mesmo nível + o usuário logado
export const participantesLiga = (username: string, meusPontos: number): ParticipanteRanking[] => {
  const outros = USERNAMES_DEMO.slice(0, 14).map((nome, i) => ({
    chave: `liga-${i}`,
    username: nome,
    pontos: Math.round((8 + numeroFixo(i + 1) * 60) * 10) / 10,
    eu: false,
  }));
  return ordenar([...outros, { chave: 'eu', username, pontos: meusPontos, eu: true }]);
};

// Disputa mensal: todos os participantes do mês + o usuário logado
export const participantesMes = (username: string, meusPontos: number): ParticipanteRanking[] => {
  const outros = USERNAMES_DEMO.map((nome, i) => ({
    chave: `mes-${i}`,
    username: nome,
    pontos: Math.round((40 + numeroFixo(i + 100) * 220) * 10) / 10,
    eu: false,
  }));
  return ordenar([...outros, { chave: 'eu', username, pontos: meusPontos, eu: true }]);
};

// Pontos que faltam para entrar no top 10 (0 se já está)
export const faltamParaTop = (lista: ParticipanteRanking[], top = TOP_DISTINTIVO) => {
  const posicao = lista.findIndex((p) => p.eu);
  if (posicao > -1 && posicao < top) return 0;
  const corte = lista.filter((p) => !p.eu)[top - 1]?.pontos ?? 0;
  const meus = lista[posicao]?.pontos ?? 0;
  return Math.round(Math.max(0, corte - meus + 0.1) * 10) / 10;
};

// ===== Distintivos mensais (demonstração) =====

export const FONTE_DISTINTIVOS = 'Lista Nacional de Espécies da Fauna Ameaçadas — Portaria MMA nº 1.704/2026';

export const DISTINTIVOS_ANO: Distintivo[] = [
  { mes: 'Janeiro', animal: 'Peixe-boi-marinho', status: 'Criticamente em perigo', emoji: '🐋', texto: 'Vive em estuários do Nordeste; sofre com redes de pesca e perda de manguezais.' },
  { mes: 'Fevereiro', animal: 'Muriqui-do-norte', status: 'Criticamente em perigo', emoji: '🐒', texto: 'Maior primata das Américas, depende de florestas contínuas da Mata Atlântica.' },
  { mes: 'Março', animal: 'Tartaruga-de-couro', status: 'Criticamente em perigo', emoji: '🐢', texto: 'Confunde sacolas plásticas com águas-vivas: reduzir plástico salva vidas.' },
  { mes: 'Abril', animal: 'Soldadinho-do-araripe', status: 'Criticamente em perigo', emoji: '🐦', texto: 'Ave que só existe na Chapada do Araripe (CE) e precisa de nascentes preservadas.' },
  { mes: 'Maio', animal: 'Tatu-bola', status: 'Em perigo', emoji: '🦔', texto: 'Se enrola como uma bola para se defender e perde espaço com o desmatamento da Caatinga e do Cerrado.' },
  { mes: 'Junho', animal: 'Mico-leão-dourado', status: 'Em perigo', emoji: '🐒', texto: 'Voltou a crescer graças a corredores florestais no Rio de Janeiro.' },
  { mes: 'Julho', animal: 'Onça-pintada', status: 'Vulnerável', emoji: '🐆', texto: 'Maior felino das Américas; queimadas no Pantanal reduziram seu território.' },
  { mes: 'Agosto', animal: 'Ararinha-azul', status: 'Extinta na natureza', emoji: '🦜', texto: 'Foi reintroduzida na Caatinga baiana depois de desaparecer da natureza.' },
  { mes: 'Setembro', animal: 'Lobo-guará', status: 'Vulnerável', emoji: '🐺', texto: 'Espalha sementes da lobeira pelo Cerrado; sofre com atropelamentos.' },
  { mes: 'Outubro', animal: 'Toninha', status: 'Criticamente em perigo', emoji: '🐬', texto: 'Golfinho pequeno do litoral Sul e Sudeste, ameaçado por captura acidental em redes.' },
  { mes: 'Novembro', animal: 'Ariranha', status: 'Vulnerável', emoji: '🦦', texto: 'Lontra gigante dos rios amazônicos, sensível à poluição por mercúrio.' },
  { mes: 'Dezembro', animal: 'Pato-mergulhão', status: 'Criticamente em perigo', emoji: '🦆', texto: 'Uma das aves mais raras do mundo; precisa de rios limpos e cristalinos.' },
];

// Distintivo em disputa no mês atual
export const distintivoDoMesAtual = (hoje = new Date()) => DISTINTIVOS_ANO[hoje.getMonth()];

// Já conquistados (os mesmos do protótipo: junho a setembro)
export const DISTINTIVOS_CONQUISTADOS_DEMO: DistintivoConquistado[] = DISTINTIVOS_ANO.slice(5, 9).map(
  ({ mes, animal, status, emoji }) => ({ mes, animal, status, emoji }),
);

// ===== Notificações =====

// Data de "n" dias atrás no formato AAAA-MM-DD
const diasAtrasIso = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const doisDigitos = (x: number) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}`;
};

// Início do texto da postagem, para caber na notificação
const resumo = (texto: string) => (texto.length > 40 ? `${texto.slice(0, 40).trim()}…` : texto);

// API: aprovadas e rejeitadas do usuário (pendentes não geram aviso), mais novas primeiro
const notificacoesDaApi = (postagens: Postagem[], idUsuario: number): NotificacaoBase[] =>
  postagens
    .filter((p) => p.idUsuario === idUsuario && p.stValidacao !== 'PENDENTE')
    .sort((a, b) => b.id - a.id)
    .map((p) =>
      p.stValidacao === 'APROVADO'
        ? {
            id: `post-${p.id}`,
            tipo: 'moderacao',
            titulo: 'Postagem aprovada',
            texto: `"${resumo(p.ctTexto)}" foi validada e liberou ${formatarPontos(p.ptGerado)} pts.`,
            demonstracao: false,
            idPostagem: p.id,
          }
        : {
            id: `post-${p.id}`,
            tipo: 'moderacao',
            titulo: 'Postagem rejeitada',
            texto: `"${resumo(p.ctTexto)}" não foi validada. Veja a justificativa.`,
            demonstracao: false,
            idPostagem: p.id,
          },
    );

// Demonstração: a API não tem notificações (datas contadas a partir de hoje)
const notificacoesDemo = (usuario: Usuario): NotificacaoBase[] => {
  const demo: NotificacaoBase[] = [
    {
      id: 'demo-contestacao',
      tipo: 'contestacao',
      titulo: 'Prazo de contestação terminando',
      texto: 'Faltam 3 dias para contestar a rejeição de uma postagem.',
      em: diasAtrasIso(0),
      demonstracao: true,
      tela: 'atividades',
    },
    {
      id: 'demo-meta',
      tipo: 'meta',
      titulo: 'Sua meta está perto de acabar',
      texto: 'Faltam 2 dias para o fim da sua meta de sequência.',
      em: diasAtrasIso(1),
      demonstracao: true,
      tela: 'metas',
    },
    {
      id: 'demo-liga',
      tipo: 'liga',
      titulo: `Você subiu para a divisão ${DIVISAO_DEMO}!`,
      texto: `Ficou entre os ${ZONA_TAMANHO} primeiros da liga Tatu na semana passada.`,
      em: diasAtrasIso(2),
      demonstracao: true,
      tela: 'ranking',
    },
    {
      id: 'demo-distintivo',
      tipo: 'distintivo',
      titulo: 'Distintivo conquistado: Lobo-guará 🐺',
      texto: `Você terminou setembro no top ${TOP_DISTINTIVO} da disputa mensal.`,
      em: diasAtrasIso(18),
      demonstracao: true,
      tela: 'pontos',
    },
  ];

  // Só para quem modera: aviso de inatividade
  if (usuario.tipoPerfil === 'MODERADOR') {
    demo.unshift({
      id: 'demo-inatividade',
      tipo: 'inatividade',
      titulo: 'Aviso de inatividade',
      texto: 'Faltam 5 dias para você perder o cargo de moderação. Avalie ao menos uma postagem.',
      em: diasAtrasIso(0),
      demonstracao: true,
      tela: 'moderacao',
    });
  }
  return demo;
};

// Notificações do usuário logado: primeiro as da API, depois as de demonstração
export const notificacoesDoUsuario = (postagens: Postagem[], usuario: Usuario): NotificacaoBase[] => [
  ...notificacoesDaApi(postagens, usuario.id),
  ...notificacoesDemo(usuario),
];