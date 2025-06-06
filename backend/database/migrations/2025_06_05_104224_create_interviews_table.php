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
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_application_id')->constrained()->onDelete('cascade');
            $table->string('interview_type')->default('video'); // phone, video, in-person, panel
            $table->dateTime('scheduled_at');
            $table->integer('duration_minutes')->default(60); // Duration in minutes
            $table->string('location')->nullable(); // Physical location or meeting room
            $table->text('meeting_link')->nullable(); // Zoom, Teams, Meet link
            $table->json('interviewer_ids')->nullable(); // Array of user IDs who will conduct interview
            $table->text('interview_notes')->nullable(); // Interview agenda, preparation notes
            $table->string('status')->default('scheduled'); // scheduled, confirmed, completed, cancelled, rescheduled
            $table->text('candidate_notes')->nullable(); // Notes for candidate (preparation instructions)
            $table->text('internal_notes')->nullable(); // Internal company notes
            $table->string('timezone')->default('UTC'); // Interview timezone
            $table->dateTime('reminded_at')->nullable(); // Track when reminders were sent
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['job_application_id', 'status']);
            $table->index(['scheduled_at']);
            $table->index(['status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};
