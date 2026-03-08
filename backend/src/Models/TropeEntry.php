<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class TropeEntry extends Model
{
    protected $table = 'tropes';

    protected $fillable = [
        'created_by',
        'name',
        'clash_engine',
        'best_for',
        'is_global',
        'created_at',
        'updated_at',
    ];

    public $timestamps = false;

    protected static function booted(): void
    {
        static::saving(static function (TropeEntry $trope): void {
            $now = date('Y-m-d H:i:s');
            if (!$trope->exists) {
                $trope->created_at = $now;
            }
            $trope->updated_at = $now;
        });
    }
}
