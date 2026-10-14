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
        Schema::create('resource_users', function (Blueprint $table) {
            $table->string('clerk_id');
            $table->foreign('clerk_id')->references('clerk_id')->on('users')->cascadeOnDelete();
            $table->foreignUuid('resource_id')->constrained()->cascadeOnDelete();
            $table->enum('role', ['owner', 'viewer'])->default('viewer');
            $table->enum('status', ['pending', 'accepted', 'declined'])->default('pending');
            // $table->string('lifecycle_status')->default('active');
            $table->timestamps();

            // Composite primary key prevents duplicate invites and eliminates need for separate UUID id
            $table->primary(['resource_id', 'clerk_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invites');
    }
};
