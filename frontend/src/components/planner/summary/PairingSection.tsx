import type { Plan } from '../../../types';
import { SummaryField } from './SummaryField';
import { SummaryList } from './SummaryList';
import { SummarySection } from './SummarySection';

type PairingSectionProps = {
  plan: Plan;
};

export function PairingSection({ plan }: PairingSectionProps) {
  return (
    <SummarySection title="Pairing Logic" description="Why this relationship works, where it hurts, and what the story keeps testing.">
      {plan.pairing ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.5rem] bg-white/85 p-5">
            <SummaryField label="Pairing Hook" value={plan.pairing.pairing_hook} />
            <div className="mt-4">
              <SummaryField label="Best Trope" value={plan.pairing.best_trope} />
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-white/85 p-5">
            <SummaryField label="Lead One Lesson" value={plan.pairing.emotional_lessons.lead_one} />
            <div className="mt-4">
              <SummaryField label="Lead Two Lesson" value={plan.pairing.emotional_lessons.lead_two} />
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-white/85 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Why They Clash</p>
            <div className="mt-3">
              <SummaryList items={plan.pairing.why_they_clash} />
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-white/85 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Why They Fit</p>
            <div className="mt-3">
              <SummaryList items={plan.pairing.why_they_fit} />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-rose-800/70">No pairing analysis saved yet.</p>
      )}
    </SummarySection>
  );
}
