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
  ErroComStatus,
  Moderador,
  ModeracaoCadastro,
  PostagemFila,
  Criador,
  ComunidadeCadastro,
} from '../types/types';
import { buscarCategoriaPorImpacto } from '../data/categorias';
import { bonusDoModerador } from '../data/moderacao';
import { hojeIso } from '../data/metas';

const JSON_SERVER_URL = 'http://localhost:5000';
const BASE_URL = import.meta.env.VITE_API_URL ?? JSON_SERVER_URL;

// Apontando para a porta 5000, o front está usando o json-server (db.json)
const USANDO_JSON_SERVER = BASE_URL === JSON_SERVER_URL;
const HEADERS_JSON = { 'Content-Type': 'application/json' };

// Erro com a mensagem e o status da API (a tela usa o status, ex.: 403 na fila de moderação)
const erroDaApi = (mensagem: string, status: number): ErroComStatus => Object.assign(new Error(mensagem), { status });

// Mesmas mensagens do ModeracaoService
const SO_MODERADOR = 'Apenas usuários com perfil MODERADOR podem moderar postagens';

// Mesmas mensagens do ComunidadeService
const SO_CRIADOR = 'Apenas usuários com perfil CRIADOR podem gerenciar comunidades';
const SO_DONO = 'Apenas o criador da comunidade pode alterá-la ou excluí-la';

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
    throw erroDaApi(mensagem, response.status);
  }
  if (response.status === 204) return undefined as T; // 204 No Content: sem corpo (DELETE)
    // 201 sem corpo (ex.: entrar na comunidade): lê como texto antes de converter
  const texto = await response.text();
  return (texto ? JSON.parse(texto) : undefined) as T;
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


// Linha da T_LGT_MODERADOR do usuário (o buscarModeradorOuErro do Java); 403 se não for moderador
const buscarModeradorNoJsonServer = async (idUsuario: number): Promise<Moderador> => {
  const encontrados = await buscarNoJsonServer<Moderador>(`/moderadores?idUsuario=${idUsuario}`);
  if (encontrados.length === 0) throw erroDaApi(SO_MODERADOR, 403);
  return comIdNumerico(encontrados[0]);
};

// removerPerfil do Java: o moderador que já moderou não pode deixar o cargo (409)
const conferirSaidaDoModerador = async (idUsuario: number): Promise<Moderador[]> => {
  const moderadores = await buscarNoJsonServer<Moderador>(`/moderadores?idUsuario=${idUsuario}`);
  for (const m of moderadores) {
    const feitas = await buscarNoJsonServer<Moderacao>(`/moderacoes?idModerador=${m.id}`);
    if (feitas.length > 0) {
      throw erroDaApi('Moderador possui moderações registradas e não pode deixar de ser moderador', 409);
    }
  }
  return moderadores;
};

// Apaga as linhas da T_LGT_MODERADOR do usuário
const apagarModeradores = async (moderadores: Moderador[]) => {
  for (const m of moderadores) {
    await fetch(`${BASE_URL}/moderadores/${m.id}`, { method: 'DELETE' });
  }
};

// Linha da T_LGT_CRIADOR do usuário (o buscarCriadorOuErro do Java); 403 se não for criador
const buscarCriadorNoJsonServer = async (idUsuario: number): Promise<Criador> => {
  const encontrados = await buscarNoJsonServer<Criador>(`/criadores?idUsuario=${idUsuario}`);
  if (encontrados.length === 0) throw erroDaApi(SO_CRIADOR, 403);
  return comIdNumerico(encontrados[0]);
};

// buscarComunidadeOuErro do Java: 404 se a comunidade não existe
const buscarComunidadeNoJsonServer = async (id: number): Promise<Comunidade> => {
  const encontradas = await buscarNoJsonServer<Comunidade>(`/comunidades?id=${id}`);
  if (encontradas.length === 0) throw erroDaApi('Comunidade não encontrada', 404);
  return comIdNumerico(encontradas[0]);
};

// validarDono do Java: precisa ser criador (403) e o criador desta comunidade (403)
const validarDonoNoJsonServer = async (comunidade: Comunidade, idUsuario: number) => {
  const criador = await buscarCriadorNoJsonServer(idUsuario);
  if (criador.id !== comunidade.idCriador) throw erroDaApi(SO_DONO, 403);
};

// removerPerfil do Java: o criador que tem comunidades não pode deixar o cargo (409)
const conferirSaidaDoCriador = async (idUsuario: number): Promise<Criador[]> => {
  const criadores = await buscarNoJsonServer<Criador>(`/criadores?idUsuario=${idUsuario}`);
  for (const c of criadores) {
    const criadas = await buscarNoJsonServer<Comunidade>(`/comunidades?idCriador=${c.id}`);
    if (criadas.length > 0) {
      throw erroDaApi('Criador possui comunidades e não pode deixar de ser criador', 409);
    }
  }
  return criadores;
};

// Apaga as linhas da T_LGT_CRIADOR do usuário
const apagarCriadores = async (criadores: Criador[]) => {
  for (const c of criadores) {
    await fetch(`${BASE_URL}/criadores/${c.id}`, { method: 'DELETE' });
  }
};

// PATCH no json-server (no lugar dos UPDATE que o Java faz direto no banco)
const alterarNoJsonServer = async <T>(caminho: string, dados: object): Promise<T> => {
  const response = await fetch(`${BASE_URL}${caminho}`, {
    method: 'PATCH',
    headers: HEADERS_JSON,
    body: JSON.stringify(dados),
  });
  return tratarResposta<T>(response, 'Erro ao gravar no json-server');
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
            // o Java confere o perfil (criador/moderador) antes do usuário
      const moderadores = await conferirSaidaDoModerador(id);
      const criadores = await conferirSaidaDoCriador(id);

      const [postagens, participacoes] = await Promise.all([
        buscarNoJsonServer<Postagem>(`/postagens?idUsuario=${id}`),
        buscarNoJsonServer<Membro>(`/membros?idUsuario=${id}`),
      ]);
      if (postagens.length > 0 || participacoes.length > 0) {
        throw new Error('Usuário possui registros vinculados e não pode ser excluído');
      }
      await apagarModeradores(moderadores);
      await apagarCriadores(criadores);
    }

    const response = await fetch(`${BASE_URL}/usuarios/${id}`, { method: 'DELETE' });
    await tratarResposta<void>(response, 'Erro ao excluir usuário');
  },

  // PUT /usuarios/{id}/perfil
  trocarPerfil: async (id: number, tipoPerfil: TipoPerfil): Promise<Usuario> => {
    if (USANDO_JSON_SERVER) {
      const atual = await api.getUsuario(id);
      if (atual.tipoPerfil === tipoPerfil) throw new Error('O usuário já possui esse perfil');

      // removerPerfil do Java: apaga a linha do perfil antigo (409 se ainda tiver comunidades ou moderações)
      if (atual.tipoPerfil === 'CRIADOR') await apagarCriadores(await conferirSaidaDoCriador(id));
      if (atual.tipoPerfil === 'MODERADOR') await apagarModeradores(await conferirSaidaDoModerador(id));

      // criarPerfil do Java: o novo moderador ganha a linha na T_LGT_MODERADOR (nível 1, INICIANTE)
      if (tipoPerfil === 'MODERADOR') {
        const novo: Omit<Moderador, 'id'> = {
          nvModerador: 1,
          rtModerador: 'INICIANTE',
          dtAdesao: hojeIso(),
          idUsuario: id,
        };
        const response = await fetch(`${BASE_URL}/moderadores`, {
          method: 'POST',
          headers: HEADERS_JSON,
          body: JSON.stringify(novo),
        });
        await tratarResposta<Moderador>(response, 'Erro ao criar moderador');
      }

      // criarPerfil do Java: o novo criador ganha a linha na T_LGT_CRIADOR (nível 1, INICIANTE)
      if (tipoPerfil === 'CRIADOR') {
        const novo: Omit<Criador, 'id'> = {
          nvCriador: 1,
          rtCriador: 'INICIANTE',
          dtAdesao: hojeIso(),
          idUsuario: id,
        };
        const response = await fetch(`${BASE_URL}/criadores`, {
          method: 'POST',
          headers: HEADERS_JSON,
          body: JSON.stringify(novo),
        });
        await tratarResposta<Criador>(response, 'Erro ao criar criador');
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
  
  // GET /comunidades/{id}/membros/total
  getTotalMembros: async (idComunidade: number): Promise<number> => {
    if (USANDO_JSON_SERVER) {
      await buscarComunidadeNoJsonServer(idComunidade); // 404
      const membros = await buscarNoJsonServer<Membro>(`/membros?idComunidade=${idComunidade}`);
      return membros.length;
    }

    const response = await fetch(`${BASE_URL}/comunidades/${idComunidade}/membros/total`);
    return tratarResposta<number>(response, 'Erro ao contar os membros');
  },

  // POST /comunidades — só CRIADOR; quem cria já entra como membro
  cadastrarComunidade: async (dados: ComunidadeCadastro): Promise<Comunidade> => {
    if (USANDO_JSON_SERVER) {
      // mesma ordem do cadastrar do ComunidadeService
      const criador = await buscarCriadorNoJsonServer(dados.idUsuario); // 403

      const nova: Omit<Comunidade, 'id'> = {
        nmComunidade: dados.nmComunidade,
        descricao: dados.descricao,
        dtCriacao: hojeIso(),
        idCriador: criador.id,
        idRanking: null, // nasce sem ranking
        idUsuarioCriador: dados.idUsuario,
      };
      const response = await fetch(`${BASE_URL}/comunidades`, {
        method: 'POST',
        headers: HEADERS_JSON,
        body: JSON.stringify(nova),
      });
      const criada = comIdNumerico(await tratarResposta<Comunidade>(response, 'Erro ao criar comunidade'));

      const membro: Omit<Membro, 'id'> = { idUsuario: dados.idUsuario, idComunidade: criada.id };
      await fetch(`${BASE_URL}/membros`, { method: 'POST', headers: HEADERS_JSON, body: JSON.stringify(membro) });
      return criada;
    }

    const response = await fetch(`${BASE_URL}/comunidades`, {
      method: 'POST',
      headers: HEADERS_JSON,
      body: JSON.stringify(dados),
    });
    return comIdNumerico(await tratarResposta<Comunidade>(response, 'Erro ao criar comunidade'));
  },

  // PUT /comunidades/{id} — só nome e descrição; só o criador da comunidade
  atualizarComunidade: async (id: number, dados: ComunidadeCadastro): Promise<Comunidade> => {
    if (USANDO_JSON_SERVER) {
      const comunidade = await buscarComunidadeNoJsonServer(id); // 404
      await validarDonoNoJsonServer(comunidade, dados.idUsuario); // 403
      const alterada = await alterarNoJsonServer<Comunidade>(`/comunidades/${id}`, {
        nmComunidade: dados.nmComunidade,
        descricao: dados.descricao,
      });
      return comIdNumerico(alterada);
    }

    const response = await fetch(`${BASE_URL}/comunidades/${id}`, {
      method: 'PUT',
      headers: HEADERS_JSON,
      body: JSON.stringify(dados),
    });
    return comIdNumerico(await tratarResposta<Comunidade>(response, 'Erro ao atualizar comunidade'));
  },

  // DELETE /comunidades/{id}?idUsuario= — 409 se houver outros membros ou postagens
  excluirComunidade: async (id: number, idUsuario: number): Promise<void> => {
    if (USANDO_JSON_SERVER) {
      const comunidade = await buscarComunidadeNoJsonServer(id); // 404
      await validarDonoNoJsonServer(comunidade, idUsuario); // 403

      // o Java tira o criador dos membros e tenta excluir: a FK recusa se sobrar membro ou postagem
      const [membros, postagens] = await Promise.all([
        buscarNoJsonServer<Membro>(`/membros?idComunidade=${id}`),
        buscarNoJsonServer<Postagem>(`/postagens?idComunidade=${id}`),
      ]);
      const outrosMembros = membros.filter((m) => m.idUsuario !== idUsuario);
      if (outrosMembros.length > 0 || postagens.length > 0) {
        throw erroDaApi('Comunidade possui membros ou postagens e não pode ser excluída', 409);
      }
      for (const m of membros) {
        await fetch(`${BASE_URL}/membros/${m.id}`, { method: 'DELETE' });
      }
    }

    const response = await fetch(
      USANDO_JSON_SERVER ? `${BASE_URL}/comunidades/${id}` : `${BASE_URL}/comunidades/${id}?idUsuario=${idUsuario}`,
      { method: 'DELETE' },
    );
    await tratarResposta<void>(response, 'Erro ao excluir comunidade');
  },

  // POST /comunidades/{id}/membros?idUsuario= — entrar na comunidade (201 sem corpo)
  entrarComunidade: async (id: number, idUsuario: number): Promise<void> => {
    if (USANDO_JSON_SERVER) {
      // mesma ordem do entrar do ComunidadeService
      await buscarComunidadeNoJsonServer(id); // 404
      const usuarios = await buscarNoJsonServer<Usuario>(`/usuarios?id=${idUsuario}`);
      if (usuarios.length === 0) throw erroDaApi('Usuário não encontrado', 404);
      const membro = await buscarNoJsonServer<Membro>(`/membros?idUsuario=${idUsuario}&idComunidade=${id}`);
      if (membro.length > 0) throw erroDaApi('O usuário já é membro desta comunidade', 409);

      const novo: Omit<Membro, 'id'> = { idUsuario, idComunidade: id };
      const response = await fetch(`${BASE_URL}/membros`, {
        method: 'POST',
        headers: HEADERS_JSON,
        body: JSON.stringify(novo),
      });
      await tratarResposta<Membro>(response, 'Erro ao entrar na comunidade');
      return;
    }

    const response = await fetch(`${BASE_URL}/comunidades/${id}/membros?idUsuario=${idUsuario}`, { method: 'POST' });
    await tratarResposta<void>(response, 'Erro ao entrar na comunidade');
  },

  // DELETE /comunidades/{id}/membros?idUsuario= — sair da comunidade (o criador não sai da própria)
  sairComunidade: async (id: number, idUsuario: number): Promise<void> => {
    if (USANDO_JSON_SERVER) {
      // mesma ordem do sair do ComunidadeService
      const comunidade = await buscarComunidadeNoJsonServer(id); // 404
      const criadores = await buscarNoJsonServer<Criador>(`/criadores?idUsuario=${idUsuario}`);
      if (criadores.some((c) => Number(c.id) === comunidade.idCriador)) {
        throw erroDaApi('O criador não pode sair da própria comunidade', 409);
      }
      const membros = await buscarNoJsonServer<Membro>(`/membros?idUsuario=${idUsuario}&idComunidade=${id}`);
      if (membros.length === 0) throw erroDaApi('O usuário não é membro desta comunidade', 409);
      for (const m of membros) {
        await fetch(`${BASE_URL}/membros/${m.id}`, { method: 'DELETE' });
      }
      return;
    }

    const response = await fetch(`${BASE_URL}/comunidades/${id}/membros?idUsuario=${idUsuario}`, { method: 'DELETE' });
    await tratarResposta<void>(response, 'Erro ao sair da comunidade');
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
  
  // GET /moderacoes/fila?idUsuario= — fila às cegas: sem as próprias postagens e sem as das comunidades dele
  getFilaModeracao: async (idUsuario: number): Promise<PostagemFila[]> => {
    if (USANDO_JSON_SERVER) {
      await buscarModeradorNoJsonServer(idUsuario); // 403 se não for moderador
      const [pendentes, membros] = await Promise.all([
        buscarNoJsonServer<Postagem>('/postagens?stValidacao=PENDENTE'),
        buscarNoJsonServer<Membro>(`/membros?idUsuario=${idUsuario}`),
      ]);
      const minhasComunidades = membros.map((m) => m.idComunidade);
      return pendentes
        .filter((p) => p.idUsuario !== idUsuario && !minhasComunidades.includes(p.idComunidade))
        .map((p) => ({ id: Number(p.id), ctTexto: p.ctTexto, ctUrl: p.ctUrl, ptGerado: p.ptGerado }));
    }

    const response = await fetch(`${BASE_URL}/moderacoes/fila?idUsuario=${idUsuario}`);
    const fila = await tratarResposta<PostagemFila[]>(response, 'Erro ao buscar a fila de moderação');
    return fila.map(comIdNumerico);
  },

  // POST /moderacoes — aprova (A) ou reprova (R); se aprovar, o Java soma o ptGerado no sdPonto do autor
  moderarPostagem: async (dados: ModeracaoCadastro): Promise<Moderacao> => {
    if (USANDO_JSON_SERVER) {
      // mesma ordem do moderar do ModeracaoService
      const moderador = await buscarModeradorNoJsonServer(dados.idUsuario);
      const [encontradas, jaModeradas] = await Promise.all([
        buscarNoJsonServer<Postagem>(`/postagens?id=${dados.idPostagem}`),
        buscarNoJsonServer<Moderacao>(`/moderacoes?idPostagem=${dados.idPostagem}`),
      ]);
      if (encontradas.length === 0) throw erroDaApi('Postagem não encontrada', 404);
      const postagem = encontradas[0];
      if (postagem.stValidacao !== 'PENDENTE' || jaModeradas.length > 0) {
        throw erroDaApi('Esta postagem já foi moderada', 409);
      }
      if (postagem.idUsuario === dados.idUsuario) {
        throw erroDaApi('O moderador não pode avaliar a própria postagem', 409);
      }
      const membro = await buscarNoJsonServer<Membro>(
        `/membros?idUsuario=${dados.idUsuario}&idComunidade=${postagem.idComunidade}`,
      );
      if (membro.length > 0) {
        throw erroDaApi('O moderador não pode avaliar postagens de comunidades de que participa', 409);
      }

      const nova: Omit<Moderacao, 'id'> = {
        decisao: dados.decisao,
        justificativa: dados.justificativa,
        bnModerador: bonusDoModerador(postagem.ptGerado),
        idModerador: moderador.id,
        idPostagem: dados.idPostagem,
      };
      const response = await fetch(`${BASE_URL}/moderacoes`, {
        method: 'POST',
        headers: HEADERS_JSON,
        body: JSON.stringify(nova),
      });
      const criada = comIdNumerico(await tratarResposta<Moderacao>(response, 'Erro ao moderar postagem'));

      if (dados.decisao === 'A') {
        await alterarNoJsonServer(`/postagens/${dados.idPostagem}`, { stValidacao: 'APROVADO' });
        const autor = await api.getUsuario(postagem.idUsuario);
        const sdPonto = Number((autor.sdPonto + postagem.ptGerado).toFixed(2)); // somarPontos do Java
        await alterarNoJsonServer(`/usuarios/${autor.id}`, { sdPonto });
      } else {
        await alterarNoJsonServer(`/postagens/${dados.idPostagem}`, { stValidacao: 'REJEITADO' });
      }
      return criada;
    }

    const response = await fetch(`${BASE_URL}/moderacoes`, {
      method: 'POST',
      headers: HEADERS_JSON,
      body: JSON.stringify(dados),
    });
    return comIdNumerico(await tratarResposta<Moderacao>(response, 'Erro ao moderar postagem'));
  },
};