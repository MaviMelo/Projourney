<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Trilha extends Model
{
    use HasFactory;

    protected $fillable = ['nome'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'trilha_users', 'users_id', 'trilhas_id')
            ->withPivot('progresso')
            ->withTimestamps();
    }
}
