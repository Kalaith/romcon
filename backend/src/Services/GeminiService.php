<?php

declare(strict_types=1);

namespace App\Services;

use RuntimeException;

final class GeminiService
{
    private string $apiKey;
    private string $endpoint;
    private string $writerProfile;

    public function __construct(?string $userId = null)
    {
        if (!array_key_exists('GEMINI_API_KEY', $_ENV)) {
            throw new RuntimeException('GEMINI_API_KEY is not configured');
        }
        if (!array_key_exists('GEMINI_MODEL', $_ENV)) {
            throw new RuntimeException('GEMINI_MODEL is not configured');
        }

        $this->apiKey = trim((string) $_ENV['GEMINI_API_KEY']);
        $model = trim((string) $_ENV['GEMINI_MODEL']);
        $this->writerProfile = (new WriterProfileResolver())->getEffectiveProfile($userId);

        if ($this->apiKey === '') {
            throw new RuntimeException('GEMINI_API_KEY is not configured');
        }

        if ($model === '') {
            throw new RuntimeException('GEMINI_MODEL is not configured');
        }

        $this->endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";
    }

    private const MAX_ATTEMPTS = 3;
    private const RETRYABLE_HTTP_CODES = [429, 500, 502, 503, 504];
    private const RETRY_DELAYS_MS = [1500, 4000];

    public function generateJson(string $taskPrompt, array $schemaHint): array
    {
        $prompt = trim(
            "You are the RomCon planning engine.\n\n" .
            "Use this writer profile as the creative operating manual:\n" .
            $this->writerProfile .
            "\n\nTask:\n{$taskPrompt}\n\n" .
            "Return only valid JSON that matches this schema hint:\n" .
            json_encode($schemaHint, JSON_PRETTY_PRINT)
        );

        $lastException = null;

        for ($attempt = 1; $attempt <= self::MAX_ATTEMPTS; $attempt++) {
            try {
                return $this->attemptGenerateJson($prompt);
            } catch (RetryableGenerationException $exception) {
                $lastException = $exception;
                if ($attempt < self::MAX_ATTEMPTS) {
                    usleep((self::RETRY_DELAYS_MS[$attempt - 1] ?? 4000) * 1000);
                }
            }
        }

        throw new RuntimeException(
            'Gemini request failed after ' . self::MAX_ATTEMPTS . ' attempts: ' . $lastException?->getMessage()
        );
    }

    private function attemptGenerateJson(string $prompt): array
    {
        $payload = [
            'contents' => [[
                'parts' => [[
                    'text' => $prompt,
                ]],
            ]],
            'generationConfig' => [
                'response_mime_type' => 'application/json',
                'temperature' => 0.9,
            ],
        ];

        $ch = curl_init($this->endpoint . '?key=' . $this->apiKey);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

        if (($_ENV['APP_ENV'] ?? '') === 'development') {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        $errno = curl_errno($ch);
        curl_close($ch);

        if ($response === false) {
            throw new RetryableGenerationException("CURL Error ({$errno}): {$error}");
        }

        if (in_array($httpCode, self::RETRYABLE_HTTP_CODES, true)) {
            throw new RetryableGenerationException("Gemini request failed (HTTP {$httpCode}): {$response}");
        }

        if ($httpCode !== 200) {
            throw new RuntimeException("Gemini request failed (HTTP {$httpCode}): {$response}");
        }

        $result = json_decode($response, true);
        $content = $result['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
        $decoded = json_decode($content, true);

        if (!is_array($decoded)) {
            throw new RetryableGenerationException('Gemini did not return valid JSON');
        }

        return $decoded;
    }
}
