<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;


#[Fillable(['name'])]
#[Hidden(['created_at', 'updated_at'])]

class Trail extends Model
{
    protected $table = 'trails';

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'trail_courses', 'trail_id', 'course_id')->withPivot('id');
    }
}
