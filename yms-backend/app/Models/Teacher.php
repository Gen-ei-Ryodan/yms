<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'teacher_code',
        'name',
        'email',
        'phone',
        'photo',
        'specialization',
        'join_date',
        'status',
    ];

    protected $casts = [
        'join_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function classes()
    {
        return $this->hasMany(ClassModel::class);
    }

    public function schedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }

    public function attendances()
    {
        return $this->hasMany(TeacherAttendance::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function generateTeacherCode(): string
    {
        $lastTeacher = static::orderBy('id', 'desc')->first();
        $number = $lastTeacher ? intval(substr($lastTeacher->teacher_code, 3)) + 1 : 1;
        return 'T-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}
