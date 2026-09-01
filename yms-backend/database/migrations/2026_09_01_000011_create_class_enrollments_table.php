<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('class_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('class_id')->constrained()->onDelete('cascade');
            $table->timestamp('enrolled_at');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->enum('status', ['ACTIVE', 'TRANSFERRED', 'COMPLETED', 'DROPPED', 'ON_LEAVE'])->default('ACTIVE');
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_enrollments');
    }
};
