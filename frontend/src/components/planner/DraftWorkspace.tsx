import { useEffect, useMemo, useState } from 'react';
import { DraftChapter, Plan } from '../../types';

type DraftWorkspaceProps = {
  plan: Plan;
  isSaving: boolean;
  isGenerating: boolean;
  message: string | null;
  error: string | null;
  onGenerateChapterDraft: (chapterNumber: number, options?: { revisionPrompt?: string; existingDraft?: string }) => Promise<DraftChapter>;
  onSaveDraftChapters: (draftChapters: DraftChapter[]) => Promise<void>;
};

type DraftViewMode = 'studio' | 'manuscript';

function wordCount(value: string): number {
  const text = value.trim();
  return text === '' ? 0 : text.split(/\s+/).length;
}

function buildDraftRecord(plan: Plan, chapterNumber: number): DraftChapter {
  const existing = plan.draft_chapters.find((chapter) => chapter.chapter_number === chapterNumber);
  if (existing) {
    return existing;
  }

  const chapterDetail = plan.chapter_details.find((chapter) => chapter.chapter_number === chapterNumber);
  return {
    ...new DraftChapter(),
    chapter_number: chapterNumber,
    chapter_title: chapterDetail?.chapter_title ?? '',
  };
}

export function DraftWorkspace({ plan, isSaving, isGenerating, message, error, onGenerateChapterDraft, onSaveDraftChapters }: DraftWorkspaceProps) {
  const [viewMode, setViewMode] = useState<DraftViewMode>('studio');
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>(plan.chapter_details[0]?.chapter_number ?? 1);
  const [draftText, setDraftText] = useState('');
  const [chapterSummary, setChapterSummary] = useState('');
  const [revisionPrompt, setRevisionPrompt] = useState('');
  const isDraftReady = Boolean(plan.lead_one && plan.lead_two && plan.pairing && plan.premise && plan.chapter_details.length > 0);

  const selectedChapterDetail = useMemo(
    () => plan.chapter_details.find((chapter) => chapter.chapter_number === selectedChapterNumber) ?? null,
    [plan.chapter_details, selectedChapterNumber]
  );

  const selectedDraft = useMemo(
    () => buildDraftRecord(plan, selectedChapterNumber),
    [plan, selectedChapterNumber]
  );

  useEffect(() => {
    setDraftText(selectedDraft.draft_text);
    setChapterSummary(selectedDraft.chapter_summary);
    setRevisionPrompt('');
  }, [selectedDraft.chapter_number, selectedDraft.draft_text, selectedDraft.chapter_summary]);

  const compiledManuscript = useMemo(() => {
    return plan.chapter_details
      .map((chapter) => buildDraftRecord(plan, chapter.chapter_number))
      .filter((chapter) => chapter.draft_text.trim() !== '')
      .map((chapter) => `Chapter ${chapter.chapter_number}: ${chapter.chapter_title || 'Untitled'}\n\n${chapter.draft_text.trim()}`)
      .join('\n\n');
  }, [plan]);

  const saveCurrentDraft = async () => {
    const nextDrafts = plan.chapter_details.map((chapter) => {
      if (chapter.chapter_number !== selectedChapterNumber) {
        return buildDraftRecord(plan, chapter.chapter_number);
      }

      return {
        ...buildDraftRecord(plan, chapter.chapter_number),
        chapter_number: chapter.chapter_number,
        chapter_title: selectedChapterDetail?.chapter_title || chapter.chapter_title,
        chapter_summary: chapterSummary,
        draft_text: draftText,
        status: draftText.trim() === '' ? 'not_started' : 'edited',
        updated_at: new Date().toISOString(),
      };
    });

    await onSaveDraftChapters(nextDrafts);
  };

  const draftCurrentChapter = async () => {
    await onGenerateChapterDraft(selectedChapterNumber);
  };

  const reviseCurrentChapter = async () => {
    await onGenerateChapterDraft(selectedChapterNumber, {
      revisionPrompt,
      existingDraft: draftText,
    });
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-[linear-gradient(135deg,rgba(190,24,93,0.10),rgba(255,255,255,0.92))] p-6 shadow-[0_18px_70px_rgba(128,60,73,0.10)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">Draft Studio</p>
            <h2 className="mt-2 font-display text-4xl text-rose-950">Write the novel one chapter at a time</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-rose-900/75">
              This workspace stays separate from planning, but every regeneration uses the current plan, cast, premise, chapter details, and writer profile.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-rose-200 bg-white/80 p-1.5">
            <div className="flex flex-wrap gap-1">
              <button className={`rounded-full px-4 py-2 text-sm font-semibold ${viewMode === 'studio' ? 'bg-rose-600 text-white' : 'text-rose-800'}`} onClick={() => setViewMode('studio')}>
                Chapter Studio
              </button>
              <button className={`rounded-full px-4 py-2 text-sm font-semibold ${viewMode === 'manuscript' ? 'bg-rose-600 text-white' : 'text-rose-800'}`} onClick={() => setViewMode('manuscript')}>
                Manuscript View
              </button>
            </div>
          </div>
        </div>
        {message ? <p className="mt-4 text-sm text-rose-700">{message}</p> : null}
        {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
        {!isDraftReady ? (
          <div className="mt-4 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-rose-900/80">
            Draft Studio is available, but this story is not ready to draft yet. Generate the leads, pairing, premise, and chapter plan first.
          </div>
        ) : null}
      </div>

      {!isDraftReady ? (
        <section className="rounded-[1.5rem] border border-dashed border-rose-200 bg-white/70 p-6 text-sm text-rose-800/75">
          Chapter drafting unlocks once the planning package is complete. When you come back here after generating chapter details, you will be able to select a chapter, draft it, revise it, and read the compiled manuscript.
        </section>
      ) : null}

      {isDraftReady && viewMode === 'studio' ? (
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-3">
            {plan.chapter_details.map((chapter) => {
              const draft = buildDraftRecord(plan, chapter.chapter_number);
              const isSelected = chapter.chapter_number === selectedChapterNumber;

              return (
                <button
                  key={chapter.chapter_number}
                  className={`w-full rounded-[1.5rem] p-4 text-left ${isSelected ? 'bg-rose-600 text-white' : 'glass-panel'}`}
                  onClick={() => setSelectedChapterNumber(chapter.chapter_number)}
                  type="button"
                >
                  <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${isSelected ? 'text-white/75' : 'text-rose-500'}`}>
                    {draft.draft_text.trim() !== '' ? draft.status.replace('_', ' ') : 'not started'}
                  </p>
                  <h3 className="mt-2 font-display text-2xl">Chapter {chapter.chapter_number}</h3>
                  <p className={`mt-1 text-sm font-semibold ${isSelected ? 'text-white/85' : 'text-rose-950'}`}>{chapter.chapter_title || 'Untitled'}</p>
                  <p className={`mt-2 text-sm ${isSelected ? 'text-white/80' : 'text-rose-900/75'}`}>{chapter.beat_anchor || chapter.chapter_goal || 'No beat anchor yet.'}</p>
                </button>
              );
            })}
          </aside>

          <section className="space-y-5">
            {selectedChapterDetail ? (
              <>
                <div className="rounded-[1.5rem] bg-white/85 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">Selected Chapter</p>
                      <h3 className="mt-2 font-display text-3xl text-rose-950">
                        Chapter {selectedChapterDetail.chapter_number}: {selectedChapterDetail.chapter_title || 'Untitled'}
                      </h3>
                      <p className="mt-2 text-sm text-rose-900/75">{selectedChapterDetail.beat_anchor || selectedChapterDetail.chapter_goal || 'No beat anchor yet.'}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isGenerating}
                        onClick={() => void draftCurrentChapter()}
                        type="button"
                      >
                        {isGenerating ? 'Writing...' : selectedDraft.draft_text.trim() !== '' ? 'Regenerate chapter' : 'Draft chapter'}
                      </button>
                      <button
                        className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-rose-300"
                        disabled={isSaving}
                        onClick={() => void saveCurrentDraft()}
                        type="button"
                      >
                        {isSaving ? 'Saving...' : 'Save edits'}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.25rem] bg-rose-50 px-4 py-3 text-sm text-rose-900/80">
                      <strong>POV:</strong> {selectedChapterDetail.pov_owner || 'Not set'}
                    </div>
                    <div className="rounded-[1.25rem] bg-rose-50 px-4 py-3 text-sm text-rose-900/80">
                      <strong>Target words:</strong> {selectedChapterDetail.approximate_word_target.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-white/85 p-5">
                  <p className="text-sm font-semibold text-rose-950">AI revision brief</p>
                  <p className="mt-1 text-sm text-rose-900/75">
                    Ask for a sharper flirtation beat, stronger rival pressure, cleaner POV, more comedy, or a rewrite around new plan changes.
                  </p>
                  <textarea
                    className="mt-4 min-h-28 w-full rounded-[1.25rem] border border-rose-200 bg-white px-4 py-3 text-sm text-rose-950 outline-none focus:border-rose-400"
                    value={revisionPrompt}
                    onChange={(event) => setRevisionPrompt(event.target.value)}
                    placeholder="Example: revise this chapter so the boss applies more pressure and the ex's appearance lands as a real emotional complication."
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isGenerating || revisionPrompt.trim() === ''}
                      onClick={() => void reviseCurrentChapter()}
                      type="button"
                    >
                      {isGenerating ? 'Revising...' : 'Revise with AI'}
                    </button>
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-white/85 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-rose-950">Chapter summary</p>
                      <p className="mt-1 text-sm text-rose-900/75">Short continuity note used when drafting later chapters.</p>
                    </div>
                    <p className="text-sm text-rose-900/70">{wordCount(draftText).toLocaleString()} words</p>
                  </div>
                  <textarea
                    className="mt-4 min-h-24 w-full rounded-[1.25rem] border border-rose-200 bg-white px-4 py-3 text-sm text-rose-950 outline-none focus:border-rose-400"
                    value={chapterSummary}
                    onChange={(event) => setChapterSummary(event.target.value)}
                    placeholder="What actually happens in this chapter?"
                  />
                  <textarea
                    className="mt-4 min-h-[28rem] w-full rounded-[1.25rem] border border-rose-200 bg-white px-4 py-3 text-sm leading-7 text-rose-950 outline-none focus:border-rose-400"
                    value={draftText}
                    onChange={(event) => setDraftText(event.target.value)}
                    placeholder="Drafted chapter text will appear here."
                  />
                </div>
              </>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-rose-200 bg-white/70 p-5 text-sm text-rose-800/70">
                No chapter is selected.
              </div>
            )}
          </section>
        </div>
      ) : isDraftReady ? (
        <section className="rounded-[1.5rem] bg-white/85 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">Compiled Manuscript</p>
              <h3 className="mt-2 font-display text-3xl text-rose-950">{plan.title}</h3>
              <p className="mt-2 text-sm text-rose-900/75">
                This view stitches together every drafted chapter in order. Empty chapters stay out until they have text.
              </p>
            </div>
            <p className="text-sm text-rose-900/70">{wordCount(compiledManuscript).toLocaleString()} words drafted</p>
          </div>

          {compiledManuscript.trim() === '' ? (
            <div className="mt-5 rounded-[1.5rem] border border-dashed border-rose-200 bg-rose-50/60 p-5 text-sm text-rose-800/70">
              No drafted chapters yet. Generate a chapter from the studio first.
            </div>
          ) : (
            <textarea
              className="mt-5 min-h-[40rem] w-full rounded-[1.5rem] border border-rose-200 bg-white px-5 py-4 text-sm leading-7 text-rose-950 outline-none"
              readOnly
              value={compiledManuscript}
            />
          )}
        </section>
      ) : null}
    </section>
  );
}
