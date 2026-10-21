import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { SimuladorContextType, TelaId, Usuario, Comunidade, Postagem } from '../types/types';
import { api } from '../services/api';

// Usuário de demonstração do simulador
const USUARIO_ATUAL_ID = 'u1';

// Busca usuário, comunidades e postagens ao mesmo tempo
const buscarDados = () =>
  Promise.all([api.getUsuario(USUARIO_ATUAL_ID), api.getComunidades(), api.getPostagens()]);

const MENSAGEM_ERRO = 'Não foi possível carregar os dados do Soul Up. Verifique se a API está rodando.';

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
  const [comunidades, setComunidades] = useState<Comunidade[]>([]);
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Usado pelo botão "Tentar novamente"
  const carregarDados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dadosUsuario, dadosComunidades, dadosPostagens] = await buscarDados();
      setUsuario(dadosUsuario);
      setComunidades(dadosComunidades);
      setPostagens(dadosPostagens);
    } catch (err) {
      setError(MENSAGEM_ERRO);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial, ao abrir o simulador
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dadosUsuario, dadosComunidades, dadosPostagens] = await buscarDados();
        setUsuario(dadosUsuario);
        setComunidades(dadosComunidades);
        setPostagens(dadosPostagens);
      } catch (err) {
        setError(MENSAGEM_ERRO);
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
        comunidades,
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