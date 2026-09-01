<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentLeave;
use Illuminate\Http\Request;

class StudentLeaveController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentLeave::with(['student.user', 'approvedBy']);

        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $leaves = $query->latest()->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $leaves->items(),
            'meta' => [
                'current_page' => $leaves->currentPage(),
                'last_page' => $leaves->lastPage(),
                'total' => $leaves->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $validated['requested_at'] = now();
        $validated['status'] = 'PENDING';

        $leave = StudentLeave::create($validated);

        \App\Models\AuditLog::log('create', 'student_leave', $leave);

        return response()->json([
            'success' => true,
            'message' => 'Leave request created successfully',
            'data' => $leave->load(['student.user']),
        ], 201);
    }

    public function show($id)
    {
        $leave = StudentLeave::with(['student.user', 'approvedBy'])->find($id);
        if (!$leave) {
            return response()->json(['success' => false, 'message' => 'Leave not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $leave]);
    }

    public function approve($id)
    {
        $leave = StudentLeave::find($id);
        if (!$leave) {
            return response()->json(['success' => false, 'message' => 'Leave not found'], 404);
        }

        if ($leave->status !== 'PENDING') {
            return response()->json([
                'success' => false,
                'message' => 'Leave has already been processed',
            ], 422);
        }

        $leave->update([
            'status' => 'APPROVED',
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ]);

        \App\Models\AuditLog::log('approve', 'student_leave', $leave);

        return response()->json([
            'success' => true,
            'message' => 'Leave approved successfully',
            'data' => $leave->load(['student.user', 'approvedBy']),
        ]);
    }

    public function reject($id)
    {
        $leave = StudentLeave::find($id);
        if (!$leave) {
            return response()->json(['success' => false, 'message' => 'Leave not found'], 404);
        }

        if ($leave->status !== 'PENDING') {
            return response()->json([
                'success' => false,
                'message' => 'Leave has already been processed',
            ], 422);
        }

        $leave->update([
            'status' => 'REJECTED',
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ]);

        \App\Models\AuditLog::log('reject', 'student_leave', $leave);

        return response()->json([
            'success' => true,
            'message' => 'Leave rejected successfully',
            'data' => $leave->load(['student.user', 'approvedBy']),
        ]);
    }

    public function cancel($id)
    {
        $leave = StudentLeave::find($id);
        if (!$leave) {
            return response()->json(['success' => false, 'message' => 'Leave not found'], 404);
        }

        $leave->update(['status' => 'CANCELLED']);

        \App\Models\AuditLog::log('cancel', 'student_leave', $leave);

        return response()->json([
            'success' => true,
            'message' => 'Leave cancelled successfully',
        ]);
    }
}