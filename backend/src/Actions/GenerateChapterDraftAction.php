<?php

declare(strict_types=1);

namespace App\Actions;

final class GenerateChapterDraftAction extends PromptAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $leadOne = $input['lead_one'] ?? null;
        $leadTwo = $input['lead_two'] ?? null;
        $pairing = $input['pairing'] ?? null;
        $premise = $input['premise'] ?? null;
        $cast = $this->arrayValue($input, 'cast');
        $chapterDetails = $this->arrayValue($input, 'chapter_details');
        $draftChapters = $this->arrayValue($input, 'draft_chapters');
        $chapterNumber = $this->int($input, 'chapter_number');
        $revisionPrompt = $this->string($input, 'revision_prompt');
        $existingDraft = $this->string($input, 'existing_draft');
        $title = $this->string($input, 'title', 'Untitled RomCom');
        $conceptBrief = $this->string($input, 'concept_brief');
        $setting = $this->string($input, 'setting', 'modern contemporary');
        $heatLevel = $this->string($input, 'heat_level', 'sweet');
        $romanceConfiguration = $this->string($input, 'romance_configuration', 'm/f');
        $mainCharacterFocus = $this->string($input, 'main_character_focus');
        $romanceStructureNotes = $this->string($input, 'romance_structure_notes');
        $povMode = $this->string($input, 'pov_mode', 'single_close_third');
        $povNotes = $this->string($input, 'pov_notes');
        $dominantRomanceArc = $this->string($input, 'dominant_romance_arc');
        $centralExternalPressure = $this->string($input, 'central_external_pressure');
        $emotionalQuestion = $this->string($input, 'emotional_question');
        $notes = $this->string($input, 'notes');
        $flavorSeeds = $this->stringList($input, 'flavor_seeds');

        if (!is_array($leadOne) || !is_array($leadTwo) || !is_array($premise) || $chapterNumber < 1) {
            throw new \InvalidArgumentException('lead_one, lead_two, premise, and chapter_number are required');
        }

        $chapter = $this->findChapterDetail($chapterDetails, $chapterNumber);
        if ($chapter === null) {
            throw new \InvalidArgumentException('Requested chapter was not found in chapter_details');
        }

        $previousChapterSummaries = $this->buildPreviousChapterSummaries($draftChapters, $chapterNumber);
        $service = new \App\Services\GeminiService($userId);
        $promptDefinition = $this->prompt('generate_chapter_draft');

        $modeInstruction = $revisionPrompt !== ''
            ? "Revise the existing chapter draft using this revision brief: {$revisionPrompt}"
            : 'Write a fresh chapter draft from the current planning package.';

        $hardRules = is_array($promptDefinition['hard_rules'] ?? null) ? $promptDefinition['hard_rules'] : [];
        $prompt = trim(implode("\n\n", array_filter([
            implode("\n", is_array($promptDefinition['intro_lines'] ?? null) ? $promptDefinition['intro_lines'] : []),
            'Hard rules:' . "\n" . implode("\n", array_map(
                static fn (string $rule): string => '- ' . $rule,
                $hardRules
            )),
            "Mode:\n{$modeInstruction}",
            "Story package:\n" .
            "Title: {$title}\n" .
            "Concept brief: {$conceptBrief}\n" .
            "Setting: {$setting}\n" .
            "Heat level: {$heatLevel}\n" .
            "Romance configuration: {$romanceConfiguration}\n" .
            "Main character focus: {$mainCharacterFocus}\n" .
            "Romance structure notes: {$romanceStructureNotes}\n" .
            "POV mode: {$povMode}\n" .
            "POV notes: {$povNotes}\n" .
            "Dominant romance arc: {$dominantRomanceArc}\n" .
            "Central external pressure: {$centralExternalPressure}\n" .
            "Emotional question: {$emotionalQuestion}\n" .
            ($notes !== '' ? "Protected notes: {$notes}\n" : '') .
            ($flavorSeeds !== [] ? 'Flavor sources: ' . implode(', ', $flavorSeeds) . "\n" : '') .
            'Lead one: ' . json_encode($leadOne, JSON_PRETTY_PRINT) . "\n" .
            'Lead two: ' . json_encode($leadTwo, JSON_PRETTY_PRINT) . "\n" .
            'Pairing analysis: ' . json_encode($pairing, JSON_PRETTY_PRINT) . "\n" .
            'Premise: ' . json_encode($premise, JSON_PRETTY_PRINT) . "\n" .
            'Supporting cast: ' . json_encode($cast, JSON_PRETTY_PRINT),
            'Target chapter:' . "\n" . json_encode($chapter, JSON_PRETTY_PRINT),
            $previousChapterSummaries !== [] ? 'Previously drafted chapter summaries:' . "\n" . json_encode($previousChapterSummaries, JSON_PRETTY_PRINT) : '',
            $existingDraft !== '' ? "Existing draft to revise:\n{$existingDraft}" : '',
            'Return this schema exactly: ' . json_encode($promptDefinition['schema_hint'], JSON_PRETTY_PRINT),
        ])));

        $result = $service->generateJson($prompt, $promptDefinition['schema_hint']);

        $result['chapter_number'] = (int) ($result['chapter_number'] ?? $chapterNumber);
        $result['chapter_title'] = trim((string) ($result['chapter_title'] ?? ($chapter['chapter_title'] ?? '')));
        $result['chapter_summary'] = trim((string) ($result['chapter_summary'] ?? ''));
        $result['draft_text'] = trim((string) ($result['draft_text'] ?? ''));
        $result['status'] = $revisionPrompt !== '' ? 'revised' : 'drafted';
        $result['updated_at'] = date('c');

        return $result;
    }

    private function findChapterDetail(array $chapterDetails, int $chapterNumber): ?array
    {
        foreach ($chapterDetails as $chapter) {
            if (is_array($chapter) && (int) ($chapter['chapter_number'] ?? 0) === $chapterNumber) {
                return $chapter;
            }
        }

        return null;
    }

    private function buildPreviousChapterSummaries(array $draftChapters, int $chapterNumber): array
    {
        $summaries = [];

        foreach ($draftChapters as $chapter) {
            if (!is_array($chapter)) {
                continue;
            }

            $currentNumber = (int) ($chapter['chapter_number'] ?? 0);
            if ($currentNumber < 1 || $currentNumber >= $chapterNumber) {
                continue;
            }

            $summary = trim((string) ($chapter['chapter_summary'] ?? ''));
            $draftText = trim((string) ($chapter['draft_text'] ?? ''));

            $summaries[] = [
                'chapter_number' => $currentNumber,
                'chapter_title' => (string) ($chapter['chapter_title'] ?? ''),
                'chapter_summary' => $summary !== '' ? $summary : mb_substr($draftText, 0, 600),
            ];
        }

        usort($summaries, static fn (array $left, array $right): int => $left['chapter_number'] <=> $right['chapter_number']);

        return $summaries;
    }
}
