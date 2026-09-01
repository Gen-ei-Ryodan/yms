<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TuitionProduct;
use Illuminate\Http\Request;

class TuitionProductController extends Controller
{
    public function index(Request $request)
    {
        $query = TuitionProduct::with('course');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('course', function ($c) use ($search) {
                        $c->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->course_id) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->billing_type) {
            $query->where('billing_type', $request->billing_type);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $products = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'billing_type' => 'in:MONTHLY,PACKAGE,TERM,ONE_TIME',
            'duration' => 'required|integer|min:1',
            'status' => 'in:ACTIVE,INACTIVE',
        ]);

        $product = TuitionProduct::create($validated);

        \App\Models\AuditLog::log('create', 'tuition_product', $product);

        return response()->json([
            'success' => true,
            'message' => 'Tuition product created successfully',
            'data' => $product->load('course'),
        ], 201);
    }

    public function show($id)
    {
        $product = TuitionProduct::with(['course', 'subscriptions.student.user'])->find($id);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $product]);
    }

    public function update(Request $request, $id)
    {
        $product = TuitionProduct::find($id);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        $validated = $request->validate([
            'course_id' => 'sometimes|exists:courses,id',
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'billing_type' => 'sometimes|in:MONTHLY,PACKAGE,TERM,ONE_TIME',
            'duration' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:ACTIVE,INACTIVE',
        ]);

        $oldValues = $product->only(array_keys($validated));
        $product->update($validated);

        \App\Models\AuditLog::log('update', 'tuition_product', $product, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Tuition product updated successfully',
            'data' => $product->load('course'),
        ]);
    }

    public function destroy($id)
    {
        $product = TuitionProduct::find($id);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        $product->delete();

        \App\Models\AuditLog::log('delete', 'tuition_product', $product);

        return response()->json([
            'success' => true,
            'message' => 'Tuition product deleted successfully',
        ]);
    }
}