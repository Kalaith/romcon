<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\GeminiService;
use App\Services\RomconPromptBuilder;

final class GeneratePairingAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $leadOne = $input['lead_one'] ?? null;
        $leadTwo = $input['lead_two'] ?? null;
        $preferredTrope = trim((string) ($input['preferred_trope'] ?? ''));
        $romanceConfiguration = trim((string) ($input['romance_configuration'] ?? 'm/f'));
        $mainCharacterFocus = trim((string) ($input['main_character_focus'] ?? ''));
        $romanceStructureNotes = trim((string) ($input['romance_structure_notes'] ?? ''));
        $povMode = trim((string) ($input['pov_mode'] ?? 'single_close_third'));
        $povNotes = trim((string) ($input['pov_notes'] ?? ''));
        $dominantRomanceArc = trim((string) ($input['dominant_romance_arc'] ?? ''));
        $centralExternalPressure = trim((string) ($input['central_external_pressure'] ?? ''));
        $emotionalQuestion = trim((string) ($input['emotional_question'] ?? ''));
        $flavorSeeds = array_values(array_filter(array_map('strval', $input['flavor_seeds'] ?? [])));

        if (!is_array($leadOne) || !is_array($leadTwo)) {
            throw new \InvalidArgumentException('lead_one and lead_two are required');
        }

        $service = new GeminiService($userId);
        $promptBuilder = new RomconPromptBuilder();
        return $service->generateJson(
            $promptBuilder->buildPlanningPrompt(
                'Layer 2: Structured Outline',
                'Evaluate the core pairing',
                $promptBuilder->compactLines(
                    "Core romance configuration: {$romanceConfiguration}",
                    $mainCharacterFocus !== '' ? "Main character focus: {$mainCharacterFocus}" : '',
                    $romanceStructureNotes !== '' ? "Romance structure notes: {$romanceStructureNotes}" : '',
                    "POV mode: {$povMode}",
                    $povNotes !== '' ? "POV notes: {$povNotes}" : '',
                    $dominantRomanceArc !== '' ? "Desired dominant romance arc: {$dominantRomanceArc}" : '',
                    $centralExternalPressure !== '' ? "Desired central external pressure: {$centralExternalPressure}" : '',
                    $emotionalQuestion !== '' ? "Desired emotional question: {$emotionalQuestion}" : '',
                    'Lead one: ' . json_encode($leadOne, JSON_PRETTY_PRINT),
                    'Lead two: ' . json_encode($leadTwo, JSON_PRETTY_PRINT),
                    $preferredTrope !== '' ? "Preferred trope: {$preferredTrope}" : '',
                    $flavorSeeds !== [] ? 'Flavor sources: ' . implode(', ', $flavorSeeds) : ''
                ),
                $promptBuilder->compactLines(
                    'Focus on friction, fit, comedic engines, emotional lessons, and trope suitability.',
                    'Treat this as the central romance even if the wider story includes other contenders.',
                    'Identify the dominant romance lane, the central emotional question, and the external pressure most likely to test this pairing.',
                    'Assume default POV discipline is single close third person unless the wider plan later overrides it.',
                    'Return planning analysis, not scenes or prose.'
                )
            ),
            [
                'pairing_hook' => 'string',
                'why_they_clash' => ['string'],
                'why_they_fit' => ['string'],
                'scene_engines' => ['string'],
                'best_trope' => 'string',
                'trope_table' => [
                    ['trope' => 'string', 'score' => 1, 'reason' => 'string']
                ],
                'emotional_lessons' => [
                    'lead_one' => 'string',
                    'lead_two' => 'string'
                ],
                'dominant_story_lane' => [
                    'main_romance_arc' => 'string',
                    'central_external_pressure' => 'string',
                    'emotional_question' => 'string'
                ],
                'pov_rule' => 'string',
                'relationship_escalation_path' => ['string'],
                'risk_notes' => ['string']
            ]
        );
    }
}
