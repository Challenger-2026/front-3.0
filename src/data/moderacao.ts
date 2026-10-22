import type {
  Contestacao,
  Denuncia,
  ModeradorDemo,
  MotivoDenuncia,
  PerguntaQuiz,
  Postagem,
  PrioridadeDenuncia,
  RevisaoDenuncia,
  StatusContestacao,
  Usuario,
} from '../types/types';

// ===== Regras da moderação às cegas (modelo da correção da redação do ENEM) =====

// Mesmo valor do PERCENTUAL_BONUS do ModeracaoService: bônus = 10% do ptGerado
export const PERCENTUAL_BONUS_MODERADOR = 0.1;

export const bonusDoModerador = (ptGerado: number) =>
  Math.round(ptGerado * PERCENTUAL_BONUS_MODERADOR * 100) / 100;

// Rubrica: o moderador marca Sim/Não em cada critério (fica no front, o Java recebe só a decisão)
export const RUBRICA = [
  'A evidência comprova a ação',
  'A ação corresponde ao tipo de impacto escolhido',
  'A ação é recente e do próprio usuário',
  'O conteúdo respeita as regras da comunidade',
];

// Regras do cargo (demonstração: a API ainda não controla)
export const LIMITE_MODERACOES_DIA = 20;
export const DIAS_INATIVIDADE_MODERADOR = 30;

// ===== Candidatura a moderador =====

export const MESES_MINIMOS_MODERADOR = 3;
export const TAXA_REJEICAO_MAXIMA = 0.1; // 10%
export const ACERTOS_MINIMOS_QUIZ = 4;

// A API não guarda a data de cadastro: fica fixa aqui pelo id (conta nova = hoje)
export const dataCadastroUsuarios: Record<number, string> = {
  1: '2026-03-02',
  2: '2026-03-15',
  3: '2026-04-01',
  4: '2026-05-10',
  5: '2026-06-20',
  6: '2026-02-20',
};

export const mesesNaPlataforma = (dataIso: string, hoje = new Date()) => {
  const inicio = new Date(`${dataIso}T00:00:00`);
  const meses = (hoje.getFullYear() - inicio.getFullYear()) * 12 + (hoje.getMonth() - inicio.getMonth());
  return Math.max(0, hoje.getDate() < inicio.getDate() ? meses - 1 : meses);
};

// Histórico anterior de postagens avaliadas (demonstração, igual ao protótipo: a API não guarda)
export const historicoModeracao: Record<number, { avaliadas: number; rejeitadas: number }> = {
  1: { avaliadas: 30, rejeitadas: 1 },
};

// Rejeitadas ÷ avaliadas: histórico de demonstração + postagens já moderadas do GET /postagens
export const taxaRejeicao = (idUsuario: number, postagens: Postagem[]) => {
  const moderadas = postagens.filter((p) => p.idUsuario === idUsuario && p.stValidacao !== 'PENDENTE');
  const historico = historicoModeracao[idUsuario] ?? { avaliadas: 0, rejeitadas: 0 };
  const avaliadas = historico.avaliadas + moderadas.length;
  const rejeitadas = historico.rejeitadas + moderadas.filter((p) => p.stValidacao === 'REJEITADO').length;
  return avaliadas === 0 ? 0 : rejeitadas / avaliadas;
};

export const QUIZ_MODERADOR: PerguntaQuiz[] = [
  {
    pergunta: 'Uma postagem de plantio de muda não traz nenhuma foto da muda plantada. O que você faz?',
    opcoes: ['Aprovo, a descrição é convincente', 'Rejeito, justificando que falta evidência', 'Peço mais detalhes ao autor por mensagem'],
    correta: 1,
    comentario: 'Sem evidência, o critério "A evidência comprova a ação" fica como Não. Rejeite e justifique: o autor pode contestar.',
  },
  {
    pergunta: 'Você reconheceu que a postagem na sua fila é de um amigo. O que deve fazer?',
    opcoes: ['Declarar impedimento e pular', 'Avaliar normalmente, já que o autor está oculto', 'Aprovar, pois conheço a pessoa'],
    correta: 0,
    comentario: 'A fila já exclui suas comunidades, mas, se mesmo assim você reconhecer o autor, declare impedimento: a postagem segue para outro moderador.',
  },
  {
    pergunta: 'Ficou em dúvida sobre uma postagem. Qual é o caminho?',
    opcoes: ['Seguir a rubrica e justificar a decisão', 'Aprovar para não frustrar o autor', 'Deixar para outro moderador'],
    correta: 0,
    comentario: 'A rubrica existe para isso: marque cada critério e registre a justificativa.',
  },
  {
    pergunta: 'Por que você não vê as postagens das comunidades de que participa?',
    opcoes: ['Para a fila ficar menor', 'Para evitar conflito de interesse, como na correção da redação do ENEM', 'Porque só o Criador modera a comunidade'],
    correta: 1,
    comentario: 'Quem avalia não pode ter vínculo com quem é avaliado. Por isso a fila é global e às cegas.',
  },
  {
    pergunta: 'Qual é o limite diário de moderações por moderador?',
    opcoes: ['10', String(LIMITE_MODERACOES_DIA), 'Sem limite'],
    correta: 1,
    comentario: `São até ${LIMITE_MODERACOES_DIA} moderações por dia, para manter a qualidade da análise.`,
  },
];

// ===== Moderadores e reputação (demonstração) =====

// Espelha a coleção "moderadores" do db.json. A API Java não tem rota para a T_LGT_MODERADOR,
// então a reputação usada nas contestações fica aqui.
export const REPUTACAO_INICIAL = 50;

export const moderadoresDemo: ModeradorDemo[] = [
  { idModerador: 1, idUsuario: 3, reputacao: 88 }, // carlam
  { idModerador: 2, idUsuario: 6, reputacao: 96 }, // helenap
];

export const reputacoesIniciais: Record<number, number> = moderadoresDemo.reduce(
  (acc, m) => ({ ...acc, [m.idUsuario]: m.reputacao }),
  {} as Record<number, number>,
);

export const buscarModeradorDemo = (idModerador: number) => moderadoresDemo.find((m) => m.idModerador === idModerador);

export const reputacaoDe = (idUsuario: number, reputacoes: Record<number, number>) =>
  reputacoes[idUsuario] ?? REPUTACAO_INICIAL;

// ===== Denúncias (demonstração) =====

export const MOTIVOS_DENUNCIA: MotivoDenuncia[] = [
  'Informação falsa',
  'Ação não realizada',
  'Foto não corresponde à ação',
  'Conteúdo repetido',
  'Conteúdo ofensivo',
  'Propaganda',
  'Fora do tema da comunidade',
];

export const LIMIAR_DENUNCIAS_ALTA = 2;
export const LIMIAR_DENUNCIAS_CRITICA = 4;

export const prioridadeDenuncia = (quantidade: number): PrioridadeDenuncia => {
  if (quantidade >= LIMIAR_DENUNCIAS_CRITICA) return 'Crítica';
  if (quantidade >= LIMIAR_DENUNCIAS_ALTA) return 'Alta';
  return 'Normal';
};

export const postagemRemovida = (idPostagem: number, revisoes: RevisaoDenuncia[]) =>
  revisoes.some((r) => r.idPostagem === idPostagem && r.acao === 'REMOVER');

// Fila de denúncias: mesmas regras da fila às cegas (sem as próprias postagens e sem as comunidades dele),
// só postagens aprovadas ainda não revisadas e sem as denúncias feitas pelo próprio moderador.
// Ordem: mais denúncias primeiro.
export const denunciasNaFila = (
  postagens: Postagem[],
  denuncias: Denuncia[],
  revisoes: RevisaoDenuncia[],
  idModerador: number,
  idsMinhasComunidades: number[],
) =>
  postagens
    .filter(
      (p) =>
        p.stValidacao === 'APROVADO' &&
        p.idUsuario !== idModerador &&
        !idsMinhasComunidades.includes(p.idComunidade) &&
        !revisoes.some((r) => r.idPostagem === p.id),
    )
    .map((postagem) => ({
      postagem,
      recebidas: denuncias.filter((d) => d.idPostagem === postagem.id && d.idUsuario !== idModerador),
    }))
    .filter((item) => item.recebidas.length > 0)
    .sort((a, b) => b.recebidas.length - a.recebidas.length);

// Só em postagens aprovadas (as únicas que aparecem no feed)
export const denunciasIniciais: Denuncia[] = [
  { id: 1, idPostagem: 3, idUsuario: 2, motivo: 'Foto não corresponde à ação', detalhe: 'A foto mostra poucas mudas, não 120.' },
  { id: 2, idPostagem: 3, idUsuario: 5, motivo: 'Foto não corresponde à ação', detalhe: '' },
  { id: 3, idPostagem: 3, idUsuario: 1, motivo: 'Conteúdo repetido', detalhe: '' },
  { id: 4, idPostagem: 3, idUsuario: 6, motivo: 'Foto não corresponde à ação', detalhe: '' },
  { id: 5, idPostagem: 8, idUsuario: 4, motivo: 'Conteúdo repetido', detalhe: 'Mesmo texto publicado na semana passada.' },
  { id: 6, idPostagem: 8, idUsuario: 2, motivo: 'Conteúdo repetido', detalhe: '' },
  { id: 7, idPostagem: 6, idUsuario: 5, motivo: 'Fora do tema da comunidade', detalhe: '' },
];

// ===== Contestação (demonstração) =====

export const PRAZO_CONTESTACAO_DIAS = 7;
export const BONUS_REPUTACAO = 3; // rejeição mantida
export const PENALIDADE_REPUTACAO = 5; // rejeição revertida

export const contestacoesIniciais: Contestacao[] = [
  {
    id: 1,
    idPostagem: 13,
    idUsuario: 5,
    motivo: 'Anexei o comprovante do ponto de coleta na descrição e ele não foi considerado na análise.',
    abertaEm: '2026-10-20',
    status: 'EM_REVISAO',
    idModeradorOriginal: 1,
    reputacaoOriginal: 88,
  },
];

// Quem pode revisar: moderador, que não é o autor nem o moderador original, com reputação maior
export const motivoImpedimentoRevisao = (
  usuario: Usuario,
  contestacao: Contestacao,
  reputacoes: Record<number, number>,
): string | null => {
  if (usuario.tipoPerfil !== 'MODERADOR') return 'você não é moderador';
  if (usuario.id === contestacao.idUsuario) return 'você é o autor da postagem';
  if (buscarModeradorDemo(contestacao.idModeradorOriginal)?.idUsuario === usuario.id) {
    return 'você é o moderador que rejeitou';
  }
  if (reputacaoDe(usuario.id, reputacoes) <= contestacao.reputacaoOriginal) {
    return 'sua reputação não é maior que a do moderador original';
  }
  return null;
};

export const nomesStatusContestacao: Record<StatusContestacao, string> = {
  EM_REVISAO: 'Em revisão',
  MANTIDA: 'Rejeição mantida',
  REVERTIDA: 'Rejeição revertida',
};