import { useState } from 'react';
import type { ChapterDetail, PremiseResult } from '../types';
import { buildSeededChapters, createChapterDetail, normaliseChapterDetails } from '../utils/chapterDetails';

type UseChapterDetailsEditorOptions = {
  chapterDetails: ChapterDetail[];
  premise: PremiseResult | null;
  targetWords: number;
  onSave: (chapterDetails: ChapterDetail[]) => Promise<void>;
};

export function useChapterDetailsEditor({ chapterDetails, premise, targetWords, onSave }: UseChapterDetailsEditorOptions) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ChapterDetail[]>(chapterDetails);

  const activeChapterDetails = isEditing ? draft : chapterDetails;

  const startEditing = () => {
    setDraft(normaliseChapterDetails(chapterDetails));
    setIsEditing(true);
  };

  const startFromPremise = () => {
    setDraft(buildSeededChapters(premise, targetWords));
    setIsEditing(true);
  };

  const startBlankPlan = () => {
    setDraft([createChapterDetail(1, '', Math.max(1000, Math.round(targetWords / 12)))]);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(normaliseChapterDetails(chapterDetails));
    setIsEditing(false);
  };

  const updateChapter = (index: number, chapter: ChapterDetail) => {
    setDraft((current) => normaliseChapterDetails(current.map((item, currentIndex) => (currentIndex === index ? chapter : item))));
  };

  const removeChapter = (index: number) => {
    setDraft((current) => normaliseChapterDetails(current.filter((_, currentIndex) => currentIndex !== index)));
  };

  const addBlankChapter = () => {
    setDraft((current) =>
      normaliseChapterDetails([
        ...current,
        createChapterDetail(current.length + 1, '', Math.max(1000, Math.round(targetWords / 12))),
      ])
    );
  };

  const seedFromPremise = () => {
    setDraft(buildSeededChapters(premise, targetWords));
  };

  const saveEditing = async () => {
    await onSave(normaliseChapterDetails(draft));
    setIsEditing(false);
  };

  return {
    isEditing,
    draft,
    activeChapterDetails,
    startEditing,
    startFromPremise,
    startBlankPlan,
    cancelEditing,
    updateChapter,
    removeChapter,
    addBlankChapter,
    seedFromPremise,
    saveEditing,
  };
}
