<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserFreeUsage extends Model
{
    protected $table = 'user_free_usages';

    protected $fillable = [
        'clerk_id',
        'cycle_key',
        'collaborative_spaces_used',
        'ai_generations_used',
        'pq_uploads_used',
    ];
}