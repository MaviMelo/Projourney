<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users_experiencia', function (Blueprint $table) {
            $table->foreignId('experiencias_id')->constrained('experiencia')->cascadeOnDelete();
            $table->foreignId('users_id')->constrained('users')->cascadeOnDelete();
            $table->primary(['experiencias_id', 'users_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users_experiencia');
    }
};
