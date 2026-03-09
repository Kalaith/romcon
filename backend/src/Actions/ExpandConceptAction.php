<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\GeminiService;
use App\Services\RomconPromptBuilder;

final class ExpandConceptAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $title = trim((string) ($input['title'] ?? ''));
        if (strtolower($title) === 'untitled romcom') {
            $title = '';
        }

        $conceptBrief = trim((string) ($input['concept_brief'] ?? ''));
        $setting = trim((string) ($input['setting'] ?? ''));
        $heatLevel = trim((string) ($input['heat_level'] ?? 'sweet'));
        $targetWords = (int) ($input['target_words'] ?? 45000);
        $romanceConfiguration = trim((string) ($input['romance_configuration'] ?? 'm/f'));
        $mainCharacterFocus = trim((string) ($input['main_character_focus'] ?? ''));
        $romanceStructureNotes = trim((string) ($input['romance_structure_notes'] ?? ''));
        $povMode = trim((string) ($input['pov_mode'] ?? 'single_close_third'));
        $povNotes = trim((string) ($input['pov_notes'] ?? ''));
        $dominantRomanceArc = trim((string) ($input['dominant_romance_arc'] ?? ''));
        $centralExternalPressure = trim((string) ($input['central_external_pressure'] ?? ''));
        $emotionalQuestion = trim((string) ($input['emotional_question'] ?? ''));
        $tropeNotes = array_values(array_filter(array_map('strval', $input['trope_notes'] ?? [])));
        $notes = trim((string) ($input['notes'] ?? ''));
        $flavorSeeds = array_values(array_filter(array_map('strval', $input['flavor_seeds'] ?? [])));

        if (
            $title === '' &&
            $conceptBrief === '' &&
            $setting === '' &&
            $mainCharacterFocus === '' &&
            $romanceStructureNotes === '' &&
            $povNotes === '' &&
            $dominantRomanceArc === '' &&
            $centralExternalPressure === '' &&
            $emotionalQuestion === '' &&
            $tropeNotes === []
        ) {
            throw new \InvalidArgumentException('Add at least a brief seed before expanding the concept');
        }

        $service = new GeminiService($userId);
        $promptBuilder = new RomconPromptBuilder();

        return $service->generateJson(
            $promptBuilder->buildPlanningPrompt(
                'Layer 0: Concept Expansion',
                'Expand the current concept seeds without replacing the project',
                $promptBuilder->compactLines(
                    $title !== '' ? "Current title seed: {$title}" : 'Current title seed: ',
                    $conceptBrief !== '' ? "Current concept brief: {$conceptBrief}" : 'Current concept brief: ',
                    $setting !== '' ? "Current setting: {$setting}" : 'Current setting: ',
                    $promptBuilder->heatLevelLine($heatLevel),
                    "Target words: {$targetWords}",
                    $romanceConfiguration !== '' ? "Current romance configuration: {$romanceConfiguration}" : 'Current romance configuration: ',
                    $mainCharacterFocus !== '' ? "Current main character focus: {$mainCharacterFocus}" : 'Current main character focus: ',
                    $romanceStructureNotes !== '' ? "Current romance structure notes: {$romanceStructureNotes}" : 'Current romance structure notes: ',
                    $povMode !== '' ? "Current POV mode: {$povMode}" : 'Current POV mode: ',
                    $povNotes !== '' ? "Current POV notes: {$povNotes}" : 'Current POV notes: ',
                    $dominantRomanceArc !== '' ? "Current dominant romance arc: {$dominantRomanceArc}" : 'Current dominant romance arc: ',
                    $centralExternalPressure !== '' ? "Current central external pressure: {$centralExternalPressure}" : 'Current central external pressure: ',
                    $emotionalQuestion !== '' ? "Current emotional question: {$emotionalQuestion}" : 'Current emotional question: ',
                    $tropeNotes !== [] ? 'Current trope direction: ' . implode(', ', $tropeNotes) : 'Current trope direction: ',
                    $notes !== '' ? "Protected notes: {$notes}" : '',
                    $flavorSeeds !== [] ? 'Flavor sources: ' . implode(', ', $flavorSeeds) : ''
                ),
                $promptBuilder->compactLines(
                    'Expand and strengthen the existing concept board using what is already here.',
                    'Do not discard the user\'s current idea. Keep the same core premise, tone lane, and romantic direction unless a field is empty and needs support.',
                    'Fill gaps, tighten weak fields, and add specificity where the current concept is thin.',
                    'Prefer refinement and extension over replacement. If a field is already strong, keep it close to the original.',
                    'Keep every field tight and database-safe. Do not write paragraph answers into short metadata fields.',
                    'title must stay short: 3 to 8 words.',
                    'setting must stay one concise line naming place, era, and vibe.',
                    'main_character_focus must stay one concise line.',
                    'romance_configuration must stay a short label.',
                    'pov_mode must stay a supported short label, and pov_notes should remain brief.',
                    'dominant_romance_arc, central_external_pressure, and emotional_question should each stay a compact planning line.',
                    'concept_brief may be the longest field, but keep it to one compact paragraph of 2 to 4 sentences.',
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
