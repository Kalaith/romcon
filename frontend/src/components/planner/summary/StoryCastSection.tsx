import type { Plan } from '../../../types';
import { SummaryField } from './SummaryField';
import { SummarySection } from './SummarySection';

type StoryCastSectionProps = {
  plan: Plan;
};

export function StoryCastSection({ plan }: StoryCastSectionProps) {
  const supportingCast = plan.cast.filter((member) => member.include_in_story !== false);

  return (
    <SummarySection title="Story Cast" description="These are the currently included supporting players for this story.">
      {supportingCast.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {supportingCast.map((member) => (
            <article key={`${member.name}-${member.role}`} className="rounded-[1.5rem] bg-white/85 p-5">
              <h3 className="font-display text-2xl text-rose-950">{member.name || 'Unnamed cast member'}</h3>
              <p className="mt-1 text-sm font-semibold text-rose-900/70">{member.role || 'Role not set'}</p>
              <div className="mt-4 space-y-4">
                <SummaryField label="Summary" value={member.summary} />
                <SummaryField label="Connection to Leads" value={member.connection_to_leads} />
                <SummaryField label="Impact on Couple" value={member.story_function} />
                <SummaryField label="Core Fear" value={member.core_fear} />
                <SummaryField label="Comedic Angle" value={member.comedic_angle} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-rose-800/70">No supporting cast saved yet.</p>
      )}
    </SummarySection>
  );
}
