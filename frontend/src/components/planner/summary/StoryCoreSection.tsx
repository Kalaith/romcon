import type { Plan } from '../../../types';
import { SummaryField } from './SummaryField';
import { SummarySection } from './SummarySection';

type StoryCoreSectionProps = {
  plan: Plan;
};

export function StoryCoreSection({ plan }: StoryCoreSectionProps) {
  return (
    <SummarySection title="Story Core" description="This is the compact brief the rest of the package is built from.">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.5rem] bg-white/85 p-5">
          <SummaryField label="Concept Brief" value={plan.concept_brief} />
        </div>
        <div className="rounded-[1.5rem] bg-white/85 p-5">
          <SummaryField label="Romance Structure Notes" value={plan.romance_structure_notes || 'No additional structure notes saved.'} />
          <div className="mt-4">
            <SummaryField label="POV Notes" value={plan.pov_notes} />
          </div>
        </div>
        <div className="rounded-[1.5rem] bg-white/85 p-5">
          <SummaryField label="Dominant Romance Arc" value={plan.dominant_romance_arc} />
          <div className="mt-4">
            <SummaryField label="Central External Pressure" value={plan.central_external_pressure} />
          </div>
          <div className="mt-4">
            <SummaryField label="Emotional Question" value={plan.emotional_question} />
          </div>
        </div>
      </div>
    </SummarySection>
  );
}
