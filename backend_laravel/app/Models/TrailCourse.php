<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['trail_id', 'course_id'])]
class TrailCourse extends Model
{
    protected $table = 'trail_courses';

    public function trail()
    {
        return $this->belongsTo(Trail::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}