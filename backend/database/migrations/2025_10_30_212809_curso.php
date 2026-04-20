<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('curso', function (Blueprint $table) {
            $table->id();
            $table->enum('nivel', ['Basico', 'Intermediario', 'Avançado'])->default('basico');
            $table->String('link_curso');
            $table->string('nome', 150);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('curso');
    }
};
