<?php

declare(strict_types=1);

namespace App\Services;

final class HeatLevelPolicy
{
    private const DEFAULT_LEVEL = 'sweet';
    private const GUEST_MAX_LEVEL = 'warm';

    /**
     * @return list<string>
     */
    public static function allLevels(): array
    {
        return ['chaste', 'sweet', 'warm', 'steamy', 'spicy', 'smutty', 'erotic'];
    }

    /**
     * @return list<string>
     */
    public static function guestLevels(): array
    {
        return ['chaste', 'sweet', 'warm'];
    }

    public static function normalize(string $heatLevel, bool $isGuest): string
    {
        $normalized = strtolower(trim($heatLevel));
        if (!in_array($normalized, self::allLevels(), true)) {
            return self::DEFAULT_LEVEL;
        }

        if ($isGuest && !in_array($normalized, self::guestLevels(), true)) {
            return self::GUEST_MAX_LEVEL;
        }

        return $normalized;
    }
}
