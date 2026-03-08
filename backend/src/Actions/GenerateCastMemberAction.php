<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\GeminiService;
use App\Services\RomconPromptBuilder;

final class GenerateCastMemberAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $prompt = trim((string) ($input['prompt'] ?? ''));
        $leadOne = $input['lead_one'] ?? null;
        $leadTwo = $input['lead_two'] ?? null;
        $pairing = $input['pairing'] ?? null;
        $premise = $input['premise'] ?? null;
        $setting = trim((string) ($input['setting'] ?? 'modern contemporary'));
        $romanceConfiguration = trim((string) ($input['romance_configuration'] ?? 'm/f'));
        $mainCharacterFocus = trim((string) ($input['main_character_focus'] ?? ''));
        $romanceStructureNotes = trim((string) ($input['romance_structure_notes'] ?? ''));
        $povMode = trim((string) ($input['pov_mode'] ?? 'single_close_third'));
        $dominantRomanceArc = trim((string) ($input['dominant_romance_arc'] ?? ''));
        $centralExternalPressure = trim((string) ($input['central_external_pressure'] ?? ''));
        $emotionalQuestion = trim((string) ($input['emotional_question'] ?? ''));
        $flavorSeeds = array_values(array_filter(array_map('strval', $input['flavor_seeds'] ?? [])));

        if ($prompt === '') {
            throw new \InvalidArgumentException('prompt is required');
        }

        $service = new GeminiService($userId);
        $promptBuilder = new RomconPromptBuilder();
        return $service->generateJson(
            $promptBuilder->buildPlanningPrompt(
                'Layer 2: Structured Outline',
                'Generate one supporting character',
                $promptBuilder->compactLines(
                    "Prompt: {$prompt}",
                    "Setting: {$setting}",
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
                    $flavorSeeds !== [] ? 'Flavor sources: ' . implode(', ', $flavorSeeds) : ''
                ),
                $promptBuilder->compactLines(
                    'Make the character useful for a romantic comedy novella.',
                    'Keep them distinct from the leads.',
                    'Return one character only.',
                    'Return planning detail only, not prose.'
                )
            ),
            [
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
            ]
        );
    }
}
