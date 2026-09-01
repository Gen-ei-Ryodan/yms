<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with(['user', 'guardians', 'membership']);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('student_code', 'like', "%{$search}%")
                    ->orWhere('student_number', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->membership_status) {
            $query->where('membership_status', $request->membership_status);
        }

        $students = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $students->items(),
            'meta' => [
                'current_page' => $students->currentPage(),
                'last_page' => $students->lastPage(),
                'total' => $students->total(),
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
            'student_number' => 'required|string|max:50',
            'full_name' => 'required|string|max:255',
            'nickname' => 'nullable|string|max:255',
            'gender' => 'required|in:male,female',
            'date_of_birth' => 'required|date',
            'place_of_birth' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'address' => 'nullable|string',
            'school_name' => 'nullable|string',
            'school_grade' => 'nullable|string',
            'join_date' => 'required|date',
            'guardians' => 'nullable|array',
            'guardians.*.name' => 'required|string',
            'guardians.*.relationship' => 'required|in:Father,Mother,Guardian,Other',
            'guardians.*.phone' => 'required|string',
            'guardians.*.email' => 'nullable|email',
            'guardians.*.address' => 'nullable|string',
            'guardians.*.is_primary' => 'boolean',
        ]);

        $user = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'role' => 'student',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('students', 'public');
        }

        $student = Student::create([
            'user_id' => $user->id,
            'student_code' => $this->generateStudentCode(),
            'student_number' => $validated['student_number'],
            'full_name' => $validated['full_name'],
            'nickname' => $validated['nickname'] ?? null,
            'gender' => $validated['gender'],
            'date_of_birth' => $validated['date_of_birth'],
            'place_of_birth' => $validated['place_of_birth'] ?? null,
            'photo' => $validated['photo'] ?? null,
            'address' => $validated['address'] ?? null,
            'school_name' => $validated['school_name'] ?? null,
            'school_grade' => $validated['school_grade'] ?? null,
            'join_date' => $validated['join_date'],
        ]);

        if (!empty($validated['guardians'])) {
            $guardians = [];
            foreach ($validated['guardians'] as $g) {
                $guardian = \App\Models\Guardian::create($g);
                $guardians[] = $guardian->id;
            }
            $student->guardians()->attach($guardians);
        }

        \App\Models\AuditLog::log('create', 'student', $student, [], $validated);

        return response()->json([
            'success' => true,
            'message' => 'Student created successfully',
            'data' => $student->load(['user', 'guardians']),
        ], 201);
    }

    public function show($id)
    {
        $student = Student::with([
            'user', 'guardians', 'membership',
            'enrollments.class.course', 'enrollments.class.level', 'enrollments.class.teacher',
            'attendances', 'subscriptions', 'payments', 'loyaltyTransactions',
            'rewardRedemptions', 'vouchers', 'leaves', 'classTransfers'
        ])->find($id);

        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Student not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $student,
        ]);
    }

    public function update(Request $request, $id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Student not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'phone' => 'sometimes|nullable|string',
            'student_number' => 'sometimes|string|max:50',
            'full_name' => 'sometimes|string|max:255',
            'nickname' => 'sometimes|nullable|string|max:255',
            'gender' => 'sometimes|in:male,female',
            'date_of_birth' => 'sometimes|date',
            'place_of_birth' => 'sometimes|nullable|string',
            'photo' => 'sometimes|nullable|image|mimes:jpg,jpeg,png|max:2048',
            'address' => 'sometimes|nullable|string',
            'school_name' => 'sometimes|nullable|string',
            'school_grade' => 'sometimes|nullable|string',
            'status' => 'sometimes|in:ACTIVE,INACTIVE,SUSPENDED,GRADUATED,TRANSFERRED',
            'join_date' => 'sometimes|date',
            'membership_status' => 'sometimes|in:ACTIVE,EXPIRED,SUSPENDED,CANCELLED',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('students', 'public');
        }

        $oldValues = $student->only(array_keys($validated));
        $student->update($validated);

        if ($request->has('name') || $request->has('email') || $request->has('phone')) {
            $user = $student->user;
            $userData = array_filter([
                'name' => $validated['name'] ?? null,
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'] ?? null,
            ]);
            if (!empty($userData)) {
                $user->update($userData);
            }
        }

        \App\Models\AuditLog::log('update', 'student', $student, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Student updated successfully',
            'data' => $student->load(['user', 'guardians']),
        ]);
    }

    public function destroy($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Student not found'], 404);
        }

        $student->delete();

        \App\Models\AuditLog::log('delete', 'student', $student);

        return response()->json([
            'success' => true,
            'message' => 'Student deleted successfully',
        ]);
    }

    protected function generateStudentCode(): string
    {
        $last = Student::withTrashed()->orderBy('id', 'desc')->first();
        $number = $last ? intval(substr($last->student_code, 4)) + 1 : 1;
        return 'YMS-' . str_pad($number, 5, '0', STR_PAD_LEFT);
    }
}