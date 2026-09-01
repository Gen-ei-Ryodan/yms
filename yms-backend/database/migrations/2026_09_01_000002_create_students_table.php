<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('student_code')->unique();
            $table->string('student_number')->unique();
            $table->string('full_name');
            $table->string('nickname')->nullable();
            $table->enum('gender', ['male', 'female']);
            $table->date('date_of_birth');
            $table->string('place_of_birth')->nullable();
            $table->string('photo')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('school_name')->nullable();
            $table->string('school_grade')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'GRADUATED', 'TRANSFERRED'])->default('ACTIVE');
            $table->date('join_date');
            $table->enum('membership_status', ['ACTIVE', 'EXPIRED', 'SUSPENDED', 'CANCELLED'])->default('ACTIVE');
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('student_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
