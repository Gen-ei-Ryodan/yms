<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentProgress;
use Illuminate\Http\Request;

class StudentProgressController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentProgress::with(['student.user', 'class.course', 'class.level', 'teacher']);

        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->class_id) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->category) {
            $query->where('category', $request->category);
        }

        $progress = $query->latest('assessed_at')->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $progress->items(),
            'meta' => [
                'current_page' => $progress->currentPage(),
                'last_page' => $progress->lastPage(),
                'total' => $progress->total(),
            ],
        ]);
    }

    public function studentProgress($studentId)
    {
        $student = \App\Models\Student::find($studentId);
        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Student not found'], 404);
        }

        $progress = StudentProgress::with(['class.course', 'class.level', 'teacher'])
            ->where('student_id', $studentId)
            ->latest('assessed_at')
            ->get();

        $summary = [
            'total_assessments' => $progress->count(),
            'average_score' => $progress->where('score')->avg('score'),
            'categories' => $progress->groupBy('category')->map(function ($items) {
                return [
                    'count' => $items->count(),
                    'avg_score' => $items->where('score')->avg('score'),
                ];
            }),
            'latest_level' => $progress->first()?->level,
            'recent_progress' => $progress->take(5),
        ];

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'class_id' => 'required|exists:classes,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'in:TECHNIQUE,THEORY,PRACTICE,PERFORMANCE,GENERAL',
            'score' => 'nullable|integer|min:0|max:100',
            'level' => 'in:BEGINNER,DEVELOPING,PROFICIENT,EXCELLENT',
            'assessed_at' => 'required|date',
            'lessons_completed' => 'nullable|integer|min:0',
            'total_lessons' => 'nullable|integer|min:1',
            'teacher_notes' => 'nullable|string',
        ]);

        $teacher = auth()->user()->teacher;
        if ($teacher) {
            $validated['teacher_id'] = $teacher->id;
        }

        $progress = StudentProgress::create($validated);

        \App\Models\AuditLog::log('create', 'student_progress', $progress);

        return response()->json([
            'success' => true,
            'message' => 'Progress recorded successfully',
            'data' => $progress->load(['student.user', 'class.course', 'teacher']),
        ], 201);
    }

    public function show($id)
    {
        $progress = StudentProgress::with(['student.user', 'class.course', 'class.level', 'teacher'])->find($id);
        if (!$progress) {
            return response()->json(['success' => false, 'message' => 'Progress not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $progress]);
    }

    public function destroy($id)
    {
        $progress = StudentProgress::find($id);
        if (!$progress) {
            return response()->json(['success' => false, 'message' => 'Progress not found'], 404);
        }

        $progress->delete();

        \App\Models\AuditLog::log('delete', 'student_progress', $progress);

        return response()->json([
            'success' => true,
            'message' => 'Progress deleted successfully',
        ]);
    }
}
