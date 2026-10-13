<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Resource;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasUuids, Notifiable;

    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'clerk_id',
        'name',
        'email',
        'profile_image_url',
        // 'profile_image_public_id',
    ];


    public function resourceItems(): HasMany
    {
        return $this->hasMany(ResourceItem::class, 'clerk_id', 'clerk_id');
    }

    public function sharedResources(): BelongsToMany
    {
        return $this->belongsToMany(Resource::class, 'resource_users', 'clerk_id', 'resource_id', 'clerk_id', 'id')
            ->wherePivot('lifecycle_status', 'active')
            ->withPivot('status')
            ->withTimestamps();
    }

}
