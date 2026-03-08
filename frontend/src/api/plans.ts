import api from './client';
import type { Plan } from '../types';

export const plansApi = {
  async list(): Promise<Plan[]> {
    const response = await api.get('/plans');
    return response.data.data as Plan[];
  },

  async create(plan: Plan): Promise<Plan> {
    const response = await api.post('/plans', plan);
    return response.data.data as Plan;
  },

  async update(plan: Plan): Promise<Plan> {
    const response = await api.put(`/plans/${plan.id}`, plan);
    return response.data.data as Plan;
  },

  async remove(planId: number): Promise<void> {
    await api.delete(`/plans/${planId}`);
  },
};
