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
    <div className="glass-panel rounded-[2rem] p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">{eyebrow}</p>
          <h2 className="font-display text-2xl text-rose-950">{title}</h2>
          {description ? <p className="mt-2 text-sm text-rose-900/70">{description}</p> : null}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800" onClick={onCancel}>
                Cancel
              </button>
              <button className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white" onClick={onSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800" onClick={onEdit}>
              Edit
            </button>
          )}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
