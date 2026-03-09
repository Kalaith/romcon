import type { Plan } from '../types';
import { getHeatLevelMeta } from '../constants/heatLevels';

type ProjectSidebarProps = {
  projects: Plan[];
  currentPlanId?: number;
  onOpen: (plan: Plan) => void;
  onDelete: (planId: number) => void;
  onNew: () => void;
};

export function ProjectSidebar({ projects, currentPlanId, onOpen, onDelete, onNew }: ProjectSidebarProps) {
  return (
    <aside className="glass-panel rounded-[2rem] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">Projects</p>
          <h2 className="font-display text-2xl">Cupid Board</h2>
        </div>
        <button className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white" onClick={onNew}>
          New
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {projects.map((project) => (
          <div key={project.id} className={`rounded-2xl border p-4 ${project.id === currentPlanId ? 'border-rose-500 bg-rose-50' : 'border-rose-100 bg-white/80'}`}>
            <button className="w-full text-left" onClick={() => onOpen(project)}>
              <p className="font-semibold text-rose-950">{project.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-rose-500">{getHeatLevelMeta(project.heat_level).label} | {project.target_words.toLocaleString()} words</p>
              {project.setting ? <p className="mt-2 text-sm text-rose-900/70">{project.setting}</p> : null}
            </button>
            {project.id ? (
              <button className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700" onClick={() => onDelete(project.id!)}>
                Delete
              </button>
            ) : null}
          </div>
        ))}
        {projects.length === 0 ? <p className="rounded-2xl bg-white/70 p-4 text-sm text-rose-800/70">No saved plans yet.</p> : null}
      </div>
    </aside>
  );
}
