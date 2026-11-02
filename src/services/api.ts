import type {
  FeedbackType,
  Usuario,
  Comunidade,
  Postagem,
  PostagemCadastro,
  Moderacao,
  Membro,
  TipoPerfil,
  UsuarioCadastro,
  UsuarioAtualizacao,
  LoginRequest,
  UsuarioDoBanco,
  Moderador,
  ModeracaoCadastro,
  PostagemFila,
  Criador,
  ComunidadeCadastro,
} from '../types/types';
import { buscarCategoriaPorImpacto } from '../data/categorias';
import { bonusDoModerador } from '../data/moderacao';
import { hojeIso } from '../data/metas';
import { requisitar, simularJava, erroDaApi, USANDO_JSON_SERVER } from './http';

// Todas as chamadas passam pelo requisitar (services/http.ts): ele faz o fetch, trata o erro e registra a chamada.
// Cada função fica dentro do simularJava: no modo json-server, ele registra a linha "como o Java responderia"
// (endpoint real do Java, status e tempo total). Com a API Java ligada, ele só roda a função.
// Aqui ficam só as regras: o que o json-server precisa imitar do Java e as conversões das respostas.

// Mesmas mensagens do ModeracaoService
const SO_MODERADOR = 'Apenas usuários com perfil MODERADOR podem moderar postagens';

// Mesmas mensagens do ComunidadeService
const SO_CRIADOR = 'Apenas usuários com perfil CRIADOR podem gerenciar comunidades';
const SO_DONO = 'Apenas o criador da comunidade pode alterá-la ou excluí-la';

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
// Com a API Java essas chamadas não existem (o Java faz tudo no banco)
const buscarNoJsonServer = <T>(caminho: string): Promise<T[]> =>
  requisitar<T[]>('GET', caminho, { mensagemErro: 'Erro ao consultar o json-server' });

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
    await requisitar<void>('DELETE', `/moderadores/${m.id}`, { mensagemErro: 'Erro ao remover moderador' });
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
    await requisitar<void>('DELETE', `/criadores/${c.id}`, { mensagemErro: 'Erro ao remover criador' });
  }
};

// Apaga as linhas de participação (T_LGT_USUARIO_COMUNIDADE)
const apagarMembros = async (membros: Membro[]) => {
  for (const m of membros) {
    await requisitar<void>('DELETE', `/membros/${m.id}`, { mensagemErro: 'Erro ao remover membro' });
  }
};

// Buscas usadas dentro de outras funções (sem linha simulada própria)
const buscarUsuario = async (id: number): Promise<Usuario> =>
  paraUsuario(await requisitar<Usuario>('GET', `/usuarios/${id}`, { mensagemErro: 'Erro ao buscar usuário' }));

const buscarComunidades = async (): Promise<Comunidade[]> => {
  const comunidades = await requisitar<Comunidade[]>('GET', '/comunidades', { mensagemErro: 'Erro ao buscar comunidades' });
  return comunidades.map(comIdNumerico);
};

// PATCH no json-server (no lugar dos UPDATE que o Java faz direto no banco)
const alterarNoJsonServer = <T>(caminho: string, dados: object): Promise<T> =>
  requisitar<T>('PATCH', caminho, { corpo: dados, mensagemErro: 'Erro ao gravar no json-server' });

export const api = {
  // ===== Feedbacks (página Contato; só existe no json-server, sem linha simulada) =====

  getFeedbacks: (): Promise<FeedbackType[]> =>
    requisitar<FeedbackType[]>('GET', '/feedbacks', { mensagemErro: 'Erro ao buscar dados do servidor', soJsonServer: true }),

  postFeedback: (feedback: Omit<FeedbackType, 'id'>): Promise<FeedbackType> =>
    requisitar<FeedbackType>('POST', '/feedbacks', { corpo: feedback, mensagemErro: 'Erro ao salvar feedback', soJsonServer: true }),

  deleteFeedback: (id: string): Promise<void> =>
    requisitar<void>('DELETE', `/feedbacks/${id}`, { mensagemErro: 'Erro ao deletar feedback', soJsonServer: true }),

  // ===== Usuários =====

  // GET /usuarios/{id}
  getUsuario: (id: number): Promise<Usuario> => simularJava('GET', `/usuarios/${id}`, () => buscarUsuario(id)),

  // GET /usuarios
  getUsuarios: (): Promise<Usuario[]> =>
    simularJava('GET', '/usuarios', async () => {
      const usuarios = await requisitar<Usuario[]>('GET', '/usuarios', { mensagemErro: 'Erro ao buscar usuários' });
      return usuarios.map(paraUsuario);
    }),

  // POST /usuarios — todo usuário começa COMUM, com 0 pontos e nível 1
  cadastrarUsuario: (dados: UsuarioCadastro): Promise<Usuario> =>
    simularJava('POST', '/usuarios', async () => {
      if (USANDO_JSON_SERVER) {
        // mesma ordem do validarDuplicidade do Java (409)
        const usuarios = await buscarNoJsonServer<UsuarioDoBanco>('/usuarios');
        if (usuarios.some((u) => u.cpf === dados.cpf)) throw erroDaApi('CPF já cadastrado', 409);
        if (usuarios.some((u) => u.email === dados.email)) throw erroDaApi('E-mail já cadastrado', 409);
        if (usuarios.some((u) => u.username === dados.username)) throw erroDaApi('Username já cadastrado', 409);

        const novo: Omit<UsuarioDoBanco, 'id'> = { ...dados, sdPonto: 0, nvUsuario: 1, tipoPerfil: 'COMUM' };
        const criado = await requisitar<Usuario>('POST', '/usuarios', { corpo: novo, mensagemErro: 'Erro ao cadastrar usuário' });
        return paraUsuario(criado);
      }

      const criado = await requisitar<Usuario>('POST', '/usuarios', { corpo: dados, mensagemErro: 'Erro ao cadastrar usuário' });
      return paraUsuario(criado);
    }),

  // POST /usuarios/login — 200; 401 "Usuário ou senha inválidos" quando não confere
  login: (dados: LoginRequest): Promise<Usuario> =>
    simularJava(
      'POST',
      '/usuarios/login',
      async () => {
        if (USANDO_JSON_SERVER) {
          // o json-server só filtra pela URL: a senha vai na rota, e o registro do http.ts a esconde
          const encontrados = await requisitar<UsuarioDoBanco[]>(
            'GET',
            `/usuarios?username=${encodeURIComponent(dados.username)}&senha=${encodeURIComponent(dados.senha)}`,
            { mensagemErro: 'Erro ao entrar' },
          );
          if (encontrados.length === 0) throw erroDaApi('Usuário ou senha inválidos', 401);
          return paraUsuario(encontrados[0]);
        }

        const logado = await requisitar<Usuario>('POST', '/usuarios/login', { corpo: dados, mensagemErro: 'Erro ao entrar' });
        return paraUsuario(logado);
      },
      200,
    ),

  // PUT /usuarios/{id} — só nome, username e senha
  atualizarUsuario: (id: number, dados: UsuarioAtualizacao): Promise<Usuario> =>
    simularJava('PUT', `/usuarios/${id}`, async () => {
      if (USANDO_JSON_SERVER) {
        const mesmoUsername = await buscarNoJsonServer<UsuarioDoBanco>(
          `/usuarios?username=${encodeURIComponent(dados.username)}`,
        );
        if (mesmoUsername.some((u) => Number(u.id) !== id)) throw erroDaApi('Username já cadastrado', 409);

        // PATCH: no json-server o PUT trocaria o objeto inteiro e apagaria cpf, pontos etc.
        const alterado = await requisitar<Usuario>('PATCH', `/usuarios/${id}`, {
          corpo: dados,
          mensagemErro: 'Erro ao atualizar usuário',
        });
        return paraUsuario(alterado);
      }

      const alterado = await requisitar<Usuario>('PUT', `/usuarios/${id}`, { corpo: dados, mensagemErro: 'Erro ao atualizar usuário' });
      return paraUsuario(alterado);
    }),

  // DELETE /usuarios/{id} — 409 quando há postagens, comunidades ou participações vinculadas
  excluirUsuario: (id: number): Promise<void> =>
    simularJava('DELETE', `/usuarios/${id}`, async () => {
      if (USANDO_JSON_SERVER) {
        // o Java confere o perfil (criador/moderador) antes do usuário
        const moderadores = await conferirSaidaDoModerador(id);
        const criadores = await conferirSaidaDoCriador(id);

        const [postagens, participacoes] = await Promise.all([
          buscarNoJsonServer<Postagem>(`/postagens?idUsuario=${id}`),
          buscarNoJsonServer<Membro>(`/membros?idUsuario=${id}`),
        ]);
        if (postagens.length > 0 || participacoes.length > 0) {
          throw erroDaApi('Usuário possui registros vinculados e não pode ser excluído', 409);
        }
        await apagarModeradores(moderadores);
        await apagarCriadores(criadores);
      }

      await requisitar<void>('DELETE', `/usuarios/${id}`, { mensagemErro: 'Erro ao excluir usuário' });
    }),

  // PUT /usuarios/{id}/perfil
  trocarPerfil: (id: number, tipoPerfil: TipoPerfil): Promise<Usuario> =>
    simularJava('PUT', `/usuarios/${id}/perfil`, async () => {
      if (USANDO_JSON_SERVER) {
        const atual = await buscarUsuario(id); // 404
        if (atual.tipoPerfil === tipoPerfil) throw erroDaApi('O usuário já possui esse perfil', 409);

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
          await requisitar<Moderador>('POST', '/moderadores', { corpo: novo, mensagemErro: 'Erro ao criar moderador' });
        }

        // criarPerfil do Java: o novo criador ganha a linha na T_LGT_CRIADOR (nível 1, INICIANTE)
        if (tipoPerfil === 'CRIADOR') {
          const novo: Omit<Criador, 'id'> = {
            nvCriador: 1,
            rtCriador: 'INICIANTE',
            dtAdesao: hojeIso(),
            idUsuario: id,
          };
          await requisitar<Criador>('POST', '/criadores', { corpo: novo, mensagemErro: 'Erro ao criar criador' });
        }

        const alterado = await requisitar<Usuario>('PATCH', `/usuarios/${id}`, {
          corpo: { tipoPerfil },
          mensagemErro: 'Erro ao trocar perfil',
        });
        return paraUsuario(alterado);
      }

      const alterado = await requisitar<Usuario>('PUT', `/usuarios/${id}/perfil`, {
        corpo: { tipoPerfil },
        mensagemErro: 'Erro ao trocar perfil',
      });
      return paraUsuario(alterado);
    }),

  // ===== Comunidades =====

  // GET /comunidades
  getComunidades: (): Promise<Comunidade[]> => simularJava('GET', '/comunidades', buscarComunidades),

  // GET /comunidades/usuario/{idUsuario}
  getComunidadesDoUsuario: (idUsuario: number): Promise<Comunidade[]> =>
    simularJava('GET', `/comunidades/usuario/${idUsuario}`, async () => {
      if (USANDO_JSON_SERVER) {
        const membros = await buscarNoJsonServer<Membro>(`/membros?idUsuario=${idUsuario}`);
        const idsComunidades = membros.map((m) => m.idComunidade);
        const todas = await buscarComunidades();
        return todas.filter((c) => idsComunidades.includes(c.id));
      }

      const comunidades = await requisitar<Comunidade[]>('GET', `/comunidades/usuario/${idUsuario}`, {
        mensagemErro: 'Erro ao buscar comunidades do usuário',
      });
      return comunidades.map(comIdNumerico);
    }),

  // GET /comunidades/{id}/membros/total
  getTotalMembros: (idComunidade: number): Promise<number> =>
    simularJava('GET', `/comunidades/${idComunidade}/membros/total`, async () => {
      if (USANDO_JSON_SERVER) {
        await buscarComunidadeNoJsonServer(idComunidade); // 404
        const membros = await requisitar<Membro[]>('GET', `/membros?idComunidade=${idComunidade}`, {
          mensagemErro: 'Erro ao contar os membros',
        });
        return membros.length;
      }

      return requisitar<number>('GET', `/comunidades/${idComunidade}/membros/total`, { mensagemErro: 'Erro ao contar os membros' });
    }),

  // POST /comunidades — só CRIADOR; quem cria já entra como membro
  cadastrarComunidade: (dados: ComunidadeCadastro): Promise<Comunidade> =>
    simularJava('POST', '/comunidades', async () => {
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
        const criada = comIdNumerico(
          await requisitar<Comunidade>('POST', '/comunidades', { corpo: nova, mensagemErro: 'Erro ao criar comunidade' }),
        );

        const membro: Omit<Membro, 'id'> = { idUsuario: dados.idUsuario, idComunidade: criada.id };
        await requisitar<Membro>('POST', '/membros', { corpo: membro, mensagemErro: 'Erro ao entrar na comunidade' });
        return criada;
      }

      const criada = await requisitar<Comunidade>('POST', '/comunidades', { corpo: dados, mensagemErro: 'Erro ao criar comunidade' });
      return comIdNumerico(criada);
    }),

  // PUT /comunidades/{id} — só nome e descrição; só o criador da comunidade
  atualizarComunidade: (id: number, dados: ComunidadeCadastro): Promise<Comunidade> =>
    simularJava('PUT', `/comunidades/${id}`, async () => {
      if (USANDO_JSON_SERVER) {
        const comunidade = await buscarComunidadeNoJsonServer(id); // 404
        await validarDonoNoJsonServer(comunidade, dados.idUsuario); // 403
        const alterada = await requisitar<Comunidade>('PATCH', `/comunidades/${id}`, {
          corpo: { nmComunidade: dados.nmComunidade, descricao: dados.descricao },
          mensagemErro: 'Erro ao atualizar comunidade',
        });
        return comIdNumerico(alterada);
      }

      const alterada = await requisitar<Comunidade>('PUT', `/comunidades/${id}`, {
        corpo: dados,
        mensagemErro: 'Erro ao atualizar comunidade',
      });
      return comIdNumerico(alterada);
    }),

  // DELETE /comunidades/{id}?idUsuario= — 409 se houver outros membros ou postagens
  excluirComunidade: (id: number, idUsuario: number): Promise<void> =>
    simularJava('DELETE', `/comunidades/${id}?idUsuario=${idUsuario}`, async () => {
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
        await apagarMembros(membros);
        await requisitar<void>('DELETE', `/comunidades/${id}`, { mensagemErro: 'Erro ao excluir comunidade' });
        return;
      }

      await requisitar<void>('DELETE', `/comunidades/${id}?idUsuario=${idUsuario}`, { mensagemErro: 'Erro ao excluir comunidade' });
    }),

  // POST /comunidades/{id}/membros?idUsuario= — entrar na comunidade (201 sem corpo)
  entrarComunidade: (id: number, idUsuario: number): Promise<void> =>
    simularJava('POST', `/comunidades/${id}/membros?idUsuario=${idUsuario}`, async () => {
      if (USANDO_JSON_SERVER) {
        // mesma ordem do entrar do ComunidadeService
        await buscarComunidadeNoJsonServer(id); // 404
        const usuarios = await buscarNoJsonServer<Usuario>(`/usuarios?id=${idUsuario}`);
        if (usuarios.length === 0) throw erroDaApi('Usuário não encontrado', 404);
        const membro = await buscarNoJsonServer<Membro>(`/membros?idUsuario=${idUsuario}&idComunidade=${id}`);
        if (membro.length > 0) throw erroDaApi('O usuário já é membro desta comunidade', 409);

        const novo: Omit<Membro, 'id'> = { idUsuario, idComunidade: id };
        await requisitar<Membro>('POST', '/membros', { corpo: novo, mensagemErro: 'Erro ao entrar na comunidade' });
        return;
      }

      await requisitar<void>('POST', `/comunidades/${id}/membros?idUsuario=${idUsuario}`, {
        mensagemErro: 'Erro ao entrar na comunidade',
      });
    }),

  // DELETE /comunidades/{id}/membros?idUsuario= — sair da comunidade (o criador não sai da própria)
  sairComunidade: (id: number, idUsuario: number): Promise<void> =>
    simularJava('DELETE', `/comunidades/${id}/membros?idUsuario=${idUsuario}`, async () => {
      if (USANDO_JSON_SERVER) {
        // mesma ordem do sair do ComunidadeService
        const comunidade = await buscarComunidadeNoJsonServer(id); // 404
        const criadores = await buscarNoJsonServer<Criador>(`/criadores?idUsuario=${idUsuario}`);
        if (criadores.some((c) => Number(c.id) === comunidade.idCriador)) {
          throw erroDaApi('O criador não pode sair da própria comunidade', 409);
        }
        const membros = await buscarNoJsonServer<Membro>(`/membros?idUsuario=${idUsuario}&idComunidade=${id}`);
        if (membros.length === 0) throw erroDaApi('O usuário não é membro desta comunidade', 409);
        await apagarMembros(membros);
        return;
      }

      await requisitar<void>('DELETE', `/comunidades/${id}/membros?idUsuario=${idUsuario}`, {
        mensagemErro: 'Erro ao sair da comunidade',
      });
    }),

  // ===== Postagens =====

  // GET /postagens
  getPostagens: (): Promise<Postagem[]> =>
    simularJava('GET', '/postagens', async () => {
      const postagens = await requisitar<Postagem[]>('GET', '/postagens', { mensagemErro: 'Erro ao buscar postagens' });
      return postagens.map(comIdNumerico);
    }),

  // POST /postagens — nasce PENDENTE; o ptGerado vem do impacto e só entra no saldo quando a moderação aprova
  publicarPostagem: (dados: PostagemCadastro): Promise<Postagem> =>
    simularJava('POST', '/postagens', async () => {
      if (USANDO_JSON_SERVER) {
        // mesma ordem do publicar do PostagemService
        const [usuarios, comunidades, membros] = await Promise.all([
          buscarNoJsonServer<Usuario>(`/usuarios?id=${dados.idUsuario}`),
          buscarNoJsonServer<Comunidade>(`/comunidades?id=${dados.idComunidade}`),
          buscarNoJsonServer<Membro>(`/membros?idUsuario=${dados.idUsuario}&idComunidade=${dados.idComunidade}`),
        ]);
        if (usuarios.length === 0) throw erroDaApi('Usuário não encontrado', 404);
        if (comunidades.length === 0) throw erroDaApi('Comunidade não encontrada', 404);
        if (membros.length === 0) throw erroDaApi('O usuário precisa ser membro da comunidade para publicar', 409);

        // o db.json guarda a postagem como o Java devolve: sem o campo impacto
        const nova: Omit<Postagem, 'id'> = {
          ctTexto: dados.ctTexto,
          ctUrl: dados.ctUrl,
          stValidacao: 'PENDENTE',
          ptGerado: buscarCategoriaPorImpacto(dados.impacto)?.pontosAcao ?? 0,
          idUsuario: dados.idUsuario,
          idComunidade: dados.idComunidade,
        };
        const criada = await requisitar<Postagem>('POST', '/postagens', { corpo: nova, mensagemErro: 'Erro ao publicar postagem' });
        return comIdNumerico(criada);
      }

      const criada = await requisitar<Postagem>('POST', '/postagens', { corpo: dados, mensagemErro: 'Erro ao publicar postagem' });
      return comIdNumerico(criada);
    }),

  // ===== Moderações =====

  // GET /moderacoes — usado no feedback para mostrar a decisão e a justificativa
  getModeracoes: (): Promise<Moderacao[]> =>
    simularJava('GET', '/moderacoes', async () => {
      const moderacoes = await requisitar<Moderacao[]>('GET', '/moderacoes', { mensagemErro: 'Erro ao buscar moderações' });
      return moderacoes.map(comIdNumerico);
    }),

  // GET /moderacoes/fila?idUsuario= — fila às cegas: sem as próprias postagens e sem as das comunidades dele
  getFilaModeracao: (idUsuario: number): Promise<PostagemFila[]> =>
    simularJava('GET', `/moderacoes/fila?idUsuario=${idUsuario}`, async () => {
      if (USANDO_JSON_SERVER) {
        await buscarModeradorNoJsonServer(idUsuario); // 403 se não for moderador
        const [pendentes, membros] = await Promise.all([
          requisitar<Postagem[]>('GET', '/postagens?stValidacao=PENDENTE', { mensagemErro: 'Erro ao buscar a fila de moderação' }),
          buscarNoJsonServer<Membro>(`/membros?idUsuario=${idUsuario}`),
        ]);
        const minhasComunidades = membros.map((m) => m.idComunidade);
        return pendentes
          .filter((p) => p.idUsuario !== idUsuario && !minhasComunidades.includes(p.idComunidade))
          .map((p) => ({ id: Number(p.id), ctTexto: p.ctTexto, ctUrl: p.ctUrl, ptGerado: p.ptGerado }));
      }

      const fila = await requisitar<PostagemFila[]>('GET', `/moderacoes/fila?idUsuario=${idUsuario}`, {
        mensagemErro: 'Erro ao buscar a fila de moderação',
      });
      return fila.map(comIdNumerico);
    }),

  // POST /moderacoes — aprova (A) ou reprova (R); se aprovar, o Java soma o ptGerado no sdPonto do autor
  moderarPostagem: (dados: ModeracaoCadastro): Promise<Moderacao> =>
    simularJava('POST', '/moderacoes', async () => {
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
        const criada = comIdNumerico(
          await requisitar<Moderacao>('POST', '/moderacoes', { corpo: nova, mensagemErro: 'Erro ao moderar postagem' }),
        );

        if (dados.decisao === 'A') {
          await alterarNoJsonServer(`/postagens/${dados.idPostagem}`, { stValidacao: 'APROVADO' });
          const autor = await buscarUsuario(postagem.idUsuario);
          const sdPonto = Number((autor.sdPonto + postagem.ptGerado).toFixed(2)); // somarPontos do Java
          await alterarNoJsonServer(`/usuarios/${autor.id}`, { sdPonto });
        } else {
          await alterarNoJsonServer(`/postagens/${dados.idPostagem}`, { stValidacao: 'REJEITADO' });
        }
        return criada;
      }

      const criada = await requisitar<Moderacao>('POST', '/moderacoes', { corpo: dados, mensagemErro: 'Erro ao moderar postagem' });
      return comIdNumerico(criada);
    }),
};