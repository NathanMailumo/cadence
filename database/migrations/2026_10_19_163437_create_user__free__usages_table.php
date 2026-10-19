<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_free_usages', function (Blueprint $table) {
            $table->id();
            $table->string('clerk_id')->unique();
            $table->string('cycle_key')->default('free_pure'); // Used to trigger fresh resets when subscription state changes
            $table->unsignedInteger('collaborative_spaces_used')->default(0); // Max 2
            $table->unsignedInteger('ai_generations_used')->default(0);       // Max 3
            $table->unsignedInteger('pq_uploads_used')->default(0);          // Max 3
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_free_usages');
    }
};
