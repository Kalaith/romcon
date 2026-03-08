import type { CharacterPack, PairingResult, PremiseResult } from '../../types';
import { workflowSteps } from './constants';

type WorkflowStepsProps = {
  leadOne: CharacterPack | null;
  leadTwo: CharacterPack | null;
  pairing: PairingResult | null;
  premise: PremiseResult | null;
  hasChapterDetails: boolean;
  isSaved: boolean;
};

function stageComplete(
  stepKey: string,
  leadOne: CharacterPack | null,
  leadTwo: CharacterPack | null,
  pairing: PairingResult | null,
  premise: PremiseResult | null,
  hasChapterDetails: boolean,
  isSaved: boolean
) {
  if (stepKey === 'characters') {
    return Boolean(leadOne && leadTwo);
  }
  if (stepKey === 'pairing') {
    return Boolean(pairing);
  }
  if (stepKey === 'premise') {
    return Boolean(premise);
  }
  if (stepKey === 'chapters') {
    return hasChapterDetails;
  }
  if (stepKey === 'save') {
    return isSaved;
  }
  return false;
}

export function WorkflowSteps({ leadOne, leadTwo, pairing, premise, hasChapterDetails, isSaved }: WorkflowStepsProps) {
  return (
    <section className="mb-6 grid gap-3 md:grid-cols-5">
      {workflowSteps.map((step) => {
        const complete = stageComplete(step.key, leadOne, leadTwo, pairing, premise, hasChapterDetails, isSaved);
        return (
          <div key={step.key} className={`rounded-[1.5rem] p-4 ${complete ? 'bg-rose-600 text-white' : 'glass-panel'}`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${complete ? 'text-white/75' : 'text-rose-500'}`}>
              {complete ? 'Ready' : 'Next'}
            </p>
            <h2 className="mt-2 font-display text-2xl">{step.label}</h2>
            <p className={`mt-2 text-sm ${complete ? 'text-white/80' : 'text-rose-900/75'}`}>{step.detail}</p>
          </div>
        );
      })}
    </section>
  );
}
