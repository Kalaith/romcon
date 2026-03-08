type CastWorkspaceHeaderProps = {
  isGenerating: boolean;
  canGenerate: boolean;
  storyCastButtonLabel: string;
  storyCastOverwriteHint?: string | null;
  message: string | null;
  error: string | null;
  onGenerateStoryCast: () => Promise<void>;
  onAddStoryMember: () => void;
  onAddLibraryMember: () => void;
};

export function CastWorkspaceHeader({
  isGenerating,
  canGenerate,
  storyCastButtonLabel,
  storyCastOverwriteHint,
  message,
  error,
  onGenerateStoryCast,
  onAddStoryMember,
  onAddLibraryMember,
}: CastWorkspaceHeaderProps) {
  return (
    <div className="glass-panel rounded-[2rem] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">Cast Workspace</p>
          <h2 className="font-display text-3xl text-rose-950">Build people once, deploy them anywhere</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-rose-900/75">
            The story cast is this novella&apos;s active bench. The character library is your reusable vault for future stories. Editing one does not silently edit the other.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => void onGenerateStoryCast()}
            disabled={isGenerating || !canGenerate}
          >
            {isGenerating ? 'Generating cast...' : storyCastButtonLabel}
          </button>
          <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800" onClick={onAddStoryMember}>
            Add story cast member
          </button>
          <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800" onClick={onAddLibraryMember}>
            Add library character
          </button>
        </div>
      </div>
      {storyCastOverwriteHint ? <p className="mt-4 text-sm text-rose-900/70">{storyCastOverwriteHint}</p> : null}
      {message ? <p className="mt-4 text-sm text-rose-700">{message}</p> : null}
      {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}
