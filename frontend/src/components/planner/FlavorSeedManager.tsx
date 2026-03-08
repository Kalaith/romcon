import { useState } from 'react';
import type { FlavorSeed } from '../../types';

type FlavorSeedManagerProps = {
  seeds: FlavorSeed[];
  selectedSeeds: string[];
  onToggle: (label: string) => void;
  onCreate: (label: string) => void;
  onDelete: (seedId: number, label: string) => void;
};

export function FlavorSeedManager({ seeds, selectedSeeds, onToggle, onCreate, onDelete }: FlavorSeedManagerProps) {
  const [draft, setDraft] = useState('');

  const submit = () => {
    const value = draft.trim();
    if (value === '') {
      return;
    }

    onCreate(value);
    setDraft('');
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Flavor sources</p>
        <p className="text-xs text-rose-900/60">Create your own reusable setup angles.</p>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="e.g. family chaos"
        />
        <button className="rounded-full bg-rose-600 px-4 py-3 text-sm font-semibold text-white" onClick={submit}>
          Add
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {seeds.map((seed) => {
          const selected = selectedSeeds.includes(seed.label);
          return (
            <div key={seed.id} className={`flex items-center gap-2 rounded-full border px-3 py-2 ${selected ? 'border-rose-500 bg-rose-50' : 'border-rose-200 bg-white'}`}>
              <button className="text-sm text-rose-900/85" onClick={() => onToggle(seed.label)}>
                {seed.label}
              </button>
              <button className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-500" onClick={() => onDelete(seed.id, seed.label)}>
                Remove
              </button>
            </div>
          );
        })}
        {seeds.length === 0 ? <p className="text-sm text-rose-800/70">No saved flavor sources yet.</p> : null}
      </div>
    </div>
  );
}
