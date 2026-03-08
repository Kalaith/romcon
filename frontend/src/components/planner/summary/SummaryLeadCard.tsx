import type { Plan } from '../../../types';
import { SummaryField } from './SummaryField';

type SummaryLeadCardProps = {
  title: string;
  character: Plan['lead_one'];
};

export function SummaryLeadCard({ title, character }: SummaryLeadCardProps) {
  if (!character) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-rose-200 bg-white/60 p-5 text-sm text-rose-800/70">
        No lead saved yet.
      </div>
    );
  }

  return (
    <article className="rounded-[1.5rem] bg-white/85 p-5 shadow-[0_12px_32px_rgba(128,60,73,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">{title}</p>
      <h3 className="mt-2 font-display text-2xl text-rose-950">{character.name || 'Untitled lead'}</h3>
      <p className="mt-1 text-sm text-rose-900/70">{[character.age, character.occupation].filter(Boolean).join(' | ')}</p>
      <div className="mt-4 space-y-4">
        <SummaryField label="Personality" value={character.personality_summary} />
        <SummaryField label="Core Desire" value={character.core_desire} />
        <SummaryField label="Core Fear" value={character.core_fear} />
        <SummaryField label="Public Competence" value={character.public_competence} />
        <SummaryField label="Private Mess" value={character.private_mess} />
        <SummaryField label="Comedic Weakness" value={character.comedic_weakness} />
        <SummaryField label="Romantic Blind Spot" value={character.romantic_blind_spot} />
      </div>
    </article>
  );
}
