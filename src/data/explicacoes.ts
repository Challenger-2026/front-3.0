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
      'Demonstração: denunciar uma publicação (a denúncia vai para a fila de denúncias dos moderadores)',
    ],
    proximaAcao: 'Toque no botão + para registrar uma ação sustentável.',
  },
  comunidades: {
    titulo: 'Comunidades',
    descricao:
      'Todas as comunidades do Soul Up, com as Premium em destaque. Toda postagem é feita dentro de uma comunidade, e só os membros publicam nela.',
    destaques: [
      'GET /comunidades e, para cada uma, GET /comunidades/{id}/membros/total',
      'Entrar: POST /comunidades/{id}/membros?idUsuario= (409 se já for membro)',
      'Só o Criador vê o botão "Criar nova comunidade"',
      'Demonstração: plano Free/Premium, selo de verificada e temas ficam no front (a API não tem esses campos)',
    ],
    proximaAcao: 'Entre em uma comunidade ou abra os detalhes dela.',
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
      'Moderador não troca direto: abre a candidatura com o questionário',
      'Criador com comunidades ou moderador que já moderou não pode trocar: a API responde 409',
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
  candidatura: {
    titulo: 'Candidatura a moderador',
    descricao:
      'Antes de moderar, o usuário aceita o aviso de confidencialidade, confere os requisitos e responde a 5 perguntas sobre a moderação às cegas. Com 4 acertos, o perfil vira Moderador.',
    destaques: [
      'Aprovado no questionário: PUT /usuarios/{id}/perfil com MODERADOR (o Java cria a linha na T_LGT_MODERADOR)',
      'Taxa de rejeição: postagens do GET /postagens + um histórico de demonstração fixo no front',
      'Criador com comunidades passa no questionário, mas a API recusa a troca com 409',
      'Demonstração: o tempo mínimo de 3 meses usa uma data de cadastro fixa no front (a API não guarda essa data)',
      'Demonstração: o aceite da confidencialidade e o questionário ficam só no front',
    ],
    proximaAcao: 'diegoa vira moderador; dudalopes não é elegível; anacarol passa no questionário e recebe o 409 da API.',
  },
  moderacao: {
    titulo: 'Fila global de moderação',
    descricao:
      'Fila às cegas, no modelo da correção da redação do ENEM: o moderador vê só o texto, a evidência e os pontos, sem o autor. Postagens dele e das comunidades de que participa não aparecem.',
    destaques: [
      'GET /moderacoes/fila?idUsuario= devolve id, ctTexto, ctUrl e ptGerado',
      'Quem não é moderador recebe 403 e vê o convite para a candidatura',
      'Demonstração: "Declarar impedimento" tira a postagem da fila só nesta sessão',
      'Demonstração: limite de 20 moderações por dia e perda do cargo após 30 dias sem moderar',
    ],
    proximaAcao: 'Entre como carlam ou helenap (senha soulup123) e escolha uma postagem.',
  },
  'moderacao-analise': {
    titulo: 'Analisar postagem',
    descricao:
      'O moderador responde à rubrica de 4 critérios e decide: aprovar ou rejeitar. Cada postagem recebe uma única decisão.',
    destaques: [
      'POST /moderacoes com decisao (A ou R), justificativa, idUsuario e idPostagem',
      'Aprovar: o Java muda para APROVADO e soma o ptGerado no sdPonto do autor; rejeitar: REJEITADO',
      'Bônus do moderador: 10% do ptGerado, gravado em bnModerador',
      'Rubrica fica no front: o Java recebe só a decisão e a justificativa',
      'A API não deixa corrigir o tipo de impacto nem fazer dupla avaliação (id_postagem é UNIQUE na moderação)',
    ],
    proximaAcao: 'Responda à rubrica, escolha a decisão e confirme.',
  },
  denuncias: {
    titulo: 'Denúncias (demonstração)',
    descricao:
      'Publicações aprovadas que a comunidade denunciou, ordenadas pelo número de denúncias. Segue as regras da fila às cegas e não mostra as denúncias feitas pelo próprio moderador.',
    destaques: [
      'Demonstração: a API ainda não tem a tabela de denúncias, tudo fica no estado do front',
      'Prioridade: 1 denúncia = Normal, 2 ou 3 = Alta, 4 ou mais = Crítica',
      'Manter = denúncia improcedente; Remover = a publicação sai do feed',
      'Parecer obrigatório, com no mínimo 10 caracteres',
    ],
    proximaAcao: 'Abra uma publicação denunciada e registre o parecer.',
  },
  contestacao: {
    titulo: 'Contestar rejeição (demonstração)',
    descricao:
      'O autor de uma postagem rejeitada pode pedir uma nova análise. A revisão é feita por um moderador com reputação maior que a de quem rejeitou.',
    destaques: [
      'Demonstração: a API ainda não tem a tabela de contestações, fica no estado do front',
      'Só o autor contesta, só postagens rejeitadas e uma contestação por postagem',
      'Prazo de 7 dias: a API não guarda a data da moderação, então o prazo aparece só como regra',
      'Motivo obrigatório, com no mínimo 15 caracteres',
    ],
    proximaAcao: 'Descreva o motivo e envie a contestação.',
  },
  contestacoes: {
    titulo: 'Histórico de contestações (demonstração)',
    descricao:
      'Trilha de auditoria de cada contestação: decisão original, motivo do autor, decisão final e efeito na reputação do moderador original.',
    destaques: [
      'O autor vê só as próprias contestações; o moderador vê todas',
      'Para o autor, o moderador aparece só como "um moderador da Soul Up"',
      'A justificativa original vem do GET /moderacoes',
    ],
  },
  revisoes: {
    titulo: 'Fila de contestações (demonstração)',
    descricao:
      'Segunda instância da moderação: contestações em aberto, que só um moderador com reputação maior que a do moderador original pode revisar.',
    destaques: [
      'Não revisa quem é o autor nem quem rejeitou a postagem',
      'Reputação: demonstração, fixa no front (o Java guarda só o rótulo rt_moderador)',
    ],
    proximaAcao: 'Entre como helenap para revisar as contestações em aberto.',
  },
  revisao: {
    titulo: 'Revisar contestação (demonstração)',
    descricao:
      'O revisor mantém ou reverte a rejeição. Manter dá bônus de reputação ao moderador original; reverter aplica penalidade.',
    destaques: [
      'Manter: +3 de reputação para quem rejeitou; reverter: −5',
      'Parecer obrigatório, registrado no histórico',
      'Demonstração: reverter não muda a postagem na API (o Java só aceita moderar postagem PENDENTE)',
    ],
    proximaAcao: 'Escolha manter ou reverter e escreva o parecer.',
  },
  comunidade: {
    titulo: 'Perfil da comunidade',
    descricao:
      'Detalhes da comunidade, publicações aprovadas e missões. O Criador dela edita o nome, a descrição e as regras, cria missões e pode excluí-la.',
    destaques: [
      'Sair: DELETE /comunidades/{id}/membros?idUsuario= (o criador não sai da própria comunidade: 409)',
      'Editar: PUT /comunidades/{id} com nome e descrição; só o criador da comunidade (403 para os outros)',
      'Excluir: DELETE /comunidades/{id}?idUsuario=, recusado com 409 se houver outros membros ou postagens',
      'Demonstração: regras, missões e painel de impacto ficam no front; o painel soma desde a criação (a postagem da API não tem data)',
    ],
    proximaAcao: 'Entre como brunot para administrar o Pedala Sampa, o Greenpeace Brasil ou o WWF-Brasil.',
  },
  'criar-comunidade': {
    titulo: 'Criar comunidade',
    descricao:
      'O Criador dá nome e propósito à comunidade. Ele administra a comunidade, mas não modera as postagens dela: a validação é às cegas, por moderadores de fora.',
    destaques: [
      'POST /comunidades com nmComunidade, descricao e idUsuario; só quem tem linha na T_LGT_CRIADOR (403 para os outros)',
      'Quem cria já entra como membro',
      'Nome obrigatório com até 150 caracteres; descrição obrigatória',
      'Demonstração: regras, organização (ONG) e plano Free/Premium ficam no front',
    ],
    proximaAcao: 'Preencha o nome e a descrição e crie a comunidade.',
  },
  'para-voce': {
    titulo: 'Para você',
    descricao:
      'Sugestões montadas com as respostas do onboarding: meta, missões e comunidades nos temas de interesse, pessoas com temas em comum e o próximo papel no app.',
    destaques: [
      'Cruza os interesses do usuário com os temas das comunidades e das pessoas',
      'Entrar direto pela sugestão: POST /comunidades/{id}/membros?idUsuario=',
      '"Registrar ação desta missão" abre a nova postagem já preenchida',
      'Demonstração: temas, respostas do onboarding e missões ficam no front',
    ],
    proximaAcao: 'Entre em uma comunidade sugerida ou registre uma missão.',
  },
};