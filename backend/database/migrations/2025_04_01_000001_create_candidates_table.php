<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */    public function up(): void
    {
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('headline')->nullable();
            $table->string('location')->nullable();
            $table->text('about')->nullable();
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('resume_url')->nullable();
            $table->string('profile_picture')->nullable();
            $table->string('cover_image')->nullable();
            $table->integer('profile_completed_percentage')->default(0);
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
