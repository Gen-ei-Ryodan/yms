<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassTransfer extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'from_class_id',
        'to_class_id',
        'reason',
        'requested_at',
        'approved_at',
        'approved_by',
        'status',
        'notes',
    ];

    protected $casts = [
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function fromClass()
    {
        return $this->belongsTo(ClassModel::class, 'from_class_id');
    }

    public function toClass()
    {
        return $this->belongsTo(ClassModel::class, 'to_class_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'PENDING');
    }
}
