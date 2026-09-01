<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('class_id')->constrained()->onDelete('cascade');
            $table->foreignId('schedule_id')->constrained('class_schedules')->onDelete('cascade');
            $table->date('attendance_date');
            $table->time('check_in_time')->nullable();
            $table->time('check_out_time')->nullable();
            $table->enum('status', ['PRESENT', 'LATE', 'ABSENT', 'EXCUSED', 'ON_LEAVE'])->default('ABSENT');
            $table->enum('method', ['QR', 'BARCODE', 'MANUAL'])->default('MANUAL');
            $table->text('notes')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->index('student_id');
            $table->index('class_id');
            $table->index('attendance_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
