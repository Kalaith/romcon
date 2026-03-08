import type { Plan } from '../../../types';
import { SummaryField } from './SummaryField';
import { SummarySection } from './SummarySection';

type ChapterPlanSectionProps = {
  plan: Plan;
};

export function ChapterPlanSection({ plan }: ChapterPlanSectionProps) {
  return (
    <SummarySection title="Detailed Chapter Plan" description="Use this layer when you need chapter-level intent, power shifts, reveals, and emotional exits.">
      {plan.chapter_details.length > 0 ? (
        <div className="space-y-4">
          {plan.chapter_details.map((chapter) => (
            <article key={`${chapter.chapter_number}-${chapter.chapter_title}`} className="rounded-[1.5rem] bg-white/85 p-5">
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
                <SummaryField label="Beat Anchor" value={chapter.beat_anchor} />
                <SummaryField label="Chapter Goal" value={chapter.chapter_goal} />
                <SummaryField label="Scene Goal" value={chapter.scene_goal} />
                <SummaryField label="Conflict" value={chapter.conflict} />
                <SummaryField label="Reveal" value={chapter.reveal} />
                <SummaryField label="Secret Revealed" value={chapter.secret_revealed} />
                <SummaryField label="Who Has Power" value={chapter.who_has_power} />
                <SummaryField label="What Changes By The End" value={chapter.what_changes_by_the_end} />
                <SummaryField label="Emotional Turn" value={chapter.emotional_turn} />
                <SummaryField label="Emotional Close" value={chapter.emotional_note_closes_chapter} />
                <SummaryField label="Carry-Forward Thread" value={chapter.carry_forward_thread} />
                <SummaryField label="Cliffhanger Or Hook" value={chapter.cliffhanger_or_hook} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-rose-800/70">No detailed chapter plan saved yet.</p>
      )}
    </SummarySection>
  );
}
