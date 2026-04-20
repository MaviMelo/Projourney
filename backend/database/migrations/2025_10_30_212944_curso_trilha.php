<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('curso_trilha', function (Blueprint $table) {
            $table->foreignId('curso_id')->constrained('curso')->cascadeOnDelete();
            $table->foreignId('trilha_id')->constrained('trilha')->cascadeOnDelete();
            $table->primary(['curso_id', 'trilha_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('curso_trilha');
    }
};
