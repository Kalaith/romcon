<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class FlavorSeed extends Model
{
    protected $table = 'flavor_seeds';

    protected $fillable = [
        'created_by',
        'label',
        'created_at',
        'updated_at',
    ];

    public $timestamps = false;

    protected static function booted(): void
    {
        static::saving(static function (FlavorSeed $seed): void {
            $now = date('Y-m-d H:i:s');
            if (!$seed->exists) {
                $seed->created_at = $now;
            }
            $seed->updated_at = $now;
        });
    }

    public function toApiArray(): array
    {
        return [
            'id' => (int) $this->id,
            'created_by' => (string) $this->created_by,
            'label' => (string) $this->label,
            'created_at' => (string) $this->created_at,
            'updated_at' => (string) $this->updated_at,
        ];
    }
}
