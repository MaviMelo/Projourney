<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name', 'user_id'])]
#[Hidden(['created_at', 'updated_at'])]
class Trail extends Model
{
    protected $table = 'trails';

    // Relação para saber quem criou a trilha (nulo se for trilha do sistema)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'trail_courses', 'trail_id', 'course_id')->withPivot('id');
    }

    // Scopes úteis para filtrar
    public function scopeSystem($query)
    {
        return $query->whereNull('user_id');
    }

    public function scopeCustomForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
