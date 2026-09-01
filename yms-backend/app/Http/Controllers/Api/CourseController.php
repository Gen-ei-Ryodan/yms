<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::query();

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->level) {
            $query->where('level', $request->level);
        }

        $courses = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $courses->items(),
            'meta' => [
                'current_page' => $courses->currentPage(),
                'last_page' => $courses->lastPage(),
                'total' => $courses->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'required|integer|min:1',
            'level' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'status' => 'in:ACTIVE,INACTIVE',
        ]);

        $course = Course::create($validated);

        \App\Models\AuditLog::log('create', 'course', $course);

        return response()->json([
            'success' => true,
            'message' => 'Course created successfully',
            'data' => $course,
        ], 201);
    }

    public function show($id)
    {
        $course = Course::with(['classes.level', 'classes.teacher', 'classes.room', 'tuitionProducts'])->find($id);
        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $course]);
    }

    public function update(Request $request, $id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        $validated = $request->validate([
            'code' => 'sometimes|string|max:50',
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'duration' => 'sometimes|integer|min:1',
            'level' => 'sometimes|nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:ACTIVE,INACTIVE',
        ]);

        $oldValues = $course->only(array_keys($validated));
        $course->update($validated);

        \App\Models\AuditLog::log('update', 'course', $course, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Course updated successfully',
            'data' => $course,
        ]);
    }

    public function destroy($id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        $course->delete();

        \App\Models\AuditLog::log('delete', 'course', $course);

        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully',
        ]);
    }
}