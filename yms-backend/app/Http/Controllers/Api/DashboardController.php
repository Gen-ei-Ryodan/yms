<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function admin()
    {
        $today = now()->toDateString();

        $totalStudents = \App\Models\Student::count();
        $activeStudents = \App\Models\Student::where('status', 'ACTIVE')->count();
        $inactiveStudents = \App\Models\Student::where('status', '!=', 'ACTIVE')->count();
        $newStudents = \App\Models\Student::where('join_date', '>=', now()->subDays(30))->count();
        $studentsOnLeave = \App\Models\StudentLeave::where('status', 'APPROVED')
            ->where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->count();

        $todayAttendance = \App\Models\Attendance::whereDate('attendance_date', $today)->count();
        $presentToday = \App\Models\Attendance::whereDate('attendance_date', $today)->where('status', 'PRESENT')->count();
        $lateToday = \App\Models\Attendance::whereDate('attendance_date', $today)->where('status', 'LATE')->count();
        $absentToday = \App\Models\Attendance::whereDate('attendance_date', $today)->where('status', 'ABSENT')->count();

        $totalScheduled = \App\Models\Attendance::whereDate('attendance_date', $today)->count();
        $attendanceRate = $totalScheduled > 0 ? (($presentToday + $lateToday) / $totalScheduled) * 100 : 0;

        $activeClasses = \App\Models\ClassModel::where('status', 'ACTIVE')->count();
        $todayClasses = \App\Models\ClassModel::where('status', 'ACTIVE')->count();
        $fullClasses = \App\Models\ClassModel::where('status', 'FULL')->count();
        $availableCapacity = \App\Models\ClassModel::sum('capacity') - \App\Models\ClassEnrollment::where('status', 'ACTIVE')->count();

        $todayRevenue = \App\Models\Payment::whereDate('payment_date', $today)->where('status', 'PAID')->sum('amount');
        $monthlyRevenue = \App\Models\Payment::whereMonth('payment_date', now()->month)->whereYear('payment_date', now()->year)->where('status', 'PAID')->sum('amount');
        $outstandingPayment = \App\Models\Invoice::whereNotIn('status', ['PAID', 'CANCELLED'])->sum('total') - \App\Models\Payment::where('status', 'PAID')->sum('amount');
        $overdueInvoice = \App\Models\Invoice::where('status', 'UNPAID')->where('due_date', '<', $today)->count();

        $totalPointsIssued = \App\Models\LoyaltyTransaction::where('type', 'EARN')->sum('points');
        $pointsRedeemed = \App\Models\LoyaltyTransaction::where('type', 'REDEEM')->sum('points');
        $activeLoyaltyMembers = \App\Models\Student::whereHas('loyaltyTransactions', function ($q) {
            $q->where('type', 'EARN');
        })->count();
        $rewardRedemption = \App\Models\RewardRedemption::where('status', 'APPROVED')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'students' => [
                    'total_students' => $totalStudents,
                    'active_students' => $activeStudents,
                    'inactive_students' => $inactiveStudents,
                    'new_students' => $newStudents,
                    'students_on_leave' => $studentsOnLeave,
                ],
                'attendance' => [
                    'today_attendance' => $todayAttendance,
                    'attendance_rate' => round($attendanceRate, 2),
                    'present_today' => $presentToday,
                    'late_today' => $lateToday,
                    'absent_today' => $absentToday,
                ],
                'classes' => [
                    'active_classes' => $activeClasses,
                    'today_classes' => $todayClasses,
                    'available_capacity' => $availableCapacity,
                    'full_classes' => $fullClasses,
                ],
                'payment' => [
                    'today_revenue' => $todayRevenue,
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
            ],
        ]);
    }

    public function teacher()
    {
        $teacher = auth()->user()->teacher;
        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher not found'], 404);
        }

        $today = now()->toDateString();
        $dayOfWeek = now()->format('l');

        $todayClasses = \App\Models\ClassSchedule::with(['class.course', 'class.level', 'class.room'])
            ->where('teacher_id', $teacher->id)
            ->where('day_of_week', $dayOfWeek)
            ->where('status', 'ACTIVE')
            ->orderBy('start_time')
            ->get();

        $upcomingClasses = \App\Models\ClassSchedule::with(['class.course', 'class.level', 'class.room'])
            ->where('teacher_id', $teacher->id)
            ->where('status', 'ACTIVE')
            ->where('effective_from', '>=', $today)
            ->orderBy('start_time')
            ->limit(5)
            ->get();

        $totalStudents = \App\Models\ClassEnrollment::whereHas('class', function ($q) use ($teacher) {
            $q->where('teacher_id', $teacher->id);
        })->where('status', 'ACTIVE')->count();

        $attendanceToday = \App\Models\Attendance::whereHas('class', function ($q) use ($teacher) {
            $q->where('teacher_id', $teacher->id);
        })->whereDate('attendance_date', $today)->count();

        $pendingAttendance = \App\Models\ClassSchedule::where('teacher_id', $teacher->id)
            ->where('day_of_week', $dayOfWeek)
            ->where('status', 'ACTIVE')
            ->get()
            ->filter(function ($schedule) use ($today) {
                return !\App\Models\Attendance::where('schedule_id', $schedule->id)
                    ->whereDate('attendance_date', $today)
                    ->exists();
            })
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'today_classes' => $todayClasses,
                'upcoming_classes' => $upcomingClasses,
                'total_students' => $totalStudents,
                'attendance_today' => $attendanceToday,
                'pending_attendance' => $pendingAttendance,
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
            ],
        ]);
    }
}