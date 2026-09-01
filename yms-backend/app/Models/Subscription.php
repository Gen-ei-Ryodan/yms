<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'product_id',
        'start_date',
        'end_date',
        'price',
        'status',
        'auto_renew',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'price' => 'decimal:2',
        'auto_renew' => 'boolean',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function product()
    {
        return $this->belongsTo(TuitionProduct::class, 'product_id');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function scopeExpiringSoon($query, int $days = 30)
    {
        return $query->where('status', 'ACTIVE')
            ->where('end_date', '<=', now()->addDays($days));
    }

    public function isExpired(): bool
    {
        return $this->end_date->isPast();
    }
}
