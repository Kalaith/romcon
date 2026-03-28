import { useState } from 'react';
import { CastMember } from '../../types';
import type { CharacterLibraryEntry, CharacterPack } from '../../types';
import { CastLeadCard } from './CastLeadCard';
import { CastMemberCard } from './CastMemberCard';

type PlannerCastStageProps = {
  leadOne: CharacterPack | null;
  leadTwo: CharacterPack | null;
  storyCast: CastMember[];
  libraryEntries: CharacterLibraryEntry[];
  isSaving: boolean;
  isGenerating: boolean;
  message: string | null;
  error: string | null;
  onGenerateStoryCast: () => void;
  onGenerateMemberFromPrompt: (prompt: string) => Promise<CastMember>;
  onAddStoryMember: (member: CastMember) => Promise<void>;
  onSaveStoryMember: (index: number, member: CastMember) => Promise<void>;
  onRemoveStoryMember: (index: number) => Promise<void>;
  onInjectLibraryEntry: (entry: CharacterLibraryEntry) => Promise<void>;
  onSaveStoryMemberToLibrary: (member: CastMember) => Promise<void>;
};

function matchesLibrarySearch(entry: CharacterLibraryEntry, query: string) {
  if (query.trim() === '') {
    return false;
  }

  const haystack = [
    entry.name,
    entry.role,
    entry.summary,
    entry.connection_to_leads,
    entry.story_function,
    entry.comedic_angle,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(query.trim().toLowerCase());
}

export function PlannerCastStage({
  leadOne,
  leadTwo,
  storyCast,
  libraryEntries,
  isSaving,
  isGenerating,
  message,
  error,
  onGenerateStoryCast,
  onGenerateMemberFromPrompt,
  onAddStoryMember,
  onSaveStoryMember,
  onRemoveStoryMember,
  onInjectLibraryEntry,
  onSaveStoryMemberToLibrary,
}: PlannerCastStageProps) {
  const [isAddingStoryMember, setIsAddingStoryMember] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');

  const filteredLibraryEntries = libraryEntries.filter((entry) => matchesLibrarySearch(entry, librarySearch));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-2">
        <CastLeadCard label="Lead One" character={leadOne} />
        <CastLeadCard label="Lead Two" character={leadTwo} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-rose-950">Build the relationship pressure around the couple</p>
                <p className="mt-1 text-sm text-rose-900/75">
                  Add the rival, ex, best friend, sibling, parent, boss, client, or chaos goblin who keeps this romance from unfolding too neatly.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isGenerating}
                  onClick={onGenerateStoryCast}
                  type="button"
                >
                  {isGenerating ? 'Generating cast...' : storyCast.length > 0 ? 'Regenerate story cast' : 'Generate story cast'}
                </button>
                <button
                  className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800"
                  onClick={() => setIsAddingStoryMember(true)}
                  type="button"
                >
                  Add story cast member
                </button>
              </div>
            </div>
            {message ? <p className="mt-3 text-sm text-rose-700">{message}</p> : null}
            {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
          </div>

          {isAddingStoryMember ? (
            <CastMemberCard
              isNew
              isSaving={isSaving}
              member={new CastMember()}
              onGenerateFromPrompt={onGenerateMemberFromPrompt}
              onCancelNew={() => setIsAddingStoryMember(false)}
              onSave={async (member) => {
                await onAddStoryMember(member);
                setIsAddingStoryMember(false);
              }}
            />
          ) : null}

          {storyCast.length === 0 && !isAddingStoryMember ? (
            <div className="rounded-[1.5rem] border border-dashed border-rose-200 bg-white/70 p-5 text-sm text-rose-800/70">
              No active story cast yet. Generate a set or add characters manually before building the premise.
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

        <section className="space-y-4">
          <div className="rounded-[1.5rem] bg-amber-50/90 p-5">
            <p className="text-sm font-semibold text-rose-950">Search the character library from the main flow</p>
            <p className="mt-1 text-sm text-rose-900/75">
              Pull in reusable characters without leaving the planner. Search by name, role, vibe, or how they affect the couple.
            </p>
            <input
              className="mt-4 w-full rounded-[1rem] border border-rose-200 bg-white px-4 py-3 text-sm text-rose-950 outline-none focus:border-rose-400"
              value={librarySearch}
              onChange={(event) => setLibrarySearch(event.target.value)}
              placeholder="Search: ex, boss, rival, best friend, mother, disaster roommate..."
              type="text"
            />
          </div>

          {filteredLibraryEntries.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-rose-200 bg-white/70 p-5 text-sm text-rose-800/70">
              {librarySearch.trim() === '' ? 'Search the library to load matching characters here.' : 'No library characters match that search.'}
            </div>
          ) : (
            filteredLibraryEntries.map((entry) => {
              const alreadyIncluded = storyCast.some((member) => member.name === entry.name && member.role === entry.role);

              return (
                <article key={entry.id ?? `${entry.name}-${entry.role}`} className="rounded-[1.5rem] bg-white/85 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl text-rose-950">{entry.name || 'Unnamed library character'}</h3>
                      <p className="mt-1 text-sm font-semibold text-rose-900/70">{entry.role || 'Role not set'}</p>
                    </div>
                    <button
                      className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={alreadyIncluded}
                      onClick={() => void onInjectLibraryEntry(entry)}
                      type="button"
                    >
                      {alreadyIncluded ? 'Already in story' : 'Add to story'}
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-rose-900/80">{entry.summary || 'No summary yet.'}</p>
                  <div className="mt-4 grid gap-2 text-sm text-rose-900/80">
                    <p><strong>Connection:</strong> {entry.connection_to_leads || 'Not set yet.'}</p>
                    <p><strong>Impact on couple:</strong> {entry.story_function || 'Not set yet.'}</p>
                    <p><strong>Comedic angle:</strong> {entry.comedic_angle || 'Not set yet.'}</p>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}
