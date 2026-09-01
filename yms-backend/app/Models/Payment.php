<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_number',
        'student_id',
        'subscription_id',
        'invoice_id',
        'amount',
        'payment_date',
        'due_date',
        'payment_method',
        'status',
        'reference',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
        'due_date' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'PAID');
    }

    public function generatePaymentNumber(): string
    {
        $lastPayment = static::orderBy('id', 'desc')->first();
        $number = $lastPayment ? intval(substr($lastPayment->payment_number, 4)) + 1 : 1;
        return 'PAY-' . date('Ym') . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}
