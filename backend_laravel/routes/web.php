<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\TrailController;
use App\Http\Controllers\TrailCourseController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

// Route::prefix('ui')->name('ui.')->group(function () {    });

    Route::inertia('/', 'welcome')->name('home');

    Route::middleware(['auth', 'verified', 'admin'])->group(function () {

        Route::inertia('/register', 'register')->name('register');

        Route::inertia('dashboard', 'dashboard')->name('dashboard');

        Route::get('colaboradores', [UserController::class, 'indexCollaborators'])->name('user.indexCollaborators');

        Route::resources([
            'user' => UserController::class,
            'course' => CourseController::class,
            'trail' => TrailController::class,
            'trailCourse' => TrailCourseController::class,
        ]);

        require __DIR__ . '/settings.php';
    });
