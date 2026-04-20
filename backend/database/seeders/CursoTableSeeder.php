<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CursoTableSeeder extends Seeder
{
    public function run()
    {
        // Cursos
        DB::table('curso')->insert([
            ['id' => 5, 'nome' => 'Python', 'nivel' => 'Basico', 'link_curso' => 'https://www.ev.org.br/cursos/linguagem-de-programacao-python-basico'],
            ['id' => 6, 'nome' => 'JavaScript', 'nivel' => 'Basico', 'link_curso' => 'https://www.betrybe.com/curso-de-programacao-javascript-do-zero'],
            ['id' => 7, 'nome' => 'Java', 'nivel' => 'Basico', 'link_curso' => 'https://www.cursoemvideo.com/curso/java-basico/'],
            ['id' => 8, 'nome' => 'C#', 'nivel' => 'Intermediario', 'link_curso' => 'https://learn.microsoft.com/pt-br/training/paths/get-started-c-sharp-part-1/'],
            ['id' => 9, 'nome' => 'C++', 'nivel' => 'Intermediario', 'link_curso' => 'https://www.udemy.com/course/cplusplus-intermediario/'],
            ['id' => 10, 'nome' => 'PHP', 'nivel' => 'Basico', 'link_curso' => 'https://www.cursoemvideo.com/curso/php-basico/'],
            ['id' => 11, 'nome' => 'TypeScript.', 'nivel' => 'Avançado', 'link_curso' => 'https://www.cursou.com.br/informatica/programacao/typescript/'],
            ['id' => 12, 'nome' => 'Go', 'nivel' => 'Avançado', 'link_curso' => 'https://go.dev/doc/'],
            ['id' => 13, 'nome' => 'Rust', 'nivel' => 'Basico', 'link_curso' => 'https://labex.io/pt/courses/quick-start-with-rust'],
            ['id' => 14, 'nome' => 'Swift', 'nivel' => 'Basico', 'link_curso' => 'https://www.cursou.com.br/informatica/programacao/swift/#player'],
            ['id' => 15, 'nome' => 'Ruby', 'nivel' => 'Intermediario', 'link_curso' => 'https://www.cursou.com.br/informatica/ruby/'],
            ['id' => 16, 'nome' => 'C', 'nivel' => 'Basico', 'link_curso' => 'https://www.realizzarecursos.com.br/cursos/curso-de-linguagem-c-gratuito/'],
            ['id' => 17, 'nome' => 'Lua', 'nivel' => 'Basico', 'link_curso' => 'https://www.cursou.com.br/informatica/programacao/programacao-lua/'],
            ['id' => 18, 'nome' => 'HTML / CSS', 'nivel' => 'Intermediario', 'link_curso' => 'https://www.ev.org.br/cursos/crie-um-site-simples-usando-html-css-e-javascript'],
            ['id' => 19, 'nome' => 'SQL', 'nivel' => 'Intermediario', 'link_curso' => 'https://www.ev.org.br/cursos/implementando-banco-de-dados'],
            ['id' => 20, 'nome' => 'Git / GitHub', 'nivel' => 'Basico', 'link_curso' => 'https://www.cursoemvideo.com/curso/curso-de-git-e-github/'],
            ['id' => 21, 'nome' => 'Docker', 'nivel' => 'Basico', 'link_curso' => 'https://www.udemy.com/pt/topic/docker/free/'],
            ['id' => 22, 'nome' => 'Bash', 'nivel' => 'Basico', 'link_curso' => 'https://cursa.app/pt/curso-gratuito/shell-script-bbbh'],
            ['id' => 23, 'nome' => 'PowerShell', 'nivel' => 'Basico', 'link_curso' => 'https://www.cursou.com.br/informatica/windows-powershell/'],
        ]);

        // Pivot curso_trilha
        DB::table('curso_trilha')->insert([
            ['curso_id' => 6, 'trilha_id' => 2],
            [11, 2],
            [18, 2],
            [20, 2],
            [5, 3],
            [6, 3],
            [7, 3],
            [8, 3],
            [10, 3],
            [12, 3],
            [15, 3],
            [19, 3],
            [20, 3],
            [21, 3],
            [22, 3],
            [23, 3],
            [6, 4],
            [7, 4],
            [8, 4],
            [14, 4],
            [20, 4],
            [5, 5],
            [6, 5],
            [11, 5],
            [18, 5],
            [19, 5],
            [20, 5],
            [21, 5],
            [22, 5],
            [23, 5],
            [5, 6],
            [19, 6],
            [20, 6],
            [5, 7],
            [12, 7],
            [20, 7],
            [21, 7],
            [22, 7],
            [23, 7],
            [5, 8],
            [7, 8],
            [9, 8],
            [17, 8],
            [5, 9],
            [6, 9],
            [9, 9],
            [16, 9],
            [19, 9],
            [22, 9],
            [23, 9],
        ]);
    }
}
