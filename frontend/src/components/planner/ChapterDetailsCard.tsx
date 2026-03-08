import type { ChapterDetail, PremiseResult } from '../../types';
import { useChapterDetailsEditor } from '../../hooks/useChapterDetailsEditor';
import { ChapterDetailEditCard } from './ChapterDetailEditCard';
import { ChapterDetailReadCard } from './ChapterDetailReadCard';
import { ChapterDetailsTips } from './ChapterDetailsTips';
import { EditorCardShell } from './editors/EditorCardShell';

type ChapterDetailsCardProps = {
  chapterDetails: ChapterDetail[];
  premise: PremiseResult | null;
  targetWords: number;
  isGenerating?: boolean;
  generateButtonLabel: string;
  isSaving?: boolean;
  onGenerate: () => void;
  onSave: (chapterDetails: ChapterDetail[]) => Promise<void>;
};

export function ChapterDetailsCard({
  chapterDetails,
  premise,
  targetWords,
  isGenerating = false,
  generateButtonLabel,
  isSaving = false,
  onGenerate,
  onSave,
}: ChapterDetailsCardProps) {
  const {
    isEditing,
    draft,
    activeChapterDetails,
    startEditing,
    startFromPremise,
    startBlankPlan,
    cancelEditing,
    updateChapter,
    removeChapter,
    addBlankChapter,
    seedFromPremise,
    saveEditing,
  } = useChapterDetailsEditor({
    chapterDetails,
    premise,
    targetWords,
    onSave,
  });

  return (
    <EditorCardShell
      eyebrow="Chapter Planner"
      title="Break the story down chapter by chapter"
      description="Turn the high-level beats into specific chapter goals, conflicts, reveals, power shifts, and emotional exits."
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={startEditing}
      onCancel={cancelEditing}
      onSave={() => void saveEditing()}
    >
      <div className="mb-5 flex flex-wrap gap-3">
        <button className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isGenerating} onClick={onGenerate} type="button">
          {isGenerating ? 'Generating chapter plan...' : generateButtonLabel}
        </button>
        <button className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800" onClick={startEditing} type="button">
          {activeChapterDetails.length > 0 ? 'Edit Chapter Plan' : 'Manual Chapter Planning'}
        </button>
      </div>

      <ChapterDetailsTips />

      {isEditing ? (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800" onClick={addBlankChapter}>
              Add Chapter
            </button>
            <button className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800" onClick={seedFromPremise}>
              Seed From Premise Beats
            </button>
          </div>
          {draft.length > 0 ? (
            <div className="space-y-4">
              {draft.map((chapter, index) => (
                <ChapterDetailEditCard
                  key={`chapter-edit-${chapter.chapter_number}-${index}`}
                  chapter={chapter}
                  onChange={(nextChapter) => updateChapter(index, nextChapter)}
                  onRemove={() => removeChapter(index)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-rose-200 bg-white/60 p-5 text-sm text-rose-800/70">
              No chapter plans yet. Add a chapter manually or seed them from the premise beats.
            </div>
          )}
        </div>
      ) : activeChapterDetails.length > 0 ? (
        <div className="mt-5 space-y-4">
          {activeChapterDetails.map((chapter) => (
            <ChapterDetailReadCard key={`chapter-read-${chapter.chapter_number}-${chapter.chapter_title}`} chapter={chapter} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[1.5rem] border border-dashed border-rose-200 bg-white/60 p-5">
          <p className="text-sm text-rose-800/70">No chapter planning saved yet.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white" onClick={startFromPremise} type="button">
              Build From Premise Beats
            </button>
            <button className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800" onClick={startBlankPlan} type="button">
              Start Blank Chapter Plan
            </button>
          </div>
        </div>
      )}
    </EditorCardShell>
  );
}
