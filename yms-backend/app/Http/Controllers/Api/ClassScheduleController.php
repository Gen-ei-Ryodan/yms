<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassSchedule;
use Illuminate\Http\Request;

class ClassScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = ClassSchedule::with(['class.course', 'class.level', 'teacher.user', 'room']);

        if ($request->class_id) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->teacher_id) {
            $query->where('teacher_id', $request->teacher_id);
        }

        if ($request->room_id) {
            $query->where('room_id', $request->room_id);
        }

        if ($request->day_of_week) {
            $query->where('day_of_week', $request->day_of_week);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $schedules = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $schedules->items(),
            'meta' => [
                'current_page' => $schedules->currentPage(),
                'last_page' => $schedules->lastPage(),
                'total' => $schedules->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'teacher_id' => 'required|exists:teachers,id',
            'room_id' => 'required|exists:rooms,id',
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s|after:start_time',
            'effective_from' => 'nullable|date',
            'effective_until' => 'nullable|date',
        ]);

        $conflict = $this->checkConflict($validated);
        if ($conflict) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule conflict detected: ' . $conflict,
            ], 422);
        }

        $schedule = ClassSchedule::create($validated);

        \App\Models\AuditLog::log('create', 'schedule', $schedule);

        return response()->json([
            'success' => true,
            'message' => 'Schedule created successfully',
            'data' => $schedule->load(['class.course', 'teacher.user', 'room']),
        ], 201);
    }

    public function show($id)
    {
        $schedule = ClassSchedule::with([
            'class.course', 'class.level', 'teacher.user', 'room',
            'attendances.student.user'
        ])->find($id);

        if (!$schedule) {
            return response()->json(['success' => false, 'message' => 'Schedule not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $schedule]);
    }

    public function update(Request $request, $id)
    {
        $schedule = ClassSchedule::find($id);
        if (!$schedule) {
            return response()->json(['success' => false, 'message' => 'Schedule not found'], 404);
        }

        $validated = $request->validate([
            'class_id' => 'sometimes|exists:classes,id',
            'teacher_id' => 'sometimes|exists:teachers,id',
            'room_id' => 'sometimes|exists:rooms,id',
            'day_of_week' => 'sometimes|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'sometimes|date_format:H:i:s',
            'end_time' => 'sometimes|date_format:H:i:s',
            'effective_from' => 'sometimes|nullable|date',
            'effective_until' => 'sometimes|nullable|date',
            'status' => 'sometimes|in:ACTIVE,INACTIVE',
        ]);

        $conflict = $this->checkConflict($validated, $id);
        if ($conflict) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule conflict detected: ' . $conflict,
            ], 422);
        }

        $oldValues = $schedule->only(array_keys($validated));
        $schedule->update($validated);

        \App\Models\AuditLog::log('update', 'schedule', $schedule, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Schedule updated successfully',
            'data' => $schedule->load(['class.course', 'teacher.user', 'room']),
        ]);
    }

    public function destroy($id)
    {
        $schedule = ClassSchedule::find($id);
        if (!$schedule) {
            return response()->json(['success' => false, 'message' => 'Schedule not found'], 404);
        }

        $schedule->delete();

        \App\Models\AuditLog::log('delete', 'schedule', $schedule);

        return response()->json([
            'success' => true,
            'message' => 'Schedule deleted successfully',
        ]);
    }

    public function today()
    {
        $dayOfWeek = now()->format('l');

        $schedules = ClassSchedule::with(['class.course', 'class.level', 'teacher.user', 'room'])
            ->where('day_of_week', $dayOfWeek)
            ->where('status', 'ACTIVE')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $schedules,
        ]);
    }

    protected function checkConflict(array $data, ?int $excludeId = null): ?string
    {
        $day = $data['day_of_week'] ?? null;
        $start = $data['start_time'] ?? null;
        $end = $data['end_time'] ?? null;
        $teacherId = $data['teacher_id'] ?? null;
        $roomId = $data['room_id'] ?? null;

        if (!$day || !$start || !$end) {
            return null;
        }

        $query = ClassSchedule::where('day_of_week', $day)
            ->where(function ($q) use ($start, $end) {
                $q->where(function ($qq) use ($start, $end) {
                    $qq->where('start_time', '<', $end)->where('end_time', '>', $start);
                });
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        if ($teacherId) {
            $teacherConflict = (clone $query)->where('teacher_id', $teacherId)->first();
            if ($teacherConflict) {
                return "Teacher is already scheduled at this time";
            }
        }

        if ($roomId) {
            $roomConflict = (clone $query)->where('room_id', $roomId)->first();
            if ($roomConflict) {
                return "Room is already booked at this time";
            }
        }

        return null;
    }
}