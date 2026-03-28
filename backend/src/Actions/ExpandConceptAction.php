<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\RomconPromptBuilder;

final class ExpandConceptAction extends PromptAction
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

        if (
            $title === '' &&
            $conceptBrief === '' &&
            $setting === '' &&
            $mainCharacterFocus === '' &&
            $romanceStructureNotes === '' &&
            $povNotes === '' &&
            $dominantRomanceArc === '' &&
            $centralExternalPressure === '' &&
            $emotionalQuestion === '' &&
            $tropeNotes === []
        ) {
            throw new \InvalidArgumentException('Add at least a brief seed before expanding the concept');
        }

        $promptBuilder = new RomconPromptBuilder();

        return $this->generatePlanningJson(
            'expand_concept',
            $userId,
            $promptBuilder->compactLines(
                $title !== '' ? "Current title seed: {$title}" : 'Current title seed: ',
                $conceptBrief !== '' ? "Current concept brief: {$conceptBrief}" : 'Current concept brief: ',
                $setting !== '' ? "Current setting: {$setting}" : 'Current setting: ',
                $promptBuilder->heatLevelLine($heatLevel),
                "Target words: {$targetWords}",
                $romanceConfiguration !== '' ? "Current romance configuration: {$romanceConfiguration}" : 'Current romance configuration: ',
                $mainCharacterFocus !== '' ? "Current main character focus: {$mainCharacterFocus}" : 'Current main character focus: ',
                $romanceStructureNotes !== '' ? "Current romance structure notes: {$romanceStructureNotes}" : 'Current romance structure notes: ',
                $povMode !== '' ? "Current POV mode: {$povMode}" : 'Current POV mode: ',
                $povNotes !== '' ? "Current POV notes: {$povNotes}" : 'Current POV notes: ',
                $dominantRomanceArc !== '' ? "Current dominant romance arc: {$dominantRomanceArc}" : 'Current dominant romance arc: ',
                $centralExternalPressure !== '' ? "Current central external pressure: {$centralExternalPressure}" : 'Current central external pressure: ',
                $emotionalQuestion !== '' ? "Current emotional question: {$emotionalQuestion}" : 'Current emotional question: ',
                $tropeNotes !== [] ? 'Current trope direction: ' . implode(', ', $tropeNotes) : 'Current trope direction: ',
                $notes !== '' ? "Protected notes: {$notes}" : '',
                $flavorSeeds !== [] ? 'Flavor sources: ' . implode(', ', $flavorSeeds) : ''
            )
        );
    }
}
