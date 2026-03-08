<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\GeminiService;
use App\Services\RomconPromptBuilder;

final class GenerateCharacterPackAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $brief = trim((string) ($input['brief'] ?? ''));
        $setting = trim((string) ($input['setting'] ?? 'modern contemporary'));
        $heatLevel = trim((string) ($input['heat_level'] ?? 'sweet'));
        $romanceConfiguration = trim((string) ($input['romance_configuration'] ?? 'm/f'));
        $mainCharacterFocus = trim((string) ($input['main_character_focus'] ?? ''));
        $romanceStructureNotes = trim((string) ($input['romance_structure_notes'] ?? ''));
        $povMode = trim((string) ($input['pov_mode'] ?? 'single_close_third'));
        $povNotes = trim((string) ($input['pov_notes'] ?? ''));
        $dominantRomanceArc = trim((string) ($input['dominant_romance_arc'] ?? ''));
        $centralExternalPressure = trim((string) ($input['central_external_pressure'] ?? ''));
        $emotionalQuestion = trim((string) ($input['emotional_question'] ?? ''));
        $flavorSeeds = array_values(array_filter(array_map('strval', $input['flavor_seeds'] ?? [])));

        if ($brief === '') {
            throw new \InvalidArgumentException('brief is required');
        }

        $service = new GeminiService($userId);
        $promptBuilder = new RomconPromptBuilder();
        return $service->generateJson(
            $promptBuilder->buildPlanningPrompt(
                'Layer 1: Concept Architecture',
                'Generate lead character packs',
                $promptBuilder->compactLines(
                    "Brief: {$brief}",
                    "Setting: {$setting}",
                    "Heat level: {$heatLevel}",
                    "Core romance configuration: {$romanceConfiguration}",
                    $mainCharacterFocus !== '' ? "Main character focus: {$mainCharacterFocus}" : '',
                    $romanceStructureNotes !== '' ? "Romance structure notes: {$romanceStructureNotes}" : '',
                    "POV mode: {$povMode}",
                    $povNotes !== '' ? "POV notes: {$povNotes}" : '',
                    $dominantRomanceArc !== '' ? "Desired dominant romance arc: {$dominantRomanceArc}" : '',
                    $centralExternalPressure !== '' ? "Desired central external pressure: {$centralExternalPressure}" : '',
                    $emotionalQuestion !== '' ? "Desired emotional question: {$emotionalQuestion}" : '',
                    $flavorSeeds !== [] ? 'Flavor sources: ' . implode(', ', $flavorSeeds) : ''
                ),
                $promptBuilder->compactLines(
                    'Generate two sharply differentiated romantic comedy lead character packs for a 30,000-word novella.',
                    'Make them chemistry-forward and useful for later premise and chapter planning.',
                    'Respect the requested romance configuration.',
                    'If a main character focus is given, lead_one should usually be that protagonist.',
                    'If the romance notes describe multiple contenders, lead_two should be the main intended romance and extra contenders should be left for supporting cast generation.',
                    'Return compact planning detail rather than storytelling prose.'
                )
            ),
            [
                'lead_one' => [
                    'name' => 'string',
                    'age' => 'string',
                    'occupation' => 'string',
                    'personality_summary' => 'string',
                    'core_desire' => 'string',
                    'core_fear' => 'string',
                    'public_competence' => 'string',
                    'private_mess' => 'string',
                    'everyday_strength' => 'string',
                    'comedic_weakness' => 'string',
                    'romantic_blind_spot' => 'string',
                    'secret_pressure' => 'string',
                    'social_circle_role' => 'string',
                    'dialogue_rhythm' => 'string',
                    'sample_dialogue' => ['string'],
                    'thinks_they_want' => 'string',
                    'actually_needs' => 'string'
                ],
                'lead_two' => 'same shape as lead_one'
            ]
        );
    }
}
