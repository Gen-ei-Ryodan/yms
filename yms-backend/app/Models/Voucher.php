<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'reward_id',
        'student_id',
        'discount_type',
        'discount_value',
        'minimum_transaction',
        'valid_from',
        'valid_until',
        'status',
        'used_at',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'minimum_transaction' => 'decimal:2',
        'valid_from' => 'date',
        'valid_until' => 'date',
        'used_at' => 'datetime',
    ];

    public function reward()
    {
        return $this->belongsTo(Reward::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'AVAILABLE')
            ->where('valid_from', '<=', now())
            ->where('valid_until', '>=', now());
    }

    public function isValid(): bool
    {
        return $this->status === 'AVAILABLE'
            && $this->valid_from->isPast()
            && $this->valid_until->isFuture();
    }

    public function generateVoucherCode(): string
    {
        return 'VCR-' . strtoupper(uniqid());
    }
}
