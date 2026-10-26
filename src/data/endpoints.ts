import type { ControllerJava, EndpointJava, SituacaoApi, TelaId } from '../types/types';

// Os 23 endpoints da API Java (Guara/controller) e as telas do simulador que chamam cada um.
// Usado pela página de status e pelo bloco "Endpoint desta tela" do painel de explicação.
export const endpoints: EndpointJava[] = [
  // ===== UsuarioController (/usuarios) =====
  {
    metodo: 'GET',
    rota: '/usuarios',
    controller: 'UsuarioController',
    descricao: 'Lista os usuários (sem CPF e sem senha)',
    telas: [],
    aoAbrir: true,
  },
  {
    metodo: 'GET',
    rota: '/usuarios/{id}',
    controller: 'UsuarioController',
    descricao: 'Busca um usuário: saldo do autor depois de uma aprovação',
    telas: ['moderacao-analise'],
  },
  {
    metodo: 'POST',
    rota: '/usuarios',
    controller: 'UsuarioController',
    descricao: 'Cadastra o usuário (perfil Comum, 0 pontos, nível 1)',
    telas: ['cadastro'],
  },
  {
    metodo: 'PUT',
    rota: '/usuarios/{id}',
    controller: 'UsuarioController',
    descricao: 'Atualiza os dados cadastrais',
    telas: ['dados'],
  },
  {
    metodo: 'DELETE',
    rota: '/usuarios/{id}',
    controller: 'UsuarioController',
    descricao: 'Exclui a conta',
    telas: ['dados'],
  },
  {
    metodo: 'POST',
    rota: '/usuarios/login',
    controller: 'UsuarioController',
    descricao: 'Confere username e senha e devolve o perfil',
    telas: ['login'],
  },
  {
    metodo: 'PUT',
    rota: '/usuarios/{id}/perfil',
    controller: 'UsuarioController',
    descricao: 'Troca o perfil (Comum, Criador ou Moderador)',
    telas: ['ajustes', 'candidatura'],
  },

  // ===== ComunidadeController (/comunidades) =====
  {
    metodo: 'GET',
    rota: '/comunidades',
    controller: 'ComunidadeController',
    descricao: 'Lista as comunidades',
    telas: [],
    aoAbrir: true,
  },
  {
    metodo: 'GET',
    rota: '/comunidades/{id}',
    controller: 'ComunidadeController',
    descricao: 'Busca uma comunidade',
    telas: [], // o detalhe usa a comunidade que já veio na lista
  },
  {
    metodo: 'GET',
    rota: '/comunidades/usuario/{idUsuario}',
    controller: 'ComunidadeController',
    descricao: 'Comunidades de que o usuário participa (logo depois do login)',
    telas: ['login'],
  },
  {
    metodo: 'POST',
    rota: '/comunidades',
    controller: 'ComunidadeController',
    descricao: 'Cria a comunidade (só Criador)',
    telas: ['criar-comunidade'],
  },
  {
    metodo: 'PUT',
    rota: '/comunidades/{id}',
    controller: 'ComunidadeController',
    descricao: 'Edita a comunidade (só o Criador dela)',
    telas: ['comunidade'],
  },
  {
    metodo: 'DELETE',
    rota: '/comunidades/{id}?idUsuario=',
    controller: 'ComunidadeController',
    descricao: 'Exclui a comunidade (só o Criador dela)',
    telas: ['comunidade'],
  },
  {
    metodo: 'POST',
    rota: '/comunidades/{id}/membros?idUsuario=',
    controller: 'ComunidadeController',
    descricao: 'Entra na comunidade (409 se já for membro)',
    telas: ['comunidades', 'comunidade', 'inicio', 'para-voce', 'onboarding'],
  },
  {
    metodo: 'DELETE',
    rota: '/comunidades/{id}/membros?idUsuario=',
    controller: 'ComunidadeController',
    descricao: 'Sai da comunidade',
    telas: ['comunidade'],
  },
  {
    metodo: 'GET',
    rota: '/comunidades/{id}/membros/total',
    controller: 'ComunidadeController',
    descricao: 'Total de membros da comunidade',
    telas: ['comunidades', 'comunidade'],
  },

  // ===== PostagemController (/postagens) =====
  {
    metodo: 'GET',
    rota: '/postagens',
    controller: 'PostagemController',
    descricao: 'Lista as postagens',
    telas: [],
    aoAbrir: true,
  },
  {
    metodo: 'GET',
    rota: '/postagens/{id}',
    controller: 'PostagemController',
    descricao: 'Busca uma postagem',
    telas: [], // as telas usam a postagem que já veio na lista
  },
  {
    metodo: 'POST',
    rota: '/postagens',
    controller: 'PostagemController',
    descricao: 'Publica a ação sustentável (só membros da comunidade)',
    telas: ['nova-postagem'],
  },

  // ===== ModeracaoController (/moderacoes) =====
  {
    metodo: 'GET',
    rota: '/moderacoes/fila?idUsuario=',
    controller: 'ModeracaoController',
    descricao: 'Fila de postagens pendentes (403 se não for Moderador)',
    telas: ['moderacao'],
  },
  {
    metodo: 'GET',
    rota: '/moderacoes',
    controller: 'ModeracaoController',
    descricao: 'Lista as moderações',
    telas: [],
    aoAbrir: true,
  },
  {
    metodo: 'GET',
    rota: '/moderacoes/{id}',
    controller: 'ModeracaoController',
    descricao: 'Busca uma moderação',
    telas: [], // as telas usam a moderação que já veio na lista
  },
  {
    metodo: 'POST',
    rota: '/moderacoes',
    controller: 'ModeracaoController',
    descricao: 'Aprova ou rejeita a postagem (na aprovação, soma os pontos do autor)',
    telas: ['moderacao-analise'],
  },
];

// Endpoints chamados pela tela (sem os carregados ao abrir o simulador)
export const endpointsDaTela = (tela: TelaId) => endpoints.filter((e) => e.telas.includes(tela));

// ----- Página de status -----

// O GET sem parâmetro de cada controller, usado para medir
export const rotasVerificacao: Record<ControllerJava, string> = {
  UsuarioController: '/usuarios',
  ComunidadeController: '/comunidades',
  PostagemController: '/postagens',
  ModeracaoController: '/moderacoes',
};

// Acima disso a resposta conta como lenta
export const LIMITE_LENTA_MS = 1000;

// Quantas verificações ficam guardadas na sessão (barras da página de status)
export const LIMITE_VERIFICACOES = 20;

// Sem resposta ou com erro → fora; resposta demorada → lenta
export const situacaoDe = (status: number | null, tempoMs: number): SituacaoApi => {
  if (status === null || status >= 400) return 'fora';
  return tempoMs > LIMITE_LENTA_MS ? 'lenta' : 'operacional';
};

// Nome curto de cada controller nos cartões
export const nomesControllers: Record<ControllerJava, string> = {
  UsuarioController: 'Usuários',
  ComunidadeController: 'Comunidades',
  PostagemController: 'Postagens',
  ModeracaoController: 'Moderações',
};

export const textosSituacao: Record<SituacaoApi, string> = {
  operacional: 'Operacional',
  lenta: 'Lenta',
  fora: 'Fora do ar',
};

// Cor da barra (e da legenda) de cada situação
export const coresSituacao: Record<SituacaoApi, string> = {
  operacional: 'bg-emerald-500',
  lenta: 'bg-amber-400',
  fora: 'bg-red-500',
};