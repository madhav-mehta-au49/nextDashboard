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
            $table->foreignId('job_listing_id')->constrained()->onDelete('cascade');
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
            $table->text('cover_letter')->nullable();
            $table->string('resume_url')->nullable();
            $table->enum('status', [
                'pending', 
                'reviewed', 
                'interviewing', 
                'offered', 
                'hired', 
                'rejected', 
                'withdrawn'
            ])->default('pending');
            $table->timestamp('applied_at')->useCurrent();
            $table->timestamp('status_updated_at')->nullable();
            $table->text('status_notes')->nullable();
            $table->text('withdrawal_reason')->nullable();
            $table->decimal('expected_salary', 10, 2)->nullable();
            $table->char('salary_currency', 3)->default('USD');
            $table->date('availability_date')->nullable();
            $table->string('notice_period')->nullable();
            $table->boolean('willing_to_relocate')->default(false);
            $table->string('visa_status')->nullable();
            $table->text('additional_notes')->nullable();
            $table->string('referral_source')->nullable();
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['job_listing_id', 'status']);
            $table->index(['candidate_id', 'status']);
            $table->index('applied_at');
            $table->index('status');
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
