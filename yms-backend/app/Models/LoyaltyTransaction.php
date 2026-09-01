<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'type',
        'points',
        'reference_type',
        'reference_id',
        'description',
        'expired_at',
    ];

    protected $casts = [
        'points' => 'integer',
        'expired_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function reference()
    {
        return $this->morphTo();
    }

    public function scopeEarned($query)
    {
        return $query->where('type', 'EARN');
    }

    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }
}
