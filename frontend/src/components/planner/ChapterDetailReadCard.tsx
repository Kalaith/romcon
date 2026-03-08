import type { ChapterDetail } from '../../types';

type ChapterDetailReadCardProps = {
  chapter: ChapterDetail;
};

export function ChapterDetailReadCard({ chapter }: ChapterDetailReadCardProps) {
  const readFields = [
    ['Beat anchor', chapter.beat_anchor],
    ['POV owner', chapter.pov_owner],
    ['Chapter goal', chapter.chapter_goal],
    ['Scene goal', chapter.scene_goal],
    ['Conflict', chapter.conflict],
    ['Reveal', chapter.reveal],
    ['Secret revealed', chapter.secret_revealed],
    ['Who has power', chapter.who_has_power],
    ['What changes by the end', chapter.what_changes_by_the_end],
    ['Emotional turn', chapter.emotional_turn],
    ['Emotional note closes the chapter', chapter.emotional_note_closes_chapter],
    ['Carry-forward thread', chapter.carry_forward_thread],
    ['Cliffhanger or hook', chapter.cliffhanger_or_hook],
  ].filter(([, value]) => value);

  return (
    <article className="rounded-[1.5rem] bg-white/85 p-5 shadow-[0_12px_32px_rgba(128,60,73,0.08)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Chapter {chapter.chapter_number}</p>
          <h3 className="font-display text-2xl text-rose-950">{chapter.chapter_title || `Chapter ${chapter.chapter_number}`}</h3>
        </div>
        <span className="rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
          {chapter.approximate_word_target.toLocaleString()} words
        </span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {readFields.length > 0 ? (
          readFields.map(([label, value]) => (
            <div key={label} className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">{label}</p>
              <p className="text-sm leading-6 text-rose-950/85">{value}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-rose-800/70">This chapter has been created but not detailed yet.</p>
        )}
      </div>
    </article>
  );
}
