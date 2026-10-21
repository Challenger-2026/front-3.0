import { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { SimuladorContextType, TelaId } from '../types/types';

// eslint-disable-next-line react-refresh/only-export-components
export const SimuladorContext = createContext<SimuladorContextType | undefined>(undefined);

export const SimuladorProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <SimuladorContext.Provider
      value={{ telaAtual, podeVoltar: historico.length > 1, irPara, voltar, reiniciar }}
    >
      {children}
    </SimuladorContext.Provider>
  );
};