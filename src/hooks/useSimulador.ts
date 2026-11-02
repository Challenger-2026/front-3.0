import { useContext } from 'react';
import { SimuladorContext } from '../context/SimuladorContext';

export const useSimulador = () => {
  const context = useContext(SimuladorContext);

  if (context === undefined) {
    throw new Error('O hook useSimulador deve ser usado dentro de um <SimuladorProvider>');
  }

  return context;
};