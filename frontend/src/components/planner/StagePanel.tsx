import type { ReactNode } from 'react';

type StagePanelProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  isLocked?: boolean;
  lockMessage?: string;
  action?: ReactNode;
  children?: ReactNode;
};

export function StagePanel({ id, eyebrow, title, description, isLocked = false, lockMessage, action, children }: StagePanelProps) {
  return (
    <section id={id} className={`rounded-[2rem] p-6 ${isLocked ? 'border border-dashed border-rose-200 bg-white/55' : 'glass-panel'}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">{eyebrow}</p>
      <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-2xl text-rose-950">{title}</h2>
          <p className="mt-2 text-sm text-rose-900/75">{description}</p>
        </div>
        {action ? (
          action
        ) : isLocked && lockMessage ? (
          <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-rose-800">{lockMessage}</span>
        ) : null}
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}
