<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function admin()
    {
        $today = now()->toDateString();
        $dayOfWeek = now()->format('l');

        // ── Siswa ──
        $totalStudents = \App\Models\Student::count();
        $activeStudents = \App\Models\Student::where('status', 'ACTIVE')->count();
        $newStudents = \App\Models\Student::where('join_date', '>=', now()->subDays(30))->count();
        $studentsOnLeave = \App\Models\StudentLeave::where('status', 'APPROVED')
            ->where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->count();
        $studentsHoliday = \App\Models\StudentLeave::where('status', 'APPROVED')
            ->where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->whereRaw("LOWER(reason) LIKE '%libur%' OR LOWER(reason) LIKE '%holiday%'")
            ->count();
        $studentsGraduated = \App\Models\Student::where('status', 'GRADUATED')->count();
        $studentsTransferred = \App\Models\Student::where('status', 'TRANSFERRED')->count();
        $studentsInactive = \App\Models\Student::where('status', 'INACTIVE')->count();
        $studentsSuspended = \App\Models\Student::where('status', 'SUSPENDED')->count();
        $studentsLeft = $studentsGraduated + $studentsTransferred + $studentsInactive + $studentsSuspended;

        // ── Kelas ──
        $totalClasses = \App\Models\ClassModel::count();
        $activeClasses = \App\Models\ClassModel::where('status', 'ACTIVE')->count();
        $fullClasses = \App\Models\ClassModel::where('status', 'FULL')->count();
        $todaySchedules = \App\Models\ClassSchedule::where('day_of_week', $dayOfWeek)
            ->where('status', 'ACTIVE')
            ->where('effective_from', '<=', $today)
            ->where(function ($q) use ($today) {
                $q->whereNull('effective_until')->orWhere('effective_until', '>=', $today);
            })
            ->count();
        $studentsPerClass = \App\Models\ClassEnrollment::where('status', 'ACTIVE')
            ->selectRaw('class_id, COUNT(*) as total')
            ->groupBy('class_id')
            ->pluck('total', 'class_id');

        // ── Absensi ──
        $todayAttendance = \App\Models\Attendance::whereDate('attendance_date', $today)->count();
        $presentToday = \App\Models\Attendance::whereDate('attendance_date', $today)->where('status', 'PRESENT')->count();
        $lateToday = \App\Models\Attendance::whereDate('attendance_date', $today)->where('status', 'LATE')->count();
        $absentToday = \App\Models\Attendance::whereDate('attendance_date', $today)->where('status', 'ABSENT')->count();
        $onLeaveToday = \App\Models\Attendance::whereDate('attendance_date', $today)->where('status', 'ON_LEAVE')->count();
        $excusedToday = \App\Models\Attendance::whereDate('attendance_date', $today)->where('status', 'EXCUSED')->count();
        $attendanceRate = $todayAttendance > 0 ? (($presentToday + $lateToday) / $todayAttendance) * 100 : 0;

        // ── Transaksi ──
        $todayRevenue = \App\Models\Payment::whereDate('payment_date', $today)->where('status', 'PAID')->sum('amount');
        $todayPurchases = \App\Models\Subscription::whereDate('created_at', $today)->count();
        $totalTransactions = \App\Models\Payment::where('status', 'PAID')->count();
        $monthlyRevenue = \App\Models\Payment::whereMonth('payment_date', now()->month)
            ->whereYear('payment_date', now()->year)
            ->where('status', 'PAID')
            ->sum('amount');
        $outstandingPayment = \App\Models\Invoice::whereNotIn('status', ['PAID', 'CANCELLED'])->sum('total')
            - \App\Models\Payment::where('status', 'PAID')->sum('amount');
        $overdueInvoice = \App\Models\Invoice::where('status', 'UNPAID')->where('due_date', '<', $today)->count();

        // ── Loyalty ──
        $totalPointsIssued = \App\Models\LoyaltyTransaction::where('type', 'EARN')->sum('points');
        $pointsRedeemed = \App\Models\LoyaltyTransaction::where('type', 'REDEEM')->sum('points');
        $activeLoyaltyMembers = \App\Models\Student::whereHas('loyaltyTransactions', function ($q) {
            $q->where('type', 'EARN');
        })->count();
        $rewardRedemption = \App\Models\RewardRedemption::where('status', 'APPROVED')->count();

        // ── Approvals ──
        $pendingLeaves = \App\Models\StudentLeave::where('status', 'PENDING')->count();
        $pendingTransfers = \App\Models\ClassTransfer::where('status', 'PENDING')->count();
        $pendingRedemptions = \App\Models\RewardRedemption::where('status', 'PENDING')->count();
        $totalPendingApprovals = $pendingLeaves + $pendingTransfers + $pendingRedemptions;

        return response()->json([
            'success' => true,
            'data' => [
                'students' => [
                    'total_students' => $totalStudents,
                    'active_students' => $activeStudents,
                    'new_students' => $newStudents,
                    'students_on_leave' => $studentsOnLeave,
                    'students_holiday' => $studentsHoliday,
                    'students_left' => $studentsLeft,
                    'students_graduated' => $studentsGraduated,
                    'students_transferred' => $studentsTransferred,
                    'students_inactive' => $studentsInactive,
                    'students_suspended' => $studentsSuspended,
                ],
                'classes' => [
                    'total_classes' => $totalClasses,
                    'active_classes' => $activeClasses,
                    'full_classes' => $fullClasses,
                    'today_schedules' => $todaySchedules,
                    'students_per_class' => $studentsPerClass,
                ],
                'attendance' => [
                    'today_attendance' => $todayAttendance,
                    'attendance_rate' => round($attendanceRate, 2),
                    'present_today' => $presentToday,
                    'late_today' => $lateToday,
                    'absent_today' => $absentToday,
                    'on_leave_today' => $onLeaveToday,
                    'excused_today' => $excusedToday,
                ],
                'payment' => [
                    'today_revenue' => $todayRevenue,
                    'today_purchases' => $todayPurchases,
                    'total_transactions' => $totalTransactions,
                    'monthly_revenue' => $monthlyRevenue,
                    'outstanding_payment' => max(0, $outstandingPayment),
                    'overdue_invoice' => $overdueInvoice,
                ],
                'loyalty' => [
                    'total_points_issued' => $totalPointsIssued,
                    'points_redeemed' => $pointsRedeemed,
                    'active_loyalty_members' => $activeLoyaltyMembers,
                    'reward_redemption' => $rewardRedemption,
                ],
                'approvals' => [
                    'total_pending' => $totalPendingApprovals,
                    'pending_leaves' => $pendingLeaves,
                    'pending_transfers' => $pendingTransfers,
                    'pending_redemptions' => $pendingRedemptions,
                ],
            ],
        ]);
    }

    public function teacher()
    {
        $teacher = auth()->user()->teacher;
        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher not found'], 404);
        }

        $dayOfWeek = now()->format('l');

        // ── Jadwal Hari Ini ──
        $todaySchedules = \App\Models\ClassSchedule::with(['class.course', 'class.level', 'class.room'])
            ->whereHas('class', fn($q) => $q->where('teacher_id', $teacher->id))
            ->where('day_of_week', $dayOfWeek)
            ->where('status', 'ACTIVE')
            ->orderBy('start_time')
            ->get()
            ->map(function ($s) {
                $enrolledCount = $s->class->enrollments()->where('status', 'ACTIVE')->count();
                return [
                    'id' => $s->id,
                    'class_id' => $s->class_id,
                    'class_code' => $s->class->class_code,
                    'course' => $s->class->course->name,
                    'level' => $s->class->level->name,
                    'room' => $s->class->room->name ?? 'N/A',
                    'start_time' => $s->start_time,
                    'end_time' => $s->end_time,
                    'enrolled_count' => $enrolledCount,
                ];
            });

        // ── Kelas Aktif ──
        $activeClasses = \App\Models\ClassModel::where('teacher_id', $teacher->id)
            ->where('status', 'ACTIVE')
            ->with(['course', 'level'])
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'class_code' => $c->class_code,
                'course' => $c->course->name,
                'level' => $c->level->name,
                'enrolled_count' => $c->enrollments()->where('status', 'ACTIVE')->count(),
                'capacity' => $c->capacity,
            ]);

        // ── Total Murid ──
        $totalStudents = \App\Models\ClassEnrollment::whereHas('class', fn($q) => $q->where('teacher_id', $teacher->id))
            ->where('status', 'ACTIVE')->count();

        // ── Progress (attendance rate) ──
        $totalAttendance = \App\Models\Attendance::whereHas('class', fn($q) => $q->where('teacher_id', $teacher->id))->count();
        $presentCount = \App\Models\Attendance::whereHas('class', fn($q) => $q->where('teacher_id', $teacher->id))->whereIn('status', ['PRESENT', 'LATE'])->count();
        $progressRate = $totalAttendance > 0 ? ($presentCount / $totalAttendance) * 100 : 0;

        // ── Absensi Hari Ini ──
        $attendanceToday = \App\Models\Attendance::whereHas('class', fn($q) => $q->where('teacher_id', $teacher->id))
            ->whereDate('date', now()->toDateString())->count();
        $pendingAttendance = max(0, $todaySchedules->sum('enrolled_count') - $attendanceToday);

        return response()->json([
            'success' => true,
            'data' => [
                'today_schedules' => $todaySchedules,
                'today_classes_count' => $todaySchedules->count(),
                'total_students' => $totalStudents,
                'active_classes_count' => $activeClasses->count(),
                'progress_rate' => round($progressRate, 2),
                'attendance_today' => $attendanceToday,
                'pending_attendance' => $pendingAttendance,
                'active_classes' => $activeClasses,
            ],
        ]);
    }

    public function student()
    {
        $student = auth()->user()->student;
        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Student not found'], 404);
        }

        $activeEnrollment = $student->enrollments()
            ->where('status', 'ACTIVE')
            ->with(['class.course', 'class.level', 'class.teacher.user', 'class.room', 'class.schedules'])
            ->first();

        $nextSchedule = null;
        if ($activeEnrollment) {
            $nextSchedule = \App\Models\ClassSchedule::where('class_id', $activeEnrollment->class_id)
                ->where('status', 'ACTIVE')
                ->where('effective_from', '<=', now())
                ->orderBy('start_time')
                ->first();
        }

        $today = now()->toDateString();
        $totalSessions = \App\Models\Attendance::where('student_id', $student->id)->count();
        $presentCount = \App\Models\Attendance::where('student_id', $student->id)->where('status', 'PRESENT')->count();
        $lateCount = \App\Models\Attendance::where('student_id', $student->id)->where('status', 'LATE')->count();
        $attendanceRate = $totalSessions > 0 ? (($presentCount + $lateCount) / $totalSessions) * 100 : 0;

        $subscription = $student->subscriptions()->where('status', 'ACTIVE')->first();

        $loyaltyBalance = $student->loyalty_balance;

        $availableRewards = \App\Models\Reward::where('status', 'ACTIVE')
            ->where('points_required', '<=', $loyaltyBalance)
            ->where('stock', '>', 0)
            ->limit(5)
            ->get();

        $activeVouchers = $student->vouchers()->where('status', 'AVAILABLE')->get();

        // ── Progress Belajar ──
        $latestProgress = \App\Models\StudentProgress::where('student_id', $student->id)
            ->latest('assessed_at')
            ->first();

        $totalLessons = \App\Models\Attendance::where('student_id', $student->id)
            ->whereIn('status', ['PRESENT', 'LATE'])
            ->count();

        $completedLessons = \App\Models\Attendance::where('student_id', $student->id)
            ->where('status', 'PRESENT')
            ->count();

        $latestNote = \App\Models\LearningNote::where('student_id', $student->id)
            ->latest('note_date')
            ->first();

        $progress = [
            'total_lessons' => $totalLessons,
            'completed_lessons' => $completedLessons,
            'latest_topic' => $latestProgress?->title,
            'latest_level' => $latestProgress?->level,
            'teacher_notes' => $latestNote?->content,
            'teacher_feedback' => $latestNote?->teacher_feedback,
            'last_material' => $latestNote?->topic,
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'membership_status' => $student->membership_status,
                'current_class' => $activeEnrollment,
                'teacher' => $activeEnrollment?->class?->teacher?->user?->name,
                'next_schedule' => $nextSchedule,
                'attendance_rate' => round($attendanceRate, 2),
                'payment_status' => $subscription ? $subscription->status : 'NO_SUBSCRIPTION',
                'subscription_expiry' => $subscription?->end_date,
                'loyalty_points' => $loyaltyBalance,
                'available_rewards' => $availableRewards,
                'active_vouchers' => $activeVouchers,
                'progress' => $progress,
            ],
        ]);
    }

    public function teacherClassSummary()
    {
        $teacher = auth()->user()->teacher;
        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher not found'], 404);
        }

        $classes = \App\Models\ClassModel::with(['course', 'level', 'room'])
            ->where('teacher_id', $teacher->id)
            ->where('status', 'ACTIVE')
            ->get()
            ->map(function ($class) {
                $enrolledCount = $class->enrollments()->where('status', 'ACTIVE')->count();
                $totalAttendance = $class->attendances()->count();
                $presentCount = $class->attendances()->where('status', 'PRESENT')->count();
                $lateCount = $class->attendances()->where('status', 'LATE')->count();
                $attendanceRate = $totalAttendance > 0 ? (($presentCount + $lateCount) / $totalAttendance) * 100 : 0;

                return [
                    'id' => $class->id,
                    'class_code' => $class->class_code,
                    'course_name' => $class->course->name,
                    'level_name' => $class->level->name,
                    'room_name' => $class->room->name,
                    'capacity' => $class->capacity,
                    'enrolled_count' => $enrolledCount,
                    'attendance_rate' => round($attendanceRate, 2),
                    'total_sessions' => $totalAttendance,
                ];
            });

        $totalStudents = \App\Models\ClassEnrollment::whereHas('class', function ($q) use ($teacher) {
            $q->where('teacher_id', $teacher->id);
        })->where('status', 'ACTIVE')->count();

        $totalAttendance = \App\Models\Attendance::whereHas('class', function ($q) use ($teacher) {
            $q->where('teacher_id', $teacher->id);
        })->count();

        $presentCount = \App\Models\Attendance::whereHas('class', function ($q) use ($teacher) {
            $q->where('teacher_id', $teacher->id);
        })->where('status', 'PRESENT')->count();

        $lateCount = \App\Models\Attendance::whereHas('class', function ($q) use ($teacher) {
            $q->where('teacher_id', $teacher->id);
        })->where('status', 'LATE')->count();

        $overallRate = $totalAttendance > 0 ? (($presentCount + $lateCount) / $totalAttendance) * 100 : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'classes' => $classes,
                'total_students' => $totalStudents,
                'total_classes' => $classes->count(),
                'overall_attendance_rate' => round($overallRate, 2),
                'total_sessions' => $totalAttendance,
            ],
        ]);
    }
}