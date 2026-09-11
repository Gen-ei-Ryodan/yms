<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'student_id',
        'class_id',
        'schedule_id',
        'note_date',
        'topic',
        'content',
        'homework',
        'teacher_feedback',
        'rating',
    ];

    protected $casts = [
        'note_date' => 'date',
        'rating' => 'integer',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function class()
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    public function schedule()
    {
        return $this->belongsTo(ClassSchedule::class, 'schedule_id');
    }

    public function scopeForTeacher($query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }
}
