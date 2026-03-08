import type { Plan } from '../../../types';
import { SummaryField } from './SummaryField';
import { SummaryList } from './SummaryList';
import { SummarySection } from './SummarySection';

type PremiseSectionProps = {
  plan: Plan;
};

export function PremiseSection({ plan }: PremiseSectionProps) {
  return (
    <SummarySection title="Premise Package" description="The novella engine, public pressure, and the beat path to the ending.">
      {plan.premise ? (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.5rem] bg-white/85 p-5">
              <SummaryField label="Logline" value={plan.premise.logline} />
            </div>
            <div className="rounded-[1.5rem] bg-white/85 p-5">
              <SummaryField label="Premise" value={plan.premise.premise} />
            </div>
            <div className="rounded-[1.5rem] bg-white/85 p-5">
              <SummaryField label="Forced Proximity Device" value={plan.premise.forced_proximity_device} />
            </div>
            <div className="rounded-[1.5rem] bg-white/85 p-5">
              <SummaryField label="Primary Obstacle" value={plan.premise.primary_obstacle} />
            </div>
            <div className="rounded-[1.5rem] bg-white/85 p-5">
              <SummaryField label="Midpoint Shift" value={plan.premise.midpoint_shift} />
            </div>
            <div className="rounded-[1.5rem] bg-white/85 p-5">
              <SummaryField label="Finale Payoff" value={plan.premise.finale_payoff} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.5rem] bg-white/85 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Chapter Beats</p>
              <div className="mt-3">
                <SummaryList items={plan.premise.chapter_beats} />
              </div>
            </div>
            <div className="rounded-[1.5rem] bg-white/85 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Supporting Cast Roles</p>
              <div className="mt-3">
                <SummaryList items={plan.premise.supporting_cast_roles} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-rose-800/70">No premise saved yet.</p>
      )}
    </SummarySection>
  );
}
