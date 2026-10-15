
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