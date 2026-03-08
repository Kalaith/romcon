import type { Plan } from '../../../types';
import { SummarySection } from './SummarySection';

type ProtectedNotesSectionProps = {
  plan: Plan;
};

export function ProtectedNotesSection({ plan }: ProtectedNotesSectionProps) {
  return (
    <SummarySection title="Protected Notes" description="Anything here should survive future edits and regenerations.">
      <div className="rounded-[1.5rem] bg-white/85 p-5">
        <p className="whitespace-pre-wrap text-sm leading-6 text-rose-950/85">{plan.notes || 'No protected notes saved yet.'}</p>
      </div>
    </SummarySection>
  );
}
