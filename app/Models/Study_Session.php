<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Session_File;
use App\Models\Session_Output;
use App\Models\ResourceItem;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Resource;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Study_Session extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $table = 'study_sessions';

    protected $fillable = [
        'clerk_id',
        'course_title',
        'course_code',
        'input_option',
        'focus_prompt',
        'resource_id',
        'raw_notes',
        'status',
    ];

    public function sessionFile(): HasOne
    {
        return $this->hasOne(Session_File::class, 'study_session_id')
            ->where('status', 'active');
    }

    // public function session_file(): HasOne
    // {
    //     return $this->sessionFile();
    // }

    /**
     * Define the relationship to SessionOutput
     */
    public function sessionOutput(): HasOne
    {
        return $this->hasOne(Session_Output::class, 'study_session_id')
            ->where('status', 'active');
    }

    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }

    public function revisionPack(): HasOne
    {
        return $this->hasOne(ResourceItem::class, 'study_session_id')
            ->where('type', 'revision');
    }
}
