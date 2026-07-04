<?php

declare(strict_types=1);

namespace App\Services;

final class RomconPromptBuilder
{
    private const HEAT_LEVEL_GUIDANCE = [
        'chaste' => 'no sex on page',
        'sweet' => 'kissing and affection, fade-to-black',
        'warm' => 'sensual build, light on-page detail',
        'steamy' => 'explicit scenes, moderate detail',
        'spicy' => 'multiple explicit scenes, strong descriptive detail',
        'smutty' => 'explicit scenes are frequent and prominent',
        'erotic' => 'sex is a core structural element of the story',
    ];

    /**
     * @param list<string> $contextLines
     * @param list<string> $taskLines
     */
    public function buildPlanningPrompt(string $layerLabel, string $jobLabel, array $contextLines, array $taskLines): string
    {
        $sections = [
            "Engine role: {$layerLabel}\nJob: {$jobLabel}",
            $this->planningRulesBlock(),
            $this->formatSection('Context', $contextLines),
            $this->formatSection('Task', $taskLines),
        ];

        return trim(implode("\n\n", array_filter($sections)));
    }

    /**
     * @return list<string>
     */
    public function compactLines(string ...$lines): array
    {
        return array_values(array_filter(array_map(
            static fn (string $line): string => trim($line),
            $lines
        ), static fn (string $line): bool => $line !== ''));
    }

    public function heatLevelLine(string $heatLevel): string
    {
        $key = strtolower(trim($heatLevel));
        $description = self::HEAT_LEVEL_GUIDANCE[$key] ?? 'unspecified intimacy level';

        return "Heat level: {$key} ({$description})";
    }

    private function planningRulesBlock(): string
    {
        return implode("\n", [
            'Universal planning rules:',
            '- This engine generates story architecture only. Do not write novel prose, scene prose, or decorative narration.',
            '- Return planning language that a writer or downstream AI can use to draft from later.',
            '- If the schema asks for dialogue samples, keep them brief illustrative snippets rather than scene writing.',
            '- Prefer concise, concrete planning statements over lyrical wording.',
            '- Choose one dominant story lane. Select one main romance arc, one central external pressure, and one emotional question. Subplots must support one of those three rather than competing with them.',
            '- Treat POV as a hard rule, not an implication. Default to single close third person unless the task explicitly asks for another structure.',
            '- Do not reveal the internal thoughts of non-POV characters except through observable behavior, dialogue, and inference.',
            '- Scene planning must assume every scene contains a goal, friction or interruption, a meaningful change by the end, one emotional beat, and one carry-forward thread.',
            '- Romance structure follows the proven romance Formula beats, in order, placed at roughly these points of the total story: Meet-Cute (1%), First Refusal (5%), The Problem Sticks Them Together (12%), Slow Burn (33%), What If This Could Work (40%), The Declaration (50%), The New Baseline (66%), The Blow-Up (75%), It\'s So Over (88%), We\'re So Back (90%), The Deal Is Sealed (98%), Happily Ever After (100%).',
            '- The Meet-Cute is the scene readers reread most. Make the first meeting memorable and plant the hint of why these two are perfect for each other, without overplaying it.',
            '- The First Refusal must be a reasonable conclusion, not a character flaw: the gap keeping the leads apart must be real and imposing (station, allegiance, circumstance, stakes), so readers respect the refusal instead of blaming the lead.',
            '- Readers punish unreasonable or immature behavior from protagonists and love interests. Every romantic obstacle must survive the question: could two adults solve this by sitting down and talking? If yes, either fix the obstacle or give an excellent, reinforced, telegraphed reason that conversation cannot happen.',
            '- The Blow-Up must never be caused by an avoidable misunderstanding or cheap miscommunication. Prefer an extrinsic blow-up (an external threat tied to the central pressure) over an intrinsic one; if intrinsic, the fear or false belief must be planted early and developed steadily, never appearing from nowhere.',
            '- A happily-ever-after is guaranteed. Love wins. Never plan an ambiguous, tragic, or unresolved romantic ending, and never let the leads permanently lose relationship progress they have earned.',
            '- In the climax, the love between the leads must be a key element of the victory, not incidental to it.',
            '- Both leads are co-protagonists. The love interest must never become background noise: give each lead goals, competence, friends, and pressures outside the romance, and keep both active in the finale.',
            '- Exactly one main romance. Never introduce surprise additional love interests for a settled pairing; rivals may exist but the main pairing stays unambiguous.',
            '- Avoid repeating full character summaries, repeated emotional realizations, repeated flirtation patterns, repeated premise restatements, or duplicated body-language beats.',
            '- Do not let output blur into chapters-as-prose. Keep all content in outline, planning, or reference form.',
            '- Terms such as arc, midpoint, black moment, forced proximity, theme, and trope are planning tools here, not lines of novel prose.',
            '- Before finalizing, silently self-check: is the output clear, non-repetitive, structurally useful, and appropriate to this planning layer?',
        ]);
    }

    /**
     * @param list<string> $lines
     */
    private function formatSection(string $title, array $lines): string
    {
        return $title . ":\n" . implode("\n", array_map(
            static fn (string $line): string => '- ' . $line,
            $lines
        ));
    }
}
