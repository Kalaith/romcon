<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\GeminiService;
use App\Services\RomconPromptBuilder;

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

        return $this->normalizeResult($result);
    }

    private function normalizeResult(array $result): array
    {
        $segments = [];
        foreach (is_array($result['segments'] ?? null) ? $result['segments'] : [] as $segment) {
            if (!is_array($segment)) {
                continue;
            }

            $narration = trim((string) ($segment['narration'] ?? ''));
            if ($narration === '') {
                continue;
            }

            $segments[] = [
                'beat' => trim((string) ($segment['beat'] ?? '')),
                'time_range' => trim((string) ($segment['time_range'] ?? '')),
                'narration' => $narration,
                'on_screen_text' => trim((string) ($segment['on_screen_text'] ?? '')),
            ];
        }

        if ($segments === []) {
            throw new \RuntimeException('Short script generation returned no narration segments. Please try again.');
        }

        $narratedText = implode(' ', array_merge(
            array_column($segments, 'narration'),
            [trim((string) ($result['call_to_action'] ?? ''))]
        ));
        $wordCount = count(array_filter(preg_split('/\s+/', trim($narratedText)) ?: []));

        return [
            'title' => trim((string) ($result['title'] ?? 'Untitled Short')),
            'hook' => $segments[0]['narration'],
            'logline' => trim((string) ($result['logline'] ?? '')),
            'trope' => trim((string) ($result['trope'] ?? '')),
            'segments' => $segments,
            'call_to_action' => trim((string) ($result['call_to_action'] ?? '')),
            'estimated_duration_seconds' => max(30, (int) ($result['estimated_duration_seconds'] ?? 120)),
            'word_count' => $wordCount,
            'created_at' => date('c'),
        ];
    }
}
