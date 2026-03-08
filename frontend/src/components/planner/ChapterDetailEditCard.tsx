import type { ChapterDetail } from '../../types';
import { FormField } from './editors/FormField';

type ChapterDetailEditCardProps = {
  chapter: ChapterDetail;
  onChange: (chapter: ChapterDetail) => void;
  onRemove: () => void;
};

export function ChapterDetailEditCard({ chapter, onChange, onRemove }: ChapterDetailEditCardProps) {
  const updateField = <K extends keyof ChapterDetail>(field: K, value: ChapterDetail[K]) => {
    onChange({ ...chapter, [field]: value });
  };

  return (
    <article className="rounded-[1.5rem] bg-white/85 p-5 shadow-[0_12px_32px_rgba(128,60,73,0.08)]">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Chapter {chapter.chapter_number}</p>
          <p className="mt-1 text-sm text-rose-900/70">Build the scene engine, reveal, and emotional handoff.</p>
        </div>
        <button className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-rose-700" onClick={onRemove}>
          Remove
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Chapter title" value={chapter.chapter_title} onChange={(value) => updateField('chapter_title', value)} />
        <FormField label="POV owner" value={chapter.pov_owner} onChange={(value) => updateField('pov_owner', value)} />
        <FormField
          label="Approximate word target"
          value={String(chapter.approximate_word_target)}
          onChange={(value) => updateField('approximate_word_target', Number(value) || 0)}
        />
        <FormField label="Beat anchor" value={chapter.beat_anchor} onChange={(value) => updateField('beat_anchor', value)} textarea />
        <FormField label="Chapter goal" value={chapter.chapter_goal} onChange={(value) => updateField('chapter_goal', value)} textarea />
        <FormField label="Scene goal" value={chapter.scene_goal} onChange={(value) => updateField('scene_goal', value)} textarea />
        <FormField label="Conflict" value={chapter.conflict} onChange={(value) => updateField('conflict', value)} textarea />
        <FormField label="Reveal" value={chapter.reveal} onChange={(value) => updateField('reveal', value)} textarea />
        <FormField label="Secret revealed" value={chapter.secret_revealed} onChange={(value) => updateField('secret_revealed', value)} textarea />
        <FormField label="Who has power" value={chapter.who_has_power} onChange={(value) => updateField('who_has_power', value)} textarea />
        <FormField label="What changes by the end" value={chapter.what_changes_by_the_end} onChange={(value) => updateField('what_changes_by_the_end', value)} textarea />
        <FormField label="Emotional turn" value={chapter.emotional_turn} onChange={(value) => updateField('emotional_turn', value)} textarea />
        <FormField
          label="Emotional note closes the chapter"
          value={chapter.emotional_note_closes_chapter}
          onChange={(value) => updateField('emotional_note_closes_chapter', value)}
          textarea
        />
        <FormField label="Carry-forward thread" value={chapter.carry_forward_thread} onChange={(value) => updateField('carry_forward_thread', value)} textarea />
        <FormField label="Cliffhanger or carry-forward hook" value={chapter.cliffhanger_or_hook} onChange={(value) => updateField('cliffhanger_or_hook', value)} textarea />
      </div>
    </article>
  );
}
