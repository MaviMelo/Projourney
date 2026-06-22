<?php

namespace Database\Seeders;

use App\Models\TrailCourse;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TrailCourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TrailCourse::firstOrCreate([
            'trail_id' => '2',
            'course_id' => '1',
        ]);
        TrailCourse::firstOrCreate([
            'trail_id' => '2',
            'course_id' => '2',
        ]);
        TrailCourse::firstOrCreate([
            'trail_id' => '2',
            'course_id' => '4',
        ]);
        TrailCourse::firstOrCreate([
            'trail_id' => '3',
            'course_id' => '2',
        ]);
        TrailCourse::firstOrCreate([
            'trail_id' => '3',
            'course_id' => '4',
        ]);
        TrailCourse::firstOrCreate([
            'trail_id' => '4',
            'course_id' => '4',
        ]);
        TrailCourse::firstOrCreate([
            'trail_id' => '4',
            'course_id' => '1',
        ]);
        TrailCourse::firstOrCreate([
            'trail_id' => '5',
            'course_id' => '4',
        ]);
        TrailCourse::firstOrCreate([
            'trail_id' => '5',
            'course_id' => '1',
        ]);


    }
}
