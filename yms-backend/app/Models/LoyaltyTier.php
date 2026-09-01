<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyTier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'minimum_points',
        'maximum_points',
        'benefits',
        'status',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function scopeForPoints($query, int $points)
    {
        return $query->where('minimum_points', '<=', $points)
            ->where('maximum_points', '>=', $points);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('minimum_points');
    }
}
