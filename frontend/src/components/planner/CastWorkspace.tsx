import { CastMember, CharacterLibraryEntry } from '../../types';
import type { CharacterPack } from '../../types';
import { useCastWorkspace } from '../../hooks/useCastWorkspace';
import { CastWorkspaceHeader } from './CastWorkspaceHeader';
import { LibraryCastPanel } from './LibraryCastPanel';
import { StoryCastPanel } from './StoryCastPanel';

type CastWorkspaceProps = {
  leadOne: CharacterPack | null;
  leadTwo: CharacterPack | null;
  storyCast: CastMember[];
  libraryEntries: CharacterLibraryEntry[];
  isSaving: boolean;
  isGenerating: boolean;
  error: string | null;
  message: string | null;
  storyCastButtonLabel: string;
  storyCastOverwriteHint?: string | null;
  onGenerateStoryCast: () => Promise<void>;
  onSaveStoryCast: (cast: CastMember[]) => Promise<void>;
  onSaveLibraryEntry: (entry: CharacterLibraryEntry) => Promise<void>;
  onCreateLibraryEntry: (member: CastMember) => Promise<void>;
  onDeleteLibraryEntry: (entryId: number) => Promise<void>;
  onInjectLibraryEntry: (entry: CharacterLibraryEntry) => Promise<void>;
  onGenerateMemberFromPrompt: (prompt: string) => Promise<CastMember>;
};

export function CastWorkspace({
  leadOne,
  leadTwo,
  storyCast,
  libraryEntries,
  isSaving,
  isGenerating,
  error,
  message,
  storyCastButtonLabel,
  storyCastOverwriteHint,
  onGenerateStoryCast,
  onSaveStoryCast,
  onSaveLibraryEntry,
  onCreateLibraryEntry,
  onDeleteLibraryEntry,
  onInjectLibraryEntry,
  onGenerateMemberFromPrompt,
}: CastWorkspaceProps) {
  const castWorkspace = useCastWorkspace({ storyCast, onSaveStoryCast });

  return (
    <section className="space-y-6">
      <CastWorkspaceHeader
        isGenerating={isGenerating}
        canGenerate={Boolean(leadOne && leadTwo)}
        storyCastButtonLabel={storyCastButtonLabel}
        storyCastOverwriteHint={storyCastOverwriteHint}
        message={message}
        error={error}
        onGenerateStoryCast={onGenerateStoryCast}
        onAddStoryMember={() => castWorkspace.setIsAddingStoryMember(true)}
        onAddLibraryMember={() => castWorkspace.setIsAddingLibraryMember(true)}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <StoryCastPanel
          leadOne={leadOne}
          leadTwo={leadTwo}
          storyCast={storyCast}
          isSaving={isSaving}
          isAddingStoryMember={castWorkspace.isAddingStoryMember}
          onCancelNewStoryMember={() => castWorkspace.setIsAddingStoryMember(false)}
          onGenerateMemberFromPrompt={onGenerateMemberFromPrompt}
          onAddStoryMember={castWorkspace.addStoryMember}
          onSaveStoryMember={castWorkspace.saveStoryMemberAtIndex}
          onRemoveStoryMember={castWorkspace.removeStoryMemberAtIndex}
          onSaveStoryMemberToLibrary={onCreateLibraryEntry}
        />

        <LibraryCastPanel
          libraryEntries={libraryEntries}
          isSaving={isSaving}
          isAddingLibraryMember={castWorkspace.isAddingLibraryMember}
          onCancelNewLibraryMember={() => castWorkspace.setIsAddingLibraryMember(false)}
          onGenerateMemberFromPrompt={async (prompt) => {
            const member = await onGenerateMemberFromPrompt(prompt);
            return { ...new CharacterLibraryEntry(), ...member };
          }}
          onCreateLibraryEntry={async (entry) => {
            await onCreateLibraryEntry(entry);
            castWorkspace.setIsAddingLibraryMember(false);
          }}
          onSaveLibraryEntry={onSaveLibraryEntry}
          onDeleteLibraryEntry={onDeleteLibraryEntry}
          onInjectLibraryEntry={onInjectLibraryEntry}
        />
      </div>
    </section>
  );
}
