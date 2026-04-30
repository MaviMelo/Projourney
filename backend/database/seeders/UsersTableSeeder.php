<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            'id' => 1,
            'nome' => 'admin',
            'email' => 'admin@gmail.com',
            'senha' => '$argon2id$v=19$m=65536,t=4,p=1$1KAOOnHG1L2dpqOaV9Wdpw$JBasxz0RhKgyYR7YllvIhSRmwF/GF0MO+l/Uny6qcwg',
            'tipo' => 'user',
            'data_nascimento' => null,
            'telefone' => '',
            'created_at' => '2026-03-14 20:03:07',
            'updated_at' => '2026-03-14 20:03:07',
        ]);
    }
}
