<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\GeminiService;
use App\Services\RomconPromptBuilder;

final class PolishConceptAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $title = trim((string) ($input['title'] ?? ''));
        if (strtolower($title) === 'untitled romcom') {
            $title = '';
        }

        $conceptBrief = trim((string) ($input['concept_brief'] ?? ''));
        $setting = trim((string) ($input['setting'] ?? ''));
        $romanceConfiguration = trim((string) ($input['romance_configuration'] ?? ''));
        $mainCharacterFocus = trim((string) ($input['main_character_focus'] ?? ''));
        $romanceStructureNotes = trim((string) ($input['romance_structure_notes'] ?? ''));
        $povMode = trim((string) ($input['pov_mode'] ?? ''));
        $povNotes = trim((string) ($input['pov_notes'] ?? ''));
        $dominantRomanceArc = trim((string) ($input['dominant_romance_arc'] ?? ''));
        $centralExternalPressure = trim((string) ($input['central_external_pressure'] ?? ''));
        $emotionalQuestion = trim((string) ($input['emotional_question'] ?? ''));

        if (
            $title === '' &&
            $conceptBrief === '' &&
            $setting === '' &&
            $mainCharacterFocus === '' &&
            $romanceStructureNotes === '' &&
            $povNotes === '' &&
            $dominantRomanceArc === '' &&
            $centralExternalPressure === '' &&
            $emotionalQuestion === ''
        ) {
            throw new \InvalidArgumentException('At least one concept field is required to polish');
        }

        $service = new GeminiService($userId);
        $promptBuilder = new RomconPromptBuilder();

        return $service->generateJson(
            $promptBuilder->buildPlanningPrompt(
                'Layer 0: Concept Cleanup',
                'Spellcheck and lightly clarify the existing concept board',
                $promptBuilder->compactLines(
                    $title !== '' ? "Current title: {$title}" : 'Current title: ',
                    $conceptBrief !== '' ? "Current concept brief: {$conceptBrief}" : 'Current concept brief: ',
                    $setting !== '' ? "Current setting: {$setting}" : 'Current setting: ',
                    $romanceConfiguration !== '' ? "Current romance configuration: {$romanceConfiguration}" : 'Current romance configuration: ',
                    $mainCharacterFocus !== '' ? "Current main character focus: {$mainCharacterFocus}" : 'Current main character focus: ',
                    $romanceStructureNotes !== '' ? "Current romance structure notes: {$romanceStructureNotes}" : 'Current romance structure notes: ',
                    $povMode !== '' ? "Current POV mode: {$povMode}" : 'Current POV mode: ',
                    $povNotes !== '' ? "Current POV notes: {$povNotes}" : 'Current POV notes: ',
                    $dominantRomanceArc !== '' ? "Current dominant romance arc: {$dominantRomanceArc}" : 'Current dominant romance arc: ',
                    $centralExternalPressure !== '' ? "Current central external pressure: {$centralExternalPressure}" : 'Current central external pressure: ',
                    $emotionalQuestion !== '' ? "Current emotional question: {$emotionalQuestion}" : 'Current emotional question: '
                ),
                $promptBuilder->compactLines(
                    'Preserve the user\'s existing concept. Do not invent a new setup, change the story lane, or replace the idea with a fresh version.',
                    'Fix spelling mistakes, obvious typos, grammar slips, and awkward phrasing only where needed.',
                    'Clarify unclear wording, but stay very close to the existing meaning and scope.',
                    'If a field is already clear, leave it nearly unchanged.',
                    'If a field is empty, return it as an empty string rather than inventing content.',
                    'Keep every field tight and database-safe. Do not expand short metadata into paragraphs.',
                    'title must stay short: 3 to 8 words when present.',
                    'setting must stay one concise line.',
                    'main_character_focus must stay one concise line.',
                    'romance_configuration must stay a short label.',
                    'pov_mode must stay a supported short label, and pov_notes should remain brief.',
                    'dominant_romance_arc, central_external_pressure, and emotional_question should each stay a compact planning line.',
                    'concept_brief may be the longest field, but keep it to one compact paragraph of 2 to 4 sentences max.',
                    'romance_structure_notes may be brief bullet-style planning text or 1 short paragraph only.',
                    'Return planning language only, not scenes or prose.'
                )
            ),
            [
                'title' => 'string',
                'concept_brief' => 'string',
                'setting' => 'string',
                'romance_configuration' => 'string',
                'main_character_focus' => 'string',
                'romance_structure_notes' => 'string',
                'pov_mode' => 'string',
                'pov_notes' => 'string',
                'dominant_romance_arc' => 'string',
                'central_external_pressure' => 'string',
                'emotional_question' => 'string',
            ]
        );
    }
}
