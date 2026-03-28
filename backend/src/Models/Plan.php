<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Plan extends Model
{
    protected $table = 'plans';

    protected $fillable = [
        'created_by',
        'title',
        'concept_brief',
        'setting',
        'romance_configuration',
        'main_character_focus',
        'romance_structure_notes',
        'pov_mode',
        'pov_notes',
        'dominant_romance_arc',
        'central_external_pressure',
        'emotional_question',
        'flavor_seeds_json',
        'cast_json',
        'chapter_details_json',
        'draft_chapters_json',
        'heat_level',
        'target_words',
        'summary',
        'lead_one_json',
        'lead_two_json',
        'pairing_json',
        'premise_json',
        'trope_notes_json',
        'notes',
        'created_at',
        'updated_at',
    ];

    public $timestamps = false;

    protected static function booted(): void
    {
        static::saving(static function (Plan $plan): void {
            $now = date('Y-m-d H:i:s');
            if (!$plan->exists) {
                $plan->created_at = $now;
            }
            $plan->updated_at = $now;
        });
    }

    public function toApiArray(): array
    {
        return [
            'id' => (int) $this->id,
            'created_by' => (string) $this->created_by,
            'title' => (string) $this->title,
            'concept_brief' => (string) ($this->concept_brief ?? ''),
            'setting' => (string) ($this->setting ?? ''),
            'romance_configuration' => (string) ($this->romance_configuration ?? 'm/f'),
            'main_character_focus' => (string) ($this->main_character_focus ?? ''),
            'romance_structure_notes' => (string) ($this->romance_structure_notes ?? ''),
            'pov_mode' => (string) ($this->pov_mode ?? 'single_close_third'),
            'pov_notes' => (string) ($this->pov_notes ?? ''),
            'dominant_romance_arc' => (string) ($this->dominant_romance_arc ?? ''),
            'central_external_pressure' => (string) ($this->central_external_pressure ?? ''),
            'emotional_question' => (string) ($this->emotional_question ?? ''),
            'flavor_seeds' => $this->decodeJson($this->flavor_seeds_json) ?? [],
            'cast' => $this->decodeJson($this->cast_json) ?? [],
            'chapter_details' => $this->decodeJson($this->chapter_details_json) ?? [],
            'draft_chapters' => $this->decodeJson($this->draft_chapters_json) ?? [],
            'heat_level' => (string) $this->heat_level,
            'target_words' => (int) $this->target_words,
            'summary' => $this->summary,
            'lead_one' => $this->decodeJson($this->lead_one_json),
            'lead_two' => $this->decodeJson($this->lead_two_json),
            'pairing' => $this->decodeJson($this->pairing_json),
            'premise' => $this->decodeJson($this->premise_json),
            'trope_notes' => $this->decodeJson($this->trope_notes_json) ?? [],
            'notes' => $this->notes,
            'created_at' => (string) $this->created_at,
            'updated_at' => (string) $this->updated_at,
        ];
    }

    private function decodeJson(?string $value): mixed
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        return json_decode($value, true);
    }
}
