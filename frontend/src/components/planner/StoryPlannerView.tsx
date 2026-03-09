import type { FlavorSeed, Plan, Trope } from '../../types';
import { ChapterDetailsCard } from './ChapterDetailsCard';
import { CharacterCard } from './CharacterCard';
import { ConceptBoard } from './ConceptBoard';
import { PairingCard } from './PairingCard';
import { PremiseCard } from './PremiseCard';
import { StagePanel } from './StagePanel';

type StoryPlannerViewProps = {
  currentPlan: Plan;
  flavorSeeds: FlavorSeed[];
  tropes: Trope[];
  hasLeads: boolean;
  hasConcept: boolean;
  hasPairing: boolean;
  hasPremise: boolean;
  hasChapterDetails: boolean;
  isGenerating: boolean;
  activeGeneration: 'concept' | 'concept_expand' | 'concept_polish' | 'characters' | 'pairing' | 'premise' | 'chapters' | 'cast' | 'cast_member' | null;
  isSaving: boolean;
  plannerMessage: string | null;
  plannerError: string | null;
  tropeMessage: string | null;
  tropeError: string | null;
  isGuestUser: boolean;
  canCreateGlobalTropes: boolean;
  onFieldChange: <K extends keyof Plan>(field: K, value: Plan[K]) => void;
  onCreateFlavorSeed: (label: string) => void;
  onDeleteFlavorSeed: (seedId: number, label: string) => void;
  onCreateTrope: (payload: { name: string; clash_engine: string; best_for: string; is_global: boolean }) => void;
  onDeleteTrope: (tropeId: number) => void;
  onGenerateConcept: () => void;
  onExpandConcept: () => void;
  onGenerateCharacters: () => void;
  onGeneratePairing: () => void;
  onGeneratePremise: () => void;
  onGenerateChapterDetails: () => void;
  onSaveEditedCharacter: (field: 'lead_one' | 'lead_two', character: NonNullable<Plan['lead_one']>) => Promise<void>;
  onSaveEditedPairing: (pairing: NonNullable<Plan['pairing']>) => Promise<void>;
  onSaveEditedPremise: (premise: NonNullable<Plan['premise']>) => Promise<void>;
  onSaveChapterDetails: (chapterDetails: Plan['chapter_details']) => Promise<void>;
  onSaveAndReviewStory: () => void;
};

export function StoryPlannerView({
  currentPlan,
  flavorSeeds,
  tropes,
  hasLeads,
  hasConcept,
  hasPairing,
  hasPremise,
  hasChapterDetails,
  isGenerating,
  activeGeneration,
  isSaving,
  plannerMessage,
  plannerError,
  tropeMessage,
  tropeError,
  isGuestUser,
  canCreateGlobalTropes,
  onFieldChange,
  onCreateFlavorSeed,
  onDeleteFlavorSeed,
  onCreateTrope,
  onDeleteTrope,
  onGenerateConcept,
  onExpandConcept,
  onGenerateCharacters,
  onGeneratePairing,
  onGeneratePremise,
  onGenerateChapterDetails,
  onSaveEditedCharacter,
  onSaveEditedPairing,
  onSaveEditedPremise,
  onSaveChapterDetails,
  onSaveAndReviewStory,
}: StoryPlannerViewProps) {
  return (
    <>
      <div id="planner-step-1">
        <ConceptBoard
          characterButtonLabel={hasLeads ? 'Regenerate Character Packs' : 'Generate Character Packs'}
          conceptButtonLabel={hasConcept ? 'Regenerate Concept' : 'Generate Concept'}
          conceptExpandButtonLabel="Expand Concept"
          currentPlan={currentPlan}
          flavorSeeds={flavorSeeds}
          tropes={tropes}
          isGenerating={isGenerating}
          activeGeneration={activeGeneration}
          message={plannerMessage}
          error={plannerError}
          tropeMessage={tropeMessage}
          tropeError={tropeError}
          overwriteHint={hasConcept || hasLeads || hasPairing || hasPremise ? 'Regenerating this section will replace the current version.' : null}
          isGuestUser={isGuestUser}
          canCreateGlobalTropes={canCreateGlobalTropes}
          pairingButtonLabel={hasPairing ? 'Regenerate Pairing' : 'Pair Them'}
          premiseButtonLabel={hasPremise ? 'Regenerate Premise' : 'Build Premise'}
          onFieldChange={onFieldChange}
          onCreateFlavorSeed={onCreateFlavorSeed}
          onDeleteFlavorSeed={onDeleteFlavorSeed}
          onCreateTrope={onCreateTrope}
          onDeleteTrope={onDeleteTrope}
          onGenerateConcept={onGenerateConcept}
          onExpandConcept={onExpandConcept}
          onGenerateCharacters={onGenerateCharacters}
          onGeneratePairing={onGeneratePairing}
          onGeneratePremise={onGeneratePremise}
        />
      </div>

      <StagePanel
        id="planner-step-2"
        eyebrow="Step 2"
        title="Build the leads"
        description="Once the concept board is solid, generate or edit the two main characters who will carry it."
        isLocked={!hasConcept}
        lockMessage="Generate or fill the concept board first"
        action={
          hasConcept && !hasLeads ? (
            <button
              className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-rose-300"
              disabled={isGenerating}
              onClick={onGenerateCharacters}
            >
              {activeGeneration === 'characters' ? 'Generating...' : 'Generate Character Packs'}
            </button>
          ) : undefined
        }
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <CharacterCard label="Lead One" character={currentPlan.lead_one} isSaving={isSaving} onSave={(character) => onSaveEditedCharacter('lead_one', character)} />
          <CharacterCard label="Lead Two" character={currentPlan.lead_two} isSaving={isSaving} onSave={(character) => onSaveEditedCharacter('lead_two', character)} />
        </div>
      </StagePanel>

      <StagePanel
        id="planner-step-3"
        eyebrow="Step 3"
        title="Pressure-test the pairing"
        description="Once the two leads exist, define why they clash, why they fit, and which trope actually carries the novella."
        isLocked={!hasLeads}
        lockMessage="Generate both leads first"
        action={
          hasLeads && !hasPairing ? (
            <button
              className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-rose-300"
              disabled={isGenerating}
              onClick={onGeneratePairing}
            >
              {activeGeneration === 'pairing' ? 'Generating...' : 'Pair Them'}
            </button>
          ) : undefined
        }
      >
        {hasLeads ? <PairingCard pairing={currentPlan.pairing} isSaving={isSaving} onSave={onSaveEditedPairing} /> : <p className="text-sm text-rose-800/70">Pairing stays collapsed until both lead cards are in place.</p>}
      </StagePanel>

      <StagePanel
        id="planner-step-4"
        eyebrow="Step 4"
        title="Trap them inside the premise"
        description="After the pairing logic is strong enough, shape the novella engine, the public risk, and the chapter skeleton."
        isLocked={!hasPairing}
        lockMessage="Generate pairing first"
        action={
          hasPairing && !hasPremise ? (
            <button
              className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-rose-300"
              disabled={isGenerating}
              onClick={onGeneratePremise}
            >
              {activeGeneration === 'premise' ? 'Generating...' : 'Build Premise'}
            </button>
          ) : undefined
        }
      >
        {hasPairing ? <PremiseCard premise={currentPlan.premise} isSaving={isSaving} onSave={onSaveEditedPremise} /> : <p className="text-sm text-rose-800/70">Premise work unlocks after the pairing analysis exists.</p>}
      </StagePanel>

      <StagePanel
        id="planner-step-5"
        eyebrow="Step 5"
        title="Detail the chapter plan"
        description="Translate the broad premise beats into chapter-level goals, reveals, emotional turns, and carry-forward hooks."
        isLocked={!hasPremise}
        lockMessage="Generate premise first"
      >
        {hasPremise ? (
          <ChapterDetailsCard
            chapterDetails={currentPlan.chapter_details}
            premise={currentPlan.premise}
            targetWords={currentPlan.target_words}
            isGenerating={activeGeneration === 'chapters'}
            generateButtonLabel={hasChapterDetails ? 'Regenerate Chapter Details' : 'Generate Chapter Details'}
            isSaving={isSaving}
            onGenerate={onGenerateChapterDetails}
            onSave={onSaveChapterDetails}
          />
        ) : (
          <p className="text-sm text-rose-800/70">Chapter planning opens once the premise and chapter-beat frame exist.</p>
        )}
      </StagePanel>

      <StagePanel
        id="planner-step-6"
        eyebrow="Step 6"
        title="Save and review the story"
        description="Lock in the best version of the board, then switch into a clean story summary before exporting or iterating again."
        isLocked={!hasChapterDetails}
        lockMessage="Build chapter plan first"
      >
        {hasChapterDetails ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-[1.5rem] bg-white/80 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-rose-950">Ready to review the full story board</p>
                <p className="mt-1 text-sm text-rose-900/70">Save this version and open the summary page with the full novella package.</p>
              </div>
              <button className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-rose-300" disabled={isSaving} onClick={onSaveAndReviewStory}>
                {isSaving ? 'Saving...' : 'Save and Review Story'}
              </button>
            </div>
            <textarea
              className="min-h-40 w-full rounded-[1.5rem] border border-rose-200 bg-white px-4 py-3"
              value={currentPlan.notes}
              onChange={(event) => onFieldChange('notes', event.target.value)}
              placeholder="Keep the jokes, emotional turns, bans, and must-save dynamics worth protecting."
            />
            <div className="flex flex-col gap-3 rounded-[1.5rem] bg-white/80 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-rose-950">Finalise this version of the board</p>
                <p className="mt-1 text-sm text-rose-900/70">Save the current story and open a clean summary page with the full novella package.</p>
              </div>
              <button className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-rose-300" disabled={isSaving} onClick={onSaveAndReviewStory}>
                {isSaving ? 'Saving...' : 'Save and Review Story'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-rose-800/70">Finish the chapter plan first so the final summary includes the detailed scene map.</p>
        )}
      </StagePanel>
    </>
  );
}
