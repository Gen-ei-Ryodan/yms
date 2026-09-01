<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function studentReport(Request $request)
    {
        $query = \App\Models\Student::with(['user', 'guardians', 'enrollments.class.course', 'enrollments.class.level', 'enrollments.class.teacher']);

        if ($request->course_id) {
            $query->whereHas('enrollments', function ($q) use ($request) {
                $q->where('class_id', function ($qq) use ($request) {
                    $qq->select('id')->from('classes')->where('course_id', $request->course_id);
                });
            });
        }

        if ($request->level_id) {
            $query->whereHas('enrollments.class', function ($q) use ($request) {
                $q->where('level_id', $request->level_id);
            });
        }

        if ($request->class_id) {
            $query->whereHas('enrollments', function ($q) use ($request) {
                $q->where('class_id', $request->class_id);
            });
        }

        if ($request->teacher_id) {
            $query->whereHas('enrollments.class', function ($q) use ($request) {
                $q->where('teacher_id', $request->teacher_id);
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->join_date_from) {
            $query->where('join_date', '>=', $request->join_date_from);
        }

        if ($request->join_date_to) {
            $query->where('join_date', '<=', $request->join_date_to);
        }

        $students = $query->get();

        return response()->json([
            'success' => true,
            'data' => $students,
        ]);
    }

    public function attendanceReport(Request $request)
    {
        $query = \App\Models\Attendance::with(['student.user', 'class.course', 'class.level', 'schedule']);

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('attendance_date', [$request->start_date, $request->end_date]);
        }

        if ($request->class_id) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->teacher_id) {
            $query->whereHas('class', function ($q) use ($request) {
                $q->where('teacher_id', $request->teacher_id);
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $attendances = $query->latest('attendance_date')->get();

        $report = $attendances->map(function ($a) {
            return [
                'date' => $a->attendance_date,
                'student' => $a->student->full_name,
                'student_code' => $a->student->student_code,
                'class' => $a->class->course->name,
                'teacher' => $a->class->teacher->name,
                'check_in' => $a->check_in_time,
                'status' => $a->status,
            ];
        });

        $total = $attendances->count();
        $present = $attendances->where('status', 'PRESENT')->count();
        $late = $attendances->where('status', 'LATE')->count();
        $absent = $attendances->where('status', 'ABSENT')->count();
        $leave = $attendances->where('status', 'ON_LEAVE')->count();
        $rate = $total > 0 ? (($present + $late) / $total) * 100 : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_sessions' => $total,
                    'present' => $present,
                    'late' => $late,
                    'absent' => $absent,
                    'leave' => $leave,
                    'attendance_rate' => round($rate, 2),
                ],
                'details' => $report,
            ],
        ]);
    }

    public function revenueReport(Request $request)
    {
        $query = \App\Models\Payment::with(['student.user', 'subscription.product.course', 'invoice'])
            ->where('status', 'PAID');

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('payment_date', [$request->start_date, $request->end_date]);
        }

        if ($request->payment_method) {
            $query->where('payment_method', $request->payment_method);
        }

        $payments = $query->latest()->get();

        $report = $payments->map(function ($p) {
            return [
                'date' => $p->payment_date,
                'invoice' => $p->invoice?->invoice_number,
                'student' => $p->student->full_name,
                'amount' => $p->amount,
                'payment_method' => $p->payment_method,
                'status' => $p->status,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'total_revenue' => $payments->sum('amount'),
                'total_transactions' => $payments->count(),
                'details' => $report,
            ],
        ]);
    }

    public function loyaltyReport(Request $request)
    {
        $students = \App\Models\Student::with(['loyaltyTransactions', 'enrollments.class.course'])->get();

        $report = $students->map(function ($student) {
            $transactions = $student->loyaltyTransactions;
            $earned = $transactions->where('type', 'EARN')->sum('points');
            $redeemed = $transactions->where('type', 'REDEEM')->sum('points');
            $expired = $transactions->where('type', 'EXPIRED')->sum('points');
            $balance = $student->loyalty_balance;

            $tier = \App\Models\LoyaltyTier::where('minimum_points', '<=', $balance)
                ->where('maximum_points', '>=', $balance)
                ->where('status', 'ACTIVE')
                ->first();

            return [
                'student' => $student->full_name,
                'student_code' => $student->student_code,
                'points_earned' => $earned,
                'points_redeemed' => $redeemed,
                'points_expired' => $expired,
                'current_balance' => $balance,
                'tier' => $tier?->name ?? 'Bronze',
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $report,
        ]);
    }

    public function classReport()
    {
        $classes = \App\Models\ClassModel::with(['course', 'level', 'teacher.user', 'room', 'enrollments.student.user', 'schedules'])->get();

        $report = $classes->map(function ($class) {
            $enrolled = $class->enrollments->where('status', 'ACTIVE')->count();
            $totalSessions = \App\Models\Attendance::where('class_id', $class->id)->count();
            $present = \App\Models\Attendance::where('class_id', $class->id)->where('status', 'PRESENT')->count();

            return [
                'class_code' => $class->class_code,
                'course' => $class->course->name,
                'level' => $class->level->name,
                'teacher' => $class->teacher->name,
                'room' => $class->room->name,
                'capacity' => $class->capacity,
                'enrolled' => $enrolled,
                'available' => $class->capacity - $enrolled,
                'total_sessions' => $totalSessions,
                'present_count' => $present,
                'attendance_rate' => $totalSessions > 0 ? round(($present / $totalSessions) * 100, 2) : 0,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $report,
        ]);
    }
}