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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150)->unique() ;
            $table->enum('level', ['básico', 'intermediário', 'avançado']) ;
            $table->string('link_course', 250)->index() ;
            // NULL = Trilha do Sistema | Preenchido = Trilha Customizada do Usuário
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            // Evita que o *mesmo usuário* crie duas trilhas com o mesmo nome
            $table->unique(['user_id', 'name']);
            // $table->foreign('category_id')->constrained('categories')->nullable() ;
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};

