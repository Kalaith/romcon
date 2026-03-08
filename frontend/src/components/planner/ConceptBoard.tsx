import type { Plan } from '../../types';
import type { FlavorSeed } from '../../types';
import { FlavorSeedManager } from './FlavorSeedManager';

type ConceptBoardProps = {
  currentPlan: Plan;
  flavorSeeds: FlavorSeed[];
  isGenerating: boolean;
  message: string | null;
  error: string | null;
  characterButtonLabel: string;
  pairingButtonLabel: string;
  premiseButtonLabel: string;
  overwriteHint?: string | null;
  onFieldChange: <K extends keyof Plan>(field: K, value: Plan[K]) => void;
  onCreateFlavorSeed: (label: string) => void;
  onDeleteFlavorSeed: (seedId: number, label: string) => void;
  onGenerateCharacters: () => void;
  onGeneratePairing: () => void;
  onGeneratePremise: () => void;
};

export function ConceptBoard({
  currentPlan,
  flavorSeeds,
  isGenerating,
  message,
  error,
  characterButtonLabel,
  pairingButtonLabel,
  premiseButtonLabel,
  overwriteHint,
  onFieldChange,
  onCreateFlavorSeed,
  onDeleteFlavorSeed,
  onGenerateCharacters,
  onGeneratePairing,
  onGeneratePremise,
}: ConceptBoardProps) {
  const toggleFlavorSeed = (label: string) => {
    const nextSeeds = currentPlan.flavor_seeds.includes(label)
      ? currentPlan.flavor_seeds.filter((seed) => seed !== label)
      : [...currentPlan.flavor_seeds, label];

    onFieldChange('flavor_seeds', nextSeeds);
  };

  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Plan title</span>
          <input
            className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
            value={currentPlan.title}
            onChange={(event) => onFieldChange('title', event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Heat level</span>
          <select
            className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
            value={currentPlan.heat_level}
            onChange={(event) => onFieldChange('heat_level', event.target.value)}
          >
            <option value="sweet">Sweet</option>
            <option value="warm">Warm</option>
            <option value="steamy">Steamy</option>
          </select>
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Concept brief</span>
        <textarea
          className="min-h-28 w-full rounded-[1.5rem] border border-rose-200 bg-white px-4 py-3"
          value={currentPlan.concept_brief}
          onChange={(event) => onFieldChange('concept_brief', event.target.value)}
        />
      </label>
      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Setting</span>
          <input
            className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
            value={currentPlan.setting}
            onChange={(event) => onFieldChange('setting', event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Target words</span>
          <input
            className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
            type="number"
            value={currentPlan.target_words}
            onChange={(event) => onFieldChange('target_words', Number(event.target.value))}
          />
        </label>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Main romance</span>
          <select
            className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
            value={currentPlan.romance_configuration}
            onChange={(event) => onFieldChange('romance_configuration', event.target.value)}
          >
            <option value="m/f">M/F</option>
            <option value="f/f">F/F</option>
            <option value="m/m">M/M</option>
            <option value="f+/m">F+/M</option>
            <option value="f+/m+">F+/M+</option>
            <option value="m+/f">M+/F</option>
            <option value="m+/f+">M+/F+</option>
            <option value="ensemble">Ensemble / Custom</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Main character focus</span>
          <input
            className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
            value={currentPlan.main_character_focus}
            onChange={(event) => onFieldChange('main_character_focus', event.target.value)}
            placeholder="Jessica is the central POV lead"
          />
        </label>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">POV mode</span>
          <select
            className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
            value={currentPlan.pov_mode}
            onChange={(event) => onFieldChange('pov_mode', event.target.value)}
          >
            <option value="single_close_third">Single Close Third</option>
            <option value="dual_close_third">Dual Close Third</option>
            <option value="single_first_person">Single First Person</option>
            <option value="dual_first_person">Dual First Person</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">POV notes</span>
          <input
            className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
            value={currentPlan.pov_notes}
            onChange={(event) => onFieldChange('pov_notes', event.target.value)}
            placeholder="Example: Odd chapters Jessica, even chapters Caleb"
          />
        </label>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Dominant romance arc</span>
          <input
            className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
            value={currentPlan.dominant_romance_arc}
            onChange={(event) => onFieldChange('dominant_romance_arc', event.target.value)}
            placeholder="Jessica and Caleb move from rivalry to trust"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Central external pressure</span>
          <input
            className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
            value={currentPlan.central_external_pressure}
            onChange={(event) => onFieldChange('central_external_pressure', event.target.value)}
            placeholder="The wedding must be saved before it collapses publicly"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Emotional question</span>
          <input
            className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
            value={currentPlan.emotional_question}
            onChange={(event) => onFieldChange('emotional_question', event.target.value)}
            placeholder="Can Jessica risk being loved in public mess?"
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Romance structure notes</span>
        <textarea
          className="min-h-24 w-full rounded-[1.5rem] border border-rose-200 bg-white px-4 py-3"
          value={currentPlan.romance_structure_notes}
          onChange={(event) => onFieldChange('romance_structure_notes', event.target.value)}
          placeholder="Example: Jessica is pursued by three men, but Caleb is the main endgame romance. Liam and Noah should create rivalry and temptation."
        />
      </label>
      <FlavorSeedManager
        seeds={flavorSeeds}
        selectedSeeds={currentPlan.flavor_seeds}
        onToggle={toggleFlavorSeed}
        onCreate={onCreateFlavorSeed}
        onDelete={onDeleteFlavorSeed}
      />
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white" onClick={onGenerateCharacters} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : characterButtonLabel}
        </button>
        <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800" onClick={onGeneratePairing} disabled={isGenerating}>
          {pairingButtonLabel}
        </button>
        <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800" onClick={onGeneratePremise} disabled={isGenerating}>
          {premiseButtonLabel}
        </button>
      </div>
      {overwriteHint ? <p className="mt-3 text-sm text-rose-900/70">{overwriteHint}</p> : null}
      {message ? <p className="mt-4 text-sm text-rose-700">{message}</p> : null}
      {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
    </section>
  );
}
