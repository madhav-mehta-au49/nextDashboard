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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('industry');
            $table->string('size');
            $table->integer('founded')->nullable();
            $table->string('website');
            $table->string('headquarters');
            $table->string('logo_url')->nullable();
            $table->string('cover_image_url')->nullable();
            $table->integer('employees')->default(0);
            $table->integer('followers')->default(0);
            $table->boolean('verified')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
