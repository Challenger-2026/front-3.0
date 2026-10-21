import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  SimuladorContextType,
  TelaId,
  Usuario,
  Comunidade,
  Postagem,
  ComplementoUsuario,
  LoginRequest,
  UsuarioCadastro,
} from '../types/types';
import { api } from '../services/api';
import { complementosUsuario } from '../data/complementosUsuario';

// Dados públicos do app, carregados ao abrir o simulador (antes do login)
const buscarDados = () => Promise.all([api.getUsuarios(), api.getComunidades(), api.getPostagens()]);

const MENSAGEM_ERRO = 'Não foi possível carregar os dados do Soul Up. Verifique se a API está rodando.';

// Falha de conexão (TypeError do fetch) usa a mensagem padrão; erro da API mostra a mensagem dela
const mensagemDoErro = (err: unknown) =>
  err instanceof Error && !(err instanceof TypeError) ? err.message : MENSAGEM_ERRO;

// eslint-disable-next-line react-refresh/only-export-components
export const SimuladorContext = createContext<SimuladorContextType | undefined>(undefined);

export const SimuladorProvider = ({ children }: { children: ReactNode }) => {
  // ----- Navegação entre telas -----
  const [historico, setHistorico] = useState<TelaId[]>(['inicio']);

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

  const reiniciar = useCallback(() => {
    setHistorico(['inicio']);
  }, []);

  // ----- Dados vindos da API -----
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [comunidades, setComunidades] = useState<Comunidade[]>([]);
  const [minhasComunidades, setMinhasComunidades] = useState<Comunidade[]>([]);
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Bio e interesses não existem na API: começam com os fixos e recebem os do onboarding
  const [complementos, setComplementos] = useState<Record<number, ComplementoUsuario>>(complementosUsuario);

  // Usado pelo botão "Tentar novamente"
  const carregarDados = useCallback(async () => {
    setLoading(true);
    setError(null);
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

  const salvarComplemento = useCallback((idUsuario: number, complemento: ComplementoUsuario) => {
    setComplementos((anteriores) => ({ ...anteriores, [idUsuario]: complemento }));
  }, []);

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
        complementos,
        loading,
        error,
        carregarDados,
        entrar,
        cadastrar,
        salvarComplemento,
      }}
    >
      {children}
    </SimuladorContext.Provider>
  );
};