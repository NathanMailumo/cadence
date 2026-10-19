<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Subscriptions extends Model
{
    use HasUuids;

    protected $table = 'subscriptions';

    protected $fillable = [
        'clerk_id',
        'plan_type',
        'status',
        'paystack_reference',
        'paystack_subscription_code',
        'starts_at',
        'ends_at',
    ];
}
