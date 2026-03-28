<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\RomconPromptBuilder;

final class GenerateConceptAction extends PromptAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $title = $this->string($input, 'title');
        if (strtolower($title) === 'untitled romcom') {
            $title = '';
        }
        $conceptBrief = $this->string($input, 'concept_brief');
        $setting = $this->string($input, 'setting');
        $heatLevel = $this->string($input, 'heat_level', 'sweet');
        $targetWords = $this->int($input, 'target_words', 45000);
        $romanceConfiguration = $this->string($input, 'romance_configuration', 'm/f');
        $mainCharacterFocus = $this->string($input, 'main_character_focus');
        $romanceStructureNotes = $this->string($input, 'romance_structure_notes');
        $povMode = $this->string($input, 'pov_mode', 'single_close_third');
        $povNotes = $this->string($input, 'pov_notes');
        $dominantRomanceArc = $this->string($input, 'dominant_romance_arc');
        $centralExternalPressure = $this->string($input, 'central_external_pressure');
        $emotionalQuestion = $this->string($input, 'emotional_question');
        $tropeNotes = $this->stringList($input, 'trope_notes');
        $notes = $this->string($input, 'notes');
        $flavorSeeds = $this->stringList($input, 'flavor_seeds');
        $promptBuilder = new RomconPromptBuilder();

        return $this->generatePlanningJson(
            'generate_concept',
            $userId,
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
            )
        );
    }
}
