import type { CharacterPack, PairingResult, PremiseResult } from '../../types';
import { workflowSteps } from './constants';

type WorkflowStepsProps = {
  activeStep: string;
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

export function WorkflowSteps({ activeStep, hasConcept, leadOne, leadTwo, pairing, hasStoryCast, premise, hasChapterDetails, isSaved, onStepClick }: WorkflowStepsProps) {
  const completionByStep = workflowSteps.map((step) => ({
    ...step,
    complete: stageComplete(step.key, hasConcept, leadOne, leadTwo, pairing, hasStoryCast, premise, hasChapterDetails, isSaved),
  }));

  return (
    <section className="mb-6 overflow-x-auto rounded-[1.5rem] border border-stone-200 bg-white px-3 py-3 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
      <div className="flex min-w-max items-center gap-2">
      {completionByStep.map((step, index) => {
        const complete = step.complete;
        const isActive = step.key === activeStep;
        const statusLabel = complete ? 'Ready' : isActive ? 'Current' : 'Pending';

        return (
          <div key={step.key} className="flex items-center gap-2">
            <button
              className={`flex min-w-[140px] items-center gap-3 rounded-full border px-4 py-3 text-left transition ${
                isActive
                  ? 'border-rose-600 bg-rose-600 text-white'
                  : complete
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-rose-300 hover:text-rose-700'
              }`}
              onClick={() => onStepClick(step.key)}
              type="button"
            >
              <div className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-white' : complete ? 'bg-emerald-500' : 'bg-stone-300'}`} />
              <div>
                <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${isActive ? 'text-white/80' : complete ? 'text-emerald-700' : 'text-stone-500'}`}>{statusLabel}</p>
                <p className="text-sm font-semibold">{step.label}</p>
              </div>
            </button>
            {index < completionByStep.length - 1 ? <div className="h-px w-5 bg-stone-300" /> : null}
          </div>
        );
      })}
      </div>
    </section>
  );
}
