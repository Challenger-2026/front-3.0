import type { FeedbackType } from '../types/types';

const BASE_URL = 'http://localhost:5000';

export const api = {
  getFeedbacks: async (): Promise<FeedbackType[]> => {
    const response = await fetch(`${BASE_URL}/feedbacks`);
    if (!response.ok) throw new Error('Erro ao buscar dados do servidor');
    return response.json();
  },

  postFeedback: async (feedback: Omit<FeedbackType, 'id'>): Promise<FeedbackType> => {
    const response = await fetch(`${BASE_URL}/feedbacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });
    if (!response.ok) throw new Error('Erro ao salvar feedback');
    return response.json();
  },

  deleteFeedback: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/feedbacks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar feedback');
  }
};