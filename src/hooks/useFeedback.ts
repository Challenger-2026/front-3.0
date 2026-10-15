import { useContext } from 'react';
import { FeedbackContext } from '../context/FeedbackContext';

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  
  if (context === undefined) {
    throw new Error("O hook useFeedback deve ser usado dentro de um <FeedbackProvider>");
  }
  
  return context;
};