<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class User extends Model
{
    protected $table = 'users';

    protected $fillable = [
        'webhatch_id',
        'email',
        'username',
        'display_name',
        'role',
        'is_verified',
        'password_hash',
        'created_at',
        'updated_at',
    ];

    public $timestamps = false;
}
