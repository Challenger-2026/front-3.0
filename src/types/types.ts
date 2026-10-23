
export interface CabecalhoProps {
  titulo: string;
}

export interface ItemMenu {
  label: string;
  path: string;
}


export type IntegranteBase = {
  nome: string;
  rm: string;
  turma: string;
  foto: string;
};

export type RedesSociais = {
  linkedin: string;
  github: string;
};

export type IntegranteProps = IntegranteBase & RedesSociais & {
  funcao?: string;
  contribuicao?: string[];
};

export type FormContatoInputs = {
  nome: string;
  email: string;
  mensagem: string;
};

export type FaqItemType = {
  pergunta: string;
  resposta: string;
};

export type TimelineItemProps = {
  numero: number;
  titulo: string;
  descricao: string;
};

export type StatusRequisicao = 'idle' | 'loading' | 'success' | 'error';

export type FeedbackType = {
  id?: string;
  nome: string;
  email: string;
  mensagem: string;
};

// ===== Simulador do protótipo Soul Up =====

export type TelaId =
  | 'login'
  | 'cadastro'
  | 'onboarding'
  | 'inicio'
  | 'comunidades'
  | 'nova-postagem'
  | 'editar-postagem'
  | 'atividades'
  | 'feedback'
  | 'pontos'
  | 'metas'
  | 'carteira'
  | 'perfil'
  | 'ajustes'
  | 'dados'
  | 'notificacoes'
  | 'candidatura'
  | 'moderacao'
  | 'moderacao-analise'
  | 'denuncias'
  | 'contestacao'
  | 'contestacoes'
  | 'revisoes'
  | 'revisao'
  | 'comunidade'
  | 'criar-comunidade'
  | 'para-voce'
  | 'ranking'
  | 'beneficios'
  | 'privacidade';

export type Explicacao = {
  titulo: string;
  descricao: string;
  destaques: string[];
  proximaAcao?: string;
};

export type NavegacaoSimulador = {
  telaAtual: TelaId;
  podeVoltar: boolean;
  irPara: (tela: TelaId) => void;
  trocarPara: (tela: TelaId) => void;
  voltar: () => void;
  reiniciar: () => void;
};

// ===== Dados do Soul Up (mesmos nomes da API Java) =====

export type TipoPerfil = 'COMUM' | 'CRIADOR' | 'MODERADOR';
export type StatusValidacao = 'PENDENTE' | 'APROVADO' | 'REJEITADO';
export type CategoriaId = 'critico' | 'estrutural' | 'rotina';
export type Impacto = 'CRITICO' | 'ESTRUTURAL' | 'ROTINA'; // valores aceitos pelo @Pattern do DTOPostagemRequest
export type DecisaoModeracao = 'A' | 'R'; // A = aprovar, R = reprovar
export interface Usuario {
  id: number;
  nmCompleto: string;
  email: string;
  username: string;
  dtNascimento: string; // LocalDate do Java chega como "AAAA-MM-DD"
  sdPonto: number;
  nvUsuario: number;
  tipoPerfil: TipoPerfil;
}

export interface Comunidade {
  id: number;
  nmComunidade: string;
  descricao: string;
  dtCriacao: string;
  idCriador: number; // id da T_LGT_CRIADOR (não é o id do usuário)
  idRanking: number | null; // null enquanto a comunidade não tem ranking
  idUsuarioCriador: number; // id do usuário dono (JOIN com a T_LGT_CRIADOR)
}

export interface Postagem {
  id: number;
  ctTexto: string;
  ctUrl: string;
  stValidacao: StatusValidacao;
  ptGerado: number;
  idUsuario: number;
  idComunidade: number;
}

export type Categoria = {
  id: CategoriaId;
  impacto: Impacto;
  nome: string;
  descricao: string;
  pontosAcao: number;
  co2Kg: number;
};

// Resposta de /moderacoes (idModerador é o id da T_LGT_MODERADOR, não o do usuário)
export interface Moderacao {
  id: number;
  decisao: DecisaoModeracao;
  justificativa: string;
  bnModerador: number;
  idModerador: number;
  idPostagem: number;
}

// Formato de erro devolvido pela API Java
export interface ErroApi {
  erro: string;
  status: number;
}

// Erro lançado pelo api.ts: a mensagem da API + o status HTTP (ex.: 403 na fila de moderação)
export type ErroComStatus = Error & Partial<Pick<ErroApi, 'status'>>;

// ===== Requisições à API (services/http.ts) =====

// PATCH só aparece com o json-server (no lugar dos UPDATE que o Java faz no banco)
export type MetodoRequisicao = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface OpcoesRequisicao {
  corpo?: object; // vira JSON; nunca entra no registro
  mensagemErro: string; // usada quando a resposta de erro não traz { erro }
  soJsonServer?: boolean; // true: recurso que só existe no json-server (feedbacks); a linha real aparece no painel
}

// O que fica registrado de cada chamada (para o painel de requisições ao vivo)
export interface RegistroRequisicao {
  id: number;
  metodo: MetodoRequisicao;
  rota: string; // sem a URL base e com senha, CPF e e-mail mascarados
  status: number | null; // null: não houve resposta (API fora do ar, sem rede ou CORS)
  tempoMs: number;
  horario: string; // ISO, hora em que a chamada começou
  erro?: string; // mensagem mostrada ao usuário quando falha
  apoio: boolean; // true: chamada ao json-server que só imita o Java (o painel esconde por padrão)
  simulado: boolean; // true: linha "como o Java responderia" (só no modo json-server)
}

// ===== Painel de requisições e página de status (bloco 5.2) =====

// Os 4 controllers da API Java (Guara/controller)
export type ControllerJava = 'UsuarioController' | 'ComunidadeController' | 'PostagemController' | 'ModeracaoController';

// Um endpoint do Java e as telas do simulador que o chamam (catálogo em data/endpoints.ts)
export interface EndpointJava {
  metodo: Exclude<MetodoRequisicao, 'PATCH'>; // o Java não tem PATCH
  rota: string; // como está no controller, ex.: /usuarios/{id}
  controller: ControllerJava;
  descricao: string;
  telas: TelaId[]; // vazio: o simulador não usa
  aoAbrir?: boolean; // true: carregado ao abrir o simulador (dados de todas as telas)
}

// Situação de um controller na página de status
export type SituacaoApi = 'operacional' | 'lenta' | 'fora';

// Resultado do GET de um controller em uma verificação
export type ResultadoVerificacao = Pick<RegistroRequisicao, 'status' | 'tempoMs' | 'erro'> & {
  controller: ControllerJava;
  rota: string;
  situacao: SituacaoApi;
};

// Uma verificação (os 4 controllers de uma vez)
export type VerificacaoApi = Pick<RegistroRequisicao, 'id' | 'horario'> & {
  resultados: ResultadoVerificacao[];
};

// Contexto do painel e da página de status (fica no layout do Simulador)
export interface RequisicoesContextType {
  requisicoes: RegistroRequisicao[]; // mais novas primeiro: até 20 do Java e até 20 de apoio do json-server
  limparRequisicoes: () => void;
  verificacoes: VerificacaoApi[]; // últimas 20 da sessão, mais nova primeiro
  verificando: boolean;
  verificarAgora: () => Promise<void>;
}

// Dados que a API não guarda e ficam fixos no front
export interface ComplementoUsuario {
  bio: string;
  interesses: string[];
  momento?: string;
  objetivo?: string;
}

// Linha da coleção "membros" do db.json (imita a T_LGT_USUARIO_COMUNIDADE do Java)
export interface Membro {
  id: number;
  idUsuario: number;
  idComunidade: number;
}

// ===== Corpo das requisições de usuário (mesmos campos dos DTOs de entrada do Java) =====

// POST /usuarios
export interface UsuarioCadastro {
  nmCompleto: string;
  cpf: string;
  email: string;
  username: string;
  senha: string;
  dtNascimento: string; // "AAAA-MM-DD", formato do input type="date"
}

// PUT /usuarios/{id} — o Java só deixa editar estes três
export type UsuarioAtualizacao = Pick<UsuarioCadastro, 'nmCompleto' | 'username' | 'senha'>;

// POST /usuarios/login
export type LoginRequest = Pick<UsuarioCadastro, 'username' | 'senha'>;

// POST /postagens — o Java calcula o ptGerado pelo impacto e grava como PENDENTE
export interface PostagemCadastro {
  ctTexto: string;
  ctUrl: string;
  impacto: Impacto;
  idUsuario: number;
  idComunidade: number;
}

// Edição de postagem pendente — só demonstração: a API não tem PUT /postagens/{id}
export type PostagemEdicao = Pick<PostagemCadastro, 'ctTexto' | 'ctUrl' | 'impacto'>;

// ===== Metas de atividades (só no front: a API Java não tem metas) =====

export type PeriodoMeta = 7 | 15 | 30;

export interface MetaAtividades {
  periodoDias: PeriodoMeta;
  alvo: number;
  iniciadaEm: string; // "AAAA-MM-DD"
  idBase: number; // maior id de postagem quando a meta começou: só contam aprovadas com id maior
  upgradeRecusado: boolean;
}

// ===== Moderação às cegas =====

// Item de GET /moderacoes/fila (DTOPostagemFilaResponse): sem autor e sem comunidade
export type PostagemFila = Pick<Postagem, 'id' | 'ctTexto' | 'ctUrl' | 'ptGerado'>;

// POST /moderacoes (DTOModeracaoRequest): o Java converte o idUsuario no idModerador
export interface ModeracaoCadastro {
  decisao: DecisaoModeracao;
  justificativa: string;
  idUsuario: number;
  idPostagem: number;
}

// Linha da coleção "moderadores" do db.json (imita a T_LGT_MODERADOR; o Java não tem rota para ela)
export interface Moderador {
  id: number; // id_moderador (é o idModerador gravado na moderação)
  nvModerador: number;
  rtModerador: string;
  dtAdesao: string;
  idUsuario: number;
}

// Linha da coleção "criadores" do db.json (imita a T_LGT_CRIADOR; o Java não tem rota para ela)
export interface Criador {
  id: number; // id_criador (é o idCriador gravado na comunidade)
  nvCriador: number;
  rtCriador: string;
  dtAdesao: string;
  idUsuario: number;
}

// Reputação do moderador: só demonstração (o Java guarda só o rótulo rt_moderador)
export interface ModeradorDemo {
  idModerador: number;
  idUsuario: number;
  reputacao: number;
}

export type PerguntaQuiz = {
  pergunta: string;
  opcoes: string[];
  correta: number; // posição da opção correta
  comentario: string;
};

// ----- Denúncias (demonstração: a API não tem essa tabela) -----

export type MotivoDenuncia =
  | 'Informação falsa'
  | 'Ação não realizada'
  | 'Foto não corresponde à ação'
  | 'Conteúdo repetido'
  | 'Conteúdo ofensivo'
  | 'Propaganda'
  | 'Fora do tema da comunidade';

export type PrioridadeDenuncia = 'Normal' | 'Alta' | 'Crítica';
export type AcaoDenuncia = 'MANTER' | 'REMOVER';

export interface Denuncia {
  id: number;
  idPostagem: number;
  idUsuario: number; // quem denunciou
  motivo: MotivoDenuncia;
  detalhe: string;
}

// Decisão do moderador sobre as denúncias de uma postagem
export interface RevisaoDenuncia {
  idPostagem: number;
  acao: AcaoDenuncia;
  parecer: string;
  idUsuario: number; // moderador que revisou
}

// ----- Contestação (demonstração: a API não tem essa tabela) -----

export type StatusContestacao = 'EM_REVISAO' | 'MANTIDA' | 'REVERTIDA';
export type DecisaoRevisao = 'MANTIDA' | 'REVERTIDA';

export interface Contestacao {
  id: number;
  idPostagem: number;
  idUsuario: number; // autor da postagem
  motivo: string;
  abertaEm: string; // "AAAA-MM-DD"
  status: StatusContestacao;
  idModeradorOriginal: number; // idModerador da moderação que rejeitou
  reputacaoOriginal: number;
  idRevisor?: number; // id de usuário do moderador revisor
  reputacaoRevisor?: number;
  parecer?: string;
  decididaEm?: string;
  deltaReputacao?: number; // bônus ou penalidade aplicada ao moderador original
}

// ===== Comunidades e missões =====

// POST e PUT /comunidades (DTOComunidadeRequest): idUsuario é quem faz a requisição
export interface ComunidadeCadastro {
  nmComunidade: string;
  descricao: string;
  idUsuario: number;
}

// Campos do formulário de criar e editar (o idUsuario vem do usuário logado, no contexto)
export type ComunidadeEdicao = Omit<ComunidadeCadastro, 'idUsuario'>;

export type PlanoComunidade = 'Free' | 'Premium';

// Dados que a API não guarda: ficam no front, pelo id da comunidade (demonstração)
export interface ComplementoComunidade {
  temas: string[]; // mesmos labels dos temas do onboarding
  plano: PlanoComunidade;
  verificada: boolean;
  verificacaoPendente?: boolean; // organização aguardando verificação
  parceriaProposta?: boolean; // ONG com parceria proposta (não oficial)
  organizacao?: string;
  regras?: string;
}

// O que a tela de criar envia além do DTO
export type ComplementoNovaComunidade = Pick<ComplementoComunidade, 'plano' | 'organizacao' | 'regras'>;

// Missão: sugestão do Criador. Não dá pontos extras (demonstração: a API não tem essa tabela)
export interface Missao {
  id: number;
  idComunidade: number;
  titulo: string;
  descricao: string;
  impacto: Impacto; // tipo de impacto sugerido
  prazo?: string; // "AAAA-MM-DD"
  encerrada: boolean;
  criadaEm: string;
}

export type MissaoCadastro = Pick<Missao, 'titulo' | 'descricao' | 'impacto' | 'prazo'>;

// Sugestão que uma tela deixa para a próxima (missão → nova postagem; Para você → metas)
export type Sugestao =
  | { tela: 'nova-postagem'; idComunidade: number; impacto: Impacto; missao: string }
  | { tela: 'metas'; periodoDias: PeriodoMeta };

// Perfil de teste mostrado ao lado do simulador (login rápido com a senha padrão do db.json)
export type PerfilTeste = Pick<Usuario, 'username'> & {
  demonstra: string;
};

// Usuário como fica guardado no db.json (o Java também guarda cpf e senha, mas não devolve)
export type UsuarioDoBanco = Usuario & Pick<UsuarioCadastro, 'cpf' | 'senha'>;

// ===== Ranking, liga e distintivos (bloco 6) =====

// Abas do ranking: a Geral vem da API; as outras são demonstração
export type IntervaloRanking = 'Semanal' | 'Mensal' | 'Geral' | 'Entre amigos';

// Divisões da liga semanal, da mais baixa para a mais alta
export type Divisao = 'Tatu' | 'Tamanduá' | 'Onça-pintada' | 'Lobo-guará';

// Faixa da posição na liga: os 3 primeiros sobem, os 3 últimos descem
export type Zona = 'subida' | 'descida' | 'neutra';

// Linha do ranking (chave: id do usuário da API ou nome de demonstração)
export interface ParticipanteRanking {
  chave: string;
  username: string;
  pontos: number;
  eu: boolean;
}

// Distintivo mensal: animal da fauna brasileira em risco de extinção
export interface Distintivo {
  mes: string;
  animal: string;
  status: string; // categoria de ameaça
  emoji: string;
  texto: string;
}

// Como aparece na Pontuação (sem o texto)
export type DistintivoConquistado = Omit<Distintivo, 'texto'>;

// ===== Notificações (bloco 6) =====

export type TipoNotificacao = 'moderacao' | 'contestacao' | 'liga' | 'distintivo' | 'meta' | 'inatividade';

export interface Notificacao {
  id: string; // "post-12" (vem da API) ou "demo-liga" (demonstração)
  tipo: TipoNotificacao;
  titulo: string;
  texto: string;
  em?: string; // "AAAA-MM-DD"; as da API não têm data (a postagem não guarda data)
  demonstracao: boolean;
  lida: boolean;
  idPostagem?: number; // abre o feedback dessa postagem
  tela?: TelaId; // ou abre esta tela
}

// Montada pelo data/liga.ts; o "lida" é colocado pelo contexto
export type NotificacaoBase = Omit<Notificacao, 'lida'>;

export type AcoesNotificacao = {
  notificacoes: Notificacao[];
  naoLidas: number;
  marcarLida: (id: string) => void;
  marcarTodasLidas: () => void;
};

// ===== Carteira e benefícios (bloco 7: demonstração, a API não tem essas tabelas) =====

export type TipoBeneficio = 'Cupom' | 'Doação' | 'Assinatura' | 'Produto' | 'Experiência';
export type StatusResgate = 'Processando' | 'Concluído';

// Benefício de uma empresa parceira ou de uma ONG
export interface Beneficio {
  id: number;
  tipo: TipoBeneficio;
  nome: string;
  custo: number; // em pontos
  parceiro: string;
  area: string;
  ong: boolean; // ONG com parceria proposta (não oficial)
}

// Resgate do usuário, com o código de acompanhamento (ex.: SU-4KJ9-2Q7A)
export interface Resgate {
  id: number;
  codigo: string;
  status: StatusResgate;
  idBeneficio: number;
  custo: number; // custo no dia do resgate
  data: string; // "AAAA-MM-DD"
}

export type AcoesCarteira = {
  resgates: Resgate[]; // do usuário logado, mais novo primeiro
  saldoDisponivel: number; // sdPonto da API menos os resgates
  resgatar: (idBeneficio: number) => Resgate | null; // null: sem saldo
};

// ===== Privacidade (bloco 8: demonstração, a API não tem consentimento nem pedido de exclusão) =====

export type IconePrivacidade = 'dados' | 'olho' | 'cadeado' | 'lei' | 'direitos';

// Cartão explicativo da tela de privacidade (LGPD)
export interface SecaoPrivacidade {
  icone: IconePrivacidade;
  titulo: string;
  texto: string;
}

export type AcoesPrivacidade = {
  ocultoEntreAmigos: boolean; // do usuário logado
  alternarOcultoEntreAmigos: () => void;
  pedidoExclusaoEm: string | null; // "AAAA-MM-DD" do pedido de exclusão dos dados de gamificação
  pedirExclusaoGamificacao: () => void;
};

export type DadosSimulador = {
  usuario: Usuario | null; // usuário logado (null antes do login)
  usuarios: Usuario[];
  comunidades: Comunidade[];
  minhasComunidades: Comunidade[];
  postagens: Postagem[];
  moderacoes: Moderacao[];
  complementos: Record<number, ComplementoUsuario>; // bio e interesses por id de usuário
  metas: Record<number, MetaAtividades>; // meta de atividades por id de usuário
  loading: boolean;
  error: string | null;
  carregarDados: () => Promise<void>;
};

export type AcoesUsuario = {
  entrar: (dados: LoginRequest) => Promise<void>;
  cadastrar: (dados: UsuarioCadastro) => Promise<void>;
  atualizarDados: (dados: UsuarioAtualizacao) => Promise<void>;
  trocarPerfil: (tipoPerfil: TipoPerfil) => Promise<void>;
  excluirConta: () => Promise<void>;
  salvarComplemento: (idUsuario: number, complemento: ComplementoUsuario) => void;
};

export type AcoesPostagem = {
  idPostagemAberta: number | null; // postagem mostrada na tela de feedback
  abrirPostagem: (id: number) => void;
  publicarPostagem: (dados: Omit<PostagemCadastro, 'idUsuario'>) => Promise<Postagem>;
  editarPostagem: (id: number, dados: PostagemEdicao) => void;
  criarMeta: (periodoDias: PeriodoMeta, alvo: number) => void;
  aumentarMeta: (novoAlvo: number) => void;
  subirMetrica: () => void;
  recusarUpgrade: () => void;
  encerrarMeta: () => void;
};

export type AcoesModeracao = {
  // fila às cegas (API)
  fila: PostagemFila[];
  carregarFila: () => Promise<void>;
  abrirAnalise: (idPostagem: number) => void; // usa o idPostagemAberta e vai para a análise
  moderar: (dados: Omit<ModeracaoCadastro, 'idUsuario'>) => Promise<Moderacao>;
  // demonstrações (só no estado do front)
  impedidas: number[];
  declararImpedimento: (idPostagem: number) => void;
  reputacoes: Record<number, number>; // reputação por id de usuário moderador
  denuncias: Denuncia[];
  revisoesDenuncia: RevisaoDenuncia[];
  denunciar: (idPostagem: number, motivo: MotivoDenuncia, detalhe: string) => void;
  revisarDenuncias: (idPostagem: number, acao: AcaoDenuncia, parecer: string) => void;
  contestacoes: Contestacao[];
  idContestacaoAberta: number | null;
  abrirContestacao: (id: number) => void; // vai para a revisão da contestação
  contestar: (idPostagem: number, motivo: string) => void;
  revisarContestacao: (id: number, decisao: DecisaoRevisao, parecer: string) => void;
};

export type AcoesComunidade = {
  // API
  idComunidadeAberta: number | null;
  abrirComunidade: (id: number) => void; // vai para o detalhe
  totalMembros: Record<number, number>; // por id de comunidade
  carregarTotaisMembros: () => Promise<void>; // só as que ainda não têm total
  carregarTotalMembros: (id: number) => Promise<void>; // só a comunidade aberta
  criarComunidade: (dados: ComunidadeEdicao, complemento: ComplementoNovaComunidade) => Promise<Comunidade>;
  editarComunidade: (id: number, dados: ComunidadeEdicao, regras: string) => Promise<void>;
  excluirComunidade: (id: number) => Promise<void>;
  entrarComunidade: (id: number) => Promise<void>;
  sairComunidade: (id: number) => Promise<void>;
  // demonstrações (só no estado do front)
  complementosComunidade: Record<number, ComplementoComunidade>;
  missoes: Missao[];
  criarMissao: (idComunidade: number, dados: MissaoCadastro) => void;
  editarMissao: (id: number, dados: MissaoCadastro) => void;
  encerrarMissao: (id: number) => void;
  sugestao: Sugestao | null;
  seguirSugestao: (sugestao: Sugestao) => void; // guarda a sugestão e abre a tela dela
};

export type SimuladorContextType = NavegacaoSimulador &
  DadosSimulador &
  AcoesUsuario &
  AcoesPostagem &
  AcoesModeracao &
  AcoesComunidade &
  AcoesNotificacao &
  AcoesCarteira &
  AcoesPrivacidade;