export const HEAT_LEVELS = [
  { value: 'chaste', label: 'Chaste', description: 'No sex on page.' },
  { value: 'sweet', label: 'Sweet', description: 'Kissing and affection, fade-to-black.' },
  { value: 'warm', label: 'Warm', description: 'Sensual build, light on-page detail.' },
  { value: 'steamy', label: 'Steamy', description: 'Explicit scenes, moderate detail.' },
  { value: 'spicy', label: 'Spicy', description: 'Multiple explicit scenes, strong descriptive detail.' },
  { value: 'smutty', label: 'Smutty', description: 'Explicit scenes are frequent and prominent.' },
  { value: 'erotic', label: 'Erotic', description: 'Sex is a core structural element of the story.' },
] as const;

export const GUEST_HEAT_LEVEL_VALUES = ['chaste', 'sweet', 'warm'] as const;

export function getHeatLevelMeta(value: string) {
  return HEAT_LEVELS.find((level) => level.value === value) ?? HEAT_LEVELS[1];
}

export function getAllowedHeatLevels(isGuest: boolean) {
  return isGuest ? HEAT_LEVELS.filter((level) => GUEST_HEAT_LEVEL_VALUES.includes(level.value as typeof GUEST_HEAT_LEVEL_VALUES[number])) : HEAT_LEVELS;
}

export function normalizeHeatLevel(value: string, isGuest: boolean) {
  const fallback = 'sweet';
  const normalized = getHeatLevelMeta(value).value;

  if (isGuest && !GUEST_HEAT_LEVEL_VALUES.includes(normalized as typeof GUEST_HEAT_LEVEL_VALUES[number])) {
    return 'warm';
  }

  return normalized || fallback;
}
