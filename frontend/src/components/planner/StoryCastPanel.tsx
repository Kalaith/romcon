import { CastMember, CharacterPack } from '../../types';
import { CastLeadCard } from './CastLeadCard';
import { CastMemberCard } from './CastMemberCard';

type StoryCastPanelProps = {
  leadOne: CharacterPack | null;
  leadTwo: CharacterPack | null;
  storyCast: CastMember[];
  isSaving: boolean;
  isAddingStoryMember: boolean;
  onCancelNewStoryMember: () => void;
  onGenerateMemberFromPrompt: (prompt: string) => Promise<CastMember>;
  onAddStoryMember: (member: CastMember) => Promise<void>;
  onSaveStoryMember: (index: number, member: CastMember) => Promise<void>;
  onRemoveStoryMember: (index: number) => Promise<void>;
  onSaveStoryMemberToLibrary: (member: CastMember) => Promise<void>;
};

export function StoryCastPanel({
  leadOne,
  leadTwo,
  storyCast,
  isSaving,
  isAddingStoryMember,
  onCancelNewStoryMember,
  onGenerateMemberFromPrompt,
  onAddStoryMember,
  onSaveStoryMember,
  onRemoveStoryMember,
  onSaveStoryMemberToLibrary,
}: StoryCastPanelProps) {
  return (
    <section className="space-y-4">
      <div className="glass-panel rounded-[2rem] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">This Story</p>
        <h3 className="font-display text-2xl text-rose-950">Active cast board</h3>
        <p className="mt-2 text-sm text-rose-900/75">
          Build the exact people active in this novella. Save strong characters to the library only when you want them reusable later.
        </p>
        <div className="mt-4 rounded-[1.25rem] bg-rose-50 px-4 py-3 text-sm text-rose-900/80">
          Use this side when asking: who appears in this specific story?
        </div>
      </div>

      <CastLeadCard label="Lead One" character={leadOne} />
      <CastLeadCard label="Lead Two" character={leadTwo} />

      {isAddingStoryMember ? (
        <CastMemberCard
          isNew
          isSaving={isSaving}
          member={new CastMember()}
          onGenerateFromPrompt={onGenerateMemberFromPrompt}
          onCancelNew={onCancelNewStoryMember}
          onSave={onAddStoryMember}
        />
      ) : null}

      {storyCast.length === 0 && !isAddingStoryMember ? (
        <div className="rounded-[1.5rem] border border-dashed border-rose-200 bg-white/70 p-5 text-sm text-rose-800/70">
          No supporting cast is attached to this story yet.
        </div>
      ) : null}

      {storyCast.map((member, index) => (
        <CastMemberCard
          key={`${member.name}-${index}`}
          isSaving={isSaving}
          member={member}
          onDelete={() => onRemoveStoryMember(index)}
          onSave={(nextMember) => onSaveStoryMember(index, nextMember)}
          secondaryActionLabel="Save to library"
          onSecondaryAction={() => onSaveStoryMemberToLibrary(member)}
        />
      ))}
    </section>
  );
}
