<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Short extends Model
{
    protected $table = 'shorts';

    protected $fillable = [
        'created_by',
        'title',
        'brief',
        'setting',
        'trope',
        'heat_level',
        'script_json',
        'created_at',
        'updated_at',
    ];

    public $timestamps = false;

    public function toApiArray(): array
    {
        $script = json_decode((string) ($this->script_json ?? ''), true);
        $script = is_array($script) ? $script : [];

        return array_merge($script, [
            'id' => (int) $this->id,
            'title' => (string) $this->title,
            'brief' => (string) ($this->brief ?? ''),
            'setting' => (string) ($this->setting ?? ''),
            'trope' => (string) ($this->trope ?? ($script['trope'] ?? '')),
            'heat_level' => (string) $this->heat_level,
            'created_at' => (string) $this->created_at,
            'updated_at' => (string) $this->updated_at,
        ]);
    }
}
