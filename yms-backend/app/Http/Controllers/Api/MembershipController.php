<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use Illuminate\Http\Request;

class MembershipController extends Controller
{
    public function index(Request $request)
    {
        $query = Membership::with('student');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('membership_number', 'like', "%{$search}%")
                    ->orWhere('membership_type', 'like', "%{$search}%")
                    ->orWhereHas('student', function ($sq) use ($search) {
                        $sq->where('full_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $memberships = $query->latest()->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $memberships->items(),
            'meta' => [
                'current_page' => $memberships->currentPage(),
                'last_page' => $memberships->lastPage(),
                'total' => $memberships->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'membership_number' => 'required|string|max:50|unique:memberships,membership_number',
            'student_id' => 'required|exists:students,id',
            'membership_type' => 'required|in:BASIC,PREMIUM,VIP',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'sometimes|in:ACTIVE,EXPIRED,SUSPENDED,CANCELLED',
        ]);

        $membership = Membership::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Membership created successfully',
            'data' => $membership->load('student'),
        ], 201);
    }

    public function show($id)
    {
        $membership = Membership::with('student')->find($id);
        if (!$membership) {
            return response()->json(['success' => false, 'message' => 'Membership not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $membership]);
    }

    public function update(Request $request, $id)
    {
        $membership = Membership::find($id);
        if (!$membership) {
            return response()->json(['success' => false, 'message' => 'Membership not found'], 404);
        }

        $validated = $request->validate([
            'membership_number' => 'sometimes|string|max:50|unique:memberships,membership_number,' . $id,
            'student_id' => 'sometimes|exists:students,id',
            'membership_type' => 'sometimes|in:BASIC,PREMIUM,VIP',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'status' => 'sometimes|in:ACTIVE,EXPIRED,SUSPENDED,CANCELLED',
        ]);

        $membership->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Membership updated successfully',
            'data' => $membership->load('student'),
        ]);
    }

    public function destroy($id)
    {
        $membership = Membership::find($id);
        if (!$membership) {
            return response()->json(['success' => false, 'message' => 'Membership not found'], 404);
        }

        $membership->delete();

        return response()->json([
            'success' => true,
            'message' => 'Membership deleted successfully',
        ]);
    }
}
