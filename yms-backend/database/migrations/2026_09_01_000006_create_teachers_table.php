<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('teacher_code')->unique();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('photo')->nullable();
            $table->string('specialization')->nullable();
            $table->date('join_date');
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('teacher_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
