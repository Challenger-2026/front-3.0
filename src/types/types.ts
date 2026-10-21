
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
  | 'carteira'
  | 'perfil'
  | 'notificacoes';

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
  nome: string;
  pontosAcao: number;
  co2Kg: number;
};

// Formato de erro devolvido pela API Java
export interface ErroApi {
  erro: string;
  status: number;
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

// Usuário como fica guardado no db.json (o Java também guarda cpf e senha, mas não devolve)
export type UsuarioDoBanco = Usuario & Pick<UsuarioCadastro, 'cpf' | 'senha'>;

export type DadosSimulador = {
  usuario: Usuario | null; // usuário logado (null antes do login)
  usuarios: Usuario[];
  comunidades: Comunidade[];
  minhasComunidades: Comunidade[];
  postagens: Postagem[];
  complementos: Record<number, ComplementoUsuario>; // bio e interesses por id de usuário
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

export type SimuladorContextType = NavegacaoSimulador & DadosSimulador & AcoesUsuario;