<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassEnrollment;
use Illuminate\Http\Request;

class ClassEnrollmentController extends Controller
{
    public function index(Request $request)
    {
        $query = ClassEnrollment::with(['student.user', 'class.course', 'class.level', 'class.teacher']);

        if ($request->class_id) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $enrollments = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $enrollments->items(),
            'meta' => [
                'current_page' => $enrollments->currentPage(),
                'last_page' => $enrollments->lastPage(),
                'total' => $enrollments->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'class_id' => 'required|exists:classes,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
        ]);

        $class = \App\Models\ClassModel::find($validated['class_id']);
        if ($class && $class->isFull()) {
            return response()->json([
                'success' => false,
                'message' => 'Class is full',
            ], 422);
        }

        $existing = ClassEnrollment::where('student_id', $validated['student_id'])
            ->where('class_id', $validated['class_id'])
            ->where('status', 'ACTIVE')
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Student is already enrolled in this class',
            ], 422);
        }

        $enrollment = ClassEnrollment::create([
            'student_id' => $validated['student_id'],
            'class_id' => $validated['class_id'],
            'enrolled_at' => now(),
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'] ?? null,
            'status' => 'ACTIVE',
        ]);

        \App\Models\AuditLog::log('create', 'enrollment', $enrollment);

        return response()->json([
            'success' => true,
            'message' => 'Enrollment created successfully',
            'data' => $enrollment->load(['student.user', 'class.course']),
        ], 201);
    }

    public function show($id)
    {
        $enrollment = ClassEnrollment::with([
            'student.user', 'student.guardians',
            'class.course', 'class.level', 'class.teacher', 'class.room'
        ])->find($id);

        if (!$enrollment) {
            return response()->json(['success' => false, 'message' => 'Enrollment not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $enrollment]);
    }

    public function update(Request $request, $id)
    {
        $enrollment = ClassEnrollment::find($id);
        if (!$enrollment) {
            return response()->json(['success' => false, 'message' => 'Enrollment not found'], 404);
        }

        $validated = $request->validate([
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|nullable|date',
            'status' => 'sometimes|in:ACTIVE,TRANSFERRED,COMPLETED,DROPPED,ON_LEAVE',
        ]);

        $oldValues = $enrollment->only(array_keys($validated));
        $enrollment->update($validated);

        \App\Models\AuditLog::log('update', 'enrollment', $enrollment, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Enrollment updated successfully',
            'data' => $enrollment->load(['student.user', 'class.course']),
        ]);
    }

    public function destroy($id)
    {
        $enrollment = ClassEnrollment::find($id);
        if (!$enrollment) {
            return response()->json(['success' => false, 'message' => 'Enrollment not found'], 404);
        }

        $enrollment->delete();

        \App\Models\AuditLog::log('delete', 'enrollment', $enrollment);

        return response()->json([
            'success' => true,
            'message' => 'Enrollment deleted successfully',
        ]);
    }

    public function drop(Request $request, $id)
    {
        $enrollment = ClassEnrollment::find($id);
        if (!$enrollment) {
            return response()->json(['success' => false, 'message' => 'Enrollment not found'], 404);
        }

        $enrollment->update(['status' => 'DROPPED', 'end_date' => now()]);

        \App\Models\AuditLog::log('drop', 'enrollment', $enrollment);

        return response()->json([
            'success' => true,
            'message' => 'Student dropped from class successfully',
        ]);
    }
}