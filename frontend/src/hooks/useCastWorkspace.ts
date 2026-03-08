import { useState } from 'react';
import { CastMember } from '../types';

type UseCastWorkspaceOptions = {
  storyCast: CastMember[];
  onSaveStoryCast: (cast: CastMember[]) => Promise<void>;
};

export function useCastWorkspace({ storyCast, onSaveStoryCast }: UseCastWorkspaceOptions) {
  const [isAddingStoryMember, setIsAddingStoryMember] = useState(false);
  const [isAddingLibraryMember, setIsAddingLibraryMember] = useState(false);

  const saveStoryMemberAtIndex = async (index: number, member: CastMember) => {
    await onSaveStoryCast(storyCast.map((entry, entryIndex) => (entryIndex === index ? member : entry)));
  };

  const removeStoryMemberAtIndex = async (index: number) => {
    await onSaveStoryCast(storyCast.filter((_, entryIndex) => entryIndex !== index));
  };

  const addStoryMember = async (member: CastMember) => {
    await onSaveStoryCast([...storyCast, member]);
    setIsAddingStoryMember(false);
  };

  return {
    isAddingStoryMember,
    isAddingLibraryMember,
    setIsAddingStoryMember,
    setIsAddingLibraryMember,
    saveStoryMemberAtIndex,
    removeStoryMemberAtIndex,
    addStoryMember,
  };
}
