<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trilha_users', function (Blueprint $table) {
            $table->foreignId('trilhas_id')->constrained('trilhas')->cascadeOnDelete();
            $table->foreignId('users_id')->constrained('users')->cascadeOnDelete();
            $table->enum('progresso', ['Inscrito', 'Cursando', 'Suspenso', 'Concluido'])->default('Inscrito');
            $table->primary(['trilhas_id', 'users_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trilha_users');
    }
};
