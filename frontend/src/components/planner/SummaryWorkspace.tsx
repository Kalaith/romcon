import type { Plan } from '../../types';
import { ChapterPlanSection } from './summary/ChapterPlanSection';
import { LeadsSection } from './summary/LeadsSection';
import { PairingSection } from './summary/PairingSection';
import { PremiseSection } from './summary/PremiseSection';
import { ProtectedNotesSection } from './summary/ProtectedNotesSection';
import { StoryCastSection } from './summary/StoryCastSection';
import { StoryCoreSection } from './summary/StoryCoreSection';
import { SummaryHero } from './summary/SummaryHero';

type SummaryWorkspaceProps = {
  plan: Plan;
  onBackToPlanner: () => void;
  onExport: (format: 'json' | 'xml') => void;
};

export function SummaryWorkspace({ plan, onBackToPlanner, onExport }: SummaryWorkspaceProps) {
  return (
    <div className="space-y-6">
      <SummaryHero
        title={plan.title}
        setting={plan.setting}
        romanceConfiguration={plan.romance_configuration}
        povMode={plan.pov_mode}
        mainCharacterFocus={plan.main_character_focus}
        selectedTrope={plan.trope_notes[0] || ''}
        heatLevel={plan.heat_level}
        targetWords={plan.target_words}
        onBackToPlanner={onBackToPlanner}
        onExport={onExport}
      />
      <StoryCoreSection plan={plan} />
      <LeadsSection plan={plan} />
      <PairingSection plan={plan} />
      <PremiseSection plan={plan} />
      <ChapterPlanSection plan={plan} />
      <StoryCastSection plan={plan} />
      <ProtectedNotesSection plan={plan} />
    </div>
  );
}
