<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\GeminiService;
use App\Services\PromptDefinitionLoader;
use App\Services\RomconPromptBuilder;

abstract class PromptAction
{
    protected function string(array $input, string $key, string $default = ''): string
    {
        return trim((string) ($input[$key] ?? $default));
    }

    protected function int(array $input, string $key, int $default = 0): int
    {
        return (int) ($input[$key] ?? $default);
    }

    protected function arrayValue(array $input, string $key): array
    {
        return is_array($input[$key] ?? null) ? $input[$key] : [];
    }

    /**
     * @return list<string>
     */
    protected function stringList(array $input, string $key): array
    {
        return array_values(array_filter(array_map(
            static fn (mixed $value): string => trim((string) $value),
            $this->arrayValue($input, $key)
        ), static fn (string $value): bool => $value !== ''));
    }

    /**
     * @return array<string, mixed>
     */
    protected function prompt(string $name): array
    {
        return (new PromptDefinitionLoader())->load($name);
    }

    /**
     * @param list<string> $contextLines
     * @return array<string, mixed>
     */
    protected function generatePlanningJson(string $promptName, ?string $userId, array $contextLines): array
    {
        $definition = $this->prompt($promptName);
        $builder = new RomconPromptBuilder();
        $service = new GeminiService($userId);

        return $service->generateJson(
            $builder->buildPlanningPrompt(
                (string) $definition['layer_label'],
                (string) $definition['job_label'],
                $contextLines,
                is_array($definition['task_lines'] ?? null) ? $definition['task_lines'] : []
            ),
            is_array($definition['schema_hint'] ?? null) ? $definition['schema_hint'] : []
        );
    }
}
