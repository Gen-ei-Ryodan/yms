<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tuition_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->decimal('price', 12, 2);
            $table->enum('billing_type', ['MONTHLY', 'PACKAGE', 'TERM', 'ONE_TIME'])->default('MONTHLY');
            $table->integer('duration')->comment('duration in days');
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tuition_products');
    }
};
