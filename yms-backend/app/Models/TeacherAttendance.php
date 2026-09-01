<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherAttendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'date',
        'check_in',
        'check_out',
        'status',
        'method',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function scopeForDate($query, $date)
    {
        return $query->where('date', $date);
    }
}
