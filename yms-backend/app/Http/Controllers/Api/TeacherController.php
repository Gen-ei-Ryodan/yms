<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $query = Teacher::with('user');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('teacher_code', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('specialization', 'like', "%{$search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $teachers = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $teachers->items(),
            'meta' => [
                'current_page' => $teachers->currentPage(),
                'last_page' => $teachers->lastPage(),
                'total' => $teachers->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'specialization' => 'nullable|string',
            'join_date' => 'required|date',
        ]);

        $user = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'role' => 'teacher',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('teachers', 'public');
        }

        $teacher = Teacher::create([
            'user_id' => $user->id,
            'teacher_code' => $this->generateTeacherCode(),
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'photo' => $validated['photo'] ?? null,
            'specialization' => $validated['specialization'] ?? null,
            'join_date' => $validated['join_date'],
        ]);

        \App\Models\AuditLog::log('create', 'teacher', $teacher);

        return response()->json([
            'success' => true,
            'message' => 'Teacher created successfully',
            'data' => $teacher->load('user'),
        ], 201);
    }

    public function show($id)
    {
        $teacher = Teacher::with(['user', 'classes.course', 'classes.level', 'classes.room', 'schedules', 'attendances'])->find($id);
        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $teacher]);
    }

    public function update(Request $request, $id)
    {
        $teacher = Teacher::find($id);
        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'phone' => 'sometimes|nullable|string',
            'photo' => 'sometimes|nullable|image|mimes:jpg,jpeg,png|max:2048',
            'specialization' => 'sometimes|nullable|string',
            'join_date' => 'sometimes|date',
            'status' => 'sometimes|in:ACTIVE,INACTIVE',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('teachers', 'public');
        }

        $oldValues = $teacher->only(array_keys($validated));
        $teacher->update($validated);

        if ($request->has('name') || $request->has('email') || $request->has('phone')) {
            $teacher->user->update(array_filter([
                'name' => $validated['name'] ?? null,
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'] ?? null,
            ]));
        }

        \App\Models\AuditLog::log('update', 'teacher', $teacher, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Teacher updated successfully',
            'data' => $teacher->load('user'),
        ]);
    }

    public function destroy($id)
    {
        $teacher = Teacher::find($id);
        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher not found'], 404);
        }

        $teacher->delete();

        \App\Models\AuditLog::log('delete', 'teacher', $teacher);

        return response()->json([
            'success' => true,
            'message' => 'Teacher deleted successfully',
        ]);
    }

    protected function generateTeacherCode(): string
    {
        $last = Teacher::withTrashed()->orderBy('id', 'desc')->first();
        $number = $last ? intval(substr($last->teacher_code, 2)) + 1 : 1;
        return 'T-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}