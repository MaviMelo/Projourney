<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\TrailController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::inertia('/register', 'register')->name('register');
    
    Route::inertia('dashboard', 'dashboard')->name('dashboard'); 
    // Route::get('user', [UserController::class, 'index'])->name('dashboard');

    Route::get('colaboradores', [UserController::class, 'indexCollaborators'])->name('user.indexCollaborators');
    // Route::get('/dashboard/cursos', [CourseController::class, 'index'])->name('course.index');
    // Route::get('/dashboard/cadastrar-usuario', [UserController::class, 'create'])->name('user.create');

    // rotas específicas para cursos e trilhas no dashboard:
    // Route::get('/dashboard/cursos', [CourseController::class, 'indexDashboard'])->name('course.indexDashboard');

    Route::resources([
        'user' => UserController::class,
        'course' => CourseController::class,
        'trail' => TrailController::class,
    ]);
});


require __DIR__ . '/settings.php';
