<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class CharacterLibraryEntry extends Model
{
    protected $table = 'character_library_entries';

    protected $fillable = [
        'created_by',
        'name',
        'role',
        'summary',
        'connection_to_leads',
        'story_function',
        'core_desire',
        'core_fear',
        'secret_pressure',
        'comedic_angle',
        'created_at',
        'updated_at',
    ];

    public $timestamps = false;

    protected static function booted(): void
    {
        static::saving(static function (CharacterLibraryEntry $entry): void {
            $now = date('Y-m-d H:i:s');
            if (!$entry->exists) {
                $entry->created_at = $now;
            }
            $entry->updated_at = $now;
        });
    }

    public function toApiArray(): array
    {
        return [
            'id' => (int) $this->id,
            'created_by' => (string) $this->created_by,
            'name' => (string) $this->name,
            'role' => (string) ($this->role ?? ''),
            'summary' => (string) ($this->summary ?? ''),
            'connection_to_leads' => (string) ($this->connection_to_leads ?? ''),
            'story_function' => (string) ($this->story_function ?? ''),
            'core_desire' => (string) ($this->core_desire ?? ''),
            'core_fear' => (string) ($this->core_fear ?? ''),
            'secret_pressure' => (string) ($this->secret_pressure ?? ''),
            'comedic_angle' => (string) ($this->comedic_angle ?? ''),
            'include_in_story' => true,
            'is_main' => false,
            'created_at' => (string) $this->created_at,
            'updated_at' => (string) $this->updated_at,
        ];
    }
}
