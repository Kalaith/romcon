<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\GeminiService;
use App\Services\RomconPromptBuilder;
use App\Services\ShortScriptNormalizer;

final class GenerateShortScriptAction extends PromptAction
{
    public function execute(array $input, ?string $userId = null): array
    {
        $brief = $this->string($input, 'brief');
        $setting = $this->string($input, 'setting');
        $trope = $this->string($input, 'trope');
        $extraDirection = $this->string($input, 'extra_direction');
        $heatLevel = $this->string($input, 'heat_level', 'sweet');
        $romanceConfiguration = $this->string($input, 'romance_configuration', 'm/f');

        if ($brief === '' && $trope === '' && $extraDirection === '') {
            throw new \InvalidArgumentException('Provide a story seed, a trope, or direction for the short.');
        }

        $promptBuilder = new RomconPromptBuilder();
        $storyLines = $promptBuilder->compactLines(
            $brief !== '' ? "Story seed: {$brief}" : '',
            $setting !== '' ? "Setting: {$setting}" : '',
            $trope !== '' ? "Main trope: {$trope}" : '',
            $promptBuilder->heatLevelLine($heatLevel),
            "Romance configuration: {$romanceConfiguration}",
            $extraDirection !== '' ? "Extra direction from the creator: {$extraDirection}" : ''
        );

        $definition = $this->prompt('generate_short_script');
        $hardRules = is_array($definition['hard_rules'] ?? null) ? $definition['hard_rules'] : [];
        $prompt = trim(implode("\n\n", array_filter([
            implode("\n", is_array($definition['intro_lines'] ?? null) ? $definition['intro_lines'] : []),
            'Hard rules:' . "\n" . implode("\n", array_map(
                static fn (string $rule): string => '- ' . $rule,
                $hardRules
            )),
            'Story inputs:' . "\n" . implode("\n", array_map(
                static fn (string $line): string => '- ' . $line,
                $storyLines
            )),
            'Return this schema exactly: ' . json_encode($definition['schema_hint'], JSON_PRETTY_PRINT),
        ])));

        $service = new GeminiService($userId);
        $result = $service->generateJson($prompt, is_array($definition['schema_hint'] ?? null) ? $definition['schema_hint'] : []);
        unset($result['created_at']);

        return ShortScriptNormalizer::normalize($result);
    }
}
