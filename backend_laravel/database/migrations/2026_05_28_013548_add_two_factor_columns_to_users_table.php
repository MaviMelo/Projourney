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
        $tableName = 'users';

        $columnsToCheck = [
            'two_factor_secret',
            'two_factor_recovery_codes',
            'two_factor_confirmed_at',
        ];

        foreach ($columnsToCheck as $column) {
            if (Schema::hasTable($tableName) && !Schema::hasColumn($tableName, $column)) {

                Schema::table('users', function (Blueprint $table)  use ($column) {
                    $table->text($column)
                        ->after('password')
                        ->nullable();
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = 'users';
        $columnsToCheck = [
            'two_factor_secret',
            'two_factor_recovery_codes',
            'two_factor_confirmed_at',
        ];

        foreach ($columnsToCheck as $column) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, $column)) {
                Schema::table($tableName, function (Blueprint $table) use ($column) {
                    $table->dropColumn($column);
                });
            }
        }
    }
};
