<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('memberships', function (Blueprint $table) {
            $table->id();
            $table->string('membership_number')->unique();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->enum('membership_type', ['BASIC', 'PREMIUM', 'VIP'])->default('BASIC');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['ACTIVE', 'EXPIRED', 'SUSPENDED', 'CANCELLED'])->default('ACTIVE');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('memberships');
    }
};
