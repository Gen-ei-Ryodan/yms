<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LearningNote;
use Illuminate\Http\Request;

class LearningNoteController extends Controller
{
    public function index(Request $request)
    {
        $query = LearningNote::with(['teacher', 'student.user', 'class.course', 'class.level', 'schedule']);

        if ($request->teacher_id) {
            $query->where('teacher_id', $request->teacher_id);
        }

        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->class_id) {
            $query->where('class_id', $request->class_id);
        }

        $notes = $query->latest('note_date')->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $notes->items(),
            'meta' => [
                'current_page' => $notes->currentPage(),
                'last_page' => $notes->lastPage(),
                'total' => $notes->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'class_id' => 'required|exists:classes,id',
            'schedule_id' => 'nullable|exists:class_schedules,id',
            'note_date' => 'required|date',
            'topic' => 'nullable|string|max:255',
            'content' => 'required|string',
            'homework' => 'nullable|string',
            'teacher_feedback' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
        ]);

        $teacher = auth()->user()->teacher;
        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher not found'], 404);
        }
        $validated['teacher_id'] = $teacher->id;

        $note = LearningNote::create($validated);

        \App\Models\AuditLog::log('create', 'learning_note', $note);

        return response()->json([
            'success' => true,
            'message' => 'Learning note created successfully',
            'data' => $note->load(['student.user', 'class.course']),
        ], 201);
    }

    public function show($id)
    {
        $note = LearningNote::with(['teacher', 'student.user', 'class.course', 'class.level', 'schedule'])->find($id);
        if (!$note) {
            return response()->json(['success' => false, 'message' => 'Learning note not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $note]);
    }

    public function update(Request $request, $id)
    {
        $note = LearningNote::find($id);
        if (!$note) {
            return response()->json(['success' => false, 'message' => 'Learning note not found'], 404);
        }

        $validated = $request->validate([
            'topic' => 'sometimes|nullable|string|max:255',
            'content' => 'sometimes|string',
            'homework' => 'sometimes|nullable|string',
            'teacher_feedback' => 'sometimes|nullable|string',
            'rating' => 'sometimes|nullable|integer|min:1|max:5',
        ]);

        $oldValues = $note->only(array_keys($validated));
        $note->update($validated);

        \App\Models\AuditLog::log('update', 'learning_note', $note, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Learning note updated successfully',
            'data' => $note->load(['student.user', 'class.course']),
        ]);
    }

    public function destroy($id)
    {
        $note = LearningNote::find($id);
        if (!$note) {
            return response()->json(['success' => false, 'message' => 'Learning note not found'], 404);
        }

        $note->delete();

        \App\Models\AuditLog::log('delete', 'learning_note', $note);

        return response()->json([
            'success' => true,
            'message' => 'Learning note deleted successfully',
        ]);
    }

    public function byStudent($studentId)
    {
        $notes = LearningNote::with(['teacher', 'class.course', 'class.level', 'schedule'])
            ->where('student_id', $studentId)
            ->latest('note_date')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notes,
        ]);
    }
}
