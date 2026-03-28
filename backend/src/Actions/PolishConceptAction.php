<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\RomconPromptBuilder;

final class PolishConceptAction extends PromptAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $title = $this->string($input, 'title');
        if (strtolower($title) === 'untitled romcom') {
            $title = '';
        }

        $conceptBrief = $this->string($input, 'concept_brief');
        $setting = $this->string($input, 'setting');
        $romanceConfiguration = $this->string($input, 'romance_configuration');
        $mainCharacterFocus = $this->string($input, 'main_character_focus');
        $romanceStructureNotes = $this->string($input, 'romance_structure_notes');
        $povMode = $this->string($input, 'pov_mode');
        $povNotes = $this->string($input, 'pov_notes');
        $dominantRomanceArc = $this->string($input, 'dominant_romance_arc');
        $centralExternalPressure = $this->string($input, 'central_external_pressure');
        $emotionalQuestion = $this->string($input, 'emotional_question');

        if (
            $title === '' &&
            $conceptBrief === '' &&
            $setting === '' &&
            $mainCharacterFocus === '' &&
            $romanceStructureNotes === '' &&
            $povNotes === '' &&
            $dominantRomanceArc === '' &&
            $centralExternalPressure === '' &&
            $emotionalQuestion === ''
        ) {
            throw new \InvalidArgumentException('At least one concept field is required to polish');
        }

        $promptBuilder = new RomconPromptBuilder();

        return $this->generatePlanningJson(
            'polish_concept',
            $userId,
            $promptBuilder->compactLines(
                $title !== '' ? "Current title: {$title}" : 'Current title: ',
                $conceptBrief !== '' ? "Current concept brief: {$conceptBrief}" : 'Current concept brief: ',
                $setting !== '' ? "Current setting: {$setting}" : 'Current setting: ',
                $romanceConfiguration !== '' ? "Current romance configuration: {$romanceConfiguration}" : 'Current romance configuration: ',
                $mainCharacterFocus !== '' ? "Current main character focus: {$mainCharacterFocus}" : 'Current main character focus: ',
                $romanceStructureNotes !== '' ? "Current romance structure notes: {$romanceStructureNotes}" : 'Current romance structure notes: ',
                $povMode !== '' ? "Current POV mode: {$povMode}" : 'Current POV mode: ',
                $povNotes !== '' ? "Current POV notes: {$povNotes}" : 'Current POV notes: ',
                $dominantRomanceArc !== '' ? "Current dominant romance arc: {$dominantRomanceArc}" : 'Current dominant romance arc: ',
                $centralExternalPressure !== '' ? "Current central external pressure: {$centralExternalPressure}" : 'Current central external pressure: ',
                $emotionalQuestion !== '' ? "Current emotional question: {$emotionalQuestion}" : 'Current emotional question: '
            )
        );
    }
}
