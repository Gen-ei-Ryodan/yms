<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('reward_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->enum('discount_type', ['PERCENTAGE', 'FIXED'])->default('PERCENTAGE');
            $table->decimal('discount_value', 12, 2);
            $table->decimal('minimum_transaction', 12, 2)->default(0);
            $table->date('valid_from');
            $table->date('valid_until');
            $table->enum('status', ['AVAILABLE', 'USED', 'EXPIRED', 'CANCELLED'])->default('AVAILABLE');
            $table->timestamp('used_at')->nullable();
            $table->timestamps();

            $table->index('code');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
