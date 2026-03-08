<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\GeminiService;
use App\Services\RomconPromptBuilder;

final class GenerateChapterDetailsAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $leadOne = $input['lead_one'] ?? null;
        $leadTwo = $input['lead_two'] ?? null;
        $pairing = $input['pairing'] ?? null;
        $premise = $input['premise'] ?? null;
        $cast = is_array($input['cast'] ?? null) ? $input['cast'] : [];
        $targetWords = (int) ($input['target_words'] ?? 30000);
        $romanceConfiguration = trim((string) ($input['romance_configuration'] ?? 'm/f'));
        $mainCharacterFocus = trim((string) ($input['main_character_focus'] ?? ''));
        $romanceStructureNotes = trim((string) ($input['romance_structure_notes'] ?? ''));
        $povMode = trim((string) ($input['pov_mode'] ?? 'single_close_third'));
        $povNotes = trim((string) ($input['pov_notes'] ?? ''));
        $dominantRomanceArc = trim((string) ($input['dominant_romance_arc'] ?? ''));
        $centralExternalPressure = trim((string) ($input['central_external_pressure'] ?? ''));
        $emotionalQuestion = trim((string) ($input['emotional_question'] ?? ''));
        $flavorSeeds = array_values(array_filter(array_map('strval', $input['flavor_seeds'] ?? [])));

        if (!is_array($leadOne) || !is_array($leadTwo) || !is_array($premise)) {
            throw new \InvalidArgumentException('lead_one, lead_two, and premise are required');
        }

        $service = new GeminiService($userId);
        $promptBuilder = new RomconPromptBuilder();
        return $service->generateJson(
            $promptBuilder->buildPlanningPrompt(
                'Layer 3: Chapter Planning',
                'Generate detailed chapter architecture',
                $promptBuilder->compactLines(
                    "Target words: {$targetWords}",
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
                    'Premise: ' . json_encode($premise, JSON_PRETTY_PRINT),
                    $cast !== [] ? 'Current supporting cast: ' . json_encode($cast, JSON_PRETTY_PRINT) : '',
                    $flavorSeeds !== [] ? 'Flavor sources: ' . implode(', ', $flavorSeeds) : ''
                ),
                $promptBuilder->compactLines(
                    'Generate a detailed chapter-by-chapter romantic comedy novella plan.',
                    'Return chapter details that deepen the existing beats and maintain novella pacing.',
                    'Keep the output as chapter architecture and scene-planning bones, not draftable prose.',
                    'Each chapter entry should be concrete enough that a writer or downstream AI can draft from it later.',
                    'Carry one dominant story lane through the chapter plan: one main romance arc, one central external pressure, and one emotional question.',
                    'State the POV owner for each chapter explicitly.',
                    'Each chapter must obey the scene contract: goal, friction or interruption, meaningful change, emotional beat, and carry-forward thread.',
                    'Escalate the relationship in earned stages rather than looping or jumping ahead.'
                )
            ),
            [
                'chapter_details' => [[
                    'chapter_number' => 'number',
                    'chapter_title' => 'string',
                    'pov_owner' => 'string',
                    'beat_anchor' => 'string',
                    'chapter_goal' => 'string',
                    'scene_goal' => 'string',
                    'conflict' => 'string',
                    'reveal' => 'string',
                    'secret_revealed' => 'string',
                    'who_has_power' => 'string',
                    'what_changes_by_the_end' => 'string',
                    'emotional_turn' => 'string',
                    'emotional_note_closes_chapter' => 'string',
                    'cliffhanger_or_hook' => 'string',
                    'carry_forward_thread' => 'string',
                    'approximate_word_target' => 'number',
                ]],
                'dominant_story_lane' => [
                    'main_romance_arc' => 'string',
                    'central_external_pressure' => 'string',
                    'emotional_question' => 'string'
                ],
                'pov_rule' => 'string',
                'relationship_escalation_path' => ['string'],
            ]
        );
    }
}
