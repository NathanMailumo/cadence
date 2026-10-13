<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ResourceItem;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Study_Session;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Resource extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $table = 'resources';

    protected $fillable = [
        'course_name',
        'clerk_id',
        // 'study_session_id',
        'resource_type',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'clerk_id', 'clerk_id');
    }

    /**
     * Get the resource items attached to this workspace.
     */
    public function resourceItems(): HasMany
    {
        return $this->hasMany(ResourceItem::class)->where('status', 'active');
    }

    /**
     * Get the collaborators invited to this resource workspace.
     */
    public function collaborators(): BelongsToMany
    {
        // Explicitly set table name to 'resource_users'
        return $this->belongsToMany(User::class, 'resource_users', 'resource_id', 'clerk_id', 'id', 'clerk_id')
            ->wherePivot('lifecycle_status', 'active')
            ->withPivot(['role', 'status', 'lifecycle_status'])
            ->withTimestamps();
    }

    public function studySessions():HasMany
    {
        return $this->hasMany(Study_Session::class)->where('status', 'active');
    }
}
