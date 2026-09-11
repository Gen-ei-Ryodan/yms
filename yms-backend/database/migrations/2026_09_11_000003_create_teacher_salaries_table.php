<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_salaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->string('period')->comment('e.g. 2026-09');
            $table->decimal('base_salary', 12, 2)->default(0);
            $table->decimal('bonus', 12, 2)->default(0);
            $table->decimal('deductions', 12, 2)->default(0);
            $table->decimal('total_salary', 12, 2)->default(0);
            $table->integer('total_hours')->default(0);
            $table->integer('total_classes')->default(0);
            $table->text('notes')->nullable();
            $table->enum('status', ['PENDING', 'PAID', 'CANCELLED'])->default('PENDING');
            $table->date('paid_at')->nullable();
            $table->timestamps();

            $table->unique(['teacher_id', 'period']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_salaries');
    }
};
