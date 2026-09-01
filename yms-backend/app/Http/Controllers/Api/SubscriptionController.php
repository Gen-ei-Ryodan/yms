<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $query = Subscription::with(['student.user', 'product.course']);

        if ($request->search) {
            $search = $request->search;
            $query->whereHas('student', function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('student_code', 'like', "%{$search}%");
            });
        }

        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $subscriptions = $query->latest()->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $subscriptions->items(),
            'meta' => [
                'current_page' => $subscriptions->currentPage(),
                'last_page' => $subscriptions->lastPage(),
                'total' => $subscriptions->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'product_id' => 'required|exists:tuition_products,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'price' => 'required|numeric|min:0',
            'auto_renew' => 'boolean',
        ]);

        $validated['status'] = 'ACTIVE';

        $subscription = Subscription::create($validated);

        \App\Models\AuditLog::log('create', 'subscription', $subscription);

        return response()->json([
            'success' => true,
            'message' => 'Subscription created successfully',
            'data' => $subscription->load(['student.user', 'product.course']),
        ], 201);
    }

    public function show($id)
    {
        $subscription = Subscription::with([
            'student.user', 'student.guardians',
            'product.course', 'invoices', 'payments'
        ])->find($id);

        if (!$subscription) {
            return response()->json(['success' => false, 'message' => 'Subscription not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $subscription]);
    }

    public function update(Request $request, $id)
    {
        $subscription = Subscription::find($id);
        if (!$subscription) {
            return response()->json(['success' => false, 'message' => 'Subscription not found'], 404);
        }

        $validated = $request->validate([
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date',
            'price' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:ACTIVE,EXPIRED,CANCELLED,PENDING',
            'auto_renew' => 'sometimes|boolean',
        ]);

        $oldValues = $subscription->only(array_keys($validated));
        $subscription->update($validated);

        \App\Models\AuditLog::log('update', 'subscription', $subscription, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Subscription updated successfully',
            'data' => $subscription->load(['student.user', 'product.course']),
        ]);
    }

    public function destroy($id)
    {
        $subscription = Subscription::find($id);
        if (!$subscription) {
            return response()->json(['success' => false, 'message' => 'Subscription not found'], 404);
        }

        $subscription->update(['status' => 'CANCELLED']);

        \App\Models\AuditLog::log('cancel', 'subscription', $subscription);

        return response()->json([
            'success' => true,
            'message' => 'Subscription cancelled successfully',
        ]);
    }

    public function renew($id)
    {
        $subscription = Subscription::find($id);
        if (!$subscription) {
            return response()->json(['success' => false, 'message' => 'Subscription not found'], 404);
        }

        $duration = $subscription->product->duration;
        $newStartDate = $subscription->end_date->copy()->addDay();
        $newEndDate = $newStartDate->copy()->addDays($duration);

        $subscription->update([
            'start_date' => $newStartDate,
            'end_date' => $newEndDate,
            'status' => 'ACTIVE',
        ]);

        \App\Models\AuditLog::log('renew', 'subscription', $subscription);

        return response()->json([
            'success' => true,
            'message' => 'Subscription renewed successfully',
            'data' => $subscription->load(['student.user', 'product.course']),
        ]);
    }

    public function expiringSoon()
    {
        $subscriptions = Subscription::with(['student.user', 'product.course'])
            ->where('status', 'ACTIVE')
            ->where('end_date', '<=', now()->addDays(30))
            ->orderBy('end_date')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $subscriptions,
        ]);
    }
}