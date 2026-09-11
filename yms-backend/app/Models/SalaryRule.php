<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalaryRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'calculation_method',
        'rate_per_class',
        'rate_per_student',
        'rate_per_session',
        'fixed_salary',
        'effective_from',
        'effective_until',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'rate_per_class' => 'decimal:2',
        'rate_per_student' => 'decimal:2',
        'rate_per_session' => 'decimal:2',
        'fixed_salary' => 'decimal:2',
        'effective_from' => 'date',
        'effective_until' => 'date',
        'is_active' => 'boolean',
    ];

    const METHODS = [
        'PER_CLASS' => 'Per Kelas',
        'PER_STUDENT' => 'Per Siswa',
        'PER_SESSION' => 'Per Pertemuan',
        'FIXED_SALARY' => 'Gaji Tetap',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('effective_from', '<=', now())
            ->where(function ($q) {
                $q->whereNull('effective_until')->orWhere('effective_until', '>=', now());
            });
    }

    public function calculateForTeacher($teacher)
    {
        $classes = ClassModel::where('teacher_id', $teacher->id)
            ->where('status', 'ACTIVE')
            ->get();

        $totalStudents = ClassEnrollment::whereHas('class', fn($q) => $q->where('teacher_id', $teacher->id))
            ->where('status', 'ACTIVE')->count();

        $totalSessions = ClassSchedule::whereHas('class', fn($q) => $q->where('teacher_id', $teacher->id))
            ->where('status', 'ACTIVE')->count();

        $thisMonth = now()->startOfMonth();
        $thisMonthSessions = ClassSchedule::whereHas('class', fn($q) => $q->where('teacher_id', $teacher->id))
            ->where('status', 'ACTIVE')
            ->where('effective_from', '<=', now())
            ->count();

        $attendanceThisMonth = Attendance::whereHas('class', fn($q) => $q->where('teacher_id', $teacher->id))
            ->whereDate('date', '>=', $thisMonth)
            ->count();

        switch ($this->calculation_method) {
            case 'PER_CLASS':
                $base = $classes->count() * $this->rate_per_class;
                $breakdown = "{$classes->count()} kelas × " . formatIDR($this->rate_per_class);
                break;
            case 'PER_STUDENT':
                $base = $totalStudents * $this->rate_per_student;
                $breakdown = "{$totalStudents} siswa × " . formatIDR($this->rate_per_student);
                break;
            case 'PER_SESSION':
                $base = $attendanceThisMonth * $this->rate_per_session;
                $breakdown = "{$attendanceThisMonth} pertemuan × " . formatIDR($this->rate_per_session);
                break;
            case 'FIXED_SALARY':
                $base = $this->fixed_salary;
                $breakdown = "Gaji tetap";
                break;
            default:
                $base = 0;
                $breakdown = "Metode tidak diketahui";
        }

        return [
            'method' => self::METHODS[$this->calculation_method] ?? $this->calculation_method,
            'method_key' => $this->calculation_method,
            'active_classes' => $classes->count(),
            'total_students' => $totalStudents,
            'total_sessions' => $totalSessions,
            'attendance_this_month' => $attendanceThisMonth,
            'base_salary' => $base,
            'rate' => $this->rate_per_class ?? $this->rate_per_student ?? $this->rate_per_session ?? $this->fixed_salary,
            'breakdown' => $breakdown,
        ];
    }
}

function formatIDR($amount)
{
    return 'Rp' . number_format($amount, 0, ',', '.');
}
