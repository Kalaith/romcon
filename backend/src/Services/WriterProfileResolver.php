<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\WriterProfile;

final class WriterProfileResolver
{
    public function getDefaultProfile(): string
    {
        $profilePath = realpath(__DIR__ . '/../../writer_profile.md') ?: __DIR__ . '/../../writer_profile.md';
        return file_exists($profilePath) ? (string) file_get_contents($profilePath) : '';
    }

    public function getCustomProfile(string $userId): ?string
    {
        $profile = WriterProfile::query()
            ->where('created_by', $userId)
            ->first();

        if ($profile === null) {
            return null;
        }

        $value = trim((string) ($profile->profile_markdown ?? ''));
        return $value !== '' ? $value : null;
    }

    public function getEffectiveProfile(?string $userId): string
    {
        $default = $this->getDefaultProfile();
        if ($userId === null || trim($userId) === '') {
            return $default;
        }

        return $this->getCustomProfile($userId) ?? $default;
    }
}
