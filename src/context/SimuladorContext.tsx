import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  SimuladorContextType,
  TelaId,
  Usuario,
  Comunidade,
  Postagem,
  Moderacao,
  MetaAtividades,
  PeriodoMeta,
  PostagemCadastro,
  PostagemEdicao,
  ComplementoUsuario,
  LoginRequest,
  UsuarioCadastro,
  UsuarioAtualizacao,
  TipoPerfil,
  PostagemFila,
  ModeracaoCadastro,
  StatusValidacao,
  Denuncia,
  MotivoDenuncia,
  RevisaoDenuncia,
  AcaoDenuncia,
  Contestacao,
  DecisaoRevisao,
  ComunidadeEdicao,
  ComplementoComunidade,
  ComplementoNovaComunidade,
  Missao,
  MissaoCadastro,
  Sugestao,
} from '../types/types';
import { api } from '../services/api';
import { complementosUsuario } from '../data/complementosUsuario';
import { mensagemDoErro } from '../utils/erros';
import { hojeIso, proximaMetrica } from '../data/metas';
import { buscarCategoriaPorImpacto } from '../data/categorias';
import {
  BONUS_REPUTACAO,
  PENALIDADE_REPUTACAO,
  REPUTACAO_INICIAL,
  buscarModeradorDemo,
  contestacoesIniciais,
  denunciasIniciais,
  motivoImpedimentoRevisao,
  reputacaoDe,
  reputacoesIniciais,
} from '../data/moderacao';
import { complementoDe, complementosComunidadeIniciais, ehDono, missoesIniciais } from '../data/comunidades';

// Dados públicos do app, carregados ao abrir o simulador (antes do login)
const buscarDados = () =>
  Promise.all([api.getUsuarios(), api.getComunidades(), api.getPostagens(), api.getModeracoes()]);

// Próximo id das listas que ficam só no front (denúncias e contestações)
const proximoId = (itens: { id: number }[]) => itens.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;

// eslint-disable-next-line react-refresh/only-export-components
export const SimuladorContext = createContext<SimuladorContextType | undefined>(undefined);

export const SimuladorProvider = ({ children }: { children: ReactNode }) => {
  // ----- Navegação entre telas -----
  const [historico, setHistorico] = useState<TelaId[]>(['login']);

  // Sugestão deixada para a próxima tela (missão → nova postagem; Para você → metas)
  const [sugestao, setSugestao] = useState<Sugestao | null>(null);

  const telaAtual = historico[historico.length - 1];

  // A sugestão só vale na tela dela: ir para outra tela descarta
  const irPara = useCallback((tela: TelaId) => {
    setHistorico((anterior) => [...anterior, tela]);
    setSugestao((atual) => (atual && atual.tela === tela ? atual : null));
  }, []);

  // Troca de tela sem deixar caminho de volta (ex.: depois do login)
  const trocarPara = useCallback((tela: TelaId) => {
    setHistorico([tela]);
    setSugestao(null);
  }, []);

  const voltar = useCallback(() => {
    setHistorico((anterior) => (anterior.length > 1 ? anterior.slice(0, -1) : anterior));
    setSugestao(null);
  }, []);

  const seguirSugestao = useCallback((nova: Sugestao) => {
    setSugestao(nova);
    setHistorico((anterior) => [...anterior, nova.tela]);
  }, []);

  // ----- Dados vindos da API -----
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [comunidades, setComunidades] = useState<Comunidade[]>([]);
  const [minhasComunidades, setMinhasComunidades] = useState<Comunidade[]>([]);
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [moderacoes, setModeracoes] = useState<Moderacao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Bio e interesses não existem na API: começam com os fixos e recebem os do onboarding
  const [complementos, setComplementos] = useState<Record<number, ComplementoUsuario>>(complementosUsuario);
  
  // Metas não existem na API: ficam no front, uma por usuário
  const [metas, setMetas] = useState<Record<number, MetaAtividades>>({});

  // Postagem aberta na tela de feedback
  const [idPostagemAberta, setIdPostagemAberta] = useState<number | null>(null);

  
  // ----- Moderação -----
  const [fila, setFila] = useState<PostagemFila[]>([]); // fila às cegas do moderador logado

  // Demonstrações (a API não tem essas tabelas): valem só nesta sessão do simulador
  const [impedidas, setImpedidas] = useState<number[]>([]);
  const [reputacoes, setReputacoes] = useState<Record<number, number>>(reputacoesIniciais);
  const [denuncias, setDenuncias] = useState<Denuncia[]>(denunciasIniciais);
  const [revisoesDenuncia, setRevisoesDenuncia] = useState<RevisaoDenuncia[]>([]);
  const [contestacoes, setContestacoes] = useState<Contestacao[]>(contestacoesIniciais);
  const [idContestacaoAberta, setIdContestacaoAberta] = useState<number | null>(null);

  // Usado pelo botão "Tentar novamente"
  const carregarDados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dadosUsuarios, dadosComunidades, dadosPostagens, dadosModeracoes] = await buscarDados();
      setUsuarios(dadosUsuarios);
      setComunidades(dadosComunidades);
      setPostagens(dadosPostagens);
      setModeracoes(dadosModeracoes);
    } catch (err) {
      setError(mensagemDoErro(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial, ao abrir o simulador
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dadosUsuarios, dadosComunidades, dadosPostagens, dadosModeracoes] = await buscarDados();
        setUsuarios(dadosUsuarios);
        setComunidades(dadosComunidades);
        setPostagens(dadosPostagens);
        setModeracoes(dadosModeracoes);
      } catch (err) {
        setError(mensagemDoErro(err));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ----- Ações do usuário -----
  // Sem try/catch: se a API recusar, o erro sobe para a tela mostrar no formulário

  const entrar = useCallback(async (dados: LoginRequest) => {
    const logado = await api.login(dados);
    const minhas = await api.getComunidadesDoUsuario(logado.id);
    setUsuario(logado);
    setMinhasComunidades(minhas);
  }, []);

  const cadastrar = useCallback(async (dados: UsuarioCadastro) => {
    const novo = await api.cadastrarUsuario(dados);
    setUsuarios((anteriores) => [...anteriores, novo]);
    setUsuario(novo); // depois do cadastro o usuário já entra
    setMinhasComunidades([]); // conta nova ainda não participa de comunidades
  }, []);

  // Troca o usuário logado e a cópia dele na lista de usuários
  const aplicarUsuario = useCallback((atualizado: Usuario) => {
    setUsuario(atualizado);
    setUsuarios((anteriores) => anteriores.map((u) => (u.id === atualizado.id ? atualizado : u)));
  }, []);

  const atualizarDados = useCallback(
    async (dados: UsuarioAtualizacao) => {
      if (!usuario) return;
      aplicarUsuario(await api.atualizarUsuario(usuario.id, dados));
    },
    [usuario, aplicarUsuario],
  );

  const trocarPerfil = useCallback(
    async (tipoPerfil: TipoPerfil) => {
      if (!usuario) return;
      aplicarUsuario(await api.trocarPerfil(usuario.id, tipoPerfil));
    },
    [usuario, aplicarUsuario],
  );

  const excluirConta = useCallback(async () => {
    if (!usuario) return;
    await api.excluirUsuario(usuario.id);
    setUsuarios((anteriores) => anteriores.filter((u) => u.id !== usuario.id));
    setUsuario(null);
    setMinhasComunidades([]);
    setHistorico(['login']);
  }, [usuario]);

  // Reiniciar a simulação = sair da conta e voltar ao login
  const reiniciar = useCallback(() => {
    setUsuario(null);
    setMinhasComunidades([]);
    setHistorico(['login']);
    setSugestao(null);
  }, []);

  const salvarComplemento = useCallback((idUsuario: number, complemento: ComplementoUsuario) => {
    setComplementos((anteriores) => ({ ...anteriores, [idUsuario]: complemento }));
  }, []);

  
  // ----- Postagens -----

  const abrirPostagem = useCallback(
    (id: number) => {
      setIdPostagemAberta(id);
      irPara('feedback');
    },
    [irPara],
  );

  // Sem try/catch: a tela mostra o erro (ex.: 409 "O usuário precisa ser membro da comunidade para publicar")
  const publicarPostagem = useCallback(
    async (dados: Omit<PostagemCadastro, 'idUsuario'>) => {
      if (!usuario) throw new Error('Entre na sua conta para publicar');
      const nova = await api.publicarPostagem({ ...dados, idUsuario: usuario.id });
      setPostagens((anteriores) => [...anteriores, nova]);
      return nova;
    },
    [usuario],
  );
  
  // Demonstração: a API não tem PUT /postagens/{id}, então a edição fica só no estado do front
  const editarPostagem = useCallback(
    (id: number, dados: PostagemEdicao) => {
      if (!usuario) return;
      setPostagens((anteriores) =>
        anteriores.map((p) =>
          p.id === id && p.idUsuario === usuario.id && p.stValidacao === 'PENDENTE'
            ? {
                ...p,
                ctTexto: dados.ctTexto,
                ctUrl: dados.ctUrl,
                ptGerado: buscarCategoriaPorImpacto(dados.impacto)?.pontosAcao ?? p.ptGerado,
              }
            : p,
        ),
      );
    },
    [usuario],
  );

  // ----- Metas (só no front) -----

  // Aplica uma mudança na meta do usuário logado
  const alterarMeta = useCallback(
    (mudar: (meta: MetaAtividades) => MetaAtividades | null) => {
      if (!usuario) return;
      setMetas((anteriores) => {
        const atual = anteriores[usuario.id];
        if (!atual) return anteriores;
        const copia = { ...anteriores };
        const nova = mudar(atual);
        if (nova) copia[usuario.id] = nova;
        else delete copia[usuario.id];
        return copia;
      });
    },
    [usuario],
  );

  const criarMeta = useCallback(
    (periodoDias: PeriodoMeta, alvo: number) => {
      if (!usuario) return;
      // só contam as aprovações de postagens criadas depois do início da meta
      const idBase = postagens.reduce((maior, p) => Math.max(maior, p.id), 0);
      const nova: MetaAtividades = {
        periodoDias,
        alvo: Math.min(Math.max(1, alvo), periodoDias),
        iniciadaEm: hojeIso(),
        idBase,
        upgradeRecusado: false,
      };
      setMetas((anteriores) => ({ ...anteriores, [usuario.id]: nova }));
    },
    [usuario, postagens],
  );

  const aumentarMeta = useCallback(
    (novoAlvo: number) => {
      alterarMeta((meta) => ({
        ...meta,
        alvo: Math.min(Math.max(meta.alvo, novoAlvo), meta.periodoDias),
        upgradeRecusado: false,
      }));
    },
    [alterarMeta],
  );

  // 7 → 15 → 30, mantendo o progresso (o idBase não muda)
  const subirMetrica = useCallback(() => {
    alterarMeta((meta) => {
      const proxima = proximaMetrica(meta.periodoDias);
      return proxima ? { ...meta, periodoDias: proxima, alvo: proxima, upgradeRecusado: false } : meta;
    });
  }, [alterarMeta]);

  const recusarUpgrade = useCallback(() => {
    alterarMeta((meta) => ({ ...meta, upgradeRecusado: true }));
  }, [alterarMeta]);

  const encerrarMeta = useCallback(() => {
    alterarMeta(() => null);
  }, [alterarMeta]);

  
  // ----- Moderação às cegas (API) -----

  // Sem try/catch: a tela trata o 403 (não é moderador) mostrando a candidatura
  const carregarFila = useCallback(async () => {
    if (!usuario) return;
    setFila(await api.getFilaModeracao(usuario.id));
  }, [usuario]);

  const abrirAnalise = useCallback(
    (idPostagem: number) => {
      setIdPostagemAberta(idPostagem);
      irPara('moderacao-analise');
    },
    [irPara],
  );

  // Sem try/catch: a tela mostra o erro (ex.: 409 "Esta postagem já foi moderada")
  const moderar = useCallback(
    async (dados: Omit<ModeracaoCadastro, 'idUsuario'>) => {
      if (!usuario) throw new Error('Entre na sua conta para moderar');
      const moderacao = await api.moderarPostagem({ ...dados, idUsuario: usuario.id });

      const novoStatus: StatusValidacao = dados.decisao === 'A' ? 'APROVADO' : 'REJEITADO';
      setModeracoes((anteriores) => [...anteriores, moderacao]);
      setPostagens((anteriores) =>
        anteriores.map((p) => (p.id === dados.idPostagem ? { ...p, stValidacao: novoStatus } : p)),
      );
      setFila((anteriores) => anteriores.filter((p) => p.id !== dados.idPostagem));

      // Na aprovação o Java soma o ptGerado no sdPonto do autor: busca o saldo atualizado
      const postagem = postagens.find((p) => p.id === dados.idPostagem);
      if (dados.decisao === 'A' && postagem) {
        const autor = await api.getUsuario(postagem.idUsuario);
        setUsuarios((anteriores) => anteriores.map((u) => (u.id === autor.id ? autor : u)));
      }
      return moderacao;
    },
    [usuario, postagens],
  );

  // ----- Demonstrações da moderação (só no estado do front) -----

  const declararImpedimento = useCallback((idPostagem: number) => {
    setImpedidas((anteriores) => [...anteriores, idPostagem]);
  }, []);

  const denunciar = useCallback(
    (idPostagem: number, motivo: MotivoDenuncia, detalhe: string) => {
      if (!usuario) return;
      setDenuncias((anteriores) => [
        ...anteriores,
        { id: proximoId(anteriores), idPostagem, idUsuario: usuario.id, motivo, detalhe },
      ]);
    },
    [usuario],
  );

  const revisarDenuncias = useCallback(
    (idPostagem: number, acao: AcaoDenuncia, parecer: string) => {
      if (!usuario) return;
      setRevisoesDenuncia((anteriores) => [...anteriores, { idPostagem, acao, parecer, idUsuario: usuario.id }]);
    },
    [usuario],
  );

  const abrirContestacao = useCallback(
    (id: number) => {
      setIdContestacaoAberta(id);
      irPara('revisao');
    },
    [irPara],
  );

  // A contestação guarda quem rejeitou (idModerador da moderação) e a reputação dele naquele momento
  const contestar = useCallback(
    (idPostagem: number, motivo: string) => {
      if (!usuario) return;
      const moderacao = moderacoes.find((m) => m.idPostagem === idPostagem);
      if (!moderacao) return;
      const original = buscarModeradorDemo(moderacao.idModerador);
      setContestacoes((anteriores) => [
        ...anteriores,
        {
          id: proximoId(anteriores),
          idPostagem,
          idUsuario: usuario.id,
          motivo,
          abertaEm: hojeIso(),
          status: 'EM_REVISAO',
          idModeradorOriginal: moderacao.idModerador,
          reputacaoOriginal: original ? reputacaoDe(original.idUsuario, reputacoes) : REPUTACAO_INICIAL,
        },
      ]);
    },
    [usuario, moderacoes, reputacoes],
  );

  // Mantida: bônus de reputação para o moderador original; revertida: penalidade
  const revisarContestacao = useCallback(
    (id: number, decisao: DecisaoRevisao, parecer: string) => {
      if (!usuario) return;
      const contestacao = contestacoes.find((c) => c.id === id);
      if (!contestacao || contestacao.status !== 'EM_REVISAO') return;
      if (motivoImpedimentoRevisao(usuario, contestacao, reputacoes)) return;

      const delta = decisao === 'MANTIDA' ? BONUS_REPUTACAO : -PENALIDADE_REPUTACAO;
      setContestacoes((anteriores) =>
        anteriores.map((c) =>
          c.id === id
            ? {
                ...c,
                status: decisao,
                idRevisor: usuario.id,
                reputacaoRevisor: reputacaoDe(usuario.id, reputacoes),
                parecer,
                decididaEm: hojeIso(),
                deltaReputacao: delta,
              }
            : c,
        ),
      );
      const original = buscarModeradorDemo(contestacao.idModeradorOriginal);
      if (original) {
        setReputacoes((anteriores) => ({
          ...anteriores,
          [original.idUsuario]: reputacaoDe(original.idUsuario, anteriores) + delta,
        }));
      }
    },
    [usuario, contestacoes, reputacoes],
  );

  // ----- Comunidades -----
  const [idComunidadeAberta, setIdComunidadeAberta] = useState<number | null>(null);
  const [totalMembros, setTotalMembros] = useState<Record<number, number>>({});

  // Demonstrações (a API não tem esses campos/tabelas): valem só nesta sessão do simulador
  const [complementosComunidade, setComplementosComunidade] =
    useState<Record<number, ComplementoComunidade>>(complementosComunidadeIniciais);
  const [missoes, setMissoes] = useState<Missao[]>(missoesIniciais);

  const abrirComunidade = useCallback(
    (id: number) => {
      setIdComunidadeAberta(id);
      irPara('comunidade');
    },
    [irPara],
  );

  // Uma chamada de GET /comunidades/{id}/membros/total por comunidade
  // GET /comunidades/{id}/membros/total só das comunidades que ainda não têm total (carrega uma vez e reaproveita)
  const carregarTotaisMembros = useCallback(async () => {
    const semTotal = comunidades.filter((c) => totalMembros[c.id] === undefined);
    if (semTotal.length === 0) return;
    const totais = await Promise.all(semTotal.map((c) => api.getTotalMembros(c.id)));
    setTotalMembros((anteriores) => ({
      ...anteriores,
      ...Object.fromEntries(semTotal.map((c, i) => [c.id, totais[i]])),
    }));
  }, [comunidades, totalMembros]);

  // GET /comunidades/{id}/membros/total só da comunidade aaberta (detalhe)
  const carregarTotalMembros = useCallback(async (id: number) => {
    const total = await api.getTotalMembros(id);
    setTotalMembros((anteriores) => ({ ...anteriores, [id]: total }));
  }, []);

  // Soma ou tira um membro do total já carregado (depois de entrar ou sair)
  const alterarTotal = useCallback((id: number, diferenca: number) => {
    setTotalMembros((anteriores) =>
      anteriores[id] === undefined ? anteriores : { ...anteriores, [id]: anteriores[id] + diferenca },
    );
  }, []);

  // Sem try/catch nas ações da API: a tela mostra o erro (ex.: 409 ao excluir com membros)
  const criarComunidade = useCallback(
    async (dados: ComunidadeEdicao, complemento: ComplementoNovaComunidade) => {
      if (!usuario) throw new Error('Entre na sua conta para criar uma comunidade');
      const nova = await api.cadastrarComunidade({ ...dados, idUsuario: usuario.id });
      setComunidades((anteriores) => [...anteriores, nova]);
      setMinhasComunidades((anteriores) => [...anteriores, nova]); // quem cria já é membro
      setTotalMembros((anteriores) => ({ ...anteriores, [nova.id]: 1 }));
      setComplementosComunidade((anteriores) => ({
        ...anteriores,
        [nova.id]: {
          temas: [],
          plano: complemento.plano,
          verificada: false,
          verificacaoPendente: Boolean(complemento.organizacao), // organização aguarda verificação
          organizacao: complemento.organizacao,
          regras: complemento.regras,
        },
      }));
      return nova;
    },
    [usuario],
  );

  const editarComunidade = useCallback(
    async (id: number, dados: ComunidadeEdicao, regras: string) => {
      if (!usuario) return;
      const alterada = await api.atualizarComunidade(id, { ...dados, idUsuario: usuario.id });
      setComunidades((anteriores) => anteriores.map((c) => (c.id === id ? alterada : c)));
      setMinhasComunidades((anteriores) => anteriores.map((c) => (c.id === id ? alterada : c)));
      // as regras não existem na API: ficam no complemento (demonstração)
      setComplementosComunidade((anteriores) => ({
        ...anteriores,
        [id]: { ...complementoDe(id, anteriores), regras: regras.trim() || undefined },
      }));
    },
    [usuario],
  );

  const excluirComunidade = useCallback(
    async (id: number) => {
      if (!usuario) return;
      await api.excluirComunidade(id, usuario.id);
      setComunidades((anteriores) => anteriores.filter((c) => c.id !== id));
      setMinhasComunidades((anteriores) => anteriores.filter((c) => c.id !== id));
      setMissoes((anteriores) => anteriores.filter((m) => m.idComunidade !== id));
    },
    [usuario],
  );

  // Entrar e sair mudam o "Minhas comunidades", a Nova postagem e a fila do moderador
  const entrarComunidade = useCallback(
    async (id: number) => {
      if (!usuario) return;
      await api.entrarComunidade(id, usuario.id);
      const comunidade = comunidades.find((c) => c.id === id);
      if (comunidade) {
        setMinhasComunidades((anteriores) => [...anteriores, comunidade].sort((a, b) => a.id - b.id));
      }
      alterarTotal(id, 1);
    },
    [usuario, comunidades, alterarTotal],
  );

  const sairComunidade = useCallback(
    async (id: number) => {
      if (!usuario) return;
      await api.sairComunidade(id, usuario.id);
      setMinhasComunidades((anteriores) => anteriores.filter((c) => c.id !== id));
      alterarTotal(id, -1);
    },
    [usuario, alterarTotal],
  );

  // ----- Missões (demonstração): só o criador da comunidade cria, edita e encerra -----

  const podeAdministrar = useCallback(
    (idComunidade: number) => {
      const comunidade = comunidades.find((c) => c.id === idComunidade);
      return comunidade !== undefined && ehDono(comunidade, usuario);
    },
    [comunidades, usuario],
  );

  const criarMissao = useCallback(
    (idComunidade: number, dados: MissaoCadastro) => {
      if (!podeAdministrar(idComunidade)) return;
      setMissoes((anteriores) => [
        ...anteriores,
        { ...dados, id: proximoId(anteriores), idComunidade, encerrada: false, criadaEm: hojeIso() },
      ]);
    },
    [podeAdministrar],
  );

  const editarMissao = useCallback(
    (id: number, dados: MissaoCadastro) => {
      const missao = missoes.find((m) => m.id === id);
      if (!missao || !podeAdministrar(missao.idComunidade)) return;
      setMissoes((anteriores) => anteriores.map((m) => (m.id === id ? { ...m, ...dados } : m)));
    },
    [missoes, podeAdministrar],
  );

  const encerrarMissao = useCallback(
    (id: number) => {
      const missao = missoes.find((m) => m.id === id);
      if (!missao || !podeAdministrar(missao.idComunidade)) return;
      setMissoes((anteriores) => anteriores.map((m) => (m.id === id ? { ...m, encerrada: true } : m)));
    },
    [missoes, podeAdministrar],
  );

  return (
    <SimuladorContext.Provider
      value={{
        telaAtual,
        podeVoltar: historico.length > 1,
        irPara,
        trocarPara,
        voltar,
        reiniciar,
        usuario,
        usuarios,
        comunidades,
        minhasComunidades,
        postagens,
        moderacoes,
        complementos,
        metas,
        loading,
        error,
        carregarDados,
        entrar,
        cadastrar,
        atualizarDados,
        trocarPerfil,
        excluirConta,
        salvarComplemento,
        idPostagemAberta,
        abrirPostagem,
        publicarPostagem,
        editarPostagem,
        criarMeta,
        aumentarMeta,
        subirMetrica,
        recusarUpgrade,
        encerrarMeta,
        fila,
        carregarFila,
        abrirAnalise,
        moderar,
        impedidas,
        declararImpedimento,
        reputacoes,
        denuncias,
        revisoesDenuncia,
        denunciar,
        revisarDenuncias,
        contestacoes,
        idContestacaoAberta,
        abrirContestacao,
        contestar,
        revisarContestacao,
        idComunidadeAberta,
        abrirComunidade,
        totalMembros,
        carregarTotaisMembros,
        carregarTotalMembros,
        criarComunidade,
        editarComunidade,
        excluirComunidade,
        entrarComunidade,
        sairComunidade,
        complementosComunidade,
        missoes,
        criarMissao,
        editarMissao,
        encerrarMissao,
        sugestao,
        seguirSugestao,
      }}
    >
      {children}
    </SimuladorContext.Provider>
  );
};