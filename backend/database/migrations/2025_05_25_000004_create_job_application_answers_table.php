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
            $table->foreignId('job_application_id')->constrained()->onDelete('cascade');
            $table->integer('question_id');
            $table->string('question_text');
            $table->text('answer');
            $table->enum('question_type', ['text', 'textarea', 'select', 'radio', 'checkbox', 'file', 'number', 'date'])->default('text');
            $table->json('question_options')->nullable();
            $table->boolean('is_required')->default(false);
            $table->string('file_url')->nullable();
            $table->timestamps();
            
            $table->index(['job_application_id', 'question_id']);
            $table->index('question_type');
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
