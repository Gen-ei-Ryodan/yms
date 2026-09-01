<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RewardRedemption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RewardRedemptionController extends Controller
{
    public function index(Request $request)
    {
        $query = RewardRedemption::with(['student.user', 'reward']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        $redemptions = $query->latest()->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $redemptions->items(),
            'meta' => [
                'current_page' => $redemptions->currentPage(),
                'last_page' => $redemptions->lastPage(),
                'total' => $redemptions->total(),
            ],
        ]);
    }

    public function show($id)
    {
        $redemption = RewardRedemption::with([
            'student.user', 'student.guardians', 'reward'
        ])->find($id);

        if (!$redemption) {
            return response()->json(['success' => false, 'message' => 'Redemption not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $redemption]);
    }

    public function approve($id)
    {
        $redemption = RewardRedemption::find($id);
        if (!$redemption) {
            return response()->json(['success' => false, 'message' => 'Redemption not found'], 404);
        }

        if ($redemption->status !== 'PENDING') {
            return response()->json([
                'success' => false,
                'message' => 'Redemption has already been processed',
            ], 422);
        }

        DB::transaction(function () use ($redemption) {
            $voucherCode = 'VCR-' . strtoupper(\Illuminate\Support\Str::random(8));

            \App\Models\Voucher::create([
                'code' => $voucherCode,
                'reward_id' => $redemption->reward_id,
                'student_id' => $redemption->student_id,
                'discount_type' => 'PERCENTAGE',
                'discount_value' => 10,
                'minimum_transaction' => 0,
                'valid_from' => now(),
                'valid_until' => now()->addMonths(3),
                'status' => 'AVAILABLE',
            ]);

            $redemption->update([
                'status' => 'APPROVED',
                'approved_at' => now(),
            ]);

            \App\Models\AuditLog::log('approve', 'reward_redemption', $redemption);
        });

        return response()->json([
            'success' => true,
            'message' => 'Redemption approved successfully',
            'data' => $redemption->load(['student.user', 'reward']),
        ]);
    }

    public function fulfill($id)
    {
        $redemption = RewardRedemption::find($id);
        if (!$redemption) {
            return response()->json(['success' => false, 'message' => 'Redemption not found'], 404);
        }

        $redemption->update([
            'status' => 'FULFILLED',
            'fulfilled_at' => now(),
        ]);

        \App\Models\AuditLog::log('fulfill', 'reward_redemption', $redemption);

        return response()->json([
            'success' => true,
            'message' => 'Redemption fulfilled successfully',
        ]);
    }

    public function reject($id)
    {
        $redemption = RewardRedemption::find($id);
        if (!$redemption) {
            return response()->json(['success' => false, 'message' => 'Redemption not found'], 404);
        }

        $redemption->update(['status' => 'REJECTED']);

        \App\Models\AuditLog::log('reject', 'reward_redemption', $redemption);

        return response()->json([
            'success' => true,
            'message' => 'Redemption rejected successfully',
        ]);
    }

    public function cancel($id)
    {
        $redemption = RewardRedemption::find($id);
        if (!$redemption) {
            return response()->json(['success' => false, 'message' => 'Redemption not found'], 404);
        }

        DB::transaction(function () use ($redemption) {
            $redemption->update(['status' => 'CANCELLED']);

            \App\Models\LoyaltyTransaction::create([
                'student_id' => $redemption->student_id,
                'type' => 'REVERSAL',
                'points' => $redemption->points_used,
                'reference_type' => \App\Models\RewardRedemption::class,
                'reference_id' => $redemption->id,
                'description' => "Reversal for cancelled redemption {$redemption->redemption_number}",
            ]);

            \App\Models\AuditLog::log('cancel', 'reward_redemption', $redemption);
        });

        return response()->json([
            'success' => true,
            'message' => 'Redemption cancelled successfully',
        ]);
    }
}