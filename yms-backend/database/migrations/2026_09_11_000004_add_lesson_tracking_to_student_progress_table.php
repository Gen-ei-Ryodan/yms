<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_progress', function (Blueprint $table) {
            $table->integer('lessons_completed')->nullable()->after('level');
            $table->integer('total_lessons')->nullable()->after('lessons_completed');
            $table->text('teacher_notes')->nullable()->after('total_lessons');
        });
    }

    public function down(): void
    {
        Schema::table('student_progress', function (Blueprint $table) {
            $table->dropColumn(['lessons_completed', 'total_lessons', 'teacher_notes']);
        });
    }
};
