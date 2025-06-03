<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update the status enum to include all required values
        DB::statement("ALTER TABLE job_listings MODIFY COLUMN status ENUM('draft', 'active', 'published', 'paused', 'closed', 'expired') DEFAULT 'active'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum values
        DB::statement("ALTER TABLE job_listings MODIFY COLUMN status ENUM('draft', 'published', 'closed') DEFAULT 'published'");
    }
};
