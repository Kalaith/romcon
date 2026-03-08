import type { PairingResult } from '../../../types';

type TropeTableEditorProps = {
  entries: PairingResult['trope_table'];
  onChange: (entries: PairingResult['trope_table']) => void;
};

export function TropeTableEditor({ entries, onChange }: TropeTableEditorProps) {
  const updateEntry = (index: number, field: 'trope' | 'score' | 'reason', value: string) => {
    onChange(
      entries.map((entry, currentIndex) =>
        currentIndex === index
          ? {
              ...entry,
              [field]: field === 'score' ? Number(value) : value,
            }
          : entry
      )
    );
  };

  const addEntry = () => {
    onChange([...entries, { trope: '', score: 5, reason: '' }]);
  };

  const removeEntry = (index: number) => {
    onChange(entries.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">Trope table</span>
        <button className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-700" onClick={addEntry}>
          Add trope
        </button>
      </div>
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div key={`trope-${index}`} className="rounded-[1.25rem] border border-rose-200 bg-white p-4">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_90px]">
              <input
                className="rounded-[1rem] border border-rose-200 px-3 py-2 text-sm"
                value={entry.trope}
                onChange={(event) => updateEntry(index, 'trope', event.target.value)}
                placeholder="Trope"
              />
              <input
                className="rounded-[1rem] border border-rose-200 px-3 py-2 text-sm"
                type="number"
                min={0}
                max={10}
                value={entry.score}
                onChange={(event) => updateEntry(index, 'score', event.target.value)}
                placeholder="Score"
              />
            </div>
            <textarea
              className="mt-3 min-h-20 w-full rounded-[1rem] border border-rose-200 px-3 py-2 text-sm"
              value={entry.reason}
              onChange={(event) => updateEntry(index, 'reason', event.target.value)}
              placeholder="Reason"
            />
            <button className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-rose-700" onClick={() => removeEntry(index)}>
              Remove trope
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
