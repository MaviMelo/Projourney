<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'level',
        'link_course',
    ];

    protected $casts = [
        'level' => 'string',
        // 'created_at' => 'datetime',
        // 'updated_at' => 'datetime',
        // 'deleted_at' => 'datetime',
    ];

    protected $dates = ['deleted_at'];

    // Relacionamento com a tabela Trail (se houver relação many-to-many)
    public function trails()
    {
        return $this->belongsToMany(Trail::class);
    }
}
