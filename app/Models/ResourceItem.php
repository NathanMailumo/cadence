<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Resource;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Study_Session;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class ResourceItem extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $table = 'resource_items';

    protected $fillable = [
        'clerk_id',
        'status',
        'resource_id',
        'study_session_id',
        'type',
        'title',
        'url',
        'content',
        'description',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'status' => 'string',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'clerk_id', 'clerk_id');
    }

    /**
     * Relationship: Belongs to Parent Resource Workspace
     */
    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }

    public function studySession(): BelongsTo
    {
        return $this->belongsTo(Study_Session::class);
    }
}
