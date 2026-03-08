import { useState } from 'react';
import type { CastMember } from '../../types';
import { EditorCardShell } from './editors/EditorCardShell';
import { FormField } from './editors/FormField';

type CastMemberCardProps = {
  member: CastMember;
  isSaving?: boolean;
  isNew?: boolean;
  onSave: (member: CastMember) => Promise<void>;
  onDelete?: () => Promise<void>;
  onCancelNew?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => Promise<void> | void;
  onGenerateFromPrompt?: (prompt: string) => Promise<CastMember>;
};

export function CastMemberCard({
  member,
  isSaving = false,
  isNew = false,
  onSave,
  onDelete,
  onCancelNew,
  secondaryActionLabel,
  onSecondaryAction,
  onGenerateFromPrompt,
}: CastMemberCardProps) {
  const [isEditing, setIsEditing] = useState(isNew);
  const [draft, setDraft] = useState<CastMember>(member);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const active = isEditing ? draft : member;

  const updateField = <K extends keyof CastMember>(field: K, value: CastMember[K]) => {
    setDraft({ ...draft, [field]: value });
  };

  const startEditing = () => {
    setDraft({ ...member });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (isNew) {
      onCancelNew?.();
      return;
    }

    setDraft({ ...member });
    setIsEditing(false);
  };

  const saveEditing = async () => {
    await onSave(draft);
    setIsEditing(false);
  };

  const generateFromPrompt = async () => {
    if (!onGenerateFromPrompt) {
      return;
    }

    setGenerationError(null);
    setIsGenerating(true);
    try {
      const generated = await onGenerateFromPrompt(generationPrompt);
      setDraft(generated);
      setIsEditing(true);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate cast member.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <EditorCardShell
      eyebrow={member.is_main ? 'Main Cast' : 'Supporting Cast'}
      title={active.name || 'New cast member'}
      description={active.role || 'Add the role they play in the story'}
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={startEditing}
      onCancel={cancelEditing}
      onSave={() => void saveEditing()}
    >
      {isEditing ? (
        <div className="space-y-4">
          {isNew && onGenerateFromPrompt ? (
            <div className="rounded-[1.5rem] bg-rose-50/80 p-4">
              <FormField
                label="Prompt"
                value={generationPrompt}
                onChange={setGenerationPrompt}
                textarea
              />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isGenerating || generationPrompt.trim() === ''}
                  onClick={() => void generateFromPrompt()}
                  type="button"
                >
                  {isGenerating ? 'Generating...' : 'Generate From Prompt'}
                </button>
                <p className="text-sm text-rose-900/70">
                  Example: meddling aunt with terrible boundaries, secretly the only one who spots real chemistry.
                </p>
              </div>
              {generationError ? <p className="mt-2 text-sm text-rose-700">{generationError}</p> : null}
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Name" value={active.name} onChange={(value) => updateField('name', value)} />
            <FormField label="Role" value={active.role} onChange={(value) => updateField('role', value)} />
          </div>
          <FormField label="Summary" value={active.summary} onChange={(value) => updateField('summary', value)} textarea />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Connection to leads" value={active.connection_to_leads} onChange={(value) => updateField('connection_to_leads', value)} textarea />
            <FormField label="Story function" value={active.story_function} onChange={(value) => updateField('story_function', value)} textarea />
            <FormField label="Core desire" value={active.core_desire} onChange={(value) => updateField('core_desire', value)} textarea />
            <FormField label="Core fear" value={active.core_fear} onChange={(value) => updateField('core_fear', value)} textarea />
            <FormField label="Secret pressure" value={active.secret_pressure} onChange={(value) => updateField('secret_pressure', value)} textarea />
            <FormField label="Comedic angle" value={active.comedic_angle} onChange={(value) => updateField('comedic_angle', value)} textarea />
          </div>
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold ${active.include_in_story ? 'bg-rose-600 text-white' : 'border border-rose-300 text-rose-800'}`}
            onClick={() => updateField('include_in_story', !active.include_in_story)}
            type="button"
          >
            {active.include_in_story ? 'Included in story' : 'Excluded from story'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${active.include_in_story ? 'bg-rose-100 text-rose-700' : 'bg-stone-200 text-stone-600'}`}>
              {active.include_in_story ? 'Included' : 'Held back'}
            </span>
            {secondaryActionLabel && onSecondaryAction ? (
              <button className="text-sm font-semibold text-rose-700 underline-offset-2 hover:underline" onClick={() => void onSecondaryAction()} type="button">
                {secondaryActionLabel}
              </button>
            ) : null}
            {!member.is_main && onDelete ? (
              <button className="text-sm font-semibold text-rose-700 underline-offset-2 hover:underline" onClick={() => void onDelete()} type="button">
                Remove
              </button>
            ) : null}
          </div>
          <p className="text-sm text-rose-900/80">{active.summary || 'No summary yet.'}</p>
          <div className="grid gap-2 text-sm text-rose-900/80">
            <p><strong>Connection:</strong> {active.connection_to_leads || 'Not set yet.'}</p>
            <p><strong>Story function:</strong> {active.story_function || 'Not set yet.'}</p>
            <p><strong>Core desire:</strong> {active.core_desire || 'Not set yet.'}</p>
            <p><strong>Core fear:</strong> {active.core_fear || 'Not set yet.'}</p>
            <p><strong>Secret pressure:</strong> {active.secret_pressure || 'Not set yet.'}</p>
            <p><strong>Comedic angle:</strong> {active.comedic_angle || 'Not set yet.'}</p>
          </div>
        </div>
      )}
    </EditorCardShell>
  );
}
