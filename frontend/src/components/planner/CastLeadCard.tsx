import type { CharacterPack } from '../../types';

type CastLeadCardProps = {
  label: string;
  character: CharacterPack | null;
};

export function CastLeadCard({ label, character }: CastLeadCardProps) {
  if (!character) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-rose-200 bg-white/70 p-4 text-sm text-rose-800/70">
        {label} has not been generated yet.
      </div>
    );
  }

  return (
    <article className="rounded-[1.5rem] bg-white/85 p-4 shadow-[0_10px_35px_rgba(128,60,73,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">{label}</p>
          <h3 className="font-display text-2xl text-rose-950">{character.name}</h3>
          <p className="text-sm text-rose-900/70">{character.age} {character.occupation ? `| ${character.occupation}` : ''}</p>
        </div>
        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
          Main
        </span>
      </div>
      <p className="mt-3 text-sm text-rose-900/80">{character.personality_summary}</p>
      <div className="mt-4 grid gap-2 text-sm text-rose-900/80">
        <p><strong>Core desire:</strong> {character.core_desire}</p>
        <p><strong>Core fear:</strong> {character.core_fear}</p>
        <p><strong>Comedic weakness:</strong> {character.comedic_weakness}</p>
        <p><strong>Story function:</strong> Primary romantic lead</p>
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-rose-500">
        Full lead editing stays in the main planner cards.
      </p>
    </article>
  );
}
