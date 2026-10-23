import { useContext } from 'react';
import { RequisicoesContext } from '../context/RequisicoesContext';

export const useRequisicoes = () => {
  const context = useContext(RequisicoesContext);

  if (context === undefined) {
    throw new Error('O hook useRequisicoes deve ser usado dentro de um <RequisicoesProvider>');
  }

  return context;
};