<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeacherSalary;
use Illuminate\Http\Request;

class TeacherSalaryController extends Controller
{
    public function index(Request $request)
    {
        $query = TeacherSalary::with(['teacher']);

        if ($request->teacher_id) {
            $query->where('teacher_id', $request->teacher_id);
        }

        if ($request->period) {
            $query->where('period', $request->period);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $salaries = $query->latest('period')->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $salaries->items(),
            'meta' => [
                'current_page' => $salaries->currentPage(),
                'last_page' => $salaries->lastPage(),
                'total' => $salaries->total(),
            ],
        ]);
    }

    public function mySalary(Request $request)
    {
        $teacher = auth()->user()->teacher;
        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher not found'], 404);
        }

        $query = TeacherSalary::where('teacher_id', $teacher->id)->latest('period');

        if ($request->period) {
            $query->where('period', $request->period);
        }

        $salaries = $query->get();

        $summary = [
            'total_earned' => $salaries->where('status', 'PAID')->sum('total_salary'),
            'total_pending' => $salaries->where('status', 'PENDING')->sum('total_salary'),
            'total_bonus' => $salaries->sum('bonus'),
            'total_deductions' => $salaries->sum('deductions'),
            'total_hours' => $salaries->sum('total_hours'),
            'total_classes' => $salaries->sum('total_classes'),
            'salaries' => $salaries,
        ];

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'period' => 'required|string|max:7',
            'base_salary' => 'required|numeric|min:0',
            'bonus' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'total_hours' => 'nullable|integer|min:0',
            'total_classes' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
            'status' => 'in:PENDING,PAID,CANCELLED',
        ]);

        $validated['total_salary'] = ($validated['base_salary'] ?? 0)
            + ($validated['bonus'] ?? 0)
            - ($validated['deductions'] ?? 0);

        $salary = TeacherSalary::updateOrCreate(
            ['teacher_id' => $validated['teacher_id'], 'period' => $validated['period']],
            $validated
        );

        \App\Models\AuditLog::log('create', 'teacher_salary', $salary);

        return response()->json([
            'success' => true,
            'message' => 'Salary record saved successfully',
            'data' => $salary->load('teacher'),
        ], 201);
    }

    public function show($id)
    {
        $salary = TeacherSalary::with(['teacher'])->find($id);
        if (!$salary) {
            return response()->json(['success' => false, 'message' => 'Salary record not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $salary]);
    }

    public function update(Request $request, $id)
    {
        $salary = TeacherSalary::find($id);
        if (!$salary) {
            return response()->json(['success' => false, 'message' => 'Salary record not found'], 404);
        }

        $validated = $request->validate([
            'base_salary' => 'sometimes|numeric|min:0',
            'bonus' => 'sometimes|numeric|min:0',
            'deductions' => 'sometimes|numeric|min:0',
            'total_hours' => 'sometimes|integer|min:0',
            'total_classes' => 'sometimes|integer|min:0',
            'notes' => 'sometimes|nullable|string',
            'status' => 'sometimes|in:PENDING,PAID,CANCELLED',
        ]);

        if (isset($validated['base_salary']) || isset($validated['bonus']) || isset($validated['deductions'])) {
            $base = $validated['base_salary'] ?? $salary->base_salary;
            $bonus = $validated['bonus'] ?? $salary->bonus;
            $deductions = $validated['deductions'] ?? $salary->deductions;
            $validated['total_salary'] = $base + $bonus - $deductions;
        }

        if (($validated['status'] ?? null) === 'PAID' && !$salary->paid_at) {
            $validated['paid_at'] = now();
        }

        $oldValues = $salary->only(array_keys($validated));
        $salary->update($validated);

        \App\Models\AuditLog::log('update', 'teacher_salary', $salary, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Salary record updated successfully',
            'data' => $salary->load('teacher'),
        ]);
    }

    public function destroy($id)
    {
        $salary = TeacherSalary::find($id);
        if (!$salary) {
            return response()->json(['success' => false, 'message' => 'Salary record not found'], 404);
        }

        $salary->delete();

        \App\Models\AuditLog::log('delete', 'teacher_salary', $salary);

        return response()->json([
            'success' => true,
            'message' => 'Salary record deleted successfully',
        ]);
    }
}
