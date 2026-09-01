<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoyaltyController extends Controller
{
    public function balance()
    {
        $student = $this->getStudent();
        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Student not found'], 404);
        }

        $transactions = $student->loyaltyTransactions;
        $balance = 0;
        $expiringPoints = 0;
        $nextExpiration = null;

        foreach ($transactions as $transaction) {
            match ($transaction->type) {
                'EARN', 'ADJUSTMENT' => $balance += $transaction->points,
                'REDEEM', 'EXPIRED' => $balance -= $transaction->points,
                'REVERSAL' => $balance += $transaction->points,
            };

            if ($transaction->type === 'EARN' && $transaction->expired_at && $transaction->expired_at->isFuture()) {
                $expiringPoints += $transaction->points;
                if (!$nextExpiration || $transaction->expired_at->lt($nextExpiration)) {
                    $nextExpiration = $transaction->expired_at;
                }
            }
        }

        $tier = \App\Models\LoyaltyTier::where('minimum_points', '<=', $balance)
            ->where('maximum_points', '>=', $balance)
            ->where('status', 'ACTIVE')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'current_points' => max(0, $balance),
                'available_points' => max(0, $balance),
                'expiring_points' => $expiringPoints,
                'next_expiration' => $nextExpiration,
                'membership_tier' => $tier ? $tier->name : 'Bronze',
            ],
        ]);
    }

    public function transactions()
    {
        $student = $this->getStudent();
        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Student not found'], 404);
        }

        $transactions = $student->loyaltyTransactions()->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $transactions->items(),
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'total' => $transactions->total(),
            ],
        ]);
    }

    public function earn(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'event_type' => 'required|string',
            'reference_type' => 'nullable|string',
            'reference_id' => 'nullable|integer',
            'description' => 'nullable|string',
        ]);

        $rule = \App\Models\LoyaltyRule::where('event_type', $validated['event_type'])
            ->where('status', 'ACTIVE')
            ->first();

        $points = $rule ? $rule->points : 0;

        $transaction = LoyaltyTransaction::create([
            'student_id' => $validated['student_id'],
            'type' => 'EARN',
            'points' => $points,
            'reference_type' => $validated['reference_type'] ?? null,
            'reference_id' => $validated['reference_id'] ?? null,
            'description' => $validated['description'] ?? null,
            'expired_at' => now()->addYear(),
        ]);

        \App\Models\AuditLog::log('earn', 'loyalty_transaction', $transaction);

        return response()->json([
            'success' => true,
            'message' => "Earned {$points} points",
            'data' => $transaction,
        ]);
    }

    public function redeem(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'reward_id' => 'required|exists:rewards,id',
        ]);

        $student = \App\Models\Student::find($validated['student_id']);
        $reward = \App\Models\Reward::find($validated['reward_id']);

        if (!$student || !$reward) {
            return response()->json(['success' => false, 'message' => 'Invalid request'], 404);
        }

        if (!$reward->isAvailable()) {
            return response()->json([
                'success' => false,
                'message' => 'Reward is not available',
            ], 422);
        }

        $balance = $student->loyalty_balance;
        if ($balance < $reward->points_required) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient points',
            ], 422);
        }

        DB::transaction(function () use ($student, $reward) {
            $redemption = \App\Models\RewardRedemption::create([
                'redemption_number' => $this->generateRedemptionNumber(),
                'student_id' => $student->id,
                'reward_id' => $reward->id,
                'points_used' => $reward->points_required,
                'status' => 'PENDING',
                'redeemed_at' => now(),
            ]);

            LoyaltyTransaction::create([
                'student_id' => $student->id,
                'type' => 'REDEEM',
                'points' => $reward->points_required,
                'reference_type' => \App\Models\RewardRedemption::class,
                'reference_id' => $redemption->id,
                'description' => "Redeemed {$reward->name}",
            ]);

            $reward->decrement('stock');

            \App\Models\AuditLog::log('redeem', 'loyalty_transaction', null, [], [
                'student_id' => $student->id,
                'reward_id' => $reward->id,
                'points' => $reward->points_required,
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Reward redeemed successfully',
        ]);
    }

    public function adjust(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'points' => 'required|integer',
            'description' => 'required|string',
        ]);

        $transaction = LoyaltyTransaction::create([
            'student_id' => $validated['student_id'],
            'type' => $validated['points'] >= 0 ? 'ADJUSTMENT' : 'ADJUSTMENT',
            'points' => abs($validated['points']),
            'description' => $validated['description'],
        ]);

        \App\Models\AuditLog::log('adjust', 'loyalty_transaction', $transaction);

        return response()->json([
            'success' => true,
            'message' => 'Points adjusted successfully',
            'data' => $transaction,
        ]);
    }

    protected function getStudent()
    {
        $user = auth()->user();
        if (!$user) return null;

        if ($user->role === 'student') {
            return $user->student;
        }

        if (request()->student_id) {
            return \App\Models\Student::find(request()->student_id);
        }

        return null;
    }

    protected function generateRedemptionNumber(): string
    {
        $last = \App\Models\RewardRedemption::orderBy('id', 'desc')->first();
        $number = $last ? intval(substr($last->redemption_number, 4)) + 1 : 1;
        return 'RDM-' . date('Ym') . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}
