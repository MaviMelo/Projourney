<?php

namespace Database\Seeders;

use App\Models\Trail;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TrailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Trail::create([
            'name' => 'Trilha Teste (p/ deletar)',
        ]);

        Trail::firstOrCreate([
            'name' => 'Desenvolvimento Mobile',
        ]);

        Trail::insert([
            ['name' => 'Desenvolvimento Backend'],
            ['name' => 'Desenvolvimento Full Stack'],
            ['name' => 'Interconexão e Serviços de Redes (ISR)'],

        ]);
    }
}
