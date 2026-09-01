<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyRule;
use Illuminate\Http\Request;

class LoyaltyRuleController extends Controller
{
    public function index(Request $request)
    {
        $query = LoyaltyRule::query();

        if ($request->event_type) {
            $query->where('event_type', $request->event_type);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $rules = $query->get();

        return response()->json([
            'success' => true,
            'data' => $rules,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'event_type' => 'required|string|max:100',
            'points' => 'required|integer|min:0',
            'conditions' => 'nullable|array',
            'status' => 'in:ACTIVE,INACTIVE',
        ]);

        $rule = LoyaltyRule::create($validated);

        \App\Models\AuditLog::log('create', 'loyalty_rule', $rule);

        return response()->json([
            'success' => true,
            'message' => 'Loyalty rule created successfully',
            'data' => $rule,
        ], 201);
    }

    public function show($id)
    {
        $rule = LoyaltyRule::find($id);
        if (!$rule) {
            return response()->json(['success' => false, 'message' => 'Rule not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $rule]);
    }

    public function update(Request $request, $id)
    {
        $rule = LoyaltyRule::find($id);
        if (!$rule) {
            return response()->json(['success' => false, 'message' => 'Rule not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'event_type' => 'sometimes|string|max:100',
            'points' => 'sometimes|integer|min:0',
            'conditions' => 'sometimes|nullable|array',
            'status' => 'sometimes|in:ACTIVE,INACTIVE',
        ]);

        $oldValues = $rule->only(array_keys($validated));
        $rule->update($validated);

        \App\Models\AuditLog::log('update', 'loyalty_rule', $rule, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Loyalty rule updated successfully',
            'data' => $rule,
        ]);
    }

    public function destroy($id)
    {
        $rule = LoyaltyRule::find($id);
        if (!$rule) {
            return response()->json(['success' => false, 'message' => 'Rule not found'], 404);
        }

        $rule->delete();

        \App\Models\AuditLog::log('delete', 'loyalty_rule', $rule);

        return response()->json([
            'success' => true,
            'message' => 'Loyalty rule deleted successfully',
        ]);
    }
}