import { ChapterDetail, PremiseResult } from '../types';

const DEFAULT_CHAPTER_COUNT = 15;
const DEFAULT_CHAPTER_WORD_TARGET = 3000;

export function createChapterDetail(chapterNumber: number, beatAnchor = '', approximateWordTarget = DEFAULT_CHAPTER_WORD_TARGET): ChapterDetail {
  return {
    ...new ChapterDetail(),
    chapter_number: chapterNumber,
    beat_anchor: beatAnchor,
    approximate_word_target: approximateWordTarget,
  };
}

export function normaliseChapterDetails(chapterDetails: ChapterDetail[]): ChapterDetail[] {
  return chapterDetails.map((chapter, index) => ({
    ...new ChapterDetail(),
    ...chapter,
    chapter_number: index + 1,
    approximate_word_target: Number(chapter.approximate_word_target) || DEFAULT_CHAPTER_WORD_TARGET,
  }));
}

export function buildSeededChapters(premise: PremiseResult | null, targetWords: number): ChapterDetail[] {
  const chapterBeats = premise?.chapter_beats ?? [];
  const defaultWords = Math.max(1000, Math.round(targetWords / Math.max(1, chapterBeats.length || DEFAULT_CHAPTER_COUNT)));

  if (chapterBeats.length === 0) {
    return Array.from({ length: DEFAULT_CHAPTER_COUNT }, (_, index) => createChapterDetail(index + 1, '', defaultWords));
  }

  return chapterBeats.map((beat, index) => createChapterDetail(index + 1, beat, defaultWords));
}
