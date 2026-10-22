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
} from '../types/types';
import { api } from '../services/api';
import { complementosUsuario } from '../data/complementosUsuario';
import { mensagemDoErro } from '../utils/erros';
import { hojeIso, proximaMetrica } from '../data/metas';
import { buscarCategoriaPorImpacto } from '../data/categorias';

// Dados públicos do app, carregados ao abrir o simulador (antes do login)
const buscarDados = () =>
  Promise.all([api.getUsuarios(), api.getComunidades(), api.getPostagens(), api.getModeracoes()]);

// eslint-disable-next-line react-refresh/only-export-components
export const SimuladorContext = createContext<SimuladorContextType | undefined>(undefined);

export const SimuladorProvider = ({ children }: { children: ReactNode }) => {
  // ----- Navegação entre telas -----
  const [historico, setHistorico] = useState<TelaId[]>(['login']);

  const telaAtual = historico[historico.length - 1];

  const irPara = useCallback((tela: TelaId) => {
    setHistorico((anterior) => [...anterior, tela]);
  }, []);

  // Troca de tela sem deixar caminho de volta (ex.: depois do login)
  const trocarPara = useCallback((tela: TelaId) => {
    setHistorico([tela]);
  }, []);

  const voltar = useCallback(() => {
    setHistorico((anterior) => (anterior.length > 1 ? anterior.slice(0, -1) : anterior));
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
      setUsuarios(dadosUsuarios);
      setComunidades(dadosComunidades);
      setPostagens(dadosPostagens);
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
        const [dadosUsuarios, dadosComunidades, dadosPostagens] = await buscarDados();
        setUsuarios(dadosUsuarios);
        setComunidades(dadosComunidades);
        setPostagens(dadosPostagens);
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
      }}
    >
      {children}
    </SimuladorContext.Provider>
  );
};