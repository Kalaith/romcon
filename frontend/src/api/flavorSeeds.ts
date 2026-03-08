import api from './client';
import type { FlavorSeed } from '../types';

export const flavorSeedApi = {
  async list(): Promise<FlavorSeed[]> {
    const response = await api.get('/flavor-seeds');
    return response.data.data as FlavorSeed[];
  },

  async create(label: string): Promise<FlavorSeed> {
    const response = await api.post('/flavor-seeds', { label });
    return response.data.data as FlavorSeed;
  },

  async remove(seedId: number): Promise<void> {
    await api.delete(`/flavor-seeds/${seedId}`);
  },
};
