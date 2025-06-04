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
        Schema::table('job_listings', function (Blueprint $table) {
            // Add missing fields to match frontend interface
            
            // Change existing columns to match frontend naming
            if (Schema::hasColumn('job_listings', 'is_remote')) {
                $table->renameColumn('is_remote', 'is_remote_friendly');
            } else {
                $table->boolean('is_remote_friendly')->default(false);
            }
            
            if (Schema::hasColumn('job_listings', 'type')) {
                $table->renameColumn('type', 'job_type');
            } else {
                $table->enum('job_type', ['full-time', 'part-time', 'contract', 'internship', 'freelance'])->default('full-time');
            }
            
            if (Schema::hasColumn('job_listings', 'salary_currency')) {
                $table->renameColumn('salary_currency', 'currency');
            } else {
                $table->string('currency', 3)->default('INR');
            }
            
            // Add missing fields
            if (!Schema::hasColumn('job_listings', 'location_type')) {
                $table->enum('location_type', ['remote', 'hybrid', 'onsite'])->default('onsite');
            }
            
            if (!Schema::hasColumn('job_listings', 'required_skills')) {
                $table->json('required_skills')->nullable();
            }
            
            if (!Schema::hasColumn('job_listings', 'preferred_skills')) {
                $table->json('preferred_skills')->nullable();
            }
            
            if (!Schema::hasColumn('job_listings', 'start_date')) {
                $table->date('start_date')->nullable();
            }
            
            if (!Schema::hasColumn('job_listings', 'featured')) {
                $table->boolean('featured')->default(false);
            }
            
            if (!Schema::hasColumn('job_listings', 'urgent')) {
                $table->boolean('urgent')->default(false);
            }
            
            if (!Schema::hasColumn('job_listings', 'category_id')) {
                $table->unsignedBigInteger('category_id')->nullable();
                $table->foreign('category_id')->references('id')->on('job_categories')->onDelete('set null');
            }
            
            if (!Schema::hasColumn('job_listings', 'published_at')) {
                $table->timestamp('published_at')->nullable();
            }
            
            if (!Schema::hasColumn('job_listings', 'expires_at')) {
                $table->timestamp('expires_at')->nullable();
            }
            
            // Update existing columns for better defaults
            if (Schema::hasColumn('job_listings', 'currency')) {
                $table->string('currency', 3)->default('INR')->change();
            }
            
            // Add indexes for better performance
            $table->index(['status']);
            $table->index(['job_type']);
            $table->index(['location_type']);
            $table->index(['experience_level']);
            $table->index(['featured']);
            $table->index(['urgent']);
            $table->index(['currency']);
            $table->index(['published_at']);
            $table->index(['expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_listings', function (Blueprint $table) {
            // Remove indexes
            $table->dropIndex(['status']);
            $table->dropIndex(['job_type']);
            $table->dropIndex(['location_type']);
            $table->dropIndex(['experience_level']);
            $table->dropIndex(['featured']);
            $table->dropIndex(['urgent']);
            $table->dropIndex(['currency']);
            $table->dropIndex(['published_at']);
            $table->dropIndex(['expires_at']);
            
            // Drop foreign key and column
            if (Schema::hasColumn('job_listings', 'category_id')) {
                $table->dropForeign(['category_id']);
                $table->dropColumn('category_id');
            }
            
            // Drop added columns
            $table->dropColumn([
                'location_type',
                'required_skills',
                'preferred_skills',
                'start_date',
                'featured',
                'urgent',
                'published_at',
                'expires_at'
            ]);
            
            // Revert column renames
            if (Schema::hasColumn('job_listings', 'is_remote_friendly')) {
                $table->renameColumn('is_remote_friendly', 'is_remote');
            }
            
            if (Schema::hasColumn('job_listings', 'job_type')) {
                $table->renameColumn('job_type', 'type');
            }
            
            if (Schema::hasColumn('job_listings', 'currency')) {
                $table->renameColumn('currency', 'salary_currency');
            }
        });
    }
};
