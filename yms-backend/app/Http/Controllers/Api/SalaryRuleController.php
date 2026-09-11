<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalaryRule;
use Illuminate\Http\Request;

class SalaryRuleController extends Controller
{
    public function index(Request $request)
    {
        $query = SalaryRule::with(['teacher.user']);

        if ($request->teacher_id) {
            $query->where('teacher_id', $request->teacher_id);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $rules = $query->latest()->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $rules->items(),
            'meta' => [
                'current_page' => $rules->currentPage(),
                'last_page' => $rules->lastPage(),
                'total' => $rules->total(),
            ],
            'methods' => SalaryRule::METHODS,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'calculation_method' => 'required|in:PER_CLASS,PER_STUDENT,PER_SESSION,FIXED_SALARY',
            'rate_per_class' => 'nullable|numeric|min:0',
            'rate_per_student' => 'nullable|numeric|min:0',
            'rate_per_session' => 'nullable|numeric|min:0',
            'fixed_salary' => 'nullable|numeric|min:0',
            'effective_from' => 'required|date',
            'effective_until' => 'nullable|date|after_or_equal:effective_from',
            'is_active' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        $rule = SalaryRule::create($validated);

        \App\Models\AuditLog::log('create', 'salary_rule', $rule);

        return response()->json([
            'success' => true,
            'message' => 'Salary rule created',
            'data' => $rule->load('teacher.user'),
        ], 201);
    }

    public function show($id)
    {
        $rule = SalaryRule::with(['teacher.user'])->find($id);
        if (!$rule) {
            return response()->json(['success' => false, 'message' => 'Rule not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $rule]);
    }

    public function update(Request $request, $id)
    {
        $rule = SalaryRule::find($id);
        if (!$rule) {
            return response()->json(['success' => false, 'message' => 'Rule not found'], 404);
        }

        $validated = $request->validate([
            'calculation_method' => 'sometimes|in:PER_CLASS,PER_STUDENT,PER_SESSION,FIXED_SALARY',
            'rate_per_class' => 'nullable|numeric|min:0',
            'rate_per_student' => 'nullable|numeric|min:0',
            'rate_per_session' => 'nullable|numeric|min:0',
            'fixed_salary' => 'nullable|numeric|min:0',
            'effective_from' => 'sometimes|date',
            'effective_until' => 'nullable|date',
            'is_active' => 'sometimes|boolean',
            'notes' => 'sometimes|nullable|string',
        ]);

        $oldValues = $rule->only(array_keys($validated));
        $rule->update($validated);

        \App\Models\AuditLog::log('update', 'salary_rule', $rule, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Salary rule updated',
            'data' => $rule->load('teacher.user'),
        ]);
    }

    public function destroy($id)
    {
        $rule = SalaryRule::find($id);
        if (!$rule) {
            return response()->json(['success' => false, 'message' => 'Rule not found'], 404);
        }

        $rule->delete();
        \App\Models\AuditLog::log('delete', 'salary_rule', $rule);

        return response()->json(['success' => true, 'message' => 'Salary rule deleted']);
    }

    public function calculate(Request $request)
    {
        $teacherId = $request->teacher_id;
        $period = $request->period ?? now()->format('Y-m');

        $rule = SalaryRule::where('teacher_id', $teacherId)->active()->first();
        if (!$rule) {
            return response()->json(['success' => false, 'message' => 'No active salary rule for this teacher'], 404);
        }

        $teacher = \App\Models\Teacher::find($teacherId);
        $calculation = $rule->calculateForTeacher($teacher);

        return response()->json([
            'success' => true,
            'data' => [
                'teacher_id' => $teacherId,
                'period' => $period,
                'rule' => $rule->only(['id', 'calculation_method', 'rate_per_class', 'rate_per_student', 'rate_per_session', 'fixed_salary']),
                'calculation' => $calculation,
            ],
        ]);
    }
}
