<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
// use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'birth_date', 'phone', 'role'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token', 'created_at', 'updated_at'])]

class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable, HasApiTokens;

    /**
     * Boot do Model para registrar eventos automáticos (como a criação da trilha padrão).
     */
        protected static function booted()
        {
            static::created(function (User $user) {
                // 1. Cria a trilha definindo o user_id (dono da trilha)
                $trail = Trail::create([
                    'name'    => 'Minha Trilha Personalizada',
                    'user_id' => $user->id,
                ]);

                // 2. Vincula a trilha ao usuário na tabela pivô (user_trails)
                $user->trails()->attach($trail->id, [
                    'progress' => 'Inscrito'
                ]);
            });
        }
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    // app/Models/User.php
    public function trails()
    {
        return $this->belongsToMany(Trail::class, 'user_trails')
                    ->withPivot('id', 'progress')
                    ->withTimestamps();
    }

    public function courses()
    {
        return $this->hasMany(Course::class);
    }
}

