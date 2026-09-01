<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('class_code')->unique();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('level_id')->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->foreignId('room_id')->constrained()->onDelete('cascade');
            $table->integer('capacity');
            $table->enum('status', ['ACTIVE', 'INACTIVE', 'FULL', 'COMPLETED'])->default('ACTIVE');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('class_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
