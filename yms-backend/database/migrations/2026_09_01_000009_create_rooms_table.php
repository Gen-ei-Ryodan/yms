<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_code')->unique();
            $table->string('name');
            $table->integer('capacity');
            $table->string('location')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE', 'MAINTENANCE'])->default('ACTIVE');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
