<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'student_id',
        'subscription_id',
        'issue_date',
        'due_date',
        'subtotal',
        'discount',
        'tax',
        'total',
        'status',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'UNPAID')
            ->where('due_date', '<', now());
    }

    public function generateInvoiceNumber(): string
    {
        $lastInvoice = static::orderBy('id', 'desc')->first();
        $number = $lastInvoice ? intval(substr($lastInvoice->invoice_number, 4)) + 1 : 1;
        return 'INV-' . date('Ym') . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}
