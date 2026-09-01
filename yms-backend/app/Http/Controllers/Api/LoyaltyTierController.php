<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyTier;
use Illuminate\Http\Request;

class LoyaltyTierController extends Controller
{
    public function index(Request $request)
    {
        $query = LoyaltyTier::ordered();

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $tiers = $query->get();

        return response()->json([
            'success' => true,
            'data' => $tiers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'minimum_points' => 'required|integer|min:0',
            'maximum_points' => 'required|integer|gt:minimum_points',
            'benefits' => 'nullable|string',
            'status' => 'in:ACTIVE,INACTIVE',
        ]);

        $tier = LoyaltyTier::create($validated);

        \App\Models\AuditLog::log('create', 'loyalty_tier', $tier);

        return response()->json([
            'success' => true,
            'message' => 'Loyalty tier created successfully',
            'data' => $tier,
        ], 201);
    }

    public function show($id)
    {
        $tier = LoyaltyTier::find($id);
        if (!$tier) {
            return response()->json(['success' => false, 'message' => 'Tier not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $tier]);
    }

    public function update(Request $request, $id)
    {
        $tier = LoyaltyTier::find($id);
        if (!$tier) {
            return response()->json(['success' => false, 'message' => 'Tier not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'minimum_points' => 'sometimes|integer|min:0',
            'maximum_points' => 'sometimes|integer|gt:minimum_points',
            'benefits' => 'sometimes|nullable|string',
            'status' => 'sometimes|in:ACTIVE,INACTIVE',
        ]);

        $oldValues = $tier->only(array_keys($validated));
        $tier->update($validated);

        \App\Models\AuditLog::log('update', 'loyalty_tier', $tier, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Loyalty tier updated successfully',
            'data' => $tier,
        ]);
    }

    public function destroy($id)
    {
        $tier = LoyaltyTier::find($id);
        if (!$tier) {
            return response()->json(['success' => false, 'message' => 'Tier not found'], 404);
        }

        $tier->delete();

        \App\Models\AuditLog::log('delete', 'loyalty_tier', $tier);

        return response()->json([
            'success' => true,
            'message' => 'Loyalty tier deleted successfully',
        ]);
    }
}