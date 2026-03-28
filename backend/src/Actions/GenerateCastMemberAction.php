<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\RomconPromptBuilder;

final class GenerateCastMemberAction extends PromptAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $prompt = $this->string($input, 'prompt');
        $leadOne = $input['lead_one'] ?? null;
        $leadTwo = $input['lead_two'] ?? null;
        $pairing = $input['pairing'] ?? null;
        $premise = $input['premise'] ?? null;
        $setting = $this->string($input, 'setting', 'modern contemporary');
        $romanceConfiguration = $this->string($input, 'romance_configuration', 'm/f');
        $mainCharacterFocus = $this->string($input, 'main_character_focus');
        $romanceStructureNotes = $this->string($input, 'romance_structure_notes');
        $povMode = $this->string($input, 'pov_mode', 'single_close_third');
        $dominantRomanceArc = $this->string($input, 'dominant_romance_arc');
        $centralExternalPressure = $this->string($input, 'central_external_pressure');
        $emotionalQuestion = $this->string($input, 'emotional_question');
        $flavorSeeds = $this->stringList($input, 'flavor_seeds');
        $existingCast = $this->arrayValue($input, 'cast');

        if ($prompt === '') {
            throw new \InvalidArgumentException('prompt is required');
        }

        $promptBuilder = new RomconPromptBuilder();

        return $this->generatePlanningJson(
            'generate_cast_member',
            $userId,
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
            )
        );
    }
}
