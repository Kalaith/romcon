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
        $existingCast = is_array($input['cast'] ?? null) ? $input['cast'] : [];

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
                    'User cast-member brief (treat as authoritative): ' . $prompt,
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
                    $existingCast !== [] ? 'Existing supporting cast: ' . json_encode($existingCast, JSON_PRETTY_PRINT) : '',
                    $flavorSeeds !== [] ? 'Flavor sources: ' . implode(', ', $flavorSeeds) : ''
                ),
                $promptBuilder->compactLines(
                    'Treat the user cast-member brief as a hard requirement, not a vibe.',
                    'Preserve the prompt\'s requested archetype, role, tone, and relationship function unless it directly conflicts with safety or the schema.',
                    'If the prompt specifies concrete traits, use them. Only invent missing details needed to complete the profile.',
                    'Do not replace a specific prompt idea with a generic romcom stock character.',
                    'Keep the character distinct from the leads and any existing cast.',
                    'Make the character useful for this specific romantic comedy novella, not just romantic comedies in general.',
                    'Let the requested prompt visibly shape the role, summary, connection_to_leads, story_function, and comedic_angle fields.',
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
