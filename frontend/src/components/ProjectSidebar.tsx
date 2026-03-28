import { useState } from 'react';
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
  const [menuProjectId, setMenuProjectId] = useState<number | null>(null);

  return (
    <aside className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">Projects</p>
          <h2 className="font-display text-2xl text-stone-950">Cupid Board</h2>
        </div>
        <button className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white" onClick={onNew}>
          New Project
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`relative overflow-hidden rounded-[1.5rem] border p-4 transition ${
              project.id === currentPlanId ? 'border-rose-400 bg-rose-50/70 shadow-[inset_4px_0_0_0_rgb(225,29,72)]' : 'border-stone-200 bg-stone-50/60 hover:border-rose-200 hover:bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <button className="min-w-0 flex-1 text-left" onClick={() => onOpen(project)}>
                <p className="truncate font-semibold text-stone-950">{project.title || 'Untitled project'}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-stone-500">{getHeatLevelMeta(project.heat_level).label} | {project.target_words.toLocaleString()} words</p>
                {project.setting ? <p className="mt-2 line-clamp-2 text-sm text-stone-600">{project.setting}</p> : null}
              </button>
              {project.id ? (
                <div className="relative">
                  <button
                    className="rounded-full border border-stone-200 bg-white px-2 py-1 text-sm font-semibold text-stone-500"
                    onClick={() => setMenuProjectId((current) => (current === project.id ? null : project.id!))}
                    type="button"
                  >
                    ...
                  </button>
                  {menuProjectId === project.id ? (
                    <div className="absolute right-0 top-10 z-10 min-w-[120px] rounded-[1rem] border border-stone-200 bg-white p-1 shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                      <button
                        className="block w-full rounded-[0.85rem] px-3 py-2 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"
                        onClick={() => {
                          setMenuProjectId(null);
                          onDelete(project.id!);
                        }}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
            {project.id === currentPlanId ? (
              <div className="mt-3">
                <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white">Current project</span>
              </div>
            ) : null}
          </div>
        ))}
        {projects.length === 0 ? (
          <p className="rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-stone-600">
            No saved plans yet.
          </p>
        ) : null}
      </div>
    </aside>
  );
}
