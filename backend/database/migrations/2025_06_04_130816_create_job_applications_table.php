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
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            
            // Foreign Keys
            $table->foreignId('job_listing_id')->constrained('job_listings');
            $table->foreignId('candidate_id')->constrained('candidates');
            
            // Personal Information
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone', 20);
            $table->string('current_location');
            $table->string('linkedin_url')->nullable();
            $table->string('portfolio_url')->nullable();
            
            // Professional Information
            $table->string('current_job_title');
            $table->string('current_company');
            $table->string('total_experience', 50)->nullable();  // Using string for values like "1-3"
            $table->string('relevant_experience', 50)->nullable();
            $table->decimal('current_salary', 12, 2)->nullable();
            $table->string('work_type_preference')->nullable();
            
            // Application Content
            $table->text('cover_letter')->nullable();
            $table->text('motivation_letter')->nullable();
            $table->json('key_strengths')->nullable();
            $table->text('career_goals')->nullable();
            $table->string('resume_url')->nullable();
            $table->string('cover_letter_file_url')->nullable();
            $table->json('additional_files_urls')->nullable();
            
            // Salary & Availability
            $table->decimal('expected_salary', 12, 2)->nullable();
            $table->string('salary_currency', 3)->default('INR');
            $table->date('availability_date')->nullable();
            $table->string('notice_period')->nullable(); // String for values like "immediate"
            $table->boolean('willing_to_relocate')->default(false);
            $table->string('visa_status')->nullable();
            
            // Status & Metadata
            $table->string('status')->default('pending');
            $table->timestamp('applied_at')->nullable();
            $table->timestamp('status_updated_at')->nullable();
            $table->text('status_notes')->nullable();
            $table->string('withdrawal_reason')->nullable();
            $table->text('additional_notes')->nullable();
            $table->string('referral_source')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
