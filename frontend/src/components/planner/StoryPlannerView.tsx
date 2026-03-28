import type { CastMember, CharacterLibraryEntry, FlavorSeed, Plan, Trope } from '../../types';
import { workflowSteps } from './constants';
import { ChapterDetailsCard } from './ChapterDetailsCard';
import { CharacterCard } from './CharacterCard';
import { ConceptBoard } from './ConceptBoard';
import { PairingCard } from './PairingCard';
import { PlannerCastStage } from './PlannerCastStage';
import { PremiseCard } from './PremiseCard';
import { StagePanel } from './StagePanel';

type StoryPlannerViewProps = {
  activeStage: 'concept' | 'characters' | 'pairing' | 'cast' | 'premise' | 'chapters' | 'save';
  currentPlan: Plan;
  libraryEntries: CharacterLibraryEntry[];
  flavorSeeds: FlavorSeed[];
  tropes: Trope[];
  hasLeads: boolean;
  hasConcept: boolean;
  hasPairing: boolean;
  hasStoryCast: boolean;
  hasPremise: boolean;
  hasChapterDetails: boolean;
  isGenerating: boolean;
  activeGeneration: 'concept' | 'concept_expand' | 'concept_polish' | 'characters' | 'pairing' | 'premise' | 'chapters' | 'cast' | 'cast_member' | 'chapter_draft' | null;
  isSaving: boolean;
  plannerMessage: string | null;
  plannerError: string | null;
  castMessage: string | null;
  castError: string | null;
  tropeMessage: string | null;
  tropeError: string | null;
  isGuestUser: boolean;
  canCreateGlobalTropes: boolean;
  onFieldChange: <K extends keyof Plan>(field: K, value: Plan[K]) => void;
  onStageChange: (stage: 'concept' | 'characters' | 'pairing' | 'cast' | 'premise' | 'chapters' | 'save') => void;
  onCreateFlavorSeed: (label: string) => void;
  onDeleteFlavorSeed: (seedId: number, label: string) => void;
  onCreateTrope: (payload: { name: string; clash_engine: string; best_for: string; is_global: boolean }) => void;
  onDeleteTrope: (tropeId: number) => void;
  onGenerateConcept: () => void;
  onExpandConcept: () => void;
  onGenerateCharacters: () => void;
  onGeneratePairing: () => void;
  onGenerateCast: () => void;
  onGeneratePremise: () => void;
  onGenerateChapterDetails: () => void;
  onSaveEditedCharacter: (field: 'lead_one' | 'lead_two', character: NonNullable<Plan['lead_one']>) => Promise<void>;
  onSaveEditedPairing: (pairing: NonNullable<Plan['pairing']>) => Promise<void>;
  onSaveEditedPremise: (premise: NonNullable<Plan['premise']>) => Promise<void>;
  onSaveChapterDetails: (chapterDetails: Plan['chapter_details']) => Promise<void>;
  onGenerateMemberFromPrompt: (prompt: string) => Promise<CastMember>;
  onSaveEditedCast: (cast: Plan['cast']) => Promise<void>;
  onCreateLibraryEntry: (member: CastMember) => Promise<void>;
  onInjectLibraryEntry: (entry: CharacterLibraryEntry) => Promise<void>;
  onSaveDraft: () => void;
  onSaveAndReviewStory: () => void;
};

export function StoryPlannerView({
  activeStage,
  currentPlan,
  libraryEntries,
  flavorSeeds,
  tropes,
  hasLeads,
  hasConcept,
  hasPairing,
  hasStoryCast,
  hasPremise,
  hasChapterDetails,
  isGenerating,
  activeGeneration,
  isSaving,
  plannerMessage,
  plannerError,
  castMessage,
  castError,
  tropeMessage,
  tropeError,
  isGuestUser,
  canCreateGlobalTropes,
  onFieldChange,
  onStageChange,
  onCreateFlavorSeed,
  onDeleteFlavorSeed,
  onCreateTrope,
  onDeleteTrope,
  onGenerateConcept,
  onExpandConcept,
  onGenerateCharacters,
  onGeneratePairing,
  onGenerateCast,
  onGeneratePremise,
  onGenerateChapterDetails,
  onSaveEditedCharacter,
  onSaveEditedPairing,
  onSaveEditedPremise,
  onSaveChapterDetails,
  onGenerateMemberFromPrompt,
  onSaveEditedCast,
  onCreateLibraryEntry,
  onInjectLibraryEntry,
  onSaveDraft,
  onSaveAndReviewStory,
}: StoryPlannerViewProps) {
  const stages = workflowSteps;
  const activeStageIndex = stages.findIndex((stage) => stage.key === activeStage);
  const previousStage = activeStageIndex > 0 ? stages[activeStageIndex - 1] : null;
  const nextStage = activeStageIndex < stages.length - 1 ? stages[activeStageIndex + 1] : null;

  const renderFooter = (options?: { primaryAction?: { label: string; onClick: () => void; disabled?: boolean; secondary?: boolean } }) => (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-stone-600">
        {nextStage ? `Next up: ${nextStage.label}` : 'Finalise this board and open the full summary.'}
      </div>
      <div className="flex flex-wrap gap-3">
        {previousStage ? (
          <button className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700" onClick={() => onStageChange(previousStage.key as StoryPlannerViewProps['activeStage'])} type="button">
            Back
          </button>
        ) : null}
        <button className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSaving || isGenerating} onClick={onSaveDraft} type="button">
          {isSaving ? 'Saving...' : 'Save Draft'}
        </button>
        {nextStage ? (
          <button className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700" onClick={() => onStageChange(nextStage.key as StoryPlannerViewProps['activeStage'])} type="button">
            Next Step
          </button>
        ) : null}
        {options?.primaryAction ? (
          <button
            className={`rounded-full px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${options.primaryAction.secondary ? 'border border-rose-300 bg-white text-rose-700' : 'bg-rose-600 text-white'}`}
            disabled={options.primaryAction.disabled}
            onClick={options.primaryAction.onClick}
            type="button"
          >
            {options.primaryAction.label}
          </button>
        ) : null}
      </div>
    </div>
  );

  const conceptStatus = hasConcept ? 'Ready' : 'Current';
  const conceptStatusTone = hasConcept ? 'complete' : 'current';
  const charactersStatus = hasLeads ? 'Ready' : hasConcept ? 'Current' : 'Locked';
  const pairingStatus = hasPairing ? 'Ready' : hasLeads ? 'Current' : 'Locked';
  const castStatus = hasStoryCast ? 'Ready' : hasPairing ? 'Current' : 'Locked';
  const premiseStatus = hasPremise ? 'Ready' : hasStoryCast ? 'Current' : 'Locked';
  const chaptersStatus = hasChapterDetails ? 'Ready' : hasPremise ? 'Current' : 'Locked';
  const saveStatus = hasChapterDetails ? 'Current' : 'Locked';

  return (
    <div className="space-y-5">
      {activeStage === 'concept' ? (
        <StagePanel
          id="planner-step-1"
          eyebrow="Step 1"
          title="Shape the story concept"
          description="Set the story frame, romance engine, narrative lens, and tone before generating the leads."
          statusLabel={conceptStatus}
          statusTone={conceptStatusTone}
          footer={renderFooter({
            primaryAction: {
              label: activeGeneration === 'concept' ? 'Generating Concept...' : hasConcept ? 'Regenerate Concept' : 'Generate Concept',
              onClick: onGenerateConcept,
              disabled: isGenerating,
            },
          })}
        >
          <ConceptBoard
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
            onFieldChange={onFieldChange}
            onCreateFlavorSeed={onCreateFlavorSeed}
            onDeleteFlavorSeed={onDeleteFlavorSeed}
            onCreateTrope={onCreateTrope}
            onDeleteTrope={onDeleteTrope}
            onExpandConcept={onExpandConcept}
          />
        </StagePanel>
      ) : null}

      {activeStage === 'characters' ? (
      <StagePanel
        id="planner-step-2"
        eyebrow="Step 2"
        title="Build the leads"
        description="Once the concept board is solid, generate or edit the two main characters who will carry it."
        isLocked={!hasConcept}
        lockMessage="Generate or fill the concept board first"
        statusLabel={charactersStatus}
        statusTone={hasLeads ? 'complete' : hasConcept ? 'current' : 'locked'}
        footer={renderFooter(hasConcept ? {
          primaryAction: {
            label: activeGeneration === 'characters' ? 'Generating Character Packs...' : hasLeads ? 'Regenerate Character Packs' : 'Generate Character Packs',
            onClick: onGenerateCharacters,
            disabled: isGenerating,
          },
        } : undefined)}
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <CharacterCard label="Lead One" character={currentPlan.lead_one} isSaving={isSaving} onSave={(character) => onSaveEditedCharacter('lead_one', character)} />
          <CharacterCard label="Lead Two" character={currentPlan.lead_two} isSaving={isSaving} onSave={(character) => onSaveEditedCharacter('lead_two', character)} />
        </div>
      </StagePanel>
      ) : null}

      {activeStage === 'pairing' ? (
      <StagePanel
        id="planner-step-3"
        eyebrow="Step 3"
        title="Pressure-test the pairing"
        description="Once the two leads exist, define why they clash, why they fit, and which trope actually carries the novella."
        isLocked={!hasLeads}
        lockMessage="Generate both leads first"
        statusLabel={pairingStatus}
        statusTone={hasPairing ? 'complete' : hasLeads ? 'current' : 'locked'}
        footer={renderFooter(hasLeads ? {
          primaryAction: {
            label: activeGeneration === 'pairing' ? 'Generating Pairing...' : hasPairing ? 'Regenerate Pairing' : 'Pair Them',
            onClick: onGeneratePairing,
            disabled: isGenerating,
          },
        } : undefined)}
      >
        {hasLeads ? <PairingCard pairing={currentPlan.pairing} isSaving={isSaving} onSave={onSaveEditedPairing} /> : <p className="text-sm text-rose-800/70">Pairing stays collapsed until both lead cards are in place.</p>}
      </StagePanel>
      ) : null}

      {activeStage === 'cast' ? (
      <StagePanel
        id="planner-step-4"
        eyebrow="Step 4"
        title="Add the cast pressure"
        description="Once the couple is chosen, surround them with people who create friction, temptation, leverage, exposure, or badly timed honesty."
        isLocked={!hasPairing}
        lockMessage="Generate pairing first"
        statusLabel={castStatus}
        statusTone={hasStoryCast ? 'complete' : hasPairing ? 'current' : 'locked'}
        footer={renderFooter(hasPairing ? {
          primaryAction: {
            label: activeGeneration === 'cast' ? 'Generating Story Cast...' : hasStoryCast ? 'Regenerate Story Cast' : 'Generate Story Cast',
            onClick: onGenerateCast,
            disabled: isGenerating,
          },
        } : undefined)}
      >
        {hasPairing ? (
          <PlannerCastStage
            leadOne={currentPlan.lead_one}
            leadTwo={currentPlan.lead_two}
            storyCast={currentPlan.cast}
            libraryEntries={libraryEntries}
            isSaving={isSaving}
            isGenerating={activeGeneration === 'cast' || activeGeneration === 'cast_member'}
            message={castMessage}
            error={castError}
            onGenerateStoryCast={onGenerateCast}
            onGenerateMemberFromPrompt={onGenerateMemberFromPrompt}
            onAddStoryMember={async (member) => onSaveEditedCast([...currentPlan.cast, member])}
            onSaveStoryMember={async (index, member) => onSaveEditedCast(currentPlan.cast.map((entry, entryIndex) => (entryIndex === index ? member : entry)))}
            onRemoveStoryMember={async (index) => onSaveEditedCast(currentPlan.cast.filter((_, entryIndex) => entryIndex !== index))}
            onInjectLibraryEntry={onInjectLibraryEntry}
            onSaveStoryMemberToLibrary={onCreateLibraryEntry}
          />
        ) : (
          <p className="text-sm text-rose-800/70">Cast work unlocks after the pairing logic exists.</p>
        )}
      </StagePanel>
      ) : null}

      {activeStage === 'premise' ? (
      <StagePanel
        id="planner-step-5"
        eyebrow="Step 5"
        title="Trap them inside the premise"
        description="After the pairing logic is strong enough, shape the novella engine, the public risk, and the chapter skeleton."
        isLocked={!hasStoryCast}
        lockMessage="Add or generate story cast first"
        statusLabel={premiseStatus}
        statusTone={hasPremise ? 'complete' : hasStoryCast ? 'current' : 'locked'}
        footer={renderFooter(hasStoryCast ? {
          primaryAction: {
            label: activeGeneration === 'premise' ? 'Generating Premise...' : hasPremise ? 'Regenerate Premise' : 'Build Premise',
            onClick: onGeneratePremise,
            disabled: isGenerating,
          },
        } : undefined)}
      >
        {hasStoryCast ? <PremiseCard premise={currentPlan.premise} isSaving={isSaving} onSave={onSaveEditedPremise} /> : <p className="text-sm text-rose-800/70">Premise work opens once the couple has active supporting pressure around them.</p>}
      </StagePanel>
      ) : null}

      {activeStage === 'chapters' ? (
      <StagePanel
        id="planner-step-6"
        eyebrow="Step 6"
        title="Detail the chapter plan"
        description="Translate the broad premise beats into chapter-level goals, reveals, emotional turns, and carry-forward hooks."
        isLocked={!hasPremise}
        lockMessage="Generate premise first"
        statusLabel={chaptersStatus}
        statusTone={hasChapterDetails ? 'complete' : hasPremise ? 'current' : 'locked'}
        footer={renderFooter(hasPremise ? {
          primaryAction: {
            label: activeGeneration === 'chapters' ? 'Generating Chapter Details...' : hasChapterDetails ? 'Regenerate Chapter Details' : 'Generate Chapter Details',
            onClick: onGenerateChapterDetails,
            disabled: isGenerating,
          },
        } : undefined)}
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
      ) : null}

      {activeStage === 'save' ? (
      <StagePanel
        id="planner-step-7"
        eyebrow="Step 7"
        title="Save and review the story"
        description="Lock in the best version of the board, then switch into a clean story summary before exporting or iterating again."
        isLocked={!hasChapterDetails}
        lockMessage="Build chapter plan first"
        statusLabel={saveStatus}
        statusTone={hasChapterDetails ? 'current' : 'locked'}
        footer={renderFooter(hasChapterDetails ? {
          primaryAction: {
            label: isSaving ? 'Saving...' : 'Save and Review Story',
            onClick: onSaveAndReviewStory,
            disabled: isSaving || isGenerating,
          },
        } : undefined)}
      >
        {hasChapterDetails ? (
          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50/80 p-5">
              <p className="text-sm font-semibold text-stone-900">Ready to review the full story board</p>
              <p className="mt-1 text-sm text-stone-600">Save this version and open the summary page with the full novella package.</p>
            </div>
            <textarea
              className="min-h-40 w-full rounded-[1.5rem] border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              value={currentPlan.notes}
              onChange={(event) => onFieldChange('notes', event.target.value)}
              placeholder="Keep the jokes, emotional turns, bans, and must-save dynamics worth protecting."
            />
            <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">Finalise this version of the board</p>
              <p className="mt-1 text-sm text-stone-600">Use the sticky footer to save, review, or move back through the workflow.</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-rose-800/70">Finish the chapter plan first so the final summary includes the detailed scene map.</p>
        )}
      </StagePanel>
      ) : null}
    </div>
  );
}
