<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\RomconPromptBuilder;

final class GenerateCharacterPackAction extends PromptAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $brief = $this->string($input, 'brief');
        $setting = $this->string($input, 'setting', 'modern contemporary');
        $heatLevel = $this->string($input, 'heat_level', 'sweet');
        $romanceConfiguration = $this->string($input, 'romance_configuration', 'm/f');
        $mainCharacterFocus = $this->string($input, 'main_character_focus');
        $romanceStructureNotes = $this->string($input, 'romance_structure_notes');
        $povMode = $this->string($input, 'pov_mode', 'single_close_third');
        $povNotes = $this->string($input, 'pov_notes');
        $dominantRomanceArc = $this->string($input, 'dominant_romance_arc');
        $centralExternalPressure = $this->string($input, 'central_external_pressure');
        $emotionalQuestion = $this->string($input, 'emotional_question');
        $flavorSeeds = $this->stringList($input, 'flavor_seeds');

        if ($brief === '') {
            throw new \InvalidArgumentException('brief is required');
        }

        $promptBuilder = new RomconPromptBuilder();

        return $this->generatePlanningJson(
            'generate_character_pack',
            $userId,
            $promptBuilder->compactLines(
                "Brief: {$brief}",
                "Setting: {$setting}",
                $promptBuilder->heatLevelLine($heatLevel),
                "Core romance configuration: {$romanceConfiguration}",
                $mainCharacterFocus !== '' ? "Main character focus: {$mainCharacterFocus}" : '',
                $romanceStructureNotes !== '' ? "Romance structure notes: {$romanceStructureNotes}" : '',
                "POV mode: {$povMode}",
                $povNotes !== '' ? "POV notes: {$povNotes}" : '',
                $dominantRomanceArc !== '' ? "Desired dominant romance arc: {$dominantRomanceArc}" : '',
                $centralExternalPressure !== '' ? "Desired central external pressure: {$centralExternalPressure}" : '',
                $emotionalQuestion !== '' ? "Desired emotional question: {$emotionalQuestion}" : '',
                $flavorSeeds !== [] ? 'Flavor sources: ' . implode(', ', $flavorSeeds) : ''
            )
        );
    }
}
