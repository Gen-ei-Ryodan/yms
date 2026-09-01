<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClassModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'classes';

    protected $fillable = [
        'class_code',
        'course_id',
        'level_id',
        'teacher_id',
        'room_id',
        'capacity',
        'status',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function schedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }

    public function enrollments()
    {
        return $this->hasMany(ClassEnrollment::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function getEnrolledCountAttribute(): int
    {
        return $this->enrollments()->where('status', 'ACTIVE')->count();
    }

    public function isFull(): bool
    {
        return $this->enrolled_count >= $this->capacity;
    }

    public function generateClassCode(): string
    {
        $lastClass = static::orderBy('id', 'desc')->first();
        $number = $lastClass ? intval(substr($lastClass->class_code, 3)) + 1 : 1;
        return 'CLS-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}
