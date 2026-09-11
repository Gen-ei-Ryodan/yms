<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('schedule_id')->nullable()->constrained('class_schedules')->onDelete('set null');
            $table->date('note_date');
            $table->string('topic')->nullable();
            $table->text('content');
            $table->text('homework')->nullable();
            $table->text('teacher_feedback')->nullable();
            $table->integer('rating')->nullable()->comment('1-5');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_notes');
    }
};
