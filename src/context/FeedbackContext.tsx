import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { FeedbackType } from '../types/types';
import { api } from '../services/api';

type FeedbackContextType = {
  feedbacks: FeedbackType[];
  loading: boolean;
  error: string | null;
  loadFeedbacks: () => Promise<void>;
  addFeedback: (feedback: Omit<FeedbackType, 'id'>) => Promise<void>;
  removeFeedback: (id: string) => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getFeedbacks();
      setFeedbacks(data);
      localStorage.setItem('feedbacks_backup', JSON.stringify(data));
    } catch (err) {
      setError('Erro ao carregar os dados. Verifique sua conexão.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addFeedback = useCallback(async (feedback: Omit<FeedbackType, 'id'>) => {
    try {
      const novo = await api.postFeedback(feedback);
      setFeedbacks((prev) => [...prev, novo]);
    } catch (err) {
      setError('Erro ao enviar feedback.');
      console.error(err);
    }
  }, []);

  const removeFeedback = useCallback(async (id: string) => {
    try {
      await api.deleteFeedback(id);
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      setError('Erro ao remover feedback.');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getFeedbacks();
        setFeedbacks(data);
        localStorage.setItem('feedbacks_backup', JSON.stringify(data));
      } catch (err) {
        setError('Erro ao carregar os dados. Verifique sua conexão.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <FeedbackContext.Provider value={{ feedbacks, loading, error, loadFeedbacks, addFeedback, removeFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};