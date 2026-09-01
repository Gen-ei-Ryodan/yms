<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with(['student.user', 'class.course', 'schedule']);

        if ($request->date) {
            $query->whereDate('attendance_date', $request->date);
        }

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('attendance_date', [$request->start_date, $request->end_date]);
        }

        if ($request->class_id) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->schedule_id) {
            $query->where('schedule_id', $request->schedule_id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $attendances = $query->latest('attendance_date')->paginate($request->per_page ?? 15);

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
            'student_code' => 'required|string',
            'schedule_id' => 'required|exists:class_schedules,id',
            'method' => 'in:QR,BARCODE,MANUAL',
            'notes' => 'nullable|string',
        ]);

        $student = \App\Models\Student::where('student_code', $validated['student_code'])->first();
        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found',
            ], 404);
        }

        $schedule = \App\Models\ClassSchedule::find($validated['schedule_id']);
        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule not found',
            ], 404);
        }

        $enrollment = \App\Models\ClassEnrollment::where('student_id', $student->id)
            ->where('class_id', $schedule->class_id)
            ->where('status', 'ACTIVE')
            ->first();

        if (!$enrollment) {
            return response()->json([
                'success' => false,
                'message' => 'Student is not enrolled in this class',
            ], 422);
        }

        $today = now()->toDateString();
        $existing = Attendance::where('student_id', $student->id)
            ->where('schedule_id', $validated['schedule_id'])
            ->whereDate('attendance_date', $today)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Duplicate attendance detected',
            ], 422);
        }

        $lateThreshold = (int) \App\Models\SystemSetting::getValue('late_threshold_minutes', 10);
        $checkInTime = now()->format('H:i:s');
        $scheduleStartTime = $schedule->start_time->format('H:i:s');
        $checkInMinutes = $this->timeToMinutes($checkInTime);
        $scheduleMinutes = $this->timeToMinutes($scheduleStartTime);
        $isLate = ($checkInMinutes - $scheduleMinutes) > $lateThreshold;

        $attendance = Attendance::create([
            'student_id' => $student->id,
            'class_id' => $schedule->class_id,
            'schedule_id' => $validated['schedule_id'],
            'attendance_date' => $today,
            'check_in_time' => $checkInTime,
            'status' => $isLate ? 'LATE' : 'PRESENT',
            'method' => $validated['method'] ?? 'MANUAL',
            'notes' => $validated['notes'] ?? null,
            'recorded_by' => auth()->id(),
        ]);

        \App\Models\AuditLog::log('check_in', 'attendance', $attendance);

        return response()->json([
            'success' => true,
            'message' => $isLate ? 'Late attendance recorded' : 'Attendance recorded successfully',
            'data' => $attendance->load(['student.user', 'class.course', 'schedule']),
        ], 201);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'class_id' => 'required|exists:classes,id',
            'schedule_id' => 'required|exists:class_schedules,id',
            'attendance_date' => 'required|date',
            'check_in_time' => 'nullable|date_format:H:i:s',
            'check_out_time' => 'nullable|date_format:H:i:s',
            'status' => 'in:PRESENT,LATE,ABSENT,EXCUSED,ON_LEAVE',
            'method' => 'in:QR,BARCODE,MANUAL',
            'notes' => 'nullable|string',
        ]);

        $attendance = Attendance::create($validated + ['recorded_by' => auth()->id()]);

        \App\Models\AuditLog::log('create', 'attendance', $attendance);

        return response()->json([
            'success' => true,
            'message' => 'Attendance created successfully',
            'data' => $attendance->load(['student.user', 'class.course', 'schedule']),
        ], 201);
    }

    public function show($id)
    {
        $attendance = Attendance::with(['student.user', 'class.course', 'schedule', 'recordedBy'])->find($id);
        if (!$attendance) {
            return response()->json(['success' => false, 'message' => 'Attendance not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $attendance]);
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::find($id);
        if (!$attendance) {
            return response()->json(['success' => false, 'message' => 'Attendance not found'], 404);
        }

        $validated = $request->validate([
            'check_in_time' => 'nullable|date_format:H:i:s',
            'check_out_time' => 'nullable|date_format:H:i:s',
            'status' => 'in:PRESENT,LATE,ABSENT,EXCUSED,ON_LEAVE',
            'method' => 'in:QR,BARCODE,MANUAL',
            'notes' => 'nullable|string',
        ]);

        $oldValues = $attendance->only(array_keys($validated));
        $attendance->update($validated);

        \App\Models\AuditLog::log('update', 'attendance', $attendance, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Attendance updated successfully',
            'data' => $attendance->load(['student.user', 'class.course', 'schedule']),
        ]);
    }

    public function destroy($id)
    {
        $attendance = Attendance::find($id);
        if (!$attendance) {
            return response()->json(['success' => false, 'message' => 'Attendance not found'], 404);
        }

        $attendance->delete();

        \App\Models\AuditLog::log('delete', 'attendance', $attendance);

        return response()->json([
            'success' => true,
            'message' => 'Attendance deleted successfully',
        ]);
    }

    public function studentHistory(Request $request, $studentId)
    {
        $student = \App\Models\Student::find($studentId);
        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Student not found'], 404);
        }

        $query = Attendance::with(['class.course', 'class.level', 'schedule'])
            ->where('student_id', $studentId);

        if ($request->month) {
            $year = $request->year ?? now()->year;
            $month = $request->month;
            $query->whereYear('attendance_date', $year)->whereMonth('attendance_date', $month);
        }

        if ($request->class_id) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $history = $query->latest('attendance_date')->get();

        return response()->json([
            'success' => true,
            'data' => $history,
        ]);
    }

    protected function timeToMinutes(string $time): int
    {
        $parts = explode(':', $time);
        return (int)$parts[0] * 60 + (int)$parts[1];
    }
}
