<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reward_redemptions', function (Blueprint $table) {
            $table->id();
            $table->string('redemption_number')->unique();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('reward_id')->constrained()->onDelete('cascade');
            $table->integer('points_used');
            $table->enum('status', ['PENDING', 'APPROVED', 'FULFILLED', 'REJECTED', 'CANCELLED'])->default('PENDING');
            $table->timestamp('redeemed_at');
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('fulfilled_at')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reward_redemptions');
    }
};
