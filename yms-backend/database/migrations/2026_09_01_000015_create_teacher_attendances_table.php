<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->time('check_in')->nullable();
            $table->time('check_out')->nullable();
            $table->enum('status', ['PRESENT', 'LATE', 'ABSENT', 'LEAVE'])->default('ABSENT');
            $table->enum('method', ['QR', 'MANUAL', 'SYSTEM'])->default('MANUAL');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('teacher_id');
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_attendances');
    }
};
