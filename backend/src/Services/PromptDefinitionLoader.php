<?php

declare(strict_types=1);

namespace App\Services;

use RuntimeException;

final class PromptDefinitionLoader
{
    /**
     * @var array<string, array<string, mixed>>
     */
    private static array $cache = [];

    public function __construct(private ?string $basePath = null)
    {
        $this->basePath = $basePath ?? (realpath(__DIR__ . '/../Prompts') ?: __DIR__ . '/../Prompts');
    }

    /**
     * @return array<string, mixed>
     */
    public function load(string $name): array
    {
        if (isset(self::$cache[$name])) {
            return self::$cache[$name];
        }

        $path = rtrim((string) $this->basePath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $name . '.json';
        if (!is_file($path)) {
            throw new RuntimeException("Prompt definition not found: {$name}");
        }

        $raw = file_get_contents($path);
        if ($raw === false) {
            throw new RuntimeException("Unable to read prompt definition: {$name}");
        }

        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            throw new RuntimeException("Invalid JSON prompt definition: {$name}");
        }

        self::$cache[$name] = $decoded;

        return $decoded;
    }
}
