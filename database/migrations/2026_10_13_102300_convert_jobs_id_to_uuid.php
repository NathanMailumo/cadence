<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE jobs MODIFY id CHAR(36) NOT NULL DEFAULT (UUID())");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE jobs MODIFY id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT');
    }
};
