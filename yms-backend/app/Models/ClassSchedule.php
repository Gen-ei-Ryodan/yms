<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id',
        'teacher_id',
        'room_id',
        'day_of_week',
        'start_time',
        'end_time',
        'effective_from',
        'effective_until',
        'status',
    ];

    protected $casts = [
        'effective_from' => 'date',
        'effective_until' => 'date',
    ];

    public function class()
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'schedule_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function scopeForDay($query, string $day)
    {
        return $query->where('day_of_week', $day);
    }
}
