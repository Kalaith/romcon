import { useState } from 'react';
import type { PremiseResult } from '../../types';
import { PlannerList } from './PlannerList';
import { EditorCardShell } from './editors/EditorCardShell';
import { FormField } from './editors/FormField';
import { StringListEditor } from './editors/StringListEditor';

type PremiseCardProps = {
  premise: PremiseResult | null;
  isSaving?: boolean;
  onSave: (premise: PremiseResult) => Promise<void>;
};

export function PremiseCard({ premise, isSaving = false, onSave }: PremiseCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<PremiseResult | null>(premise);

  if (!premise) {
    return (
      <div className="rounded-[2rem] border border-dashed border-stone-300 bg-stone-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">Premise Blueprint</p>
        <h2 className="font-display text-2xl text-stone-950">Trap them together</h2>
        <p className="mt-3 text-sm text-stone-600">Your novella hook and chapter beats will land here.</p>
      </div>
    );
  }

  const active = isEditing ? draft ?? premise : premise;

  const startEditing = () => {
    setDraft({
      ...premise,
      chapter_beats: [...premise.chapter_beats],
      relationship_escalation_path: [...premise.relationship_escalation_path],
      scene_contract: {
        required_elements: [...premise.scene_contract.required_elements],
        chapter_change_rule: premise.scene_contract.chapter_change_rule,
      },
      supporting_cast_roles: [...premise.supporting_cast_roles],
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(null);
    setIsEditing(false);
  };

  const updateField = <K extends keyof PremiseResult>(field: K, value: PremiseResult[K]) => {
    setDraft({ ...(draft ?? premise), [field]: value });
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
      eyebrow="Premise Blueprint"
      title="Trap them together"
      description="Edit the logline, premise engine, supporting roles, and beat structure."
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={startEditing}
      onCancel={cancelEditing}
      onSave={() => void saveEditing()}
    >
      {isEditing ? (
        <div className="space-y-4">
          <FormField label="Logline" value={active.logline} onChange={(value) => updateField('logline', value)} textarea />
          <FormField label="Premise" value={active.premise} onChange={(value) => updateField('premise', value)} textarea />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Forced proximity device" value={active.forced_proximity_device} onChange={(value) => updateField('forced_proximity_device', value)} textarea />
            <FormField label="Primary obstacle" value={active.primary_obstacle} onChange={(value) => updateField('primary_obstacle', value)} textarea />
            <FormField label="Midpoint shift" value={active.midpoint_shift} onChange={(value) => updateField('midpoint_shift', value)} textarea />
            <FormField label="Finale payoff" value={active.finale_payoff} onChange={(value) => updateField('finale_payoff', value)} textarea />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Main romance arc"
              value={active.dominant_story_lane.main_romance_arc}
              onChange={(value) => updateField('dominant_story_lane', { ...active.dominant_story_lane, main_romance_arc: value })}
              textarea
            />
            <FormField
              label="Central external pressure"
              value={active.dominant_story_lane.central_external_pressure}
              onChange={(value) => updateField('dominant_story_lane', { ...active.dominant_story_lane, central_external_pressure: value })}
              textarea
            />
          </div>
          <FormField
            label="Emotional question"
            value={active.dominant_story_lane.emotional_question}
            onChange={(value) => updateField('dominant_story_lane', { ...active.dominant_story_lane, emotional_question: value })}
            textarea
          />
          <FormField label="POV rule" value={active.pov_rule} onChange={(value) => updateField('pov_rule', value)} textarea />
          <FormField label="Recurring comedic motif" value={active.recurring_comedic_motif} onChange={(value) => updateField('recurring_comedic_motif', value)} textarea />
          <StringListEditor
            label="Relationship escalation path"
            items={active.relationship_escalation_path}
            onChange={(items) => updateField('relationship_escalation_path', items)}
          />
          <StringListEditor
            label="Scene contract required elements"
            items={active.scene_contract.required_elements}
            onChange={(items) => updateField('scene_contract', { ...active.scene_contract, required_elements: items })}
          />
          <FormField
            label="Chapter change rule"
            value={active.scene_contract.chapter_change_rule}
            onChange={(value) => updateField('scene_contract', { ...active.scene_contract, chapter_change_rule: value })}
            textarea
          />
          <StringListEditor label="Supporting cast roles" items={active.supporting_cast_roles} onChange={(items) => updateField('supporting_cast_roles', items)} />
          <StringListEditor label="Chapter beats" items={active.chapter_beats} onChange={(items) => updateField('chapter_beats', items)} />
        </div>
      ) : (
        <>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
            <h3 className="font-display text-2xl text-stone-950">{active.logline}</h3>
            <p className="mt-3 text-sm text-stone-700">{active.premise}</p>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
              <p><strong>POV rule:</strong> {active.pov_rule || 'Not set yet.'}</p>
              <p className="mt-2"><strong>Main romance arc:</strong> {active.dominant_story_lane.main_romance_arc || 'Not set yet.'}</p>
              <p className="mt-2"><strong>External pressure:</strong> {active.dominant_story_lane.central_external_pressure || 'Not set yet.'}</p>
              <p className="mt-2"><strong>Emotional question:</strong> {active.dominant_story_lane.emotional_question || 'Not set yet.'}</p>
            </div>
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
              <p><strong>Forced proximity:</strong> {active.forced_proximity_device}</p>
              <p className="mt-2"><strong>Primary obstacle:</strong> {active.primary_obstacle}</p>
              <p className="mt-2"><strong>Midpoint shift:</strong> {active.midpoint_shift}</p>
              <p className="mt-2"><strong>Finale payoff:</strong> {active.finale_payoff}</p>
              <p className="mt-2"><strong>Comedic motif:</strong> {active.recurring_comedic_motif}</p>
            </div>
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-950">Escalation path</p>
              <PlannerList items={active.relationship_escalation_path} emptyText="No escalation path yet." />
            </div>
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-950">Scene contract</p>
              <PlannerList items={active.scene_contract.required_elements} emptyText="No scene contract elements yet." />
              <p className="mt-3 text-sm text-stone-700"><strong>Change rule:</strong> {active.scene_contract.chapter_change_rule || 'Not set yet.'}</p>
            </div>
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4 md:col-span-2">
              <p className="text-sm font-semibold text-stone-950">Supporting cast roles</p>
              <PlannerList items={active.supporting_cast_roles} emptyText="No supporting cast notes yet." />
            </div>
          </div>
          <div className="mt-4 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
            <p className="text-sm font-semibold text-stone-950">12-chapter frame</p>
            <PlannerList items={active.chapter_beats} emptyText="No chapter beats yet." />
          </div>
        </>
      )}
    </EditorCardShell>
  );
}
