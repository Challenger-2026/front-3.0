import type {
  FeedbackType,
  Usuario,
  Comunidade,
  Postagem,
  PostagemCadastro,
  Moderacao,
  ErroApi,
  Membro,
  TipoPerfil,
  UsuarioCadastro,
  UsuarioAtualizacao,
  LoginRequest,
  UsuarioDoBanco,
} from '../types/types';
import { buscarCategoriaPorImpacto } from '../data/categorias';

const JSON_SERVER_URL = 'http://localhost:5000';
const BASE_URL = import.meta.env.VITE_API_URL ?? JSON_SERVER_URL;

// Apontando para a porta 5000, o front está usando o json-server (db.json)
const USANDO_JSON_SERVER = BASE_URL === JSON_SERVER_URL;
const HEADERS_JSON = { 'Content-Type': 'application/json' };

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
  if (response.status === 204) return undefined as T; // 204 No Content: sem corpo (DELETE)
  return response.json();
};

// O json-server devolve o id como texto ("1"); aqui ele volta a ser número
const comIdNumerico = <T extends { id: number }>(item: T): T => ({ ...item, id: Number(item.id) });

// Mesmo papel do paraResponse do Java: devolve o usuário sem cpf e sem senha
const paraUsuario = (u: Usuario): Usuario => ({
  id: Number(u.id),
  nmCompleto: u.nmCompleto,
  email: u.email,
  username: u.username,
  dtNascimento: u.dtNascimento,
  sdPonto: u.sdPonto,
  nvUsuario: u.nvUsuario,
  tipoPerfil: u.tipoPerfil,
});

// ----- Apoio do json-server: buscas usadas para imitar as regras do Java -----
const buscarNoJsonServer = async <T>(caminho: string): Promise<T[]> => {
  const response = await fetch(`${BASE_URL}${caminho}`);
  return tratarResposta<T[]>(response, 'Erro ao consultar o json-server');
};

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
  
     // ===== Usuários =====

  getUsuario: async (id: number): Promise<Usuario> => {
    const response = await fetch(`${BASE_URL}/usuarios/${id}`);
    const usuario = await tratarResposta<Usuario>(response, 'Erro ao buscar usuário');
    return paraUsuario(usuario);
  },

  getUsuarios: async (): Promise<Usuario[]> => {
    const response = await fetch(`${BASE_URL}/usuarios`);
    const usuarios = await tratarResposta<Usuario[]>(response, 'Erro ao buscar usuários');
    return usuarios.map(paraUsuario);
  },

  // POST /usuarios — todo usuário começa COMUM, com 0 pontos e nível 1
  cadastrarUsuario: async (dados: UsuarioCadastro): Promise<Usuario> => {
    if (USANDO_JSON_SERVER) {
      // mesma ordem do validarDuplicidade do Java
      const usuarios = await buscarNoJsonServer<UsuarioDoBanco>('/usuarios');
      if (usuarios.some((u) => u.cpf === dados.cpf)) throw new Error('CPF já cadastrado');
      if (usuarios.some((u) => u.email === dados.email)) throw new Error('E-mail já cadastrado');
      if (usuarios.some((u) => u.username === dados.username)) throw new Error('Username já cadastrado');

      const novo: Omit<UsuarioDoBanco, 'id'> = { ...dados, sdPonto: 0, nvUsuario: 1, tipoPerfil: 'COMUM' };
      const response = await fetch(`${BASE_URL}/usuarios`, {
        method: 'POST',
        headers: HEADERS_JSON,
        body: JSON.stringify(novo),
      });
      return paraUsuario(await tratarResposta<Usuario>(response, 'Erro ao cadastrar usuário'));
    }

    const response = await fetch(`${BASE_URL}/usuarios`, {
      method: 'POST',
      headers: HEADERS_JSON,
      body: JSON.stringify(dados),
    });
    return paraUsuario(await tratarResposta<Usuario>(response, 'Erro ao cadastrar usuário'));
  },

  // POST /usuarios/login — 401 "Usuário ou senha inválidos" quando não confere
  login: async (dados: LoginRequest): Promise<Usuario> => {
    if (USANDO_JSON_SERVER) {
      const encontrados = await buscarNoJsonServer<UsuarioDoBanco>(
        `/usuarios?username=${encodeURIComponent(dados.username)}&senha=${encodeURIComponent(dados.senha)}`,
      );
      if (encontrados.length === 0) throw new Error('Usuário ou senha inválidos');
      return paraUsuario(encontrados[0]);
    }

    const response = await fetch(`${BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: HEADERS_JSON,
      body: JSON.stringify(dados),
    });
    return paraUsuario(await tratarResposta<Usuario>(response, 'Erro ao entrar'));
  },

  // PUT /usuarios/{id} — só nome, username e senha
  atualizarUsuario: async (id: number, dados: UsuarioAtualizacao): Promise<Usuario> => {
    if (USANDO_JSON_SERVER) {
      const mesmoUsername = await buscarNoJsonServer<UsuarioDoBanco>(
        `/usuarios?username=${encodeURIComponent(dados.username)}`,
      );
      if (mesmoUsername.some((u) => Number(u.id) !== id)) throw new Error('Username já cadastrado');

      // PATCH: no json-server o PUT trocaria o objeto inteiro e apagaria cpf, pontos etc.
      const response = await fetch(`${BASE_URL}/usuarios/${id}`, {
        method: 'PATCH',
        headers: HEADERS_JSON,
        body: JSON.stringify(dados),
      });
      return paraUsuario(await tratarResposta<Usuario>(response, 'Erro ao atualizar usuário'));
    }

    const response = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: HEADERS_JSON,
      body: JSON.stringify(dados),
    });
    return paraUsuario(await tratarResposta<Usuario>(response, 'Erro ao atualizar usuário'));
  },

  // DELETE /usuarios/{id} — 409 quando há postagens, comunidades ou participações vinculadas
  excluirUsuario: async (id: number): Promise<void> => {
    if (USANDO_JSON_SERVER) {
      const [postagens, criadas, participacoes] = await Promise.all([
        buscarNoJsonServer<Postagem>(`/postagens?idUsuario=${id}`),
        buscarNoJsonServer<Comunidade>(`/comunidades?idCriador=${id}`),
        buscarNoJsonServer<Membro>(`/membros?idUsuario=${id}`),
      ]);
      if (postagens.length > 0 || criadas.length > 0 || participacoes.length > 0) {
        throw new Error('Usuário possui registros vinculados e não pode ser excluído');
      }
    }

    const response = await fetch(`${BASE_URL}/usuarios/${id}`, { method: 'DELETE' });
    await tratarResposta<void>(response, 'Erro ao excluir usuário');
  },

  // PUT /usuarios/{id}/perfil
  trocarPerfil: async (id: number, tipoPerfil: TipoPerfil): Promise<Usuario> => {
    if (USANDO_JSON_SERVER) {
      const atual = await api.getUsuario(id);
      if (atual.tipoPerfil === tipoPerfil) throw new Error('O usuário já possui esse perfil');
      if (atual.tipoPerfil === 'CRIADOR') {
        const criadas = await buscarNoJsonServer<Comunidade>(`/comunidades?idCriador=${id}`);
        if (criadas.length > 0) throw new Error('Criador possui comunidades e não pode deixar de ser criador');
      }

      const response = await fetch(`${BASE_URL}/usuarios/${id}`, {
        method: 'PATCH',
        headers: HEADERS_JSON,
        body: JSON.stringify({ tipoPerfil }),
      });
      return paraUsuario(await tratarResposta<Usuario>(response, 'Erro ao trocar perfil'));
    }

    const response = await fetch(`${BASE_URL}/usuarios/${id}/perfil`, {
      method: 'PUT',
      headers: HEADERS_JSON,
      body: JSON.stringify({ tipoPerfil }),
    });
    return paraUsuario(await tratarResposta<Usuario>(response, 'Erro ao trocar perfil'));
  },

  // ===== Comunidades =====

  getComunidades: async (): Promise<Comunidade[]> => {
    const response = await fetch(`${BASE_URL}/comunidades`);
    const comunidades = await tratarResposta<Comunidade[]>(response, 'Erro ao buscar comunidades');
    return comunidades.map(comIdNumerico);
  },

  getComunidadesDoUsuario: async (idUsuario: number): Promise<Comunidade[]> => {
    if (USANDO_JSON_SERVER) {
      const membros = await buscarNoJsonServer<Membro>(`/membros?idUsuario=${idUsuario}`);
      const idsComunidades = membros.map((m) => m.idComunidade);
      const todas = await api.getComunidades();
      return todas.filter((c) => idsComunidades.includes(c.id));
    }

    const response = await fetch(`${BASE_URL}/comunidades/usuario/${idUsuario}`);
    const comunidades = await tratarResposta<Comunidade[]>(response, 'Erro ao buscar comunidades do usuário');
    return comunidades.map(comIdNumerico);
  },

  // ===== Postagens =====

  getPostagens: async (): Promise<Postagem[]> => {
    const response = await fetch(`${BASE_URL}/postagens`);
    const postagens = await tratarResposta<Postagem[]>(response, 'Erro ao buscar postagens');
    return postagens.map(comIdNumerico);
  },
  
  // POST /postagens — nasce PENDENTE; o ptGerado vem do impacto e só entra no saldo quando a moderação aprova
  publicarPostagem: async (dados: PostagemCadastro): Promise<Postagem> => {
    if (USANDO_JSON_SERVER) {
      // mesma ordem do publicar do PostagemService
      const [usuarios, comunidades, membros] = await Promise.all([
        buscarNoJsonServer<Usuario>(`/usuarios?id=${dados.idUsuario}`),
        buscarNoJsonServer<Comunidade>(`/comunidades?id=${dados.idComunidade}`),
        buscarNoJsonServer<Membro>(`/membros?idUsuario=${dados.idUsuario}&idComunidade=${dados.idComunidade}`),
      ]);
      if (usuarios.length === 0) throw new Error('Usuário não encontrado');
      if (comunidades.length === 0) throw new Error('Comunidade não encontrada');
      if (membros.length === 0) throw new Error('O usuário precisa ser membro da comunidade para publicar');

      // o db.json guarda a postagem como o Java devolve: sem o campo impacto
      const nova: Omit<Postagem, 'id'> = {
        ctTexto: dados.ctTexto,
        ctUrl: dados.ctUrl,
        stValidacao: 'PENDENTE',
        ptGerado: buscarCategoriaPorImpacto(dados.impacto)?.pontosAcao ?? 0,
        idUsuario: dados.idUsuario,
        idComunidade: dados.idComunidade,
      };
      const response = await fetch(`${BASE_URL}/postagens`, {
        method: 'POST',
        headers: HEADERS_JSON,
        body: JSON.stringify(nova),
      });
      return comIdNumerico(await tratarResposta<Postagem>(response, 'Erro ao publicar postagem'));
    }

    const response = await fetch(`${BASE_URL}/postagens`, {
      method: 'POST',
      headers: HEADERS_JSON,
      body: JSON.stringify(dados),
    });
    return comIdNumerico(await tratarResposta<Postagem>(response, 'Erro ao publicar postagem'));
  },

  // ===== Moderações =====

  // GET /moderacoes — usado no feedback para mostrar a decisão e a justificativa
  getModeracoes: async (): Promise<Moderacao[]> => {
    const response = await fetch(`${BASE_URL}/moderacoes`);
    const moderacoes = await tratarResposta<Moderacao[]>(response, 'Erro ao buscar moderações');
    return moderacoes.map(comIdNumerico);
  },
};