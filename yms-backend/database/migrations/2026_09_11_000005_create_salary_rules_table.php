<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salary_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->enum('calculation_method', ['PER_CLASS', 'PER_STUDENT', 'PER_SESSION', 'FIXED_SALARY']);
            $table->decimal('rate_per_class', 15, 2)->nullable();
            $table->decimal('rate_per_student', 15, 2)->nullable();
            $table->decimal('rate_per_session', 15, 2)->nullable();
            $table->decimal('fixed_salary', 15, 2)->nullable();
            $table->date('effective_from');
            $table->date('effective_until')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['teacher_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salary_rules');
    }
};
