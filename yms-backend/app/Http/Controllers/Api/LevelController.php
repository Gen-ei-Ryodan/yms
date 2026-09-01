<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Level;
use Illuminate\Http\Request;

class LevelController extends Controller
{
    public function index(Request $request)
    {
        $query = Level::ordered();

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $levels = $query->get();

        return response()->json([
            'success' => true,
            'data' => $levels,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
            'description' => 'nullable|string',
            'sequence' => 'integer|min:0',
        ]);

        $level = Level::create($validated);

        \App\Models\AuditLog::log('create', 'level', $level);

        return response()->json([
            'success' => true,
            'message' => 'Level created successfully',
            'data' => $level,
        ], 201);
    }

    public function show($id)
    {
        $level = Level::with('classes.course', 'classes.teacher', 'classes.room')->find($id);
        if (!$level) {
            return response()->json(['success' => false, 'message' => 'Level not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $level]);
    }

    public function update(Request $request, $id)
    {
        $level = Level::find($id);
        if (!$level) {
            return response()->json(['success' => false, 'message' => 'Level not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:50',
            'description' => 'sometimes|nullable|string',
            'sequence' => 'sometimes|integer|min:0',
        ]);

        $oldValues = $level->only(array_keys($validated));
        $level->update($validated);

        \App\Models\AuditLog::log('update', 'level', $level, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Level updated successfully',
            'data' => $level,
        ]);
    }

    public function destroy($id)
    {
        $level = Level::find($id);
        if (!$level) {
            return response()->json(['success' => false, 'message' => 'Level not found'], 404);
        }

        $level->delete();

        \App\Models\AuditLog::log('delete', 'level', $level);

        return response()->json([
            'success' => true,
            'message' => 'Level deleted successfully',
        ]);
    }
}