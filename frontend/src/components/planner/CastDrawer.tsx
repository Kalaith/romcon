import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { CastMember } from '../../types';
import type { CharacterPack } from '../../types';
import { CastLeadCard } from './CastLeadCard';
import { CastMemberCard } from './CastMemberCard';

type CastDrawerProps = {
  isOpen: boolean;
  leadOne: CharacterPack | null;
  leadTwo: CharacterPack | null;
  cast: CastMember[];
  isSaving: boolean;
  isGenerating: boolean;
  onClose: () => void;
  onGenerate: () => Promise<void>;
  onSaveCast: (cast: CastMember[]) => Promise<void>;
};

export function CastDrawer({
  isOpen,
  leadOne,
  leadTwo,
  cast,
  isSaving,
  isGenerating,
  onClose,
  onGenerate,
  onSaveCast,
}: CastDrawerProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);

  const saveMemberAtIndex = async (index: number, member: CastMember) => {
    const nextCast = cast.map((entry, entryIndex) => (entryIndex === index ? member : entry));
    await onSaveCast(nextCast);
  };

  const removeMemberAtIndex = async (index: number) => {
    const nextCast = cast.filter((_, entryIndex) => entryIndex !== index);
    await onSaveCast(nextCast);
  };

  const saveNewMember = async (member: CastMember) => {
    await onSaveCast([...cast, member]);
    setIsAddingNew(false);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            aria-label="Close cast panel"
            className="fixed inset-0 z-40 bg-rose-950/25 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            type="button"
          />
          <motion.aside
            className="fixed inset-y-4 right-4 z-50 flex w-[min(34rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-[#fff8f3] shadow-[0_30px_90px_rgba(88,32,43,0.26)]"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            <div className="border-b border-rose-200/80 bg-white/85 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">Cast</p>
                  <h2 className="font-display text-3xl text-rose-950">Story people board</h2>
                  <p className="mt-2 text-sm leading-6 text-rose-900/75">
                    Keep the leads visible, build supporting players around them, and decide who actually belongs in the novella draft.
                  </p>
                </div>
                <button className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800" onClick={onClose} type="button">
                  Close
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isGenerating || !leadOne || !leadTwo}
                  onClick={() => void onGenerate()}
                  type="button"
                >
                  {isGenerating ? 'Generating cast...' : 'Generate supporting cast'}
                </button>
                <button
                  className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800"
                  onClick={() => setIsAddingNew(true)}
                  type="button"
                >
                  Add cast member
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <section className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">Main Characters</p>
                  <h3 className="mt-2 font-display text-2xl text-rose-950">Always part of the cast</h3>
                </div>
                <CastLeadCard label="Lead One" character={leadOne} />
                <CastLeadCard label="Lead Two" character={leadTwo} />
              </section>

              <section className="mt-8 space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">Supporting Characters</p>
                    <h3 className="mt-2 font-display text-2xl text-rose-950">Pressure, witness, sabotage, rescue</h3>
                  </div>
                  <p className="text-sm text-rose-900/65">{cast.length} saved</p>
                </div>

                {isAddingNew ? (
                  <CastMemberCard
                    isNew
                    isSaving={isSaving}
                    member={new CastMember()}
                    onCancelNew={() => setIsAddingNew(false)}
                    onSave={saveNewMember}
                  />
                ) : null}

                {cast.length === 0 && !isAddingNew ? (
                  <div className="rounded-[1.5rem] border border-dashed border-rose-200 bg-white/70 p-5 text-sm text-rose-800/70">
                    No supporting cast saved yet. Generate a set or add them manually one at a time.
                  </div>
                ) : null}

                {cast.map((member, index) => (
                  <CastMemberCard
                    key={`${member.name}-${index}`}
                    isSaving={isSaving}
                    member={member}
                    onDelete={() => removeMemberAtIndex(index)}
                    onSave={(nextMember) => saveMemberAtIndex(index, nextMember)}
                  />
                ))}
              </section>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
