<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = Room::query();

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('room_code', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $rooms = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $rooms->items(),
            'meta' => [
                'current_page' => $rooms->currentPage(),
                'last_page' => $rooms->lastPage(),
                'total' => $rooms->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'location' => 'nullable|string',
            'status' => 'in:ACTIVE,INACTIVE,MAINTENANCE',
        ]);

        $room = Room::create($validated);

        \App\Models\AuditLog::log('create', 'room', $room);

        return response()->json([
            'success' => true,
            'message' => 'Room created successfully',
            'data' => $room,
        ], 201);
    }

    public function show($id)
    {
        $room = Room::with(['classes.course', 'classes.level', 'classes.teacher', 'schedules'])->find($id);
        if (!$room) {
            return response()->json(['success' => false, 'message' => 'Room not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $room]);
    }

    public function update(Request $request, $id)
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['success' => false, 'message' => 'Room not found'], 404);
        }

        $validated = $request->validate([
            'room_code' => 'sometimes|string|max:50',
            'name' => 'sometimes|string|max:255',
            'capacity' => 'sometimes|integer|min:1',
            'location' => 'sometimes|nullable|string',
            'status' => 'sometimes|in:ACTIVE,INACTIVE,MAINTENANCE',
        ]);

        $oldValues = $room->only(array_keys($validated));
        $room->update($validated);

        \App\Models\AuditLog::log('update', 'room', $room, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Room updated successfully',
            'data' => $room,
        ]);
    }

    public function destroy($id)
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['success' => false, 'message' => 'Room not found'], 404);
        }

        $room->delete();

        \App\Models\AuditLog::log('delete', 'room', $room);

        return response()->json([
            'success' => true,
            'message' => 'Room deleted successfully',
        ]);
    }
}