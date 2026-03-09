import type { ReactNode } from 'react';
import type { FlavorSeed, Plan, Trope } from '../../types';
import { getAllowedHeatLevels, getHeatLevelMeta } from '../../constants/heatLevels';
import { TropeTable } from '../TropeTable';
import { FlavorSeedManager } from './FlavorSeedManager';

type ConceptBoardProps = {
  currentPlan: Plan;
  flavorSeeds: FlavorSeed[];
  tropes: Trope[];
  isGenerating: boolean;
  activeGeneration: 'concept' | 'concept_expand' | 'concept_polish' | 'characters' | 'pairing' | 'premise' | 'chapters' | 'cast' | 'cast_member' | null;
  message: string | null;
  error: string | null;
  characterButtonLabel: string;
  conceptButtonLabel: string;
  conceptExpandButtonLabel: string;
  pairingButtonLabel: string;
  premiseButtonLabel: string;
  overwriteHint?: string | null;
  isGuestUser: boolean;
  tropeMessage: string | null;
  tropeError: string | null;
  canCreateGlobalTropes: boolean;
  onFieldChange: <K extends keyof Plan>(field: K, value: Plan[K]) => void;
  onCreateFlavorSeed: (label: string) => void;
  onDeleteFlavorSeed: (seedId: number, label: string) => void;
  onCreateTrope: (payload: { name: string; clash_engine: string; best_for: string; is_global: boolean }) => void;
  onDeleteTrope: (tropeId: number) => void;
  onGenerateCharacters: () => void;
  onGenerateConcept: () => void;
  onExpandConcept: () => void;
  onGeneratePairing: () => void;
  onGeneratePremise: () => void;
};

type ConceptSectionProps = {
  title: string;
  summary: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

function ConceptSection({ title, summary, defaultOpen = false, children }: ConceptSectionProps) {
  return (
    <details className="rounded-[1.5rem] border border-rose-200 bg-white/70 p-5" open={defaultOpen}>
      <summary className="cursor-pointer list-none">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">{title}</p>
            <p className="mt-2 text-sm text-rose-900/75">{summary}</p>
          </div>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">Open</span>
        </div>
      </summary>
      <div className="mt-5">{children}</div>
    </details>
  );
}

export function ConceptBoard({
  currentPlan,
  flavorSeeds,
  tropes,
  isGenerating,
  activeGeneration,
  message,
  error,
  characterButtonLabel,
  conceptButtonLabel,
  conceptExpandButtonLabel,
  pairingButtonLabel,
  premiseButtonLabel,
  overwriteHint,
  isGuestUser,
  tropeMessage,
  tropeError,
  canCreateGlobalTropes,
  onFieldChange,
  onCreateFlavorSeed,
  onDeleteFlavorSeed,
  onCreateTrope,
  onDeleteTrope,
  onGenerateCharacters,
  onGenerateConcept,
  onExpandConcept,
  onGeneratePairing,
  onGeneratePremise,
}: ConceptBoardProps) {
  const allowedHeatLevels = getAllowedHeatLevels(isGuestUser);
  const selectedHeatLevel = getHeatLevelMeta(currentPlan.heat_level);
  const selectedTrope = currentPlan.trope_notes[0] || '';
  const quickTropes = tropes.slice(0, 8);
  const isGeneratingConcept = activeGeneration === 'concept';
  const isExpandingConcept = activeGeneration === 'concept_expand';
  const isGeneratingCharacters = activeGeneration === 'characters';
  const isGeneratingPairing = activeGeneration === 'pairing';
  const isGeneratingPremise = activeGeneration === 'premise';

  const toggleFlavorSeed = (label: string) => {
    const nextSeeds = currentPlan.flavor_seeds.includes(label)
      ? currentPlan.flavor_seeds.filter((seed) => seed !== label)
      : [...currentPlan.flavor_seeds, label];

    onFieldChange('flavor_seeds', nextSeeds);
  };

  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <div className="space-y-4">
        <ConceptSection
          title="Core Setup"
          summary={`${currentPlan.title || 'Untitled project'} | ${currentPlan.setting || 'Setting not set'} | ${selectedHeatLevel.label}`}
          defaultOpen
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Plan title</span>
              <input
                className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
                value={currentPlan.title}
                onChange={(event) => onFieldChange('title', event.target.value)}
                placeholder="Leave blank and let Generate Concept name the project"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Heat level</span>
              <select
                className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
                value={currentPlan.heat_level}
                onChange={(event) => onFieldChange('heat_level', event.target.value)}
              >
                {allowedHeatLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <span className="mt-2 block text-xs text-rose-900/65">{selectedHeatLevel.description}</span>
              {isGuestUser ? <span className="mt-1 block text-xs text-rose-900/55">Guest accounts can use Chaste, Sweet, or Warm. Link an account to unlock Steamy and above.</span> : null}
            </label>
          </div>
          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Concept brief</span>
            <textarea
              className="min-h-28 w-full rounded-[1.5rem] border border-rose-200 bg-white px-4 py-3"
              value={currentPlan.concept_brief}
              onChange={(event) => onFieldChange('concept_brief', event.target.value)}
              placeholder="Optional seed idea for Generate Concept, or edit the generated concept brief here."
            />
          </label>
          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Setting</span>
              <input
                className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
                value={currentPlan.setting}
                onChange={(event) => onFieldChange('setting', event.target.value)}
                placeholder="Optional setting seed"
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
              <span className="mt-2 block text-xs text-rose-900/65">Default is 45,000 so the planner can map 15 chapters at about 3,000 words each, while actual drafted chapters can still land closer to 2,000.</span>
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800 disabled:cursor-not-allowed disabled:opacity-60" onClick={onGenerateConcept} disabled={isGenerating}>
              {isGeneratingConcept ? 'Generating...' : conceptButtonLabel}
            </button>
            <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800 disabled:cursor-not-allowed disabled:opacity-60" onClick={onExpandConcept} disabled={isGenerating}>
              {isExpandingConcept ? 'Expanding...' : conceptExpandButtonLabel}
            </button>
          </div>
          <p className="mt-3 text-sm text-rose-900/70">
            `Generate Concept` creates a fresh concept board from scratch, including title and heat fit. `Expand Concept` keeps the current idea and builds it out without replacing the core direction.
          </p>
        </ConceptSection>

        <ConceptSection
          title="Romance Engine"
          summary={`${currentPlan.romance_configuration || 'Romance not set'}${currentPlan.trope_notes[0] ? ` | ${currentPlan.trope_notes[0]}` : ''}${currentPlan.dominant_romance_arc ? ` | ${currentPlan.dominant_romance_arc}` : ''}`}
          defaultOpen={!selectedTrope}
        >
          <div className="mb-4 rounded-[1.5rem] border border-rose-200 bg-rose-50/70 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Trope Direction</p>
                <p className="mt-2 text-sm text-rose-900/80">
                  Pick a trope now, or skip it and fill the romance fields directly.
                </p>
              </div>
              {selectedTrope ? (
                <button
                  className="rounded-full border border-rose-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-800"
                  onClick={() => onFieldChange('trope_notes', [])}
                  type="button"
                >
                  Clear Trope
                </button>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickTropes.map((trope) => {
                const isSelected = selectedTrope === trope.name;
                return (
                  <button
                    key={trope.id}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${isSelected ? 'bg-rose-600 text-white' : 'border border-rose-300 bg-white text-rose-800'}`}
                    onClick={() => onFieldChange('trope_notes', [trope.name])}
                    type="button"
                  >
                    {trope.name}
                  </button>
                );
              })}
            </div>

            <details className="mt-4 rounded-[1.25rem] border border-rose-200 bg-white p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-rose-900">
                {selectedTrope ? `Why this helps and browse more tropes` : 'Need help or want to browse all tropes?'}
              </summary>
              <div className="mt-3">
                <p className="text-sm text-rose-900/75">
                  Selecting a trope sets direction only. It does not overwrite `dominant romance arc`, `central external pressure`, `emotional question`, or `romance structure notes`. Those fields stay editable and independent.
                </p>
                <div className="mt-4">
                  <TropeTable
                    tropes={tropes}
                    selectedTrope={selectedTrope}
                    canCreateGlobal={canCreateGlobalTropes}
                    message={tropeMessage}
                    error={tropeError}
                    onSelect={(tropeName) => onFieldChange('trope_notes', tropeName ? [tropeName] : [])}
                    onCreate={onCreateTrope}
                    onDelete={onDeleteTrope}
                  />
                </div>
              </div>
            </details>
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
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Dominant romance arc</span>
              <textarea
                className="min-h-28 w-full rounded-[1.5rem] border border-rose-200 bg-white px-4 py-3"
                value={currentPlan.dominant_romance_arc}
                onChange={(event) => onFieldChange('dominant_romance_arc', event.target.value)}
                placeholder="Jessica and Caleb move from rivalry to trust"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Central external pressure</span>
              <textarea
                className="min-h-28 w-full rounded-[1.5rem] border border-rose-200 bg-white px-4 py-3"
                value={currentPlan.central_external_pressure}
                onChange={(event) => onFieldChange('central_external_pressure', event.target.value)}
                placeholder="The wedding must be saved before it collapses publicly"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Emotional question</span>
              <textarea
                className="min-h-28 w-full rounded-[1.5rem] border border-rose-200 bg-white px-4 py-3"
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
        </ConceptSection>

        <ConceptSection
          title="Narrative Lens"
          summary={`${currentPlan.pov_mode ? currentPlan.pov_mode.replaceAll('_', ' ') : 'POV not set'}${currentPlan.main_character_focus ? ` | ${currentPlan.main_character_focus}` : ''}`}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Main character focus</span>
              <input
                className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
                value={currentPlan.main_character_focus}
                onChange={(event) => onFieldChange('main_character_focus', event.target.value)}
                placeholder="Jessica is the central POV lead"
              />
            </label>
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
          </div>
          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">POV notes</span>
            <input
              className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3"
              value={currentPlan.pov_notes}
              onChange={(event) => onFieldChange('pov_notes', event.target.value)}
              placeholder="Example: Odd chapters Jessica, even chapters Caleb"
            />
          </label>
        </ConceptSection>

        <ConceptSection
          title="Optional Flavor"
          summary={currentPlan.flavor_seeds.length > 0 ? `${currentPlan.flavor_seeds.length} flavor source${currentPlan.flavor_seeds.length === 1 ? '' : 's'} selected` : 'No flavor sources selected'}
        >
          <FlavorSeedManager
            seeds={flavorSeeds}
            selectedSeeds={currentPlan.flavor_seeds}
            onToggle={toggleFlavorSeed}
            onCreate={onCreateFlavorSeed}
            onDelete={onDeleteFlavorSeed}
          />
        </ConceptSection>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800 disabled:cursor-not-allowed disabled:opacity-60" onClick={onGenerateCharacters} disabled={isGenerating}>
          {isGeneratingCharacters ? 'Generating...' : characterButtonLabel}
        </button>
        <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800 disabled:cursor-not-allowed disabled:opacity-60" onClick={onGeneratePairing} disabled={isGenerating}>
          {isGeneratingPairing ? 'Generating...' : pairingButtonLabel}
        </button>
        <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800 disabled:cursor-not-allowed disabled:opacity-60" onClick={onGeneratePremise} disabled={isGenerating}>
          {isGeneratingPremise ? 'Generating...' : premiseButtonLabel}
        </button>
      </div>

      {overwriteHint ? <p className="mt-3 text-sm text-rose-900/70">{overwriteHint}</p> : null}
      {message ? <p className="mt-4 text-sm text-rose-700">{message}</p> : null}
      {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
    </section>
  );
}
