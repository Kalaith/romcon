import { CastMember, CharacterLibraryEntry } from '../../types';
import { CastMemberCard } from './CastMemberCard';

type LibraryCastPanelProps = {
  libraryEntries: CharacterLibraryEntry[];
  isSaving: boolean;
  isAddingLibraryMember: boolean;
  onCancelNewLibraryMember: () => void;
  onGenerateMemberFromPrompt: (prompt: string) => Promise<CharacterLibraryEntry>;
  onCreateLibraryEntry: (entry: CastMember) => Promise<void>;
  onSaveLibraryEntry: (entry: CharacterLibraryEntry) => Promise<void>;
  onDeleteLibraryEntry: (entryId: number) => Promise<void>;
  onInjectLibraryEntry: (entry: CharacterLibraryEntry) => Promise<void>;
};

export function LibraryCastPanel({
  libraryEntries,
  isSaving,
  isAddingLibraryMember,
  onCancelNewLibraryMember,
  onGenerateMemberFromPrompt,
  onCreateLibraryEntry,
  onSaveLibraryEntry,
  onDeleteLibraryEntry,
  onInjectLibraryEntry,
}: LibraryCastPanelProps) {
  return (
    <section className="space-y-4">
      <div className="glass-panel rounded-[2rem] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">Character Library</p>
        <h3 className="font-display text-2xl text-rose-950">Reusable people vault</h3>
        <p className="mt-2 text-sm text-rose-900/75">
          Keep persistent characters here, then inject them into any story when you need a friend, rival, sibling, client, landlord, or delightful disaster.
        </p>
        <div className="mt-4 rounded-[1.25rem] bg-amber-50 px-4 py-3 text-sm text-rose-900/80">
          Use this side when asking: who do I want available across multiple stories?
        </div>
      </div>

      {isAddingLibraryMember ? (
        <CastMemberCard
          isNew
          isSaving={isSaving}
          member={new CharacterLibraryEntry()}
          onGenerateFromPrompt={onGenerateMemberFromPrompt}
          onCancelNew={onCancelNewLibraryMember}
          onSave={onCreateLibraryEntry}
        />
      ) : null}

      {libraryEntries.length === 0 && !isAddingLibraryMember ? (
        <div className="rounded-[1.5rem] border border-dashed border-rose-200 bg-white/70 p-5 text-sm text-rose-800/70">
          No saved library characters yet.
        </div>
      ) : null}

      {libraryEntries.map((entry) => (
        <CastMemberCard
          key={entry.id ?? entry.name}
          isSaving={isSaving}
          member={entry}
          onDelete={entry.id ? () => onDeleteLibraryEntry(entry.id!) : undefined}
          onSave={async (member) => {
            await onSaveLibraryEntry({ ...entry, ...member });
          }}
          secondaryActionLabel="Add to story"
          onSecondaryAction={() => onInjectLibraryEntry(entry)}
        />
      ))}
    </section>
  );
}
