<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained('tuition_products')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('price', 12, 2);
            $table->enum('status', ['ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING'])->default('PENDING');
            $table->boolean('auto_renew')->default(false);
            $table->timestamps();

            $table->index('student_id');
            $table->index('status');
            $table->index('end_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
