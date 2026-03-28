import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { usePlannerWorkspace } from '../hooks/usePlannerWorkspace';
import { ProjectSidebar } from './ProjectSidebar';
import { CastWorkspace } from './planner/CastWorkspace';
import { ConfirmRegenerateModal } from './planner/ConfirmRegenerateModal';
import { DraftWorkspace } from './planner/DraftWorkspace';
import { StoryPlannerView } from './planner/StoryPlannerView';
import { SummaryWorkspace } from './planner/SummaryWorkspace';
import { WorkflowSteps } from './planner/WorkflowSteps';
import { WriterProfileWorkspace } from './planner/WriterProfileWorkspace';

export function PlannerWorkspace() {
  const workspace = usePlannerWorkspace();
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isGuestLinkBannerDismissed, setIsGuestLinkBannerDismissed] = useState(false);
  const [activePlannerStage, setActivePlannerStage] = useState<'concept' | 'characters' | 'pairing' | 'cast' | 'premise' | 'chapters' | 'save'>('concept');

  const handleWorkflowStepClick = (stepKey: string) => {
    const validStages = new Set(['concept', 'characters', 'pairing', 'cast', 'premise', 'chapters', 'save']);
    if (!validStages.has(stepKey)) {
      return;
    }

    if (workspace.activeView !== 'planner') {
      workspace.setActiveView('planner');
    }
    setActivePlannerStage(stepKey as typeof activePlannerStage);
  };

  const primaryAction = useMemo(() => {
    if (workspace.activeView !== 'planner') {
      return {
        label: workspace.isSaving ? 'Saving...' : workspace.currentPlan.id ? 'Update Draft' : 'Save Draft',
        disabled: workspace.isSaving || workspace.isGenerating,
        onClick: () => void workspace.handleSaveDraft(),
      };
    }

    if (!workspace.hasConcept) {
      return {
        label: workspace.activeGeneration === 'concept' ? 'Generating Concept...' : 'Generate Concept',
        disabled: workspace.isGenerating,
        onClick: () => workspace.requestGeneration('concept'),
      };
    }

    if (!workspace.hasLeads) {
      return {
        label: workspace.activeGeneration === 'characters' ? 'Generating Character Packs...' : 'Generate Character Packs',
        disabled: workspace.isGenerating,
        onClick: () => workspace.requestGeneration('characters'),
      };
    }

    if (!workspace.hasPairing) {
      return {
        label: workspace.activeGeneration === 'pairing' ? 'Generating Pairing...' : 'Generate Pairing',
        disabled: workspace.isGenerating,
        onClick: () => workspace.requestGeneration('pairing'),
      };
    }

    if (!workspace.hasStoryCast) {
      return {
        label: workspace.activeGeneration === 'cast' ? 'Generating Story Cast...' : 'Generate Story Cast',
        disabled: workspace.isGenerating,
        onClick: () => workspace.requestGeneration('cast'),
      };
    }

    if (!workspace.hasPremise) {
      return {
        label: workspace.activeGeneration === 'premise' ? 'Generating Premise...' : 'Generate Premise',
        disabled: workspace.isGenerating,
        onClick: () => workspace.requestGeneration('premise'),
      };
    }

    if (!workspace.hasChapterDetails) {
      return {
        label: workspace.activeGeneration === 'chapters' ? 'Generating Chapter Details...' : 'Generate Chapter Details',
        disabled: workspace.isGenerating,
        onClick: () => workspace.requestGeneration('chapters'),
      };
    }

    return {
      label: workspace.isSaving ? 'Saving...' : 'Save and Continue',
      disabled: workspace.isSaving || workspace.isGenerating,
      onClick: () => void workspace.saveAndReviewStory(),
    };
  }, [
    workspace.activeGeneration,
    workspace.activeView,
    workspace.currentPlan.id,
    workspace.handleSaveDraft,
    workspace.hasChapterDetails,
    workspace.hasConcept,
    workspace.hasLeads,
    workspace.hasPairing,
    workspace.hasStoryCast,
    workspace.hasPremise,
    workspace.isGenerating,
    workspace.isSaving,
    workspace.requestGeneration,
    workspace.saveAndReviewStory,
  ]);

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <ConfirmRegenerateModal
        body={workspace.pendingRegeneration ? workspace.regenerationModalCopy[workspace.pendingRegeneration].body : ''}
        confirmLabel={workspace.pendingRegeneration ? workspace.regenerationModalCopy[workspace.pendingRegeneration].confirmLabel : 'Replace'}
        isOpen={workspace.pendingRegeneration !== null}
        onCancel={workspace.cancelRegeneration}
        onConfirm={workspace.confirmRegeneration}
        title={workspace.pendingRegeneration ? workspace.regenerationModalCopy[workspace.pendingRegeneration].title : ''}
      />

      <div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-white/65 p-6 shadow-[0_18px_70px_rgba(128,60,73,0.08)] md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">Signed in as {workspace.user?.display_name}</p>
          <h1 className="font-display text-4xl text-rose-950">RomCon novella planner</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-rose-900/75">
            Build the couple first. Then decide whether they can survive a premise built to embarrass them in public.
          </p>
        </div>
      </div>

      {workspace.user?.is_guest && workspace.canLinkGuestToFrontpage && !isGuestLinkBannerDismissed ? (
        <div className="mb-6 flex flex-col gap-4 rounded-[1.75rem] border border-rose-200 bg-rose-50/85 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-rose-950">You are currently using a guest account.</p>
            <p className="mt-1 text-sm text-rose-900/75">Would you like to link to your WebHatchery account and unlock additional features?</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-rose-300"
              disabled={workspace.isLoading}
              onClick={() => void workspace.linkGuestToFrontpage()}
            >
              {workspace.isLoading ? 'Linking...' : 'Yes, link my account'}
            </button>
            <button
              className="rounded-full border border-rose-300 bg-white px-5 py-3 text-sm font-semibold text-rose-800"
              onClick={() => setIsGuestLinkBannerDismissed(true)}
            >
              Not now
            </button>
          </div>
        </div>
      ) : null}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="rounded-[1.5rem] border border-rose-200 bg-white/80 p-1.5">
          <div className="flex flex-wrap gap-1">
            <button className={`rounded-full px-4 py-2 text-sm font-semibold ${workspace.activeView === 'planner' ? 'bg-rose-600 text-white' : 'text-rose-800'}`} onClick={() => workspace.setActiveView('planner')}>
              Story Planner
            </button>
            <button className={`rounded-full px-4 py-2 text-sm font-semibold ${workspace.activeView === 'cast' ? 'bg-rose-600 text-white' : 'text-rose-800'}`} onClick={() => workspace.setActiveView('cast')}>
              Cast Library
            </button>
            <button className={`rounded-full px-4 py-2 text-sm font-semibold ${workspace.activeView === 'drafts' ? 'bg-rose-600 text-white' : 'text-rose-800'}`} onClick={() => workspace.setActiveView('drafts')}>
              Draft Studio
            </button>
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold ${workspace.activeView === 'writer_profile' ? 'bg-rose-600 text-white' : 'text-rose-800'}`}
              onClick={() => workspace.setActiveView('writer_profile')}
            >
              Writers Profile
            </button>
            {workspace.hasSavedPlan ? (
              <button className={`rounded-full px-4 py-2 text-sm font-semibold ${workspace.activeView === 'summary' ? 'bg-rose-600 text-white' : 'text-rose-800'}`} onClick={() => workspace.setActiveView('summary')}>
                Story Summary
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-rose-300"
            disabled={primaryAction.disabled}
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </button>
          <div className="relative">
            <button
              className="rounded-full border border-rose-300 bg-white/90 px-5 py-3 text-sm font-semibold text-rose-800"
              onClick={() => setIsActionsMenuOpen((current) => !current)}
            >
              Account and Actions
            </button>
            {isActionsMenuOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-[1.5rem] border border-rose-200 bg-white p-2 shadow-[0_18px_50px_rgba(128,60,73,0.14)]">
                {workspace.user?.is_guest ? (
                  <a className="block rounded-[1rem] px-4 py-3 text-sm font-semibold text-rose-900 hover:bg-rose-50" href={workspace.getLinkAccountUrl()} onClick={() => setIsActionsMenuOpen(false)}>
                    Link Account
                  </a>
                ) : null}
                <button className="block w-full rounded-[1rem] px-4 py-3 text-left text-sm font-semibold text-rose-900 hover:bg-rose-50" onClick={() => { setIsActionsMenuOpen(false); void workspace.handleSaveDraft(); }}>
                  {workspace.currentPlan.id ? 'Update Draft' : 'Save Draft'}
                </button>
                <button className="block w-full rounded-[1rem] px-4 py-3 text-left text-sm font-semibold text-rose-900 hover:bg-rose-50" onClick={() => { setIsActionsMenuOpen(false); void workspace.handleExport('json'); }}>
                  Export JSON
                </button>
                <button className="block w-full rounded-[1rem] px-4 py-3 text-left text-sm font-semibold text-rose-900 hover:bg-rose-50" onClick={() => { setIsActionsMenuOpen(false); void workspace.handleExport('xml'); }}>
                  Export XML
                </button>
                <button className="block w-full rounded-[1rem] px-4 py-3 text-left text-sm font-semibold text-rose-900 hover:bg-rose-50" onClick={() => { setIsActionsMenuOpen(false); workspace.logout(); }}>
                  Sign Out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-[1.5rem] bg-white/70 px-5 py-4 text-sm text-rose-900/75 shadow-[0_10px_35px_rgba(128,60,73,0.06)]">
        {workspace.workspaceDescription}
      </div>

      <WorkflowSteps
        hasConcept={workspace.hasConcept}
        leadOne={workspace.currentPlan.lead_one}
        leadTwo={workspace.currentPlan.lead_two}
        pairing={workspace.currentPlan.pairing}
        premise={workspace.currentPlan.premise}
        hasStoryCast={workspace.hasStoryCast}
        hasChapterDetails={workspace.hasChapterDetails}
        isSaved={workspace.hasSavedPlan && workspace.hasChapterDetails}
        onStepClick={handleWorkflowStepClick}
      />

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          <ProjectSidebar projects={workspace.projects} currentPlanId={workspace.currentPlan.id} onOpen={workspace.replacePlan} onDelete={(planId) => void workspace.deletePlan(planId)} onNew={workspace.resetPlan} />
        </div>

        <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {workspace.activeView === 'planner' ? (
            <StoryPlannerView
              activeStage={activePlannerStage}
              currentPlan={workspace.currentPlan}
              libraryEntries={workspace.libraryEntries}
              flavorSeeds={workspace.flavorSeeds}
              tropes={workspace.tropes}
              hasConcept={workspace.hasConcept}
              hasLeads={workspace.hasLeads}
              hasPairing={workspace.hasPairing}
              hasStoryCast={workspace.hasStoryCast}
              hasPremise={workspace.hasPremise}
              hasChapterDetails={workspace.hasChapterDetails}
              isGenerating={workspace.isGenerating}
              activeGeneration={workspace.activeGeneration}
              isSaving={workspace.isSaving}
              plannerMessage={workspace.plannerMessage}
              plannerError={workspace.plannerError}
              castMessage={workspace.castMessage}
              castError={workspace.castError}
              tropeMessage={workspace.tropeMessage}
              tropeError={workspace.tropeError}
              isGuestUser={Boolean(workspace.user?.is_guest)}
              canCreateGlobalTropes={workspace.user?.role === 'admin'}
              onFieldChange={workspace.updatePlanField}
              onStageChange={setActivePlannerStage}
              onCreateFlavorSeed={(label) => void workspace.createFlavorSeed(label)}
              onDeleteFlavorSeed={(seedId, label) => void workspace.deleteFlavorSeed(seedId, label)}
              onCreateTrope={(payload) => void workspace.createTrope(payload)}
              onDeleteTrope={(tropeId) => void workspace.deleteTrope(tropeId)}
              onGenerateConcept={() => workspace.requestGeneration('concept')}
              onExpandConcept={() => void workspace.expandConcept()}
              onGenerateCharacters={() => workspace.requestGeneration('characters')}
              onGeneratePairing={() => workspace.requestGeneration('pairing')}
              onGenerateCast={() => workspace.requestGeneration('cast')}
              onGeneratePremise={() => workspace.requestGeneration('premise')}
              onGenerateChapterDetails={() => workspace.requestGeneration('chapters')}
              onSaveEditedCharacter={workspace.saveEditedCharacter}
              onSaveEditedPairing={workspace.saveEditedPairing}
              onSaveEditedPremise={workspace.saveEditedPremise}
              onSaveChapterDetails={workspace.saveChapterDetails}
              onGenerateMemberFromPrompt={workspace.generateCastMemberFromPrompt}
              onSaveEditedCast={workspace.saveEditedCast}
              onCreateLibraryEntry={workspace.createLibraryEntry}
              onInjectLibraryEntry={workspace.injectLibraryEntry}
              onSaveAndReviewStory={() => void workspace.saveAndReviewStory()}
            />
          ) : workspace.activeView === 'cast' ? (
            <CastWorkspace
              error={workspace.castError}
              isGenerating={workspace.activeGeneration === 'cast'}
              isSaving={workspace.isSaving}
              leadOne={workspace.currentPlan.lead_one}
              leadTwo={workspace.currentPlan.lead_two}
              libraryEntries={workspace.libraryEntries}
              message={workspace.castMessage}
              onCreateLibraryEntry={workspace.createLibraryEntry}
              onDeleteLibraryEntry={workspace.deleteLibraryEntry}
              onGenerateMemberFromPrompt={workspace.generateCastMemberFromPrompt}
              onGenerateStoryCast={() => Promise.resolve(workspace.requestGeneration('cast'))}
              onInjectLibraryEntry={workspace.injectLibraryEntry}
              onSaveLibraryEntry={workspace.updateLibraryEntry}
              onSaveStoryCast={workspace.saveEditedCast}
              storyCastButtonLabel={workspace.hasStoryCast ? 'Regenerate story cast' : 'Generate story cast'}
              storyCastOverwriteHint={workspace.hasStoryCast ? 'Regenerating will replace the current supporting cast for this story.' : null}
              storyCast={workspace.currentPlan.cast}
            />
          ) : workspace.activeView === 'drafts' ? (
            <DraftWorkspace
              plan={workspace.currentPlan}
              isSaving={workspace.isSaving}
              isGenerating={workspace.activeGeneration === 'chapter_draft'}
              message={workspace.draftMessage}
              error={workspace.draftError}
              onGenerateChapterDraft={workspace.generateChapterDraft}
              onSaveDraftChapters={workspace.saveEditedDraftChapters}
            />
          ) : workspace.activeView === 'summary' ? (
            <SummaryWorkspace plan={workspace.currentPlan} onBackToPlanner={() => workspace.setActiveView('planner')} onExport={(format) => void workspace.handleExport(format)} />
          ) : (
            <WriterProfileWorkspace error={workspace.writerProfileError} isSaving={workspace.isSaving} message={workspace.writerProfileMessage} onSave={workspace.saveWriterProfile} profile={workspace.writerProfile} />
          )}
        </motion.main>
      </div>
    </div>
  );
}
