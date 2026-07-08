<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['trail_id', 'user_id', 'progress'])]

class TrailUser extends Model
{
    protected $table='user_trails';

    public function trails() {
        return $this->belongsTo(Trail::class, 'trail_id');
    }
    public function users() {
        return $this->belongsTo(User::class, 'user_id');
    }
}
