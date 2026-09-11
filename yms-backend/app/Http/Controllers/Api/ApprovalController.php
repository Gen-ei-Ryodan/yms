<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ApprovalController extends Controller
{
    public function index(Request $request)
    {
        $pendingLeaves = \App\Models\StudentLeave::with(['student.user'])
            ->where('status', 'PENDING')
            ->latest('requested_at')
            ->get()
            ->map(function ($leave) {
                return [
                    'type' => 'LEAVE',
                    'id' => $leave->id,
                    'student' => $leave->student->full_name,
                    'student_code' => $leave->student->student_code,
                    'detail' => "{$leave->start_date} s/d {$leave->end_date}",
                    'reason' => $leave->reason,
                    'requested_at' => $leave->requested_at,
                    'status' => $leave->status,
                ];
            });

        $pendingTransfers = \App\Models\ClassTransfer::with(['student.user', 'fromClass.course', 'toClass.course'])
            ->where('status', 'PENDING')
            ->latest('requested_at')
            ->get()
            ->map(function ($transfer) {
                return [
                    'type' => 'TRANSFER',
                    'id' => $transfer->id,
                    'student' => $transfer->student->full_name,
                    'student_code' => $transfer->student->student_code,
                    'detail' => "{$transfer->fromClass->course->name} → {$transfer->toClass->course->name}",
                    'reason' => $transfer->reason,
                    'requested_at' => $transfer->requested_at,
                    'status' => $transfer->status,
                ];
            });

        $pendingRedemptions = \App\Models\RewardRedemption::with(['student.user', 'reward'])
            ->where('status', 'PENDING')
            ->latest('redeemed_at')
            ->get()
            ->map(function ($redemption) {
                return [
                    'type' => 'REDEMPTION',
                    'id' => $redemption->id,
                    'student' => $redemption->student->full_name,
                    'student_code' => $redemption->student->student_code,
                    'detail' => "{$redemption->reward->name} ({$redemption->points_used} pts)",
                    'reason' => null,
                    'requested_at' => $redemption->redeemed_at,
                    'status' => $redemption->status,
                ];
            });

        $all = $pendingLeaves->concat($pendingTransfers)->concat($pendingRedemptions)
            ->sortByDesc('requested_at')
            ->values();

        return response()->json([
            'success' => true,
            'data' => $all,
            'summary' => [
                'total' => $all->count(),
                'leaves' => $pendingLeaves->count(),
                'transfers' => $pendingTransfers->count(),
                'redemptions' => $pendingRedemptions->count(),
            ],
        ]);
    }

    public function approveLeaves(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array']);
        $count = 0;

        foreach ($ids['ids'] as $id) {
            $leave = \App\Models\StudentLeave::find($id);
            if ($leave && $leave->status === 'PENDING') {
                $leave->update(['status' => 'APPROVED', 'approved_at' => now(), 'approved_by' => auth()->id()]);
                \App\Models\AuditLog::log('approve', 'student_leave', $leave);
                $count++;
            }
        }

        return response()->json([
            'success' => true,
            'message' => "{$count} leave(s) approved",
        ]);
    }

    public function approveTransfers(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array']);
        $count = 0;

        foreach ($ids['ids'] as $id) {
            $transfer = \App\Models\ClassTransfer::find($id);
            if ($transfer && $transfer->status === 'PENDING') {
                $oldEnrollment = \App\Models\ClassEnrollment::where('student_id', $transfer->student_id)
                    ->where('class_id', $transfer->from_class_id)
                    ->where('status', 'ACTIVE')
                    ->first();
                if ($oldEnrollment) {
                    $oldEnrollment->update(['status' => 'TRANSFERRED', 'end_date' => now()]);
                }
                \App\Models\ClassEnrollment::create([
                    'student_id' => $transfer->student_id,
                    'class_id' => $transfer->to_class_id,
                    'enrolled_at' => now(),
                    'start_date' => now(),
                    'status' => 'ACTIVE',
                ]);
                $transfer->update(['status' => 'APPROVED', 'approved_at' => now(), 'approved_by' => auth()->id()]);
                \App\Models\AuditLog::log('approve', 'class_transfer', $transfer);
                $count++;
            }
        }

        return response()->json([
            'success' => true,
            'message' => "{$count} transfer(s) approved",
        ]);
    }
}
