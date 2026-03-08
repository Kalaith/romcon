import { useState } from 'react';
import type { CharacterPack } from '../../types';
import { PlannerList } from './PlannerList';
import { EditorCardShell } from './editors/EditorCardShell';
import { FormField } from './editors/FormField';
import { StringListEditor } from './editors/StringListEditor';

type CharacterCardProps = {
  label: string;
  character: CharacterPack | null;
  isSaving?: boolean;
  onSave: (character: CharacterPack) => Promise<void>;
};

export function CharacterCard({ label, character, isSaving = false, onSave }: CharacterCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<CharacterPack | null>(character);

  if (!character) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-rose-200 p-5 text-sm text-rose-800/70">
        {label} will appear here after generation.
      </div>
    );
  }

  const active = isEditing ? draft ?? character : character;

  const updateField = <K extends keyof CharacterPack>(field: K, value: CharacterPack[K]) => {
    setDraft({ ...(draft ?? character), [field]: value });
  };

  const startEditing = () => {
    setDraft({ ...character, sample_dialogue: [...character.sample_dialogue] });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft({ ...character, sample_dialogue: [...character.sample_dialogue] });
    setIsEditing(false);
  };

  const saveEditing = async () => {
    if (!draft) {
      return;
    }

    await onSave(draft);
    setIsEditing(false);
  };

  return (
    <EditorCardShell
      eyebrow={label}
      title={active.name || label}
      description={active.occupation ? `${active.age} | ${active.occupation}` : 'Generated lead'}
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={startEditing}
      onCancel={cancelEditing}
      onSave={() => void saveEditing()}
    >
      {isEditing ? (
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Name" value={active.name} onChange={(value) => updateField('name', value)} />
          <FormField label="Age" value={active.age} onChange={(value) => updateField('age', value)} />
          <FormField label="Occupation" value={active.occupation} onChange={(value) => updateField('occupation', value)} />
          <FormField label="Personality summary" value={active.personality_summary} onChange={(value) => updateField('personality_summary', value)} textarea />
          <FormField label="Core desire" value={active.core_desire} onChange={(value) => updateField('core_desire', value)} textarea />
          <FormField label="Core fear" value={active.core_fear} onChange={(value) => updateField('core_fear', value)} textarea />
          <FormField label="Public competence" value={active.public_competence} onChange={(value) => updateField('public_competence', value)} textarea />
          <FormField label="Private mess" value={active.private_mess} onChange={(value) => updateField('private_mess', value)} textarea />
          <FormField label="Everyday strength" value={active.everyday_strength} onChange={(value) => updateField('everyday_strength', value)} textarea />
          <FormField label="Comedic weakness" value={active.comedic_weakness} onChange={(value) => updateField('comedic_weakness', value)} textarea />
          <FormField label="Romantic blind spot" value={active.romantic_blind_spot} onChange={(value) => updateField('romantic_blind_spot', value)} textarea />
          <FormField label="Secret pressure" value={active.secret_pressure} onChange={(value) => updateField('secret_pressure', value)} textarea />
          <FormField label="Social circle role" value={active.social_circle_role} onChange={(value) => updateField('social_circle_role', value)} />
          <FormField label="Dialogue rhythm" value={active.dialogue_rhythm} onChange={(value) => updateField('dialogue_rhythm', value)} textarea />
          <FormField label="Thinks they want" value={active.thinks_they_want} onChange={(value) => updateField('thinks_they_want', value)} textarea />
          <FormField label="Actually needs" value={active.actually_needs} onChange={(value) => updateField('actually_needs', value)} textarea />
          <div className="md:col-span-2">
            <StringListEditor label="Sample dialogue" items={active.sample_dialogue} onChange={(items) => updateField('sample_dialogue', items)} />
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-rose-900/85">{active.personality_summary}</p>
          <div className="mt-4 grid gap-2 text-sm text-rose-900/80">
            <p><strong>Core desire:</strong> {active.core_desire}</p>
            <p><strong>Core fear:</strong> {active.core_fear}</p>
            <p><strong>Public competence:</strong> {active.public_competence}</p>
            <p><strong>Private mess:</strong> {active.private_mess}</p>
            <p><strong>Everyday strength:</strong> {active.everyday_strength}</p>
            <p><strong>Comedic weakness:</strong> {active.comedic_weakness}</p>
            <p><strong>Blind spot:</strong> {active.romantic_blind_spot}</p>
            <p><strong>Pressure:</strong> {active.secret_pressure}</p>
            <p><strong>Social role:</strong> {active.social_circle_role}</p>
            <p><strong>Dialogue rhythm:</strong> {active.dialogue_rhythm}</p>
            <p><strong>Thinks they want:</strong> {active.thinks_they_want}</p>
            <p><strong>Actually needs:</strong> {active.actually_needs}</p>
          </div>
          <PlannerList items={active.sample_dialogue} emptyText="Dialogue samples will appear here." />
        </>
      )}
    </EditorCardShell>
  );
}
