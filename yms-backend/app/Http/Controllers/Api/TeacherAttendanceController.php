<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeacherAttendance;
use Illuminate\Http\Request;

class TeacherAttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = TeacherAttendance::with('teacher.user');

        if ($request->teacher_id) {
            $query->where('teacher_id', $request->teacher_id);
        }

        if ($request->date) {
            $query->whereDate('date', $request->date);
        }

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $attendances = $query->latest('date')->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $attendances->items(),
            'meta' => [
                'current_page' => $attendances->currentPage(),
                'last_page' => $attendances->lastPage(),
                'total' => $attendances->total(),
            ],
        ]);
    }

    public function checkIn(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'method' => 'in:QR,MANUAL',
            'notes' => 'nullable|string',
        ]);

        $teacher = \App\Models\Teacher::find($validated['teacher_id']);
        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher not found'], 404);
        }

        $today = now()->toDateString();
        $existing = TeacherAttendance::where('teacher_id', $validated['teacher_id'])
            ->whereDate('date', $today)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher has already checked in today',
            ], 422);
        }

        $attendance = TeacherAttendance::create([
            'teacher_id' => $validated['teacher_id'],
            'date' => $today,
            'check_in' => now()->format('H:i:s'),
            'status' => 'PRESENT',
            'method' => $validated['method'] ?? 'MANUAL',
            'notes' => $validated['notes'] ?? null,
        ]);

        \App\Models\AuditLog::log('check_in', 'teacher_attendance', $attendance);

        return response()->json([
            'success' => true,
            'message' => 'Teacher check-in recorded successfully',
            'data' => $attendance->load('teacher.user'),
        ], 201);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'date' => 'required|date',
            'check_in' => 'nullable|date_format:H:i:s',
            'check_out' => 'nullable|date_format:H:i:s',
            'status' => 'in:PRESENT,LATE,ABSENT,LEAVE',
            'method' => 'in:QR,MANUAL,SYSTEM',
            'notes' => 'nullable|string',
        ]);

        $attendance = TeacherAttendance::create($validated);

        \App\Models\AuditLog::log('create', 'teacher_attendance', $attendance);

        return response()->json([
            'success' => true,
            'message' => 'Teacher attendance created successfully',
            'data' => $attendance->load('teacher.user'),
        ], 201);
    }

    public function show($id)
    {
        $attendance = TeacherAttendance::with('teacher.user')->find($id);
        if (!$attendance) {
            return response()->json(['success' => false, 'message' => 'Attendance not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $attendance]);
    }

    public function update(Request $request, $id)
    {
        $attendance = TeacherAttendance::find($id);
        if (!$attendance) {
            return response()->json(['success' => false, 'message' => 'Attendance not found'], 404);
        }

        $validated = $request->validate([
            'check_in' => 'sometimes|nullable|date_format:H:i:s',
            'check_out' => 'sometimes|nullable|date_format:H:i:s',
            'status' => 'sometimes|in:PRESENT,LATE,ABSENT,LEAVE',
            'method' => 'sometimes|in:QR,MANUAL,SYSTEM',
            'notes' => 'sometimes|nullable|string',
        ]);

        $oldValues = $attendance->only(array_keys($validated));
        $attendance->update($validated);

        \App\Models\AuditLog::log('update', 'teacher_attendance', $attendance, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Teacher attendance updated successfully',
            'data' => $attendance->load('teacher.user'),
        ]);
    }

    public function destroy($id)
    {
        $attendance = TeacherAttendance::find($id);
        if (!$attendance) {
            return response()->json(['success' => false, 'message' => 'Attendance not found'], 404);
        }

        $attendance->delete();

        \App\Models\AuditLog::log('delete', 'teacher_attendance', $attendance);

        return response()->json([
            'success' => true,
            'message' => 'Teacher attendance deleted successfully',
        ]);
    }
}