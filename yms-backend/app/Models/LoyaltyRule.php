<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'event_type',
        'points',
        'conditions',
        'status',
    ];

    protected $casts = [
        'conditions' => 'array',
        'points' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function scopeForEvent($query, string $eventType)
    {
        return $query->where('event_type', $eventType);
    }
}
