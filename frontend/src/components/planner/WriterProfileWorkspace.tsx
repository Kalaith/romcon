import { useEffect, useState } from 'react';
import type { WriterProfilePayload } from '../../api/writerProfile';

type WriterProfileWorkspaceProps = {
  profile: WriterProfilePayload | null;
  isSaving: boolean;
  error: string | null;
  message: string | null;
  onSave: (profileMarkdown: string) => Promise<void>;
};

export function WriterProfileWorkspace({ profile, isSaving, error, message, onSave }: WriterProfileWorkspaceProps) {
  const [draft, setDraft] = useState('');

  useEffect(() => {
    setDraft(profile?.effective_profile ?? '');
  }, [profile]);

  const saveProfile = async () => {
    await onSave(draft);
  };

  const resetToDefault = async () => {
    if (!profile) {
      return;
    }

    setDraft(profile.default_profile);
    await onSave('');
  };

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">Writers Profile</p>
        <h2 className="font-display text-3xl text-rose-950">Default voice and editable operating manual</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-rose-900/75">
          This workspace controls the creative voice sent with AI generation and included in exports. The built-in profile from the backend prompt definitions is the default. You can keep it as-is, or replace it with your own version for this account.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={isSaving} onClick={() => void saveProfile()}>
            {isSaving ? 'Saving...' : 'Save Writer Profile'}
          </button>
          <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800 disabled:opacity-60" disabled={isSaving || !profile || profile.is_default} onClick={() => void resetToDefault()}>
            Reset To Default
          </button>
        </div>
        {message ? <p className="mt-3 text-sm text-rose-700">{message}</p> : null}
        {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-panel rounded-[2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">Editable Effective Profile</p>
          <h3 className="font-display text-2xl text-rose-950">What generation will use now</h3>
          <textarea
            className="mt-4 min-h-[34rem] w-full rounded-[1.5rem] border border-rose-200 bg-white px-4 py-3 text-sm leading-6 text-rose-950"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </section>

        <section className="space-y-6">
          <div className="glass-panel rounded-[2rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">Default Profile</p>
            <h3 className="font-display text-2xl text-rose-950">Built-in voice from prompt definition</h3>
            <pre className="mt-4 max-h-[20rem] overflow-auto whitespace-pre-wrap rounded-[1.5rem] bg-white/85 p-4 text-sm leading-6 text-rose-900/80">
              {profile?.default_profile ?? ''}
            </pre>
          </div>

          <div className="glass-panel rounded-[2rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">Export Behavior</p>
            <h3 className="font-display text-2xl text-rose-950">Included in the novel package</h3>
            <p className="mt-2 text-sm leading-6 text-rose-900/75">
              The effective writer profile is included in plan exports so downstream novel-writing AI receives the same voice instructions used during planning.
            </p>
            <p className="mt-4 text-sm text-rose-900/75">
              Status: {profile?.is_default ? 'Using the built-in default profile.' : 'Using your saved custom override.'}
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}
