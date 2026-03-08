<?php

declare(strict_types=1);

namespace App\Services;

final class RomconPromptBuilder
{
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
            '- Romance progression must escalate in stages rather than jumping ahead: friction or fascination, reluctant attention, private understanding, trust or vulnerability, attraction acknowledged, emotional complication, rupture or fear response, earned resolution.',
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
