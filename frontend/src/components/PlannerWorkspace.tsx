import { motion } from 'framer-motion';
import { usePlannerWorkspace } from '../hooks/usePlannerWorkspace';
import { ProjectSidebar } from './ProjectSidebar';
import { TropeTable } from './TropeTable';
import { CastWorkspace } from './planner/CastWorkspace';
import { ConfirmRegenerateModal } from './planner/ConfirmRegenerateModal';
import { StoryPlannerView } from './planner/StoryPlannerView';
import { SummaryWorkspace } from './planner/SummaryWorkspace';
import { WorkflowSteps } from './planner/WorkflowSteps';
import { WriterProfileWorkspace } from './planner/WriterProfileWorkspace';

export function PlannerWorkspace() {
  const workspace = usePlannerWorkspace();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="rounded-[1.5rem] border border-rose-200 bg-white/80 p-1.5">
          <div className="flex flex-wrap gap-1">
            <button className={`rounded-full px-4 py-2 text-sm font-semibold ${workspace.activeView === 'planner' ? 'bg-rose-600 text-white' : 'text-rose-800'}`} onClick={() => workspace.setActiveView('planner')}>
              Story Planner
            </button>
            <button className={`rounded-full px-4 py-2 text-sm font-semibold ${workspace.activeView === 'cast' ? 'bg-rose-600 text-white' : 'text-rose-800'}`} onClick={() => workspace.setActiveView('cast')}>
              Cast Library
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

        <div className="flex flex-wrap gap-3">
          {workspace.user?.is_guest ? (
            <a className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800" href={workspace.getLinkAccountUrl()}>
              Link Account
            </a>
          ) : null}
          <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800" onClick={() => void workspace.handleSaveDraft()}>
            {workspace.currentPlan.id ? 'Update Draft' : 'Save Draft'}
          </button>
          <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800" onClick={() => void workspace.handleExport('json')}>
            Export JSON
          </button>
          <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800" onClick={() => void workspace.handleExport('xml')}>
            Export XML
          </button>
          <button className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white" onClick={workspace.logout}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-[1.5rem] bg-white/70 px-5 py-4 text-sm text-rose-900/75 shadow-[0_10px_35px_rgba(128,60,73,0.06)]">
        {workspace.workspaceDescription}
      </div>

      <WorkflowSteps
        leadOne={workspace.currentPlan.lead_one}
        leadTwo={workspace.currentPlan.lead_two}
        pairing={workspace.currentPlan.pairing}
        premise={workspace.currentPlan.premise}
        hasChapterDetails={workspace.hasChapterDetails}
        isSaved={workspace.hasSavedPlan && workspace.hasChapterDetails}
      />

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          <ProjectSidebar projects={workspace.projects} currentPlanId={workspace.currentPlan.id} onOpen={workspace.replacePlan} onDelete={(planId) => void workspace.deletePlan(planId)} onNew={workspace.resetPlan} />
          <TropeTable
            canCreateGlobal={workspace.user?.role === 'admin'}
            error={workspace.tropeError}
            message={workspace.tropeMessage}
            onCreate={(payload) => void workspace.createTrope(payload)}
            onDelete={(tropeId) => void workspace.deleteTrope(tropeId)}
            tropes={workspace.tropes}
            selectedTrope={workspace.currentPlan.trope_notes[0] || ''}
            onSelect={(tropeName) => workspace.updatePlanField('trope_notes', [tropeName])}
          />
        </div>

        <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {workspace.activeView === 'planner' ? (
            <StoryPlannerView
              currentPlan={workspace.currentPlan}
              flavorSeeds={workspace.flavorSeeds}
              hasLeads={workspace.hasLeads}
              hasPairing={workspace.hasPairing}
              hasPremise={workspace.hasPremise}
              hasChapterDetails={workspace.hasChapterDetails}
              isGenerating={workspace.isGenerating}
              isSaving={workspace.isSaving}
              plannerMessage={workspace.plannerMessage}
              plannerError={workspace.plannerError}
              onFieldChange={workspace.updatePlanField}
              onCreateFlavorSeed={(label) => void workspace.createFlavorSeed(label)}
              onDeleteFlavorSeed={(seedId, label) => void workspace.deleteFlavorSeed(seedId, label)}
              onGenerateCharacters={() => workspace.requestGeneration('characters')}
              onGeneratePairing={() => workspace.requestGeneration('pairing')}
              onGeneratePremise={() => workspace.requestGeneration('premise')}
              onGenerateChapterDetails={() => workspace.requestGeneration('chapters')}
              onSaveEditedCharacter={workspace.saveEditedCharacter}
              onSaveEditedPairing={workspace.saveEditedPairing}
              onSaveEditedPremise={workspace.saveEditedPremise}
              onSaveChapterDetails={workspace.saveChapterDetails}
              onSaveAndReviewStory={() => void workspace.saveAndReviewStory()}
            />
          ) : workspace.activeView === 'cast' ? (
            <CastWorkspace
              error={workspace.castError}
              isGenerating={workspace.isGenerating}
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
