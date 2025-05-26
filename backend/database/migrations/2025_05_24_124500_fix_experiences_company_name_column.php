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
        // Make sure company_name has a default value
        Schema::table('experiences', function (Blueprint $table) {
            // First, check if the column exists
            if (Schema::hasColumn('experiences', 'company_name')) {
                // For existing rows, set company_name = company if it's NULL
                DB::statement('UPDATE experiences SET company_name = company WHERE company_name IS NULL AND company IS NOT NULL');
                
                // Then modify the column to have a default
                $table->string('company_name')->nullable(false)->default('')->change();
            }
        });
        
        // Update all existing records to ensure they have a company_name value
        if (Schema::hasColumn('experiences', 'company') && Schema::hasColumn('experiences', 'company_name')) {
            DB::statement('UPDATE experiences SET company_name = company WHERE company_name IS NULL OR company_name = ""');
            DB::statement('UPDATE experiences SET company = company_name WHERE company IS NULL OR company = ""');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('experiences', function (Blueprint $table) {
            if (Schema::hasColumn('experiences', 'company_name')) {
                $table->string('company_name')->nullable()->change();
            }
        });
    }
};
