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
        Schema::table('experiences', function (Blueprint $table) {
            // Make company_name column nullable
            if (Schema::hasColumn('experiences', 'company_name')) {
                $table->string('company_name')->nullable()->change();
            }
            
            // Update existing records that have null company_name
            DB::statement('UPDATE experiences SET company_name = company WHERE company_name IS NULL AND company IS NOT NULL');
            
            // Set a default value for company_name
            if (Schema::hasColumn('experiences', 'company_name')) {
                $table->string('company_name')->nullable(false)->default('')->change();
            }
        });
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
