<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\GeminiService;
use App\Services\RomconPromptBuilder;

final class GenerateCastAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $leadOne = $input['lead_one'] ?? null;
        $leadTwo = $input['lead_two'] ?? null;
        $pairing = $input['pairing'] ?? null;
        $premise = $input['premise'] ?? null;
        $setting = trim((string) ($input['setting'] ?? 'modern contemporary'));
        $heatLevel = trim((string) ($input['heat_level'] ?? 'sweet'));
        $romanceConfiguration = trim((string) ($input['romance_configuration'] ?? 'm/f'));
        $mainCharacterFocus = trim((string) ($input['main_character_focus'] ?? ''));
        $romanceStructureNotes = trim((string) ($input['romance_structure_notes'] ?? ''));
        $povMode = trim((string) ($input['pov_mode'] ?? 'single_close_third'));
        $dominantRomanceArc = trim((string) ($input['dominant_romance_arc'] ?? ''));
        $centralExternalPressure = trim((string) ($input['central_external_pressure'] ?? ''));
        $emotionalQuestion = trim((string) ($input['emotional_question'] ?? ''));
        $existingCast = is_array($input['cast'] ?? null) ? $input['cast'] : [];
        $flavorSeeds = array_values(array_filter(array_map('strval', $input['flavor_seeds'] ?? [])));

        if (!is_array($leadOne) || !is_array($leadTwo)) {
            throw new \InvalidArgumentException('lead_one and lead_two are required');
        }

        $service = new GeminiService($userId);
        $promptBuilder = new RomconPromptBuilder();
        return $service->generateJson(
            $promptBuilder->buildPlanningPrompt(
                'Layer 2: Structured Outline',
                'Generate supporting cast architecture',
                $promptBuilder->compactLines(
                    "Setting: {$setting}",
                    $promptBuilder->heatLevelLine($heatLevel),
                    "Core romance configuration: {$romanceConfiguration}",
                    $mainCharacterFocus !== '' ? "Main character focus: {$mainCharacterFocus}" : '',
                    $romanceStructureNotes !== '' ? "Romance structure notes: {$romanceStructureNotes}" : '',
                    "POV mode: {$povMode}",
                    $dominantRomanceArc !== '' ? "Desired dominant romance arc: {$dominantRomanceArc}" : '',
                    $centralExternalPressure !== '' ? "Desired central external pressure: {$centralExternalPressure}" : '',
                    $emotionalQuestion !== '' ? "Desired emotional question: {$emotionalQuestion}" : '',
                    'Lead one: ' . json_encode($leadOne, JSON_PRETTY_PRINT),
                    'Lead two: ' . json_encode($leadTwo, JSON_PRETTY_PRINT),
                    'Pairing analysis: ' . json_encode($pairing, JSON_PRETTY_PRINT),
                    'Premise: ' . json_encode($premise, JSON_PRETTY_PRINT),
                    'Existing supporting cast: ' . json_encode($existingCast, JSON_PRETTY_PRINT),
                    $flavorSeeds !== [] ? 'Flavor sources: ' . implode(', ', $flavorSeeds) : ''
                ),
                $promptBuilder->compactLines(
                    'Return 4 to 8 supporting characters.',
                    'Make them useful for comedy pressure, romantic interference, emotional honesty, and novella pacing.',
                    'Do not repeat the two leads.',
                    'Some characters can be lightly sketched, but at least two should be well defined.',
                    'Return character planning data, not mini-scenes or narrative prose.'
                )
            ),
            [
                'cast' => [[
                    'name' => 'string',
                    'role' => 'string',
                    'summary' => 'string',
                    'connection_to_leads' => 'string',
                    'story_function' => 'string',
                    'core_desire' => 'string',
                    'core_fear' => 'string',
                    'secret_pressure' => 'string',
                    'comedic_angle' => 'string',
                    'include_in_story' => true,
                    'is_main' => false,
                ]],
            ]
        );
    }
}
