<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\GeminiService;
use App\Services\RomconPromptBuilder;

final class GeneratePremiseAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $leadOne = $input['lead_one'] ?? null;
        $leadTwo = $input['lead_two'] ?? null;
        $pairing = $input['pairing'] ?? null;
        $targetWords = (int) ($input['target_words'] ?? 45000);
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

        if (!is_array($leadOne) || !is_array($leadTwo)) {
            throw new \InvalidArgumentException('lead_one and lead_two are required');
        }

        $service = new GeminiService($userId);
        $promptBuilder = new RomconPromptBuilder();
        return $service->generateJson(
            $promptBuilder->buildPlanningPrompt(
                'Layer 2: Structured Outline',
                'Generate premise architecture',
                $promptBuilder->compactLines(
                    "Target words: {$targetWords}",
                    $promptBuilder->heatLevelLine($heatLevel),
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
                    'Pairing analysis: ' . json_encode($pairing, JSON_PRETTY_PRINT),
                    $flavorSeeds !== [] ? 'Flavor sources: ' . implode(', ', $flavorSeeds) : ''
                ),
                $promptBuilder->compactLines(
                    'Generate one strong romantic comedy novella premise.',
                    'Return a practical, pitchable setup with chapter-shape beats suitable for a planning workflow.',
                    'Shape the story for exactly 15 chapters.',
                    'Return exactly 15 chapter beats so the downstream chapter plan maps one beat to one chapter.',
                    'Assume a nominal target of roughly 3,000 words per chapter even if actual drafted chapters may land closer to 2,000 words.',
                    'This means the finished short novel will likely land in roughly the 30,000 to 45,000 word range.',
                    'If the story includes multiple suitors or rivals, make that explicit while preserving one clear main romance.',
                    'Lock the premise to one dominant story lane: one main romance arc, one central external pressure, and one emotional question.',
                    'State the POV rule explicitly rather than leaving it implied.',
                    'Make chapter beats escalate the relationship in earned stages rather than jumping ahead.',
                    'Return structural bones only, not prose.'
                )
            ),
            [
                'logline' => 'string',
                'premise' => 'string',
                'dominant_story_lane' => [
                    'main_romance_arc' => 'string',
                    'central_external_pressure' => 'string',
                    'emotional_question' => 'string'
                ],
                'pov_rule' => 'string',
                'forced_proximity_device' => 'string',
                'primary_obstacle' => 'string',
                'midpoint_shift' => 'string',
                'finale_payoff' => 'string',
                'chapter_beats' => ['string'],
                'relationship_escalation_path' => ['string'],
                'scene_contract' => [
                    'required_elements' => ['string'],
                    'chapter_change_rule' => 'string'
                ],
                'supporting_cast_roles' => ['string'],
                'recurring_comedic_motif' => 'string'
            ]
        );
    }
}
