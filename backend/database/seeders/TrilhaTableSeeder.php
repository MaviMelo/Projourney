<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TrilhaTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('trilha')->insert([
            ['id' => 2, 'nome' => 'Desenvolvimento Frontend'],
            ['id' => 3, 'nome' => 'Desenvolvimento Backend'],
            ['id' => 4, 'nome' => 'Desenvolvimento Mobile'],
            ['id' => 5, 'nome' => 'Desenvolvimento Full Stack'],
            ['id' => 6, 'nome' => 'Ciência de Dados'],
            ['id' => 7, 'nome' => 'DevOps e Cloud'],
            ['id' => 8, 'nome' => 'Inteligência Artificial'],
            ['id' => 9, 'nome' => 'Segurança da Informação'],
        ]);
    }
}
