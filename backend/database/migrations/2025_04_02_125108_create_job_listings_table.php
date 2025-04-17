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
        Schema::create('job_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('location');
            $table->boolean('is_remote')->default(false);
            $table->enum('type', ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'])->default('Full-time');
            $table->enum('experience_level', ['Entry', 'Mid', 'Senior', 'Executive'])->default('Mid');
            $table->decimal('salary_min', 10, 2)->nullable();
            $table->decimal('salary_max', 10, 2)->nullable();
            $table->string('salary_currency', 3)->default('USD');
            $table->date('posted_date');
            $table->date('application_deadline')->nullable();
            $table->enum('status', ['draft', 'published', 'closed'])->default('published');
            $table->integer('applicants_count')->default(0);
            $table->integer('views_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_listings');
    }
};
