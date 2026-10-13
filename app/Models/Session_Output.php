<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Session_Output extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $table = 'session_outputs';

    protected $fillable = [
        'study_session_id',
        'content',
        'model_used',
        'prompt_tokens',
        'status',
    ];

    /**
     * Get the study session that owns this output.
     */
    public function studySession(): BelongsTo
    {
        return $this->belongsTo(Study_Session::class, 'study_session_id');
    }

    /**
     * Snake-case alias for studySession.
     */
    public function study_session(): BelongsTo
    {
        return $this->studySession();
    }
}
