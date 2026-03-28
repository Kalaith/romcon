<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\RomconPromptBuilder;

final class GenerateCastAction extends PromptAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $leadOne = $input['lead_one'] ?? null;
        $leadTwo = $input['lead_two'] ?? null;
        $pairing = $input['pairing'] ?? null;
        $premise = $input['premise'] ?? null;
        $setting = $this->string($input, 'setting', 'modern contemporary');
        $heatLevel = $this->string($input, 'heat_level', 'sweet');
        $romanceConfiguration = $this->string($input, 'romance_configuration', 'm/f');
        $mainCharacterFocus = $this->string($input, 'main_character_focus');
        $romanceStructureNotes = $this->string($input, 'romance_structure_notes');
        $povMode = $this->string($input, 'pov_mode', 'single_close_third');
        $dominantRomanceArc = $this->string($input, 'dominant_romance_arc');
        $centralExternalPressure = $this->string($input, 'central_external_pressure');
        $emotionalQuestion = $this->string($input, 'emotional_question');
        $existingCast = $this->arrayValue($input, 'cast');
        $flavorSeeds = $this->stringList($input, 'flavor_seeds');

        if (!is_array($leadOne) || !is_array($leadTwo)) {
            throw new \InvalidArgumentException('lead_one and lead_two are required');
        }

        $promptBuilder = new RomconPromptBuilder();

        return $this->generatePlanningJson(
            'generate_cast',
            $userId,
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
            )
        );
    }
}
