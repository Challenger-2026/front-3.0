import type { Explicacao, TelaId } from '../types/types';

export const explicacoes: Record<TelaId, Explicacao> = {
  inicio: {
    titulo: 'Tela inicial',
    descricao:
      'É o ponto de partida do usuário no Soul Up. Reúne o saldo de pontos, o CO₂ evitado e o andamento da meta de sequência.',
    destaques: [
      'Saldo de pontos e equivalente em kg de CO₂ evitado',
      'Progresso da meta pessoal de 7, 15 ou 30 dias',
      'Atalhos para ranking, metas e sugestões "Para você"',
    ],
    proximaAcao: 'Toque no botão + para registrar uma ação sustentável.',
  },
  comunidades: {
    titulo: 'Comunidades',
    descricao:
      'Lista as comunidades de que o usuário participa e as que ele pode conhecer. Toda postagem é feita dentro de uma comunidade.',
    destaques: [
      'Comunidades free e premium (parceiras e ONGs)',
      'Entrar e sair de uma comunidade',
      'Missões criadas pelo Criador da comunidade',
    ],
    proximaAcao: 'Escolha uma comunidade para ver os detalhes.',
  },
  'nova-postagem': {
    titulo: 'Registrar ação sustentável',
    descricao:
      'O usuário descreve a ação, escolhe a categoria e anexa a comprovação. A postagem vai para a fila de moderação às cegas.',
    destaques: [
      'Cada categoria tem uma pontuação própria',
      'Teto diário de pontos com redução progressiva',
      'Os pontos só entram depois da aprovação do moderador',
    ],
    proximaAcao: 'Preencha a ação e envie para moderação.',
  },
  carteira: {
    titulo: 'Carteira',
    descricao:
      'Mostra o saldo de pontos e permite trocá-los por benefícios de empresas parceiras e ONGs.',
    destaques: [
      'Catálogo de benefícios com o custo em pontos',
      'Histórico de resgates com código e status',
    ],
    proximaAcao: 'Escolha um benefício para resgatar.',
  },
  perfil: {
    titulo: 'Perfil',
    descricao:
      'Dados do usuário, tipo de perfil (Comum, Moderador ou Criador), distintivos conquistados e configurações de privacidade.',
    destaques: [
      'Distintivos mensais com animais da fauna brasileira em risco de extinção',
      'Candidatura para se tornar moderador',
      'Privacidade e pedido de exclusão de dados (LGPD)',
    ],
  },
  notificacoes: {
    titulo: 'Notificações',
    descricao:
      'Avisos sobre moderação das postagens, prazo de contestação, mudança de divisão na liga e distintivos conquistados.',
    destaques: [
      'Postagem aprovada ou rejeitada, com justificativa',
      'Subida ou descida de divisão na liga semanal',
      'Aviso de inatividade para moderadores',
    ],
  },
};