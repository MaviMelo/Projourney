<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        Course::firstOrCreate([
            'name' => 'PHP',
            'level' => 'básico',
            'link_course' => 'https://www.cursoemvideo.com/curso/php-basico/',
        ]);

        Course::firstOrCreate([
            'name' => 'C#',
            'level' => 'intermediário',
            'link_course' => 'https://learn.microsoft.com/pt-br/training/paths/get-started-c-sharp-part-1/',
        ]);

        Course::firstOrCreate([
            'name' => 'Go',
            'level' => 'avançado',
            'link_course' => 'https://go.dev/doc/',
        ]);

        Course::create([
            'name' => 'Curso Teste (p/ deletar)',
            'level' => 'básico',
            'link_course' => 'https://127.0.0.1:80',
        ]);
    }
}


/* 
(7,'Java','Basico','https://www.cursoemvideo.com/curso/java-basico/'),
(9,'C++','Intermediario','https://www.udemy.com/course/cplusplus-intermediario/'),
(11,'TypeScript.','Avançado','https://www.cursou.com.br/informatica/programacao/typescript/'),

(10,'PHP','Basico','https://www.cursoemvideo.com/curso/php-basico/'),

(8,'C#','Intermediario','https://learn.microsoft.com/pt-br/training/paths/get-started-c-sharp-part-1/'),


(12,'Go','Avançado','https://go.dev/doc/')
*/