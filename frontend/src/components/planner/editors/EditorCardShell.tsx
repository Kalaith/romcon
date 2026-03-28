import type { ReactNode } from 'react';

type EditorCardShellProps = {
  eyebrow: string;
  title: string;
  description?: string;
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  children: ReactNode;
};

export function EditorCardShell({
  eyebrow,
  title,
  description,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  children,
}: EditorCardShellProps) {
  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">{eyebrow}</p>
          <h2 className="font-display text-2xl text-stone-950">{title}</h2>
          {description ? <p className="mt-2 text-sm text-stone-600">{description}</p> : null}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700" onClick={onCancel}>
                Cancel
              </button>
              <button className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white" onClick={onSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700" onClick={onEdit}>
              Edit
            </button>
          )}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
