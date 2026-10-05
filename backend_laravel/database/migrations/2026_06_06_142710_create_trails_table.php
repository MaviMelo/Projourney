<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trails', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            // NULL = Trilha do Sistema | Preenchido = Trilha Customizada do Usuário
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            // Evita que o *mesmo usuário* crie duas trilhas com o mesmo nome
            $table->unique(['user_id', 'name']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trails');
    }
};
