import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { SimuladorContextType, TelaId, Usuario, Comunidade, Postagem } from '../types/types';
import { api } from '../services/api';

// Usuário de demonstração do simulador
const USUARIO_ATUAL_ID = 1;

// Busca tudo o que o simulador precisa ao mesmo tempo
const buscarDados = () =>
  Promise.all([
    api.getUsuario(USUARIO_ATUAL_ID),
    api.getUsuarios(),
    api.getComunidades(),
    api.getComunidadesDoUsuario(USUARIO_ATUAL_ID),
    api.getPostagens(),
  ]);

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

  // Usado pelo botão "Tentar novamente"
  const carregarDados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dadosUsuario, dadosUsuarios, dadosComunidades, dadosMinhas, dadosPostagens] = await buscarDados();
      setUsuario(dadosUsuario);
      setUsuarios(dadosUsuarios);
      setComunidades(dadosComunidades);
      setMinhasComunidades(dadosMinhas);
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
        const [dadosUsuario, dadosUsuarios, dadosComunidades, dadosMinhas, dadosPostagens] = await buscarDados();
        setUsuario(dadosUsuario);
        setUsuarios(dadosUsuarios);
        setComunidades(dadosComunidades);
        setMinhasComunidades(dadosMinhas);
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

  return (
    <SimuladorContext.Provider
      value={{
        telaAtual,
        podeVoltar: historico.length > 1,
        irPara,
        voltar,
        reiniciar,
        usuario,
        usuarios,
        comunidades,
        minhasComunidades,
        postagens,
        loading,
        error,
        carregarDados,
      }}
    >
      {children}
    </SimuladorContext.Provider>
  );
};