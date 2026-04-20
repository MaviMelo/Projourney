<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Trilha extends Model
{
    use HasFactory;

    protected $fillable = ['nome'];
}
