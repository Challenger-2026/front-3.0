import type { FeedbackType, Usuario, Comunidade, Postagem, ErroApi, Membro } from '../types/types';

const JSON_SERVER_URL = 'http://localhost:5000';
const BASE_URL = import.meta.env.VITE_API_URL ?? JSON_SERVER_URL;

// Apontando para a porta 5000, o front está usando o json-server (db.json)
const USANDO_JSON_SERVER = BASE_URL === JSON_SERVER_URL;

// Se a resposta não for ok, repassa a mensagem "erro" da API Java
const tratarResposta = async <T>(response: Response, mensagemPadrao: string): Promise<T> => {
  if (!response.ok) {
    let mensagem = mensagemPadrao;
    try {
      const corpo: ErroApi = await response.json();
      if (corpo.erro) mensagem = corpo.erro;
    } catch {
      // resposta sem JSON: fica a mensagem padrão
    }
    throw new Error(mensagem);
  }
  return response.json();
};

// O json-server devolve o id como texto ("1"); aqui ele volta a ser número
const comIdNumerico = <T extends { id: number }>(item: T): T => ({ ...item, id: Number(item.id) });

export const api = {
  getFeedbacks: async (): Promise<FeedbackType[]> => {
    const response = await fetch(`${BASE_URL}/feedbacks`);
    if (!response.ok) throw new Error('Erro ao buscar dados do servidor');
    return response.json();
  },

  postFeedback: async (feedback: Omit<FeedbackType, 'id'>): Promise<FeedbackType> => {
    const response = await fetch(`${BASE_URL}/feedbacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });
    if (!response.ok) throw new Error('Erro ao salvar feedback');
    return response.json();
  },

  deleteFeedback: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/feedbacks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar feedback');
  },
  
    getUsuario: async (id: number): Promise<Usuario> => {
    const response = await fetch(`${BASE_URL}/usuarios/${id}`);
    const usuario = await tratarResposta<Usuario>(response, 'Erro ao buscar usuário');
    return comIdNumerico(usuario);
  },

  getUsuarios: async (): Promise<Usuario[]> => {
    const response = await fetch(`${BASE_URL}/usuarios`);
    const usuarios = await tratarResposta<Usuario[]>(response, 'Erro ao buscar usuários');
    return usuarios.map(comIdNumerico);
  },

  getComunidades: async (): Promise<Comunidade[]> => {
    const response = await fetch(`${BASE_URL}/comunidades`);
    const comunidades = await tratarResposta<Comunidade[]>(response, 'Erro ao buscar comunidades');
    return comunidades.map(comIdNumerico);
  },

  getComunidadesDoUsuario: async (idUsuario: number): Promise<Comunidade[]> => {
    if (USANDO_JSON_SERVER) {
      const response = await fetch(`${BASE_URL}/membros?idUsuario=${idUsuario}`);
      const membros = await tratarResposta<Membro[]>(response, 'Erro ao buscar comunidades do usuário');
      const idsComunidades = membros.map((m) => m.idComunidade);
      const todas = await api.getComunidades();
      return todas.filter((c) => idsComunidades.includes(c.id));
    }

    const response = await fetch(`${BASE_URL}/comunidades/usuario/${idUsuario}`);
    const comunidades = await tratarResposta<Comunidade[]>(response, 'Erro ao buscar comunidades do usuário');
    return comunidades.map(comIdNumerico);
  },

  getPostagens: async (): Promise<Postagem[]> => {
    const response = await fetch(`${BASE_URL}/postagens`);
    const postagens = await tratarResposta<Postagem[]>(response, 'Erro ao buscar postagens');
    return postagens.map(comIdNumerico);
  },
};