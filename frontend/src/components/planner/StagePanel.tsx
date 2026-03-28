import type { ReactNode } from 'react';

type StageStatusTone = 'current' | 'complete' | 'locked' | 'pending';

type StagePanelProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  isLocked?: boolean;
  lockMessage?: string;
  statusLabel?: string;
  statusTone?: StageStatusTone;
  footer?: ReactNode;
  children?: ReactNode;
};

const statusToneClasses: Record<StageStatusTone, string> = {
  current: 'bg-rose-600 text-white',
  complete: 'bg-emerald-100 text-emerald-800',
  locked: 'bg-stone-200 text-stone-700',
  pending: 'bg-stone-100 text-stone-700',
};

export function StagePanel({ id, eyebrow, title, description, isLocked = false, lockMessage, statusLabel, statusTone = 'pending', footer, children }: StagePanelProps) {
  return (
    <section id={id} className={`rounded-[2rem] border p-6 ${isLocked ? 'border-dashed border-stone-300 bg-stone-50/80' : 'border-stone-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]'}`}>
      <div className="flex flex-col gap-3 border-b border-stone-200 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-600">{eyebrow}</p>
          <h2 className="mt-2 font-display text-2xl text-stone-950">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-700">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {statusLabel ? <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusToneClasses[statusTone]}`}>{statusLabel}</span> : null}
          {isLocked && lockMessage ? <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700">{lockMessage}</span> : null}
        </div>
      </div>
      {children ? <div className="mt-6">{children}</div> : null}
      {footer ? <div className="sticky bottom-4 mt-6 rounded-[1.5rem] border border-stone-200 bg-white/95 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur">{footer}</div> : null}
    </section>
  );
}
