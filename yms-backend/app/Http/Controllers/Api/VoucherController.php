<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    public function index(Request $request)
    {
        $query = Voucher::with(['reward', 'student.user']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->search) {
            $search = $request->search;
            $query->where('code', 'like', "%{$search}%");
        }

        $vouchers = $query->latest()->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $vouchers->items(),
            'meta' => [
                'current_page' => $vouchers->currentPage(),
                'last_page' => $vouchers->lastPage(),
                'total' => $vouchers->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reward_id' => 'required|exists:rewards,id',
            'student_id' => 'required|exists:students,id',
            'discount_type' => 'in:PERCENTAGE,FIXED',
            'discount_value' => 'required|numeric|min:0',
            'minimum_transaction' => 'numeric|min:0',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after_or_equal:valid_from',
        ]);

        $validated['code'] = 'VCR-' . strtoupper(\Illuminate\Support\Str::random(8));
        $validated['status'] = 'AVAILABLE';

        $voucher = Voucher::create($validated);

        \App\Models\AuditLog::log('create', 'voucher', $voucher);

        return response()->json([
            'success' => true,
            'message' => 'Voucher created successfully',
            'data' => $voucher->load(['reward', 'student.user']),
        ], 201);
    }

    public function show($id)
    {
        $voucher = Voucher::with(['reward', 'student.user'])->find($id);
        if (!$voucher) {
            return response()->json(['success' => false, 'message' => 'Voucher not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $voucher]);
    }

    public function update(Request $request, $id)
    {
        $voucher = Voucher::find($id);
        if (!$voucher) {
            return response()->json(['success' => false, 'message' => 'Voucher not found'], 404);
        }

        $validated = $request->validate([
            'discount_type' => 'sometimes|in:PERCENTAGE,FIXED',
            'discount_value' => 'sometimes|numeric|min:0',
            'minimum_transaction' => 'sometimes|numeric|min:0',
            'valid_from' => 'sometimes|date',
            'valid_until' => 'sometimes|date',
            'status' => 'sometimes|in:AVAILABLE,USED,EXPIRED,CANCELLED',
        ]);

        $oldValues = $voucher->only(array_keys($validated));
        $voucher->update($validated);

        \App\Models\AuditLog::log('update', 'voucher', $voucher, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Voucher updated successfully',
            'data' => $voucher->load(['reward', 'student.user']),
        ]);
    }

    public function destroy($id)
    {
        $voucher = Voucher::find($id);
        if (!$voucher) {
            return response()->json(['success' => false, 'message' => 'Voucher not found'], 404);
        }

        $voucher->delete();

        \App\Models\AuditLog::log('delete', 'voucher', $voucher);

        return response()->json([
            'success' => true,
            'message' => 'Voucher deleted successfully',
        ]);
    }

    public function validate($code)
    {
        $voucher = Voucher::where('code', $code)->first();

        if (!$voucher) {
            return response()->json(['success' => false, 'message' => 'Voucher not found'], 404);
        }

        if (!$voucher->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher is not valid or expired',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'data' => $voucher->load(['reward', 'student.user']),
        ]);
    }

    public function use($id)
    {
        $voucher = Voucher::find($id);
        if (!$voucher) {
            return response()->json(['success' => false, 'message' => 'Voucher not found'], 404);
        }

        if (!$voucher->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher is not valid or expired',
            ], 422);
        }

        $voucher->update([
            'status' => 'USED',
            'used_at' => now(),
        ]);

        \App\Models\AuditLog::log('use', 'voucher', $voucher);

        return response()->json([
            'success' => true,
            'message' => 'Voucher used successfully',
            'data' => $voucher->load(['reward', 'student.user']),
        ]);
    }
}