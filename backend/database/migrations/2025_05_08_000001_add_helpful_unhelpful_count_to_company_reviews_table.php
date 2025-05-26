<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('company_reviews', function (Blueprint $table) {
            $table->integer('helpful_count')->default(0);
            $table->integer('unhelpful_count')->default(0);
        });
    }

    public function down()
    {
        Schema::table('company_reviews', function (Blueprint $table) {
            $table->dropColumn('helpful_count');
            $table->dropColumn('unhelpful_count');
        });
    }
};