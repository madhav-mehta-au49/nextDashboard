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
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('headline')->nullable();
            $table->text('about')->nullable();
            $table->string('location')->nullable();
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('resume_url')->nullable();
            $table->string('profile_picture')->nullable();
            $table->string('cover_image')->nullable();
            $table->enum('availability', ['Actively looking', 'Open to opportunities', 'Not actively looking'])->default('Open to opportunities');
            $table->string('desired_job_title')->nullable();
            $table->decimal('desired_salary', 10, 2)->nullable();
            $table->string('desired_location')->nullable();
            $table->enum('work_type_preference', ['remote', 'onsite', 'hybrid', 'flexible'])->nullable();
            $table->integer('connections')->default(0);
            $table->integer('profile_completed_percentage')->default(0);
            $table->string('portfolio_url')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('visibility', ['public', 'private', 'connections'])->default('public');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
};
