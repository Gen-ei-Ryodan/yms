<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassTransfer;
use Illuminate\Http\Request;

class ClassTransferController extends Controller
{
    public function index(Request $request)
    {
        $query = ClassTransfer::with([
            'student.user', 'fromClass.course', 'toClass.course', 'approvedBy'
        ])->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        $transfers = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $transfers->items(),
            'meta' => [
                'current_page' => $transfers->currentPage(),
                'last_page' => $transfers->lastPage(),
                'total' => $transfers->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'from_class_id' => 'required|exists:classes,id',
            'to_class_id' => 'required|exists:classes,id|different:from_class_id',
            'reason' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $toClass = \App\Models\ClassModel::find($validated['to_class_id']);
        if ($toClass && $toClass->isFull()) {
            return response()->json([
                'success' => false,
                'message' => 'Target class is full',
            ], 422);
        }

        $transfer = ClassTransfer::create([
            'student_id' => $validated['student_id'],
            'from_class_id' => $validated['from_class_id'],
            'to_class_id' => $validated['to_class_id'],
            'reason' => $validated['reason'],
            'notes' => $validated['notes'] ?? null,
            'requested_at' => now(),
            'status' => 'PENDING',
        ]);

        \App\Models\AuditLog::log('create', 'class_transfer', $transfer);

        return response()->json([
            'success' => true,
            'message' => 'Class transfer request created successfully',
            'data' => $transfer->load(['student.user', 'fromClass.course', 'toClass.course']),
        ], 201);
    }

    public function show($id)
    {
        $transfer = ClassTransfer::with([
            'student.user', 'student.guardians',
            'fromClass.course', 'fromClass.level', 'fromClass.teacher',
            'toClass.course', 'toClass.level', 'toClass.teacher',
            'approvedBy'
        ])->find($id);

        if (!$transfer) {
            return response()->json(['success' => false, 'message' => 'Transfer not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $transfer]);
    }

    public function approve(Request $request, $id)
    {
        $transfer = ClassTransfer::find($id);
        if (!$transfer) {
            return response()->json(['success' => false, 'message' => 'Transfer not found'], 404);
        }

        if ($transfer->status !== 'PENDING') {
            return response()->json([
                'success' => false,
                'message' => 'Transfer has already been processed',
            ], 422);
        }

        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        \Illuminate\Support\Facades\DB::transaction(function () use ($transfer, $validated) {
            $oldEnrollment = \App\Models\ClassEnrollment::where('student_id', $transfer->student_id)
                ->where('class_id', $transfer->from_class_id)
                ->where('status', 'ACTIVE')
                ->first();

            if ($oldEnrollment) {
                $oldEnrollment->update(['status' => 'TRANSFERRED', 'end_date' => now()]);
            }

            $newEnrollment = \App\Models\ClassEnrollment::create([
                'student_id' => $transfer->student_id,
                'class_id' => $transfer->to_class_id,
                'enrolled_at' => now(),
                'start_date' => now(),
                'status' => 'ACTIVE',
            ]);

            $transfer->update([
                'status' => 'APPROVED',
                'approved_at' => now(),
                'approved_by' => auth()->id(),
                'notes' => $validated['notes'] ?? null,
            ]);

            \App\Models\AuditLog::log('approve', 'class_transfer', $transfer);
        });

        return response()->json([
            'success' => true,
            'message' => 'Transfer approved successfully',
            'data' => $transfer->load(['student.user', 'fromClass.course', 'toClass.course', 'approvedBy']),
        ]);
    }

    public function reject(Request $request, $id)
    {
        $transfer = ClassTransfer::find($id);
        if (!$transfer) {
            return response()->json(['success' => false, 'message' => 'Transfer not found'], 404);
        }

        if ($transfer->status !== 'PENDING') {
            return response()->json([
                'success' => false,
                'message' => 'Transfer has already been processed',
            ], 422);
        }

        $validated = $request->validate([
            'notes' => 'required|string',
        ]);

        $transfer->update([
            'status' => 'REJECTED',
            'approved_at' => now(),
            'approved_by' => auth()->id(),
            'notes' => $validated['notes'],
        ]);

        \App\Models\AuditLog::log('reject', 'class_transfer', $transfer);

        return response()->json([
            'success' => true,
            'message' => 'Transfer rejected successfully',
            'data' => $transfer->load(['student.user', 'fromClass.course', 'toClass.course', 'approvedBy']),
        ]);
    }

    public function cancel($id)
    {
        $transfer = ClassTransfer::find($id);
        if (!$transfer) {
            return response()->json(['success' => false, 'message' => 'Transfer not found'], 404);
        }

        $transfer->update(['status' => 'CANCELLED']);

        \App\Models\AuditLog::log('cancel', 'class_transfer', $transfer);

        return response()->json([
            'success' => true,
            'message' => 'Transfer cancelled successfully',
        ]);
    }
}