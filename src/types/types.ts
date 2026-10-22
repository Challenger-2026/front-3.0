
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
  | 'revisao';

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
  idCriador: number;
  idRanking: number | null; // null enquanto a comunidade não tem ranking
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

// Perfil de teste mostrado ao lado do simulador (login rápido com a senha padrão do db.json)
export type PerfilTeste = Pick<Usuario, 'username'> & {
  demonstra: string;
};

// Usuário como fica guardado no db.json (o Java também guarda cpf e senha, mas não devolve)
export type UsuarioDoBanco = Usuario & Pick<UsuarioCadastro, 'cpf' | 'senha'>;

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

export type SimuladorContextType = NavegacaoSimulador &
  DadosSimulador &
  AcoesUsuario &
  AcoesPostagem &
  AcoesModeracao;