<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\GeminiService;
use App\Services\RomconPromptBuilder;

final class GenerateConceptAction
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

        $service = new GeminiService($userId);
        $promptBuilder = new RomconPromptBuilder();

        return $service->generateJson(
            $promptBuilder->buildPlanningPrompt(
                'Layer 0: Concept Framing',
                'Generate the initial story concept board',
                $promptBuilder->compactLines(
                    $title !== '' ? "Current title seed: {$title}" : '',
                    $conceptBrief !== '' ? "Current concept seed: {$conceptBrief}" : '',
                    $setting !== '' ? "Current setting seed: {$setting}" : '',
                    $promptBuilder->heatLevelLine($heatLevel),
                    "Target words: {$targetWords}",
                    "Current romance configuration: {$romanceConfiguration}",
                    $mainCharacterFocus !== '' ? "Current main character focus: {$mainCharacterFocus}" : '',
                    $romanceStructureNotes !== '' ? "Current romance structure notes: {$romanceStructureNotes}" : '',
                    "Current POV mode: {$povMode}",
                    $povNotes !== '' ? "Current POV notes: {$povNotes}" : '',
                    $dominantRomanceArc !== '' ? "Current dominant romance arc: {$dominantRomanceArc}" : '',
                    $centralExternalPressure !== '' ? "Current central external pressure: {$centralExternalPressure}" : '',
                    $emotionalQuestion !== '' ? "Current emotional question: {$emotionalQuestion}" : '',
                    $tropeNotes !== [] ? 'Requested trope notes: ' . implode(', ', $tropeNotes) : '',
                    $notes !== '' ? "Protected notes or idea fragments: {$notes}" : '',
                    $flavorSeeds !== [] ? 'Flavor sources: ' . implode(', ', $flavorSeeds) : ''
                ),
                $promptBuilder->compactLines(
                    'Generate the initial romantic comedy novella concept board for this project.',
                    'This is the pre-leads planning pass, so return the core story setup rather than character packs.',
                    'Invent or refine the starting concept using any seeds provided, but keep it commercially legible and easy to build on.',
                    'Keep every field tight and database-safe. Do not write paragraph answers into short metadata fields.',
                    'title must be short: 3 to 8 words.',
                    'setting must be one concise line naming place, era, and vibe, not a paragraph.',
                    'main_character_focus must be one concise line.',
                    'romance_configuration must be a short label such as m/f, f/f, m/m, or ensemble.',
                    'pov_mode must be one of the supported short labels, and pov_notes should be brief.',
                    'dominant_romance_arc, central_external_pressure, and emotional_question should each be a compact planning line, not an explanation dump.',
                    'concept_brief may be the longest field, but keep it to one compact paragraph of 2 to 4 sentences.',
                    'romance_structure_notes may be brief bullet-style planning text or 1 short paragraph only.',
                    'Return one strong project title, one practical concept brief, a clear romance configuration, one main character focus, one dominant romance arc, one central external pressure, and one emotional question.',
                    'Choose a setting and POV structure that support the concept cleanly.',
                    'Keep romance_structure_notes useful for later generators, especially if rivals, triangle pressure, or unusual romantic framing matters.',
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
