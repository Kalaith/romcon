import type { Plan } from '../types';
import { buildApiUrl } from './client';

export async function exportPlan(plan: Plan, format: 'json' | 'xml', token: string): Promise<void> {
  if (!plan.id) {
    throw new Error('Save or generate the plan before exporting.');
  }

  const url = buildApiUrl(import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1/romcon/api', import.meta.env.VITE_API_VERSION || '', `/plans/${plan.id}/export?format=${format}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(raw || `Export failed (${response.status})`);
  }

  const blob = await response.blob();
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = `${(plan.title || 'romcon-plan').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${format}`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(href);
}
