<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['student.user', 'subscription.product.course', 'invoice']);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('payment_number', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%")
                    ->orWhereHas('student', function ($s) use ($search) {
                        $s->where('full_name', 'like', "%{$search}%")
                            ->orWhere('student_code', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->payment_method) {
            $query->where('payment_method', $request->payment_method);
        }

        if ($request->payment_date) {
            $query->whereDate('payment_date', $request->payment_date);
        }

        $payments = $query->latest()->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $payments->items(),
            'meta' => [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'total' => $payments->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'subscription_id' => 'nullable|exists:subscriptions,id',
            'invoice_id' => 'nullable|exists:invoices,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'due_date' => 'nullable|date',
            'payment_method' => 'in:CASH,BANK_TRANSFER,CREDIT_CARD,DEBIT_CARD,EWALLET,OTHER',
            'reference' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            $payment = Payment::create([
                'student_id' => $validated['student_id'],
                'subscription_id' => $validated['subscription_id'] ?? null,
                'invoice_id' => $validated['invoice_id'] ?? null,
                'amount' => $validated['amount'],
                'payment_date' => $validated['payment_date'],
                'due_date' => $validated['due_date'] ?? null,
                'payment_method' => $validated['payment_method'] ?? 'CASH',
                'reference' => $validated['reference'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'payment_number' => $this->generatePaymentNumber(),
                'status' => 'PAID',
            ]);

            if ($validated['invoice_id'] ?? null) {
                $invoice = \App\Models\Invoice::find($validated['invoice_id']);
                $paidAmount = $invoice->payments()->where('status', 'PAID')->sum('amount') + $validated['amount'];
                if ($paidAmount >= $invoice->total) {
                    $invoice->update(['status' => 'PAID']);
                } else {
                    $invoice->update(['status' => 'PARTIAL']);
                }
            }

            \App\Models\AuditLog::log('create', 'payment', $payment);
        });

        $payment = Payment::with(['student.user', 'subscription.product.course', 'invoice'])->where('payment_number', $this->generatePaymentNumber())->first();

        return response()->json([
            'success' => true,
            'message' => 'Payment recorded successfully',
            'data' => $payment,
        ], 201);
    }

    public function show($id)
    {
        $payment = Payment::with([
            'student.user', 'student.guardians',
            'subscription.product.course', 'invoice'
        ])->find($id);

        if (!$payment) {
            return response()->json(['success' => false, 'message' => 'Payment not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $payment]);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['success' => false, 'message' => 'Payment not found'], 404);
        }

        $validated = $request->validate([
            'amount' => 'sometimes|numeric|min:0.01',
            'payment_date' => 'sometimes|date',
            'payment_method' => 'sometimes|in:CASH,BANK_TRANSFER,CREDIT_CARD,DEBIT_CARD,EWALLET,OTHER',
            'reference' => 'sometimes|nullable|string|max:100',
            'notes' => 'sometimes|nullable|string',
            'status' => 'sometimes|in:PENDING,PAID,PARTIAL,FAILED,CANCELLED,REFUNDED',
        ]);

        $oldValues = $payment->only(array_keys($validated));
        $payment->update($validated);

        \App\Models\AuditLog::log('update', 'payment', $payment, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Payment updated successfully',
            'data' => $payment->load(['student.user', 'subscription.product.course', 'invoice']),
        ]);
    }

    public function destroy($id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['success' => false, 'message' => 'Payment not found'], 404);
        }

        $payment->delete();

        \App\Models\AuditLog::log('delete', 'payment', $payment);

        return response()->json([
            'success' => true,
            'message' => 'Payment deleted successfully',
        ]);
    }

    public function outstanding()
    {
        $outstanding = \Illuminate\Support\Facades\DB::table('students')
            ->join('subscriptions', 'students.id', '=', 'subscriptions.student_id')
            ->join('invoices', 'subscriptions.id', '=', 'invoices.subscription_id')
            ->where('subscriptions.status', 'ACTIVE')
            ->where('invoices.status', '!=', 'PAID')
            ->select(
                'students.id as student_id',
                'students.full_name',
                'students.student_code',
                \Illuminate\Support\Facades\DB::raw('SUM(invoices.total - COALESCE(paid.amount, 0)) as outstanding')
            )
            ->groupBy('students.id', 'students.full_name', 'students.student_code')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $outstanding,
        ]);
    }

    protected function generatePaymentNumber(): string
    {
        $last = Payment::orderBy('id', 'desc')->first();
        $number = $last ? intval(substr($last->payment_number, 4)) + 1 : 1;
        return 'PAY-' . date('Ym') . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}
