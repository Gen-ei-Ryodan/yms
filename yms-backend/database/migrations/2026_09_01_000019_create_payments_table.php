<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_number')->unique();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('invoice_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('amount', 12, 2);
            $table->date('payment_date');
            $table->date('due_date')->nullable();
            $table->enum('payment_method', ['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'EWALLET', 'OTHER'])->default('CASH');
            $table->enum('status', ['PENDING', 'PAID', 'PARTIAL', 'FAILED', 'CANCELLED', 'REFUNDED'])->default('PENDING');
            $table->string('reference')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('payment_number');
            $table->index('student_id');
            $table->index('status');
            $table->index('payment_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
