import type { CharacterPack, PairingResult, PremiseResult } from '../../types';
import { workflowSteps } from './constants';

type WorkflowStepsProps = {
  hasConcept: boolean;
  leadOne: CharacterPack | null;
  leadTwo: CharacterPack | null;
  pairing: PairingResult | null;
  hasStoryCast: boolean;
  premise: PremiseResult | null;
  hasChapterDetails: boolean;
  isSaved: boolean;
  onStepClick: (stepKey: string) => void;
};

function stageComplete(
  stepKey: string,
  hasConcept: boolean,
  leadOne: CharacterPack | null,
  leadTwo: CharacterPack | null,
  pairing: PairingResult | null,
  hasStoryCast: boolean,
  premise: PremiseResult | null,
  hasChapterDetails: boolean,
  isSaved: boolean
) {
  if (stepKey === 'characters') {
    return Boolean(leadOne && leadTwo);
  }
  if (stepKey === 'concept') {
    return hasConcept;
  }
  if (stepKey === 'pairing') {
    return Boolean(pairing);
  }
  if (stepKey === 'cast') {
    return hasStoryCast;
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

export function WorkflowSteps({ hasConcept, leadOne, leadTwo, pairing, hasStoryCast, premise, hasChapterDetails, isSaved, onStepClick }: WorkflowStepsProps) {
  const completionByStep = workflowSteps.map((step) => ({
    ...step,
    complete: stageComplete(step.key, hasConcept, leadOne, leadTwo, pairing, hasStoryCast, premise, hasChapterDetails, isSaved),
  }));
  const currentIndex = completionByStep.findIndex((step) => !step.complete);
  const activeIndex = currentIndex === -1 ? completionByStep.length - 1 : currentIndex;

  return (
    <section className="mb-6 grid gap-3 md:grid-cols-7">
      {completionByStep.map((step, index) => {
        const complete = step.complete;
        const isCurrent = index === activeIndex && !complete;
        const isPending = index > activeIndex;
        const statusLabel = complete ? 'Ready' : isCurrent ? 'Current' : 'Pending';

        return (
          <button
            key={step.key}
            className={`rounded-[1.5rem] p-4 text-left transition ${complete ? 'bg-rose-600 text-white' : isCurrent ? 'border border-rose-400 bg-rose-50' : 'glass-panel'} ${isPending ? 'opacity-85' : ''}`}
            onClick={() => onStepClick(step.key)}
            type="button"
          >
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${complete ? 'text-white/75' : isCurrent ? 'text-rose-700' : 'text-rose-500'}`}>
              {statusLabel}
            </p>
            <h2 className="mt-2 font-display text-2xl">{step.label}</h2>
            <p className={`mt-2 text-sm ${complete ? 'text-white/80' : 'text-rose-900/75'}`}>{step.detail}</p>
          </button>
        );
      })}
    </section>
  );
}
