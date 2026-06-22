<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CourseSeeder::class, 
            TrailSeeder::class,
            TrailCourseSeeder::class,
        ]);

        User::factory()->root()->create([
            'name' => 'Administrador Root',
            'email' => 'root@email.com',
            'password' => Hash::make('root1234567890'),
        ]);

        User::factory()->admin()->create([
            'name' => 'Administrador 01',
            'email' => 'adm@email.com',
            'password' => Hash::make('adm1234567890'),
        ]);

        User::factory(2)->admin()->create();

        User::factory(35)->create();
    }
}
