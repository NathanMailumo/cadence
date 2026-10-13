<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('resources', function (Blueprint $table) {
            $table->enum('status', ['active', 'deleted'])->default('active')->index();
        });

        Schema::table('resource_users', function (Blueprint $table) {
            $table->enum('lifecycle_status', ['active', 'deleted'])
                ->default('active')
                ->index();
        });

        Schema::table('study_sessions', function (Blueprint $table) {
            $table->enum('status', ['active', 'deleted'])->default('active')->index();
        });

        Schema::table('session_outputs', function (Blueprint $table) {
            $table->enum('status', ['active', 'deleted'])->default('active')->index();
        });

        Schema::table('session_files', function (Blueprint $table) {
            $table->enum('status', ['active', 'deleted'])->default('active')->index();
        });

        DB::statement("ALTER TABLE resource_items MODIFY status ENUM('active', 'notActive', 'deleted') NOT NULL DEFAULT 'active'");
    }

    public function down(): void
    {
        DB::table('resource_items')
            ->where('status', 'deleted')
            ->update(['status' => 'notActive']);
        DB::statement("ALTER TABLE resource_items MODIFY status ENUM('active', 'notActive') NOT NULL DEFAULT 'active'");

        Schema::table('session_files', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('session_outputs', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('study_sessions', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('resource_users', function (Blueprint $table) {
            $table->dropColumn('lifecycle_status');
        });

        Schema::table('resources', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
