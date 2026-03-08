import type { ReactNode } from 'react';

type SummarySectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function SummarySection({ title, description, children }: SummarySectionProps) {
  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-2xl text-rose-950">{title}</h2>
          <p className="mt-2 text-sm text-rose-900/75">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
