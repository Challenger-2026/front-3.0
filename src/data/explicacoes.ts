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
    onboarding: {
    titulo: 'Onboarding',
    descricao:
      'Três perguntas rápidas logo depois do cadastro: momento, objetivo e temas de interesse. As respostas personalizam o Perfil e as sugestões do app.',
    destaques: [
      'Respostas guardadas no front: a API Java não tem esses campos',
      'Mínimo de 2 temas de interesse',
      'Dá para pular agora e responder depois em Configurações',
    ],
    proximaAcao: 'Responda as três etapas ou toque em "Pular por agora".',
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
      'O usuário escolhe a comunidade, descreve a ação, cola o link da comprovação e escolhe o tipo de impacto. A postagem nasce Pendente e vai para a fila de moderação às cegas.',
    destaques: [
      'POST /postagens com ctTexto, ctUrl, impacto, idUsuario e idComunidade',
      'Os pontos são calculados pela API a partir do impacto: Crítico 10,6, Estrutural 6,6, Rotina 1,6',
      'Só membros publicam na comunidade: fora dela a API responde 409',
      'Os pontos só entram no saldo depois da aprovação do moderador',
    ],
    proximaAcao: 'Preencha a ação e envie para validação.',
  },
    'editar-postagem': {
    titulo: 'Editar postagem pendente (demonstração)',
    descricao:
      'Enquanto a postagem aguarda a moderação, o autor pode corrigir o texto, o link e o tipo de impacto. Depois de moderada, ela não muda mais.',
    destaques: [
      'Demonstração: a API Java ainda não tem PUT /postagens/{id}',
      'A alteração fica só nesta sessão do simulador e some ao recarregar a página',
      'Trocar o impacto muda os pontos a liberar',
    ],
    proximaAcao: 'Altere a postagem e salve.',
  },
  atividades: {
    titulo: 'Atividades registradas',
    descricao:
      'Histórico privado das postagens do usuário, com o status de cada uma. No feed só aparecem as aprovadas; aqui ele vê também as pendentes e as rejeitadas.',
    destaques: [
      'Lista vinda do GET /postagens, filtrada pelo autor',
      'Contagem de aprovadas, aguardando e rejeitadas',
      'Ordem por id decrescente: a API não guarda a data da postagem',
    ],
    proximaAcao: 'Toque em "Ver detalhes" para abrir o feedback da moderação.',
  },
  feedback: {
    titulo: 'Feedback da moderação',
    descricao:
      'Mostra a decisão do moderador, a justificativa e os pontos da ação. O nome de quem avaliou não aparece: a moderação é às cegas nos dois sentidos.',
    destaques: [
      'Decisão e justificativa vêm do GET /moderacoes, pelo idPostagem',
      'Pendente: os pontos aparecem como "a liberar"',
      'A categoria é deduzida pelo ptGerado da postagem',
    ],
    proximaAcao: 'Veja sua pontuação ou registre outra ação.',
  },
  pontos: {
    titulo: 'Minha pontuação',
    descricao:
      'Saldo de pontos, CO₂ evitado e como cada tipo de impacto pontua. O saldo é o sdPonto da API, que só cresce quando a moderação aprova uma ação.',
    destaques: [
      'Saldo: sdPonto do usuário (somado pelo Java na aprovação)',
      'CO₂ evitado: fator da categoria de cada ação aprovada',
      'Extrato com as ações aprovadas e os pontos a liberar das pendentes',
      'Teto diário de 15 pts com redução progressiva: demonstração, a API ainda paga o valor cheio',
    ],
    proximaAcao: 'Abra "Minha meta de atividades" para definir uma meta.',
  },
  metas: {
    titulo: 'Meta de atividades',
    descricao:
      'O usuário escolhe quantas atividades quer concluir em 7, 15 ou 30 dias. Só contam as ações aprovadas pela moderação depois que a meta começou.',
    destaques: [
      'Metas ficam no front: a API Java ainda não tem essa tabela',
      'Faixas da sequência: 1–7 dias = 1 pt/dia, 8–15 = 2, 16–30 = 3',
      'Ao concluir, dá para aumentar o alvo ou subir para a próxima métrica',
    ],
    proximaAcao: 'Escolha o período e o número de atividades.',
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
    ajustes: {
    titulo: 'Configurações',
    descricao:
      'Onde o usuário escolhe como participa do Soul Up: Comum, Criador ou Moderador. A troca é feita na API e vale na hora.',
    destaques: [
      'PUT /usuarios/{id}/perfil com o novo tipoPerfil',
      'Criador com comunidades não pode deixar de ser Criador: a API responde 409',
      'Acesso aos dados cadastrais e às respostas do onboarding',
    ],
    proximaAcao: 'Troque o tipo de perfil ou abra os dados cadastrais.',
  },
  dados: {
    titulo: 'Dados cadastrais',
    descricao:
      'Edição de nome, nome de usuário e senha. CPF, e-mail e data de nascimento ficam bloqueados depois do cadastro.',
    destaques: [
      'PUT /usuarios/{id}: a API só aceita nome, username e senha',
      'Username repetido é recusado com 409',
      'Excluir conta: DELETE /usuarios/{id}, recusado com 409 se houver postagens ou comunidades vinculadas',
    ],
    proximaAcao: 'Altere seus dados e salve, ou teste a exclusão da conta.',
  },
};