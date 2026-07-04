<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\RomconPromptBuilder;

final class GenerateBeatAuditAction extends PromptAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $leadOne = $input['lead_one'] ?? null;
        $leadTwo = $input['lead_two'] ?? null;
        $pairing = $input['pairing'] ?? null;
        $premise = $input['premise'] ?? null;
        $chapterDetails = $this->arrayValue($input, 'chapter_details');
        $heatLevel = $this->string($input, 'heat_level', 'sweet');
        $romanceConfiguration = $this->string($input, 'romance_configuration', 'm/f');

        if (!is_array($premise)) {
            throw new \InvalidArgumentException('premise is required');
        }

        $promptBuilder = new RomconPromptBuilder();

        $result = $this->generatePlanningJson(
            'beat_audit',
            $userId,
            $promptBuilder->compactLines(
                $promptBuilder->heatLevelLine($heatLevel),
                "Core romance configuration: {$romanceConfiguration}",
                is_array($leadOne) ? 'Lead one: ' . json_encode($leadOne, JSON_PRETTY_PRINT) : '',
                is_array($leadTwo) ? 'Lead two: ' . json_encode($leadTwo, JSON_PRETTY_PRINT) : '',
                is_array($pairing) ? 'Pairing analysis: ' . json_encode($pairing, JSON_PRETTY_PRINT) : '',
                'Premise: ' . json_encode($premise, JSON_PRETTY_PRINT),
                $chapterDetails !== []
                    ? 'Chapter plan: ' . json_encode($chapterDetails, JSON_PRETTY_PRINT)
                    : 'Chapter plan: not generated yet. Audit the premise-level beats only.'
            )
        );

        $result['verdict'] = in_array($result['verdict'] ?? '', ['pass', 'needs_attention'], true)
            ? $result['verdict']
            : (empty($result['flags']) ? 'pass' : 'needs_attention');
        $result['overall_note'] = trim((string) ($result['overall_note'] ?? ''));
        $result['flags'] = array_values(array_filter(
            is_array($result['flags'] ?? null) ? $result['flags'] : [],
            'is_array'
        ));

        return $result;
    }
}
