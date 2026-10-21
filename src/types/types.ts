
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
  voltar: () => void;
  reiniciar: () => void;
};

// ===== Dados do Soul Up =====

export type PerfilTipo = 'Comum' | 'Criador' | 'Moderador';
export type StatusPostagem = 'Pendente' | 'Aprovado' | 'Rejeitado';
export type CategoriaId = 'critico' | 'estrutural' | 'rotina';

export type Usuario = {
  id: string;
  nome: string;
  username: string;
  email: string;
  pontos: number;
  perfil: PerfilTipo;
  bio?: string;
  interesses?: string[];
};

export type Comunidade = {
  id: string;
  nome: string;
  descricao: string;
  criadorId: string;
  membros: number;
  entrou: boolean;
  plano: 'Free' | 'Premium';
  verificada: boolean;
};

export type Postagem = {
  id: string;
  conteudo: string;
  status: StatusPostagem;
  pontos: number;
  comunidadeId: string;
  autorId: string;
  autorNome: string;
  criadaEm: string;
  categoriaSelecionada: CategoriaId;
  categoriaId?: CategoriaId;
  validado?: boolean;
};

export type Categoria = {
  id: CategoriaId;
  nome: string;
  pontosAcao: number;
  co2Kg: number;
};

export type DadosSimulador = {
  usuario: Usuario | null;
  comunidades: Comunidade[];
  postagens: Postagem[];
  loading: boolean;
  error: string | null;
  carregarDados: () => Promise<void>;
};

export type SimuladorContextType = NavegacaoSimulador & DadosSimulador;