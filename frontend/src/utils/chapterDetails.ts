import { ChapterDetail, PremiseResult } from '../types';

const DEFAULT_CHAPTER_COUNT = 15;
const DEFAULT_CHAPTER_WORD_TARGET = 3000;

const FORMULA_BEATS_BY_CHAPTER = [
  'Meet-Cute',
  'First Refusal → Stuck Together',
  'Slow Burn',
  'Slow Burn',
  'Slow Burn',
  'What If This Could Work',
  'The Declaration',
  'The Declaration',
  'The New Baseline',
  'The New Baseline',
  'The Blow-Up',
  "It's So Over",
  "It's So Over",
  "We're So Back",
  'The Deal Is Sealed + HEA',
] as const;

export function formulaBeatForChapter(chapterNumber: number, chapterCount: number): string {
  return chapterCount === DEFAULT_CHAPTER_COUNT ? FORMULA_BEATS_BY_CHAPTER[chapterNumber - 1] ?? '' : '';
}

export function createChapterDetail(chapterNumber: number, beatAnchor = '', approximateWordTarget = DEFAULT_CHAPTER_WORD_TARGET, formulaBeat = ''): ChapterDetail {
  return {
    ...new ChapterDetail(),
    chapter_number: chapterNumber,
    beat_anchor: beatAnchor,
    approximate_word_target: approximateWordTarget,
    formula_beat: formulaBeat,
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
    return Array.from({ length: DEFAULT_CHAPTER_COUNT }, (_, index) =>
      createChapterDetail(index + 1, '', defaultWords, formulaBeatForChapter(index + 1, DEFAULT_CHAPTER_COUNT))
    );
  }

  return chapterBeats.map((beat, index) =>
    createChapterDetail(index + 1, beat, defaultWords, formulaBeatForChapter(index + 1, chapterBeats.length))
  );
}
