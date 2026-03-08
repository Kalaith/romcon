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
        $this->apiKey = trim((string) ($_ENV['GEMINI_API_KEY'] ?? $_SERVER['GEMINI_API_KEY'] ?? getenv('GEMINI_API_KEY') ?: ''));
        $this->endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
        $this->writerProfile = (new WriterProfileResolver())->getEffectiveProfile($userId);

        if ($this->apiKey === '') {
            throw new RuntimeException('GEMINI_API_KEY is not configured');
        }
    }

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

        if (($_ENV['APP_ENV'] ?? 'production') === 'development') {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        $errno = curl_errno($ch);
        curl_close($ch);

        if ($response === false) {
            throw new RuntimeException("CURL Error ({$errno}): {$error}");
        }

        if ($httpCode !== 200) {
            throw new RuntimeException("Gemini request failed (HTTP {$httpCode}): {$response}");
        }

        $result = json_decode($response, true);
        $content = $result['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
        $decoded = json_decode($content, true);

        if (!is_array($decoded)) {
            throw new RuntimeException('Gemini did not return valid JSON');
        }

        return $decoded;
    }
}
