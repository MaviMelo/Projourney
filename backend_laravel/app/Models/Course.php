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
        'user_id',
    ];

    protected $casts = [
        'level' => 'string',
        // 'created_at' => 'datetime',
        // 'updated_at' => 'datetime',
        // 'deleted_at' => 'datetime',
    ];

    protected $dates = ['deleted_at'];

    /**
     * Relacionamento com o usuário criador (caso seja um curso personalizado do usuário).
     * Se user_id for null, o curso pertence ao sistema.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relacionamento com a tabela Trail (Many-to-Many)
    public function trails()
    {
        return $this->belongsToMany(Trail::class, 'trail_courses', 'course_id', 'trail_id');
    }
}
