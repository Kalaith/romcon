<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class WriterProfile extends Model
{
    protected $table = 'writer_profiles';

    protected $fillable = [
        'created_by',
        'profile_markdown',
        'created_at',
        'updated_at',
    ];

    public $timestamps = false;

    protected static function booted(): void
    {
        static::saving(static function (WriterProfile $profile): void {
            $now = date('Y-m-d H:i:s');
            if (!$profile->exists) {
                $profile->created_at = $now;
            }
            $profile->updated_at = $now;
        });
    }
}
