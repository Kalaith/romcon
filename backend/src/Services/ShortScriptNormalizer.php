<?php

declare(strict_types=1);

namespace App\Services;

final class ShortScriptNormalizer
{
    /**
     * Coerce a generated or user-edited short script payload into the canonical
     * stored shape. The hook is always the first segment's narration.
     *
     * @throws \RuntimeException when no usable narration segments remain
     */
    public static function normalize(array $result): array
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
            throw new \RuntimeException('A short script needs at least one narration segment.');
        }

        $narratedText = implode(' ', array_merge(
            array_column($segments, 'narration'),
            [trim((string) ($result['call_to_action'] ?? ''))]
        ));
        $wordCount = count(array_filter(preg_split('/\s+/', trim($narratedText)) ?: []));

        $createdAt = trim((string) ($result['created_at'] ?? ''));

        return [
            'title' => trim((string) ($result['title'] ?? 'Untitled Short')),
            'hook' => $segments[0]['narration'],
            'logline' => trim((string) ($result['logline'] ?? '')),
            'trope' => trim((string) ($result['trope'] ?? '')),
            'segments' => $segments,
            'call_to_action' => trim((string) ($result['call_to_action'] ?? '')),
            'estimated_duration_seconds' => max(30, (int) ($result['estimated_duration_seconds'] ?? 120)),
            'word_count' => $wordCount,
            'created_at' => $createdAt !== '' ? $createdAt : date('c'),
        ];
    }
}
