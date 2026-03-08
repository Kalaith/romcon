import { useState } from 'react';
import type { Trope } from '../types';

type TropeTableProps = {
  tropes: Trope[];
  selectedTrope: string;
  canCreateGlobal: boolean;
  message: string | null;
  error: string | null;
  onSelect: (tropeName: string) => void;
  onCreate: (payload: { name: string; clash_engine: string; best_for: string; is_global: boolean }) => void;
  onDelete: (tropeId: number) => void;
};

export function TropeTable({ tropes, selectedTrope, canCreateGlobal, message, error, onSelect, onCreate, onDelete }: TropeTableProps) {
  const [name, setName] = useState('');
  const [clashEngine, setClashEngine] = useState('');
  const [bestFor, setBestFor] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const submit = () => {
    if (name.trim() === '' || clashEngine.trim() === '' || bestFor.trim() === '') {
      return;
    }

    onCreate({
      name,
      clash_engine: clashEngine,
      best_for: bestFor,
      is_global: canCreateGlobal && isGlobal,
    });
    setName('');
    setClashEngine('');
    setBestFor('');
    setIsGlobal(false);
    setIsAdding(false);
  };

  return (
    <section className="glass-panel rounded-[2rem] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">Trope Table</p>
          <h2 className="font-display text-2xl">Conflict With Benefits</h2>
          <p className="mt-2 text-sm text-rose-900/70">Choose one primary engine for this story. Add a new trope only when the list genuinely misses it.</p>
        </div>
        <button
          className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800"
          onClick={() => setIsAdding((current) => !current)}
        >
          {isAdding ? 'Close' : 'Add Trope'}
        </button>
      </div>
      {isAdding ? (
        <div className="mt-4 rounded-[1.5rem] bg-white/80 p-4">
          <p className="text-sm font-semibold text-rose-950">New trope</p>
          <input
            className="mt-3 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
            placeholder="Trope name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <textarea
            className="mt-3 min-h-20 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
            placeholder="Clash engine"
            value={clashEngine}
            onChange={(event) => setClashEngine(event.target.value)}
          />
          <textarea
            className="mt-3 min-h-20 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
            placeholder="Best for"
            value={bestFor}
            onChange={(event) => setBestFor(event.target.value)}
          />
          {canCreateGlobal ? (
            <label className="mt-3 flex items-center gap-2 text-sm text-rose-900/80">
              <input checked={isGlobal} onChange={(event) => setIsGlobal(event.target.checked)} type="checkbox" />
              Save as global trope
            </label>
          ) : null}
          <div className="mt-3 flex gap-3">
            <button className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white" onClick={submit}>
              Save Trope
            </button>
            <button className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800" onClick={() => setIsAdding(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      {message ? <p className="mt-4 text-sm text-rose-700">{message}</p> : null}
      {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
      <div className="mt-4 space-y-3">
        {tropes.map((trope) => (
          <div
            key={trope.id}
            className={`w-full rounded-2xl border p-4 text-left ${selectedTrope === trope.name ? 'border-rose-500 bg-rose-50' : 'border-rose-100 bg-white/80'}`}
          >
            <button className="w-full text-left" onClick={() => onSelect(trope.name)}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-rose-950">{trope.name}</p>
                <div className="flex items-center gap-2">
                  {selectedTrope === trope.name ? <span className="text-xs uppercase tracking-[0.2em] text-rose-500">Selected</span> : null}
                </div>
              </div>
              <p className="mt-1 text-sm text-rose-900/75">{trope.clash_engine}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-rose-600">{trope.best_for}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-rose-500/80">{trope.is_global ? 'Global trope' : 'Your local trope'}</p>
            </button>
            {trope.can_manage ? (
              <button className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700" onClick={() => onDelete(trope.id)}>
                Delete
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
