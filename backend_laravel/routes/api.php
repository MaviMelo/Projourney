<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\TrailController;
use App\Http\Controllers\Api\V1\TrailUserController;
use App\Http\Controllers\Api\V1\CourseController;
use Illuminate\Routing\ResolvesRouteDependencies;
use App\Http\Controllers\RatingController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->name('api.')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/fullLogout', [AuthController::class, 'fullLogout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    Route::apiResources([
        'trail' => TrailController::class,
        'course' => CourseController::class,
        'trailUser' => TrailUserController::class,
    ]);

    // Rotas de rating integradas no grupo autenticado e com o prefixo /api correto
    Route::get('/items/{Courseid}/ratings', [RatingController::class, 'show']);
    Route::post('/ratings', [RatingController::class, 'store']);
});
