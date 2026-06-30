<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['trail_id', 'user_id'])]

class TrailUser extends Model
{
    protected $table='user_trails';

    public function trails() {
        return $this->belongsToMany(Trail::class, 'trails', 'id');
    }
    public function users() {
        return $this->belongsToMany(User::class, 'users', 'id');
    }
}
