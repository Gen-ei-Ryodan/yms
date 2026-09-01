<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reward;
use Illuminate\Http\Request;

class RewardController extends Controller
{
    public function index(Request $request)
    {
        $query = Reward::with('redemptions.student.user');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $rewards = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $rewards->items(),
            'meta' => [
                'current_page' => $rewards->currentPage(),
                'last_page' => $rewards->lastPage(),
                'total' => $rewards->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'points_required' => 'required|integer|min:1',
            'stock' => 'required|integer|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'in:ACTIVE,INACTIVE',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('rewards', 'public');
        }

        $reward = Reward::create($validated);

        \App\Models\AuditLog::log('create', 'reward', $reward);

        return response()->json([
            'success' => true,
            'message' => 'Reward created successfully',
            'data' => $reward,
        ], 201);
    }

    public function show($id)
    {
        $reward = Reward::with('redemptions.student.user')->find($id);
        if (!$reward) {
            return response()->json(['success' => false, 'message' => 'Reward not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $reward]);
    }

    public function update(Request $request, $id)
    {
        $reward = Reward::find($id);
        if (!$reward) {
            return response()->json(['success' => false, 'message' => 'Reward not found'], 404);
        }

        $validated = $request->validate([
            'code' => 'sometimes|string|max:50',
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'image' => 'sometimes|nullable|image|mimes:jpg,jpeg,png|max:2048',
            'points_required' => 'sometimes|integer|min:1',
            'stock' => 'sometimes|integer|min:0',
            'start_date' => 'sometimes|nullable|date',
            'end_date' => 'sometimes|nullable|date',
            'status' => 'sometimes|in:ACTIVE,INACTIVE',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('rewards', 'public');
        }

        $oldValues = $reward->only(array_keys($validated));
        $reward->update($validated);

        \App\Models\AuditLog::log('update', 'reward', $reward, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Reward updated successfully',
            'data' => $reward,
        ]);
    }

    public function destroy($id)
    {
        $reward = Reward::find($id);
        if (!$reward) {
            return response()->json(['success' => false, 'message' => 'Reward not found'], 404);
        }

        $reward->delete();

        \App\Models\AuditLog::log('delete', 'reward', $reward);

        return response()->json([
            'success' => true,
            'message' => 'Reward deleted successfully',
        ]);
    }
}