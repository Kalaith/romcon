import type { Plan } from '../../../types';
import { SummaryLeadCard } from './SummaryLeadCard';
import { SummarySection } from './SummarySection';

type LeadsSectionProps = {
  plan: Plan;
};

export function LeadsSection({ plan }: LeadsSectionProps) {
  return (
    <SummarySection title="Lead Couple" description="The main romance engine and the two people driving it.">
      <div className="grid gap-6 xl:grid-cols-2">
        <SummaryLeadCard title="Lead One" character={plan.lead_one} />
        <SummaryLeadCard title="Lead Two" character={plan.lead_two} />
      </div>
    </SummarySection>
  );
}
