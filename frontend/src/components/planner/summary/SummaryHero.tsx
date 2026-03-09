import { getHeatLevelMeta } from '../../../constants/heatLevels';

type SummaryHeroProps = {
  title: string;
  setting: string;
  romanceConfiguration: string;
  povMode: string;
  mainCharacterFocus: string;
  selectedTrope: string;
  heatLevel: string;
  targetWords: number;
  onBackToPlanner: () => void;
  onExport: (format: 'json' | 'xml') => void;
};

export function SummaryHero({
  title,
  setting,
  romanceConfiguration,
  povMode,
  mainCharacterFocus,
  selectedTrope,
  heatLevel,
  targetWords,
  onBackToPlanner,
  onExport,
}: SummaryHeroProps) {
  const heatLevelMeta = getHeatLevelMeta(heatLevel);
  const chips = [
    ['Setting', setting || 'Not set'],
    ['Main Romance', romanceConfiguration || 'Not set'],
    ['POV Mode', povMode || 'Not set'],
    ['Main Focus', mainCharacterFocus || 'Not set'],
    ['Selected Trope', selectedTrope || 'Not selected'],
    ['Heat Level', `${heatLevelMeta.label}: ${heatLevelMeta.description}`],
    ['Target Words', targetWords.toLocaleString()],
  ];

  return (
    <section className="rounded-[2rem] bg-[linear-gradient(135deg,rgba(190,24,93,0.10),rgba(255,255,255,0.92))] p-6 shadow-[0_18px_70px_rgba(128,60,73,0.10)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">Final Review</p>
          <h2 className="mt-2 font-display text-4xl text-rose-950">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-rose-900/75">
            Review the full board here before exporting it into a novel-writing prompt package.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800" onClick={onBackToPlanner}>
            Back to Planner
          </button>
          <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800" onClick={() => onExport('json')}>
            Export JSON
          </button>
          <button className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white" onClick={() => onExport('xml')}>
            Export XML
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {chips.map(([label, value]) => (
          <div key={label} className="rounded-[1.35rem] bg-white/80 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">{label}</p>
            <p className="mt-2 text-sm font-semibold text-rose-950">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
