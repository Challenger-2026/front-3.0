import type { Explicacao, TelaId } from '../types/types';

export const explicacoes: Record<TelaId, Explicacao> = {
    login: {
    titulo: 'Login',
    descricao:
      'Porta de entrada do app. O usuário entra com o nome de usuário e a senha; a API confere os dados e devolve o perfil, sem CPF e sem senha.',
    destaques: [
      'POST /usuarios/login com username e senha',
      'Erro genérico "Usuário ou senha inválidos": não revela qual campo está errado',
      'Quem acabou de se cadastrar já entra com o próprio login',
    ],
    proximaAcao: 'Entre com anacarol e a senha soulup123, ou crie um cadastro.',
  },
  cadastro: {
    titulo: 'Cadastro',
    descricao:
      'Cria a conta no Soul Up. Todo usuário novo começa com perfil Comum, 0 pontos e nível 1.',
    destaques: [
      'POST /usuarios com nome, CPF, e-mail, username, senha e data de nascimento',
      'CPF, e-mail e username não podem se repetir: a API responde 409',
      'Depois do cadastro o usuário já entra e segue para o onboarding',
    ],
    proximaAcao: 'Preencha os dados para criar a conta.',
  },
  inicio: {
    titulo: 'Feed (tela inicial)',
    descricao:
      'É o ponto de partida do usuário no Soul Up. Mostra as ações sustentáveis já validadas pela moderação, primeiro das comunidades de que ele participa.',
    destaques: [
      'Só aparecem postagens aprovadas: pendentes e rejeitadas ficam restritas ao autor',
      'Pontos liberados em cada ação aprovada',
      'Filtro entre "Minhas comunidades" e "Explorar tudo"',
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
      'Resumo do impacto do usuário: tipo de perfil (Comum, Moderador ou Criador), pontos, ações validadas e quanto CO₂ ele já evitou.',
    destaques: [
      'CO₂ evitado calculado pela categoria de cada ação aprovada',
      'Ações aguardando validação da moderação às cegas',
      'Comunidades criadas, quando o perfil é Criador',
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