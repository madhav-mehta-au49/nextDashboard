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
        Schema::create('review_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('review_id')->constrained('company_reviews')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('reason');
            $table->boolean('resolved')->default(false);
            $table->text('resolution_notes')->nullable();
            $table->timestamps();

            // Each user can only report a review once
            $table->unique(['review_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('review_reports');
    }
};
