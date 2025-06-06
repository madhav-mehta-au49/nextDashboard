<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_application_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_application_id')->constrained('job_applications')->onDelete('cascade');
            $table->foreignId('question_id')->nullable()->constrained('application_questions')->nullOnDelete();
            $table->text('question_text');
            $table->text('answer')->nullable();
            $table->string('question_type')->default('text');
            $table->json('question_options')->nullable();
            $table->boolean('is_required')->default(false);
            $table->string('file_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_application_answers');
    }
};
