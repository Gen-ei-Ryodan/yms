<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::with(['student.user', 'subscription.product.course']);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
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

        if ($request->issue_date) {
            $query->whereDate('issue_date', $request->issue_date);
        }

        $invoices = $query->latest()->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $invoices->items(),
            'meta' => [
                'current_page' => $invoices->currentPage(),
                'last_page' => $invoices->lastPage(),
                'total' => $invoices->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'subscription_id' => 'nullable|exists:subscriptions,id',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'subtotal' => 'required|numeric|min:0',
            'discount' => 'numeric|min:0',
            'tax' => 'numeric|min:0',
            'items' => 'nullable|array',
        ]);

        $subtotal = $validated['subtotal'];
        $discount = $validated['discount'] ?? 0;
        $tax = $validated['tax'] ?? 0;
        $total = $subtotal - $discount + $tax;

        $invoice = Invoice::create([
            'student_id' => $validated['student_id'],
            'subscription_id' => $validated['subscription_id'] ?? null,
            'issue_date' => $validated['issue_date'],
            'due_date' => $validated['due_date'],
            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => $tax,
            'total' => $total,
            'invoice_number' => $this->generateInvoiceNumber(),
            'status' => 'DRAFT',
        ]);

        \App\Models\AuditLog::log('create', 'invoice', $invoice);

        return response()->json([
            'success' => true,
            'message' => 'Invoice created successfully',
            'data' => $invoice->load(['student.user', 'subscription.product.course']),
        ], 201);
    }

    public function show($id)
    {
        $invoice = Invoice::with([
            'student.user', 'student.guardians',
            'subscription.product.course', 'payments'
        ])->find($id);

        if (!$invoice) {
            return response()->json(['success' => false, 'message' => 'Invoice not found'], 404);
        }

        $invoice->paid_amount = $invoice->payments()->where('status', 'PAID')->sum('amount');

        return response()->json(['success' => true, 'data' => $invoice]);
    }

    public function update(Request $request, $id)
    {
        $invoice = Invoice::find($id);
        if (!$invoice) {
            return response()->json(['success' => false, 'message' => 'Invoice not found'], 404);
        }

        $validated = $request->validate([
            'issue_date' => 'sometimes|date',
            'due_date' => 'sometimes|date',
            'subtotal' => 'sometimes|numeric|min:0',
            'discount' => 'sometimes|numeric|min:0',
            'tax' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:DRAFT,UNPAID,PARTIAL,PAID,OVERDUE,CANCELLED',
        ]);

        if (isset($validated['subtotal']) || isset($validated['discount']) || isset($validated['tax'])) {
            $subtotal = $validated['subtotal'] ?? $invoice->subtotal;
            $discount = $validated['discount'] ?? $invoice->discount;
            $tax = $validated['tax'] ?? $invoice->tax;
            $validated['total'] = $subtotal - $discount + $tax;
        }

        $oldValues = $invoice->only(array_keys($validated));
        $invoice->update($validated);

        \App\Models\AuditLog::log('update', 'invoice', $invoice, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Invoice updated successfully',
            'data' => $invoice->load(['student.user', 'subscription.product.course']),
        ]);
    }

    public function destroy($id)
    {
        $invoice = Invoice::find($id);
        if (!$invoice) {
            return response()->json(['success' => false, 'message' => 'Invoice not found'], 404);
        }

        $invoice->delete();

        \App\Models\AuditLog::log('delete', 'invoice', $invoice);

        return response()->json([
            'success' => true,
            'message' => 'Invoice deleted successfully',
        ]);
    }

    public function markOverdue($id)
    {
        $invoice = Invoice::find($id);
        if (!$invoice) {
            return response()->json(['success' => false, 'message' => 'Invoice not found'], 404);
        }

        $invoice->update(['status' => 'OVERDUE']);

        \App\Models\AuditLog::log('mark_overdue', 'invoice', $invoice);

        return response()->json([
            'success' => true,
            'message' => 'Invoice marked as overdue',
        ]);
    }

    protected function generateInvoiceNumber(): string
    {
        $last = Invoice::orderBy('id', 'desc')->first();
        $number = $last ? intval(substr($last->invoice_number, 4)) + 1 : 1;
        return 'INV-' . date('Ym') . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}
