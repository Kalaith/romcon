<?php

declare(strict_types=1);

namespace App\Services;

final class RomanceFormula
{
    public const CHAPTER_COUNT = 15;

    private const BEATS_BY_CHAPTER = [
        1 => 'Meet-Cute',
        2 => 'First Refusal → Stuck Together',
        3 => 'Slow Burn',
        4 => 'Slow Burn',
        5 => 'Slow Burn',
        6 => 'What If This Could Work',
        7 => 'The Declaration',
        8 => 'The Declaration',
        9 => 'The New Baseline',
        10 => 'The New Baseline',
        11 => 'The Blow-Up',
        12 => "It's So Over",
        13 => "It's So Over",
        14 => "We're So Back",
        15 => 'The Deal Is Sealed + HEA',
    ];

    public static function beatForChapter(int $chapterNumber): string
    {
        return self::BEATS_BY_CHAPTER[$chapterNumber] ?? '';
    }
}
