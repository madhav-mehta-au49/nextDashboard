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
        Schema::create('candidate_profile_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
            $table->foreignId('viewer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('viewer_type', ['user', 'company', 'guest'])->default('guest');
            $table->string('viewer_ip')->nullable();
            $table->timestamp('viewed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidate_profile_views');
    }
};
