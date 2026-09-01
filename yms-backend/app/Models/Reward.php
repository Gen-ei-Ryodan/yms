<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reward extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'description',
        'image',
        'points_required',
        'stock',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'points_required' => 'integer',
        'stock' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function redemptions()
    {
        return $this->hasMany(RewardRedemption::class);
    }

    public function vouchers()
    {
        return $this->hasMany(Voucher::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function isInStock(): bool
    {
        return $this->stock > 0;
    }

    public function isAvailable(): bool
    {
        return $this->status === 'ACTIVE'
            && $this->isInStock()
            && (!$this->start_date || $this->start_date->isPast())
            && (!$this->end_date || $this->end_date->isFuture());
    }
}
