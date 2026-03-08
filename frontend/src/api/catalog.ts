import api from './client';
import type { Trope } from '../types';

export const catalogApi = {
  async tropes(): Promise<Trope[]> {
    const response = await api.get('/catalog/tropes');
    return response.data.data as Trope[];
  },

  async createTrope(payload: {
    name: string;
    clash_engine: string;
    best_for: string;
    is_global: boolean;
  }): Promise<Trope> {
    const response = await api.post('/catalog/tropes', payload);
    return response.data.data as Trope;
  },

  async deleteTrope(tropeId: number): Promise<void> {
    await api.delete(`/catalog/tropes/${tropeId}`);
  },
};
