import { useState } from 'react';
import type { PairingResult } from '../../types';
import { PlannerList } from './PlannerList';
import { EditorCardShell } from './editors/EditorCardShell';
import { FormField } from './editors/FormField';
import { StringListEditor } from './editors/StringListEditor';
import { TropeTableEditor } from './editors/TropeTableEditor';

type PairingCardProps = {
  pairing: PairingResult | null;
  isSaving?: boolean;
  onSave: (pairing: PairingResult) => Promise<void>;
};

export function PairingCard({ pairing, isSaving = false, onSave }: PairingCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<PairingResult | null>(pairing);

  if (!pairing) {
    return (
      <div className="rounded-[2rem] border border-dashed border-stone-300 bg-stone-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">Pairing Rules</p>
        <h2 className="font-display text-2xl text-stone-950">Why these two idiots work</h2>
        <p className="mt-3 text-sm text-stone-600">Generate pairing analysis after the lead packs are in place.</p>
      </div>
    );
  }

  const active = isEditing ? draft ?? pairing : pairing;

  const startEditing = () => {
    setDraft({
      ...pairing,
      why_they_clash: [...pairing.why_they_clash],
      why_they_fit: [...pairing.why_they_fit],
      scene_engines: [...pairing.scene_engines],
      trope_table: pairing.trope_table.map((entry) => ({ ...entry })),
      emotional_lessons: { ...pairing.emotional_lessons },
      dominant_story_lane: { ...pairing.dominant_story_lane },
      relationship_escalation_path: [...pairing.relationship_escalation_path],
      risk_notes: [...pairing.risk_notes],
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(null);
    setIsEditing(false);
  };

  const updateField = <K extends keyof PairingResult>(field: K, value: PairingResult[K]) => {
    setDraft({ ...(draft ?? pairing), [field]: value });
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
      eyebrow="Pairing Rules"
      title="Why these two idiots work"
      description="Edit the clash, fit, lesson, trope, and scene engine logic."
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={startEditing}
      onCancel={cancelEditing}
      onSave={() => void saveEditing()}
    >
      {isEditing ? (
        <div className="space-y-4">
          <FormField label="Pairing hook" value={active.pairing_hook} onChange={(value) => updateField('pairing_hook', value)} textarea />
          <FormField label="Best trope" value={active.best_trope} onChange={(value) => updateField('best_trope', value)} />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Lead one lesson"
              value={active.emotional_lessons.lead_one}
              onChange={(value) => updateField('emotional_lessons', { ...active.emotional_lessons, lead_one: value })}
              textarea
            />
            <FormField
              label="Lead two lesson"
              value={active.emotional_lessons.lead_two}
              onChange={(value) => updateField('emotional_lessons', { ...active.emotional_lessons, lead_two: value })}
              textarea
            />
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
          <StringListEditor label="Why they clash" items={active.why_they_clash} onChange={(items) => updateField('why_they_clash', items)} />
          <StringListEditor label="Why they fit" items={active.why_they_fit} onChange={(items) => updateField('why_they_fit', items)} />
          <StringListEditor label="Scene engines" items={active.scene_engines} onChange={(items) => updateField('scene_engines', items)} />
          <StringListEditor
            label="Relationship escalation path"
            items={active.relationship_escalation_path}
            onChange={(items) => updateField('relationship_escalation_path', items)}
          />
          <StringListEditor label="Risk notes" items={active.risk_notes} onChange={(items) => updateField('risk_notes', items)} />
          <TropeTableEditor entries={active.trope_table} onChange={(entries) => updateField('trope_table', entries)} />
        </div>
      ) : (
        <>
          <p className="text-sm text-stone-700">{active.pairing_hook}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-stone-950">Clash</p>
              <PlannerList items={active.why_they_clash} emptyText="No clash notes yet." />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-950">Fit</p>
              <PlannerList items={active.why_they_fit} emptyText="No fit notes yet." />
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
              <p><strong>Best trope:</strong> {active.best_trope}</p>
              <p className="mt-2"><strong>Lead one learns:</strong> {active.emotional_lessons.lead_one}</p>
              <p className="mt-2"><strong>Lead two learns:</strong> {active.emotional_lessons.lead_two}</p>
              <p className="mt-2"><strong>POV rule:</strong> {active.pov_rule || 'Not set yet.'}</p>
            </div>
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-950">Scene engines</p>
              <PlannerList items={active.scene_engines} emptyText="No scene engines yet." />
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
              <p><strong>Main romance arc:</strong> {active.dominant_story_lane.main_romance_arc || 'Not set yet.'}</p>
              <p className="mt-2"><strong>External pressure:</strong> {active.dominant_story_lane.central_external_pressure || 'Not set yet.'}</p>
              <p className="mt-2"><strong>Emotional question:</strong> {active.dominant_story_lane.emotional_question || 'Not set yet.'}</p>
            </div>
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-950">Escalation path</p>
              <PlannerList items={active.relationship_escalation_path} emptyText="No escalation path yet." />
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-950">Trope table</p>
              <div className="mt-3 space-y-2">
                {active.trope_table.map((entry) => (
                  <div key={entry.trope} className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700">
                    <p className="font-semibold">{entry.trope} ({entry.score}/10)</p>
                    <p>{entry.reason}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-950">Risk notes</p>
              <PlannerList items={active.risk_notes} emptyText="No risk notes yet." />
            </div>
          </div>
        </>
      )}
    </EditorCardShell>
  );
}
