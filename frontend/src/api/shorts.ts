import api from './client';
import type { ShortScript } from '../types';

export const shortsApi = {
  async list(): Promise<ShortScript[]> {
    const response = await api.get('/shorts');
    return response.data.data as ShortScript[];
  },

  async remove(shortId: number): Promise<void> {
    await api.delete(`/shorts/${shortId}`);
  },
};
