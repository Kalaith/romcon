import { ChapterDetail, PremiseResult } from '../types';

export function createChapterDetail(chapterNumber: number, beatAnchor = '', approximateWordTarget = 2500): ChapterDetail {
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
    approximate_word_target: Number(chapter.approximate_word_target) || 2500,
  }));
}

export function buildSeededChapters(premise: PremiseResult | null, targetWords: number): ChapterDetail[] {
  const chapterBeats = premise?.chapter_beats ?? [];
  if (chapterBeats.length === 0) {
    return [createChapterDetail(1, '', Math.max(1000, Math.round(targetWords / 12)))];
  }

  const defaultWords = Math.max(1000, Math.round(targetWords / Math.max(1, chapterBeats.length)));
  return chapterBeats.map((beat, index) => createChapterDetail(index + 1, beat, defaultWords));
}
