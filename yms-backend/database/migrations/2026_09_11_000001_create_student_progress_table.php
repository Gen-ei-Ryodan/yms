<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->onDelete('set null');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('category', ['TECHNIQUE', 'THEORY', 'PRACTICE', 'PERFORMANCE', 'GENERAL'])->default('GENERAL');
            $table->integer('score')->nullable()->comment('1-100');
            $table->enum('level', ['BEGINNER', 'DEVELOPING', 'PROFICIENT', 'EXCELLENT'])->nullable();
            $table->date('assessed_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_progress');
    }
};
