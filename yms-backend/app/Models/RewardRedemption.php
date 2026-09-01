<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RewardRedemption extends Model
{
    use HasFactory;

    protected $fillable = [
        'redemption_number',
        'student_id',
        'reward_id',
        'points_used',
        'status',
        'redeemed_at',
        'approved_at',
        'fulfilled_at',
    ];

    protected $casts = [
        'redeemed_at' => 'datetime',
        'approved_at' => 'datetime',
        'fulfilled_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function reward()
    {
        return $this->belongsTo(Reward::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'PENDING');
    }

    public function generateRedemptionNumber(): string
    {
        $lastRedemption = static::orderBy('id', 'desc')->first();
        $number = $lastRedemption ? intval(substr($lastRedemption->redemption_number, 4)) + 1 : 1;
        return 'RDM-' . date('Ym') . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}
