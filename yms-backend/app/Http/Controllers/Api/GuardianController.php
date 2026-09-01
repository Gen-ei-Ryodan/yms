<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guardian;
use Illuminate\Http\Request;

class GuardianController extends Controller
{
    public function index(Request $request)
    {
        $query = Guardian::query();

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->relationship) {
            $query->where('relationship', $request->relationship);
        }

        $guardians = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $guardians->items(),
            'meta' => [
                'current_page' => $guardians->currentPage(),
                'last_page' => $guardians->lastPage(),
                'total' => $guardians->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'relationship' => 'required|in:Father,Mother,Guardian,Other',
            'phone' => 'required|string',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'is_primary' => 'boolean',
        ]);

        $guardian = Guardian::create($validated);

        \App\Models\AuditLog::log('create', 'guardian', $guardian);

        return response()->json([
            'success' => true,
            'message' => 'Guardian created successfully',
            'data' => $guardian,
        ], 201);
    }

    public function show($id)
    {
        $guardian = Guardian::with('students.user')->find($id);
        if (!$guardian) {
            return response()->json(['success' => false, 'message' => 'Guardian not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $guardian]);
    }

    public function update(Request $request, $id)
    {
        $guardian = Guardian::find($id);
        if (!$guardian) {
            return response()->json(['success' => false, 'message' => 'Guardian not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'relationship' => 'sometimes|in:Father,Mother,Guardian,Other',
            'phone' => 'sometimes|string',
            'email' => 'sometimes|nullable|email',
            'address' => 'sometimes|nullable|string',
            'is_primary' => 'sometimes|boolean',
        ]);

        $oldValues = $guardian->only(array_keys($validated));
        $guardian->update($validated);

        \App\Models\AuditLog::log('update', 'guardian', $guardian, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Guardian updated successfully',
            'data' => $guardian,
        ]);
    }

    public function destroy($id)
    {
        $guardian = Guardian::find($id);
        if (!$guardian) {
            return response()->json(['success' => false, 'message' => 'Guardian not found'], 404);
        }

        $guardian->delete();

        \App\Models\AuditLog::log('delete', 'guardian', $guardian);

        return response()->json([
            'success' => true,
            'message' => 'Guardian deleted successfully',
        ]);
    }

    public function attachStudent(Request $request, $guardianId)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
        ]);

        $guardian = Guardian::find($guardianId);
        if (!$guardian) {
            return response()->json(['success' => false, 'message' => 'Guardian not found'], 404);
        }

        $guardian->students()->syncWithoutDetaching([$request->student_id]);

        return response()->json([
            'success' => true,
            'message' => 'Guardian attached to student successfully',
            'data' => $guardian->load('students'),
        ]);
    }

    public function detachStudent($guardianId, $studentId)
    {
        $guardian = Guardian::find($guardianId);
        if (!$guardian) {
            return response()->json(['success' => false, 'message' => 'Guardian not found'], 404);
        }

        $guardian->students()->detach($studentId);

        return response()->json([
            'success' => true,
            'message' => 'Guardian detached from student successfully',
        ]);
    }
}