<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'level',
        'link_course',
        'user_id',
    ];

    protected $casts = [
        'level' => 'string',
        'user_id' => 'integer',
    ];

    // Atributos dinâmicos incluídos na serialização JSON
    protected $appends = ['is_custom'];

    /**
     * Define se o curso foi criado por um usuário ou pelo sistema
     */
    public function getIsCustomAttribute(): bool
    {
        return !is_null($this->user_id);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function trails()
    {
        return $this->belongsToMany(Trail::class, 'trail_courses', 'course_id', 'trail_id')
                    ->withPivot('id');
    }
}
