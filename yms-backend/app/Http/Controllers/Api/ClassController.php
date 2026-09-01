<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassModel;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    public function index(Request $request)
    {
        $query = ClassModel::with(['course', 'level', 'teacher.user', 'room']);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('class_code', 'like', "%{$search}%")
                    ->orWhereHas('course', function ($c) use ($search) {
                        $c->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->course_id) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->level_id) {
            $query->where('level_id', $request->level_id);
        }

        if ($request->teacher_id) {
            $query->where('teacher_id', $request->teacher_id);
        }

        if ($request->room_id) {
            $query->where('room_id', $request->room_id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $classes = $query->paginate($request->per_page ?? 15);

        $data = $classes->items();
        foreach ($data as $class) {
            $class->enrolled_count = $class->enrolled_count;
            $class->is_full = $class->isFull();
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'meta' => [
                'current_page' => $classes->currentPage(),
                'last_page' => $classes->lastPage(),
                'total' => $classes->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'level_id' => 'required|exists:levels,id',
            'teacher_id' => 'required|exists:teachers,id',
            'room_id' => 'required|exists:rooms,id',
            'capacity' => 'required|integer|min:1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'in:ACTIVE,INACTIVE,FULL,COMPLETED',
        ]);

        $validated['class_code'] = $this->generateClassCode();

        $class = ClassModel::create($validated);

        \App\Models\AuditLog::log('create', 'class', $class);

        return response()->json([
            'success' => true,
            'message' => 'Class created successfully',
            'data' => $class->load(['course', 'level', 'teacher.user', 'room']),
        ], 201);
    }

    public function show($id)
    {
        $class = ClassModel::with([
            'course', 'level', 'teacher.user', 'room',
            'schedules', 'enrollments.student.user'
        ])->find($id);

        if (!$class) {
            return response()->json(['success' => false, 'message' => 'Class not found'], 404);
        }

        $class->enrolled_count = $class->enrolled_count;
        $class->is_full = $class->isFull();

        return response()->json(['success' => true, 'data' => $class]);
    }

    public function update(Request $request, $id)
    {
        $class = ClassModel::find($id);
        if (!$class) {
            return response()->json(['success' => false, 'message' => 'Class not found'], 404);
        }

        $validated = $request->validate([
            'course_id' => 'sometimes|exists:courses,id',
            'level_id' => 'sometimes|exists:levels,id',
            'teacher_id' => 'sometimes|exists:teachers,id',
            'room_id' => 'sometimes|exists:rooms,id',
            'capacity' => 'sometimes|integer|min:1',
            'start_date' => 'sometimes|nullable|date',
            'end_date' => 'sometimes|nullable|date',
            'status' => 'sometimes|in:ACTIVE,INACTIVE,FULL,COMPLETED',
        ]);

        $oldValues = $class->only(array_keys($validated));
        $class->update($validated);

        if ($class->isFull()) {
            $class->update(['status' => 'FULL']);
        }

        \App\Models\AuditLog::log('update', 'class', $class, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Class updated successfully',
            'data' => $class->load(['course', 'level', 'teacher.user', 'room']),
        ]);
    }

    public function destroy($id)
    {
        $class = ClassModel::find($id);
        if (!$class) {
            return response()->json(['success' => false, 'message' => 'Class not found'], 404);
        }

        $class->delete();

        \App\Models\AuditLog::log('delete', 'class', $class);

        return response()->json([
            'success' => true,
            'message' => 'Class deleted successfully',
        ]);
    }

    protected function generateClassCode(): string
    {
        $last = ClassModel::withTrashed()->orderBy('id', 'desc')->first();
        $number = $last ? intval(substr($last->class_code, 4)) + 1 : 1;
        return 'CLS-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}